---
title: "Step 7: Fallbacks, a confidence report and a Chatbot class"
summary: "Handle messages the bot cannot understand, report its confidence at the end and tidy everything into a class."
level: advanced
export:
  kind: python
  name: chatbot
runner: python
stdin: |
  hello
  my name is ada
  how are you today
  asdf qwerty
  zzz
  tell me a joke
  /history
  what is the weather like today
  blah
  thanks a lot
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 7: a Chatbot class with fallbacks and a confidence report.
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
      FALLBACKS = [
          "Hmm, I am not sure I understood. Say help to see what I can do.",
          "I did not catch that. Could you say it differently?",
          "That is new to me. Try asking how I am, or ask for a joke.",
      ]
      LOST = "I keep getting lost. Type /help and I will show you what I understand."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      SEED = 42         # the same seed always gives the same "random" choices
      DEBUG = False     # set to True to print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary, the conversation in a list of (speaker, text) pairs.
      state = {"name": None, "facts": []}
      history = []
      rng = random.Random(SEED)


      # TODO 1: move the memory and the functions that use it into a class Chatbot:
      #   __init__(self, seed=SEED): name, facts, history, rng, misses (messages in a row that were not understood),
      #   log (a list of (intent, score) pairs) and the commands dictionary of bound methods.
      #   Methods: learn, show_help, show_history, reset, run_command, fallback, find_reply, respond, report.
      #   Keep listen, clean_words, similarity and classify as normal functions.
      # TODO 2: fallback(): count a miss; after 2 misses in a row return LOST, otherwise self.rng.choice(FALLBACKS).
      #         A found intent resets the miss counter. find_reply and respond must add
      #         (intent or "unknown" or "memory", score) to self.log ("memory" messages count with score 1.0).
      # TODO 3: report() returns these lines joined with "\n":
      #           --- Conversation report ---
      #           Messages: <how many>      Understood: <how many>      Not understood: <how many>
      #           Average confidence: <two decimals>
      #           Topics: <intent> x<count>, ...   (most used first, ties in alphabetical order)
      # TODO 4: write main(): create the bot, loop until "bye" (or EOFError), print "Bot: Goodbye, <name or friend>!"
      #         and then the report. Call main() under  if __name__ == "__main__":

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
check:
  output: |
    Bot: Hi! Tell me your name. Type /help for commands, bye to leave.
    You: hello
    Bot: Hey friend, good to see you!
    You: my name is ada
    Bot: Nice to meet you, Ada!
    You: how are you today
    Bot: I am doing great, thanks for asking!
    You: asdf qwerty
    Bot: Hmm, I am not sure I understood. Say help to see what I can do.
    You: zzz
    Bot: I keep getting lost. Type /help and I will show you what I understand.
    You: tell me a joke
    Bot: A SQL query walks into a bar and asks two tables: can I join you?
    You: /history
    Bot: Conversation so far:
    1. You: hello
    2. Bot: Hey friend, good to see you!
    3. You: my name is ada
    4. Bot: Nice to meet you, Ada!
    5. You: how are you today
    6. Bot: I am doing great, thanks for asking!
    7. You: asdf qwerty
    8. Bot: Hmm, I am not sure I understood. Say help to see what I can do.
    9. You: zzz
    10. Bot: I keep getting lost. Type /help and I will show you what I understand.
    11. You: tell me a joke
    12. Bot: A SQL query walks into a bar and asks two tables: can I join you?
    You: what is the weather like today
    Bot: I cannot look outside, but I hope it is nice.
    You: blah
    Bot: Hmm, I am not sure I understood. Say help to see what I can do.
    You: thanks a lot
    Bot: I keep getting lost. Type /help and I will show you what I understand.
    You: bye
    Bot: Goodbye, Ada!
    --- Conversation report ---
    Messages: 9
    Understood: 5
    Not understood: 4
    Average confidence: 0.55
    Topics: unknown x4, greeting x1, how_are_you x1, joke x1, memory x1, weather x1
  code:
    - { pattern: "class\\s+Chatbot", message: "Write class Chatbot." }
    - { pattern: "def\\s+__init__", message: "Give the class an __init__ method." }
    - { pattern: "def\\s+report", message: "Add a report() method." }
    - { pattern: "EOFError", message: "Catch EOFError so the bot leaves politely when the input ends." }
    - { pattern: "def\\s+main", message: "Write a main() function." }
