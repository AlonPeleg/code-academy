---
title: Default arguments, keywords and scope
summary: Make functions flexible with default values and keyword arguments, and learn where variables live.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # Write a function greet(name, greeting, punctuation) that returns
      #   <greeting>, <name><punctuation>      (use an f-string)
      # Give `greeting` the default value "Hello" and `punctuation` the default "!"
      # The calls below must then work without changing them.


      print(greet("Ava"))
      print(greet("Noam", "Hi"))
      print(greet("Maya", punctuation="?"))
      print(greet(greeting="Hey", name="Dana"))
check:
  output: |
    Hello, Ava!
    Hi, Noam!
    Hello, Maya?
    Hey, Dana!
  code:
    - { pattern: 'def\s+greet\s*\(', message: "Define the function greet with def." }
    - { pattern: 'greeting\s*=\s*["'']Hello["'']', message: 'Give greeting the default value "Hello" in the def line.' }
    - { pattern: 'punctuation\s*=\s*["'']!["'']', message: 'Give punctuation the default value "!" in the def line.' }
hints:
  - "A default value is written in the def line with an equals sign: a parameter that has a default becomes optional in calls. Parameters without defaults must come first."
  - 'The def line looks like def greet(name, greeting="Hello", punctuation="!"): and the body returns an f-string combining the three parameters.'
  - 'def greet(name, greeting="Hello", punctuation="!"):   return f"{greeting}, {name}{punctuation}"'
solution:
  - name: main.py
    code: |
      def greet(name, greeting="Hello", punctuation="!"):
          return f"{greeting}, {name}{punctuation}"


      print(greet("Ava"))
      print(greet("Noam", "Hi"))
      print(greet("Maya", punctuation="?"))
      print(greet(greeting="Hey", name="Dana"))
quiz:
  - q: What is a default argument?
    options: ["A value used when the caller does not give one", "A required argument", "The first argument"]
    answer: 0
  - q: "Given  def f(a, b=2):  which call is valid?"
    options: ["f(b=5)", "f()", "f(1)"]
    answer: 2
  - q: A variable created inside a function is...
    options: ["Visible everywhere in the program", "Only visible inside that function", "Deleted when the program starts"]
    answer: 1
  - q: "Why is  def f(a=1, b):  an error?"
    options: ["Defaults are not allowed", "Parameters with defaults must come after those without", "The names are too short"]
    answer: 1
---

Functions become much more pleasant when callers do not have to spell out every single detail every time. In this lesson you will learn about default values, keyword arguments, and **scope**, the rule for where a variable can be seen.

## Default arguments

Give a parameter a default value with `=` in the `def` line. The caller may then leave it out:

```python
def power(base, exponent=2):
    return base ** exponent

print(power(5))       # prints: 25   (exponent is 2)
print(power(2, 10))   # prints: 1024
```

Rule: parameters **with** defaults must come **after** the ones without. `def f(a=1, b):` is a `SyntaxError`.

## Keyword arguments

When calling, you can name the parameter you are filling. These are **keyword arguments**:

```python
def describe(name, age=0, city="unknown"):
    return f"{name}, {age}, {city}"

print(describe("Ava", 21))                 # prints: Ava, 21, unknown
print(describe("Noam", city="Haifa"))      # prints: Noam, 0, Haifa
print(describe(city="Eilat", name="Dana")) # prints: Dana, 0, Eilat
```

Keywords have two big benefits. You can skip optional parameters in the middle (above, we jumped straight to `city`), and the call explains itself: `describe("Noam", city="Haifa")` is easier to read than `describe("Noam", 0, "Haifa")`. Once you start using keywords in a call, the rest must be keywords too.

## Scope

**Scope** is the area of the program where a name can be used.

```python
rate = 0.5                  # global: created outside any function

def price_after_discount(price):
    discount = price * rate # reads the global rate: fine
    return price - discount # discount only exists inside this function

print(price_after_discount(10))   # prints: 5.0
print(discount)                   # NameError: name 'discount' is not defined
```

- Variables and parameters created **inside** a function are **local**. They are created when the function runs and vanish when it ends.
- Variables created **outside** are **global**. A function can read them.
- Assigning to a name inside a function creates a **new local** variable, even if a global with the same name exists:

```python
count = 0

def add_one():
    count = 1        # a new local variable, the global stays 0

add_one()
print(count)         # prints: 0
```

The `global` keyword can override that, but it makes code hard to follow. The cleaner habit is: **pass values in as arguments and get results out with `return`.**

## Danger: mutable defaults

Never use an empty list as a default, as in `def add(item, bag=[])`. The list is created once and shared by all calls. Use `bag=None` and create a new list inside when needed.

> **Watch out:**
> - Non-default parameter after a default: `SyntaxError: non-default argument follows default argument`.
> - Giving the same value twice: `greet("Ava", name="Ava")` gives `TypeError: greet() got multiple values for argument 'name'`.
> - A misspelt keyword gives `TypeError: greet() got an unexpected keyword argument 'greting'`.
> - Reading a local variable outside its function gives `NameError`.
> - Changing a global inside a function without `global` gives `UnboundLocalError` when you also read it first.

> **Your turn:** write `greet(name, greeting="Hello", punctuation="!")` returning an f-string, so all four calls in the editor print the expected lines.
