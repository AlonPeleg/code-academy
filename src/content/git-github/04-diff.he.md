---
title: "לראות שינויים עם git diff"
summary: "השוו את הקבצים שלכם לאזור ההכנה ול-commit האחרון לפני השמירה."
hints:
  - "ל-git diff יש שני מצבים: בלי אפשרויות היא משווה את הקבצים שלכם לאזור ההכנה, ועם --staged היא משווה את אזור ההכנה ל-commit האחרון."
  - "הסדר: git diff, git add recipes.txt, git diff (ריק), git diff --staged, ואחרי ה-echo השני: git status, git diff, git add recipes.txt, git commit, git status."
  - 'git diff / git add recipes.txt / git diff / git diff --staged (ואז שורת ה-echo) git status / git diff / git add recipes.txt / git commit -m "Add omelette and waffles" / git status'
quiz:
  - q: "ערכתם קובץ אבל לא הכנתם אותו. איזו פקודה מראה את העריכה שלכם?"
    options: ["git diff --staged", "git diff", "git log"]
  - q: "מה git diff --staged מראה?"
    options: ["את השינויים שמחכים באזור ההכנה, כלומר מה שה-commit הבא יכיל", "את השינויים שעדיין לא הוכנו", "את ההבדל בין שני ענפים"]
  - q: "ב-diff, מה פירוש שורה שמתחילה ב-+?"
    options: ["השורה הוסרה", "השורה היא הערה", "השורה נוספה"]
  - q: "הרצתם git add file.txt ואחר כך git diff. מה אתם רואים?"
    options: ["את כל מה ששיניתם", "כלום, כי השינוי הוכן ולכן לא נשאר הבדל להציג", "הודעת שגיאה"]
    explain: "git diff רגילה משווה את תיקיית העבודה לאזור ההכנה. השתמשו ב-git diff --staged כדי לראות את השינוי שהוכן."
messages:
  - "השתמשו ב-git diff --staged כדי לראות מה הוכן."
  - "שמרו commit עם ההודעה \"Add omelette and waffles\"."
---

לפני ששומרים תמונת מצב, כדאי לדעת בדיוק מה יש בה. `git diff` עונה על השאלה "מה שיניתי?" שורה אחר שורה. זו בדיקת הביטחון שלכם לפני כל commit.

## מהו diff?

**diff** (קיצור של "difference", הבדל) מפרט את השורות ששונות בין שתי גרסאות של קובץ. הנה אחד:

```
diff --git a/recipes.txt b/recipes.txt
index d907574..845c622 100644
--- a/recipes.txt
+++ b/recipes.txt
@@ -1 +1,2 @@
 Pancakes: flour, milk, eggs
+Omelette: eggs, salt
```

קראו אותו כך:

- `--- a/recipes.txt` היא הגרסה הישנה, `+++ b/recipes.txt` היא החדשה.
- `@@ -1 +1,2 @@` אומר: בגרסה הישנה החלק המעניין הוא שורה 1 (שורה אחת); בגרסה החדשה הוא מתחיל בשורה 1 ואורכו 2 שורות.
- שורה שמתחילה ברווח היא הקשר שלא השתנה, שורה שמתחילה ב-`+` **נוספה**, ושורה שמתחילה ב-`-` **הוסרה**. שורה ששונתה מופיעה כשורת `-` אחת ואחריה שורת `+` אחת.

אין צורך להבין את שורת ה-`index`; זה הניהול הפנימי של Git.

## שתי השוואות

זכרו את שלושת המקומות משיעור 2: תיקיית העבודה, אזור ההכנה וה-commit האחרון. Git יכולה להשוות בין שכנים:

| פקודה | משווה | עונה על |
|---|---|---|
| `git diff` | תיקיית העבודה מול אזור ההכנה | "מה שיניתי ועדיין לא הכנתי?" |
| `git diff --staged` | אזור ההכנה מול ה-commit האחרון | "מה ה-commit הבא שלי יכיל?" |

(`--cached` הוא שם ישן יותר ל-`--staged`; שניהם עובדים.)

כך הפקודות מתנהגות בזמן העבודה:

```bash
echo "Omelette: eggs, salt" >> recipes.txt   # edit the file
git diff            # shows the new Omelette line
git add recipes.txt
git diff            # prints nothing: no unstaged difference is left
git diff --staged   # shows the Omelette line, as it will be committed
```

ה-`>>` בשורה הראשונה **מוסיף** שורה לסוף הקובץ (`>` יחיד היה מחליף את כל הקובץ).

## עריכות אחרי ההכנה

מה אם מכינים קובץ ואז עורכים אותו שוב? Git הכינה את הגרסה ברגע ה-`git add`. העריכה החדשה יותר נמצאת רק בתיקיית העבודה. לכן הקובץ מופיע פעמיים ב-`git status`: תחת "Changes to be committed" ותחת "Changes not staged for commit". `git diff` מראה רק את העריכה החדשה, ו-`git diff --staged` מראה את הישנה יותר. אם תשמרו commit עכשיו, יישמר רק החלק שהוכן. כדי לכלול את העריכה החדשה, הריצו `git add` שוב.

## diff של קובץ בודד

הוסיפו שם קובץ כדי להסתכל רק עליו: `git diff recipes.txt` או `git diff --staged recipes.txt`. כשיש הרבה קבצים ששונו, זה שומר על פלט קצר. `git diff --stat` מדפיסה רק סיכום של כמה שורות השתנו בכל קובץ.

> **שימו לב:**
> - תשובה ריקה מ-`git diff` לא אומרת "לא השתנה כלום". ייתכן שהכול כבר הוכן. בדקו את `git diff --staged` ואת `git status`.
> - קובץ חדש לגמרי (שאינו במעקב) לא מופיע ב-`git diff` עד שתריצו עליו `git add`, כי Git עדיין לא עוקבת אחריו.
> - `git diff` היא לקריאה בלבד. היא אף פעם לא משנה את הקבצים שלכם, ולכן בטוח להריץ אותה כמה שרוצים.
> - בטרמינל אמיתי diffs ארוכים נפתחים בדפדוף (pager). לחצו `q` כדי לצאת.

> **תורכם:** עקבו אחרי ההערות הממוספרות בקוד ההתחלה. הציגו את ה-diff שלא הוכן, הכינו את `recipes.txt`, הציגו שוב את ה-diff שלא הוכן (ריק) ואת ה-diff שהוכן. אחרי העריכה השנייה הריצו `git status` ו-`git diff`, הכינו את הקובץ שוב, שמרו אותו ב-commit עם ההודעה `Add omelette and waffles` וסיימו עם `git status`.
