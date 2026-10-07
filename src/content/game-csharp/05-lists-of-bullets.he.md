---
title: "רשימות של אובייקטים במשחק"
summary: "שומרים הרבה כדורים ב-List<T>, מעדכנים אותם עם foreach ומנקים את אלה שכבר לא נחוצים עם RemoveAll."
hints:
  - "List<Bullet> גדלה עם Add, אפשר לעבור עליה עם foreach, ויש לה מתודה שמוחקת כל פריט שמתאים לכלל. ירו רק כשהמקש נלחץ (PRESSED) ולא כשהוא מוחזק."
  - "ירייה: if (Engine.KeyPressed(Key.Space)) { bullets.Add(new Bullet(shipX + 8, 200)); fired++; }. עדכון: foreach (Bullet b in bullets) b.Update();. ניקוי: bullets.RemoveAll( ... ) עם lambda שקוראת ל-IsOffScreen()."
  - "bullets.RemoveAll(bullet => bullet.IsOffScreen());   שימו את עדכון ה-foreach לפני השורה הזאת, ולעולם אל תמחקו מהרשימה בתוך ה-foreach עצמו."
messages:
  - "השתמשו בלולאת foreach כדי לעדכן כל כדור."
  - "השתמשו ב-bullets.RemoveAll(...) כדי למחוק את הכדורים שיצאו מהמסך."
  - "ירו עם Engine.KeyPressed(Key.Space) כדי שמקש מוחזק יירה פעם אחת בלבד."
quiz:
  - q: "איזו שורה יוצרת רשימה ריקה שיכולה להכיל אובייקטים מסוג Bullet?"
    options: ["Bullet[] bullets = List();", "List<Bullet> bullets = new List<Bullet>();", "list bullets = [];", "new Bullet = List<bullets>;"]
  - q: "מה מחזיר bullets.Count?"
    options: ["את מספר הפריטים שנמצאים כרגע ברשימה", "את המספר הכולל של הכדורים שנורו אי פעם", "את האינדקס של הכדור האחרון", "את הגודל של כדור אחד בפיקסלים"]
  - q: "מה קורה אם קוראים ל-bullets.Remove(...) בתוך foreach על אותה רשימה?"
    options: ["זה עובד מצוין", "הרשימה מתרוקנת", "הלולאה רצה מהר פי שניים", "נזרקת InvalidOperationException: Collection was modified"]
    explain: "אסור לשנות רשימה בזמן ש-foreach עובר עליה. השתמשו ב-RemoveAll אחרי הלולאה."
  - q: "ב-bullets.RemoveAll(bullet => bullet.IsOffScreen()), מהו  bullet => ...  ?"
    options: ["השוואה שבודקת אם שני כדורים שווים", "מחלקה חדשה בשם bullet", "lambda: פונקציה זעירה שרצה פעם אחת על כל פריט; פריטים שהיא מחזירה עבורם true נמחקים", "הצבה"]
---
כדור אחד קל: שלושה משתנים. אבל ספינה יכולה לירות עשרות כדורים, ואתם לא יודעים מראש כמה. אתם צריכים **אוסף** (collection) שגדל ומתכווץ בזמן שהמשחק רץ. ב-C# הכלי המרכזי לכך הוא `List<T>`, ובעזרתו כמעט כל משחק ב-Unity עוקב אחרי כדורים, אויבים, חלקיקים ופריטים לאיסוף.

## List<T>

`List<T>` היא רשימה בגודל משתנה של פריטים מאותו סוג `T`. ה-`T` בסוגריים המשולשים הוא סוג הפריטים. רשימה של כדורים היא `List<Bullet>`. צריך `using System.Collections.Generic;` בראש הקובץ.

```csharp
List<int> scores = new List<int>();   // an empty list
scores.Add(10);
scores.Add(25);
Console.WriteLine(scores.Count);      // prints: 2
Console.WriteLine(scores[1]);         // prints: 25  (the first item is index 0)
```

