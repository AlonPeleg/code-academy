---
title: "ענפים (Branches)"
summary: "עבדו על רעיונות חדשים בקווי היסטוריה מקבילים עם git branch ו-git switch."
hints:
  - "ענף הוא תווית שאפשר להזיז על commit. git branch יוצרת או מציגה ענפים, git switch מעבירה אתכם בין ענפים, ו-git switch -c עושה את שניהם: יוצרת ומעבירה."
  - "git branch / git branch add-soup / git switch add-soup / (echo) / git commit -am ... / git branch / git log --oneline / git switch main / cat recipes.txt / git switch -c add-salad / (echo) / git commit -am ... / git log --oneline --graph --all"
  - 'הודעות ה-commit: git commit -am "Add soup recipe" ו-git commit -am "Add salad recipe". הפקודה האחרונה היא git log --oneline --graph --all.'
quiz:
  - q: "מהו בעצם ענף?"
    options: ["עותק מלא של תיקיית הפרויקט", "תווית קלה שאפשר להזיז, שמצביעה על commit", "גיבוי ששמור ב-GitHub"]
    explain: "מכיוון שענף הוא רק מצביע, יצירתו מיידית וכמעט לא תופסת מקום."
  - q: "איזו פקודה יוצרת ענף חדש וגם מעבירה אתכם אליו?"
    options: ["git branch new-idea", "git switch new-idea", "git switch -c new-idea"]
  - q: "עברתם מענף פיצ'ר בחזרה ל-main. מה קורה לקבצים בתיקייה שלכם?"
    options: ["הם משתנים כך שיתאימו ל-commit האחרון ב-main", "הם נשארים אותו דבר", "הם נמחקים"]
  - q: "למה מפתחים משתמשים בענפים?"
    options: ["כדי ש-Git תרוץ מהר יותר", "כדי להסתיר commits מאנשים אחרים", "כדי לנסות שינויים בלי להפריע לגרסה היציבה"]
messages:
  - "צרו את הענף עם git branch add-soup."
  - "עברו לענף עם git switch add-soup."
  - "צרו ועברו בשלב אחד עם git switch -c add-salad."
  - "ציירו את הגרף עם git log --oneline --graph --all."
---

**ענף** (branch) מאפשר לנסות משהו חדש בלי לסכן את הגרסה העובדת. אפשר להתחיל "פיצ'ר סלט" בענף אחד בזמן שחבר צוות מתקן "באג מרק" בענף אחר, ואף אחד מכם לא מפריע ל-`main`. אחר כך מאחדים את העבודה (שיעורים 7 ו-8).

## מהו ענף באמת

כל commit מצביע על ההורה שלו, ולכן ההיסטוריה היא שרשרת. ענף הוא פשוט **שם שמצביע על commit אחד** בשרשרת הזאת. `main` הוא שם ברירת המחדל של הענף (מאגרים ישנים יותר קוראים לו `master`). כשאתם שומרים commit, הענף שאתם נמצאים בו מתקדם ל-commit החדש.

`HEAD` (שיעור 3) אומר ל-Git על איזה ענף אתם עומדים. בגלל זה הלוג מציג `(HEAD -> add-soup)`.

מכיוון שענף הוא רק תווית, יצירתו מיידית. השתמשו בהם בחופשיות: ענף אחד לכל רעיון הוא הרגל נפוץ מאוד.

## עבודה עם ענפים

| פקודה | מה היא עושה |
|---|---|
| `git branch` | מציגה ענפים; `*` מסמן את הנוכחי |
| `git branch add-soup` | יוצרת את הענף אבל אתם נשארים במקום |
| `git switch add-soup` | מעבירה אתכם לענף הזה |
| `git switch -c add-salad` | יוצרת את הענף ומעבירה אליו (ה-`-c` הוא קיצור של "create") |
| `git branch -d add-soup` | מוחקת ענף שכבר מוזג |

מדריכים ישנים יותר משתמשים ב-`git checkout add-soup` וב-`git checkout -b add-soup`. הן עושות אותו דבר, ותראו אותן הרבה. `git switch` היא הפקודה החדשה והברורה יותר.

## רואים את זה קורה

```bash
git branch add-soup
git switch add-soup
echo "Soup: water, salt" >> recipes.txt
git commit -am "Add soup recipe"
git log --oneline
```

```
22e83bc (HEAD -> add-soup) Add soup recipe
069d2b7 (main) Start recipe book
```

ה-commit של המרק קיים רק ב-`add-soup`. `main` עדיין מצביע על ה-commit הקודם. עכשיו עברו בחזרה:

```bash
git switch main
cat recipes.txt        # prints only the pancakes line
```

Git החליפה את הקבצים בתיקייה שלכם כך שיתאימו ל-`main`: שורת המרק נעלמה. היא לא אבדה, היא חיה בענף השני. עברו בחזרה ל-`add-soup` והיא תחזור. בהתחלה זה מרגיש כמו קסם, וזה בדיוק מה שהופך ענפים לשימושיים כל כך.

## רואים את כל הענפים יחד

`git log --oneline --graph --all` מציירת כל ענף:

```
* a1d5844 (HEAD -> add-salad) Add salad recipe
| * 22e83bc (add-soup) Add soup recipe
|/
* 069d2b7 (main) Start recipe book
```

שני הענפים מתחילים מאותו commit ואז כל אחד הולך בדרכו. ה-`*` מסמן commits, והקווים מראים איך הם מחוברים.

## שמות ענפים

השתמשו בשמות קצרים בלי רווחים: `add-soup`, `fix-login`, `feature/dark-mode`. מילים באותיות קטנות עם מקפים הן הסגנון הרגיל.

> **שימו לב:**
> - `error: Your local changes to the following files would be overwritten by checkout`: יש לכם עריכות שלא נשמרו ב-commit והן מתנגשות עם הענף שאליו אתם רוצים לעבור. שמרו אותן ב-commit קודם, או הניחו אותן בצד עם stash (שיעור 10).
> - `fatal: a branch named 'add-soup' already exists`: בחרו שם אחר או פשוט עברו אליו עם `git switch`.
> - שמירת commit בענף הלא נכון קורית הרבה. הריצו תמיד `git branch` או `git status` כדי לראות איפה אתם נמצאים לפני ששומרים commit.
> - `error: The branch 'x' is not fully merged`: `git branch -d` מסרבת למחוק עבודה שלא קיימת בשום מקום אחר. מזגו אותה קודם.
> - אי אפשר ליצור ענף לפני ה-commit הראשון: `fatal: cannot create branch without any commit yet`.

> **תורכם:** עקבו אחרי אחד-עשר ההערות הממוספרות. צרו את `add-soup` עם `git branch`, עברו לשם עם `git switch`, שמרו את שורת המרק ב-commit עם ההודעה `Add soup recipe`, הסתכלו על הענפים ועל הלוג, חזרו ל-`main` והדפיסו את `recipes.txt`. אחר כך צרו ועברו ל-`add-salad` עם `git switch -c`, שמרו את שורת הסלט ב-commit עם ההודעה `Add salad recipe` וסיימו עם `git log --oneline --graph --all`.
