---
title: Stacks and queues
summary: Last-in-first-out and first-in-first-out containers, used for balanced brackets and simulations.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      from collections import deque


      # 1. is_balanced(text): True when every bracket ( [ { is closed by the matching
      #    ) ] } in the right order. Other characters are ignored.
      #    Use a plain list as a STACK:
      #      - opening bracket: push it on the stack
      #      - closing bracket: the top of the stack must be its partner
      #        (an empty stack, or a different bracket on top, means False)
      #    At the end the stack must be empty.
      def is_balanced(text):
          pass


      # 2. hot_potato(names, passes): a queue game.
      #    Use a deque. Each round: pass the potato `passes` times
      #    (the person at the front goes to the back each time),
      #    then the person now at the front is OUT.
      #    Keep going until one player is left.
      #    Return a tuple (list of names in the order they went out, the winner).
      def hot_potato(names, passes):
          pass


      print(is_balanced("(a[b]{c})"))
      print(is_balanced("(]"))
      print(is_balanced("(("))
      print(is_balanced("x)"))
      print(is_balanced("{[()()]}"))
      print(is_balanced(""))
      print(hot_potato(["Ana", "Ben", "Cy", "Dee", "Eli"], 3))
check:
  output: |
    True
    False
    False
    False
    True
    True
    (['Dee', 'Cy', 'Eli', 'Ben'], 'Ana')
  code:
    - { pattern: 'deque\s*\(', message: "Create the queue with deque(...)." }
    - { pattern: 'popleft\s*\(', message: "Take people from the front of the queue with popleft()." }
    - { pattern: '\.pop\s*\(', message: "Take the top of the stack with .pop()." }
hints:
  - "A stack is a list where you only append to the end and pop from the end. A queue is a deque where you add at the right (append) and remove from the left (popleft)."
  - "is_balanced: pairs = {')': '(', ']': '[', '}': '{'}. For each character: if it is an opener, stack.append(it); elif it is in pairs, return False when the stack is empty or stack.pop() != pairs[ch]. Finally return not stack. hot_potato: q = deque(names), then while len(q) > 1 pass and eliminate."
  - "for _ in range(passes):   q.append(q.popleft())      then   out.append(q.popleft())      and finish with   return out, q[0]"
solution:
  - name: main.py
    code: |
      from collections import deque


      def is_balanced(text):
          pairs = {")": "(", "]": "[", "}": "{"}
          stack = []
          for ch in text:
              if ch in "([{":
                  stack.append(ch)
              elif ch in pairs:
                  if not stack or stack.pop() != pairs[ch]:
                      return False
          return not stack


      def hot_potato(names, passes):
          q = deque(names)
          out = []
          while len(q) > 1:
              for _ in range(passes):
                  q.append(q.popleft())
              out.append(q.popleft())
          return out, q[0]


      print(is_balanced("(a[b]{c})"))
      print(is_balanced("(]"))
      print(is_balanced("(("))
      print(is_balanced("x)"))
      print(is_balanced("{[()()]}"))
      print(is_balanced(""))
      print(hot_potato(["Ana", "Ben", "Cy", "Dee", "Eli"], 3))
quiz:
  - q: "A stack is last in, first out. Which real-life thing behaves like a stack?"
    options: ["A queue at a shop", "A pile of plates", "A bookshelf"]
    answer: 1
  - q: "Why is a plain list a poor queue when you remove from the front with pop(0)?"
    options: ["Python forbids it", "It returns the wrong item", "Every remaining item has to shift, so it is O(n)"]
    answer: 2
    explain: "A deque removes from either end in O(1)."
  - q: "What is the stack for in the balanced-brackets algorithm?"
    options: ["It remembers the opening brackets that are still waiting to be closed", "It counts the characters", "It sorts the brackets"]
    answer: 0
  - q: "Which structure would you use to process print jobs in the order they arrive?"
    options: ["A stack", "A queue", "A set"]
    answer: 1
