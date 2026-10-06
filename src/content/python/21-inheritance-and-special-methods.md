---
title: Inheritance, special methods and properties
summary: Extend classes with super(), make objects printable and comparable, and guard attributes with properties.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      class Shape:
          def area(self):
              raise NotImplementedError("subclasses must implement area")

          def __str__(self):
              return f"{type(self).__name__} with area {self.area():.2f}"

          # 4. Add __eq__(self, other): two shapes are equal when their areas are equal.
          # 5. Add __lt__(self, other): a shape is "less than" another when its area is smaller.
          #    (sorted() uses __lt__)


      class Rectangle(Shape):
          def __init__(self, width, height):
              self.width = width
              self.height = height

          # 1. Add the method area that returns width * height.

          # 2. Add a property perimeter (use @property) that returns 2 * (width + height).


      # 3. Write class Square, built on Rectangle. Its __init__ takes one side
      #    and calls super().__init__(side, side).


      shapes = [Rectangle(3, 4), Square(2), Rectangle(1, 5)]
      for s in sorted(shapes):
          print(s)
      print(Square(2) == Rectangle(2, 2))
      print(Rectangle(3, 4).perimeter)
      print(Square(2).perimeter)
check:
  output: |
    Square with area 4.00
    Rectangle with area 5.00
    Rectangle with area 12.00
    True
    14
    8
  code:
    - { pattern: 'super\(\)\.__init__', message: "Square should call super().__init__(...)." }
    - { pattern: '@property', message: "Use @property for perimeter." }
    - { pattern: 'def\s+__lt__', message: "Define __lt__ so sorted() can compare shapes." }
    - { pattern: 'def\s+__eq__', message: "Define __eq__." }
hints:
  - "Special methods have double underscores and let your objects work with built-in syntax: __lt__ powers < and sorted(), __eq__ powers ==. A property makes a method look like an attribute: you write shape.perimeter without brackets."
  - "In Shape: def __eq__(self, other): return self.area() == other.area() and def __lt__(self, other): return self.area() < other.area(). In Rectangle put @property above def perimeter(self). Square: class Square(Rectangle): def __init__(self, side): super().__init__(side, side)."
  - "class Rectangle(Shape):     def __init__(self, width, height): ...     def area(self): return self.width * self.height     @property     def perimeter(self): return 2 * (self.width + self.height)   class Square(Rectangle):     def __init__(self, side):         super().__init__(side, side)"
solution:
  - name: main.py
    code: |
      class Shape:
          def area(self):
              raise NotImplementedError("subclasses must implement area")

          def __str__(self):
              return f"{type(self).__name__} with area {self.area():.2f}"

          def __eq__(self, other):
              return self.area() == other.area()

          def __lt__(self, other):
              return self.area() < other.area()


      class Rectangle(Shape):
          def __init__(self, width, height):
              self.width = width
              self.height = height

          def area(self):
              return self.width * self.height

          @property
          def perimeter(self):
              return 2 * (self.width + self.height)


      class Square(Rectangle):
          def __init__(self, side):
              super().__init__(side, side)


      shapes = [Rectangle(3, 4), Square(2), Rectangle(1, 5)]
      for s in sorted(shapes):
          print(s)
      print(Square(2) == Rectangle(2, 2))
      print(Rectangle(3, 4).perimeter)
      print(Square(2).perimeter)
quiz:
  - q: What does super().__init__(side, side) do inside Square?
    options: ["Deletes the parent class", "Creates a second Square", "Runs the parent class's __init__ so the inherited setup happens"]
    answer: 2
  - q: Which special method does print(obj) use to get the text?
    options: ["__str__", "__print__", "__text__"]
    answer: 0
  - q: What does @property let you do?
    options: ["Make a method private", "Call a method without brackets, as if it were an attribute", "Run a method once at import time"]
    answer: 1
  - q: "Which special method must a class define so that sorted(list_of_objects) can order them (when no key is given)?"
    options: ["__len__", "__add__", "__repr__", "__lt__"]
    answer: 3
---

Inheritance lets one class reuse and extend another. Special methods (the ones with double underscores, nicknamed "dunder" methods) let your own classes plug into Python's built-in syntax: `print`, `==`, `<`, `len`, `+` and more. Properties let you compute or guard attributes while keeping a clean `obj.name` syntax.

## Inheritance and super()

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):             # Dog is built on Animal
    def __init__(self, name, tricks):
        super().__init__(name)  # let Animal do its part of the setup
        self.tricks = tricks

    def speak(self):            # override: replace the parent's version
        return "Woof"
```

- `class Dog(Animal)` means Dog inherits everything from Animal.
- A method with the same name in the child **overrides** the parent's.
- `super()` is a way to reach the parent class. `super().__init__(name)` makes sure the parent's setup runs; forgetting it means `self.name` is never set.

You can test relationships with `isinstance(rex, Animal)` (True for a Dog).

## An abstract-ish base class

A parent can declare that children must supply a method by raising `NotImplementedError`:

```python
class Shape:
    def area(self):
        raise NotImplementedError("subclasses must implement area")
```

If a child forgets `area`, calling it fails clearly instead of returning nonsense.

## Special methods

Python turns syntax into method calls. When you write `print(x)`, Python calls `x.__str__()`. When you write `a == b`, it calls `a.__eq__(b)`.

| You write | Python calls | Typical use |
|---|---|---|
| `print(x)`, `str(x)` | `__str__` | friendly text |
| `repr(x)` | `__repr__` | developer text, shown in lists |
| `a == b` | `__eq__` | equality |
| `a < b` | `__lt__` | ordering, `sorted()` |
| `len(x)` | `__len__` | size |
| `a + b` | `__add__` | addition |

```python
class Money:
    def __init__(self, cents):
        self.cents = cents
    def __eq__(self, other):
        return self.cents == other.cents
    def __lt__(self, other):
        return self.cents < other.cents
    def __str__(self):
        return f"${self.cents / 100:.2f}"

print(sorted([Money(500), Money(150)])[0])    # prints: $1.50
```

`sorted()` only needs `__lt__`, which is why defining it is enough to sort your objects.

## Properties

A **property** is a method you read like an attribute:

```python
class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def diameter(self):
        return self.radius * 2

c = Circle(5)
print(c.diameter)    # prints: 10   (no brackets)
```

Properties can also guard values with a setter:

```python
    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value < 0:
            raise ValueError("radius cannot be negative")
        self._radius = value
```

The underscore in `_radius` is a convention meaning "internal, use the property instead".

> **Watch out:**
> - Forgetting `super().__init__(...)`: later you get `AttributeError: 'Square' object has no attribute 'width'`.
> - Calling a property with brackets: `shape.perimeter()` raises `TypeError: 'int' object is not callable`.
> - Defining `__eq__` without care: Python then sets `__hash__` to `None`, so such objects cannot be dictionary keys or set members unless you also define `__hash__`.
> - Comparing with an object of another type in `__eq__` or `__lt__` raises `AttributeError`. Real code checks `isinstance(other, Shape)` first.
> - A property setter must use another name (`_radius`); `self.radius = value` inside the setter calls itself forever (`RecursionError`).

> **Your turn:** complete the shape classes. `Rectangle` needs `area` and a `perimeter` property, `Square` calls `super().__init__`, and `Shape` needs `__eq__` and `__lt__` comparing areas. Then the sorted shapes should print from the smallest area to the largest.
