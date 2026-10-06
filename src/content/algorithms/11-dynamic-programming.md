---
title: Dynamic programming
summary: Remember sub-answers so that exponential recursion becomes fast - Fibonacci, coin change and longest common subsequence.
level: advanced
runner: python
files:
  - name: main.py
    code: |
      # 1. fib_memo(n, memo=None): the n-th Fibonacci number (0, 1, 1, 2, 3, 5, ...)
      #    Plain recursion would take forever for n = 80, so REMEMBER answers you
      #    already computed in a dictionary (memoization).
      #    fib(0) = 0, fib(1) = 1, fib(n) = fib(n-1) + fib(n-2)
      def fib_memo(n, memo=None):
          pass


      # 2. coin_change(coins, amount): the FEWEST coins that add up to amount,
      #    or -1 if it is impossible. Every coin value may be used any number of times.
      #    Bottom-up table: best[a] = fewest coins for the amount a.
      #      best[0] = 0.  For each amount a from 1 up to amount, try every coin c <= a:
      #      best[a] = the smallest of best[a - c] + 1.
      #    Start every other entry as "impossible" (a number bigger than any real answer).
      def coin_change(coins, amount):
          pass


      # 3. lcs_length(a, b): length of the longest common SUBSEQUENCE of two strings
      #    (letters in the same order, but not necessarily next to each other).
      #    Build a table of (len(a) + 1) rows and (len(b) + 1) columns filled with 0.
      #    table[i][j] = answer for the first i letters of a and the first j letters of b:
      #      if a[i - 1] == b[j - 1]: table[i][j] = table[i - 1][j - 1] + 1
      #      else: the larger of table[i - 1][j] and table[i][j - 1]
      def lcs_length(a, b):
          pass


      print(fib_memo(10), fib_memo(80))
      print(coin_change([1, 5, 10, 25], 63))
      print(coin_change([1, 3, 4], 6))
      print(coin_change([5, 10], 3))
      print(coin_change([2], 0))
      print(lcs_length("ABCBDAB", "BDCABA"))
      print(lcs_length("AGGTAB", "GXTXAYB"))
      print(lcs_length("abc", "xyz"))
check:
  output: |
    55 23416728348467685
    6
    2
    -1
    0
    4
    4
    0
  code:
    - { pattern: '\{\s*\}|dict\s*\(', message: "Use a dictionary to remember Fibonacci results." }
    - { pattern: '(fib_memo\s*\([\s\S]*){5}', message: "fib_memo should call itself (twice) for the two smaller numbers." }
    - { pattern: '^(?![\s\S]*(lru_cache|functools|@cache))', message: "Do not use functools caching. Write the memo yourself." }
hints:
  - "Dynamic programming = split into overlapping sub-problems and store each answer once. fib uses a dictionary (top-down), coin_change and lcs fill a list or table (bottom-up)."
  - "fib_memo: if memo is None: memo = {}; if n < 2: return n; if n in memo: return memo[n]; memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo); return memo[n]. coin_change: best = [0] + [amount + 1] * amount, then nested loops over a and over coins."
  - "coin_change:   for a in range(1, amount + 1):       for c in coins:           if c <= a and best[a - c] + 1 < best[a]:               best[a] = best[a - c] + 1   return best[amount] if best[amount] <= amount else -1      lcs: table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]"
solution:
  - name: main.py
    code: |
      def fib_memo(n, memo=None):
          if memo is None:
              memo = {}
          if n < 2:
              return n
          if n in memo:
              return memo[n]
          memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
          return memo[n]


      def coin_change(coins, amount):
          impossible = amount + 1
          best = [0] + [impossible] * amount
          for a in range(1, amount + 1):
              for c in coins:
                  if c <= a and best[a - c] + 1 < best[a]:
                      best[a] = best[a - c] + 1
          return best[amount] if best[amount] != impossible else -1


      def lcs_length(a, b):
          table = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
          for i in range(1, len(a) + 1):
              for j in range(1, len(b) + 1):
                  if a[i - 1] == b[j - 1]:
                      table[i][j] = table[i - 1][j - 1] + 1
                  else:
                      table[i][j] = max(table[i - 1][j], table[i][j - 1])
          return table[len(a)][len(b)]


      print(fib_memo(10), fib_memo(80))
      print(coin_change([1, 5, 10, 25], 63))
      print(coin_change([1, 3, 4], 6))
      print(coin_change([5, 10], 3))
      print(coin_change([2], 0))
      print(lcs_length("ABCBDAB", "BDCABA"))
      print(lcs_length("AGGTAB", "GXTXAYB"))
      print(lcs_length("abc", "xyz"))
