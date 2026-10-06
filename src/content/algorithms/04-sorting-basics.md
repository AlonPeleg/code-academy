---
title: "Sorting I: bubble, selection and insertion"
summary: Three simple sorting algorithms, and how to count their swaps.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # bubble_sort is finished for you. Study it, then write the other two.
      # Every sort function returns (sorted_list, count) and must NOT change the original list.
      def bubble_sort(items):
          items = list(items)          # work on a copy
          swaps = 0
          n = len(items)
          for end in range(n - 1, 0, -1):
              for i in range(end):
                  if items[i] > items[i + 1]:
                      items[i], items[i + 1] = items[i + 1], items[i]
                      swaps += 1
          return items, swaps


      # SELECTION sort. Count SWAPS.
      # For each position i from 0 to n-2:
      #   find the index of the smallest item from i to the end,
      #   and if it is not already at i, swap it into place (count 1 swap).
      def selection_sort(items):
          pass


      # INSERTION sort. Count SHIFTS (each time an item moves one place to the right).
      # For each position i from 1 to n-1:
      #   take current = items[i], then
      #   while the item to its left is bigger than current: shift that item right,
      #   finally drop current into the gap.
      def insertion_sort(items):
          pass


      for data in ([5, 1, 4, 2, 8], [9, 7, 5, 3, 1], [1, 2, 3, 4, 5]):
          print(data)
          for name, fn in (("bubble", bubble_sort), ("selection", selection_sort), ("insertion", insertion_sort)):
              print(name, *fn(data))
check:
  output: |
    [5, 1, 4, 2, 8]
    bubble [1, 2, 4, 5, 8] 4
    selection [1, 2, 4, 5, 8] 2
    insertion [1, 2, 4, 5, 8] 4
    [9, 7, 5, 3, 1]
    bubble [1, 3, 5, 7, 9] 10
    selection [1, 3, 5, 7, 9] 2
    insertion [1, 3, 5, 7, 9] 10
    [1, 2, 3, 4, 5]
    bubble [1, 2, 3, 4, 5] 0
    selection [1, 2, 3, 4, 5] 0
    insertion [1, 2, 3, 4, 5] 0
  code:
    - { pattern: '\bwhile\b', message: "Insertion sort shifts items with a while loop." }
    - { pattern: '^(?![\s\S]*(sorted\s*\(|\.sort\s*\())', message: "Do not use sorted() or .sort(). Write the algorithms yourself." }
hints:
  - "Selection sort: an outer loop picks position i, an inner loop searches i+1 to the end for a smaller item and remembers its index. Insertion sort: take items[i] out, slide bigger items to the right with a while loop, drop it into the gap."
  - "Selection: smallest = i, then for j in range(i + 1, n): if items[j] < items[smallest]: smallest = j. After the inner loop, if smallest != i: swap and add 1. Insertion: j = i - 1 and while j >= 0 and items[j] > current: items[j + 1] = items[j]; shifts += 1; j -= 1."
  - "Insertion: for i in range(1, len(items)):   current = items[i]   j = i - 1   while j >= 0 and items[j] > current:       items[j + 1] = items[j]       shifts += 1       j -= 1   items[j + 1] = current      Selection: swap with items[i], items[smallest] = items[smallest], items[i]"
solution:
  - name: main.py
    code: |
      def bubble_sort(items):
          items = list(items)          # work on a copy
          swaps = 0
          n = len(items)
          for end in range(n - 1, 0, -1):
              for i in range(end):
                  if items[i] > items[i + 1]:
                      items[i], items[i + 1] = items[i + 1], items[i]
                      swaps += 1
          return items, swaps


      def selection_sort(items):
          items = list(items)
          swaps = 0
          n = len(items)
          for i in range(n - 1):
              smallest = i
              for j in range(i + 1, n):
                  if items[j] < items[smallest]:
                      smallest = j
              if smallest != i:
                  items[i], items[smallest] = items[smallest], items[i]
                  swaps += 1
          return items, swaps


      def insertion_sort(items):
          items = list(items)
          shifts = 0
          for i in range(1, len(items)):
              current = items[i]
              j = i - 1
              while j >= 0 and items[j] > current:
                  items[j + 1] = items[j]
                  shifts += 1
                  j -= 1
              items[j + 1] = current
          return items, shifts


      for data in ([5, 1, 4, 2, 8], [9, 7, 5, 3, 1], [1, 2, 3, 4, 5]):
          print(data)
          for name, fn in (("bubble", bubble_sort), ("selection", selection_sort), ("insertion", insertion_sort)):
              print(name, *fn(data))
