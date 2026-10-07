---
title: "פתרון קונפליקטים במיזוג"
summary: "מבינים למה קונפליקטים קורים, איך לקרוא את סימני הקונפליקט ואיך לפתור אותם צעד אחר צעד."
hints:
  - "קונפליקט הוא Git שאומר: שני הצדדים שינו את אותן שורות ואני לא יודע איזו גרסה לשמור. אתם מחליטים, עורכים את הקובץ, מוסיפים אותו ל-staging ועושים commit. פתרון קונפליקט תמיד מסתיים ב-git add וב-git commit."
  - "git switch -c vegan, commit, git switch main, git merge vegan, git status, cat recipes.txt, ואז echo של השורה המשולבת עם > בודד כדי להחליף את הקובץ, git add recipes.txt, git status, git commit -m, git log --oneline --graph, cat recipes.txt."
  - 'echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt / git add recipes.txt / git commit -m "Merge vegan pancakes". החלק הראשון הוא: git switch -c vegan / git commit -am "Make pancakes vegan" / git switch main.'
messages:
  - "מזגו את הענף vegan עם git merge vegan."
  - "החליפו את תוכן recipes.txt עם > בודד (לא >>) ועם השורה המשולבת."
  - "הוסיפו את הקובץ שנפתר ל-staging עם git add recipes.txt."
  - 'סיימו עם git commit -m "Merge vegan pancakes".'
quiz:
  - q: "מתי קורה קונפליקט במיזוג?"
    options: ["בכל פעם שיש שני ענפים", "כששני הענפים שינו את אותן שורות בקובץ בדרכים שונות", "כששוכחים לעשות commit"]
  - q: "מה מראות השורות שבין <<<<<<< לבין =======?"
    options: ["את הגרסה שלכם, מהענף שאתם נמצאים בו", "את הגרסה של הענף השני", "את האב הקדמון המשותף"]
    explain: "מעל ======= נמצא הענף הנוכחי (HEAD), ומתחתיו הענף שנכנס."
  - q: "אחרי שערכתם את הקובץ שבקונפליקט והסרתם את הסימנים, מה צריך לעשות?"
    options: ["כלום, Git מזהה את זה אוטומטית", "git add לקובץ ואז git commit כדי לסיים את המיזוג", "למחוק את הענף"]
  - q: "התחלתם מיזוג ונלחצתם. איזו פקודה מחזירה אתכם למצב שלפני המיזוג?"
    options: ["git merge --abort", "git init", "git branch -d"]
---

רוב המיזוגים עוברים חלק, אבל לפעמים Git צריך שתעזרו לו. **קונפליקט מיזוג** (merge conflict) אינו שגיאה, אלא שאלה. בשיעור הזה תיצרו קונפליקט בכוונה ותפתרו אותו, כדי שהדבר האמיתי לא יפחיד אתכם לעולם.

## למה קונפליקטים קורים

Git ממזג על ידי השוואת שינויים שורה אחרי שורה. אם שניתם את שורה 1 בענף אחד ומישהו אחר שינה את שורה 5 בענף השני, Git משלב את שניהם. אבל אם שני הענפים שינו את **אותה שורה** (או שאחד מחק את מה שהשני ערך), Git לא יכול לדעת איזו גרסה נכונה. הוא עוצר ומשאיר לכם את ההחלטה.

בסיפור שלנו, `main` הוסיף חמאה לשורת הפנקייקים, ואילו הענף `vegan` החליף חלב וביצים באותה שורה בדיוק.

## שלב 1: המיזוג נעצר

```bash
git merge vegan
```

```
Auto-merging recipes.txt
CONFLICT (content): Merge conflict in recipes.txt
Automatic merge failed; fix conflicts and then commit the result.
```

אל תיבהלו. Git עצר באמצע המיזוג. הפקודה `git status` אומרת לכם איפה אתם:

```
On branch main
You have unmerged paths.
  (fix conflicts and run "git commit")
  (use "git merge --abort" to abort the merge)

Unmerged paths:
  (use "git add <file>..." to mark resolution)
	both modified:   recipes.txt
```