hints:
  - "Move the state (name, facts, history, rng, miss counter, log) into __init__ as self.name, self.facts... and turn the functions that use it into methods with self as first parameter. Keep helpers that need no memory (clean_words, similarity, classify) as plain functions."
  - "fallback(): self.misses += 1; if self.misses >= 2: return LOST; return self.rng.choice(FALLBACKS). In find_reply append (intent, score) to self.log, or (\"unknown\", score) for a miss. report() averages the scores and counts the intents in a dictionary."
  - "class Chatbot:   def __init__(self, seed=SEED):   self.name = None   self.facts = []   self.history = []   self.rng = random.Random(seed)   self.misses = 0   self.log = []   self.commands = {\"/help\": self.show_help, \"/history\": self.show_history, \"/reset\": self.reset}   def main():   bot = Chatbot()   ...   if __name__ == \"__main__\":   main() (the lines inside def, while, if and class are indented by 4 spaces per level)"
solution:
  - name: main.py
    code: |
      # Chatbot, step 7: a Chatbot class with fallbacks and a confidence report.
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
      FALLBACKS = [
          "Hmm, I am not sure I understood. Say help to see what I can do.",
          "I did not catch that. Could you say it differently?",
          "That is new to me. Try asking how I am, or ask for a joke.",
      ]
      LOST = "I keep getting lost. Type /help and I will show you what I understand."
      THRESHOLD = 0.4   # below this score the bot admits it does not understand
      SEED = 42         # the same seed always gives the same "random" choices


      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      def clean_words(text):
          # "What's the Weather?" -> ["what's", "the", "weather"]
          return [word.strip(".,!?;:") for word in text.lower().split()]


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


      class Chatbot:
          """Everything the bot knows and remembers lives inside one object."""

          def __init__(self, seed=SEED):
              self.name = None
              self.facts = []
              self.history = []                 # (speaker, text) pairs
              self.rng = random.Random(seed)
              self.misses = 0                   # messages in a row that the bot did not understand
              self.log = []                     # one (intent, score) per message, for the report
              self.commands = {
                  "/help": self.show_help,
                  "/history": self.show_history,
                  "/reset": self.reset,
              }

          # ---- memory ----
          def learn(self, text):
              """Look for something to remember. Return a reply, or None when there is nothing to learn."""
              sentence = " ".join(clean_words(text))
              if sentence.startswith("my name is "):
                  self.name = sentence[len("my name is "):].title()
                  return "Nice to meet you, " + self.name + "!"
              if sentence.startswith("i like "):
                  thing = sentence[len("i like "):]
                  self.facts.append(thing)
                  return "Noted: you like " + thing + "."
              if sentence == "what is my name":
                  if self.name:
                      return "Your name is " + self.name + "."
                  return "You have not told me your name yet."
              if sentence == "what do you know about me":
                  if not self.name and not self.facts:
                      return "Nothing yet. Tell me your name or what you like."
                  parts = []
                  if self.name:
                      parts.append("Your name is " + self.name + ".")
                  if self.facts:
                      parts.append("You like " + " and ".join(self.facts) + ".")
                  return " ".join(parts)
              return None

          # ---- commands ----
          def show_help(self):
              return "Commands: /history shows our conversation, /reset forgets everything, /help shows this list."

          def show_history(self):
              if not self.history:
                  return "We have not talked yet."
              lines = ["Conversation so far:"]
              for number, (speaker, text) in enumerate(self.history, start=1):
                  lines.append(str(number) + ". " + speaker + ": " + text)
              return "\n".join(lines)

          def reset(self):
              self.name = None
              self.facts.clear()
              self.history.clear()
              self.log.clear()
              self.misses = 0
              return "Memory cleared. Nice to meet you again!"

          def run_command(self, text):
              """Run a slash command. Return its reply, or None when text is not a command."""
              if not text.startswith("/"):
                  return None
              command = self.commands.get(text.lower())
              if command is None:
                  return "Unknown command " + text + ". Try /help."
              return command()

          # ---- understanding ----
          def fallback(self):
              """The bot did not understand: ask again, and point to /help when it keeps happening."""
              self.misses += 1
              if self.misses >= 2:
                  return LOST
              return self.rng.choice(FALLBACKS)

          def find_reply(self, text):
              intent, score = classify(text)
              if score < THRESHOLD:
                  self.log.append(("unknown", score))
                  return self.fallback()
              self.misses = 0
              self.log.append((intent, score))
              reply = self.rng.choice(INTENTS[intent]["replies"])
              return reply.format(name=self.name or "friend")

          def respond(self, text):
              reply = self.run_command(text)
              if reply is not None:
                  return reply          # commands are not part of the conversation history
              reply = self.learn(text)
              if reply is not None:
                  self.misses = 0
                  self.log.append(("memory", 1.0))
              else:
                  reply = self.find_reply(text)
              self.history.append(("You", text))
              self.history.append(("Bot", reply))
              return reply

          # ---- report ----
          def report(self):
              total = len(self.log)
              if total == 0:
                  return "Report: no messages to analyse."
              unknown = sum(1 for intent, score in self.log if intent == "unknown")
              average = sum(score for intent, score in self.log) / total
              counts = {}
              for intent, score in self.log:
                  counts[intent] = counts.get(intent, 0) + 1
              ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
              lines = [
                  "--- Conversation report ---",
                  "Messages: " + str(total),
                  "Understood: " + str(total - unknown),
                  "Not understood: " + str(unknown),
                  "Average confidence: " + format(average, ".2f"),
                  "Topics: " + ", ".join(name + " x" + str(count) for name, count in ordered),
              ]
              return "\n".join(lines)


      def main():
          bot = Chatbot()
          print("Bot: Hi! Tell me your name. Type /help for commands, bye to leave.")
          while True:
              try:
                  text = listen()
              except EOFError:          # the input ran out: leave politely
                  break
              if text.lower() == "bye":
                  break
              print("Bot: " + bot.respond(text))
          print("Bot: Goodbye, " + (bot.name or "friend") + "!")
          print(bot.report())


      if __name__ == "__main__":
          main()
