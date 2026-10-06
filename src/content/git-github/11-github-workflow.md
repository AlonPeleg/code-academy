---
title: The GitHub workflow
summary: Work like a professional team with feature branches, pull requests, forks and clear commit messages, and learn how to publish a site with GitHub Pages.
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

      # 1. Add a remote called origin with the address https://github.com/ada/recipe-book.git
      # 2. Publish main and set its upstream.
      # 3. Create and switch to a feature branch called feature/add-soup
      echo "Soup: water, salt" >> recipes.txt
      # 4. Commit the change (stage tracked files and commit in one step). Message: Add soup recipe
      # 5. Publish the feature branch and set its upstream, so GitHub can offer a pull request.
      # 6. Look at the status.
      # 7. List all branches, local and remote.

      # (On GitHub you would now open a pull request, ask for a review and press "Merge pull request".)
      # The next steps do the same thing from the terminal.
      # 8. Go back to main.
      # 9. Merge feature/add-soup into main.
      # 10. Publish main (no extra words needed).
      # 11. The feature is done: delete the local branch (safe delete).
      # 12. List all branches again.
      # 13. Show the short history.

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
    $ git push -u origin main
    To https://github.com/ada/recipe-book.git
     * [new branch]      main -> main
    branch 'main' set up to track 'origin/main'.
    $ git switch -c feature/add-soup
    Switched to a new branch 'feature/add-soup'
    $ echo "Soup: water, salt" >> recipes.txt
    $ git commit -am "Add soup recipe"
    [feature/add-soup 22e83bc] Add soup recipe
     1 file changed, 1 insertion(+)
    $ git push -u origin feature/add-soup
    To https://github.com/ada/recipe-book.git
     * [new branch]      feature/add-soup -> feature/add-soup
    branch 'feature/add-soup' set up to track 'origin/feature/add-soup'.
    $ git status
    On branch feature/add-soup
    Your branch is up to date with 'origin/feature/add-soup'.

    nothing to commit, working tree clean
    $ git branch -a
    * feature/add-soup
      main
      remotes/origin/feature/add-soup
      remotes/origin/main
    $ git switch main
    Switched to branch 'main'
    Your branch is up to date with 'origin/main'.
    $ git merge feature/add-soup
    Updating 069d2b7..22e83bc
    Fast-forward
     recipes.txt | 1 +
     1 file changed, 1 insertion(+)
    $ git push
    To https://github.com/ada/recipe-book.git
       069d2b7..22e83bc  main -> main
    $ git branch -d feature/add-soup
    Deleted branch feature/add-soup (was 22e83bc).
    $ git branch -a
    * main
      remotes/origin/feature/add-soup
      remotes/origin/main
    $ git log --oneline
    22e83bc (HEAD -> main, origin/feature/add-soup, origin/main) Add soup recipe
    069d2b7 Start recipe book
  code:
    - { pattern: 'git\s+push\s+-u\s+origin\s+main', message: "Publish main with git push -u origin main." }
    - { pattern: 'git\s+switch\s+-c\s+feature/add-soup', message: "Create the feature branch with git switch -c feature/add-soup." }
    - { pattern: 'git\s+push\s+-u\s+origin\s+feature/add-soup', message: "Publish the feature branch with git push -u origin feature/add-soup." }
    - { pattern: 'git\s+branch\s+-d\s+feature/add-soup', message: "Delete the merged branch with git branch -d feature/add-soup." }
hints:
  - "The professional loop is: branch, commit, push the branch, open a pull request, merge, clean up. Publishing a NEW branch needs -u so that Git remembers where it goes."
  - "git remote add origin <url> / git push -u origin main / git switch -c feature/add-soup / git commit -am ... / git push -u origin feature/add-soup / git status / git branch -a / git switch main / git merge feature/add-soup / git push / git branch -d feature/add-soup / git branch -a / git log --oneline"
  - 'git remote add origin https://github.com/ada/recipe-book.git / git push -u origin main / git switch -c feature/add-soup / git commit -am "Add soup recipe" / git push -u origin feature/add-soup'
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
      git push -u origin main
      git switch -c feature/add-soup
      echo "Soup: water, salt" >> recipes.txt
      git commit -am "Add soup recipe"
      git push -u origin feature/add-soup
      git status
      git branch -a

      git switch main
      git merge feature/add-soup
      git push
      git branch -d feature/add-soup
      git branch -a
      git log --oneline
