---
title: Staging and committing
summary: Save snapshots of your work with git add and git commit, and learn what the staging area is for.
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

      # 1. Stage only README.md (not recipes.txt).
      # 2. Look at the status: one file is staged, the other is untracked.
      # 3. Save a commit with the message: Add README
      # 4. Stage recipes.txt.
      # 5. Save a second commit with the message: Add first recipe
      # 6. Show the history in the short one-line form.

check:
  output: |
    $ git init
    Initialized empty Git repository in /home/learner/project/.git/
    $ git config user.name "Ada Learner"
    $ git config user.email "ada@example.com"
    $ echo "# Recipe Book" > README.md
    $ echo "Pancakes: flour, milk, eggs" > recipes.txt
    $ git add README.md
    $ git status
    On branch main

    No commits yet

    Changes to be committed:
      (use "git rm --cached <file>..." to unstage)
    	new file:   README.md

    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    	recipes.txt
    $ git commit -m "Add README"
    [main (root-commit) 9dda986] Add README
     1 file changed, 1 insertion(+)
     create mode 100644 README.md
    $ git add recipes.txt
    $ git commit -m "Add first recipe"
    [main 54ade81] Add first recipe
     1 file changed, 1 insertion(+)
     create mode 100644 recipes.txt
    $ git log --oneline
    54ade81 (HEAD -> main) Add first recipe
    9dda986 Add README
  code:
    - { pattern: 'git\s+add\s+README\.md', message: "Stage README.md by name with the add command." }
    - { pattern: 'git\s+commit\s+-m\s+"Add README"', message: 'Commit with the message "Add README".' }
    - { pattern: 'git\s+log\s+--oneline', message: "Finish with the log command and the --oneline option." }
hints:
  - "Saving in Git takes two steps: first you choose what goes into the snapshot (staging), then you save it (committing). You will do both steps twice."
  - "The commands are git add <file>, git status, git commit -m <message> and git log --oneline. Stage README.md first, commit, then stage recipes.txt and commit again."
  - 'git add README.md / git status / git commit -m "Add README" / git add recipes.txt / git commit -m "Add first recipe" / git log --oneline'
solution:
  - name: session.sh
    code: |
      git init
      git config user.name "Ada Learner"
      git config user.email "ada@example.com"
      echo "# Recipe Book" > README.md
      echo "Pancakes: flour, milk, eggs" > recipes.txt

      git add README.md
      git status
      git commit -m "Add README"
      git add recipes.txt
      git commit -m "Add first recipe"
      git log --oneline
quiz:
  - q: "What does git add do?"
    options: ["Saves the snapshot permanently", "Puts the chosen changes into the staging area, ready for the next commit", "Uploads the files to GitHub"]
    answer: 1
  - q: "What is a commit?"
    options: ["A temporary copy that disappears when you close the terminal", "A message sent to a teammate", "A saved snapshot of the staged files with a message describing it"]
    answer: 2
  - q: "What does the -m in git commit -m \"text\" stand for?"
    options: ["message", "merge", "mode"]
    answer: 0
    explain: "Without -m, a real Git opens a text editor and asks you to type the message there."
  - q: "You changed two files but only staged one of them. What does the next commit contain?"
    options: ["Both files", "Only the staged file", "Neither file"]
    answer: 1
---

In the last lesson Git noticed your file but did not save it. Now you will learn the two-step routine that you will repeat thousands of times in your career: **stage** the changes you want, then **commit** them.

## Why two steps?

Think of taking a group photo. First you arrange who stands in the picture (staging), then you press the shutter (committing). Git works the same way. It has three places where a file can live:

1. The **working directory**: the real files you edit.
2. The **staging area** (also called the "index"): the files you picked for the next snapshot.
3. The **repository**: the saved history of commits.

The staging area lets you save a clean, focused snapshot even when you changed five things. You can commit the two files about "login" now and the three about "colors" in a separate commit.

## git add: choose what to save

```bash
git add README.md
```

This copies the current content of `README.md` into the staging area. The command prints nothing when it works. Some useful variations:

- `git add file1.txt file2.txt` stages several files.
- `git add .` stages everything in the folder that is new or changed (the dot means "here").

After staging, `git status` shows the file under **Changes to be committed**, in green on a real terminal:

```
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	recipes.txt
```

You can see both worlds at once: `README.md` is staged, `recipes.txt` is still untracked and will not be part of the snapshot.

## git commit: save the snapshot

```bash
git commit -m "Add README"
```

`commit` saves everything that is staged. The `-m` option gives the **commit message**, a short sentence that explains what this snapshot does. Git answers with something like:

```
[main (root-commit) 9dda986] Add README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

Read it from left to right: you are on branch `main`, this is the first commit ("root-commit"), its short id is `9dda986`, and one file with one new line was saved. Every commit gets a unique id (a long hash); you can use the first seven characters as a nickname. In the practice terminal the ids are fake but always the same, so your output can be compared with the expected one.

A shortcut: `git commit -am "message"` stages all already-tracked files and commits in one go. It does not pick up brand-new files.

## Looking at the history

```bash
git log --oneline
```

prints one line per commit, newest first: the short id, then the message. `(HEAD -> main)` marks where you are right now. More on this in lesson 3.

## Writing a good message

Write what the commit does in the imperative mood, as if giving an order: `Add README`, `Fix typo in recipe`. Keep it short. Avoid `stuff` or `update`.

> **Watch out:**
> - `nothing to commit, working tree clean` or `no changes added to commit`: you forgot `git add`, or nothing changed.
> - `Aborting commit due to empty commit message.`: you left out the message. Add `-m "..."`.
> - In a real terminal, `git commit` without `-m` opens a text editor (often vim). If you get stuck there, type `:q!` and press Enter to leave without saving.
> - Quote the message. `git commit -m Add README` makes Git think `README` is a file name and fail with an error.

> **Your turn:** the starter already creates the repository and two files. Stage `README.md` and look at the status, commit it with the message `Add README`, then stage `recipes.txt`, commit it with the message `Add first recipe`, and finish with `git log --oneline`. Use the messages exactly as written.
