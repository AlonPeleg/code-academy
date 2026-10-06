---
title: "Step 5: History and commands"
summary: "Record the conversation in a list and add /history, /reset and /help with a dictionary of functions."
level: intermediate
runner: python
stdin: |
  hello
  /history
  my name is ada
  i like chess
  how are you
  /history
  /dance
  /reset
  what is my name
  /history
  /help
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 5: conversation history and slash commands.

      # Each intent has example sentences (patterns) and a reply.
      INTENTS = {
          "greeting": {
              "patterns": ["hello", "hi there", "hey bot", "good morning"],
              "reply": "Hello, {name}! Nice to meet you.",
          },
          "how_are_you": {
              "patterns": ["how are you", "how is it going", "how do you feel"],
              "reply": "I am doing great, thanks for asking!",
          },
          "bot_name": {
              "patterns": ["what is your name", "who are you"],
              "reply": "I am PyBot, a tiny chatbot written in Python.",
          },
          "weather": {
              "patterns": ["how is the weather", "is it raining", "what is the weather like"],
              "reply": "I hear it is sunny somewhere.",
          },
          "help": {
              "patterns": ["what can you do", "help me", "i need help"],
              "reply": "Try: my name is ..., i like ..., how are you, what is the weather like.",
          },
          "thanks": {
              "patterns": ["thanks", "thank you"],
              "reply": "You are welcome, {name}!",
          },
      }
      FALLBACK = "Hmm, I am not sure I understood. Say help to see what I can do."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      DEBUG = True      # TODO 1: switch this to False now that the scoring works. It prints the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary.
      state = {"name": None, "facts": []}
      # TODO 2: add history = [] and fill it with ("You", text) and ("Bot", reply) pairs in respond().


      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      def clean_words(text):
          # "What's the Weather?" -> ["what's", "the", "weather"]
          return [word.strip(".,!?;:") for word in text.lower().split()]


      def learn(text):
          """Look for something to remember. Return a reply, or None when there is nothing to learn."""
          sentence = " ".join(clean_words(text))
          if sentence.startswith("my name is "):
              state["name"] = sentence[len("my name is "):].title()
              return "Nice to meet you, " + state["name"] + "!"
          if sentence.startswith("i like "):
              thing = sentence[len("i like "):]
              state["facts"].append(thing)
              return "Noted: you like " + thing + "."
          if sentence == "what is my name":
              if state["name"]:
                  return "Your name is " + state["name"] + "."
              return "You have not told me your name yet."
          if sentence == "what do you know about me":
              if not state["name"] and not state["facts"]:
                  return "Nothing yet. Tell me your name or what you like."
              parts = []
              if state["name"]:
                  parts.append("Your name is " + state["name"] + ".")
              if state["facts"]:
                  parts.append("You like " + " and ".join(state["facts"]) + ".")
              return " ".join(parts)
          return None


      def similarity(words_a, words_b):
          """Word overlap between two sets: shared words divided by all different words (0.0 to 1.0)."""
          if not words_a or not words_b:
              return 0.0
          return len(words_a & words_b) / len(words_a | words_b)


      def classify(text):
          """Return (intent name, score) of the best matching intent."""
          user_words = set(clean_words(text))
          best_intent = None
          best_score = 0.0
          for name, intent in INTENTS.items():
              for pattern in intent["patterns"]:
                  score = similarity(user_words, set(pattern.split()))
                  if score > best_score:
                      best_intent = name
                      best_score = score
          return best_intent, best_score


      def find_reply(text):
          intent, score = classify(text)
          if DEBUG:
              print("   [intent=" + str(intent) + " score=" + format(score, ".2f") + "]")
          if score < THRESHOLD:
              return FALLBACK
          return INTENTS[intent]["reply"].format(name=state["name"] or "friend")


      # TODO 3: write show_help(), show_history() and reset(). Each RETURNS its reply text:
      #   show_help():    "Commands: /history shows our conversation, /reset forgets everything, /help shows this list."
      #   show_history(): "We have not talked yet." for an empty history, otherwise "Conversation so far:" followed by
      #                   one line per entry, numbered from 1 (enumerate): "1. You: hello" joined with "\n"
      #   reset():        clears name, facts and history and returns "Memory cleared. Nice to meet you again!"
      # TODO 4: build COMMANDS = {"/help": show_help, "/history": show_history, "/reset": reset}
      #         and run_command(text): None when text does not start with "/", "Unknown command <text>. Try /help."
      #         for unknown commands, otherwise the result of the command function.
      # TODO 5: in respond(), run commands first (they are not saved in the history).

      def respond(text):
          return learn(text) or find_reply(text)


      print("Bot: Hi! Tell me your name. Type /help for commands, bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye, " + (state["name"] or "friend") + "!")
              break
          print("Bot: " + respond(text))
