---
title: "Remotes: push, fetch ו-pull"
summary: "מחברים את המאגר לשרת, מפרסמים את ה-commits ומורידים את העבודה של חברי הצוות."
hints:
  - "remote הוא כינוי לכתובת של עותק אחר של המאגר שלכם. origin הוא הכינוי הרגיל. שולחים commits עם push ומקבלים אותם עם fetch (להסתכל) או pull (fetch ועוד מיזוג)."
  - "git remote add origin <url> / git remote -v / git push -u origin main / git status / (שורת חבר הצוות) / git fetch / git status / git pull / cat team.txt / (commit) / git push / git status."
  - "git remote add origin https://github.com/ada/recipe-book.git / git remote -v / git push -u origin main / git status / git fetch / git status / git pull / cat team.txt / git push / git status"
messages:
  - "הוסיפו את ה-remote עם git remote add origin <url>."
  - "פרסמו עם git push -u origin main."
  - "השתמשו ב-git fetch כדי לחפש חדשות בלי למזג."
  - "השתמשו ב-git pull כדי להוריד ולמזג."
quiz:
  - q: "מהו origin?"
    options: ["ה-commit הראשון של הפרויקט", "הכינוי הרגיל של ה-remote שממנו עשיתם clone או שאליו עשיתם push", "ענף מיוחד"]
  - q: "מה ההבדל בין git fetch לבין git pull?"
    options: ["fetch רק מוריד את החדשות, ו-pull מוריד וגם ממזג אותן לענף שלכם", "הם זהים", "pull רק מוריד, ו-fetch גם ממזג"]
  - q: "ה-push שלכם נדחה עם 'fetch first'. מה זה אומר ומה צריך לעשות?"
    options: ["צריך למחוק את ה-remote", "הסיסמה שלכם שגויה", "מישהו עשה push ל-commits שעדיין אין לכם. משכו אותם (ופתרו קונפליקטים אם יש), ואז עשו push שוב"]
  - q: "מה עושה ה--u ב-git push -u origin main?"
    options: ["מעלה גם קבצים שלא במעקב", "זוכר את origin/main בתור ה-upstream של main, כך ש-git push ו-git pull בהמשך לא צריכים ארגומנטים", "מעדכן את Git עצמו"]
---

עד עכשיו הכול חי במחשב שלכם. כדי **לגבות** את העבודה, **לשתף** אותה ו**לעבוד בשיתוף**, מחברים את המאגר ל-**remote**: עותק נוסף של המאגר על שרת, למשל ב-GitHub.

## מהו remote?

remote הוא כינוי לכתובת. לפי המסורת, הראשי נקרא **origin**. מוסיפים אותו פעם אחת:

```bash
git remote add origin https://github.com/ada/recipe-book.git
git remote -v        # shows the addresses (fetch and push)
```

עדיין לא נשלח שום דבר. Git רק זוכר את הכתובת. (ב-GitHub יוצרים קודם מאגר ריק באתר; הדף מציג לכם את הכתובת הזאת.)

כשרוצים להתחיל מפרויקט קיים משתמשים ב-`git clone <address>`, שמוריד את כל המאגר, כולל ההיסטוריה, ומגדיר בשבילכם את `origin`. טרמינל התרגול לא יכול להוריד כלום, ולכן כאן מתחילים עם `git init` ו-`git remote add`; במחשב אמיתי `clone` היא הפקודה הראשונה הרגילה בפרויקט חדש.

## git push: שולחים את ה-commits

```bash
git push -u origin main
```

נקרא כך: "שלח את הענף `main` שלי ל-remote בשם `origin`". הדגל `-u` (או `--set-upstream`) גם זוכר שה-`main` המקומי שלכם הולך יחד עם `origin/main`. אחר כך מספיקים `git push` ו-`git pull` פשוטים. Git מדפיס משהו כזה:

```
To https://github.com/ada/recipe-book.git
 * [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

**התחברות ל-GitHub.** במחשב אמיתי, ה-push הראשון מבקש שתוכיחו מי אתם. GitHub כבר לא מקבל את סיסמת החשבון שלכם בשורת הפקודה. משתמשים או ב-**personal access token** (מחרוזת ארוכה דמוית סיסמה שיוצרים בהגדרות GitHub), או בעוזר התחברות כמו Git Credential Manager או GitHub CLI (`gh auth login`), או ב-**מפתח SSH** (אז הכתובת נראית כך: `git@github.com:ada/recipe-book.git`). טרמינל התרגול מדלג על כל זה.

## ענפי מעקב מרוחקים (Remote-tracking branches)

אחרי ה-push יש לכם ענף בשם `origin/main`. זה **הזיכרון** של המחשב שלכם לגבי המקום שבו `main` היה בשרת בפעם האחרונה שדיברתם איתו. אי אפשר לעשות לו commit ישירות; הוא זז רק כשעושים push, fetch או pull. הפקודה `git status` משווה אליו את הענף שלכם:

```
Your branch is up to date with 'origin/main'.
```

## git fetch ו-git pull: מקבלים חדשות

כשחבר צוות עושה push, השרת זז אבל המחשב שלכם עדיין לא יודע.

```bash
git fetch
```

מוריד את ה-commits החדשים ומעדכן את `origin/main`, אבל **לא נוגע בענף שלכם ולא בקבצים**. זה בטוח, ולכן אפשר להסתכל קודם עם `git status` או `git log origin/main`:

```
Your branch is behind 'origin/main' by 1 commit, and can be fast-forwarded.
```

```bash
git pull
```

הוא `git fetch` ואחריו מיזוג של `origin/main` לענף הנוכחי שלכם. בחיים האמיתיים משתמשים לרוב פשוט ב-`pull`.

## כש-push נדחה

אם חבר צוות עשה push קודם ואתם עושים push בלי ה-commits שלו, השרת מסרב:

```
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/ada/recipe-book.git'
```

התיקון תמיד זהה: `git pull` (ופתרון קונפליקטים כמו בשיעור 8 אם צריך), ואז `git push` שוב. לעולם אל "תכריחו" push כדי לעקוף את זה, אלא אם אתם באמת יודעים למה (`--force` יכול למחוק את העבודה של חבר הצוות).

> **שימו לב:**
> - `fatal: 'origin' does not appear to be a git repository`: לא הוספתם את ה-remote, או שטעיתם בשם שלו. בדקו עם `git remote -v`.
> - `fatal: The current branch has no upstream branch`: השתמשו ב-`git push -u origin <branch>` בפעם הראשונה.
> - `remote: Permission denied` או `Authentication failed` במחשב אמיתי: ה-token או מפתח ה-SSH שלכם חסרים או שגויים.
> - Git אמיתי עשוי להגיד `hint: You have divergent branches` כש-pull צריך מיזוג, ולבקש שתבחרו אסטרטגיה (`git config pull.rebase false` משאיר אותו כמיזוג).

> **תורכם:** עקבו אחרי ההערות הממוספרות. הוסיפו את ה-remote בשם `origin` עם הכתובת `https://github.com/ada/recipe-book.git`, הציגו אותו עם `git remote -v`, פרסמו עם `git push -u origin main` ובדקו את הסטטוס. אחרי ה-commit של חבר הצוות המדומה, הריצו `git fetch`, `git status`, `git pull` ו-`cat team.txt`. קוד ההתחלה עושה בשבילכם commit למתכון עוגה: פרסמו אותו עם `git push` וסיימו עם `git status`.
