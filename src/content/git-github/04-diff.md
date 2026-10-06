---
title: Seeing changes with git diff
summary: Compare your working files with the staging area and the last commit before you save.
level: beginner
runner: git
files:
  - name: session.sh
    code: |
      git init
      git config user.name "Ada Learner"
      git config user.email "ada@example.com"
      echo "# Recipe Book" > README.md
      echo "Pancakes: flour, milk, eggs" > recipes.txt
      git add .
      git commit -m "Start recipe book"

      echo "Omelette: eggs, salt" >> recipes.txt
      # 1. Show what changed (working directory compared with the staging area).
      # 2. Stage recipes.txt.
      # 3. Show the same plain diff again: it is empty now, because nothing is left unstaged.
      # 4. Show the staged changes (what the next commit will contain).

      echo "Waffles: flour, eggs, sugar" >> recipes.txt
      # 5. Look at the status: recipes.txt is staged AND modified again.
      # 6. Show the plain diff: only the Waffles line is new compared with the staging area.
      # 7. Stage recipes.txt again, commit with the message: Add omelette and waffles
      # 8. Check the status one last time.

check:
  output: |
    $ git init
    Initialized empty Git repository in /home/learner/project/.git/
    $ git config user.name "Ada Learner"
    $ git config user.email "ada@example.com"
    $ echo "# Recipe Book" > README.md
    $ echo "Pancakes: flour, milk, eggs" > recipes.txt
    $ git add .
    $ git commit -m "Start recipe book"
    [main (root-commit) 069d2b7] Start recipe book
     2 files changed, 2 insertions(+)
     create mode 100644 README.md
     create mode 100644 recipes.txt
    $ echo "Omelette: eggs, salt" >> recipes.txt
    $ git diff
    diff --git a/recipes.txt b/recipes.txt
    index d907574..845c622 100644
    --- a/recipes.txt
    +++ b/recipes.txt
    @@ -1 +1,2 @@
     Pancakes: flour, milk, eggs
    +Omelette: eggs, salt
    $ git add recipes.txt
    $ git diff
    $ git diff --staged
    diff --git a/recipes.txt b/recipes.txt
    index d907574..845c622 100644
    --- a/recipes.txt
    +++ b/recipes.txt
    @@ -1 +1,2 @@
     Pancakes: flour, milk, eggs
    +Omelette: eggs, salt
    $ echo "Waffles: flour, eggs, sugar" >> recipes.txt
    $ git status
    On branch main

    Changes to be committed:
      (use "git restore --staged <file>..." to unstage)
    	modified:   recipes.txt

    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git restore <file>..." to discard changes in working directory)
    	modified:   recipes.txt
    $ git diff
    diff --git a/recipes.txt b/recipes.txt
    index 845c622..56f9ecb 100644
    --- a/recipes.txt
    +++ b/recipes.txt
    @@ -1,2 +1,3 @@
     Pancakes: flour, milk, eggs
     Omelette: eggs, salt
    +Waffles: flour, eggs, sugar
    $ git add recipes.txt
    $ git commit -m "Add omelette and waffles"
    [main 1ee1743] Add omelette and waffles
     1 file changed, 2 insertions(+)
    $ git status
    On branch main

    nothing to commit, working tree clean
  code:
    - { pattern: 'git\s+diff\s+--staged', message: "Use git diff --staged to see what is staged." }
    - { pattern: 'git\s+commit\s+-m\s+"Add omelette and waffles"', message: 'Commit with the message "Add omelette and waffles".' }
hints:
  - "git diff has two modes: without options it compares your files with the staging area, with --staged it compares the staging area with the last commit."
  - "Order: git diff, git add recipes.txt, git diff (empty), git diff --staged, then after the second echo: git status, git diff, git add recipes.txt, git commit, git status."
  - 'git diff / git add recipes.txt / git diff / git diff --staged (then the echo line) git status / git diff / git add recipes.txt / git commit -m "Add omelette and waffles" / git status'
