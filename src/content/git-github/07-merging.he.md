---
title: "מיזוג branches"
summary: "מחזירים עבודה גמורה יחד, ולומדים את ההבדל בין fast-forward ל-merge commit."
hints:
  - "תמיד ממזגים אל ה-branch שאתם עומדים עליו. לכן עוברים קודם ל-main, ואז נותנים את שם ה-branch שרוצים להביא."
  - "חלק א: git switch -c add-soup, commit, git switch main, git merge add-soup, git log --oneline, git branch -d add-soup. חלק ב: git switch -c add-salad, git add salad.txt, commit, git switch main, (שורות ה-pasta), git merge add-salad, git log --oneline --graph, ls."
  - "git switch -c add-soup / git commit -am \"Add soup recipe\" / git switch main / git merge add-soup / git log --oneline / git branch -d add-soup / git switch -c add-salad / git add salad.txt / git commit -m \"Add salad recipe\" / git switch main / git merge add-salad / git log --oneline --graph / ls"
messages:
  - "מזגו את ה-branch של המרק עם git merge add-soup."
  - "מחקו את ה-branch הממוזג עם git branch -d add-soup."
  - "מזגו את ה-branch של הסלט עם git merge add-salad."
  - "הציגו את הגרף עם git log --oneline --graph."
quiz:
  - q: "אתם על main ומריצים git merge add-soup. איזה branch מקבל את השינויים?"
    options: ["add-soup", "שני ה-branches", "main"]
    explain: "תמיד ממזגים אל ה-branch שאתם נמצאים עליו כרגע."
  - q: "מתי Git יכולה לבצע מיזוג fast-forward?"
    options: ["כשל-branch הנוכחי אין commits חדשים משלו, ולכן Git יכולה פשוט להזיז את התווית קדימה", "רק כשיש קונפליקטים", "רק כשלשני ה-branches יש אותו שם"]
  - q: "מה יש ל-merge commit שאין ל-commit רגיל?"
    options: ["אין לו הודעה", "שני הורים, אחד מכל branch", "אין לו מחבר"]
  - q: "אחרי מיזוג של branch, מה הצעד הבא הטוב?"
    options: ["להתקין מחדש את Git", "למחוק את התיקייה .git", "למחוק את ה-branch הממוזג עם git branch -d, כי העבודה שלו כבר חלק מ-main"]
---

Branches שימושיים רק אם אפשר להחזיר את העבודה יחד. זה **מיזוג** (merging): לוקחים את ה-commits של branch אחד ומשלבים אותם באחר. בשיעור הזה תכירו את שני סוגי המיזוג ש-Git מבצעת.

## כלל הזהב

ממזגים **אל ה-branch שאתם עליו**. השגרה הרגילה היא:

```bash
git switch main          # go to the branch that should receive the work
git merge add-soup       # bring add-soup in
```

לעולם אל תחשבו "למזג את main אל soup" אלא אם באמת התכוונתם לזה. ה-branch שאתם נותנים את שמו הוא לקריאה בלבד בפעולה הזאת, וה-branch שאתם עומדים עליו הוא זה שמשתנה.

## סוג 1: fast-forward

דמיינו ש-`add-soup` התחיל מה-commit האחרון של `main`, ובזמן שעבדתם אף אחד לא הוסיף כלום ל-`main`. ההיסטוריה היא קו ישר:

```
main:      A --- B
add-soup:         \--- C
```

Git לא צריכה לשלב כלום. היא רק מזיזה את התווית `main` קדימה מ-B ל-C. זה **fast-forward**, והוא מדפיס:

```
Updating 069d2b7..22e83bc
Fast-forward
 recipes.txt | 1 +
 1 file changed, 1 insertion(+)
```

לא נוצר commit חדש, וההיסטוריה נשארת קו נקי.

## סוג 2: merge commit

עכשיו נניח שבזמן שעבדתם על `add-salad`, גם ל-`main` נוסף commit חדש (הפסטה). ההיסטוריות **התפצלו** (diverged): לכל צד יש commits שלצד השני אין. Git כבר לא יכולה להחליק תווית. היא מבצעת **מיזוג תלת-כיווני** (three-way merge): היא מסתכלת על האב המשותף ועל שני הקצוות, משלבת את השינויים, ורושמת את התוצאה ב-**merge commit** מיוחד שיש לו שני הורים.

```
Merge made by the 'ort' strategy.
 salad.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 salad.txt
```

הגרף מראה את הצורה היטב:

```
*   f93dd91 (HEAD -> main) Merge branch 'add-salad'
|\
* | 6c72924 Add pasta recipe
| * e5bebbf (add-salad) Add salad recipe
|/
* 22e83bc Add soup recipe
```

השורות `|\` ו-`|/` הן שתי ההיסטוריות שמתפצלות ומתחברות. קבצים שונים השתנו בכל צד, ולכן Git שילבה אותם בלי לשאול אתכם דבר. מה קורה כששני הצדדים נוגעים באותה שורה הוא הנושא של השיעור הבא.

בטרמינל אמיתי Git פותחת את העורך שלכם להודעת ה-merge commit (מלאה מראש ב-`Merge branch 'add-salad'`); פשוט שמרו וסגרו אותו. אם רוצים merge commit גם כשאפשר fast-forward, השתמשו ב-`git merge --no-ff add-soup`. צוותים משתמשים בזה כדי לשמור תיעוד גלוי לכך שהיה branch של פיצ'ר.

## ניקיון

ברגע ש-branch ממוזג, ה-commits שלו חלק מ-`main`, ולכן התווית כבר לא נחוצה:

```bash
git branch -d add-soup
```

`-d` היא מחיקה בטוחה: היא מסרבת אם ל-branch יש עבודה שלא מוזגה בשום מקום. המחיקה מסירה רק את התווית, אף פעם לא את ה-commits שמוזגו.

> **שימו לב:**
> - `Already up to date.` אומרת שב-branch שנתתם את שמו אין שום דבר חדש בשבילכם. אולי מיזגתם בכיוון הלא נכון.
> - מיזוג כשיש לכם עריכות שלא נעשה להן commit באותם קבצים נותן `error: Your local changes to the following files would be overwritten by merge`. עשו commit או stash קודם.
> - `merge: add-soup - not something we can merge` אומרת ששם ה-branch כתוב לא נכון. בדקו עם `git branch`.
> - אם מיזוג משתבש, `git merge --abort` מחזירה אתכם למצב שלפני המיזוג.

> **תורכם:** עקבו אחרי שתים עשרה ההערות הממוספרות. בחלק א, צרו את `add-soup`, עשו commit עם ההודעה `Add soup recipe`, עברו ל-`main`, מזגו, הציגו את הלוג ומחקו את ה-branch. בחלק ב, צרו את `add-salad`, העלו לאזור ההכנה ועשו commit ל-`salad.txt` עם ההודעה `Add salad recipe`, חזרו ל-`main` (ה-commit של הפסטה כבר נמצא בקוד ההתחלתי), מזגו את `add-salad`, ציירו את הגרף עם `git log --oneline --graph` והציגו את הקבצים עם `ls`.
