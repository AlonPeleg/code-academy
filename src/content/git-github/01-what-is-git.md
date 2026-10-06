---
title: What is Git? init and status
summary: Understand what version control is, create your first repository and ask Git how it is doing.
level: beginner
runner: git
files:
  - name: session.sh
    code: |
      # Welcome to the Git practice terminal!
      # Each line that does not start with "#" is one command. Press Run to see what happens.
      # Every command you run is shown after a "$", followed by its output.
      #
      # 1. Print the current folder.
      # 2. Ask Git how the project is doing. It will complain: this folder is not a repository yet.
      # 3. Turn the folder into a Git repository.
      # 4. Create a file called README.md that contains the text: # My first project
      # 5. Ask Git how the project is doing again.
      # 6. List the files in the folder.

check:
  output: |
    $ pwd
    /home/learner/project
    $ git status
    fatal: not a git repository (or any of the parent directories): .git
    $ git init
    Initialized empty Git repository in /home/learner/project/.git/
    $ echo "# My first project" > README.md
    $ git status
    On branch main

    No commits yet

    Untracked files:
      (use "git add <file>..." to include in what will be committed)
    	README.md

    nothing added to commit but untracked files present (use "git add" to track)
    $ ls
    README.md
  code:
    - { pattern: 'git\s+init', message: "Turn the folder into a repository with the init command." }
    - { pattern: 'git\s+status[\s\S]*git\s+status', message: "Ask for the status twice: before and after creating the repository." }
hints:
  - "You need a command that prints the folder you are in, one that asks Git for a status report, and one that creates a repository. Remember the status command is used twice."
  - "The commands are: pwd, git status, git init, echo ... > README.md and ls. The echo command writes text into a file when you add > and the file name."
  - 'Write these six lines in this order: pwd / git status / git init / echo "# My first project" > README.md / git status / ls'
solution:
  - name: session.sh
    code: |
      pwd
      git status
      git init
      echo "# My first project" > README.md
      git status
      ls
quiz:
  - q: "What is the main job of Git?"
    options: ["Remember every saved version of your project so you can go back", "Make your code run faster", "Host your website on the internet"]
    answer: 0
    explain: "Git is a version control system: a time machine for your files."
  - q: "What is the difference between Git and GitHub?"
    options: ["They are two names for the same thing", "Git is the tool on your computer, GitHub is a website that stores Git projects online", "GitHub is the tool on your computer, Git is a website"]
    answer: 1
  - q: "Which command turns an ordinary folder into a Git repository?"
    options: ["git start", "git create", "git init"]
    answer: 2
    explain: "init is short for initialize. It creates a hidden .git folder where the history lives."
  - q: "What does git status show you?"
    options: ["Only the files that you deleted", "Which files are new, changed or ready to be saved, and which branch you are on", "The speed of your internet connection"]
    answer: 1
---

Imagine writing an essay and saving copies called `essay-final.doc`, `essay-final-2.doc` and `essay-REALLY-final.doc`. **Git** does that job properly: it remembers every important version of your project, who changed what, and why, and it lets you travel back in time. Every professional programmer uses it, so it is a great first tool to learn.

## Git is not GitHub

People mix these up, so let us separate them right away:

- **Git** is a free program that runs on your own computer and keeps the history of a project.
- **GitHub** is a website where you can upload Git projects to share them, back them up and work together. There are similar sites (GitLab, Bitbucket), and they all use Git underneath.

You will meet GitHub in the last lessons. First we learn Git itself.

## Where are we?

This lesson uses a practice terminal. It is a pretend computer, so nothing you type can break anything. You write a **script**: one command per line. Lines starting with `#` are comments and are skipped. Press **Run** and the terminal prints every command after a `$`, followed by its answer.

Two helper commands from the normal shell:

- `pwd` prints the folder you are in (it stands for "print working directory").
- `ls` lists the files in that folder.

## Creating a repository

A **repository** (or "repo") is a project folder that Git is watching. You create one with:

```bash
git init
```

That prints `Initialized empty Git repository in /home/learner/project/.git/`. Git made a hidden folder called `.git`. This is where all the history is stored. Never edit it by hand, and if you delete it the project loses its history (the files stay).

If you run a Git command in a folder that is not a repository, Git tells you so:

```
fatal: not a git repository (or any of the parent directories): .git
```

This is the most common first error. It simply means "run `git init` first, or `cd` into the right folder".

## Asking for the status

`git status` is the command you will use most. It answers three questions: which branch am I on, what has changed, and what is Git ignoring or waiting for?

```bash
git status
```

In a brand new repository it says `On branch main` (a branch is a line of history, more in lesson 6) and `No commits yet` (nothing has been saved).

## Creating a file

To have something to track, the terminal lets you create files with `echo`:

```bash
echo "# My first project" > README.md
```

`echo` prints text, and `>` redirects that text into a file instead of the screen (it creates the file, or replaces it if it exists). In a real project you would use an editor. When you run `git status` again, the new file appears under **Untracked files**: Git sees it, but it is not watching it yet. We will fix that in the next lesson.

> **Watch out:**
> - `fatal: not a git repository` means you are not inside a repository. Run `git init` first.
> - Running `git init` twice is harmless. Git answers `Reinitialized existing Git repository`.
> - On a real computer you must install Git once and tell it who you are (`git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`). The practice terminal does this for you.
> - Git commands always start with the word `git`. Typing only `status` gives `command not found`.

## Going further

Run `git init` a second time and read the message. Then create a second file with `echo "hello" > hello.txt` and check that `git status` lists both files.

> **Your turn:** write these six steps in `session.sh`: print the folder (`pwd`), run `git status` (it will fail), run `git init`, create `README.md` containing `# My first project`, run `git status` again, and finish with `ls`. Then press **Check answer**.
