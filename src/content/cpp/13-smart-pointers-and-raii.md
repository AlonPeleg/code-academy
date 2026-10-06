---
title: Smart pointers and RAII
summary: Let objects clean up after themselves with unique_ptr and shared_ptr.
level: advanced
runner: remote
files:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <memory>
      #include <string>
      using namespace std;

      class Resource {
          string name_;

      public:
          Resource(const string& name) : name_(name) {
              cout << "acquire " << name_ << endl;
          }

          // 1. Add a destructor (~Resource) that prints  release <name>

          void use() const {
              cout << "using " << name_ << endl;
          }
      };

      int main() {
          // 2. Inside a block { ... }, create a unique_ptr<Resource> named r with
          //    make_unique<Resource>("file"), then call r->use().
          //    The resource must be released automatically at the closing brace.

          // 3. Create a shared_ptr<Resource> named a with make_shared<Resource>("shared").
          //    In an inner block make a second shared_ptr b = a and print
          //      count: <a.use_count()>
          //    After the inner block print the count again.

          cout << "end of main" << endl;
          return 0;
      }
check:
  output: |
    acquire file
    using file
    release file
    acquire shared
    count: 2
    count: 1
    end of main
    release shared
  code:
    - { pattern: 'make_unique\s*<\s*Resource\s*>', message: "Create the first resource with make_unique<Resource>(...)." }
    - { pattern: 'make_shared\s*<\s*Resource\s*>', message: "Create the second resource with make_shared<Resource>(...)." }
    - { pattern: 'use_count\s*\(', message: "Print a.use_count()." }
    - { pattern: '~Resource', message: "Write the destructor ~Resource()." }
hints:
  - "RAII means a resource is acquired in a constructor and released in the destructor. A smart pointer is an object that owns something on the heap and deletes it automatically when the smart pointer itself goes out of scope."
  - "The destructor is ~Resource() { cout << \"release \" << name_ << endl; }. unique_ptr<Resource> r = make_unique<Resource>(\"file\"); inside curly braces. For sharing, shared_ptr<Resource> b = a; copies the pointer and raises use_count to 2; leaving the inner block lowers it again."
  - "~Resource() { cout << \"release \" << name_ << endl; }   { auto r = make_unique<Resource>(\"file\"); r->use(); }   auto a = make_shared<Resource>(\"shared\");   { auto b = a; cout << \"count: \" << a.use_count() << endl; }   cout << \"count: \" << a.use_count() << endl;"
solution:
  - name: main.cpp
    code: |
      #include <iostream>
      #include <memory>
      #include <string>
      using namespace std;

      class Resource {
          string name_;

      public:
          Resource(const string& name) : name_(name) {
              cout << "acquire " << name_ << endl;
          }

          ~Resource() {
              cout << "release " << name_ << endl;
          }

          void use() const {
              cout << "using " << name_ << endl;
          }
      };

      int main() {
          {
              unique_ptr<Resource> r = make_unique<Resource>("file");
              r->use();
          }

          shared_ptr<Resource> a = make_shared<Resource>("shared");
          {
              shared_ptr<Resource> b = a;
              cout << "count: " << a.use_count() << endl;
          }
          cout << "count: " << a.use_count() << endl;

          cout << "end of main" << endl;
          return 0;
      }
quiz:
  - q: What does RAII stand for in practice?
    options: ["Resources are tied to object lifetime: acquired in the constructor, released in the destructor", "Read And Initialize Immediately", "Run All Instructions In order"]
    answer: 0
  - q: What is special about unique_ptr?
    options: ["It can be copied freely", "It has exactly one owner and cannot be copied, only moved", "It counts how many owners exist"]
    answer: 1
  - q: When is the object owned by a shared_ptr deleted?
    options: ["As soon as the first shared_ptr is destroyed", "Only when you call delete", "When the last shared_ptr that owns it is destroyed"]
    answer: 2
  - q: Why prefer make_unique<T>(...) over new T(...)?
    options: ["It is safer: no raw pointer to forget to delete, and it is exception safe", "It makes the object larger", "new is not allowed in C++17"]
    answer: 0
