---
title: "קריאת ההיסטוריה עם status, log ו-show"
summary: "הביטו אחורה בזמן עם git log ו-git show, והבינו מה הם HEAD ומזהי ה-commit (hash)."
hints:
  - "צריך רק לקרוא, בלי לשנות כלום. שלוש פקודות עושות את כל העבודה: status, log ו-show."
  - "git status, אחר כך git log, אחר כך git log --oneline, אחר כך git log -n 2 --oneline (האפשרות -n מגבילה כמה commits יוצגו), ואז git show HEAD ו-git show HEAD~1."
  - "git status / git log / git log --oneline / git log -n 2 --oneline / git show HEAD / git show HEAD~1"
quiz:
  - q: "מה פירוש HEAD ב-Git?"
    options: ["ה-commit הראשון שנוצר אי פעם", "ה-commit שאתם נמצאים בו כרגע (בדרך כלל החדש ביותר בענף שלכם)", "השרת המרוחק"]
  - q: "לאן מצביע HEAD~1?"
    options: ["להורה: ה-commit שנמצא ממש לפני HEAD", "ל-commit שבא אחרי HEAD", "לקובץ בשם HEAD~1"]
  - q: "איזו פקודה מראה בדיוק מה commit אחד שינה?"
    options: ["git show", "git status", "git init"]
  - q: "באיזה סדר git log מציגה את ה-commits?"
    options: ["מהישן לחדש", "לפי סדר האלף-בית של ההודעות", "מהחדש לישן"]
    explain: "ה-commit החדש ביותר נמצא למעלה, וזה בדרך כלל זה שמעניין אתכם."
messages:
  - "הגבילו את הלוג הקצר לשני commits עם -n 2."
  - "השתמשו ב-git show HEAD עבור ה-commit החדש ביותר."
  - "השתמשו ב-git show HEAD~1 עבור ה-commit שלפני החדש ביותר."
---

מאגר הוא סיפור: כל commit הוא עמוד אחד. בשיעור הזה תלמדו לקרוא את הסיפור, מה שתעשו כל יום, למשל כדי לגלות מתי באג הופיע או מה חבר צוות שינה.

## git status: איפה אני עכשיו?

אתם כבר מכירים את `git status`. משתמשים בה לפני כמעט כל פעולה ואחריה. כשאין שום דבר שמחכה לשמירה היא מדפיסה:

```
On branch main

nothing to commit, working tree clean
```

"Working tree clean" אומר שהקבצים שלכם זהים ל-commit האחרון.

## git log: ההיסטוריה

```bash
git log
```

מדפיסה כל commit, מהחדש לישן. בכל רשומה יש ארבעה חלקים:

```
commit 3a33d281606eda285f982b715f2b356247d2b028 (HEAD -> main)
Author: Ada Learner <ada@example.com>
Date:   Mon Jan 15 13:00:00 2024 +0000

    Add omelette recipe
```

- המספר הארוך הוא ה-**hash** של ה-commit: מזהה ייחודי שמחושב מהתוכן. ב-Git אמיתית הוא נראה אקראי; שני commits שונים אף פעם לא חולקים אותו.
- `(HEAD -> main)` הוא תווית. **HEAD** הוא המצביע "אתם נמצאים כאן" של Git. כאן הוא אומר שאתם בענף `main`, ב-commit הזה.
- **Author** ו-**Date** באים מהגדרות Git שלכם ומהשעון.
- הטקסט המוזח הוא הודעת ה-commit.

הלוג המלא ארוך, ולכן רוב האנשים משתמשים בצורה הקומפקטית:

```bash
git log --oneline
```

```
3a33d28 (HEAD -> main) Add omelette recipe
54ade81 Add first recipe
9dda986 Add README
```

מוצגים רק שבעת התווים הראשונים של ה-hash. זה מספיק כדי לזהות commit, ואפשר להקליד את שבעת התווים האלה בכל מקום ש-Git מבקשת commit.

כדי להגביל את הפלט, הוסיפו `-n` ומספר: `git log -n 2 --oneline` מציגה רק את שני ה-commits החדשים ביותר. אפשר לשלב אפשרויות בכל סדר. בטרמינל אמיתי לוג ארוך נפתח בדפדוף (pager): לחצו `q` כדי לצאת.

## git show: מה ה-commit הזה שינה?

```bash
git show HEAD
```

מציגה את כותרת ה-commit ואחריה את ה-**diff**: השורות שנוספו או הוסרו. שורות שמתחילות ב-`+` נוספו, שורות שמתחילות ב-`-` הוסרו:

```
@@ -1 +1,2 @@
 Pancakes: flour, milk, eggs
+Omelette: eggs, salt
```

אפשר להצביע על commits ישנים יותר על ידי ספירה אחורה מ-HEAD. `HEAD~1` הוא ההורה (צעד אחד אחורה), `HEAD~2` הוא שני צעדים אחורה, וכן הלאה. אפשר גם להשתמש ב-hash: `git show 54ade81`.

## מחברים הכול יחד

סשן בילוש טיפוסי: `git log --oneline` כדי למצוא את ה-commit החשוד, ואז `git show <hash>` כדי לראות מה הוא שינה. מכיוון שקריאה אף פעם לא משנה commits, אי אפשר להזיק עם `status`, `log` או `show`, אז חקרו בחופשיות.

> **שימו לב:**
> - `fatal: your current branch 'main' does not have any commits yet`: הרצתם `git log` לפני ה-commit הראשון.
> - `fatal: ambiguous argument 'HEAD~5': unknown revision`: ההיסטוריה קצרה מהמספר שביקשתם.
> - `HEAD~1` נכתב עם טילדה `~`, לא עם מקף. `HEAD-1` לא מובן ל-Git.
> - בטרמינל אמיתי `git log` יכולה להציג אלפי שורות. השתמשו ב-`--oneline` וב-`-n` כדי לשמור על פלט קצר.

> **תורכם:** קוד ההתחלה בונה בשבילכם היסטוריה של שלושה commits. הוסיפו את ששת הפקודות האלה לפי הסדר: `git status`, `git log`, `git log --oneline`, `git log -n 2 --oneline`, `git show HEAD` ו-`git show HEAD~1`.
