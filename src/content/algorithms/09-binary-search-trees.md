---
title: Trees and binary search trees
summary: Build a binary search tree with insert, search and in-order traversal using recursion.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      class Node:
          def __init__(self, value):
              self.value = value
              self.left = None      # subtree of smaller values
              self.right = None     # subtree of bigger values


      # Every function below takes the ROOT node of a (sub)tree, or None for an empty tree.
      # Use recursion: the left and right children are themselves trees.

      # 1. insert(node, value): put value in the right place and return the root of the tree.
      #    Empty tree (None): return a new Node(value).
      #    value < node.value: the left subtree becomes insert(into left).
      #    value > node.value: the right subtree becomes insert(into right).
      #    Equal values are ignored (no duplicates).
      def insert(node, value):
          pass


      # 2. search(node, value): True if the value is in the tree, else False.
      #    Go left or right depending on the comparison, like binary search.
      def search(node, value):
          pass


      # 3. in_order(node): list of all values from smallest to largest.
      #    left subtree first, then this node's value, then the right subtree.
      def in_order(node):
          pass


      # 4. height(node): number of levels. An empty tree has height 0, a single node 1.
      #    It is 1 + the larger of the heights of the two subtrees.
      def height(node):
          pass


      # finished for you
      def build(values):
          root = None
          for v in values:
              root = insert(root, v)
          return root


      tree = build([50, 30, 70, 20, 40, 60, 80, 30])
      print(in_order(tree))
      print(search(tree, 60), search(tree, 65))
      print(height(tree))
      print(in_order(None))

      lopsided = build([1, 2, 3, 4, 5])      # values arrive already sorted
      print(height(lopsided))
check:
  output: |
    [20, 30, 40, 50, 60, 70, 80]
    True False
    3
    []
    5
  code:
    - { pattern: '\.left', message: "Use node.left for the smaller values." }
    - { pattern: '\.right', message: "Use node.right for the bigger values." }
    - { pattern: '^(?![\s\S]*(sorted\s*\(|\.sort\s*\())', message: "Do not use sorted() or .sort(): the tree itself keeps things in order." }
hints:
  - "Each function handles the empty tree first (node is None), then uses the same function on node.left and/or node.right. That is recursion on the two subtrees."
  - "insert: if node is None: return Node(value); if value < node.value: node.left = insert(node.left, value); elif value > node.value: node.right = insert(node.right, value); return node. in_order: return in_order(node.left) + [node.value] + in_order(node.right)."
  - "search: if node is None: return False; if value == node.value: return True; if value < node.value: return search(node.left, value); return search(node.right, value).   height: if node is None: return 0; return 1 + max(height(node.left), height(node.right))"
solution:
  - name: main.py
    code: |
      class Node:
          def __init__(self, value):
              self.value = value
              self.left = None
              self.right = None


      def insert(node, value):
          if node is None:
              return Node(value)
          if value < node.value:
              node.left = insert(node.left, value)
          elif value > node.value:
              node.right = insert(node.right, value)
          return node


      def search(node, value):
          if node is None:
              return False
          if value == node.value:
              return True
          if value < node.value:
              return search(node.left, value)
          return search(node.right, value)


      def in_order(node):
          if node is None:
              return []
          return in_order(node.left) + [node.value] + in_order(node.right)


      def height(node):
          if node is None:
              return 0
          return 1 + max(height(node.left), height(node.right))


      def build(values):
          root = None
          for v in values:
              root = insert(root, v)
          return root


      tree = build([50, 30, 70, 20, 40, 60, 80, 30])
      print(in_order(tree))
      print(search(tree, 60), search(tree, 65))
      print(height(tree))
      print(in_order(None))

      lopsided = build([1, 2, 3, 4, 5])      # values arrive already sorted
      print(height(lopsided))
quiz:
  - q: "In a binary search tree, where do values smaller than a node's value go?"
    options: ["In its right subtree", "In its left subtree", "At the root"]
    answer: 1
  - q: "What does an in-order traversal of a binary search tree produce?"
    options: ["The values in sorted order", "The values in the order they were inserted", "Only the leaves"]
    answer: 0
  - q: "Searching a balanced tree of 1,000,000 values needs about how many comparisons?"
    options: ["About 500,000", "About 1,000", "About 20"]
    answer: 2
    explain: "Every comparison discards half of the remaining tree, just like binary search."
  - q: "What happens to a plain binary search tree when you insert already sorted values?"
    options: ["It becomes perfectly balanced", "It degenerates into a chain, so searches become O(n)", "Python raises an error"]
    answer: 1
