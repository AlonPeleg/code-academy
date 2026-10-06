---
title: "Sorting II: merge sort and quicksort"
summary: Divide and conquer with recursion gives sorting that scales to millions of items.
level: intermediate
runner: python
files:
  - name: main.py
    code: |
      # merge is finished for you: it combines two SORTED lists into one sorted list.
      def merge(left, right):
          result = []
          i = 0
          j = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  result.append(left[i])
                  i += 1
              else:
                  result.append(right[j])
                  j += 1
          result.extend(left[i:])
          result.extend(right[j:])
          return result


      # MERGE SORT (recursive). Return a new sorted list.
      #   Base case: a list of 0 or 1 items is already sorted, return it.
      #   Otherwise: split in the middle, sort each half by calling this
      #   same function, then combine the two sorted halves with merge.
      def merge_sort(items):
          pass


      # QUICK SORT (recursive). Return a new sorted list.
      #   Base case: 0 or 1 items, return the list.
      #   Otherwise: take the first item as the pivot, make a list of the
      #   smaller-than-pivot items and a list of the others, sort both by
      #   calling this same function, and glue: smaller + [pivot] + bigger.
      def quick_sort(items):
          pass


      data = [38, 27, 43, 3, 9, 82, 10]
      big = [(i * 7919) % 1000 for i in range(1000)]    # 0..999 in scrambled order

      for sort_fn in (merge_sort, quick_sort):
          print(sort_fn(data))
          print(sort_fn(big) == list(range(1000)))
          print(sort_fn([]), sort_fn([4]))
check:
  output: |
    [3, 9, 10, 27, 38, 43, 82]
    True
    [] [4]
    [3, 9, 10, 27, 38, 43, 82]
    True
    [] [4]
  code:
    - { pattern: '(merge_sort\s*\([\s\S]*){3}', message: "merge_sort must call itself on both halves." }
    - { pattern: '(quick_sort\s*\([\s\S]*){3}', message: "quick_sort must call itself on both parts." }
    - { pattern: '^(?![\s\S]*(sorted\s*\(|\.sort\s*\())', message: "Do not use sorted() or .sort(). Write the algorithms yourself." }
hints:
  - "Both functions are recursive: they call themselves on smaller lists. Start each with the base case (len(items) <= 1: return items), otherwise split the work."
  - "merge_sort: mid = len(items) // 2, left = merge_sort(items[:mid]), right = merge_sort(items[mid:]), return merge(left, right). quick_sort: pivot = items[0], smaller = [x for x in items[1:] if x < pivot], bigger = [x for x in items[1:] if x >= pivot]."
  - "def merge_sort(items):   if len(items) <= 1: return items   mid = len(items) // 2   return merge(merge_sort(items[:mid]), merge_sort(items[mid:]))      def quick_sort(items):   if len(items) <= 1: return items   pivot = items[0]   ...   return quick_sort(smaller) + [pivot] + quick_sort(bigger)"
solution:
  - name: main.py
    code: |
      def merge(left, right):
          result = []
          i = 0
          j = 0
          while i < len(left) and j < len(right):
              if left[i] <= right[j]:
                  result.append(left[i])
                  i += 1
              else:
                  result.append(right[j])
                  j += 1
          result.extend(left[i:])
          result.extend(right[j:])
          return result


      def merge_sort(items):
          if len(items) <= 1:
              return items
          mid = len(items) // 2
          left = merge_sort(items[:mid])
          right = merge_sort(items[mid:])
          return merge(left, right)


      def quick_sort(items):
          if len(items) <= 1:
              return items
          pivot = items[0]
          smaller = [x for x in items[1:] if x < pivot]
          bigger = [x for x in items[1:] if x >= pivot]
          return quick_sort(smaller) + [pivot] + quick_sort(bigger)


      data = [38, 27, 43, 3, 9, 82, 10]
      big = [(i * 7919) % 1000 for i in range(1000)]    # 0..999 in scrambled order

      for sort_fn in (merge_sort, quick_sort):
          print(sort_fn(data))
          print(sort_fn(big) == list(range(1000)))
          print(sort_fn([]), sort_fn([4]))
quiz:
  - q: "What is the base case of merge sort?"
    options: ["A list of exactly two items", "A list that is already sorted in full", "A list with 0 or 1 items, which is already sorted"]
    answer: 2
  - q: "What is the time complexity of merge sort?"
    options: ["O(n squared)", "O(n log n)", "O(n)"]
    answer: 1
    explain: "There are about log n levels of splitting and each level merges n items in total."
  - q: "What does quicksort do with the pivot?"
    options: ["Puts smaller items on one side and bigger items on the other", "Deletes it", "Always swaps it with the last item"]
    answer: 0
  - q: "When does quicksort with the first item as pivot become slow (O(n squared))?"
    options: ["On a random list", "On a list that is already sorted", "On a list with one item"]
    answer: 1
    explain: "Each pivot is the smallest item, so one side is always empty and the problem only shrinks by one."