check:
  output: |
    Bot: Hi! Tell me your name. Type /help for commands, bye to leave.
    You: hello
    Bot: Hello, friend! Nice to meet you.
    You: /history
    Bot: Conversation so far:
    1. You: hello
    2. Bot: Hello, friend! Nice to meet you.
    You: my name is ada
    Bot: Nice to meet you, Ada!
    You: i like chess
    Bot: Noted: you like chess.
    You: how are you
    Bot: I am doing great, thanks for asking!
    You: /history
    Bot: Conversation so far:
    1. You: hello
    2. Bot: Hello, friend! Nice to meet you.
    3. You: my name is ada
    4. Bot: Nice to meet you, Ada!
    5. You: i like chess
    6. Bot: Noted: you like chess.
    7. You: how are you
    8. Bot: I am doing great, thanks for asking!
    You: /dance
    Bot: Unknown command /dance. Try /help.
    You: /reset
    Bot: Memory cleared. Nice to meet you again!
    You: what is my name
    Bot: You have not told me your name yet.
    You: /history
    Bot: Conversation so far:
    1. You: what is my name
    2. Bot: You have not told me your name yet.
    You: /help
    Bot: Commands: /history shows our conversation, /reset forgets everything, /help shows this list.
    You: bye
    Bot: Goodbye, friend!
  code:
    - { pattern: "history\\s*=\\s*\\[\\s*\\]", message: "Keep the conversation in a list named history." }
    - { pattern: "enumerate\\s*\\(", message: "Number the history lines with enumerate()." }
    - { pattern: "COMMANDS\\s*=\\s*\\{", message: "Build a COMMANDS dictionary of command name -> function." }
    - { pattern: "startswith\\s*\\(\\s*[\"']/", message: "Detect commands with text.startswith(\"/\")." }
hints:
  - "A command is a message that starts with \"/\". Check that first, before learn() and the intents. Commands are functions, and functions can be stored as values of a dictionary."
  - "COMMANDS = {\"/help\": show_help, \"/history\": show_history, \"/reset\": reset}. run_command: if not text.startswith(\"/\"): return None; command = COMMANDS.get(text.lower()); if command is None: return an unknown-command reply; return command()."
  - "history = []   for number, (speaker, text) in enumerate(history, start=1): lines.append(str(number) + \". \" + speaker + \": \" + text)   def respond(text): reply = run_command(text); if reply is not None: return reply; reply = learn(text) or find_reply(text); history.append((\"You\", text)); history.append((\"Bot\", reply)); return reply"
