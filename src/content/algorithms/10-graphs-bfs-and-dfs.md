---
title: "Graphs: BFS and DFS"
summary: Model networks with an adjacency dictionary, find shortest paths in steps with BFS, and explore deeply with DFS.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      from collections import deque

      # An undirected graph as an adjacency dictionary: node -> list of neighbours.
      graph = {
          "A": ["B", "C"],
          "B": ["A", "D", "E"],
          "C": ["A", "F"],
          "D": ["B"],
          "E": ["B", "F"],
          "F": ["C", "E"],
          "G": [],                 # G is not connected to anything
      }


      # 1. shortest_path(graph, start, goal): BREADTH-first search.
      #    Return the list of nodes of a path with the fewest steps, e.g. ['A', 'C', 'F'],
      #    or None when there is no route.
      #    Use a deque as the queue. Each queue entry is a whole path so far.
      #      - keep a set of visited nodes (mark a node when you ADD it to the queue)
      #      - take a path from the front, look at its last node
      #      - if that is the goal, return the path
      #      - otherwise add (path + [neighbour]) to the back for each unvisited neighbour
      def shortest_path(graph, start, goal):
          pass


      # 2. dfs_order(graph, node, visited=None): DEPTH-first search, recursive.
      #    Return the list of nodes in the order they are first visited, starting at node.
      #    Visit the neighbours in the order they appear in the adjacency list.
      #    Skip neighbours that were already visited.
      def dfs_order(graph, node, visited=None):
          pass


      for start, goal in (("A", "F"), ("D", "C"), ("A", "A"), ("A", "G")):
          path = shortest_path(graph, start, goal)
          if path is None:
              print(start, goal, "no route")
          else:
              print(start, goal, path, len(path) - 1, "steps")

      print(dfs_order(graph, "A"))
      print(dfs_order(graph, "G"))
check:
  output: |
    A F ['A', 'C', 'F'] 2 steps
    D C ['D', 'B', 'A', 'C'] 3 steps
    A A ['A'] 0 steps
    A G no route
    ['A', 'B', 'D', 'E', 'F', 'C']
    ['G']
  code:
    - { pattern: 'deque\s*\(', message: "BFS uses a queue: create one with deque(...)." }
    - { pattern: 'popleft\s*\(', message: "Take the next path from the FRONT of the queue with popleft()." }
    - { pattern: '(dfs_order\s*\([\s\S]*){4}', message: "dfs_order should call itself for each unvisited neighbour." }
hints:
  - "BFS explores in rings: all nodes 1 step away, then 2 steps away, and so on. A queue gives that order. Remember which nodes you have visited so you never go back."
  - "shortest_path: queue = deque([[start]]); visited = {start}; while queue: path = queue.popleft(); node = path[-1]; if node == goal: return path; then for each neighbour not in visited: visited.add(it) and queue.append(path + [it]). After the loop return None."
  - "dfs_order: if visited is None: visited = []   then visited.append(node)   for nb in graph[node]:       if nb not in visited:           dfs_order(graph, nb, visited)   and finally   return visited"
solution:
  - name: main.py
    code: |
      from collections import deque

      graph = {
          "A": ["B", "C"],
          "B": ["A", "D", "E"],
          "C": ["A", "F"],
          "D": ["B"],
          "E": ["B", "F"],
          "F": ["C", "E"],
          "G": [],                 # G is not connected to anything
      }


      def shortest_path(graph, start, goal):
          queue = deque([[start]])
          visited = {start}
          while queue:
              path = queue.popleft()
              node = path[-1]
              if node == goal:
                  return path
              for neighbour in graph[node]:
                  if neighbour not in visited:
                      visited.add(neighbour)
                      queue.append(path + [neighbour])
          return None


      def dfs_order(graph, node, visited=None):
          if visited is None:
              visited = []
          visited.append(node)
          for neighbour in graph[node]:
              if neighbour not in visited:
                  dfs_order(graph, neighbour, visited)
          return visited


      for start, goal in (("A", "F"), ("D", "C"), ("A", "A"), ("A", "G")):
          path = shortest_path(graph, start, goal)
          if path is None:
              print(start, goal, "no route")
          else:
              print(start, goal, path, len(path) - 1, "steps")

      print(dfs_order(graph, "A"))
      print(dfs_order(graph, "G"))