---

In C a heap allocation needs a matching `free`; in old C++ every `new` needs a `delete`. Forget one and you leak memory, do it twice and the program crashes. Modern C++ avoids the problem with **RAII** and **smart pointers**: objects that clean up after themselves. This is one of the most important ideas in the language.

## RAII: Resource Acquisition Is Initialization

A clumsy name for a simple rule: **acquire a resource in a constructor, release it in the destructor**. The destructor is a special method named `~ClassName()` that C++ runs automatically when the object's scope ends, even if the function leaves early through a `return` or an exception.

```cpp
class Timer {
public:
    Timer()  { cout << "start" << endl; }
    ~Timer() { cout << "stop" << endl; }
};

int main() {
    {
        Timer t;                 // prints: start
        cout << "working" << endl;
    }                            // prints: stop (automatic, at the closing brace)
}
```

Files, locks, network connections and memory can all be handled this way. The standard library already does it for you: `ifstream` closes its file, `vector` frees its memory, `lock_guard` releases its mutex.

## unique_ptr: exactly one owner

A `unique_ptr<T>` owns an object on the heap and deletes it when the `unique_ptr` is destroyed. Include `<memory>`.

```cpp
auto p = make_unique<Resource>("file");   // allocates and constructs
p->use();                                 // arrow calls a method, like a normal pointer
(*p).use();                               // * gives the object itself
// no delete needed: freed automatically at the end of the scope
```

`make_unique<T>(args...)` forwards the arguments to the constructor. A `unique_ptr` **cannot be copied** (there must be only one owner), but ownership can be handed over with `std::move`:

```cpp
auto q = move(p);     // q owns it now, p is empty (nullptr)
```

Using `p` after a move is a bug. You can check if a smart pointer is empty with `if (p)`.

## shared_ptr: shared ownership

When several parts of a program need the same object and nobody clearly owns it, use `shared_ptr<T>`. It keeps a **reference count** of how many `shared_ptr`s point at the object, and deletes the object when the count reaches zero.

```cpp
auto a = make_shared<Resource>("shared");
cout << a.use_count();       // prints: 1
{
    auto b = a;              // copying shares ownership
    cout << a.use_count();   // prints: 2
}                            // b is destroyed, count drops
cout << a.use_count();       // prints: 1
```

## Which one to use?

- Default to **plain objects on the stack** (`Resource r("x");`). Simple and fast.
- Need heap allocation or polymorphism: `unique_ptr`.
- Truly shared ownership: `shared_ptr`. It costs a little extra for the counter.
- Avoid raw `new` and `delete` in new code.

Two `shared_ptr`s that point at each other form a cycle and never reach zero (a leak). Break such cycles with `weak_ptr`, a non-owning observer.

> **Watch out:**
> - Copying a unique_ptr: `error: use of deleted function 'std::unique_ptr<...>::unique_ptr(const std::unique_ptr<...>&)'`. Use `move` or pass a reference.
> - Forgetting `#include <memory>`: `error: 'unique_ptr' was not declared in this scope`.
> - Making two separate `shared_ptr`s from the same raw pointer: both think they own it and it is deleted twice. Always create with `make_shared` and copy the `shared_ptr`.
> - Using a unique_ptr after `move`: it is null, and dereferencing it crashes (segmentation fault).
> - Forgetting that the destructor order is the reverse of creation: the last object created inside a scope is destroyed first.

## Going further

Make a vector of `unique_ptr<Resource>` and watch the objects being released in order when the vector goes out of scope.

> **Your turn:** add a destructor to `Resource` that prints `release <name>`. In `main`, make a `unique_ptr` inside a block, then a `shared_ptr` with a second owner in an inner block and print the use counts as the comments describe.