---

Some containers are defined not by what they hold but by **the order in which you take things out**. Two of them are everywhere in software: the **stack** and the **queue**. Learn them and you will recognise them in undo buttons, browser history, task schedulers and the way your own programs run.

## Stack: last in, first out (LIFO)

Think of a pile of plates. You add a plate on top, and you take a plate from the top. The plate that went on last comes off first.

```text
push 1    push 2    push 3    pop -> 3    pop -> 2
 [1]      [1,2]    [1,2,3]     [1,2]       [1]
                      ^ top
```

A Python list is already a stack. `append` pushes onto the end, `pop()` removes and returns the end:

```python
stack = []
stack.append("a")
stack.append("b")
stack.append("c")
print(stack.pop())   # prints: c
print(stack.pop())   # prints: b
print(stack)         # prints: ['a']
```

Both operations are O(1). Where do stacks live? The **undo** button of an editor (the last change is undone first), the back button of a browser, and the **call stack** of your own program: when a function calls another function, Python remembers where to come back to, last call first.

## Example: balanced brackets

Is `{[()()]}` correct? Is `(]`? Compilers and editors check this constantly. The rule: every opener must be closed by its partner, in the right order. A stack solves it neatly:

1. Read the text left to right.
2. An opening bracket: **push** it.
3. A closing bracket: the top of the stack must be its partner. If so, **pop** it. If the stack is empty or the top is a different bracket, the text is broken.
4. At the end the stack must be empty. Anything left over is an opener that never got closed.

```text
text: ( [ ] )
 (   push          stack: (
 [   push          stack: ( [
 ]   top is [ ok   stack: (
 )   top is ( ok   stack: (empty)  -> balanced
```

A dictionary of pairs keeps the code short: `pairs = {")": "(", "]": "[", "}": "{"}`. Given a closer, `pairs[closer]` is the opener it needs.

## Queue: first in, first out (FIFO)

A queue is a line at the shop: the first person to arrive is served first. You add at the back (**enqueue**) and remove from the front (**dequeue**).

A list is a poor queue: `items.pop(0)` removes the first item but then every other item must shift one place left, which costs O(n). The standard library offers **`collections.deque`** (say "deck", short for double-ended queue), which adds and removes at **both ends** in O(1):

```python
from collections import deque

q = deque(["Ana", "Ben"])
q.append("Cy")            # join the back of the line
print(q.popleft())        # prints: Ana   (front of the line leaves)
print(q)                  # prints: deque(['Ben', 'Cy'])
```

Queues model waiting: print jobs, customer-support tickets, and the order in which a web server handles requests. In lesson 10 a queue is the secret ingredient of breadth-first search.

## Simulation: hot potato

A classic queue exercise: players stand in a circle and pass a potato. After a fixed number of passes, the player holding it is out. Using a queue, "passing" means the front player goes to the back: `q.append(q.popleft())`. After the passes, `q.popleft()` removes whoever is at the front for good. Repeat until one remains. A circle of people maps perfectly onto a queue where the front always gets moved to the back.

> **Watch out:**
> - `stack.pop()` on an empty list raises `IndexError: pop from empty list`. Check `if stack` first.
> - `deque.popleft()` on an empty deque raises `IndexError: pop from an empty deque`.
> - A list has no `popleft`: `AttributeError: 'list' object has no attribute 'popleft'`. Only `deque` has it.
> - Returning `True` when the loop ends without checking the stack is empty accepts `((`.
> - Reading `stack[-1]` on an empty stack is also an `IndexError`. Test for emptiness first.

## Going further

Extend `is_balanced` to report the position of the first problem. Or implement a tiny undo history: keep a stack of previous versions of a string and pop to go back.

> **Your turn:** write `is_balanced(text)` with a list used as a stack, and `hot_potato(names, passes)` with a `deque`. The second returns a tuple of the elimination order and the winner.
