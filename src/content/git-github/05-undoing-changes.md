---
title: "Undoing mistakes: restore, amend, revert, reset"
summary: Discard edits, unstage files, fix the last commit and undo older commits, safely.
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

      echo "Burnt toast" >> recipes.txt
      # 1. Throw the unwanted line away: bring recipes.txt back to how it was in the last commit.
      # 2. Print recipes.txt to check that the junk line is gone.

      echo "Omelette: eggs, salt" >> recipes.txt
      echo "TODO: secret notes" > notes.txt
      git add .
      # 3. Oops, notes.txt must not be committed. Take it out of the staging area (keep the file itself).
      # 4. Look at the status.
      git commit -m "Add omlette recipe"
      # 5. The message has a typo. Fix the last commit's message: Add omelette recipe
      # 6. Show the short history.

      echo "Soup: water, salt" >> recipes.txt
      git commit -am "Add soup recipe"
      # 7. The soup was a bad idea. Undo that commit SAFELY, by adding a new commit that cancels it.
      # 8. Show the short history.

      echo "Oops" >> recipes.txt
      git commit -am "Oops"
      # 9. This commit was never shared. Delete it completely, including its changes (go back one commit).
      # 10. Show the short history.

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
    $ echo "Burnt toast" >> recipes.txt
    $ git restore recipes.txt
    $ cat recipes.txt
    Pancakes: flour, milk, eggs
    $ echo "Omelette: eggs, salt" >> recipes.txt
    $ echo "TODO: secret notes" > notes.txt
    $ git add .
    $ git restore --staged notes.txt
    $ git status
    On branch main

    Changes to be committed:
      (use "git restore --staged <file>..." to unstage)
    	modified:   recipes.txt

    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    	notes.txt
    $ git commit -m "Add omlette recipe"
    [main 3ba4f1c] Add omlette recipe
     1 file changed, 1 insertion(+)
    $ git commit --amend -m "Add omelette recipe"
    [main b142cca] Add omelette recipe
     Date: Mon Jan 15 13:00:00 2024 +0000
     1 file changed, 1 insertion(+)
    $ git log --oneline
    b142cca (HEAD -> main) Add omelette recipe
    069d2b7 Start recipe book
    $ echo "Soup: water, salt" >> recipes.txt
    $ git commit -am "Add soup recipe"
    [main 10d2a9d] Add soup recipe
     1 file changed, 1 insertion(+)
    $ git revert HEAD
    [main 9a86a63] Revert "Add soup recipe"
     Date: Mon Jan 15 15:00:00 2024 +0000
     1 file changed, 1 deletion(-)
    $ git log --oneline
    9a86a63 (HEAD -> main) Revert "Add soup recipe"
    10d2a9d Add soup recipe
    b142cca Add omelette recipe
    069d2b7 Start recipe book
    $ echo "Oops" >> recipes.txt
    $ git commit -am "Oops"
    [main 090e477] Oops
     1 file changed, 1 insertion(+)
    $ git reset --hard HEAD~1
    HEAD is now at 9a86a63 Revert "Add soup recipe"
    $ git log --oneline
    9a86a63 (HEAD -> main) Revert "Add soup recipe"
    10d2a9d Add soup recipe
    b142cca Add omelette recipe
    069d2b7 Start recipe book
  code:
    - { pattern: 'git\s+restore\s+recipes\.txt', message: "Use git restore <file> to discard the edit." }
    - { pattern: 'git\s+restore\s+--staged\s+notes\.txt', message: "Use git restore --staged notes.txt to unstage it." }
    - { pattern: 'git\s+commit\s+--amend', message: "Use git commit --amend to fix the last commit." }
    - { pattern: 'git\s+revert\s+HEAD', message: "Use git revert HEAD to undo the soup commit safely." }
    - { pattern: 'git\s+reset\s+--hard\s+HEAD~1', message: "Use git reset --hard HEAD~1 to delete the last commit." }
hints:
  - "Each problem has its own tool. Edit not yet staged: git restore. File staged by mistake: git restore --staged. Typo in the last message: git commit --amend. Undo a shared commit: git revert. Delete a private commit: git reset --hard."
  - "Step 1: git restore recipes.txt. Step 3: git restore --staged notes.txt. Step 5: git commit --amend -m with the corrected text. Step 7: git revert HEAD. Step 9: git reset --hard HEAD~1. Steps 2, 4, 6, 8 and 10 print things (cat, git status, git log --oneline)."
  - 'git restore recipes.txt / cat recipes.txt / git restore --staged notes.txt / git status / git commit --amend -m "Add omelette recipe" / git log --oneline / git revert HEAD / git log --oneline / git reset --hard HEAD~1 / git log --oneline  (each one goes under its numbered comment)'
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

      echo "Burnt toast" >> recipes.txt
      git restore recipes.txt
      cat recipes.txt

      echo "Omelette: eggs, salt" >> recipes.txt
      echo "TODO: secret notes" > notes.txt
      git add .
      git restore --staged notes.txt
      git status
      git commit -m "Add omlette recipe"
      git commit --amend -m "Add omelette recipe"
      git log --oneline

      echo "Soup: water, salt" >> recipes.txt
      git commit -am "Add soup recipe"
      git revert HEAD
      git log --oneline

      echo "Oops" >> recipes.txt
      git commit -am "Oops"
      git reset --hard HEAD~1
      git log --oneline
