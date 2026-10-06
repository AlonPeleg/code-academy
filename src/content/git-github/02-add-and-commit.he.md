---
title: "שלב ההכנה ושמירת commit"
summary: "שמרו תמונות מצב של העבודה עם git add ו-git commit, והבינו למה משמש אזור ההכנה (staging area)."
hints:
  - "שמירה ב-Git נעשית בשני שלבים: קודם בוחרים מה ייכנס לתמונת המצב (הכנה), ואז שומרים אותה (commit). תעשו את שני השלבים פעמיים."
  - "הפקודות הן git add <file>, git status, git commit -m <message> ו-git log --oneline. הכינו קודם את README.md, שמרו commit, ואז הכינו את recipes.txt ושמרו commit נוסף."
  - 'git add README.md / git status / git commit -m "Add README" / git add recipes.txt / git commit -m "Add first recipe" / git log --oneline'
quiz:
  - q: "מה עושה git add?"
    options: ["שומרת את תמונת המצב לצמיתות", "מכניסה את השינויים שנבחרו לאזור ההכנה (staging area), מוכנים ל-commit הבא", "מעלה את הקבצים ל-GitHub"]
  - q: "מהו commit?"
    options: ["עותק זמני שנעלם כשסוגרים את הטרמינל", "הודעה שנשלחת לחבר צוות", "תמונת מצב שמורה של הקבצים שהוכנו, עם הודעה שמתארת אותה"]
  - q: "מה מסמל ה-m ב-git commit -m \"text\"?"
    options: ["message (הודעה)", "merge (מיזוג)", "mode (מצב)"]
    explain: "בלי -m, Git אמיתית פותחת עורך טקסט ומבקשת שתקלידו שם את ההודעה."
  - q: "שיניתם שני קבצים אבל הכנתם רק אחד מהם. מה יכיל ה-commit הבא?"
    options: ["את שני הקבצים", "רק את הקובץ שהוכן", "אף אחד מהקבצים"]
messages:
  - "הכינו את README.md לפי השם שלו עם הפקודה add."
  - "שמרו commit עם ההודעה \"Add README\"."
  - "סיימו עם פקודת log והאפשרות --oneline."
---

בשיעור הקודם Git הבחינה בקובץ שלכם אבל לא שמרה אותו. עכשיו תלמדו את השגרה בת שני השלבים שתחזרו עליה אלפי פעמים בקריירה: **להכין** (stage) את השינויים שאתם רוצים, ואז **לשמור אותם ב-commit**.

## למה שני שלבים?

חשבו על צילום תמונה קבוצתית. קודם מסדרים מי עומד בתמונה (הכנה), ואז לוחצים על הצמצם (commit). Git עובדת באותו אופן. יש שלושה מקומות שבהם קובץ יכול להיות:

1. **תיקיית העבודה** (working directory): הקבצים האמיתיים שאתם עורכים.
2. **אזור ההכנה** (staging area, נקרא גם "index"): הקבצים שבחרתם לתמונת המצב הבאה.
3. **המאגר** (repository): ההיסטוריה השמורה של ה-commits.

אזור ההכנה מאפשר לשמור תמונת מצב נקייה וממוקדת גם כששיניתם חמישה דברים. אפשר לשמור עכשיו commit עם שני הקבצים שקשורים ל"התחברות" ו-commit נפרד עם שלושת הקבצים שקשורים ל"צבעים".

## git add: בוחרים מה לשמור

```bash
git add README.md
```

הפקודה מעתיקה את התוכן הנוכחי של `README.md` לאזור ההכנה. כשהיא מצליחה היא לא מדפיסה כלום. כמה וריאציות שימושיות:

- `git add file1.txt file2.txt` מכינה כמה קבצים.
- `git add .` מכינה כל מה שבתיקייה והוא חדש או השתנה (הנקודה אומרת "כאן").

אחרי ההכנה, `git status` מציגה את הקובץ תחת **Changes to be committed**, בירוק בטרמינל אמיתי:

```
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
	new file:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	recipes.txt
```

אפשר לראות את שני העולמות בבת אחת: `README.md` הוכן, ו-`recipes.txt` עדיין לא במעקב ולא יהיה חלק מתמונת המצב.

## git commit: שומרים את תמונת המצב

```bash
git commit -m "Add README"
```

`commit` שומרת את כל מה שהוכן. האפשרות `-m` נותנת את **הודעת ה-commit**, משפט קצר שמסביר מה תמונת המצב הזאת עושה. Git עונה במשהו כמו:

```
[main (root-commit) 9dda986] Add README
 1 file changed, 1 insertion(+)
 create mode 100644 README.md
```

קראו את זה משמאל לימין: אתם בענף `main`, זה ה-commit הראשון ("root-commit"), המזהה הקצר שלו הוא `9dda986`, ונשמר קובץ אחד עם שורה חדשה אחת. כל commit מקבל מזהה ייחודי (hash ארוך); אפשר להשתמש בשבעת התווים הראשונים ככינוי. בטרמינל התרגול המזהים מדומים אבל תמיד זהים, כך שאפשר להשוות את הפלט שלכם לפלט הצפוי.

קיצור דרך: `git commit -am "message"` מכינה את כל הקבצים שכבר במעקב ושומרת commit בבת אחת. היא לא קולטת קבצים חדשים לגמרי.

## מסתכלים על ההיסטוריה

```bash
git log --oneline
```

מדפיסה שורה אחת לכל commit, מהחדש לישן: המזהה הקצר ואחריו ההודעה. `(HEAD -> main)` מסמן איפה אתם נמצאים עכשיו. עוד על כך בשיעור 3.

## כותבים הודעה טובה

כתבו מה ה-commit עושה בציווי, כאילו אתם נותנים הוראה: `Add README`, `Fix typo in recipe`. שמרו על קצרות. הימנעו מ-`stuff` או `update`.

> **שימו לב:**
> - `nothing to commit, working tree clean` או `no changes added to commit`: שכחתם `git add`, או שלא השתנה כלום.
> - `Aborting commit due to empty commit message.`: השמטתם את ההודעה. הוסיפו `-m "..."`.
> - בטרמינל אמיתי, `git commit` בלי `-m` פותחת עורך טקסט (לרוב vim). אם נתקעתם שם, הקלידו `:q!` ולחצו Enter כדי לצאת בלי לשמור.
> - שימו את ההודעה במרכאות. `git commit -m Add README` גורם ל-Git לחשוב ש-`README` הוא שם קובץ, והפקודה נכשלת עם שגיאה.

> **תורכם:** קוד ההתחלה כבר יוצר את המאגר ושני קבצים. הכינו את `README.md` והסתכלו על הסטטוס, שמרו אותו ב-commit עם ההודעה `Add README`, אחר כך הכינו את `recipes.txt`, שמרו אותו ב-commit עם ההודעה `Add first recipe`, וסיימו עם `git log --oneline`. השתמשו בהודעות בדיוק כפי שהן כתובות.