quiz:
  - q: "What are the two key properties of a problem that dynamic programming suits?"
    options: ["It is sorted and small", "Overlapping sub-problems and an answer built from the answers to smaller sub-problems", "It uses only numbers"]
    answer: 1
  - q: "What is memoization?"
    options: ["Storing the result of a call so the same call is not computed again", "Writing notes in comments", "Sorting the input first"]
    answer: 0
  - q: "Why is naive recursive fib(80) hopeless?"
    options: ["Python cannot store big numbers", "It uses too many variables", "It recomputes the same values an exponential number of times"]
    answer: 2
    explain: "fib(n) calls fib(n-1) and fib(n-2), which both call fib(n-2) and fib(n-3) and so on, so the work roughly doubles with each step up."
  - q: "For coins [1, 3, 4] and amount 6, why does always taking the biggest coin first give a wrong answer?"
    options: ["It never works", "It picks 4+1+1 (3 coins) but 3+3 (2 coins) is better", "The coin 1 cannot be used"]
    answer: 1
---

Some problems look hard because they ask the same small question over and over. **Dynamic programming** (DP) is the technique of answering each small question **once**, writing the answer down, and reusing it. The name is old and unhelpful; think of it as "recursion with a memory" or "filling in a table". It turns algorithms that would take longer than the age of the universe into ones that finish instantly.

## The problem: repeated work

Fibonacci numbers: each is the sum of the two before (0, 1, 1, 2, 3, 5, 8 ...). The direct recursive definition is lovely:

```python
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
```

But look at the calls for `fib(5)`:

```text
                     fib(5)
                  /          \
             fib(4)           fib(3)
            /      \          /     \
        fib(3)    fib(2)   fib(2)   fib(1)
        /   \
    fib(2) fib(1)  ...
```

`fib(3)` is computed twice, `fib(2)` three times. For `fib(25)` the function is called **242,785 times** to produce a single number. Each extra step up roughly doubles the work: that is **exponential**, O(2 to the power n).

## Idea 1: memoization (top-down)

**Memoization** keeps a dictionary of results. Before computing, check the memo; after computing, store the answer.

```python
def fib_memo(n, memo=None):
    if memo is None:
        memo = {}
    if n < 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

print(fib_memo(80))   # prints: 23416728348467685
```

Each value from 0 to n is now computed exactly once, so the cost drops from exponential to **O(n)**. The same idea made `fib(25)` need about 49 calls instead of 242,785. Python integers never overflow, so even `fib(80)` is exact. (The standard library has `functools.lru_cache` that does this with one line. It is worth knowing, but build it by hand first.)

## Idea 2: tabulation (bottom-up)

Instead of recursion, fill a table from the smallest sub-problem up, so that each entry only needs entries you have already filled.

**Coin change.** What is the fewest coins to make an amount, given coin values? Greedy (always the biggest coin) fails: for coins `[1, 3, 4]` and amount 6, greedy picks 4+1+1 (three coins), but 3+3 needs only two. DP tries everything systematically. Let `best[a]` be the fewest coins for amount `a`. To make `a`, the last coin is some `c`, and before it you made `a - c`:

```text
best[a] = 1 + min(best[a - c]) over coins c with c <= a

coins [1, 3, 4]
amount: 0  1  2  3  4  5  6
best:   0  1  2  1  1  2  2
```

```python
best = [0] + [impossible] * amount
for a in range(1, amount + 1):
    for c in coins:
        if c <= a and best[a - c] + 1 < best[a]:
            best[a] = best[a - c] + 1
```

`impossible` is just a number bigger than any real answer (`amount + 1`), standing for "no way found yet". If it is still there at the end, return `-1`. The cost is O(amount x number of coins).

**Longest common subsequence (LCS).** A subsequence keeps the order but may skip letters. The LCS of `ABCBDAB` and `BDCABA` has length 4 (for example `BCBA`). It is the idea behind `diff` tools and DNA comparison. Let `table[i][j]` be the answer for the first `i` letters of `a` and the first `j` letters of `b`:

- If the last letters match, we extend the best answer for both shortened strings: `table[i-1][j-1] + 1`.
- Otherwise we drop the last letter of one string or the other and take the better result.

```text
a = "AC", b = "ABC"
        ""  A  B  C
   ""    0  0  0  0
   A     0  1  1  1
   C     0  1  1  2     <- LCS length is 2 ("AC")
```

The table has `len(a) x len(b)` cells, each filled in O(1): total **O(n x m)**, instead of the exponential cost of trying every subsequence.

## How to spot a DP problem

1. You can express the answer in terms of answers to **smaller versions** of the same problem.
2. Those smaller problems **overlap**, so the same ones appear again and again.
3. Ask: what is the state (what changes between sub-problems), and what is the base case?

> **Watch out:**
> - A default argument `memo={}` is created only once and shared between calls. It works by accident here but is a classic trap, so use `memo=None`.
> - Forgetting to store into the memo (or the table) makes everything silently slow again, not wrong.
> - Off-by-one in tables: they need `len + 1` rows and columns (for the empty prefix) and the letters are `a[i - 1]`, not `a[i]`.
> - `[[0] * m] * n` makes every row the same list object. Use `[[0] * m for _ in range(n)]`.
> - Deep recursion for large `n` hits `RecursionError`. Bottom-up loops do not.

## Going further

Make `coin_change` also return which coins were used by remembering the last coin at each amount. Or count the number of **ways** to make an amount, which is another DP variation.

> **Your turn:** implement `fib_memo` (recursion plus a dictionary), `coin_change` (bottom-up list) and `lcs_length` (2D table). Do not use `lru_cache`.
