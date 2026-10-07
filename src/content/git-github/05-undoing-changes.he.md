---
title: "ביטול טעויות: restore, amend, revert, reset"
summary: "מבטלים עריכות, מוציאים קבצים מאזור ההכנה, מתקנים את ה-commit האחרון ומבטלים commits ישנים יותר, בבטחה."
hints:
  - "לכל בעיה יש כלי משלה. עריכה שעדיין לא הועלתה לאזור ההכנה: git restore. קובץ שהועלה בטעות לאזור ההכנה: git restore --staged. טעות כתיב בהודעה האחרונה: git commit --amend. ביטול commit משותף: git revert. מחיקת commit פרטי: git reset --hard."
  - "שלב 1: git restore recipes.txt. שלב 3: git restore --staged notes.txt. שלב 5: git commit --amend -m עם הטקסט המתוקן. שלב 7: git revert HEAD. שלב 9: git reset --hard HEAD~1. שלבים 2, 4, 6, 8 ו-10 מדפיסים דברים (cat, git status, git log --oneline)."
  - "git restore recipes.txt / cat recipes.txt / git restore --staged notes.txt / git status / git commit --amend -m \"Add omelette recipe\" / git log --oneline / git revert HEAD / git log --oneline / git reset --hard HEAD~1 / git log --oneline  (כל אחד מהם נכנס מתחת להערה הממוספרת שלו)"
messages:
  - "השתמשו ב-git restore <file> כדי לבטל את העריכה."
  - "השתמשו ב-git restore --staged notes.txt כדי להוציא אותו מאזור ההכנה."
  - "השתמשו ב-git commit --amend כדי לתקן את ה-commit האחרון."
  - "השתמשו ב-git revert HEAD כדי לבטל בבטחה את ה-commit של המרק."
  - "השתמשו ב-git reset --hard HEAD~1 כדי למחוק את ה-commit האחרון."
quiz:
  - q: "ערכתם את recipes.txt אבל לא העליתם אותו לאזור ההכנה, ואתם רוצים שהעריכה תיעלם. איזו פקודה עושה את זה?"
    options: ["git revert recipes.txt", "git restore recipes.txt", "git restore --staged recipes.txt"]
    explain: "git restore <file> זורקת עריכות שלא הועלו לאזור ההכנה. אי אפשר לבטל את זה, ולכן היו בטוחים."
  - q: "למה git revert בטוחה יותר מ-git reset --hard עבור commits ששיתפתם כבר עם אחרים?"
    options: ["היא מוחקת את ה-commit מהמחשב של כולם", "היא מהירה יותר", "היא מוסיפה commit חדש שמבטל את הישן, ולכן ההיסטוריה אף פעם לא נכתבת מחדש"]
  - q: "מה עושה git commit --amend?"
    options: ["מחליפה את ה-commit האחרון בחדש (הודעה חדשה ו/או שינויים חדשים שהועלו לאזור ההכנה)", "מוסיפה commit שני מעליו", "מוחקת את ה-commit האחרון ואת השינויים שבו"]
  - q: "איזו פקודה זורקת לצמיתות את ה-commit האחרון וגם את השינויים שבו?"
    options: ["git reset --soft HEAD~1", "git restore --staged .", "git reset --hard HEAD~1"]
---

כולם עושים טעויות. החדשות הטובות: Git בנויה כך שאפשר לתקן את רוב הטעויות. החלק המסובך הוא ש"ביטול" פירושו דברים שונים לפי מה שכבר קרה. השיעור הזה נותן לכם כלי אחד לכל מצב.

## איפה הטעות?

שאלו את עצמכם כמה רחוק הטעות הגיעה, ואז בחרו את הכלי המתאים:

| מצב | כלי |
|---|---|
| ערכתם קובץ, עדיין לא העליתם לאזור ההכנה, ורוצים את התוכן הישן בחזרה | `git restore <file>` |
| העליתם קובץ לאזור ההכנה בטעות | `git restore --staged <file>` |
| טעות כתיב בהודעת ה-commit האחרון (או ששכחתם קובץ) | `git commit --amend` |
| commit גרוע שאחרים אולי כבר קיבלו | `git revert <commit>` |
| commit גרוע שקיים רק במחשב שלכם | `git reset --hard <commit>` |

