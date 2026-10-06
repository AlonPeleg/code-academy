---
title: Reading history with status, log and show
summary: Look back in time with git log and git show, and learn what HEAD and the commit hashes mean.
level: beginner
runner: git
files:
  - name: session.sh
    code: |
      git init
      git config user.name "Ada Learner"
      git config user.email "ada@example.com"
      echo "# Recipe Book" > README.md
      git add README.md
      git commit -m "Add README"
      echo "Pancakes: flour, milk, eggs" > recipes.txt
      git add recipes.txt
      git commit -m "Add first recipe"
      echo "Omelette: eggs, salt" >> recipes.txt
      git commit -am "Add omelette recipe"

      # 1. Check the status (it should say the working tree is clean).
      # 2. Show the full history.
      # 3. Show the history in the short form: one line per commit.
      # 4. Show only the last 2 commits, in the short form.
      # 5. Show what the newest commit changed.
      # 6. Show what the commit BEFORE the newest one changed (HEAD~1).

check:
  output: |
    $ git init
    Initialized empty Git repository in /home/learner/project/.git/
    $ git config user.name "Ada Learner"
    $ git config user.email "ada@example.com"
    $ echo "# Recipe Book" > README.md
    $ git add README.md
    $ git commit -m "Add README"
    [main (root-commit) 9dda986] Add README
     1 file changed, 1 insertion(+)
     create mode 100644 README.md
    $ echo "Pancakes: flour, milk, eggs" > recipes.txt
    $ git add recipes.txt
    $ git commit -m "Add first recipe"
    [main 54ade81] Add first recipe
     1 file changed, 1 insertion(+)
     create mode 100644 recipes.txt
    $ echo "Omelette: eggs, salt" >> recipes.txt
    $ git commit -am "Add omelette recipe"
    [main 3a33d28] Add omelette recipe
     1 file changed, 1 insertion(+)
    $ git status
    On branch main

    nothing to commit, working tree clean
    $ git log
    commit 3a33d281606eda285f982b715f2b356247d2b028 (HEAD -> main)
    Author: Ada Learner <ada@example.com>
    Date:   Mon Jan 15 13:00:00 2024 +0000

        Add omelette recipe

    commit 54ade81292a3d7960a3f337b10b1bc9a1131a08f
    Author: Ada Learner <ada@example.com>
    Date:   Mon Jan 15 12:00:00 2024 +0000

        Add first recipe

    commit 9dda986969de2665919292138eb220f7bd7f6530
    Author: Ada Learner <ada@example.com>
    Date:   Mon Jan 15 11:00:00 2024 +0000

        Add README
    $ git log --oneline
    3a33d28 (HEAD -> main) Add omelette recipe
    54ade81 Add first recipe
    9dda986 Add README
    $ git log -n 2 --oneline
    3a33d28 (HEAD -> main) Add omelette recipe
    54ade81 Add first recipe
    $ git show HEAD
    commit 3a33d281606eda285f982b715f2b356247d2b028 (HEAD -> main)
    Author: Ada Learner <ada@example.com>
    Date:   Mon Jan 15 13:00:00 2024 +0000

        Add omelette recipe

    diff --git a/recipes.txt b/recipes.txt
    index d907574..845c622 100644
    --- a/recipes.txt
    +++ b/recipes.txt
    @@ -1 +1,2 @@
     Pancakes: flour, milk, eggs
    +Omelette: eggs, salt
    $ git show HEAD~1
    commit 54ade81292a3d7960a3f337b10b1bc9a1131a08f
    Author: Ada Learner <ada@example.com>
    Date:   Mon Jan 15 12:00:00 2024 +0000

        Add first recipe

    diff --git a/recipes.txt b/recipes.txt
    new file mode 100644
    index 0000000..d907574
    --- /dev/null
    +++ b/recipes.txt
    @@ -0,0 +1 @@
    +Pancakes: flour, milk, eggs
  code:
    - { pattern: 'git\s+log\s+-n\s+2\s+--oneline', message: "Limit the short log to two commits with -n 2." }
    - { pattern: 'git\s+show\s+HEAD\s', message: "Use git show HEAD for the newest commit." }
    - { pattern: 'git\s+show\s+HEAD~1', message: "Use git show HEAD~1 for the commit before the newest one." }