quiz:
  - q: "What is the first parameter of a method such as def reset(self)?"
    options: ["The object the method is called on", "The class itself", "The first argument of the call"]
    answer: 0
  - q: "Why keep a miss counter in the object?"
    options: ["To print it", "To speed up the replies", "So the bot can react differently when it fails several times in a row"]
    answer: 2
  - q: "What does the line if __name__ == \"__main__\": main() do?"
    options: ["Runs main() twice", "Runs main() only when the file is run directly, not when it is imported", "Defines main"]
    answer: 1
---
The bot works, but it has two weaknesses: it handles misunderstandings poorly, and its code is a pile of global variables and loose functions. In this final step you add smart **fallbacks**, a **confidence report**, and **refactor** everything into a `Chatbot` class with a clean `main()`. Refactoring means changing the structure of working code without changing what it does, which is what keeps real programs maintainable.

## Where we are

The bot has memory, intents with scores, commands, history and seeded small talk. State lives in module-level variables (`state`, `history`, `rng`), and a message the bot does not understand always gets the same fallback sentence.

## What we will add, and why

1. **Smarter fallbacks.** The first miss gets one of several polite "I did not understand" lines (`FALLBACKS`, chosen with the seeded generator). When the bot misses **twice in a row**, it stops guessing and points you to `/help` (`LOST`). A counter, `misses`, tracks this and resets on every successful reply.
2. **A confidence log.** Each message adds `(intent, score)` to a list. Memory sentences count as `("memory", 1.0)`, understood intents keep their score and misses are stored as `("unknown", score)`. At the end the bot reports on itself.
3. **A class.** The data and the functions that work on it belong together. A class bundles them, so you can even run two independent bots (`Chatbot(seed=1)` and `Chatbot(seed=2)`).

