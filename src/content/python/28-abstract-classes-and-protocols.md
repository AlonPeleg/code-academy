---
title: Abstract classes and protocols
summary: Define contracts with abc and typing.Protocol, and understand duck typing in Python.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      from abc import ABC, abstractmethod
      from typing import Protocol, runtime_checkable


      # 1. Shape must be an abstract base class. It needs an abstract method
      #    area(self) and a normal method describe(self) that returns text like
      #    "rectangle with area 12" (using self.name and self.area()).
      class Shape:
          pass


      # 2. Rectangle and Square are real shapes. Each has a class attribute
      #    name ("rectangle" / "square") and implements area().
      class Rectangle:
          def __init__(self, width, height):
              self.width = width
              self.height = height


      class Square:
          def __init__(self, side):
              self.side = side


      class Incomplete(Shape):
          name = "incomplete"      # forgot area() on purpose


      # 3. Speaker is a Protocol (a structural contract) for anything that has a
      #    speak(self) -> str method. Make it checkable with isinstance.
      class Speaker:
          pass


      class Dog:
          def speak(self):
              return "Woof"


      class Robot:
          def speak(self):
              return "Beep"


      class Rock:
          pass


      for cls in (Shape, Incomplete):
          try:
              cls()
          except TypeError:
              print("cannot instantiate", cls.__name__)

      shapes = [Rectangle(3, 4), Square(5)]
      for shape in shapes:
          print(shape.describe())
      print("total area:", sum(s.area() for s in shapes))

      for thing in (Dog(), Robot(), Rock()):
          if isinstance(thing, Speaker):
              print(thing.speak())
          else:
              print(type(thing).__name__, "is silent")
check:
  output: |
    cannot instantiate Shape
    cannot instantiate Incomplete
    rectangle with area 12
    square with area 25
    total area: 37
    Woof
    Beep
    Rock is silent
  code:
    - { pattern: 'class\s+Shape\s*\(\s*ABC\s*\)', message: "Make Shape inherit from ABC." }
    - { pattern: '@abstractmethod', message: "Mark area with @abstractmethod." }
    - { pattern: 'class\s+Speaker\s*\(\s*Protocol\s*\)', message: "Make Speaker inherit from Protocol." }
    - { pattern: '@runtime_checkable', message: "Put @runtime_checkable above Speaker so isinstance works." }
hints:
  - "An abstract class inherits from ABC and marks the methods that every subclass must provide with a decorator. Python then refuses to create objects of classes that still have missing methods. A Protocol describes a shape by method names only, subclasses do not have to inherit from it."
  - "class Shape(ABC): with @abstractmethod above def area(self): ... and a normal def describe(self) that returns f\"{self.name} with area {self.area()}\". Rectangle and Square inherit from Shape. For the contract: @runtime_checkable above class Speaker(Protocol): with def speak(self) -> str: ..."
  - "class Shape(ABC):     @abstractmethod     def area(self): ...     def describe(self): return f\"{self.name} with area {self.area()}\"   class Rectangle(Shape):     name = 'rectangle'     def area(self): return self.width * self.height   @runtime_checkable class Speaker(Protocol):     def speak(self) -> str: ..."
solution:
  - name: main.py
    code: |
      from abc import ABC, abstractmethod
      from typing import Protocol, runtime_checkable


      class Shape(ABC):
          name = "shape"

          @abstractmethod
          def area(self):
              """Every concrete shape must return its area."""

          def describe(self):
              return f"{self.name} with area {self.area()}"


      class Rectangle(Shape):
          name = "rectangle"

          def __init__(self, width, height):
              self.width = width
              self.height = height

          def area(self):
              return self.width * self.height


      class Square(Shape):
          name = "square"

          def __init__(self, side):
              self.side = side

          def area(self):
              return self.side ** 2


      class Incomplete(Shape):
          name = "incomplete"      # forgot area() on purpose


      @runtime_checkable
      class Speaker(Protocol):
          def speak(self) -> str:
              ...


      class Dog:
          def speak(self):
              return "Woof"


      class Robot:
          def speak(self):
              return "Beep"


      class Rock:
          pass


      for cls in (Shape, Incomplete):
          try:
              cls()
          except TypeError:
              print("cannot instantiate", cls.__name__)

      shapes = [Rectangle(3, 4), Square(5)]
      for shape in shapes:
          print(shape.describe())
      print("total area:", sum(s.area() for s in shapes))

      for thing in (Dog(), Robot(), Rock()):
          if isinstance(thing, Speaker):
              print(thing.speak())
          else:
              print(type(thing).__name__, "is silent")
