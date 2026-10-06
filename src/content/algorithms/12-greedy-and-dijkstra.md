---
title: "Greedy algorithms and Dijkstra's shortest path"
summary: Capstone - make the best local choice each time, then use a priority queue to find the cheapest routes on a weighted graph.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      import heapq

      # PART 1 - greedy: max_meetings(meetings)
      # meetings is a list of (start, end) times for ONE room. Choose as many meetings
      # as possible so that none overlap (a meeting may start exactly when another ends).
      # Greedy rule: look at the meetings in order of EARLIEST END time, and take a
      # meeting whenever it starts at or after the end of the last one you took.
      # Return the chosen meetings as a list of (start, end) tuples.
      def max_meetings(meetings):
          pass


      # PART 2 - Dijkstra: dijkstra(graph, start)
      # graph maps node -> {neighbour: cost}. Return a dictionary: node -> the cheapest
      # total cost from start (float('inf') if the node cannot be reached).
      #   1. dist starts at infinity for every node, 0 for the start.
      #   2. heap = [(0, start)]. A heap always gives back the SMALLEST tuple first.
      #   3. Loop while the heap is not empty: pop (d, node).
      #      If d is bigger than dist[node], this entry is out of date: skip it.
      #      Otherwise try each neighbour: new = d + cost. If new < dist[neighbour],
      #      store it and push (new, neighbour) onto the heap.
      def dijkstra(graph, start):
          pass


      meetings = [(9, 10), (9, 12), (10, 11), (11, 13), (12, 14), (13, 15), (10, 15)]
      print(max_meetings(meetings))

      graph = {
          "A": {"B": 4, "C": 2},
          "B": {"A": 4, "C": 1, "D": 5},
          "C": {"A": 2, "B": 1, "D": 8, "E": 10},
          "D": {"B": 5, "C": 8, "E": 2},
          "E": {"C": 10, "D": 2},
          "F": {},                       # F has no roads at all
      }
      dist = dijkstra(graph, "A")
      for node in sorted(dist):
          print(node, dist[node])
      print(dijkstra(graph, "E")["A"])
check:
  output: |
    [(9, 10), (10, 11), (11, 13), (13, 15)]
    A 0
    B 3
    C 2
    D 8
    E 10
    F inf
    10
  code:
    - { pattern: 'heappush\s*\(', message: "Push new candidates onto the heap with heapq.heappush." }
    - { pattern: 'heappop\s*\(', message: "Take the cheapest candidate with heapq.heappop." }
    - { pattern: 'key\s*=|sort\s*\(', message: "Order the meetings by end time, for example sorted(meetings, key=...)." }
hints:
  - "Part 1: greedy means one simple rule, applied repeatedly. Sort by end time, keep the end of the last chosen meeting, and take each meeting that starts at or after it. Part 2: a heap (heapq) always hands you the cheapest unexplored node next."
  - "max_meetings: for start, end in sorted(meetings, key=lambda m: m[1]): if start >= last_end: chosen.append((start, end)); last_end = end. dijkstra: dist = {n: float('inf') for n in graph}; dist[start] = 0; heap = [(0, start)]; while heap: d, node = heapq.heappop(heap) ..."
  - "while heap:   d, node = heapq.heappop(heap)   if d > dist[node]:       continue   for neighbour, cost in graph[node].items():       new = d + cost       if new < dist[neighbour]:           dist[neighbour] = new           heapq.heappush(heap, (new, neighbour))   and finally return dist"
solution:
  - name: main.py
    code: |
      import heapq


      def max_meetings(meetings):
          chosen = []
          last_end = float("-inf")
          for start, end in sorted(meetings, key=lambda m: m[1]):
              if start >= last_end:
                  chosen.append((start, end))
                  last_end = end
          return chosen


      def dijkstra(graph, start):
          dist = {node: float("inf") for node in graph}
          dist[start] = 0
          heap = [(0, start)]
          while heap:
              d, node = heapq.heappop(heap)
              if d > dist[node]:
                  continue
              for neighbour, cost in graph[node].items():
                  new = d + cost
                  if new < dist[neighbour]:
                      dist[neighbour] = new
                      heapq.heappush(heap, (new, neighbour))
          return dist


      meetings = [(9, 10), (9, 12), (10, 11), (11, 13), (12, 14), (13, 15), (10, 15)]
      print(max_meetings(meetings))

      graph = {
          "A": {"B": 4, "C": 2},
          "B": {"A": 4, "C": 1, "D": 5},
          "C": {"A": 2, "B": 1, "D": 8, "E": 10},
          "D": {"B": 5, "C": 8, "E": 2},
          "E": {"C": 10, "D": 2},
          "F": {},                       # F has no roads at all
      }
      dist = dijkstra(graph, "A")
      for node in sorted(dist):
          print(node, dist[node])
      print(dijkstra(graph, "E")["A"])
quiz:
  - q: "What defines a greedy algorithm?"
    options: ["It tries every possibility", "At each step it takes the choice that looks best right now and never undoes it", "It always uses recursion"]
    answer: 1
  - q: "Which statement about greedy algorithms is true?"
    options: ["They are always correct", "They are always slower than dynamic programming", "They are only correct for problems with the right structure, so you must justify them"]
    answer: 2
    explain: "Greedy works for meeting selection and for Dijkstra, but fails for coin change with coins 1, 3 and 4."
  - q: "In Dijkstra's algorithm, which node is processed next?"
    options: ["The one with the smallest known distance from the start", "The one that comes first alphabetically", "The one with the most neighbours"]
    answer: 0
  - q: "Why does Dijkstra's algorithm not work with negative edge costs?"
    options: ["Python cannot add negative numbers", "A finished node could later be improved, which breaks its main assumption", "Heaps reject negative numbers"]
    answer: 1