## Guided walk-through

**1. The class skeleton.** `__init__` runs when you write `Chatbot()` and sets up the object's own variables with `self.`:

```python
class Chatbot:
    def __init__(self, seed=SEED):
        self.name = None
        self.facts = []
        self.history = []
        self.rng = random.Random(seed)
        self.misses = 0
        self.log = []
        self.commands = {"/help": self.show_help, "/history": self.show_history, "/reset": self.reset}
```

`self.show_help` (a **bound method**) is a function that already remembers its object, so `command()` needs no arguments.

**2. Turn functions into methods.** Indent them into the class and add `self` as first parameter. Inside, `state["name"]` becomes `self.name`, `history` becomes `self.history`, `rng` becomes `self.rng`, and calls like `learn(text)` become `self.learn(text)`. Functions that need no memory (`clean_words`, `similarity`, `classify`) stay outside as normal functions.

**3. Fallback and log.**

```python
def fallback(self):
    self.misses += 1
    if self.misses >= 2:
        return LOST
    return self.rng.choice(FALLBACKS)
```

In `find_reply`: below the threshold append `("unknown", score)` and return `self.fallback()`; otherwise reset `self.misses = 0`, append `(intent, score)` and pick a reply as before. In `respond`, a successful `learn` resets `misses` and appends `("memory", 1.0)`.

**4. The report.** Compute the number of messages, how many were `"unknown"`, the average score (`sum(...) / total`, shown with `format(average, ".2f")`) and a dictionary of counts, sorted most used first and then alphabetically:

```python
ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
```

`key=` tells `sorted` what to compare; the tuple `(-count, name)` means "bigger counts first, ties by name". Do not forget an empty log: avoid dividing by zero.

**5. `main()`.** Create the bot, loop, and finish with the goodbye and the report. Catch `EOFError` so that if the input simply runs out (the user closes the terminal) the bot leaves politely instead of crashing:

```python
try:
    text = listen()
except EOFError:
    break
```

End the file with `if __name__ == "__main__": main()`. It runs `main()` when you start the file directly but not when another file imports it, so the bot can be reused and tested.

> **Watch out:**
> - Forgetting `self.` makes `NameError: name 'history' is not defined` or silently creates a local variable.
> - Forgetting `self` as first parameter: `TypeError: Chatbot.reset() takes 0 positional arguments but 1 was given`.
> - Resetting `misses` in the wrong place changes when `LOST` shows up. Reset on every understood message, count on every miss.
> - A report that divides by `len(self.log)` crashes with `ZeroDivisionError` on an empty conversation.

## What to build next

* Save the `Chatbot` to a file with `json` so the bot remembers you between runs.
* Replace the word-overlap score with a smarter one (ignore stop words, or give rarer words more weight).
* Let intents have actions: tell the real time, do arithmetic, look up a word.
* Read from a real terminal and swap `listen()` for a web or chat-app front end; the `Chatbot` class does not need to change.
* Write tests that feed messages to `Chatbot(seed=42).respond(...)` and compare the replies: your seeded generator makes that possible.

> **Your turn:** build `class Chatbot` as described (state in `__init__`, methods `learn`, `show_help`, `show_history`, `reset`, `run_command`, `fallback`, `find_reply`, `respond`, `report`), keep `listen`, `clean_words`, `similarity` and `classify` as functions, write `main()` and call it under `if __name__ == "__main__":`. The report format is shown in the starter comments and in the expected output.
