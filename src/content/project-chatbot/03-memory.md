---
title: "Step 3: Remember the user"
summary: "Keep a state dictionary and parse sentences like \"my name is ...\" with string methods."
level: intermediate
runner: python
stdin: |
  hello
  what is my name?
  My name is ada lovelace
  Hello!
  I like chess
  I like Python programming.
  what do you know about me?
  thanks
  bye
files:
  - name: main.py
    code: |
      # Chatbot, step 3: remember the user's name and facts.

      RULES = {
          "hello": "Hello, {name}! Nice to meet you.",
          "hi": "Hi there, {name}!",
          "help": "Try telling me your name (my name is ...) or what you like (i like ...).",
          "weather": "I hear it is sunny somewhere.",
          "music": "I love music. Do you play an instrument?",
          "food": "Pizza is my favourite food.",
          "thanks": "You are welcome, {name}!",
      }
      FALLBACK = "Hmm, I do not know about that yet. Say help to see what I know."

      # TODO 1: create the memory: state = {"name": None, "facts": []}


      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      def clean_words(text):
          # "What's the Weather?" -> ["what's", "the", "weather"]
          return [word.strip(".,!?;:") for word in text.lower().split()]


      # TODO 2: write learn(text). Clean the text with " ".join(clean_words(text)), then:
      #   - "my name is X": store X (.title()) in state["name"] and reply "Nice to meet you, X!"
      #   - "i like X": append X to state["facts"] and reply "Noted: you like X."
      #   - "what is my name": reply "Your name is X." or "You have not told me your name yet."
      #   - "what do you know about me": reply "Your name is X. You like a and b." (leave out the parts you do not know);
      #     with nothing known reply "Nothing yet. Tell me your name or what you like."
      #   - anything else: return None
      # TODO 3: in find_reply, fill the placeholder: reply.format(name=state["name"] or "friend")
      # TODO 4: write respond(text) that returns learn(text) or find_reply(text) and use it in the loop.

      def find_reply(text):
          words = clean_words(text)
          for keyword, reply in RULES.items():
              if keyword in words:
                  return reply
          return FALLBACK


      print("Bot: Hi! Tell me your name. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              # TODO 5: say goodbye with the name: "Bot: Goodbye, <name or friend>!"
              print("Bot: Goodbye!")
              break
          print("Bot: " + find_reply(text))
check:
  output: |
    Bot: Hi! Tell me your name. Type bye to leave.
    You: hello
    Bot: Hello, friend! Nice to meet you.
    You: what is my name?
    Bot: You have not told me your name yet.
    You: My name is ada lovelace
    Bot: Nice to meet you, Ada Lovelace!
    You: Hello!
    Bot: Hello, Ada Lovelace! Nice to meet you.
    You: I like chess
    Bot: Noted: you like chess.
    You: I like Python programming.
    Bot: Noted: you like python programming.
    You: what do you know about me?
    Bot: Your name is Ada Lovelace. You like chess and python programming.
    You: thanks
    Bot: You are welcome, Ada Lovelace!
    You: bye
    Bot: Goodbye, Ada Lovelace!
  code:
    - { pattern: "state\\s*=\\s*\\{", message: "Keep the memory in a dictionary named state." }
    - { pattern: "\\.startswith\\s*\\(", message: "Use .startswith() to recognise \"my name is\" and \"i like\"." }
    - { pattern: "\\.append\\s*\\(", message: "Add facts to the list with .append()." }
    - { pattern: "\\.format\\s*\\(", message: "Fill {name} in the replies with .format(name=...)." }
hints:
  - "Memory is a dictionary that outlives one message: state = {\"name\": None, \"facts\": []}. A learning function checks the start of the sentence and stores the rest."
  - "sentence = \" \".join(clean_words(text)); if sentence.startswith(\"my name is \"): state[\"name\"] = sentence[len(\"my name is \"):].title(). The slice after the prefix is the name. Return None at the end when nothing was learned, then use learn(text) or find_reply(text)."
  - "def learn(text):   sentence = \" \".join(clean_words(text))   if sentence.startswith(\"my name is \"):   state[\"name\"] = sentence[len(\"my name is \"):].title()   return \"Nice to meet you, \" + state[\"name\"] + \"!\"   ...   return None   def respond(text):   return learn(text) or find_reply(text) (the lines inside def, while, if and class are indented by 4 spaces per level)"
solution:
  - name: main.py
    code: |
      # Chatbot, step 3: remember the user's name and facts.

      RULES = {
          "hello": "Hello, {name}! Nice to meet you.",
          "hi": "Hi there, {name}!",
          "help": "Try telling me your name (my name is ...) or what you like (i like ...).",
          "weather": "I hear it is sunny somewhere.",
          "music": "I love music. Do you play an instrument?",
          "food": "Pizza is my favourite food.",
          "thanks": "You are welcome, {name}!",
      }
      FALLBACK = "Hmm, I do not know about that yet. Say help to see what I know."

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
quiz:
  - q: "What does \"my name is ada\".startswith(\"my name is \") return?"
    options: ["False", "\"ada\"", "True"]
    answer: 2
  - q: "What does sentence[len(\"my name is \"):] give for \"my name is ada\"?"
    options: ["\"my name\"", "\"ada\"", "\"is ada\""]
    answer: 1
    explain: "The slice starts after the prefix, so only the name is left."
  - q: "What does learn(text) or find_reply(text) do?"
    options: ["Uses learn's reply if it is not empty/None, otherwise find_reply", "Always calls both", "Calls find_reply first"]
    answer: 0
---
A bot that forgets who you are after every sentence feels cold. In this step it gains **memory**: it learns your name and the things you like, and uses them later. You will practise dictionaries as state, and parsing sentences with string methods.

## Where we are

The bot greets you, cleans your message into words and answers from a dictionary of keyword rules. Each message is handled completely on its own, nothing is remembered between two lines.

## What we will add, and why

Real assistants keep **state**: facts that survive from one message to the next. In Python the simplest container for state is a dictionary:

```python
state = {"name": None, "facts": []}
```

`None` means "no value yet" (we do not know the name), and `facts` is an empty list that will collect things like `"chess"`. Because `state` is created **once, outside the loop**, it lives as long as the program does. Put it inside the loop and it would be wiped on every message.

We also need to **parse** sentences. Parsing means pulling the useful part out of text. For `my name is ada lovelace`, the useful part is everything after the fixed beginning.

## Guided walk-through

**1. Normalise the sentence.** Re-use `clean_words` and glue the words back together with single spaces, so capital letters, extra spaces and punctuation no longer matter:

```python
sentence = " ".join(clean_words(text))     # "My name is Ada!" -> "my name is ada"
```

`" ".join(list)` is the opposite of `split`: it builds one string from a list, with the text before `.join` as the glue.

**2. Recognise the pattern.** `startswith` checks the beginning of a string:

```python
if sentence.startswith("my name is "):
    name = sentence[len("my name is "):]    # slice: everything after the prefix
```

`len("my name is ")` is 11, and `sentence[11:]` means "from position 11 to the end". `.title()` then capitalises each word: `"ada lovelace".title()` is `"Ada Lovelace"`.

**3. Store and reply.**

```python
state["name"] = name.title()
return "Nice to meet you, " + state["name"] + "!"
```

Do the same for `i like ...`: `state["facts"].append(thing)`. Note that the facts come from the cleaned lowercase sentence, so `Python programming.` is remembered as `python programming`.

**4. Answer questions about memory.** `what is my name` returns the name, or `You have not told me your name yet.` when `state["name"]` is still `None`. An empty value like `None` or `""` counts as false in an `if`, so `if state["name"]:` means "if we know the name". For `what do you know about me` build a list of sentences and join them: `" ".join(parts)`.

**5. Not everything is a memory.** `learn(text)` returns a reply when it learned or answered something, and `None` otherwise. Then one neat line decides who answers:

```python
def respond(text):
    return learn(text) or find_reply(text)
```

`a or b` gives `a` when `a` is not empty/`None`, otherwise `b`. The loop prints `respond(text)`.

**6. Use the name.** Some rule replies now contain `{name}`. `reply.format(name=...)` replaces the placeholder: `"Hello, {name}!".format(name="Ada")`. Use `state["name"] or "friend"` so that an unknown name becomes `friend`.

> **Watch out:**
> - A missing space in the prefix (`"my name is"` instead of `"my name is "`) leaves a leading space in the name.
> - `KeyError: 'name'` happens when you mistype a key such as `state["Name"]`; keys are case-sensitive.
> - `TypeError: can only concatenate str (not "NoneType") to str` means you joined `None` to text. Check `if state["name"]:` first.
> - `AttributeError: 'NoneType' object has no attribute 'title'` means the name was never stored.
> - Writing `state = {...}` inside a function creates a new local dictionary instead of changing the shared one. Changing `state["name"] = ...` is fine without `global`, because you modify the dictionary, you do not replace it.

> **Your turn:** create `state`, write `learn(text)` and `respond(text)`, and fill `{name}` in `find_reply`. Exact replies: `Nice to meet you, X!`, `Noted: you like X.`, `Your name is X.`, `You have not told me your name yet.`, `Your name is X. You like a and b.` (leave out the part you do not know), `Nothing yet. Tell me your name or what you like.`. At the end the bot says `Bot: Goodbye, <name or friend>!`.
