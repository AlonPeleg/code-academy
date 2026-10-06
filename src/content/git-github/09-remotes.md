---
title: "Remotes: push, fetch and pull"
summary: Connect your repository to a server, publish your commits and download the work of teammates.
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

      # 1. Connect to the server: add a remote called origin with the address https://github.com/ada/recipe-book.git
      # 2. List your remotes together with their addresses.
      # 3. Publish the main branch, and remember it as the default (upstream) so a plain push works later.
      # 4. Look at the status: your branch is up to date with origin/main.

      # Now your teammate Bob pushes a change to the server (this is a pretend command of the practice terminal).
      teammate team.txt "Bob: add a dessert section"

      # 5. Check the server for news WITHOUT changing your files.
      # 6. Look at the status: your branch is now behind origin/main.
      # 7. Download the news and merge it into your branch in one step.
      # 8. Print team.txt to see Bob's line.

      echo "Cake: flour, sugar, eggs" >> recipes.txt
      git commit -am "Add cake recipe"
      # 9. Publish your new commit (the upstream is set, so no extra words are needed).
      # 10. Look at the status one more time.

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
    $ git remote add origin https://github.com/ada/recipe-book.git
    $ git remote -v
    origin	https://github.com/ada/recipe-book.git (fetch)
    origin	https://github.com/ada/recipe-book.git (push)
    $ git push -u origin main
    To https://github.com/ada/recipe-book.git
     * [new branch]      main -> main
    branch 'main' set up to track 'origin/main'.
    $ git status
    On branch main
    Your branch is up to date with 'origin/main'.

    nothing to commit, working tree clean
    $ teammate team.txt "Bob: add a dessert section"
    $ git fetch
    From https://github.com/ada/recipe-book.git
       069d2b7..50c0fab  main       -> origin/main
    $ git status
    On branch main
    Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
      (use "git pull" to update your local branch)

    nothing to commit, working tree clean
    $ git pull
    Updating 069d2b7..50c0fab
    Fast-forward
     team.txt | 1 +
     1 file changed, 1 insertion(+)
     create mode 100644 team.txt
    $ cat team.txt
    Bob: add a dessert section
    $ echo "Cake: flour, sugar, eggs" >> recipes.txt
    $ git commit -am "Add cake recipe"
    [main 5e77998] Add cake recipe
     1 file changed, 1 insertion(+)
    $ git push
    To https://github.com/ada/recipe-book.git
       50c0fab..5e77998  main -> main
    $ git status
    On branch main
    Your branch is up to date with 'origin/main'.

    nothing to commit, working tree clean
  code:
    - { pattern: 'git\s+remote\s+add\s+origin\s+https://github\.com/ada/recipe-book\.git', message: "Add the remote with git remote add origin <url>." }
    - { pattern: 'git\s+push\s+-u\s+origin\s+main', message: "Publish with git push -u origin main." }
    - { pattern: 'git\s+fetch', message: "Use git fetch to look for news without merging." }
    - { pattern: 'git\s+pull', message: "Use git pull to download and merge." }
hints:
  - "A remote is a nickname for the address of another copy of your repository. origin is the usual nickname. You send commits with push and receive them with fetch (look) or pull (fetch plus merge)."
  - "git remote add origin <url> / git remote -v / git push -u origin main / git status / (teammate line) / git fetch / git status / git pull / cat team.txt / (commit) / git push / git status."
  - "git remote add origin https://github.com/ada/recipe-book.git / git remote -v / git push -u origin main / git status / git fetch / git status / git pull / cat team.txt / git push / git status"
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

      git remote add origin https://github.com/ada/recipe-book.git
      git remote -v
      git push -u origin main
      git status

      teammate team.txt "Bob: add a dessert section"

      git fetch
      git status
      git pull
      cat team.txt

      echo "Cake: flour, sugar, eggs" >> recipes.txt
      git commit -am "Add cake recipe"
      git push
      git status