---

You have now met searching, sorting, stacks, hash tables, trees, graphs and dynamic programming. This capstone brings in one last idea, the **greedy** strategy, and ends with one of the most famous algorithms in computing: Dijkstra's shortest path, the engine behind route planners.

## Greedy: take the best choice right now

A **greedy algorithm** builds a solution step by step, and at each step takes whatever choice looks best at that moment, without ever looking back. It is simple and fast. The catch: it is only **correct for some problems**. You earned a taste of failure in the last lesson: for coins `[1, 3, 4]` and amount 6, the greedy rule "biggest coin first" gives 4+1+1 (three coins), while 3+3 uses two.

For other problems the greedy rule can be **proven** to give the best answer. A classic: **interval scheduling**. You have one meeting room and a list of requested meetings, each with a start and end time. Which choice rule fits as many meetings as possible?

- Earliest start first? A long meeting at 9:00 can block many short ones.
- Shortest first? Short meetings can sit in the middle and block two others.
- **Earliest end first.** Finishing early leaves the most room for everything else. This one is provably optimal.

```text
time:   9    10    11    12    13    14    15
        |-----|                                    (9,10)   take
        |-----------|                              (9,12)   overlaps, skip
              |-----|                              (10,11)  take
                    |-----------|                  (11,13)  take
                          |-----------|            (12,14)  overlaps, skip
                                      |-----|      (13,15)  take
```

Sorting costs O(n log n), and one pass over the sorted meetings does the rest, so the whole thing is **O(n log n)**.

## Weighted graphs

In lesson 10 every edge counted as one step. Real maps have different costs: kilometres, minutes, ticket prices. In a **weighted graph** each edge has a cost. We extend the adjacency dictionary so each neighbour carries its weight:

```python
graph = {
    "A": {"B": 4, "C": 2},
    "B": {"A": 4, "C": 1, "D": 5},
    ...
}
```

Plain BFS no longer finds the cheapest route, because the path with the fewest edges is not always the cheapest one. In the graph in your starter, going from A straight to B costs 4, but A to C to B costs 2 + 1 = 3.

## Priority queues with heapq

Dijkstra's algorithm always needs "the unexplored node that is cheapest so far". A **priority queue** hands out the smallest item first, and Python's `heapq` module implements it on top of a normal list:

```python
import heapq

heap = []
heapq.heappush(heap, (5, "E"))
heapq.heappush(heap, (1, "A"))
heapq.heappush(heap, (3, "C"))
print(heapq.heappop(heap))   # prints: (1, 'A')
print(heapq.heappop(heap))   # prints: (3, 'C')
```

Tuples compare element by element, so `(cost, node)` tuples are ordered by cost. Pushing and popping are **O(log n)**.

## Dijkstra's algorithm

It is a greedy algorithm: always finalise the nearest not-yet-finished node, because with non-negative costs no other route can reach it more cheaply.

1. Keep `dist[node]`, the cheapest cost found so far. Start at infinity, except `dist[start] = 0`.
2. Put `(0, start)` on a heap.
3. Pop the cheapest `(d, node)`. If `d` is bigger than `dist[node]`, a better route was already found: skip it.
4. For each neighbour, compute `new = d + cost`. If it beats `dist[neighbour]`, record it and push it.
5. Stop when the heap is empty.

```text
Start A.   dist: A=0
pop (0,A):  B = 4, C = 2          heap: (2,C) (4,B)
pop (2,C):  B = 2+1 = 3 (better), D = 10, E = 12   heap: (3,B) (4,B) (10,D) (12,E)
pop (3,B):  D = 3+5 = 8 (better)   ...
pop (4,B):  4 > 3, stale entry, skip
pop (8,D):  E = 8+2 = 10 (better)
pop (10,E): nothing improves
Result: A=0, C=2, B=3, D=8, E=10
```

With a heap the running time is **O((V + E) log V)**. Nodes that can never be reached, like `F` in your starter, simply keep the distance `inf`. To get the route itself and not just its cost, store for each node which neighbour it was reached from.

> **Watch out:**
> - Dijkstra's algorithm gives wrong answers with **negative** edge costs. Other algorithms (Bellman-Ford) handle those.
> - Forgetting the stale-entry check (`if d > dist[node]: continue`) still gives correct distances but repeats work.
> - Putting the node first in the heap tuple, `(node, cost)`, orders by name instead of cost. The cost must come first.
> - `heapq.heappush(heap, ...)` changes the list in place and returns `None`. Do not write `heap = heapq.heappush(...)`.
> - A greedy rule that sounds sensible is not automatically correct. Test it on small tricky examples before trusting it.

## What to try next

You now have the core toolkit: Big-O thinking, searching, sorting, stacks and queues, hash tables, linked lists, trees, graphs, dynamic programming and greedy algorithms. To go further, solve small puzzles on paper first, then in code: count islands on a grid with BFS, schedule tasks with dependencies (topological sort), or add path reconstruction to Dijkstra.

> **Your turn:** implement `max_meetings` (greedy, earliest end first) and `dijkstra` using `heapq`. The graph includes an unreachable node `F` whose distance must print as `inf`.