quiz:
  - q: "Which data structure drives breadth-first search?"
    options: ["A stack", "A queue", "A sorted list"]
    answer: 1
  - q: "BFS finds the path with the fewest steps because it..."
    options: ["Always goes as deep as possible first", "Sorts the nodes alphabetically", "Explores all nodes 1 step away, then 2 steps away, and so on"]
    answer: 2
  - q: "Why do we keep a visited set?"
    options: ["To make the output shorter", "To avoid going around cycles forever and to avoid repeating work", "Because Python needs it"]
    answer: 1
  - q: "How does depth-first search explore?"
    options: ["It follows one route as far as it can, then backs up and tries another", "It visits the nearest nodes first", "It visits nodes in random order"]
    answer: 0
    explain: "Recursion (or a stack) gives the 'go deep, then backtrack' behaviour."
---

A **graph** is just things and the connections between them. Cities and roads, people and friendships, web pages and links, tasks and the tasks they depend on. Once you can represent a problem as a graph, a small set of algorithms answers questions like "what is the fastest route?", "can I get from here to there?" and "who is within two connections of me?".

## Words you need

- A **node** (or vertex) is a thing.
- An **edge** is a connection between two nodes.
- **Neighbours** are nodes joined by an edge.
- A **path** is a sequence of nodes where each pair is joined by an edge.
- In an **undirected** graph an edge works both ways (friendship). In a **directed** graph it has a direction (a link from one page to another).

```text
    D
    |
    B --- E
    |     |
    A     |
    |     |
    C --- F          G   (not connected to anything)
```

## The adjacency dictionary

The simplest way to store a graph in Python: a dictionary that maps each node to the list of its neighbours.

```python
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
print(graph["B"])   # prints: ['A', 'D', 'E']
```

Because the graph is undirected, every edge is listed twice (A has B, and B has A). Looking up the neighbours of a node is one fast dictionary lookup.

## Breadth-first search (BFS)

BFS explores like a ripple on water: first the start node, then everything 1 step away, then everything 2 steps away, and so on. That order is created by a **queue**: new nodes go to the back, and we always process the front.

```text
start A, goal F
queue: [A]
take A  -> add B, C            queue: [B, C]
take B  -> add D, E            queue: [C, D, E]
take C  -> add F               queue: [D, E, F]
take D  -> nothing new         queue: [E, F]
take E  -> nothing new         queue: [F]
take F  -> it is the goal!   path found: A, C, F  (2 steps)
```

Because BFS reaches nodes in order of distance, the **first** time it reaches the goal is along a path with the **fewest steps**. This is how "degrees of separation" and shortest routes in unweighted graphs are found.

Rather than remember how we reached each node, you can put the whole path in the queue:

```python
queue = deque([[start]])        # a queue of paths
path = queue.popleft()
node = path[-1]                 # the last node of this path
queue.append(path + [neighbour])
```

The **visited** set is essential. Graphs can have **cycles** (A to B to E to F to C to A). Without it you would walk around forever. Mark a node as visited the moment you add it to the queue, so it is never queued twice. BFS costs **O(V + E)**: each node and edge is handled about once.

## Depth-first search (DFS)

DFS behaves like exploring a maze: pick a corridor and follow it as far as it goes, and only when you hit a dead end back up and try the next one. Recursion does the backing up for you:

```python
def dfs_order(graph, node, visited=None):
    if visited is None:
        visited = []
    visited.append(node)
    for neighbour in graph[node]:
        if neighbour not in visited:
            dfs_order(graph, neighbour, visited)
    return visited

print(dfs_order(graph, "A"))   # prints: ['A', 'B', 'D', 'E', 'F', 'C']
```

From A it goes to B, then deep to D (dead end), back to B, on to E, then F, then C. DFS does **not** find shortest paths, but it is great for "is there any route?", for finding connected groups, detecting cycles, solving mazes and exploring every possibility (backtracking).

| | BFS | DFS |
| --- | --- | --- |
| Uses | queue | stack (or recursion) |
| Order | nearest first | deepest first |
| Shortest path (unweighted) | yes | no |

> **Watch out:**
> - Forgetting the visited set leads to an infinite loop on any graph with a cycle.
> - Using `visited = []` as a default argument (`def dfs(graph, node, visited=[])`) shares one list between all calls. That is why the starter uses `visited=None`.
> - `graph[node]` raises `KeyError: 'Z'` for a node that is not in the dictionary. Check the start and goal exist.
> - Marking nodes visited when you take them from the queue (instead of when you add them) still works but puts duplicates in the queue.
> - A node with no neighbours still needs an entry, like `"G": []`, or neighbour lookups raise `KeyError`.

## Going further

Count the connected groups of a graph by running a search from every unvisited node. Or turn the maze idea into code: a grid of cells is a graph where each cell has up to four neighbours.

> **Your turn:** implement `shortest_path` with BFS (a `deque` of paths and a `visited` set) and `dfs_order` with recursion. `shortest_path` returns the path as a list, or `None` when there is no route.