## שלב 2: קוראים את סימני הקונפליקט

Git כתב את שתי הגרסאות לתוך הקובץ, מופרדות בסימנים:

```
<<<<<<< main
Pancakes: flour, milk, eggs, butter
=======
Pancakes: flour, oat milk, banana
>>>>>>> vegan
```

- בין `<<<<<<<` ל-`=======` נמצא **הצד שלכם** (הענף שאתם נמצאים בו, כאן `main`).
- בין `=======` ל-`>>>>>>>` נמצא **הצד שלהם** (הענף שאתם ממזגים, כאן `vegan`).

## שלב 3: מחליטים וערכים

פתחו את הקובץ והביאו אותו למצב הרצוי: שמרו צד אחד, את הצד השני, או שילוב. **מחקו לגמרי את שלוש שורות הסימנים**. בפרויקט אמיתי משתמשים בעורך (VS Code מדגיש קונפליקטים ומציע כפתורים כמו "Accept Current Change"). בטרמינל התרגול אנחנו פשוט מחליפים את הקובץ בטקסט הסופי:

```bash
echo "Pancakes: flour, oat milk, banana, butter" > recipes.txt
```

הסימן `>` בודד מחליף את כל הקובץ, וזה בדיוק מה שאנחנו רוצים כאן.

## שלב 4: staging ו-commit

הוספה ל-staging אומרת ל-Git "הקובץ הזה נפתר":

```bash
git add recipes.txt
git status      # now says: All conflicts fixed but you are still merging.
git commit -m "Merge vegan pancakes"
```

ל-commit הזה יש שני הורים, והוא מסיים את המיזוג. בטרמינל אמיתי, `git commit` בלי `-m` פותח עורך עם הודעת מיזוג מוכנה. פשוט שומרים וסוגרים.

```
*   32b75b4 (HEAD -> main) Merge vegan pancakes
|\
* | fccbf6c Add butter to pancakes
| * 825c27a (vegan) Make pancakes vegan
|/
* 069d2b7 Start recipe book
```

## שומרים על קור רוח

- אפשר בכל רגע לעזוב את הקונפליקט ולחזור למצב שלפני המיזוג עם `git merge --abort`.
- כמה קבצים יכולים להיות בקונפליקט. פותרים ועושים להם `git add` אחד אחד. הפקודה `git status` מציגה מה נשאר.
- דברו עם חבר הצוות ששינוי שלו מתנגש עם שלכם אם אתם לא מבינים אותו.
- מיזוגים קטנים ותכופים וענפים קצרי חיים יוצרים פחות קונפליקטים.

> **שימו לב:**
> - commit של קובץ שעדיין מכיל סימני `<<<<<<<` הוא טעות קלאסית. חפשו בקובץ את `<<<<<<<` לפני ה-`git add`. סביר שהתוכנית שלכם בכלל לא תרוץ כשהם בפנים.
> - `error: Committing is not possible because you have unmerged files`: שכחתם `git add` על קובץ שהיה בקונפליקט.
> - אל תשתמשו ב-`git commit -a` בלי לבדוק קודם את הקבצים, בזמן מיזוג.
> - שימוש ב-`>>` במקום ב-`>` בטרמינל התרגול יוסיף לסוף הקובץ וישאיר את הסימנים. השתמשו ב-`>` בודד.

> **תורכם:** עקבו אחרי שתים עשרה שורות ההערה הממוספרות. צרו את הענף `vegan` ועשו commit עם ההודעה `Make pancakes vegan`, חזרו ל-`main`, מזגו את `vegan`, הסתכלו על הסטטוס ועל הקובץ, ואז פתרו את הקונפליקט בכך שתחליפו את `recipes.txt` בשורה היחידה `Pancakes: flour, oat milk, banana, butter`. הוסיפו אותו ל-staging, בדקו את הסטטוס, עשו commit עם ההודעה `Merge vegan pancakes`, ציירו את הגרף עם `git log --oneline --graph` והדפיסו את הקובץ שוב.
