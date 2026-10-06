---
title: Merging branches
summary: Bring finished work back together and learn the difference between a fast-forward and a merge commit.
level: intermediate
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

      # Part A: a fast-forward merge
      # 1. Create and switch to a branch called add-soup.
      echo "Soup: water, salt" >> recipes.txt
      # 2. Commit the change. Message: Add soup recipe
      # 3. Go back to main.
      # 4. Merge add-soup into main (main has no new commits, so Git can simply slide forward).
      # 5. Show the short history.
      # 6. The branch is merged, so delete it (the safe delete option).

      # Part B: a real merge, because both branches moved
      # 7. Create and switch to a branch called add-salad.
      echo "Salad: lettuce" > salad.txt
      # 8. Stage salad.txt and commit it. Message: Add salad recipe
      # 9. Go back to main.
      echo "Pasta: flour, eggs" > pasta.txt
      git add pasta.txt
      git commit -m "Add pasta recipe"
      # 10. Merge add-salad into main. Both sides have new commits now.
      # 11. Draw the short history as a graph.
      # 12. List the files in the folder: all the recipe files are there.

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
    $ git switch -c add-soup
    Switched to a new branch 'add-soup'
    $ echo "Soup: water, salt" >> recipes.txt
    $ git commit -am "Add soup recipe"
    [add-soup 22e83bc] Add soup recipe
     1 file changed, 1 insertion(+)
    $ git switch main
    Switched to branch 'main'
    $ git merge add-soup
    Updating 069d2b7..22e83bc
    Fast-forward
     recipes.txt | 1 +
     1 file changed, 1 insertion(+)
    $ git log --oneline
    22e83bc (HEAD -> main, add-soup) Add soup recipe
    069d2b7 Start recipe book
    $ git branch -d add-soup
    Deleted branch add-soup (was 22e83bc).
    $ git switch -c add-salad
    Switched to a new branch 'add-salad'
    $ echo "Salad: lettuce" > salad.txt
    $ git add salad.txt
    $ git commit -m "Add salad recipe"
    [add-salad e5bebbf] Add salad recipe
     1 file changed, 1 insertion(+)
     create mode 100644 salad.txt
    $ git switch main
    Switched to branch 'main'
    $ echo "Pasta: flour, eggs" > pasta.txt
    $ git add pasta.txt
    $ git commit -m "Add pasta recipe"
    [main 6c72924] Add pasta recipe
     1 file changed, 1 insertion(+)
     create mode 100644 pasta.txt
    $ git merge add-salad
    Merge made by the 'ort' strategy.
     salad.txt | 1 +
     1 file changed, 1 insertion(+)
     create mode 100644 salad.txt
    $ git log --oneline --graph
    *   f93dd91 (HEAD -> main) Merge branch 'add-salad'
    |\
    * | 6c72924 Add pasta recipe
    | * e5bebbf (add-salad) Add salad recipe
    |/
    * 22e83bc Add soup recipe
    * 069d2b7 Start recipe book
    $ ls
    README.md  pasta.txt  recipes.txt  salad.txt
  code:
    - { pattern: 'git\s+merge\s+add-soup', message: "Merge the soup branch with git merge add-soup." }
    - { pattern: 'git\s+branch\s+-d\s+add-soup', message: "Delete the merged branch with git branch -d add-soup." }
    - { pattern: 'git\s+merge\s+add-salad', message: "Merge the salad branch with git merge add-salad." }
    - { pattern: 'git\s+log\s+--oneline\s+--graph', message: "Show the graph with git log --oneline --graph." }
hints:
  - "You always merge INTO the branch you are standing on. So switch to main first, then name the branch you want to bring in."
  - "Part A: git switch -c add-soup, commit, git switch main, git merge add-soup, git log --oneline, git branch -d add-soup. Part B: git switch -c add-salad, git add salad.txt, commit, git switch main, (pasta lines), git merge add-salad, git log --oneline --graph, ls."
  - 'git switch -c add-soup / git commit -am "Add soup recipe" / git switch main / git merge add-soup / git log --oneline / git branch -d add-soup / git switch -c add-salad / git add salad.txt / git commit -m "Add salad recipe" / git switch main / git merge add-salad / git log --oneline --graph / ls'
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

      git switch -c add-soup
      echo "Soup: water, salt" >> recipes.txt
      git commit -am "Add soup recipe"
      git switch main
      git merge add-soup
      git log --oneline
      git branch -d add-soup

      git switch -c add-salad
      echo "Salad: lettuce" > salad.txt
      git add salad.txt
      git commit -m "Add salad recipe"
      git switch main
      echo "Pasta: flour, eggs" > pasta.txt
      git add pasta.txt
      git commit -m "Add pasta recipe"
      git merge add-salad
      git log --oneline --graph
      ls
