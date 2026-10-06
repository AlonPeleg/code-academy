---
title: .gitignore and stash
summary: Keep secrets and junk files out of Git, and put unfinished work aside temporarily with git stash.
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

      # Some files that must never be committed:
      echo "secret=1234" > .env
      echo "debug line" > debug.log
      echo "module code" > node_modules/pkg.js
      git status

      # Part A: .gitignore
      # 1. Create the file .gitignore containing the line: *.log
      # 2. Append two more lines to it: node_modules/ and .env
      # 3. Look at the status: only .gitignore itself is untracked now.
      # 4. Stage .gitignore and commit it. Message: Add .gitignore
      # 5. Look at the status: the working tree is clean, the junk is invisible.

      # Part B: stash
      echo "Omelette: eggs, salt" >> recipes.txt
      # 6. You are interrupted! Put your unfinished edit aside in the stash.
      # 7. Look at the status: clean again.
      # 8. List the stash entries.

      echo "Typo fixed" > hotfix.txt
      git add hotfix.txt
      git commit -m "Add hotfix note"

      # 9. Bring your unfinished edit back (and remove it from the stash).
      # 10. Look at the status: recipes.txt is modified again.
      # 11. List the stash entries: it is empty now.

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
    $ echo "secret=1234" > .env
    $ echo "debug line" > debug.log
    $ echo "module code" > node_modules/pkg.js
    $ git status
    On branch main

    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    	.env
    	debug.log
    	node_modules/pkg.js

    nothing added to commit but untracked files present (use "git add" to track)
    $ echo "*.log" > .gitignore
    $ echo "node_modules/" >> .gitignore
    $ echo ".env" >> .gitignore
    $ git status
    On branch main

    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    	.gitignore

    nothing added to commit but untracked files present (use "git add" to track)
    $ git add .gitignore
    $ git commit -m "Add .gitignore"
    [main 6f5eabd] Add .gitignore
     1 file changed, 3 insertions(+)
     create mode 100644 .gitignore
    $ git status
    On branch main

    nothing to commit, working tree clean
    $ echo "Omelette: eggs, salt" >> recipes.txt
    $ git stash
    Saved working directory and index state WIP on main: 6f5eabd Add .gitignore
    $ git status
    On branch main

    nothing to commit, working tree clean
    $ git stash list
    stash@{0}: WIP on main: 6f5eabd Add .gitignore
    $ echo "Typo fixed" > hotfix.txt
    $ git add hotfix.txt
    $ git commit -m "Add hotfix note"
    [main fc06bc4] Add hotfix note
     1 file changed, 1 insertion(+)
     create mode 100644 hotfix.txt
    $ git stash pop
    On branch main

    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git restore <file>..." to discard changes in working directory)
    	modified:   recipes.txt

    no changes added to commit (use "git add" and/or "git commit -a")
    Dropped refs/stash@{0} (ec5cccbe0d6f482644b6eaafb42a16dbcca12d84)
    $ git status
    On branch main

    Changes not staged for commit:
      (use "git add <file>..." to update what will be committed)
      (use "git restore <file>..." to discard changes in working directory)
    	modified:   recipes.txt

    no changes added to commit (use "git add" and/or "git commit -a")
    $ git stash list
  code:
    - { pattern: 'git\s+stash\s+list[\s\S]*git\s+stash\s+pop[\s\S]*git\s+stash\s+list', message: "List the stash, pop it, then list it again." }
    - { pattern: 'git\s+commit\s+-m\s+"Add \.gitignore"', message: 'Commit .gitignore with the message "Add .gitignore".' }
hints:
  - "A .gitignore file is just a text file whose lines are patterns of files Git should pretend not to see. The stash is a shelf where Git keeps your uncommitted edits until you want them back."
  - 'Write the three lines with echo: the first with a single > (creates the file), the other two with >> (append). Then git status, git add .gitignore, git commit. For part B: git stash, git status, git stash list, then later git stash pop, git status, git stash list.'
  - 'echo "*.log" > .gitignore / echo "node_modules/" >> .gitignore / echo ".env" >> .gitignore / git status / git add .gitignore / git commit -m "Add .gitignore" / git status / git stash / git status / git stash list / git stash pop / git status / git stash list'
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

      echo "secret=1234" > .env
      echo "debug line" > debug.log
      echo "module code" > node_modules/pkg.js
      git status

      echo "*.log" > .gitignore
      echo "node_modules/" >> .gitignore
      echo ".env" >> .gitignore
      git status
      git add .gitignore
      git commit -m "Add .gitignore"
      git status

      echo "Omelette: eggs, salt" >> recipes.txt
      git stash
      git status
      git stash list

      echo "Typo fixed" > hotfix.txt
      git add hotfix.txt
      git commit -m "Add hotfix note"

      git stash pop
      git status
      git stash list