## זורקים עריכות: git restore

```bash
git restore recipes.txt
```

מחליפה את הקובץ בגרסה מה-commit האחרון (או מאזור ההכנה אם העליתם משהו). העריכה **אבודה לתמיד**, כי Git אף פעם לא שמרה אותה. השתמשו בזה רק כשאתם בטוחים.

## מוציאים מאזור ההכנה: git restore --staged

```bash
git restore --staged notes.txt
```

מחזירה את הקובץ אל מחוץ לאזור ההכנה. העריכה שלכם לא נוגעת; הקובץ פשוט לא חלק מה-commit הבא. `git status` אפילו מזכירה לכם את הפקודה הזאת: חפשו `(use "git restore --staged <file>..." to unstage)`.

## מתקנים את ה-commit האחרון: git commit --amend

```bash
git commit --amend -m "Add omelette recipe"
```

מחליפה את ה-commit החדש ביותר בחדש שיש לו את ההודעה החדשה. אם מעלים קודם לאזור ההכנה עוד קבצים, גם ה-commit המתוקן מכיל אותם. ה-commit הישן לא נערך, הוא מוחלף, ולכן ה-hash משתנה. תקנו רק commits ששיתפתם.

## מבטלים בבטחה: git revert

```bash
git revert HEAD
```

יוצרת commit **חדש** שעושה את ההפך מה-commit שציינתם. ההיסטוריה מציגה גם את ה-commit הגרוע וגם את ה-revert:

```
9a86a63 (HEAD -> main) Revert "Add soup recipe"
10d2a9d Add soup recipe
```

שום דבר לא נכתב מחדש, ולכן זו הבחירה הנכונה לכל מה שכבר שותף, למשל ב-GitHub. בטרמינל אמיתי היא פותחת עורך עם הודעה מוכנה מראש; שמרו וסגרו אותו.

## חוזרים בזמן: git reset

```bash
git reset --hard HEAD~1
```

מזיזה את ה-branch שלכם אחורה ב-commit אחד. יש לה שלוש עוצמות:

- `--soft`: רק מזיזה את ה-branch. השינויים נשארים באזור ההכנה.
- `--mixed` (ברירת המחדל): גם מוציאה מאזור ההכנה. השינויים נשארים בקבצים שלכם.
- `--hard`: גם מאפסת את הקבצים שלכם. השינויים **נמחקים**.

מכיוון ש-`--hard` הורסת עבודה, חשבו פעמיים. לעולם אל תעשו reset ל-commits שכבר דחפתם (push) ואחרים משתמשים בהם, כי זה כותב מחדש את ההיסטוריה המשותפת.

> **שימו לב:**
> - `git restore` ו-`git reset --hard` יכולות למחוק עבודה שלא נעשה לה commit ש-Git לא יכולה להחזיר. הריצו קודם `git status` ו-`git diff`.
> - אחרי `--amend` ל-commit יש hash חדש. אם הוא כבר נדחף, לאחרים יהיו בעיות. תקנו רק commits פרטיים.
> - ב-Git האמיתית יש גם רשת ביטחון בשם `git reflog` שמפרטת איפה HEAD היה, ולכן אפשר לעיתים קרובות לשחזר גם reset קשה של שינוי שנעשה לו commit. שינויים שלא נעשה להם commit לא נמצאים בה.
> - `error: pathspec 'recipes.text' did not match any file(s) known to git` אומרת שיש טעות כתיב בשם הקובץ.

> **תורכם:** עברו על עשר ההערות הממוספרות בקוד ההתחלתי, והחליפו כל אחת בפקודה הנכונה: `git restore recipes.txt`, `cat recipes.txt`, `git restore --staged notes.txt`, `git status`, `git commit --amend -m "Add omelette recipe"`, `git log --oneline`, `git revert HEAD`, `git log --oneline`, `git reset --hard HEAD~1` ו-`git log --oneline`.
