---
title: "Step 2: Keyword rules"
summary: "Use a dictionary of keywords and replies, and clean the words so punctuation does not get in the way."
level: beginner
runner: python
stdin: |
  Hello there!
  What is the weather like?
  I play music
  thanks
  blah blah
  help
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 2: reply to keywords with a dictionary of rules.

      # ---- the rules (already written) ----
      RULES = {
          "hello": "Hello! Nice to meet you.",
          "hi": "Hi there!",
          "help": "Try saying hello, or ask me about the weather, music or food.",
          "weather": "I hear it is sunny somewhere.",
          "music": "I love music. Do you play an instrument?",
          "food": "Pizza is my favourite food.",
          "thanks": "You are welcome!",
      }
      FALLBACK = "Hmm, I do not know about that yet. Say help to see what I know."




      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      # TODO 1: write clean_words(text): lower-case the text, split it into words and strip . , ! ? ; : from each word.
      # TODO 2: write find_reply(text): loop over RULES.items() and return the reply of the first keyword that is
      #         one of the words; return FALLBACK when none matches.

      print("Bot: Hi! Ask me about the weather, music or food. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye!")
              break
          # TODO 3: print "Bot: " plus find_reply(text) instead of repeating the text.
          print("Bot: You said: " + text)
check:
  output: |
    Bot: Hi! Ask me about the weather, music or food. Type bye to leave.
    You: Hello there!
    Bot: Hello! Nice to meet you.
    You: What is the weather like?
    Bot: I hear it is sunny somewhere.
    You: I play music
    Bot: I love music. Do you play an instrument?
    You: thanks
    Bot: You are welcome!
    You: blah blah
    Bot: Hmm, I do not know about that yet. Say help to see what I know.
    You: help
    Bot: Try saying hello, or ask me about the weather, music or food.
    You: bye
    Bot: Goodbye!
  code:
    - { pattern: "RULES\\s*=\\s*\\{", message: "Create a dictionary named RULES." }
    - { pattern: "\\.items\\s*\\(\\s*\\)", message: "Loop over RULES.items() to get keyword and reply." }
    - { pattern: "def\\s+clean_words", message: "Write clean_words(text)." }
    - { pattern: "def\\s+find_reply", message: "Write find_reply(text)." }
hints:
  - "A dictionary maps a key (the keyword) to a value (the reply). To find a rule, loop over the dictionary and check whether the keyword is one of the cleaned words of the message."
  - "clean_words: return [word.strip(\".,!?;:\") for word in text.lower().split()]. find_reply: for keyword, reply in RULES.items(): if keyword in words: return reply. After the loop return FALLBACK."
  - "RULES = {\"hello\": \"Hello! Nice to meet you.\", \"hi\": \"Hi there!\", ...}  def clean_words(text):   return [word.strip(\".,!?;:\") for word in text.lower().split()]  def find_reply(text):   words = clean_words(text)   for keyword, reply in RULES.items():   if keyword in words:   return reply   return FALLBACK (the lines inside def, while, if and class are indented by 4 spaces per level)"
solution:
  - name: main.py
    code: |
      # Chatbot, step 2: reply to keywords with a dictionary of rules.

      RULES = {
          "hello": "Hello! Nice to meet you.",
          "hi": "Hi there!",
          "help": "Try saying hello, or ask me about the weather, music or food.",
          "weather": "I hear it is sunny somewhere.",
          "music": "I love music. Do you play an instrument?",
          "food": "Pizza is my favourite food.",
          "thanks": "You are welcome!",
      }
      FALLBACK = "Hmm, I do not know about that yet. Say help to see what I know."


      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      def clean_words(text):
          # "What's the Weather?" -> ["what's", "the", "weather"]
          return [word.strip(".,!?;:") for word in text.lower().split()]


      def find_reply(text):
          words = clean_words(text)
          for keyword, reply in RULES.items():
              if keyword in words:
                  return reply
          return FALLBACK


      print("Bot: Hi! Ask me about the weather, music or food. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye!")
              break
          print("Bot: " + find_reply(text))