quiz:
  - q: "What does the pattern *.log in a .gitignore file do?"
    options: ["Deletes all log files", "Makes Git ignore every file whose name ends in .log", "Makes Git track only log files"]
    answer: 1
  - q: "You committed a file by mistake and then added it to .gitignore. Does Git forget it?"
    options: ["Yes, immediately", "Only after a restart", "No. A file that is already tracked stays tracked until you run git rm --cached <file> and commit"]
    answer: 2
  - q: "When is git stash useful?"
    options: ["When you must switch tasks but your current edits are not ready to commit", "When you want to delete a branch", "When you want to publish to GitHub"]
    answer: 0
  - q: "How do you bring stashed changes back and remove them from the stash?"
    options: ["git stash list", "git stash pop", "git stash push"]
    answer: 1
---

Two small tools that make everyday work much calmer: `.gitignore` keeps unwanted files out of your repository, and `git stash` lets you put half-finished work on a shelf for a while.

## Part A: .gitignore

Some files must not be saved in the history:

- **Secrets**: passwords, API keys, `.env` files. Once pushed to GitHub, a secret should be considered stolen.
- **Dependencies**: folders like `node_modules/` that can be rebuilt and are huge.
- **Generated or personal files**: logs (`*.log`), build output, editor settings, `.DS_Store`.

Without help, `git status` lists them all as untracked and you could add them by accident with `git add .`. The cure is a plain text file called **`.gitignore`** in the project root. Every line is a pattern:

```
*.log
node_modules/
.env
```

- `*.log` is a **wildcard**: the `*` stands for any text, so it matches `debug.log`, `build.log` and so on.
- `node_modules/` with a slash at the end means a whole folder.
- `.env` matches that exact file name.
- Lines starting with `#` are comments, and blank lines are ignored.

Create it like any file. We build it line by line with `echo`: the first line with `>` (create), the next ones with `>>` (append):

```bash
echo "*.log" > .gitignore
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
```

Now `git status` shows only `.gitignore` as untracked. The ignored files are invisible to Git, and `git add .` skips them. The `.gitignore` file itself **should be committed**, so that the whole team ignores the same things. For popular languages, ready-made lists exist (GitHub even offers them when you create a repository).

One important catch: `.gitignore` only affects files that Git is **not tracking yet**. If you already committed `.env`, ignoring it later does not remove it. You must run `git rm --cached .env` (it stops tracking but keeps your file) and commit. And remember that the secret is still in the old history.

## Part B: git stash

You are halfway through a change when your boss asks for an urgent fix. Your edit is not ready to be committed, but you cannot switch tasks with a messy folder either. Use the stash:

```bash
git stash
```

```
Saved working directory and index state WIP on main: 627aad0 Add .gitignore
```

Git stores your uncommitted changes on a shelf and restores your files to the last commit. The folder is clean, so you can fix the bug, switch branches and commit. Later:

```bash
git stash list      # stash@{0}: WIP on main: 627aad0 Add .gitignore
git stash pop       # put the changes back and remove them from the shelf
```

`git stash apply` also brings the changes back, but keeps them on the shelf. You can stash several times; the entries are numbered `stash@{0}` (newest), `stash@{1}` and so on. Stash only handles changes to tracked files by default; add `-u` to include untracked files too (real Git).

> **Watch out:**
> - Do not put `.gitignore` patterns with a leading space or Windows backslashes; use forward slashes (`logs/`).
> - If a file does not get ignored, it is probably already tracked. Check with `git ls-files` (real Git) and use `git rm --cached`.
> - `git stash pop` can cause a conflict if the same lines changed meanwhile. Resolve it like a merge conflict. The stash entry then stays so you do not lose it.
> - A stash is easy to forget. Look at `git stash list` now and then, and do not use it as a long-term storage: use a branch for that.

> **Your turn:** follow the numbered comments. Build `.gitignore` with the three lines `*.log`, `node_modules/` and `.env`, check the status, stage and commit it with the message `Add .gitignore`, check the status again. In part B put the edit aside with `git stash`, check the status, list the stash, and (after the hotfix commit in the starter) bring the edit back with `git stash pop`, check the status and list the stash again.
