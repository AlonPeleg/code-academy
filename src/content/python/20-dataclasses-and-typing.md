---
title: Dataclasses and type hints
summary: Declare data-holding classes in a few lines and document types with annotations.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      from dataclasses import dataclass

      # 1. Turn Product into a dataclass (decorator on the line above class).
      # 2. Declare the fields with type hints:
      #      name: str, price: float, qty: int with a default of 1
      # 3. Add a method total(self) -> float that returns price * qty.
      class Product:
          pass


      pen = Product("Pen", 1.5, 4)
      book = Product("Notebook", 3.25, 2)
      sticker = Product("Sticker", 0.5)

      print(pen)
      print(pen == Product("Pen", 1.5, 4))
      print(sticker.qty)
      items = [pen, book, sticker]
      print(sum(p.total() for p in items))
check:
  output: |
    Product(name='Pen', price=1.5, qty=4)
    True
    1
    13.0
  code:
    - { pattern: '@dataclass', message: "Put @dataclass above the class." }
    - { pattern: 'name\s*:\s*str', message: "Declare name: str." }
    - { pattern: 'qty\s*:\s*int\s*=\s*1', message: "Declare qty: int = 1." }
    - { pattern: 'def\s+total', message: "Add the total method." }
hints:
  - "A dataclass is a normal class where Python writes __init__, __repr__ and __eq__ for you from the annotated fields listed in the class body."
  - "Write @dataclass above class Product. Inside list the fields, one per line, as name: str then price: float then qty: int = 1. The field with a default value must come last. Then def total(self) -> float: return self.price * self.qty."
  - "@dataclass   class Product:     name: str     price: float     qty: int = 1      def total(self) -> float:         return self.price * self.qty"
solution:
  - name: main.py
    code: |
      from dataclasses import dataclass


      @dataclass
      class Product:
          name: str
          price: float
          qty: int = 1

          def total(self) -> float:
              return self.price * self.qty


      pen = Product("Pen", 1.5, 4)
      book = Product("Notebook", 3.25, 2)
      sticker = Product("Sticker", 0.5)

      print(pen)
      print(pen == Product("Pen", 1.5, 4))
      print(sticker.qty)
      items = [pen, book, sticker]
      print(sum(p.total() for p in items))
quiz:
  - q: What does the @dataclass decorator generate for you?
    options: ["Only a __del__ method", "Methods such as __init__, __repr__ and __eq__ based on the annotated fields", "A database table"]
    answer: 1
  - q: "In  qty: int = 1  what is  int  ?"
    options: ["A type hint documenting the intended type", "A function that converts the value at run time", "The default value"]
    answer: 0
  - q: Does Python stop you from writing Product(1, 2, 3) when name is annotated as str?
    options: ["Yes, it raises TypeError immediately", "No, hints are not enforced at run time; tools like mypy check them", "Yes, but only for numbers"]
    answer: 1
  - q: Why must fields with defaults come after fields without defaults?
    options: ["It is only a style rule", "Defaults are always sorted first", "The generated __init__ could otherwise have a non-default parameter after a default one, which Python forbids"]
    answer: 2
---

Many classes exist only to hold a few values: a product, a point, a user. Writing `__init__`, `__repr__` and `__eq__` by hand for each one is boring and easy to get wrong. A **dataclass** lets you list the fields and have Python write the boring methods for you. Along the way you will meet **type hints**, a way to say what kind of value each variable is supposed to hold.

## Type hints

A type hint is a label after a colon:

```python
age: int = 30
name: str = "Ava"

def double(x: int) -> int:
    return x * 2
```

`x: int` says the parameter should be an int, and `-> int` says the function returns one. Common hints: `int`, `float`, `str`, `bool`, `list[int]`, `dict[str, int]`, and `int | None` for "an int or nothing".

The important thing to know: **Python does not enforce hints when the program runs**. `double("ab")` still runs and gives `'abab'`. Hints are documentation for humans, editors and checking tools such as `mypy`, which warn you before you run the code.

## The problem dataclasses solve

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

print(Point(1, 2))                 # prints something like: <__main__.Point object at 0x7f...>
print(Point(1, 2) == Point(1, 2))  # prints: False
```

The default printout is useless and two points with the same numbers are not equal, because by default `==` asks "is it the very same object?".

## The dataclass version

```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int
    y: int

print(Point(1, 2))                 # prints: Point(x=1, y=2)
print(Point(1, 2) == Point(1, 2))  # prints: True
```

The decorator reads the annotated names in the class body and generates `__init__(self, x, y)`, a readable `__repr__` and an `__eq__` that compares field by field. You can still add your own methods like any class.

## Defaults and mutable fields

```python
from dataclasses import dataclass, field

@dataclass
class Order:
    customer: str
    items: list[str] = field(default_factory=list)
    paid: bool = False
```

Fields with a plain default (`paid: bool = False`) must come **after** fields without one. For lists, dicts and sets you must use `field(default_factory=list)`, so that each object gets its own fresh list. Writing `items: list = []` is rejected with `ValueError: mutable default <class 'list'> for field items is not allowed: use default_factory`.

## More options

- `@dataclass(frozen=True)` makes objects read-only, which also allows them as dictionary keys.
- `@dataclass(order=True)` generates `<`, `>` comparing fields in order, so a list of them can be sorted.
- `dataclasses.asdict(obj)` converts an object into a dictionary.

> **Watch out:**
> - Forgetting the annotation: `name = "x"` without `: str` is just a class variable, not a field.
> - A field with a default before a field without: `TypeError: non-default argument 'price' follows default argument`.
> - Mutable defaults like `[]`: use `field(default_factory=list)`.
> - Expecting type hints to validate input: `Product(1, "cheap")` is accepted without complaint.
> - Forgetting `@dataclass`: the class then has no generated `__init__` and `Product("Pen", 1.5, 4)` fails with `TypeError: Product() takes no arguments`.

## Going further

Add `@dataclass(order=True)` and sort the products with `sorted(items)`, or turn a product into a dictionary with `asdict`.

> **Your turn:** make `Product` a dataclass with the fields `name: str`, `price: float` and `qty: int = 1`, and add a `total()` method returning `price * qty`. The code below should print the repr, an equality check, the default quantity and the total of all items.