החברים הנפוצים הם `Add(item)`, ‏`Remove(item)`, ‏`Clear()`, ‏`Count` (תכונה, בלי סוגריים) והאינדקס `list[i]`.

## foreach: עושים משהו עם כל פריט

```csharp
foreach (Bullet b in bullets)
{
    b.Update();
}
```

קראו את זה כך: "לכל Bullet, שאקרא לו `b`, בתוך `bullets`: הריצו את הגוף". המשתנה `b` הוא כדור אחר בכל סיבוב. זו הדרך הנקייה לעדכן ולצייר כל אובייקט.

## יצירה בלחיצה על מקש

יוצרים את הכדור עם `new` ומכניסים אותו לרשימה. משתמשים ב-`KeyPressed` כדי שמקש מוחזק יירה פעם אחת ולא 30 פעמים בשנייה:

```csharp
if (Engine.KeyPressed(Key.Space))
{
    bullets.Add(new Bullet(shipX + 8, 200));
}
```

## ניקוי עם RemoveAll

אם הכדורים לא היו נמחקים, הרשימה הייתה גדלה בלי סוף והמשחק היה מאט. ברגע שכדור נמצא מעל קצה המסך הוא כבר לא יכול להשפיע על שום דבר, ולכן מוחקים אותו. `RemoveAll` מקבלת **lambda**, פונקציה אנונימית זעירה שנכתבת `parameter => condition`. הרשימה קוראת לה פעם אחת לכל פריט ומוחקת כל פריט שהיא עונה עבורו `true`:

```csharp
bullets.RemoveAll(bullet => bullet.IsOffScreen());
```

היא גם **מחזירה** כמה פריטים נמחקו, וזה יהיה שימושי בשיעור הבא.

> **שימו לב:**
> - שינוי רשימה בתוך ה-foreach שלה (`bullets.Remove(b);`) קורס עם `InvalidOperationException: Collection was modified; enumeration operation may not execute.` אספו קודם, ואז קראו ל-`RemoveAll` אחרי הלולאה.
> - אם שוכחים `using System.Collections.Generic;` מקבלים `error CS0246: The type or namespace name 'List<>' could not be found`.
> - בקשת אינדקס שלא קיים (`bullets[5]` ברשימה של 2) זורקת `ArgumentOutOfRangeException`. בדקו קודם את `bullets.Count`.
> - שימוש ב-`Length` כמו במערכים: `bullets.Length` נותן `error CS1061`. ברשימות משתמשים ב-`Count`.
> - שימוש ב-`KeyDown` לירי: מקש שמוחזק חצי שנייה יורה 15 כדורים בבת אחת.

## איך המספרים מסתדרים

כדור מתחיל ב-`Y = 200` ועף למעלה 6 פיקסלים בכל פריים. הוא גבוה 10 פיקסלים, ולכן הוא נעלם לגמרי כש-`Y + 10 < 0`, וזה לוקח 36 פריימים. כדור שנורה בפריים 40 נמחק בפריים 75, ומספר הכדורים הסופי על המסך הוא אלה שנורו ב-35 הפריימים האחרונים. תסריט הקלט יורה חמישה כדורים, ואחד מהם מגיע ממקש שמוחזק 15 פריימים, אבל רק הפריים הראשון של ההחזקה נחשב ללחיצה.

## להמשיך הלאה

הפכו את הכדורים למהירים או איטיים יותר וראו איך `on screen` משתנה. אחר כך נסו רשימה שנייה, למשל `List<Bullet> enemyBullets`, שנעה כלפי מטה.

> **תורכם:** ירו `new Bullet(shipX + 8, 200)` לתוך הרשימה בכל פעם שנלחץ Space, עדכנו את כל הכדורים עם `foreach`, וקראו ל-`bullets.RemoveAll(...)` כדי להסיר את אלה שמחוץ למסך. התוצאה צריכה להיות `fired: 5` ו-`on screen: 2`.