solution:
  - name: main.py
    code: |
      # Chatbot, step 5: conversation history and slash commands.

      # Each intent has example sentences (patterns) and a reply.
      INTENTS = {
          "greeting": {
              "patterns": ["hello", "hi there", "hey bot", "good morning"],
              "reply": "Hello, {name}! Nice to meet you.",
          },
          "how_are_you": {
              "patterns": ["how are you", "how is it going", "how do you feel"],
              "reply": "I am doing great, thanks for asking!",
          },
          "bot_name": {
              "patterns": ["what is your name", "who are you"],
              "reply": "I am PyBot, a tiny chatbot written in Python.",
          },
          "weather": {
              "patterns": ["how is the weather", "is it raining", "what is the weather like"],
              "reply": "I hear it is sunny somewhere.",
          },
          "help": {
              "patterns": ["what can you do", "help me", "i need help"],
              "reply": "Try: my name is ..., i like ..., how are you, what is the weather like.",
          },
          "thanks": {
              "patterns": ["thanks", "thank you"],
              "reply": "You are welcome, {name}!",
          },
      }
      FALLBACK = "Hmm, I am not sure I understood. Say help to see what I can do."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      DEBUG = False     # set to True to print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary, the conversation in a list of (speaker, text) pairs.
      state = {"name": None, "facts": []}
      history = []


      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      def clean_words(text):
          # "What's the Weather?" -> ["what's", "the", "weather"]
          return [word.strip(".,!?;:") for word in text.lower().split()]


      def learn(text):
          """Look for something to remember. Return a reply, or None when there is nothing to learn."""
          sentence = " ".join(clean_words(text))
          if sentence.startswith("my name is "):
              state["name"] = sentence[len("my name is "):].title()
              return "Nice to meet you, " + state["name"] + "!"
          if sentence.startswith("i like "):
              thing = sentence[len("i like "):]
              state["facts"].append(thing)
              return "Noted: you like " + thing + "."
          if sentence == "what is my name":
              if state["name"]:
                  return "Your name is " + state["name"] + "."
              return "You have not told me your name yet."
          if sentence == "what do you know about me":
              if not state["name"] and not state["facts"]:
                  return "Nothing yet. Tell me your name or what you like."
              parts = []
              if state["name"]:
                  parts.append("Your name is " + state["name"] + ".")
              if state["facts"]:
                  parts.append("You like " + " and ".join(state["facts"]) + ".")
              return " ".join(parts)
          return None


      def similarity(words_a, words_b):
          """Word overlap between two sets: shared words divided by all different words (0.0 to 1.0)."""
          if not words_a or not words_b:
              return 0.0
          return len(words_a & words_b) / len(words_a | words_b)


      def classify(text):
          """Return (intent name, score) of the best matching intent."""
          user_words = set(clean_words(text))
          best_intent = None
          best_score = 0.0
          for name, intent in INTENTS.items():
              for pattern in intent["patterns"]:
                  score = similarity(user_words, set(pattern.split()))
                  if score > best_score:
                      best_intent = name
                      best_score = score
          return best_intent, best_score


      def find_reply(text):
          intent, score = classify(text)
          if DEBUG:
              print("   [intent=" + str(intent) + " score=" + format(score, ".2f") + "]")
          if score < THRESHOLD:
              return FALLBACK
          return INTENTS[intent]["reply"].format(name=state["name"] or "friend")


      def show_help():
          return "Commands: /history shows our conversation, /reset forgets everything, /help shows this list."


      def show_history():
          if not history:
              return "We have not talked yet."
          lines = ["Conversation so far:"]
          for number, (speaker, text) in enumerate(history, start=1):
              lines.append(str(number) + ". " + speaker + ": " + text)
          return "\n".join(lines)


      def reset():
          state["name"] = None
          state["facts"].clear()
          history.clear()
          return "Memory cleared. Nice to meet you again!"


      COMMANDS = {"/help": show_help, "/history": show_history, "/reset": reset}


      def run_command(text):
          """Run a slash command. Return its reply, or None when text is not a command."""
          if not text.startswith("/"):
              return None
          command = COMMANDS.get(text.lower())
          if command is None:
              return "Unknown command " + text + ". Try /help."
          return command()


      def respond(text):
          reply = run_command(text)
          if reply is not None:
              return reply          # commands are not part of the conversation history
          reply = learn(text) or find_reply(text)
          history.append(("You", text))
          history.append(("Bot", reply))
          return reply


      print("Bot: Hi! Tell me your name. Type /help for commands, bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye, " + (state["name"] or "friend") + "!")
              break
          print("Bot: " + respond(text))
quiz:
  - q: "What does COMMANDS.get(\"/dance\") return when \"/dance\" is not a key?"
    options: ["An error (KeyError)", "None", "\"\""]
    answer: 1
    explain: "dict.get returns None for a missing key, while COMMANDS[\"/dance\"] would raise KeyError."
  - q: "Why call command() with parentheses at the end?"
    options: ["The dictionary stores the function itself, and the parentheses run it", "To print it", "To copy it"]
    answer: 0
  - q: "What does enumerate(history, start=1) give each round?"
    options: ["Only the number", "The item twice", "A pair: the line number (from 1) and the item"]
    answer: 2
