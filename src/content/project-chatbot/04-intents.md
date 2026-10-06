---
title: "Step 4: Intents and confidence"
summary: "Score how well a message matches each intent by word overlap and admit it when the score is too low."
level: intermediate
runner: python
stdin: |
  Hello
  hey bot!
  how are you today?
  who are you
  is the weather nice
  what is the weather like today
  thank you so much
  my name is grace hopper
  tell me about dinosaurs
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 4: pick the best intent with word-overlap scoring.

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
      DEBUG = True      # print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary.
      state = {"name": None, "facts": []}


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


      # TODO 1: write similarity(words_a, words_b): shared words divided by all different words (sets: & and |),
      #         and 0.0 when one of the sets is empty.
      # TODO 2: write classify(text): compare the set of cleaned words with the words of every pattern of every
      #         intent and return (best intent name, best score).
      # TODO 3: in find_reply, use classify. When DEBUG is on print "   [intent=<name> score=<0.00>]";
      #         when the score is below THRESHOLD return FALLBACK, otherwise the intent's reply (filled with the name).

      def find_reply(text):
          words = clean_words(text)
          for keyword, reply in RULES.items():
              if keyword in words:
                  return reply.format(name=state["name"] or "friend")
          return FALLBACK


      def respond(text):
          return learn(text) or find_reply(text)


      print("Bot: Hi! Tell me your name. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye, " + (state["name"] or "friend") + "!")
              break
          print("Bot: " + respond(text))
check:
  output: |
    Bot: Hi! Tell me your name. Type bye to leave.
    You: Hello
       [intent=greeting score=1.00]
    Bot: Hello, friend! Nice to meet you.
    You: hey bot!
       [intent=greeting score=1.00]
    Bot: Hello, friend! Nice to meet you.
    You: how are you today?
       [intent=how_are_you score=0.75]
    Bot: I am doing great, thanks for asking!
    You: who are you
       [intent=bot_name score=1.00]
    Bot: I am PyBot, a tiny chatbot written in Python.
    You: is the weather nice
       [intent=weather score=0.60]
    Bot: I hear it is sunny somewhere.
    You: what is the weather like today
       [intent=weather score=0.83]
    Bot: I hear it is sunny somewhere.
    You: thank you so much
       [intent=thanks score=0.50]
    Bot: You are welcome, friend!
    You: my name is grace hopper
    Bot: Nice to meet you, Grace Hopper!
    You: tell me about dinosaurs
       [intent=help score=0.20]
    Bot: Hmm, I am not sure I understood. Say help to see what I can do.
    You: bye
    Bot: Goodbye, Grace Hopper!
  code:
    - { pattern: "def\\s+similarity", message: "Write similarity(words_a, words_b)." }
    - { pattern: "def\\s+classify", message: "Write classify(text)." }
    - { pattern: "\\bset\\s*\\(", message: "Turn the words into sets with set(...)." }
    - { pattern: "&", message: "Use & to find the shared words of two sets." }
    - { pattern: "THRESHOLD", message: "Use a THRESHOLD constant to decide when the bot does not understand." }
hints:
  - "Turn the message and each example sentence into sets of words. The overlap score is: words in both sets divided by words in either set. Keep the intent with the highest score, and fall back when the best score is below the threshold."
  - "a & b is the intersection, a | b the union: len(a & b) / len(a | b). classify loops over INTENTS.items() and over each pattern, remembering the best (name, score) with an if score > best_score."
  - "def similarity(words_a, words_b):   if not words_a or not words_b:   return 0.0   return len(words_a & words_b) / len(words_a | words_b)   in find_reply: intent, score = classify(text); if score < THRESHOLD: return FALLBACK; return INTENTS[intent][\"reply\"].format(name=state[\"name\"] or \"friend\") (the lines inside def, while, if and class are indented by 4 spaces per level)"
solution:
  - name: main.py
    code: |
      # Chatbot, step 4: pick the best intent with word-overlap scoring.

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
      DEBUG = True      # print the chosen intent and its score under each reply

      # The bot's memory lives in one dictionary.
      state = {"name": None, "facts": []}


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


      def respond(text):
          return learn(text) or find_reply(text)


      print("Bot: Hi! Tell me your name. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye, " + (state["name"] or "friend") + "!")
              break
          print("Bot: " + respond(text))