quiz:
  - q: "What is a pull request?"
    options: ["A request to download a repository", "A proposal on GitHub to merge one branch into another, where teammates can review and discuss the changes", "A command that pulls files"]
    answer: 1
  - q: "What is a fork?"
    options: ["Your own copy of someone else's repository on GitHub, where you may make changes", "A broken branch", "A merge conflict"]
    answer: 0
  - q: "Which commit message follows good practice?"
    options: ["Fix bug in login when the password is empty", "stuff", "changed some things in several files"]
    answer: 0
    explain: "Short, imperative and specific: it says what the commit does."
  - q: "Why do teams work on feature branches instead of committing directly to main?"
    options: ["Git requires it", "main stays stable, and changes can be reviewed before they are merged", "It makes commits smaller in size"]
    answer: 1
---

You now know the Git commands. This lesson shows how real teams and open-source projects put them together with **GitHub**. The goal: change a project without breaking it, and let others check your work before it is merged.

## The feature-branch workflow

Almost every team follows the same loop:

1. **Branch**: create a branch for one task, e.g. `feature/add-soup` or `fix/login-bug`. Slashes in names are fine and help keep things tidy.
2. **Commit**: make small, focused commits on that branch.
3. **Push**: publish the branch with `git push -u origin feature/add-soup`. The `-u` is needed only the first time for a new branch.
4. **Pull request**: on the GitHub website you open a **pull request** (a "PR"). It says: "please merge my branch into `main`". GitHub shows the diff, and teammates can comment on single lines, approve, or ask for changes. Automatic checks (tests) usually run here too.
5. **Merge**: when the PR is approved, someone presses **Merge pull request**. GitHub performs the merge you learned in lesson 7 on the server.
6. **Clean up**: delete the branch, switch to `main` and `git pull` to get the merged result.

Pull requests are a feature of the website, not of Git itself, so the practice terminal cannot show them. In this lesson we do the merge by hand to practise the commands around it. If you push more commits to the same branch while the PR is open, the PR updates automatically.

## Forks: contributing to a project that is not yours

You cannot push to somebody else's repository. For open-source projects you instead:

1. **Fork** it (a button on GitHub): you get your own copy under your account.
2. **Clone** your fork to your computer, create a branch, commit and push to your fork.
3. Open a **pull request** from your fork to the original project. The maintainers review it and may merge it.

Inside a team that shares one repository, you usually skip the fork and just push branches.

## Good commit messages

Your commit messages are read by teammates and by your future self. A good habit:

- A short first line (about 50 characters) in the **imperative**: `Add soup recipe`, `Fix crash when the list is empty`.
- Say **what** and, if it is not obvious, **why**. Details go on extra lines after a blank line (use an editor, not `-m`).
- One idea per commit. If you need the word "and" a lot, split it.
- Avoid `fix`, `update`, `wip`, `asdf`.

The same goes for pull request titles.

## GitHub Pages: publish a website

A repository with an `index.html` can become a live website for free. In the repository on GitHub open **Settings, Pages**, choose the branch (usually `main`) and the root folder, and save. After a minute your site appears at `https://<your-name>.github.io/<repository>/`. Every time you push to that branch, the site updates. This is a perfect home for a portfolio.

## Other useful habits

- Keep a good `README.md` (what the project is, how to run it).
- Use **Issues** on GitHub to track bugs and ideas. Writing `Fixes #12` in a PR description closes issue 12 when the PR merges.
- `git pull` before you start working so you begin from the newest version.
- Commit often, push at least at the end of the day: it is also your backup.

> **Watch out:**
> - Never commit passwords, tokens or `.env` files. If you pushed a secret, change it immediately: deleting the commit later does not make it safe.
> - Do not push work in progress straight to `main` on a shared project. Use a branch and a PR.
> - On a real computer the first push asks for authentication (token, `gh auth login` or SSH key). The practice terminal skips this.
> - If you see `! [rejected] ... (fetch first)`, pull the newest changes first, then push again.

> **Your turn:** follow the thirteen numbered comments. Add the remote `origin` (`https://github.com/ada/recipe-book.git`) and publish `main` with `git push -u origin main`. Create the branch `feature/add-soup` with `git switch -c`, commit the soup line with the message `Add soup recipe`, publish the branch with `git push -u origin feature/add-soup`, then check `git status` and `git branch -a`. Finally go back to `main`, merge the feature branch, push, delete the local branch with `git branch -d feature/add-soup`, and finish with `git branch -a` and `git log --oneline`.
