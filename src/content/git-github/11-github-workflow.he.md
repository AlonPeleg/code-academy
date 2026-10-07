---
title: "תהליך העבודה ב-GitHub"
summary: "עובדים כמו צוות מקצועי עם ענפי פיצ'ר, pull requests, forks והודעות commit ברורות, ולומדים לפרסם אתר עם GitHub Pages."
hints:
  - "הלולאה המקצועית היא: ענף, commit, push של הענף, פתיחת pull request, מיזוג, ניקוי. פרסום ענף חדש דורש -u כדי ש-Git יזכור לאן הוא הולך."
  - "git remote add origin <url> / git push -u origin main / git switch -c feature/add-soup / git commit -am ... / git push -u origin feature/add-soup / git status / git branch -a / git switch main / git merge feature/add-soup / git push / git branch -d feature/add-soup / git branch -a / git log --oneline"
  - 'git remote add origin https://github.com/ada/recipe-book.git / git push -u origin main / git switch -c feature/add-soup / git commit -am "Add soup recipe" / git push -u origin feature/add-soup'
messages:
  - "פרסמו את main עם git push -u origin main."
  - "צרו את ענף הפיצ'ר עם git switch -c feature/add-soup."
  - "פרסמו את ענף הפיצ'ר עם git push -u origin feature/add-soup."
  - "מחקו את הענף שמוזג עם git branch -d feature/add-soup."
quiz:
  - q: "מהו pull request?"
    options: ["בקשה להוריד מאגר", "הצעה ב-GitHub למזג ענף אחד לענף אחר, שבה חברי צוות יכולים לסקור ולדון בשינויים", "פקודה שמושכת קבצים"]
  - q: "מהו fork?"
    options: ["עותק משלכם של מאגר של מישהו אחר ב-GitHub, שבו מותר לכם לבצע שינויים", "ענף שבור", "קונפליקט מיזוג"]
  - q: "איזו הודעת commit עומדת בכללי העבודה הטובים?"
    options: ["Fix bug in login when the password is empty", "stuff", "changed some things in several files"]
    explain: "קצרה, בצורת ציווי וספציפית: היא אומרת מה ה-commit עושה."
  - q: "למה צוותים עובדים על ענפי פיצ'ר במקום לעשות commit ישירות ל-main?"
    options: ["Git דורש את זה", "main נשאר יציב, ואפשר לסקור שינויים לפני שמזגים אותם", "זה מקטין את גודל ה-commits"]
---

אתם כבר מכירים את פקודות Git. השיעור הזה מראה איך צוותים אמיתיים ופרויקטים בקוד פתוח מחברים אותן יחד עם **GitHub**. המטרה: לשנות פרויקט בלי לשבור אותו, ולתת לאחרים לבדוק את העבודה שלכם לפני שהיא ממוזגת.

## תהליך ענף הפיצ'ר (feature branch)

כמעט כל צוות עוקב אחרי אותה לולאה:

1. **ענף**: יוצרים ענף למשימה אחת, למשל `feature/add-soup` או `fix/login-bug`. לוכסנים בשמות הם בסדר ועוזרים לשמור על סדר.
2. **Commit**: מבצעים commits קטנים וממוקדים בענף הזה.
3. **Push**: מפרסמים את הענף עם `git push -u origin feature/add-soup`. ה-`-u` נחוץ רק בפעם הראשונה עבור ענף חדש.
4. **Pull request**: באתר GitHub פותחים **pull request** (או "PR"). הוא אומר: "בבקשה מזגו את הענף שלי ל-`main`". GitHub מציג את ההבדלים (diff), וחברי הצוות יכולים להגיב על שורות בודדות, לאשר או לבקש שינויים. בדרך כלל גם בדיקות אוטומטיות (טסטים) רצות כאן.
5. **מיזוג**: כשה-PR מאושר, מישהו לוחץ על **Merge pull request**. GitHub מבצע בשרת את המיזוג שלמדתם בשיעור 7.
6. **ניקוי**: מוחקים את הענף, עוברים ל-`main` ועושים `git pull` כדי לקבל את התוצאה הממוזגת.

