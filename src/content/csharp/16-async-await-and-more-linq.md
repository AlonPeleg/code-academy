---
title: Async/await and more LINQ
summary: Run work with Task and await, then group, order and join data with LINQ.
level: advanced
runner: remote
files:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;
      using System.Linq;
      using System.Threading.Tasks;

      class Student
      {
          public string Name;
          public int CourseId;
          public int Score;
      }

      class Course
      {
          public int Id;
          public string Title;
      }

      class Program
      {
          // 1. Write  static async Task<int> SquareAsync(int n)  that waits
          //    10 milliseconds with  await Task.Delay(10)  and then returns n * n.

          static void Main()
          {
              List<Student> students = new List<Student>
              {
                  new Student { Name = "Ava", CourseId = 1, Score = 90 },
                  new Student { Name = "Noam", CourseId = 2, Score = 72 },
                  new Student { Name = "Maya", CourseId = 1, Score = 85 },
                  new Student { Name = "Lior", CourseId = 3, Score = 60 },
                  new Student { Name = "Dana", CourseId = 2, Score = 95 }
              };
              List<Course> courses = new List<Course>
              {
                  new Course { Id = 1, Title = "Math" },
                  new Course { Id = 2, Title = "Art" },
                  new Course { Id = 3, Title = "History" }
              };

              // 2. Start SquareAsync for 1, 2, 3 and 4 (an array of Task<int>), wait for
              //    all of them with Task.WhenAll(tasks).GetAwaiter().GetResult()
              //    and print:   squares: 1 4 9 16

              // 3. Print the names ordered by score, highest first (OrderByDescending),
              //    joined with ", ":
              //      Ranking: Dana, Ava, Maya, Noam, Lior

              // 4. Group the students by CourseId (GroupBy), order the groups by key and
              //    print one line per group:
              //      course 1: 2
              //      course 2: 2
              //      course 3: 1

              // 5. Join students with courses (Join on CourseId = Id) into text
              //    like "Ava -> Math", and print them joined with ", ":
              //      Ava -> Math, Noam -> Art, Maya -> Math, Lior -> History, Dana -> Art
          }
      }
check:
  output: |
    squares: 1 4 9 16
    Ranking: Dana, Ava, Maya, Noam, Lior
    course 1: 2
    course 2: 2
    course 3: 1
    Ava -> Math, Noam -> Art, Maya -> Math, Lior -> History, Dana -> Art
  code:
    - { pattern: 'async\s+Task\s*<\s*int\s*>\s+SquareAsync', message: "Declare static async Task<int> SquareAsync(int n)." }
    - { pattern: 'await\s+Task\.Delay', message: "Use await Task.Delay(10) inside SquareAsync." }
    - { pattern: 'WhenAll\s*\(', message: "Use Task.WhenAll to wait for all tasks." }
    - { pattern: 'OrderByDescending\s*\(', message: "Use OrderByDescending." }
    - { pattern: 'GroupBy\s*\(', message: "Use GroupBy." }
    - { pattern: '\.Join\s*\(', message: "Use the LINQ Join method." }
hints:
  - "async marks a method that may await. await pauses the method until a Task finishes without blocking a thread; the method must then return Task or Task<T>. In a normal Main you wait for a task with .GetAwaiter().GetResult()."
  - "static async Task<int> SquareAsync(int n) { await Task.Delay(10); return n * n; }   tasks = new[] { SquareAsync(1), SquareAsync(2), ... }; int[] results = Task.WhenAll(tasks).GetAwaiter().GetResult();   students.OrderByDescending(s => s.Score).Select(s => s.Name);   students.GroupBy(s => s.CourseId).OrderBy(g => g.Key)"
  - "students.Join(courses, s => s.CourseId, c => c.Id, (s, c) => s.Name + \" -> \" + c.Title)   foreach (var g in students.GroupBy(s => s.CourseId).OrderBy(g => g.Key)) { Console.WriteLine(\"course \" + g.Key + \": \" + g.Count()); }   string.Join(\", \", ...) turns a sequence into text."
solution:
  - name: Program.cs
    code: |
      using System;
      using System.Collections.Generic;
      using System.Linq;
      using System.Threading.Tasks;

      class Student
      {
          public string Name;
          public int CourseId;
          public int Score;
      }

      class Course
      {
          public int Id;
          public string Title;
      }

      class Program
      {
          static async Task<int> SquareAsync(int n)
          {
              await Task.Delay(10);
              return n * n;
          }

          static void Main()
          {
              List<Student> students = new List<Student>
              {
                  new Student { Name = "Ava", CourseId = 1, Score = 90 },
                  new Student { Name = "Noam", CourseId = 2, Score = 72 },
                  new Student { Name = "Maya", CourseId = 1, Score = 85 },
                  new Student { Name = "Lior", CourseId = 3, Score = 60 },
                  new Student { Name = "Dana", CourseId = 2, Score = 95 }
              };
              List<Course> courses = new List<Course>
              {
                  new Course { Id = 1, Title = "Math" },
                  new Course { Id = 2, Title = "Art" },
                  new Course { Id = 3, Title = "History" }
              };

              Task<int>[] tasks = new Task<int>[]
              {
                  SquareAsync(1), SquareAsync(2), SquareAsync(3), SquareAsync(4)
              };
              int[] results = Task.WhenAll(tasks).GetAwaiter().GetResult();
              Console.WriteLine("squares: " + string.Join(" ", results));

              var ranking = students.OrderByDescending(s => s.Score).Select(s => s.Name);
              Console.WriteLine("Ranking: " + string.Join(", ", ranking));

              foreach (var g in students.GroupBy(s => s.CourseId).OrderBy(g => g.Key))
              {
                  Console.WriteLine("course " + g.Key + ": " + g.Count());
              }

              var joined = students.Join(courses, s => s.CourseId, c => c.Id,
                                         (s, c) => s.Name + " -> " + c.Title);
              Console.WriteLine(string.Join(", ", joined));
          }
      }