---
Chat apps let you scroll back and run special commands like `/help`. In this step the bot records the whole conversation in a **history list** and learns **slash commands** that control the bot itself instead of talking to it.

## Where we are

The bot remembers your name and facts, scores your sentence against intents and admits when its confidence is below the threshold. The `DEBUG` output helped us see the scores, but it clutters the transcript now.

## What we will add, and why

Two things every real bot needs:

* **History.** A list of `(speaker, text)` pairs, so the bot (and you) can look back. Later features, like the report in the last step, build on knowing what was said.
* **Commands.** Messages that start with `/` are instructions: `/history` prints the conversation, `/reset` forgets everything, `/help` lists the commands. Keeping them separate from normal talk avoids a nasty bug: your bot should never try to "understand" `/reset` as small talk.

## Guided walk-through

**1. Turn debugging off.** Set `DEBUG = False`. One constant controls the extra output, which is why we made it a constant.

**2. The history list.** Create `history = []` next to `state`. In `respond`, after the reply is known, append two entries. Each entry is a **tuple**, a fixed pair written with parentheses:

```python
history.append(("You", text))
history.append(("Bot", reply))
```

**3. Number the lines with `enumerate`.** `enumerate(history, start=1)` gives `(1, first_item), (2, second_item)...`, and the loop can unpack the nested pair at the same time:

```python
for number, (speaker, text) in enumerate(history, start=1):
    lines.append(str(number) + ". " + speaker + ": " + text)
return "\n".join(lines)
```

`"\n".join(lines)` glues lines together with a newline between them, so one reply can print as several lines.

**4. Commands are functions in a dictionary.** In Python a function is a value you can store. Notice there are no parentheses after the function names:

```python
COMMANDS = {"/help": show_help, "/history": show_history, "/reset": reset}
```

To run one, look it up and *then* call it:

```python
command = COMMANDS.get(text.lower())
if command is None:
    return "Unknown command " + text + ". Try /help."
return command()
```

`dict.get(key)` returns `None` for a missing key instead of crashing like `COMMANDS[key]` would. Adding a new command later is one new function and one new dictionary entry, no `if/elif` ladder.

**5. Order of checks.** Write `run_command(text)` so that it returns `None` when `text` does not start with `/` (`text.startswith("/")`). Then `respond` can do:

```python
reply = run_command(text)
if reply is not None:
    return reply        # a command: not saved in the history
reply = learn(text) or find_reply(text)
```

Commands are answered first and are **not** stored in the history, so `/history` shows only real conversation.

**6. `/reset`.** It must clear everything: `state["name"] = None`, `state["facts"].clear()` and `history.clear()`. Use `.clear()` on the existing list instead of writing `history = []` inside the function, which would only create a new local variable and leave the real history untouched.

> **Watch out:**
> - `command` vs `command()`: without parentheses nothing runs and the reply prints as `<function show_help at 0x...>`.
> - `TypeError: show_help() takes 0 positional arguments but 1 was given`: your command functions must take no parameters, because `command()` passes none.
> - `UnboundLocalError: cannot access local variable 'history' where it is not associated with a value` appears when you assign `history = []` inside a function. Mutate the list with `.append` and `.clear` instead.
> - Saving the command messages in history makes `/history` list itself.

> **Your turn:** turn `DEBUG` off, add `history`, write `show_help()`, `show_history()` and `reset()` (each returns its text), build `COMMANDS`, write `run_command(text)` and make `respond` use it. Exact texts: help is `Commands: /history shows our conversation, /reset forgets everything, /help shows this list.`; history is `We have not talked yet.` when empty, otherwise `Conversation so far:` followed by numbered lines like `1. You: hello`; reset returns `Memory cleared. Nice to meet you again!`; an unknown command gives `Unknown command /dance. Try /help.`