quiz:
  - q: "What is origin?"
    options: ["The first commit of the project", "The usual nickname for the remote you cloned from or pushed to", "A special branch"]
    answer: 1
  - q: "What is the difference between git fetch and git pull?"
    options: ["fetch only downloads the news, pull downloads and also merges it into your branch", "They are the same", "pull only downloads, fetch also merges"]
    answer: 0
  - q: "Your push is rejected with 'fetch first'. What does that mean and what should you do?"
    options: ["You must delete the remote", "Your password is wrong", "Someone pushed commits you do not have yet. Pull them (resolve conflicts if any), then push again"]
    answer: 2
  - q: "What does the -u in git push -u origin main do?"
    options: ["Uploads untracked files too", "Remembers origin/main as the upstream of main, so later git push and git pull need no arguments", "Updates Git itself"]
    answer: 1
---

So far everything lived on your own computer. To **back up** your work, **share** it, and **collaborate**, you connect your repository to a **remote**: another copy of the repository on a server, for example on GitHub.

## What is a remote?

A remote is a nickname for an address. By convention the main one is called **origin**. You add it once:

```bash
git remote add origin https://github.com/ada/recipe-book.git
git remote -v        # shows the addresses (fetch and push)
```

Nothing is sent yet. Git just remembers the address. (On GitHub you first create an empty repository on the website; the page shows you this address.)

When you want to start from an existing project you use `git clone <address>`, which downloads the whole repository, history included, and sets up `origin` for you. The practice terminal cannot download anything, so here we start with `git init` and `git remote add` instead; on a real computer `clone` is the usual first command on a new project.

## git push: send your commits

```bash
git push -u origin main
```

reads as: "send my branch `main` to the remote `origin`". The `-u` (or `--set-upstream`) also remembers that your local `main` goes together with `origin/main`. Afterwards a plain `git push` and `git pull` are enough. Git prints something like:

```
To https://github.com/ada/recipe-book.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**GitHub login.** On a real computer, the first push asks you to prove who you are. GitHub no longer accepts your account password on the command line. You use either a **personal access token** (a long password-like string you create in your GitHub settings), a login helper such as Git Credential Manager or the GitHub CLI (`gh auth login`), or an **SSH key** (then the address looks like `git@github.com:ada/recipe-book.git`). The practice terminal skips all of this.

## Remote-tracking branches

After pushing, you have a branch called `origin/main`. It is your computer's **memory** of where `main` was on the server the last time you talked to it. You cannot commit to it directly, it only moves when you push, fetch or pull. `git status` compares your branch to it:

```
Your branch is up to date with 'origin/main'.
```

## git fetch and git pull: get the news

When a teammate pushes, the server moves but your computer does not know yet.

```bash
git fetch
```

downloads the new commits and updates `origin/main`, but does **not touch your own branch or files**. It is safe, so you can look first with `git status` or `git log origin/main`:

```
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
```

```bash
git pull
```

is `git fetch` followed by a merge of `origin/main` into your current branch. In real life you often just use `pull`.

## When your push is rejected

If a teammate pushed first and you push without their commits, the server refuses:

```
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/ada/recipe-book.git'
```

The fix is always the same: `git pull` (resolve conflicts as in lesson 8 if needed), then `git push` again. Never "force" a push to get past this, unless you really know why (`--force` can erase the teammate's work).

> **Watch out:**
> - `fatal: 'origin' does not appear to be a git repository`: you did not add the remote, or you mistyped its name. Check with `git remote -v`.
> - `fatal: The current branch has no upstream branch`: use `git push -u origin <branch>` the first time.
> - `remote: Permission denied` or `Authentication failed` on a real computer: your token or SSH key is missing or wrong.
> - Real Git may say `hint: You have divergent branches` when a pull needs a merge, and ask you to choose a strategy (`git config pull.rebase false` keeps it as a merge).

> **Your turn:** follow the numbered comments. Add the remote `origin` with the address `https://github.com/ada/recipe-book.git`, list it with `git remote -v`, publish with `git push -u origin main` and check the status. After the pretend teammate commit, run `git fetch`, `git status`, `git pull` and `cat team.txt`. The starter commits a cake recipe for you: publish it with `git push` and finish with `git status`.
