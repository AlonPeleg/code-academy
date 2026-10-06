---
title: Classes and objects
summary: Bundle data and behaviour together by writing your own type.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      class Account:
          # 1. Add the special setup method (the constructor). It receives owner and
          #    balance (default 0) and stores both on the object.
          # 2. Add a method deposit(amount) that adds amount to the balance.
          # 3. Add a method withdraw(amount). If amount is bigger than the balance,
          #    print "Insufficient funds" and change nothing. Otherwise subtract it.
          pass


      acct = Account("Ava", 100)
      acct.deposit(50)
      acct.withdraw(30)
      acct.withdraw(500)
      print(f"{acct.owner}: {acct.balance}")
check:
  output: |
    Insufficient funds
    Ava: 120
  code:
    - { pattern: 'class\s+Account', message: "Define the class Account." }
    - { pattern: 'def\s+__init__\s*\(\s*self', message: "Add an __init__ method that starts with self." }
    - { pattern: 'self\.balance', message: "Store the balance on the object with self.balance." }
hints:
  - "A class is a blueprint. Methods are functions inside the class, and their first parameter is always self, which stands for the object being used."
  - "The setup method is named __init__ (two underscores each side). Inside it write self.owner = owner and self.balance = balance. In the other methods use self.balance to read and change the value."
  - "def __init__(self, owner, balance=0): self.owner = owner; self.balance = balance     def deposit(self, amount): self.balance += amount     def withdraw(self, amount): if amount > self.balance: print(\"Insufficient funds\") else: self.balance -= amount"
solution:
  - name: main.py
    code: |
      class Account:
          def __init__(self, owner, balance=0):
              self.owner = owner
              self.balance = balance

          def deposit(self, amount):
              self.balance += amount

          def withdraw(self, amount):
              if amount > self.balance:
                  print("Insufficient funds")
              else:
                  self.balance -= amount


      acct = Account("Ava", 100)
      acct.deposit(50)
      acct.withdraw(30)
      acct.withdraw(500)
      print(f"{acct.owner}: {acct.balance}")
quiz:
  - q: What is the relationship between a class and an object?
    options: ["They are the same thing", "A class is a blueprint, an object is one thing built from it", "An object is a blueprint for classes"]
    answer: 1
  - q: What does self mean inside a method?
    options: ["The object the method was called on", "The class name", "A reserved word that is optional"]
    answer: 0
  - q: When does __init__ run?
    options: ["Never, you call it by hand", "At the end of the program", "Automatically when a new object is created"]
    answer: 2
  - q: How do you create an object from a class named Dog?
    options: ["Dog()", "new Dog", "create Dog"]
    answer: 0
---

So far your data (numbers, text, lists) and your code (functions) lived separately. A **class** lets you bundle them: a single thing that knows both what it holds and what it can do. This idea, called object-oriented programming, is used in almost every big Python project.

## A blueprint and the things built from it

Think of a class as a **blueprint** for a house and an **object** (also called an **instance**) as an actual house built from it. You can build many houses from one blueprint, and each has its own colour and number of rooms.

```python
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        print(f"{self.name} says woof")

rex = Dog("Rex")
fido = Dog("Fido")
rex.bark()       # prints: Rex says woof
fido.bark()      # prints: Fido says woof
```

## The parts

- `class Dog:` starts the blueprint. Class names use CapitalizedWords.
- `def __init__(self, name):` is the **constructor**, a special method that runs automatically every time you create an object (`Dog("Rex")`). The double underscores on each side mark it as special.
- `self` is the object itself. Python passes it in automatically as the first parameter of every method; you never write it when calling. In `rex.bark()`, `self` is `rex`.
- `self.name = name` creates an **attribute**: a variable stored on the object. Each object has its own copy.
- `bark` is a **method**: a function that lives in the class and works on `self`.
- `Dog("Rex")` creates a new object. Reading an attribute uses a dot: `rex.name`.

## Objects remember their state

Methods can change the attributes, and the change sticks to that object:

```python
class Counter:
    def __init__(self):
        self.value = 0

    def add(self):
        self.value += 1

c = Counter()
c.add()
c.add()
print(c.value)    # prints: 2
```

If you made a second counter, `d = Counter()`, it would still be at 0. Each object keeps its own state.

## Why bother?

Compare a bank account stored as separate variables with one object that knows how to deposit, withdraw and protect itself from overdrawing. All the rules live in one place, and the rest of the program just says `acct.withdraw(30)`.

You have been using objects all along: a string is an object of type `str` with methods like `.upper()`, and a list is an object with `.append()`.

> **Watch out:**
> - Forgetting `self` in a method definition: `def bark():` gives `TypeError: bark() takes 0 positional arguments but 1 was given`.
> - Forgetting `self.` when storing: writing `name = name` inside `__init__` stores nothing on the object. Use `self.name = name`.
> - Misspelling `__init__` (for example `_init_`) means it never runs and you see `TypeError: Dog() takes no arguments`.
> - Using an attribute that was never set gives `AttributeError: 'Dog' object has no attribute 'age'`.

> **Your turn:** complete the `Account` class with a constructor (`owner`, `balance=0`), a `deposit` method and a `withdraw` method that refuses to overdraw. The lines below the class use it.
