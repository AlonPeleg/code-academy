---
title: "Step 6: Small talk with seeded randomness"
summary: "Pick varied replies with random.Random(seed).choice so the bot feels alive but every run is identical."
level: advanced
runner: python
stdin: |
  hello
  hello
  hello
  hello
  hi there
  how are you
  how are you
  tell me a joke
  tell me a joke
  tell me a joke
  who are you
  thanks
  my name is ada
  thanks
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 6: small talk with varied (but repeatable) replies.
      # TODO 1: import random

      # Each intent has example sentences (patterns) and several possible replies.
      INTENTS = {
          "greeting": {
              "patterns": ["hello", "hi there", "hey bot", "good morning"],
              "replies": [
                  "Hello, {name}! Nice to meet you.",
                  "Hi {name}! What is on your mind?",
                  "Hey {name}, good to see you!",
              ],
          },
          "how_are_you": {
              "patterns": ["how are you", "how is it going", "how do you feel"],
              "replies": [
                  "I am doing great, thanks for asking!",
                  "Pretty good for a bunch of Python code.",
                  "All systems running smoothly!",
              ],
          },
          "bot_name": {
              "patterns": ["what is your name", "who are you"],
              "replies": [
                  "I am PyBot, a tiny chatbot written in Python.",
                  "They call me PyBot.",
              ],
          },
          "weather": {
              "patterns": ["how is the weather", "is it raining", "what is the weather like"],
              "replies": [
                  "I hear it is sunny somewhere.",
                  "I cannot look outside, but I hope it is nice.",
                  "Weather talk! Classic small talk.",
              ],
          },
          "joke": {
              "patterns": ["tell me a joke", "say something funny", "make me laugh"],
              "replies": [
                  "Why do programmers prefer dark mode? Because light attracts bugs.",
                  "There are 10 kinds of people: those who know binary and those who do not.",
                  "A SQL query walks into a bar and asks two tables: can I join you?",
              ],
          },
          "help": {
              "patterns": ["what can you do", "help me", "i need help"],
              "replies": ["Try: my name is ..., i like ..., how are you, tell me a joke, /history."],
          },
          "thanks": {
              "patterns": ["thanks", "thank you"],
              "replies": ["You are welcome, {name}!", "Any time, {name}!"],
          },
      }
      FALLBACK = "Hmm, I am not sure I understood. Say help to see what I can do."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      SEED = 42         # the same seed always gives the same "random" choices
      DEBUG = False     # set to True to print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary, the conversation in a list of (speaker, text) pairs.
      state = {"name": None, "facts": []}
      history = []
      # TODO 2: create the generator rng = random.Random(SEED) (use rng, never the global random functions).


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
          # TODO 3: every intent now has a list "replies": pick one with rng.choice(...) and fill in the name.
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
check:
  output: |
    Bot: Hi! Tell me your name. Type /help for commands, bye to leave.
    You: hello
    Bot: Hey friend, good to see you!
    You: hello
    Bot: Hello, friend! Nice to meet you.
    You: hello
    Bot: Hello, friend! Nice to meet you.
    You: hello
    Bot: Hey friend, good to see you!
    You: hi there
    Bot: Hi friend! What is on your mind?
    You: how are you
    Bot: I am doing great, thanks for asking!
    You: how are you
    Bot: I am doing great, thanks for asking!
    You: tell me a joke
    Bot: Why do programmers prefer dark mode? Because light attracts bugs.
    You: tell me a joke
    Bot: A SQL query walks into a bar and asks two tables: can I join you?
    You: tell me a joke
    Bot: Why do programmers prefer dark mode? Because light attracts bugs.
    You: who are you
    Bot: I am PyBot, a tiny chatbot written in Python.
    You: thanks
    Bot: Any time, friend!
    You: my name is ada
    Bot: Nice to meet you, Ada!
    You: thanks
    Bot: You are welcome, Ada!
    You: bye
    Bot: Goodbye, Ada!
  code:
    - { pattern: "import\\s+random", message: "Import the random module." }
    - { pattern: "random\\.Random\\s*\\(", message: "Make your own generator with random.Random(SEED)." }
    - { pattern: "\\.choice\\s*\\(", message: "Pick a reply with rng.choice(list)." }
hints:
  - "Give every intent a LIST of replies and let the bot pick one. For repeatable randomness, create one generator with a fixed seed: rng = random.Random(42), and always use rng, never the global random functions."
  - "import random at the top, rng = random.Random(SEED) next to the state, and in find_reply: reply = rng.choice(INTENTS[intent][\"replies\"]). Rename \"reply\" to \"replies\" in every intent and add a \"joke\" intent."
  - "import random   SEED = 42   rng = random.Random(SEED)   reply = rng.choice(INTENTS[intent][\"replies\"])   return reply.format(name=state[\"name\"] or \"friend\")"