Pull requests הם תכונה של האתר ולא של Git עצמו, ולכן טרמינל התרגול לא יכול להציג אותם. בשיעור הזה אנחנו מבצעים את המיזוג ביד כדי לתרגל את הפקודות שסביבו. אם אתם דוחפים עוד commits לאותו ענף בזמן שה-PR פתוח, ה-PR מתעדכן אוטומטית.

## Forks: תרומה לפרויקט שאינו שלכם

אי אפשר לעשות push למאגר של מישהו אחר. בפרויקטים בקוד פתוח עושים במקום זה כך:

1. **Fork** (כפתור ב-GitHub): מקבלים עותק משלכם תחת החשבון שלכם.
2. **Clone** של ה-fork למחשב שלכם, יוצרים ענף, עושים commit ו-push ל-fork שלכם.
3. פותחים **pull request** מה-fork שלכם אל הפרויקט המקורי. המתחזקים (maintainers) סוקרים אותו ויכולים למזג אותו.

בתוך צוות שחולק מאגר אחד, בדרך כלל מדלגים על ה-fork ופשוט דוחפים ענפים.

## הודעות commit טובות

את הודעות ה-commit שלכם קוראים חברי הצוות וגם אתם בעתיד. הרגל טוב:

- שורה ראשונה קצרה (בערך 50 תווים) ב**צורת ציווי**: `Add soup recipe`, `Fix crash when the list is empty`.
- כתבו **מה**, ואם זה לא מובן מאליו גם **למה**. פרטים הולכים בשורות נוספות אחרי שורה ריקה (השתמשו בעורך, לא ב-`-m`).
- רעיון אחד לכל commit. אם אתם צריכים הרבה את המילה "וגם", פצלו.
- הימנעו מ-`fix`, `update`, `wip`, `asdf`.

אותו דבר נכון לכותרות של pull requests.

## GitHub Pages: מפרסמים אתר

מאגר שיש בו `index.html` יכול להפוך לאתר חי בחינם. במאגר ב-GitHub פתחו **Settings, Pages**, בחרו את הענף (בדרך כלל `main`) ואת תיקיית השורש, ושמרו. אחרי דקה האתר שלכם מופיע בכתובת `https://<your-name>.github.io/<repository>/`. בכל פעם שאתם עושים push לענף הזה, האתר מתעדכן. זה בית מושלם לתיק עבודות.

## הרגלים שימושיים נוספים

- שמרו `README.md` טוב (מהו הפרויקט, איך להריץ אותו).
- השתמשו ב-**Issues** ב-GitHub כדי לעקוב אחרי באגים ורעיונות. כתיבת `Fixes #12` בתיאור של PR סוגרת את issue 12 כשה-PR ממוזג.
- עשו `git pull` לפני שמתחילים לעבוד כדי להתחיל מהגרסה החדשה ביותר.
- עשו commit לעתים קרובות, ו-push לפחות בסוף היום: זה גם הגיבוי שלכם.

> **שימו לב:**
> - לעולם אל תעשו commit לסיסמאות, ל-tokens או לקבצי `.env`. אם דחפתם סוד, החליפו אותו מיד: מחיקת ה-commit אחר כך לא הופכת אותו לבטוח.
> - אל תדחפו עבודה בתהליך ישר ל-`main` בפרויקט משותף. השתמשו בענף וב-PR.
> - במחשב אמיתי ה-push הראשון מבקש אימות (token, `gh auth login` או מפתח SSH). טרמינל התרגול מדלג על זה.
> - אם אתם רואים `! [rejected] ... (fetch first)`, משכו קודם את השינויים החדשים ואז עשו push שוב.

> **תורכם:** עקבו אחרי שלוש עשרה ההערות הממוספרות. הוסיפו את ה-remote בשם `origin` (`https://github.com/ada/recipe-book.git`) ופרסמו את `main` עם `git push -u origin main`. צרו את הענף `feature/add-soup` עם `git switch -c`, עשו commit לשורת המרק עם ההודעה `Add soup recipe`, פרסמו את הענף עם `git push -u origin feature/add-soup`, ואז בדקו את `git status` ואת `git branch -a`. לבסוף חזרו ל-`main`, מזגו את ענף הפיצ'ר, עשו push, מחקו את הענף המקומי עם `git branch -d feature/add-soup`, וסיימו עם `git branch -a` ו-`git log --oneline`.
