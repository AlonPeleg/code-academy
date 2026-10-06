---
title: Linked lists
summary: Build a chain of nodes by hand, then append to it and reverse it by rewiring pointers.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      class Node:
          def __init__(self, value):
              self.value = value
              self.next = None          # the next node, or None at the end of the chain


      class LinkedList:
          def __init__(self):
              self.head = None          # the first node, or None when the list is empty

          # 1. append(value): add a new node at the END of the chain.
          #    If the list is empty, the new node becomes the head.
          #    Otherwise walk from the head to the last node (the one whose next is None)
          #    and link the new node after it.
          def append(self, value):
              pass

          # 2. reverse(): turn the chain around IN PLACE by rewiring the next links.
          #    Walk along the chain with three variables: previous (starts as None),
          #    current (starts at head). For each node: remember the node after it,
          #    point current.next backwards at previous, then step both forward.
          #    At the end previous is the new head.
          def reverse(self):
              pass

          # finished for you
          def to_list(self):
              result = []
              node = self.head
              while node is not None:
                  result.append(node.value)
                  node = node.next
              return result

          def __len__(self):
              count = 0
              node = self.head
              while node is not None:
                  count += 1
                  node = node.next
              return count


      chain = LinkedList()
      print(chain.to_list(), len(chain))
      for v in (1, 2, 3, 4):
          chain.append(v)
      print(chain.to_list(), len(chain))
      chain.reverse()
      print(chain.to_list(), len(chain))
      print(chain.head.value, chain.head.next.value)

      single = LinkedList()
      single.append(9)
      single.reverse()
      print(single.to_list())

      empty = LinkedList()
      empty.reverse()
      print(empty.to_list())
check:
  output: |
    [] 0
    [1, 2, 3, 4] 4
    [4, 3, 2, 1] 4
    4 3
    [9]
    []
  code:
    - { pattern: '\bwhile\b[^\n]*next|\bwhile\b[^\n]*(current|node|last|cur)', message: "Walk along the chain with a while loop." }
    - { pattern: 'next\s*=\s*(previous|prev)', message: "Reverse by pointing each node's next link backwards at the previous node." }
    - { pattern: '^(?![\s\S]*(\b(result|values|items|data|lst|nodes|out)\.reverse\s*\(|\[\s*::\s*-1\s*\]|reversed\s*\())', message: "Do not use list reversal helpers. Rewire the next links." }
hints:
  - "A linked list is just nodes pointing to nodes. To append, find the last node (the one whose next is None) and set its next to a new Node. For an empty list set self.head instead."
  - "append: node = Node(value); if self.head is None: self.head = node; return. Then last = self.head; while last.next is not None: last = last.next; last.next = node. reverse: previous = None; current = self.head; while current is not None: ..."
  - "while current is not None:   following = current.next   current.next = previous   previous = current   current = following      and after the loop:   self.head = previous"
solution:
  - name: main.py
    code: |
      class Node:
          def __init__(self, value):
              self.value = value
              self.next = None          # the next node, or None at the end of the chain


      class LinkedList:
          def __init__(self):
              self.head = None          # the first node, or None when the list is empty

          def append(self, value):
              node = Node(value)
              if self.head is None:
                  self.head = node
                  return
              last = self.head
              while last.next is not None:
                  last = last.next
              last.next = node

          def reverse(self):
              previous = None
              current = self.head
              while current is not None:
                  following = current.next
                  current.next = previous
                  previous = current
                  current = following
              self.head = previous

          def to_list(self):
              result = []
              node = self.head
              while node is not None:
                  result.append(node.value)
                  node = node.next
              return result

          def __len__(self):
              count = 0
              node = self.head
              while node is not None:
                  count += 1
                  node = node.next
              return count


      chain = LinkedList()
      print(chain.to_list(), len(chain))
      for v in (1, 2, 3, 4):
          chain.append(v)
      print(chain.to_list(), len(chain))
      chain.reverse()
      print(chain.to_list(), len(chain))
      print(chain.head.value, chain.head.next.value)

      single = LinkedList()
      single.append(9)
      single.reverse()
      print(single.to_list())

      empty = LinkedList()
      empty.reverse()
      print(empty.to_list())