quiz:
  - q: "You edited recipes.txt but have not staged it, and you want the edit gone. Which command does that?"
    options: ["git revert recipes.txt", "git restore recipes.txt", "git restore --staged recipes.txt"]
    answer: 1
    explain: "git restore <file> throws away unstaged edits. This cannot be undone, so be sure."
  - q: "Why is git revert safer than git reset --hard for commits you already shared with others?"
    options: ["It deletes the commit from everyone's computer", "It is faster", "It adds a new commit that cancels the old one, so history is never rewritten"]
    answer: 2
  - q: "What does git commit --amend do?"
    options: ["Replaces the last commit with a new one (new message and/or newly staged changes)", "Adds a second commit on top", "Deletes the last commit and its changes"]
    answer: 0
  - q: "Which command permanently throws away the last commit AND the changes in it?"
    options: ["git reset --soft HEAD~1", "git restore --staged .", "git reset --hard HEAD~1"]
    answer: 2
---

Everybody makes mistakes. The good news: Git is built so that most mistakes can be fixed. The tricky part is that "undo" means different things depending on what already happened. This lesson gives you one tool for each situation.

## Where is the mistake?

Ask yourself how far the mistake has travelled, then pick the matching tool:

| Situation | Tool |
|---|---|
| Edited a file, not staged yet, want the old content back | `git restore <file>` |
| Staged a file by mistake | `git restore --staged <file>` |
| Typo in the last commit message (or forgot a file) | `git commit --amend` |
| A bad commit that others may already have | `git revert <commit>` |
| A bad commit that only exists on your computer | `git reset --hard <commit>` |

## Throw away edits: git restore

```bash
git restore recipes.txt
```

replaces the file with the version from the last commit (or from the staging area if you staged something). The edit is **gone for good**, because Git never saved it. Use it only when you are sure.

## Unstage: git restore --staged

```bash
git restore --staged notes.txt
```

moves the file back out of the staging area. Your edit is untouched; the file is just not part of the next commit. `git status` even reminds you of this command: look for `(use "git restore --staged <file>..." to unstage)`.

## Fix the last commit: git commit --amend

```bash
git commit --amend -m "Add omelette recipe"
```

replaces the newest commit with a new one that has the new message. If you also stage more files first, the amended commit contains them too. The old commit is not edited, it is replaced, so the hash changes. Only amend commits you have not shared.

## Undo safely: git revert

```bash
git revert HEAD
```

creates a **new** commit that does the opposite of the commit you name. The history shows both the bad commit and the revert:

```
9a86a63 (HEAD -> main) Revert "Add soup recipe"
10d2a9d Add soup recipe
```

Nothing is rewritten, so this is the right choice for anything already shared, for example on GitHub. In a real terminal it opens an editor with a prefilled message; save and close it.

## Go back in time: git reset

```bash
git reset --hard HEAD~1
```

moves your branch back one commit. It comes in three strengths:

- `--soft`: only moves the branch. The changes stay staged.
- `--mixed` (the default): also unstages. The changes stay in your files.
- `--hard`: also resets your files. The changes are **deleted**.

Because `--hard` destroys work, think twice. Never reset commits that you have already pushed and that other people use, because it rewrites the shared history.

> **Watch out:**
> - `git restore` and `git reset --hard` can delete uncommitted work that Git cannot bring back. Run `git status` and `git diff` first.
> - After `--amend` the commit has a new hash. If it was already pushed, others will have trouble. Amend only private commits.
> - Real Git also has a safety net called `git reflog` that lists where HEAD has been, so even a hard reset of a committed change can often be recovered. Uncommitted changes are not in it.
> - `error: pathspec 'recipes.text' did not match any file(s) known to git` means a typo in the file name.

> **Your turn:** work through the ten numbered comments in the starter, replacing each with the right command: `git restore recipes.txt`, `cat recipes.txt`, `git restore --staged notes.txt`, `git status`, `git commit --amend -m "Add omelette recipe"`, `git log --oneline`, `git revert HEAD`, `git log --oneline`, `git reset --hard HEAD~1` and `git log --oneline`.