quiz:
  - q: What happens when you call Shape() and Shape has an abstract method?
    options: ["It works, and calling the abstract method returns None", "Python raises TypeError because the class is abstract", "Python raises NameError"]
    answer: 1
  - q: What is the difference between an ABC and a Protocol?
    options: ["A subclass must inherit from an ABC, a Protocol only needs matching methods (structural typing)", "A Protocol can hold data but an ABC cannot", "There is no difference"]
    answer: 0
  - q: What does duck typing mean?
    options: ["Every class must inherit from Duck", "An object is used for what it can do (its methods), not for what it is called or inherits from", "Python checks all types before the program starts"]
    answer: 1
    explain: "If it walks like a duck and quacks like a duck, treat it as a duck."
  - q: Why does isinstance(x, Speaker) need @runtime_checkable?
    options: ["Without it Protocol classes can only be used by type checkers, and isinstance raises TypeError", "It makes the protocol faster", "It turns the protocol into an ABC"]
    answer: 0
---

Sometimes you want to say "every shape must be able to compute its area" or "anything I pass in must have a `speak()` method". Python gives you two tools for such **contracts**: abstract base classes (`abc`) and protocols (`typing.Protocol`). They catch mistakes early and make large programs easier to extend.

## Duck typing first

Python normally does not care what class an object has, only what it can do:

```python
def announce(thing):
    print(thing.speak())      # works for ANY object that has speak()
```

This is called **duck typing**: "if it quacks like a duck, treat it as a duck". It is flexible, but a typo or a forgotten method only shows up at the moment the code runs, with `AttributeError: 'Rock' object has no attribute 'speak'`. Contracts let you find that earlier.

## Abstract base classes with abc

An **abstract class** is a half-finished class that exists only to be inherited from. It declares methods that subclasses **must** implement:

```python
from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def sound(self):
        ...

    def intro(self):                 # a normal method, inherited as is
        return "I say " + self.sound()

class Cat(Animal):
    def sound(self):
        return "meow"

print(Cat().intro())    # prints: I say meow
Animal()                # TypeError: Can't instantiate abstract class Animal ...
```

Piece by piece:

- Inherit from `ABC` to enable the machinery.
- `@abstractmethod` marks a method that has no real body here. The body is often `...` (a literal that means "nothing yet") or a docstring.
- Python refuses to create an object while **any** abstract method is missing, even in a subclass. A class that implements all of them is called **concrete**.
- Abstract classes can still hold normal methods and attributes, so shared code lives in one place (the *template method* idea: `intro` uses the abstract `sound`).

The error appears when you create the object, not when you define the class, so mistakes show up as soon as the code runs once.

## Protocols: contracts by shape

With an ABC the subclass must inherit. A **Protocol** (Python 3.8+) describes the methods an object needs, and any class that has them qualifies, **without inheriting**. This is called structural typing, duck typing with a written contract.

```python
from typing import Protocol

class Speaker(Protocol):
    def speak(self) -> str:
        ...

def announce(thing: Speaker) -> None:
    print(thing.speak())
```

Python itself does not check the annotation when you call `announce`. The checking is done by tools such as `mypy` or your editor. If you also want `isinstance(x, Speaker)` at run time, add the decorator `@runtime_checkable` above the class. Be aware that such a check only tests that the **method names exist**, not their signatures or return types.

## Which one should you pick?

- Use an **ABC** when you own the class family and want shared code plus a hard error if a method is missing.
- Use a **Protocol** when you describe what a function accepts and the objects come from different places (including libraries you cannot change).

> **Watch out:**
> - Forgetting `ABC` in the class line: `@abstractmethod` then does nothing and `Shape()` happily works.
> - Forgetting to implement one abstract method in a subclass: `TypeError: Can't instantiate abstract class Incomplete without an implementation for abstract method 'area'`.
> - Using `isinstance` with a Protocol that lacks `@runtime_checkable` gives `TypeError: Instance and class checks can only be used with @runtime_checkable protocols`.
> - Do not instantiate a Protocol class itself: `TypeError: Protocols cannot be instantiated`.
> - Protocols are not enforced when calling: passing the wrong object fails only inside the function, unless a type checker looks at the code.

## Going further

Add an abstract property (`@property` above `@abstractmethod`) or write a `Circle` shape using `math.pi` and round the result. Notice that adding `Circle` does not require editing any existing code, which is the whole point of programming against a contract.

> **Your turn:** make `Shape` an abstract class with an abstract `area` and a normal `describe`, implement `Rectangle` and `Square`, and turn `Speaker` into a runtime checkable `Protocol` so that `Dog` and `Robot` count as speakers without inheriting from it.