quiz:
  - q: "Why is bubble sort called bubble sort?"
    options: ["Large values drift towards the end like bubbles rising", "It uses a list shaped like a bubble", "It was invented by Bubble"]
    answer: 0
  - q: "Which of these three algorithms makes the fewest swaps on reversed data?"
    options: ["Bubble sort", "Selection sort", "Insertion sort"]
    answer: 1
    explain: "Selection sort does at most one swap per position, so about n swaps at most."
  - q: "What is the worst-case number of steps of all three simple sorts?"
    options: ["O(n)", "O(log n)", "O(n squared)"]
    answer: 2
  - q: "Which simple sort is very fast on an already sorted list?"
    options: ["Insertion sort", "Plain bubble sort with no early exit", "Selection sort"]
    answer: 0
    explain: "Insertion sort finds nothing to shift in a sorted list, so it needs only about n comparisons."
---

Sorting puts items in order: names from A to Z, prices from low to high, scores from best to worst. It is one of the most studied problems in computer science. Python has `sorted()` built in, so why write your own? Because sorting is the best playground for learning to **compare algorithms**, and the ideas you learn here (nested loops, swapping, invariants) show up everywhere.

## Swapping two items

Every sort needs to swap two list items. Python lets you do it in one line without a temporary variable:

```python
items = [5, 1, 4]
items[0], items[1] = items[1], items[0]
print(items)   # prints: [1, 5, 4]
```

The right side is built first as the pair `(items[1], items[0])`, then unpacked into the two places.

## Bubble sort: neighbours that are out of order

Walk through the list comparing **neighbours**. If a pair is in the wrong order, swap them. After one full pass the largest value has "bubbled" to the end. Repeat for the part that is not yet fixed.

```text
[5, 1, 4, 2, 8]
pass 1: swap 5,1 -> [1, 5, 4, 2, 8]
        swap 5,4 -> [1, 4, 5, 2, 8]
        swap 5,2 -> [1, 4, 2, 5, 8]      8 is already in place
pass 2: swap 4,2 -> [1, 2, 4, 5, 8]      done after 4 swaps in total
```

The code is in your starter. Two nested loops over `n` items give **O(n squared)** comparisons.

## Selection sort: pick the smallest

Look through the unsorted part, **select** the smallest item, and swap it into the next free position at the front. Repeat.

```text
[5, 1, 4, 2, 8]
i=0: smallest is 1 -> swap with 5     [1, 5, 4, 2, 8]
i=1: smallest is 2 -> swap with 5     [1, 2, 4, 5, 8]
i=2: 4 is already smallest -> no swap
i=3: 5 is already smallest -> no swap
```

It still scans for the minimum every round, so it is **O(n squared)** comparisons, but it makes at most **one swap per position**. That makes it attractive when swapping is expensive.

## Insertion sort: sorting a hand of cards

When you sort playing cards in your hand, you pick up the next card and slide it left until it fits among the cards you already hold. That is insertion sort.

```text
[5, 1, 4, 2, 8]
i=1: take 1, shift 5 right        [1, 5, 4, 2, 8]
i=2: take 4, shift 5 right        [1, 4, 5, 2, 8]
i=3: take 2, shift 5 and 4 right  [1, 2, 4, 5, 8]
i=4: take 8, nothing to shift     [1, 2, 4, 5, 8]
```

The left part of the list is always sorted. The `while` loop shifts bigger items right one place at a time, and the `current` item is dropped into the gap. On already-sorted data it does almost nothing, which makes it **O(n)** in the best case. It is also the algorithm many real sort functions use for tiny lists.

## Comparing them by counting

Your program will print how much each algorithm "moves" for three inputs. Compare the numbers: on the reversed list `[9, 7, 5, 3, 1]` bubble and insertion both do 10 moves (every pair is out of order), but selection does only 2. On the sorted list all three do nothing. Different algorithms, different strengths. All three are O(n squared) in the worst case, which is why we need better ones, coming in the next lesson.

> **Watch out:**
> - If you sort `items` directly, you change the caller's list. Make a copy first with `items = list(items)`.
> - In insertion sort the check order matters: `while j >= 0 and items[j] > current`. If you swap the two conditions, you read `items[-1]` (the last item) when `j` is `-1`, which gives wrong results without an error.
> - Forgetting `items[j + 1] = current` after the loop makes items disappear or duplicate.
> - `range(n - 1)` for the selection outer loop is correct, because the last item is automatically in place. Using `range(n)` still works but wastes a round.

## Going further

Make `bubble_sort` stop early: if a whole pass makes no swap, the list is already sorted, so you can break out. With that change, bubble sort on an already-sorted list becomes O(n).

> **Your turn:** write `selection_sort` (count swaps, skip a swap when the smallest item is already in place) and `insertion_sort` (count shifts) so that all printed results match. Do not use `sorted()` or `.sort()`.