quiz:
  - q: "What does the last node of a linked list store in its next field?"
    options: ["The first node", "None", "Zero"]
    answer: 1
  - q: "What is the advantage of a linked list over a Python list?"
    options: ["Inserting at the front is O(1), with no shifting of other items", "Faster access to item number i", "It uses less memory per item"]
    answer: 0
  - q: "How long does it take to read the item at position i of a linked list?"
    options: ["O(1)", "O(log n)", "O(n), because you must walk from the head"]
    answer: 2
  - q: "While reversing, why must you save current.next before changing it?"
    options: ["Python requires it", "Otherwise you lose the rest of the chain", "To make the loop faster"]
    answer: 1
    explain: "Once current.next points backwards, the only way to reach the remaining nodes was the old link."
---

A Python list keeps its items next to each other in memory. A **linked list** does it differently: every item lives in its own little object called a **node**, and each node holds a **pointer** (a reference) to the next node. Following the pointers visits the items in order. Linked lists are the first "build it yourself" data structure, and they teach you to think about references, which is useful in every language.

## Nodes and chains

A node has two fields: its `value` and a link `next` to the following node. The last node's `next` is `None`, which means "the end".

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

```text
head
  |
  v
[ 1 | * ]--->[ 2 | * ]--->[ 3 | None ]
```

The list object itself only remembers the **head**: the first node. Everything else is reached by hopping from node to node:

```python
a = Node(1)
b = Node(2)
a.next = b            # a points at b
print(a.next.value)   # prints: 2
```

## Walking the chain

To visit every item, start at the head and keep following `next` until you fall off the end:

```python
node = head
while node is not None:
    print(node.value)
    node = node.next
```

Remember this loop. Almost every linked-list method is a variation of it. Notice that you cannot jump to item number 5: you must walk past items 0 to 4. Reading by position is therefore **O(n)**, while a Python list does it in O(1).

## Appending

To append, you need the last node, the one whose `next` is `None`. Walk until you find it, then attach the new node:

```python
def append(self, value):
    node = Node(value)
    if self.head is None:          # empty list: the new node is the head
        self.head = node
        return
    last = self.head
    while last.next is not None:   # stop ON the last node, not after it
        last = last.next
    last.next = node
```

Walking to the end every time makes `append` O(n). Real implementations also keep a `tail` pointer to make it O(1). Inserting at the **front** is O(1) without a tail: `node.next = self.head; self.head = node`. That is the real strength of linked lists: no items need to shift, unlike inserting at the front of a Python list.

## Reversing in place

Reversing is the classic linked-list puzzle. You do not move any values. You only **flip the arrows**. Use three names: `previous`, `current` and `following`.

```text
start:   None   1 -> 2 -> 3
         prev  cur

step 1:  save following = 2, flip 1 to point at None, move forward
         None <- 1    2 -> 3
                prev  cur

step 2:  save following = 3, flip 2 to point at 1, move forward
         None <- 1 <- 2    3
                     prev  cur

step 3:  flip 3 to point at 2; current becomes None, loop ends
         None <- 1 <- 2 <- 3
                          prev   -> prev is the new head
```

In code:

```python
previous = None
current = self.head
while current is not None:
    following = current.next     # 1. remember what comes next
    current.next = previous      # 2. flip the arrow
    previous = current           # 3. step forward
    current = following
self.head = previous
```

The order of the first two lines is vital. If you flip the arrow first, you lose the only link to the rest of the chain. This runs in **O(n)** time and **O(1)** extra memory, because it reuses the existing nodes.

## Linked list or Python list?

| Operation | Python list | Linked list |
| --- | --- | --- |
| Read item i | O(1) | O(n) |
| Insert at the front | O(n) | O(1) |
| Append at the end | O(1) | O(n), or O(1) with a tail |
| Uses extra memory for links | no | yes |

In everyday Python the built-in list is almost always better. Linked lists matter as a way of thinking, and as the building block of other structures (stacks, queues, hash-table buckets, trees).

> **Watch out:**
> - `AttributeError: 'NoneType' object has no attribute 'next'` means you followed a pointer past the end. Check `is not None` before using `.next`.
> - Looping with `while last is not None` walks off the end. For append you need `while last.next is not None`.
> - Forgetting `self.head = previous` at the end of `reverse` leaves the head pointing at the old first node, which is now the last, so you see only one item.
> - Forgetting the empty-list case in `append` crashes with the `AttributeError` above.

## Going further

Add `prepend(value)` (insert at the front), `find(value)`, and `remove(value)`. Removing is the trickiest: you must keep a `previous` pointer so you can make it skip the removed node.

> **Your turn:** implement `append` and `reverse` for the `LinkedList` class. Reverse by flipping the `next` links with a `while` loop, not by copying values into a Python list.