solution:
  - name: session.sh
    code: |
      git init
      git config user.name "Ada Learner"
      git config user.email "ada@example.com"
      echo "# Recipe Book" > README.md
      echo "Pancakes: flour, milk, eggs" > recipes.txt
      git add .
      git commit -m "Start recipe book"

      echo "Omelette: eggs, salt" >> recipes.txt
      git diff
      git add recipes.txt
      git diff
      git diff --staged

      echo "Waffles: flour, eggs, sugar" >> recipes.txt
      git status
      git diff
      git add recipes.txt
      git commit -m "Add omelette and waffles"
      git status
quiz:
  - q: "You edited a file but did not stage it. Which command shows your edit?"
    options: ["git diff --staged", "git diff", "git log"]
    answer: 1
  - q: "What does git diff --staged show?"
    options: ["The changes waiting in the staging area, i.e. what the next commit will contain", "The changes that are not staged yet", "The difference between two branches"]
    answer: 0
  - q: "In a diff, what does a line starting with + mean?"
    options: ["The line was removed", "The line is a comment", "The line was added"]
    answer: 2
  - q: "You run git add file.txt and then git diff. What do you see?"
    options: ["Everything you changed", "Nothing, because the change is staged, so there is no difference left to show", "An error message"]
    answer: 1
    explain: "A plain git diff compares the working directory with the staging area. Use git diff --staged to see the staged change."
---

Before you save a snapshot, you should know exactly what is in it. `git diff` answers the question "what did I change?" line by line. It is your safety check before every commit.

## What is a diff?

A **diff** (short for "difference") lists the lines that are different between two versions of a file. Here is one:

```
diff --git a/recipes.txt b/recipes.txt
index d907574..845c622 100644
--- a/recipes.txt
+++ b/recipes.txt
@@ -1 +1,2 @@
 Pancakes: flour, milk, eggs
+Omelette: eggs, salt
```

Read it like this:

- `--- a/recipes.txt` is the old version, `+++ b/recipes.txt` is the new one.
- `@@ -1 +1,2 @@` says: in the old version the interesting part is line 1 (one line); in the new version it starts at line 1 and has 2 lines.
- A line starting with a space is unchanged context, a line starting with `+` was **added**, and a line starting with `-` was **removed**. A changed line shows up as one `-` line followed by one `+` line.

You do not need to understand the `index` line; it is Git's internal bookkeeping.

## Two comparisons

Remember the three places from lesson 2: working directory, staging area, last commit. Git can compare neighbours:

| Command | Compares | Answers |
|---|---|---|
| `git diff` | working directory vs staging area | "What have I changed but not staged yet?" |
| `git diff --staged` | staging area vs last commit | "What will my next commit contain?" |

(`--cached` is an older name for `--staged`; both work.)

Here is how they behave while you work:

```bash
echo "Omelette: eggs, salt" >> recipes.txt   # edit the file
git diff            # shows the new Omelette line
git add recipes.txt
git diff            # prints nothing: no unstaged difference is left
git diff --staged   # shows the Omelette line, as it will be committed
```

The `>>` in the first line **appends** a line to the end of the file (a single `>` would replace the whole file).

## Edits after staging

What if you stage a file and then edit it again? Git staged the version at the moment of `git add`. The newer edit is only in your working directory. So the file is listed twice in `git status`: under "Changes to be committed" and under "Changes not staged for commit". `git diff` shows only the new edit, `git diff --staged` shows the older one. If you commit now, only the staged part is saved. To include the new edit, run `git add` again.

## Diff of a single file

Add a file name to look at just that file: `git diff recipes.txt` or `git diff --staged recipes.txt`. With many changed files this keeps the output short. `git diff --stat` prints only a summary of how many lines changed per file.

> **Watch out:**
> - An empty answer from `git diff` does not mean "nothing changed". It may mean everything is already staged. Check `git diff --staged` and `git status`.
> - A brand-new (untracked) file does not appear in `git diff` until you `git add` it, because Git is not watching it yet.
> - `git diff` is read-only. It never changes your files, so it is safe to run as often as you like.
> - In a real terminal long diffs open in a pager. Press `q` to leave it.

> **Your turn:** follow the numbered comments in the starter. Show the unstaged diff, stage `recipes.txt`, show the unstaged diff again (empty) and the staged diff. After the second edit, run `git status` and `git diff`, stage the file again, commit it with the message `Add omelette and waffles` and finish with `git status`.