---

Lists and chains are **linear**: one item after another. Many things in the real world are **hierarchies** instead: folders inside folders, a family tree, the structure of a web page, the choices in a game. The data structure for this is the **tree**. In this lesson you will build the most famous kind, the **binary search tree** (BST), and use recursion on it.

## Tree vocabulary

A tree is made of **nodes** connected by links. The top node is the **root**. A node's links point to its **children**. A node with no children is a **leaf**. The **height** is the number of levels from the root to the deepest leaf. In a **binary** tree every node has at most two children, called `left` and `right`.

```text
          50          <- root
        /    \
      30      70
     /  \    /  \
    20  40  60  80    <- leaves
```

## The search-tree rule

A binary search tree adds one rule that makes it powerful: **for every node, everything in its left subtree is smaller, and everything in its right subtree is bigger.** In the tree above, 30 is left of 50, and everything under 70 is larger than 50.

This is binary search turned into a data structure. To find 60: start at 50, 60 is bigger so go right; at 70, 60 is smaller so go left; found. Three nodes visited instead of seven. In a reasonably **balanced** tree, search, insert and delete are all **O(log n)**.

## Recursion fits trees perfectly

Each child is itself the root of a smaller tree. So a function on a tree can handle "this node" and then call itself on the left and right children. The base case is always the empty tree: `None`.

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None
```

**Insert** goes down like a search and attaches a new leaf where the search ends:

```python
def insert(node, value):
    if node is None:                         # found the empty spot
        return Node(value)
    if value < node.value:
        node.left = insert(node.left, value)
    elif value > node.value:
        node.right = insert(node.right, value)
    return node                              # unchanged tree (or equal value ignored)
```

Notice the pattern `node.left = insert(node.left, value)`: the recursive call returns the (possibly new) root of that subtree, and we store it back. When the spot is empty, `insert` returns a brand-new node and that is exactly how the tree grows.

**Search** is the same walk with no changes:

```python
def search(node, value):
    if node is None:
        return False
    if value == node.value:
        return True
    if value < node.value:
        return search(node.left, value)
    return search(node.right, value)
```

## Traversal: visiting every node

To visit all nodes there are several orders. The most useful for a BST is **in-order**: left subtree, then the node, then the right subtree.

```python
def in_order(node):
    if node is None:
        return []
    return in_order(node.left) + [node.value] + in_order(node.right)
```

For the tree above this gives `[20, 30, 40, 50, 60, 70, 80]`: **sorted**. A BST sorts its data as a side effect of the structure. (Pre-order, visiting the node first, is how you copy a tree. Post-order, node last, is how you delete one.)

## The weakness: balance

Insert the values `1, 2, 3, 4, 5` in that order into an empty tree. Each is bigger than all before it, so each goes to the right:

```text
1
 \
  2
   \
    3
     \
      4
       \
        5
```

The tree is just a linked list, its height is `n`, and every operation becomes **O(n)**. That is why industrial structures such as AVL trees, red-black trees and B-trees **rebalance** themselves. Python's dictionary does not use a tree at all (it uses a hash table), but databases use B-trees all over the place to find rows quickly.

> **Watch out:**
> - Forgetting to **return** from the recursive calls (`search(node.left, value)` without `return`) makes the function give back `None`.
> - Writing `insert(node.left, value)` without assigning it back loses the new node. You need `node.left = insert(...)`.
> - Forgetting the `node is None` base case ends in `AttributeError: 'NoneType' object has no attribute 'value'`.
> - A very deep tree built from sorted data recurses once per level and can hit `RecursionError: maximum recursion depth exceeded`.
> - A BST needs values that can be compared. Mixing numbers and strings raises `TypeError: '<' not supported between instances of 'str' and 'int'`.

## Going further

Add `minimum(node)` (keep going left) and `maximum(node)`. Then try `count_leaves`. Deleting a node from a BST is the famous hard exercise, because a node with two children needs a replacement: its in-order successor.

> **Your turn:** implement `insert`, `search`, `in_order` and `height` recursively. The test builds a tree, checks that the traversal is sorted, and shows how sorted input makes the tree lopsided (height 5).