quiz:
  - q: "What does for keyword, reply in RULES.items() give you on each round?"
    options: ["Only the keys", "One key and its value", "The whole dictionary"]
    answer: 1
  - q: "Why strip punctuation from the words?"
    options: ["So \"weather?\" still matches the keyword \"weather\"", "To make the text shorter", "Python cannot read punctuation"]
    answer: 0
  - q: "Where should the fallback reply be returned?"
    options: ["Inside the loop, on the first round", "Before the loop", "After the loop, when no keyword matched"]
    answer: 2
---
An echo bot is polite but useless. In this step the bot starts to **react**: it looks for keywords in what you say and picks a matching reply. This idea (rule-based matching) powered the very first chatbots in the 1960s, and is still used in many customer-support bots today.

## Where we are

The bot greets you, listens through the `listen()` helper and echoes every line until you say `bye`.

## What we will add, and why

A table of **rules**: when the message contains the word `weather`, answer about the weather; when it contains `music`, talk about music. A Python **dictionary** is the perfect table, because it maps a *key* (the keyword) to a *value* (the reply). We also need a **fallback** reply for when no rule fits, because a bot that stays silent feels broken.

## Guided walk-through

**1. The rules dictionary.** Curly braces, `key: value` pairs separated by commas:

```python
RULES = {
    "hello": "Hello! Nice to meet you.",
    "weather": "I hear it is sunny somewhere.",
}
FALLBACK = "Hmm, I do not know about that yet."
```

Names in CAPITALS are a Python convention for constants, values that never change while the program runs.

**2. Split the message into clean words.** `"What is the weather like?"` contains the word `weather?` with a question mark glued to it, which would not equal `"weather"`. So we lower-case, split on spaces and strip punctuation from each word:

```python
def clean_words(text):
    return [word.strip(".,!?;:") for word in text.lower().split()]
```

The part in square brackets is a **list comprehension**: "for each word in the split text, give me the stripped word". `.strip(".,!?;:")` removes any of those characters from both ends of a word.

**3. Look for a matching rule.** Loop over the dictionary with `.items()`, which gives one `(key, value)` pair per round:

```python
def find_reply(text):
    words = clean_words(text)
    for keyword, reply in RULES.items():
        if keyword in words:
            return reply
    return FALLBACK
```

`keyword in words` asks "is this keyword one of the words?". The first rule that matches wins, because `return` ends the function immediately. Only when the loop finishes without a match do we reach the last line and return the fallback. That final `return` must be **outside** the loop (indented the same as `for`), otherwise the bot would give up after checking only the first rule.

**4. Use it in the loop.** Replace the echo with `print("Bot: " + find_reply(text))`.

Try the scripted conversation: `Hello there!` matches `hello`, `What is the weather like?` matches `weather` (thanks to `clean_words`), and `blah blah` falls back.

> **Watch out:**
> - Checking `if keyword in text` (the whole string) instead of the word list matches parts of words: `"this"` would trigger the rule `"hi"`. Matching whole words is more accurate.
> - Dictionary order matters: if a message contains two keywords, the first rule in the dictionary wins. Put more specific rules first.
> - `KeyError: 'weather'` appears when you write `RULES["weather"]` for a key that is missing. Looping with `.items()` avoids that.
> - Forgetting the comma between dictionary entries: `SyntaxError: invalid syntax. Perhaps you forgot a comma?`.

> **Your turn:** the `RULES` dictionary and `FALLBACK` are already written at the top of the starter (read them, then add a keyword of your own later if you like). Write `clean_words(text)` and `find_reply(text)` exactly as described, and use `find_reply` in the loop so the bot prints `Bot: <reply>`. The greeting line changed too, it is already updated.
