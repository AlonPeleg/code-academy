---
title: Resolving merge conflicts
summary: Learn why conflicts happen, how to read the conflict markers, and how to resolve them step by step.
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

      # 1. Create and switch to a branch called vegan.
      sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, oat milk, banana/' recipes.txt
      # 2. Commit the change on this branch. Message: Make pancakes vegan
      # 3. Go back to main.
      sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, milk, eggs, butter/' recipes.txt
      git commit -am "Add butter to pancakes"

      # Both branches changed the SAME line. Now bring vegan into main.
      # 4. Merge the vegan branch (Git will stop with a conflict).
      # 5. Look at the status: recipes.txt is listed as "both modified".
      # 6. Print recipes.txt to see the conflict markers.
      # 7. Resolve it: overwrite recipes.txt so it contains exactly one line:
      #    Pancakes: flour, oat milk, banana, butter
      # 8. Mark the file as resolved by staging it.
      # 9. Look at the status again.
      # 10. Finish the merge with a commit. Message: Merge vegan pancakes
      # 11. Draw the short history as a graph.
      # 12. Print recipes.txt one last time.

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
    $ git switch -c vegan
    Switched to a new branch 'vegan'
    $ sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, oat milk, banana/' recipes.txt
    $ git commit -am "Make pancakes vegan"
    [vegan 825c27a] Make pancakes vegan
     1 file changed, 1 insertion(+), 1 deletion(-)
    $ git switch main
    Switched to branch 'main'
    $ sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, milk, eggs, butter/' recipes.txt
    $ git commit -am "Add butter to pancakes"
    [main fccbf6c] Add butter to pancakes
     1 file changed, 1 insertion(+), 1 deletion(-)
    $ git merge vegan
    Auto-merging recipes.txt
    CONFLICT (content): Merge conflict in recipes.txt
    Automatic merge failed; fix conflicts and then commit the result.
    $ git status
    On branch main
    You have unmerged paths.
      (fix conflicts and run "git commit")
      (use "git merge --abort" to abort the merge)

    Unmerged paths:
      (use "git add <file>..." to mark resolution)
    	both modified:   recipes.txt

    no changes added to commit (use "git add" and/or "git commit -a")
    $ cat recipes.txt
    <<<<<<< main
    Pancakes: flour, milk, eggs, butter
    =======
    Pancakes: flour, oat milk, banana
    >>>>>>> vegan
    $ echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt
    $ git add recipes.txt
    $ git status
    On branch main
    All conflicts fixed but you are still merging.
      (use "git commit" to conclude merge)

    Changes to be committed:
      (use "git restore --staged <file>..." to unstage)
    	modified:   recipes.txt
    $ git commit -m "Merge vegan pancakes"
    [main 32b75b4] Merge vegan pancakes
    $ git log --oneline --graph
    *   32b75b4 (HEAD -> main) Merge vegan pancakes
    |\
    * | fccbf6c Add butter to pancakes
    | * 825c27a (vegan) Make pancakes vegan
    |/
    * 069d2b7 Start recipe book
    $ cat recipes.txt
    Pancakes: flour, oat milk, banana, butter
  code:
    - { pattern: 'git\s+merge\s+vegan', message: "Merge the vegan branch with git merge vegan." }
    - { pattern: 'echo\s+"Pancakes: flour, oat milk, banana, butter"\s*>\s*recipes\.txt', message: "Overwrite recipes.txt with a single > (not >>) and the combined line." }
    - { pattern: 'git\s+add\s+recipes\.txt', message: "Stage the resolved file with git add recipes.txt." }
    - { pattern: 'git\s+commit\s+-m\s+"Merge vegan pancakes"', message: 'Finish with git commit -m "Merge vegan pancakes".' }
hints:
  - "A conflict is Git saying: both sides changed the same lines and I do not know which to keep. You decide, edit the file, stage it and commit. Resolving always ends with git add and git commit."
  - "git switch -c vegan, commit, git switch main, git merge vegan, git status, cat recipes.txt, then echo the combined line with a single > to replace the file, git add recipes.txt, git status, git commit -m, git log --oneline --graph, cat recipes.txt."
  - 'echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt / git add recipes.txt / git commit -m "Merge vegan pancakes". The first part is: git switch -c vegan / git commit -am "Make pancakes vegan" / git switch main.'
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

      git switch -c vegan
      sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, oat milk, banana/' recipes.txt
      git commit -am "Make pancakes vegan"
      git switch main
      sed -i 's/Pancakes: flour, milk, eggs/Pancakes: flour, milk, eggs, butter/' recipes.txt
      git commit -am "Add butter to pancakes"

      git merge vegan
      git status
      cat recipes.txt
      echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt
      git add recipes.txt
      git status
      git commit -m "Merge vegan pancakes"
      git log --oneline --graph
      cat recipes.txt