---

The simple sorts from the last lesson take about `n * n` steps. For a million items that is a trillion steps, far too slow. This lesson shows the two famous algorithms that do it in about `n * log n` steps, using a powerful strategy called **divide and conquer**, and a technique that goes with it: **recursion**.

## Recursion in two minutes

A **recursive** function is a function that calls itself, on a smaller version of the problem. It needs two ingredients:

1. A **base case**: an input so small that the answer is obvious, where the function stops.
2. A **recursive case**: break the input into smaller pieces and call the same function on them.

```python
def total(numbers):
    if not numbers:                  # base case: empty list
        return 0
    return numbers[0] + total(numbers[1:])   # smaller problem

print(total([1, 2, 3, 4]))   # prints: 10
```

Without the base case the function would call itself forever, until Python stops it with `RecursionError: maximum recursion depth exceeded`.

## Divide and conquer

The strategy has three steps: **divide** the problem into smaller parts, **conquer** each part (usually recursively), then **combine** the results.

## Merge sort

Merge sort splits the list in half, sorts each half recursively, and **merges** the two sorted halves.

```text
              [38, 27, 43, 3]
             /               \
        [38, 27]           [43, 3]
        /     \            /     \
     [38]    [27]       [43]     [3]       <- single items are sorted
        \     /            \     /
        [27, 38]           [3, 43]         <- merge
             \               /
           [3, 27, 38, 43]                 <- merge
```

The clever part is `merge`: combining two sorted lists is easy. Keep a finger on the front of each list, always take the smaller front item, and move that finger. Each item is touched once, so a merge costs O(n). Halving a list repeatedly gives about log n levels, and every level merges n items in total, so the cost is **O(n log n)**. For a million items that is about 20 million steps instead of a trillion.

```python
def merge_sort(items):
    if len(items) <= 1:
        return items                       # base case
    mid = len(items) // 2
    left = merge_sort(items[:mid])         # conquer the left half
    right = merge_sort(items[mid:])        # conquer the right half
    return merge(left, right)              # combine
```

Merge sort is **stable** (equal items keep their original order) and always O(n log n), but it uses extra memory for the new lists.

## Quicksort

Quicksort divides differently. Pick one item, the **pivot**. Put everything smaller to its left and everything bigger to its right. The pivot is now in its final place. Sort the two sides recursively.

```text
[38, 27, 43, 3, 9, 82, 10]    pivot = 38
smaller: [27, 3, 9, 10]       bigger: [43, 82]
result:  quick_sort(smaller) + [38] + quick_sort(bigger)
```

```python
def quick_sort(items):
    if len(items) <= 1:
        return items
    pivot = items[0]
    smaller = [x for x in items[1:] if x < pivot]
    bigger = [x for x in items[1:] if x >= pivot]
    return quick_sort(smaller) + [pivot] + quick_sort(bigger)
```

With a decent pivot the two sides are about equal, so the depth is log n and the cost is **O(n log n)**. With a bad pivot it degrades to **O(n squared)**. Taking the first item as pivot is bad on an already sorted list: nothing is smaller, so each call only removes one item. Real implementations pick a random item or the median of three to avoid this. Fast in practice and sorts in place, but it is not stable.

## Which one is Python's sorted()?

Python uses **Timsort**, a hybrid that combines merge sort and insertion sort and is clever about data that is already partly sorted. In real code always use `sorted()` or `.sort()`. You write these by hand to learn the ideas, not to replace the library.

> **Watch out:**
> - Forgetting the base case gives `RecursionError: maximum recursion depth exceeded`.
> - Returning from only one branch gives `None` back, then `TypeError: can only concatenate list (not "NoneType") to list`.
> - `items[:mid]` and `items[mid:]` must together cover the whole list. If you drop an item, it vanishes from the result.
> - In quicksort, filtering with both `x < pivot` and `x > pivot` loses duplicates. Use `>=` for one side.
> - Sorting the already-sorted list of 1000 items with a first-item pivot goes about 1000 levels deep and can hit Python's default recursion limit with a RecursionError.

## Going further

Try changing the pivot to the middle item `items[len(items) // 2]` and see how the recursion depth behaves on sorted data. How would you count the number of recursive calls? A global counter works; so does returning it alongside the list.

> **Your turn:** write `merge_sort` and `quick_sort` recursively (the `merge` helper is already there). Both must return a new sorted list and handle empty and one-item lists. Do not use `sorted()` or `.sort()`.
