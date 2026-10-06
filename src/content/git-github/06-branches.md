---
title: Branches
summary: Work on new ideas in parallel lines of history with git branch and git switch.
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

      # 1. List the branches (there is only main).
      # 2. Create a new branch called add-soup (you stay on main).
      # 3. Move over to the add-soup branch.
      echo "Soup: water, salt" >> recipes.txt
      # 4. Save the change with a commit (stage all tracked files and commit in one step). Message: Add soup recipe
      # 5. List the branches again: the star marks the branch you are on.
      # 6. Show the short history.
      # 7. Go back to main.
      # 8. Print recipes.txt: the soup is not there, it only exists on the other branch.
      # 9. Create AND switch to a new branch called add-salad in one command.
      echo "Salad: lettuce" >> recipes.txt
      # 10. Commit this change too. Message: Add salad recipe
      # 11. Draw the history of all branches as a graph (short form).

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
    $ git branch
    * main
    $ git branch add-soup
    $ git switch add-soup
    Switched to branch 'add-soup'
    $ echo "Soup: water, salt" >> recipes.txt
    $ git commit -am "Add soup recipe"
    [add-soup 22e83bc] Add soup recipe
     1 file changed, 1 insertion(+)
    $ git branch
    * add-soup
      main
    $ git log --oneline
    22e83bc (HEAD -> add-soup) Add soup recipe
    069d2b7 (main) Start recipe book
    $ git switch main
    Switched to branch 'main'
    $ cat recipes.txt
    Pancakes: flour, milk, eggs
    $ git switch -c add-salad
    Switched to a new branch 'add-salad'
    $ echo "Salad: lettuce" >> recipes.txt
    $ git commit -am "Add salad recipe"
    [add-salad a1d5844] Add salad recipe
     1 file changed, 1 insertion(+)
    $ git log --oneline --graph --all
    * a1d5844 (HEAD -> add-salad) Add salad recipe
    | * 22e83bc (add-soup) Add soup recipe
    |/
    * 069d2b7 (main) Start recipe book
  code:
    - { pattern: 'git\s+branch\s+add-soup', message: "Create the branch with git branch add-soup." }
    - { pattern: 'git\s+switch\s+add-soup', message: "Move to the branch with git switch add-soup." }
    - { pattern: 'git\s+switch\s+-c\s+add-salad', message: "Create and switch in one step with git switch -c add-salad." }
    - { pattern: 'git\s+log\s+--oneline\s+--graph\s+--all', message: "Draw the graph with git log --oneline --graph --all." }
hints:
  - "A branch is a movable label on a commit. git branch creates or lists branches, git switch moves you between them, and git switch -c does both creating and moving."
  - "git branch / git branch add-soup / git switch add-soup / (echo) / git commit -am ... / git branch / git log --oneline / git switch main / cat recipes.txt / git switch -c add-salad / (echo) / git commit -am ... / git log --oneline --graph --all"
  - 'Commit messages: git commit -am "Add soup recipe" and git commit -am "Add salad recipe". The last command is git log --oneline --graph --all.'
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

      git branch
      git branch add-soup
      git switch add-soup
      echo "Soup: water, salt" >> recipes.txt
      git commit -am "Add soup recipe"
      git branch
      git log --oneline
      git switch main
      cat recipes.txt
      git switch -c add-salad
      echo "Salad: lettuce" >> recipes.txt
      git commit -am "Add salad recipe"
      git log --oneline --graph --all
quiz:
  - q: "What is a branch, really?"
    options: ["A full copy of the project folder", "A lightweight, movable label pointing at a commit", "A backup stored on GitHub"]
    answer: 1
    explain: "Because a branch is only a pointer, creating one is instant and costs almost no space."
  - q: "Which command creates a new branch AND moves you onto it?"
    options: ["git branch new-idea", "git switch new-idea", "git switch -c new-idea"]
    answer: 2
  - q: "You switch from a feature branch back to main. What happens to the files in your folder?"
    options: ["They change to match the latest commit on main", "They stay the same", "They are deleted"]
    answer: 0
  - q: "Why do developers use branches?"
    options: ["To make Git run faster", "To hide commits from other people", "To try changes without disturbing the stable version"]
    answer: 2
---

A **branch** lets you try something new without risking the working version. You can start a "salad feature" on one branch while a teammate fixes a "soup bug" on another, and neither of you disturbs `main`. Later you bring the work together (lessons 7 and 8).

## What a branch really is

Every commit points to its parent, so the history is a chain. A branch is just a **name pointing at one commit** in that chain. `main` is the default branch name (older repositories call it `master`). When you commit, the branch you are on moves forward to the new commit.

`HEAD` (lesson 3) tells Git which branch you are standing on. That is why the log shows `(HEAD -> add-soup)`.

Because a branch is only a label, creating one is instant. Use them freely: one branch per idea is a very common habit.

## Working with branches

| Command | What it does |
|---|---|
| `git branch` | lists branches; a `*` marks the current one |
| `git branch add-soup` | creates the branch but you stay where you are |
| `git switch add-soup` | moves you onto that branch |
| `git switch -c add-salad` | creates the branch and moves onto it (the `-c` stands for "create") |
| `git branch -d add-soup` | deletes a branch that is already merged |

Older tutorials use `git checkout add-soup` and `git checkout -b add-soup`. They do the same, and you will see them often. `git switch` is the newer, clearer command.

## Watching it happen

```bash
git branch add-soup
git switch add-soup
echo "Soup: water, salt" >> recipes.txt
git commit -am "Add soup recipe"
git log --oneline
```

```
22e83bc (HEAD -> add-soup) Add soup recipe
069d2b7 (main) Start recipe book
```

The soup commit exists only on `add-soup`. `main` still points at the earlier commit. Now switch back:

```bash
git switch main
cat recipes.txt        # prints only the pancakes line
```

Git swapped the files in your folder to match `main`: the soup line vanished. It is not lost, it lives on the other branch. Switch back to `add-soup` and it returns. This feels like magic at first, and it is exactly what makes branches so useful.

## Seeing all branches together

`git log --oneline --graph --all` draws every branch:

```
* a1d5844 (HEAD -> add-salad) Add salad recipe
| * 22e83bc (add-soup) Add soup recipe
|/
* 069d2b7 (main) Start recipe book
```

Both branches start from the same commit and then go their own way. The `*` marks commits, and the lines show how they connect.

## Branch names

Use short names without spaces: `add-soup`, `fix-login`, `feature/dark-mode`. Lowercase words with dashes are the usual style.

> **Watch out:**
> - `error: Your local changes to the following files would be overwritten by checkout`: you have uncommitted edits that clash with the branch you want. Commit them first, or stash them (lesson 10).
> - `fatal: a branch named 'add-soup' already exists`: choose another name or just `git switch` to it.
> - Committing on the wrong branch is very common. Always run `git branch` or `git status` to see where you are before you commit.
> - `error: The branch 'x' is not fully merged`: `git branch -d` refuses to delete work that exists nowhere else. Merge it first.
> - You cannot create a branch before the first commit: `fatal: cannot create branch without any commit yet`.

> **Your turn:** follow the eleven numbered comments. Create `add-soup` with `git branch`, move there with `git switch`, commit the soup line with the message `Add soup recipe`, look at the branches and the log, go back to `main` and print `recipes.txt`. Then create and switch to `add-salad` with `git switch -c`, commit the salad line with the message `Add salad recipe` and finish with `git log --oneline --graph --all`.