solution:
  - name: main.py
    code: |
      # Chatbot, step 6: small talk with varied (but repeatable) replies.
      import random


      # Each intent has example sentences (patterns) and several possible replies.
      INTENTS = {
          "greeting": {
              "patterns": ["hello", "hi there", "hey bot", "good morning"],
              "replies": [
                  "Hello, {name}! Nice to meet you.",
                  "Hi {name}! What is on your mind?",
                  "Hey {name}, good to see you!",
              ],
          },
          "how_are_you": {
              "patterns": ["how are you", "how is it going", "how do you feel"],
              "replies": [
                  "I am doing great, thanks for asking!",
                  "Pretty good for a bunch of Python code.",
                  "All systems running smoothly!",
              ],
          },
          "bot_name": {
              "patterns": ["what is your name", "who are you"],
              "replies": [
                  "I am PyBot, a tiny chatbot written in Python.",
                  "They call me PyBot.",
              ],
          },
          "weather": {
              "patterns": ["how is the weather", "is it raining", "what is the weather like"],
              "replies": [
                  "I hear it is sunny somewhere.",
                  "I cannot look outside, but I hope it is nice.",
                  "Weather talk! Classic small talk.",
              ],
          },
          "joke": {
              "patterns": ["tell me a joke", "say something funny", "make me laugh"],
              "replies": [
                  "Why do programmers prefer dark mode? Because light attracts bugs.",
                  "There are 10 kinds of people: those who know binary and those who do not.",
                  "A SQL query walks into a bar and asks two tables: can I join you?",
              ],
          },
          "help": {
              "patterns": ["what can you do", "help me", "i need help"],
              "replies": ["Try: my name is ..., i like ..., how are you, tell me a joke, /history."],
          },
          "thanks": {
              "patterns": ["thanks", "thank you"],
              "replies": ["You are welcome, {name}!", "Any time, {name}!"],
          },
      }
      FALLBACK = "Hmm, I am not sure I understood. Say help to see what I can do."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      SEED = 42         # the same seed always gives the same "random" choices
      DEBUG = False     # set to True to print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary, the conversation in a list of (speaker, text) pairs.
      state = {"name": None, "facts": []}
      history = []
      rng = random.Random(SEED)


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
          reply = rng.choice(INTENTS[intent]["replies"])
          return reply.format(name=state["name"] or "friend")


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
  - q: "What does a seed do for a random number generator?"
    options: ["It makes it faster", "It makes the numbers bigger", "It fixes the starting point, so the same seed gives the same \"random\" sequence"]
    answer: 2
  - q: "Why is a fixed seed useful for a lesson or a test?"
    options: ["It is more secure", "The output is predictable and can be compared exactly", "It removes the need for lists"]
    answer: 1
  - q: "What does rng.choice([\"a\", \"b\", \"c\"]) return?"
    options: ["One item picked from the list", "A list of all items", "A random number"]
    answer: 0
---
A bot that gives the identical answer to the same question every time sounds like a machine. In this step the bot picks a **random reply** from several, so conversations feel more alive. And we do it with a **seed**, so it stays perfectly repeatable for testing.

## Where we are

The bot has memory, intents with confidence scores, a conversation history and slash commands. Each intent has exactly one reply.

## What we will add, and why

Real assistants vary their wording. We give every intent a **list** of replies (the starter already contains them, and a new `joke` intent) and choose one at random. But random behaviour is a problem for testing: how can you check output that changes on every run? The answer is a **pseudo-random generator with a fixed seed**. It produces numbers that look random but follow a fixed recipe determined by the seed, so the same seed always gives the same sequence of choices.

## Guided walk-through

**1. Import the module.** `import random` at the top of the file (the course starter has a TODO for it).

**2. Make your own generator.** The module has global functions like `random.choice(...)`, but a separate **generator object** is better: it carries its own seed and does not interfere with anything else.

```python
SEED = 42
rng = random.Random(SEED)
```

Create it **once**, outside the loop. If you created `random.Random(42)` for every message the bot would always pick the first "random" item, because every new generator restarts the sequence.

**3. Choose a reply.** `rng.choice(list)` returns one element of the list:

```python
reply = rng.choice(INTENTS[intent]["replies"])
return reply.format(name=state["name"] or "friend")
```

`INTENTS[intent]["replies"]` is the list for the winning intent; `.format(...)` fills in the name as before.

**4. Experiment.** In the scripted conversation `hello` is typed four times. The answers are not in a fixed order, but they are always the same four answers: run it ten times and compare. Now try `SEED = 7` and watch different choices. Finally replace the seed with `random.Random()` (no argument): the choices change on every run.

**5. Why is this reliable?** The sequence is produced by an algorithm called the Mersenne Twister, and in practice `Random(seed)` with `choice` gives the same picks on every computer and in all recent Python versions, so the course can compare your output with the expected output exactly. (Python only formally promises this for the basic `random()` numbers, so do not rely on exact picks across very different Python versions in your own projects.) Only use a fixed seed for **tests and lessons**. In a real chat you would create `random.Random()` so every conversation differs.

**6. Every random pick uses up numbers.** The generator moves forward each time you ask for a choice. If a message does not reach `rng.choice` (for example commands, or memory sentences like `my name is ada`), it does not move the generator. That is why the order of messages affects which reply you get.

> **Watch out:**
> - `TypeError: 'NoneType' object is not subscriptable` or `KeyError: 'reply'`: you renamed `reply` to `replies` in the data but still read the old key in the code.
> - `IndexError: Cannot choose from an empty sequence` appears if an intent has an empty `replies` list.
> - Creating the generator inside `find_reply` resets it on every message and removes the variety.
> - Do not mix `random.choice(...)` and `rng.choice(...)`: only the generator with the seed is repeatable.
> - Never use `random` for passwords or security tokens: it is predictable by design.

> **Your turn:** `import random`, create `rng = random.Random(SEED)` once, and pick the reply with `rng.choice(...)` from the intent's `replies` list, filling in the name. The starter already holds the data; run the scripted chat twice to see that the replies are identical.