hints:
  - "You only need to read, not change anything. Three commands do all the work: status, log and show."
  - "git status, then git log, then git log --oneline, then git log -n 2 --oneline (the -n option limits how many commits are shown), then git show HEAD and git show HEAD~1."
  - "git status / git log / git log --oneline / git log -n 2 --oneline / git show HEAD / git show HEAD~1"
solution:
  - name: session.sh
    code: |
      git init
      git config user.name "Ada Learner"
      git config user.email "ada@example.com"
      echo "# Recipe Book" > README.md
      git add README.md
      git commit -m "Add README"
      echo "Pancakes: flour, milk, eggs" > recipes.txt
      git add recipes.txt
      git commit -m "Add first recipe"
      echo "Omelette: eggs, salt" >> recipes.txt
      git commit -am "Add omelette recipe"

      git status
      git log
      git log --oneline
      git log -n 2 --oneline
      git show HEAD
      git show HEAD~1
quiz:
  - q: "What does HEAD mean in Git?"
    options: ["The first commit ever made", "The commit you are currently on (usually the newest one on your branch)", "The remote server"]
    answer: 1
  - q: "What does HEAD~1 point to?"
    options: ["The parent: the commit just before HEAD", "The next commit after HEAD", "A file called HEAD~1"]
    answer: 0
  - q: "Which command shows exactly what one commit changed?"
    options: ["git show", "git status", "git init"]
    answer: 0
  - q: "In what order does git log list commits?"
    options: ["Oldest first", "Alphabetically by message", "Newest first"]
    answer: 2
    explain: "The newest commit is at the top, which is usually the one you care about."
---

A repository is a story: every commit is one page. In this lesson you learn to read that story, which is something you will do every day, for example to find out when a bug appeared or what a teammate changed.

## git status: where am I right now?

You already know `git status`. Use it before and after almost everything. When nothing is waiting to be saved it prints:

```
On branch main

nothing to commit, working tree clean
```

"Working tree clean" means your files are identical to the last commit.

## git log: the history

```bash
git log
```

prints every commit, newest first. Each entry has four parts:

```
commit 3a33d281606eda285f982b715f2b356247d2b028 (HEAD -> main)
Author: Ada Learner <ada@example.com>
Date:   Mon Jan 15 13:00:00 2024 +0000

    Add omelette recipe
```

- The long number is the commit's **hash**: a unique id calculated from the content. In real Git it looks random; two different commits never share one.
- `(HEAD -> main)` is a label. **HEAD** is Git's "you are here" pointer. Here it says you are on the branch `main`, at this commit.
- **Author** and **Date** come from your Git settings and the clock.
- The indented text is the commit message.

The full log is long, so most people use the compact form:

```bash
git log --oneline
```

```
3a33d28 (HEAD -> main) Add omelette recipe
54ade81 Add first recipe
9dda986 Add README
```

Only the first seven characters of the hash are shown. That is plenty to identify a commit, and you can type those seven characters wherever Git wants a commit.

To limit the output, add `-n` and a number: `git log -n 2 --oneline` shows only the two newest commits. Options can be combined in any order. In a real terminal a long log opens in a pager: press `q` to leave it.

## git show: what did this commit change?

```bash
git show HEAD
```

shows the commit header and then the **diff**: the lines that were added or removed. Lines starting with `+` were added, lines starting with `-` were removed:

```
@@ -1 +1,2 @@
 Pancakes: flour, milk, eggs
+Omelette: eggs, salt
```

You can point at older commits by counting back from HEAD. `HEAD~1` is the parent (one step back), `HEAD~2` is two steps back, and so on. You can also use a hash: `git show 54ade81`.

## Putting it together

A typical detective session: `git log --oneline` to find the suspicious commit, then `git show <hash>` to see what it changed. Because commits are never changed by reading, you cannot hurt anything with `status`, `log` or `show`, so explore freely.

> **Watch out:**
> - `fatal: your current branch 'main' does not have any commits yet`: you ran `git log` before the first commit.
> - `fatal: ambiguous argument 'HEAD~5': unknown revision`: the history is shorter than the number you asked for.
> - `HEAD~1` is written with a tilde `~`, not a dash. `HEAD-1` is not understood.
> - In a real terminal `git log` can show thousands of lines. Use `--oneline` and `-n` to keep it short.

> **Your turn:** the starter builds a three-commit history for you. Add these six commands in order: `git status`, `git log`, `git log --oneline`, `git log -n 2 --oneline`, `git show HEAD` and `git show HEAD~1`.