quiz:
  - q: "For the word sets {\"how\",\"are\",\"you\"} and {\"how\",\"are\",\"you\",\"today\"}, what is the overlap score (shared / all different)?"
    options: ["0.75", "0.5", "1.0"]
    answer: 0
  - q: "Why have a confidence threshold?"
    options: ["To sort the intents", "To make replies longer", "So the bot can admit it did not understand instead of giving a wrong answer"]
    answer: 2
  - q: "What does set(\"a b a\".split()) contain?"
    options: ["[\"a\", \"b\", \"a\"]", "{\"a\", \"b\"}", "{\"a\", \"b\", \"a\"}"]
    answer: 1
    explain: "A set keeps every different value only once."
---
Keyword rules break easily: `hey bot!` matches nothing and `how are you today?` might match a rule you did not intend. In this step the bot learns to **compare** your sentence with example sentences, choose the closest **intent**, and measure its own **confidence**. This is the same idea (in miniature) behind real language-understanding systems.

## Where we are

The bot remembers your name and facts (`learn`) and answers keyword rules. Rules are checked in order and the first one wins, with no notion of how good the match was.

## What we will add, and why

An **intent** is what the user wants to achieve: greet, ask how the bot is, ask for help. Instead of one keyword per rule, each intent now has several example sentences (**patterns**). For every pattern we compute a similarity score between 0.0 (nothing in common) and 1.0 (same words), keep the best, and:

* if the best score is at least the **threshold** (0.4), answer with that intent's reply;
* otherwise admit "I am not sure I understood", instead of guessing.

The data (`INTENTS`, `THRESHOLD`, `DEBUG`) is already written for you in the starter.

## Guided walk-through

**1. Sets.** A `set` stores each distinct value once and has fast overlap operations:

```python
a = set("how are you today".split())   # {"how", "are", "you", "today"}
b = set("how are you".split())         # {"how", "are", "you"}
a & b    # shared words (intersection)  -> {"how", "are", "you"}
a | b    # all different words (union)  -> {"how", "are", "you", "today"}
```

**2. The score.** Shared words divided by all different words (this measure is called Jaccard similarity):

```python
def similarity(words_a, words_b):
    if not words_a or not words_b:
        return 0.0
    return len(words_a & words_b) / len(words_a | words_b)
```

For the sets above: 3 / 4 = 0.75. Two identical sets give 1.0, sets with nothing in common give 0.0. The guard at the top avoids dividing by zero for an empty message (`ZeroDivisionError: division by zero`).

**3. Find the best intent.** Loop over every intent and every pattern, remember the best:

```python
def classify(text):
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
```

A function can return **two values** (a tuple) and the caller unpacks them: `intent, score = classify(text)`.

**4. Decide.** In `find_reply`: classify, and when `DEBUG` is on print a line like `   [intent=greeting score=1.00]` (`format(score, ".2f")` shows two decimals). If `score < THRESHOLD` return `FALLBACK`; otherwise take `INTENTS[intent]["reply"]` and fill in the name.

Run the scripted conversation and read the debug lines. Notice `what is the weather like today` scores 0.83 for the weather intent, while `tell me about dinosaurs` scores only 0.20 and lands in the fallback. You can lower or raise `THRESHOLD` to see the bot become bolder or more careful.

> **Watch out:**
> - `len(a & b) / len(a | b)` is a float in Python 3 (`3 / 4` is `0.75`); use `//` only when you want whole numbers.
> - Do not forget `set(...)` on the message: `list & list` raises `TypeError: unsupported operand type(s) for &: 'list' and 'list'`.
> - If `best_intent` stays `None` (score 0.0) and you index `INTENTS[None]` you get `KeyError: None`. The threshold check must come first.
> - Stop words like `the` and `is` match too easily. That is fine for a toy bot; real systems remove or weight them.
> - Scores close to the threshold are fragile: one extra word changes the answer. That is why we print the score.

> **Your turn:** write `similarity(words_a, words_b)` and `classify(text)`, and update `find_reply` so it uses them: print the debug line `   [intent=<name> score=<0.00>]` (three spaces first) when `DEBUG` is true, return `FALLBACK` below `THRESHOLD`, otherwise the intent's reply with `{name}` filled in.
