---
title: "Step 1: An echo bot"
summary: "Read lines with input() in a loop and repeat them until the user says bye."
level: beginner
runner: python
stdin: |
  hello
  How are you?
    I like Python
  BYE
files:
  - name: main.py
    code: |
      # Chatbot, step 1: an echo bot that listens until you say "bye".

      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          # TODO 1: read one line with input() and remove the spaces around it with .strip().
          #         Print it as "You: <text>" and return it.
          pass


      print("Bot: Hi! I repeat everything you say. Type bye to leave.")

      # TODO 2: write a loop that never ends by itself and, on every round:
      #   - reads the next line with listen()
      #   - when the line is "bye" (in any capitals), prints "Bot: Goodbye!" and leaves the loop
      #   - otherwise prints "Bot: You said: " followed by the line
check:
  output: |
    Bot: Hi! I repeat everything you say. Type bye to leave.
    You: hello
    Bot: You said: hello
    You: How are you?
    Bot: You said: How are you?
    You: I like Python
    Bot: You said: I like Python
    You: BYE
    Bot: Goodbye!
  code:
    - { pattern: "input\\s*\\(", message: "Read each line with input()." }
    - { pattern: "while\\s+", message: "Use a while loop so the bot keeps listening." }
    - { pattern: "\\bbreak\\b", message: "Leave the loop with break when the user says bye." }
    - { pattern: "\\.lower\\s*\\(", message: "Compare in lower case (text.lower()) so BYE and bye both work." }
hints:
  - "You need a loop that runs again and again, and a way to leave it. while True: keeps going, and break leaves. Inside, read a line with the listen() helper you complete."
  - "listen(): text = input().strip(), then print(\"You: \" + text) and return text. Loop: text = listen(); if text.lower() == \"bye\": print(\"Bot: Goodbye!\"); break; else print the echo."
  - "def listen():   text = input().strip()   print(\"You: \" + text)   return text   while True:   text = listen()   if text.lower() == \"bye\":   print(\"Bot: Goodbye!\")   break   print(\"Bot: You said: \" + text) (the lines inside def, while, if and class are indented by 4 spaces per level)"
solution:
  - name: main.py
    code: |
      # Chatbot, step 1: an echo bot that listens until you say "bye".

      def listen():
          # The lesson feeds the conversation from a script, so we print what "you" typed.
          text = input().strip()
          print("You: " + text)
          return text


      print("Bot: Hi! I repeat everything you say. Type bye to leave.")

      while True:
          text = listen()
          if text.lower() == "bye":
              print("Bot: Goodbye!")
              break
          print("Bot: You said: " + text)
quiz:
  - q: "What does input() return?"
    options: ["The line the user typed, as a string", "A number", "Nothing"]
    answer: 0
  - q: "Why compare text.lower() == \"bye\" instead of text == \"bye\"?"
    options: ["It makes the loop faster", "Because strings must be lower case", "So BYE, Bye and bye all end the chat"]
    answer: 2
  - q: "What does break do inside a while loop?"
    options: ["Skips to the next round", "Leaves the loop immediately", "Raises an error"]
    answer: 1
---
Chatbots look like magic, but the core of every one is a loop: **listen, think, answer, repeat**. In this project you will build a chatbot from nothing, one small step at a time, and end with a bot that remembers you, understands sentences by scoring them, and reports how confident it was. No libraries needed, just Python.

## Where we are

Nowhere yet: this is the first step. We start with the simplest bot there is, an **echo bot**. It greets you, repeats whatever you type, and leaves when you say `bye`.

## What we will add, and why

Every later feature (rules, memory, intents, commands) plugs into this same loop, so getting the loop right now matters. We need three ingredients: a way to read what the user types, a loop that runs until the user wants to stop, and a check that spots the word `bye`.

> **How the conversation works in this course.** Normally you would type your lines in a terminal. Here the lesson feeds a scripted conversation to your program (open the **Input** tab to see it and change it). Because a script does not show up on screen like typing does, our `listen()` helper prints each line as `You: ...` itself. That also gives you a readable transcript, and it makes the output exactly the same every time, which is how the course checks your work.

## Guided walk-through

**1. Reading a line.** `input()` waits for one line of text and returns it as a string. `.strip()` removes spaces at both ends, so `"  hello  "` becomes `"hello"`:

```python
text = input().strip()
```

**2. Wrap it in a function.** A function gives the idea a name and lets us improve it later in one place. Our `listen()` reads, prints the `You:` line, and returns the text:

```python
def listen():
    text = input().strip()
    print("You: " + text)
    return text
```

`return text` hands the value back to whoever called the function: `line = listen()`.

**3. The loop.** `while True:` repeats forever. The only way out is `break`:

```python
while True:
    text = listen()
    if text.lower() == "bye":
        print("Bot: Goodbye!")
        break
    print("Bot: You said: " + text)
```

Step through it: read a line; if it is `bye`, say goodbye and `break` (jump out of the loop); otherwise print the echo and go around again.

**4. Why `.lower()`?** `"BYE".lower()` is `"bye"`. Comparing the lower-cased text means `Bye`, `BYE` and `bye` all work, because users do not type exactly what you expect. This habit (normalising input before comparing) is the seed of everything the bot will do later.

> **Watch out:**
> - Forgetting the colon after `while True` or `if ...`: `SyntaxError: expected ':'`.
> - Indentation matters. Everything inside the loop must be indented by the same amount, otherwise you get `IndentationError: expected an indented block`.
> - Using `=` instead of `==` in the check: `SyntaxError: invalid syntax. Maybe you meant '==' or ':=' instead of '='?`.
> - Forgetting `break` creates an infinite loop: the bot never stops saying `You said: ...`. If the script runs out of input you get `EOFError: EOF when reading a line` (we will handle that properly in the last step).
> - `print("Bot: You said:", text)` puts an extra space in different places than `+`. Match the expected output character by character.

> **Your turn:** complete `listen()` (read, strip, print `You: <text>`, return) and write the loop: greet once at the start (already there), echo every line as `Bot: You said: <line>`, and on `bye` (in any capitals) print `Bot: Goodbye!` and leave the loop.