quiz:
  - q: What does the await keyword do?
    options: ["Blocks the whole program until the task finishes", "Starts a new thread for every call", "Pauses the current async method until the task completes, letting other work continue meanwhile"]
    answer: 2
  - q: What must the return type of an async method be (apart from void for event handlers)?
    options: ["Task or Task<T>", "int", "Thread"]
    answer: 0
  - q: What does students.GroupBy(s => s.CourseId) produce?
    options: ["A single sorted list", "A sequence of groups, each with a Key (the course id) and the students in it", "A dictionary of strings"]
    answer: 1
  - q: What does Join do in LINQ?
    options: ["Glues strings together", "Waits for a thread", "Matches items of two collections whose keys are equal and combines each pair"]
    answer: 2
---

Two ideas in one lesson: **async/await**, for work that takes a while (waiting for a network reply, a file, a timer) without freezing the program, and a second round of **LINQ**, for grouping, ordering and joining data.

## Tasks and async methods

A `Task` represents work that will finish later. `Task<int>` is work that will produce an `int`. You create them by calling an **async method**:

```csharp
static async Task<int> SquareAsync(int n)
{
    await Task.Delay(10);     // pretend to wait 10 milliseconds
    return n * n;
}
```

- `async` on the method allows the keyword `await` inside it.
- The return type is `Task<int>`, but the code just does `return n * n;`. C# wraps the value in a task for you. An async method with nothing to return has the type `Task`.
- `await Task.Delay(10)` pauses **this method** until the delay is over. Unlike `Thread.Sleep`, it does not block the thread; a UI keeps responding and a web server serves other requests in the meantime.
- By convention, async method names end in `Async`.

## Waiting for a task

In modern C# you could write `static async Task Main()`. The Mono compiler used in these lessons only supports a normal `static void Main()`, so we wait for the result by hand:

```csharp
int result = SquareAsync(7).GetAwaiter().GetResult();
Console.WriteLine(result);      // prints: 49
```

`GetAwaiter().GetResult()` blocks until the task is done and returns its value (or throws the original exception). Inside another async method you would just write `int result = await SquareAsync(7);`.

## Running several tasks together

Calling the async method starts the work right away and gives you the task. Start several, then wait for all:

```csharp
Task<int>[] tasks = { SquareAsync(1), SquareAsync(2), SquareAsync(3) };
int[] results = Task.WhenAll(tasks).GetAwaiter().GetResult();
Console.WriteLine(string.Join(" ", results));   // prints: 1 4 9
```

All three delays run at the same time, so the total wait is about 10 ms, not 30. `WhenAll` returns the results **in the same order as the tasks**, no matter which finished first, so the output stays predictable.

## More LINQ

You know `Where`, `Select` and `Sum`. Three more building blocks (remember `using System.Linq;`):

**OrderBy / OrderByDescending** sort by a key; `ThenBy` adds a tie-breaker:

```csharp
var sorted = people.OrderBy(p => p.Age).ThenBy(p => p.Name);
```

**GroupBy** splits a sequence into groups. Each group has a `Key` and is itself a sequence:

```csharp
foreach (var g in students.GroupBy(s => s.CourseId))
{
    Console.WriteLine(g.Key + ": " + g.Count());    // course id and how many students
}
```

**Join** matches two collections by key, like a SQL join:

```csharp
var pairs = students.Join(courses,
                          s => s.CourseId,           // key from a student
                          c => c.Id,                 // key from a course
                          (s, c) => s.Name + " -> " + c.Title);   // what to produce per match
```

Students without a matching course are dropped (an inner join). Most LINQ methods are **lazy**: nothing is calculated until you loop over the result or call `ToList()`, `Count()` or `string.Join`. `OrderBy` is stable, so equal keys keep their original order.

> **Watch out:**
> - Forgetting `using System.Threading.Tasks;`: `error CS0246: The type or namespace name 'Task' could not be found`.
> - Using `await` in a method that is not `async`: `error CS4033: The 'await' operator can only be used within an async method`.
> - Calling `.Result` or `.GetResult()` inside UI or web code can freeze the app (a deadlock). Console programs like these are safe, real apps should `await` all the way up.
> - Forgetting that an async method runs immediately until the first `await`: starting tasks does not wait for them. Always await or wait for the tasks you started.
> - `GroupBy` does not sort. Add `OrderBy(g => g.Key)` if you need the groups in a certain order.
> - Output order from truly concurrent tasks that print is not predictable. Collect results and print them afterwards.

## Going further

Add `Average` per group: `g.Average(s => s.Score)`, or sort groups by the number of students. Try `Task.WhenAny` to react to whichever task finishes first.

> **Your turn:** write `SquareAsync`, wait for four of them with `Task.WhenAll`, then print the ranking (`OrderByDescending`), the number of students per course (`GroupBy`) and the `Join` of students with their course titles, exactly as the comments describe.