quiz:
  - q: "When does a merge conflict happen?"
    options: ["Whenever two branches exist", "When both branches changed the same lines of a file in different ways", "When you forget to commit"]
    answer: 1
  - q: "What do the lines between <<<<<<< and ======= show?"
    options: ["Your version, from the branch you are on", "The version of the other branch", "The common ancestor"]
    answer: 0
    explain: "Above ======= is the current branch (HEAD), below it is the incoming branch."
  - q: "After you edited the conflicted file and removed the markers, what must you do?"
    options: ["Nothing, Git notices automatically", "git add the file, then git commit to finish the merge", "Delete the branch"]
    answer: 1
  - q: "You started a merge and panic. Which command takes you back to before the merge?"
    options: ["git merge --abort", "git init", "git branch -d"]
    answer: 0
---

Most merges go smoothly, but sometimes Git has to ask for your help. A **merge conflict** is not an error, it is a question. In this lesson you will cause a conflict on purpose and solve it, so that the real thing never scares you.

## Why conflicts happen

Git merges by comparing changes line by line. If you changed line 1 in one branch and someone else changed line 5 in the other, Git combines both. But if both branches changed **the same line** (or one deleted what the other edited), Git cannot know which version is right. It stops and leaves the decision to you.

In our story, `main` added butter to the pancake line, while the `vegan` branch replaced milk and eggs on the very same line.

## Step 1: the merge stops

```bash
git merge vegan
```

```
Auto-merging recipes.txt
CONFLICT (content): Merge conflict in recipes.txt
Automatic merge failed; fix conflicts and then commit the result.
```

Do not panic. Git has paused in the middle of the merge. `git status` tells you where you are:

```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   recipes.txt
```

## Step 2: read the conflict markers

Git wrote both versions into the file, separated by markers:

```
<<<<<<< main
Pancakes: flour, milk, eggs, butter
=======
Pancakes: flour, oat milk, banana
>>>>>>> vegan
```

- Between `<<<<<<<` and `=======` is **your side** (the branch you are on, here `main`).
- Between `=======` and `>>>>>>>` is **their side** (the branch you are merging, here `vegan`).

## Step 3: decide and edit

Open the file and make it look the way it should be: keep one side, the other, or a mix. **Delete the three marker lines** completely. In a real project you use an editor (VS Code highlights conflicts and offers buttons such as "Accept Current Change"). In the practice terminal we simply overwrite the file with the final text:

```bash
echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt
```

A single `>` replaces the whole file, which is exactly what we want here.

## Step 4: stage and commit

Staging tells Git "this file is resolved":

```bash
git add recipes.txt
git status      # now says: All conflicts fixed but you are still merging.
git commit -m "Merge vegan pancakes"
```

That commit has two parents and finishes the merge. In a real terminal, `git commit` without `-m` opens an editor with a ready-made merge message. Just save and close.

```
*   32b75b4 (HEAD -> main) Merge vegan pancakes
|\
* | fccbf6c Add butter to pancakes
| * 825c27a (vegan) Make pancakes vegan
|/
* 069d2b7 Start recipe book
```

## Staying calm

- You can leave the conflict and go back to the state before the merge at any time with `git merge --abort`.
- Several files can conflict. Resolve and `git add` them one at a time. `git status` lists what is left.
- Talk to the teammate whose change conflicts with yours if you do not understand it.
- Small, frequent merges and short-lived branches produce fewer conflicts.

> **Watch out:**
> - Committing a file that still contains `<<<<<<<` markers is a classic mistake. Search the file for `<<<<<<<` before you `git add`. Your program will probably not even run with them in.
> - `error: Committing is not possible because you have unmerged files`: you forgot `git add` on a conflicted file.
> - Do not use `git commit -a` blindly during a merge without checking the files first.
> - Using `>>` instead of `>` in the practice terminal would append and keep the markers. Use a single `>`.

> **Your turn:** follow the twelve numbered comments. Create the `vegan` branch and commit with the message `Make pancakes vegan`, return to `main`, merge `vegan`, look at the status and the file, then resolve the conflict by overwriting `recipes.txt` with the single line `Pancakes: flour, oat milk, banana, butter`. Stage it, check the status, commit with the message `Merge vegan pancakes`, draw the graph with `git log --oneline --graph` and print the file again.