quiz:
  - q: "You are on main and run git merge add-soup. Which branch receives the changes?"
    options: ["add-soup", "Both branches", "main"]
    answer: 2
    explain: "You always merge into the branch you are currently on."
  - q: "When can Git do a fast-forward merge?"
    options: ["When the current branch has no new commits of its own, so Git can just move the label forward", "Only when there are conflicts", "Only when the branches have the same name"]
    answer: 0
  - q: "What does a merge commit have that a normal commit does not?"
    options: ["No message", "Two parents, one from each branch", "No author"]
    answer: 1
  - q: "After merging a branch, what is a good next step?"
    options: ["Reinstall Git", "Delete the .git folder", "Delete the merged branch with git branch -d, since its work is now part of main"]
    answer: 2
---

Branches are only useful if you can bring the work back together. That is **merging**: take the commits of one branch and combine them into another. In this lesson you will meet the two kinds of merge that Git performs.

## The golden rule

You merge **into the branch you are on**. The usual routine is:

```bash
git switch main          # go to the branch that should receive the work
git merge add-soup       # bring add-soup in
```

Never think "merge main into soup" unless you really mean it. The branch you name is read-only in this operation, and the branch you stand on changes.

## Kind 1: fast-forward

Imagine `add-soup` started from the latest commit of `main` and, while you worked, nobody added anything to `main`. The history is a straight line:

```
main:      A --- B
add-soup:         \--- C
```

Git does not need to combine anything. It just moves the `main` label forward from B to C. That is a **fast-forward**, and it prints:

```
Updating 069d2b7..22e83bc
Fast-forward
 recipes.txt | 1 +
 1 file changed, 1 insertion(+)
```

No new commit is created, and the history stays a clean line.

## Kind 2: a merge commit

Now suppose that while you worked on `add-salad`, `main` also got a new commit (the pasta). The histories have **diverged**: both sides have commits the other lacks. Git cannot slide a label anymore. It does a **three-way merge**: it looks at the common ancestor and both tips, combines the changes, and records the result in a special **merge commit** that has two parents.

```
Merge made by the 'ort' strategy.
 salad.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 salad.txt
```

The graph shows the shape well:

```
*   f93dd91 (HEAD -> main) Merge branch 'add-salad'
|\
* | 6c72924 Add pasta recipe
| * e5bebbf (add-salad) Add salad recipe
|/
* 22e83bc Add soup recipe
```

The `|\` and `|/` lines are the two histories splitting and joining. Different files changed on each side, so Git combined them without asking you anything. What happens when both sides touch the same line is the topic of the next lesson.

In a real terminal, Git opens your editor for the merge commit message (pre-filled with `Merge branch 'add-salad'`); just save and close it. If you want a merge commit even when a fast-forward is possible, use `git merge --no-ff add-soup`. Teams use this to keep a visible record that a feature branch existed.

## Cleaning up

Once a branch is merged, its commits are part of `main`, so the label is no longer needed:

```bash
git branch -d add-soup
```

`-d` is the safe delete: it refuses if the branch has work that is not merged anywhere. Deleting only removes the label, never the commits that were merged.

> **Watch out:**
> - `Already up to date.` means the branch you named has nothing new for you. Maybe you merged in the wrong direction.
> - Merging while you have uncommitted edits to the same files gives `error: Your local changes to the following files would be overwritten by merge`. Commit or stash first.
> - `merge: add-soup - not something we can merge` means the branch name is misspelled. Check `git branch`.
> - If a merge goes wrong, `git merge --abort` brings you back to the state before the merge.

> **Your turn:** follow the twelve numbered comments. In part A, create `add-soup`, commit with the message `Add soup recipe`, switch to `main`, merge, show the log and delete the branch. In part B, create `add-salad`, stage and commit `salad.txt` with the message `Add salad recipe`, go back to `main` (the pasta commit is already in the starter), merge `add-salad`, draw the graph with `git log --oneline --graph` and list the files with `ls`.
