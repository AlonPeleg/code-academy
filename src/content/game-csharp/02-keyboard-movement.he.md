---
title: "קלט מהמקלדת ותנועה"
summary: "קראו את מקשי החצים באמצעות Engine.KeyDown והזיזו ריבוע במהירות קבועה בכל פריים."
hints:
  - "לכל מקש דרוש משפט if משלו, בדיוק כמו זה של Right שכבר כתוב. תנועה שמאלה פירושה חיסור של Speed. כדי לספור ירייה פעם אחת בלבד בכל לחיצה צריך קריאה אחרת למנוע, לא זו שאומרת שמקש מוחזק."
  - "הוסיפו: if (Engine.KeyDown(Key.Left)) x -= Speed; ושורות דומות עבור Key.Up (y -= Speed) ועבור Key.Down (y += Speed). עבור הירי השתמשו ב-if (Engine.KeyPressed(Key.Space)) ובתוכו shots++."
  - "if (Engine.KeyDown(Key.Left)) x -= Speed;  if (Engine.KeyDown(Key.Up)) y -= Speed;  if (Engine.KeyDown(Key.Down)) y += Speed;  if (Engine.KeyPressed(Key.Space)) shots++;"
quiz:
  - q: "מה ההבדל בין Engine.KeyDown לבין Engine.KeyPressed?"
    options: ["אין הבדל", "KeyDown מחזירה true כל עוד המקש מוחזק; KeyPressed מחזירה true רק בפריים שבו המקש נלחץ", "KeyPressed מחזירה true כל עוד המקש מוחזק; KeyDown רק לפריים אחד", "KeyDown עובדת עבור אותיות, ו-KeyPressed עבור חיצים"]
  - q: "לריבוע יש מהירות 4 בכל פריים. מקש הימין מוחזק במשך 30 פריימים. כמה רחוק הוא נע?"
    options: ["4 פיקסלים", "30 פיקסלים", "34 פיקסלים", "120 פיקסלים"]
    explain: "מהירות בכל פריים כפול מספר הפריימים: 4 x 30 = 120."
  - q: "כדי לזוז למעלה במסך, מה צריך לעשות ל-y?"
    options: ["לחסר ממנו", "להוסיף לו", "להציב בו 0", "להכפיל אותו ב-2"]
    explain: "הערך של y גדל כלפי מטה, ולכן תנועה למעלה פירושה הקטנה של y."
  - q: "מה עושה x -= 4;?"
    options: ["מציב ב-x את הערך מינוס 4", "משווה את x ל-4", "מחסר 4 מ-x ושומר את התוצאה בחזרה ב-x", "מוסיף 4 ל-x"]
messages:
  - "טפלו ב-Key.Left."
  - "ספרו ירי באמצעות Engine.KeyPressed(Key.Space)."
---
משחקים הם אינטראקטיביים כי הם **מקשיבים לשחקן**. בשיעור הזה תקראו את המקלדת בכל פריים (frame) ותהפכו לחיצות על מקשים לתנועה, שהיא הלב של כמעט כל משחק אקשן.

## לשאול את המנוע על מקשים

למנוע יש שתי שאלות שאפשר לשאול על מקש, ושתיהן נשאלות בתוך הלולאה:

```csharp
if (Engine.KeyDown(Key.Right))
{
    x += 4;   // runs on EVERY frame while Right is held
}

if (Engine.KeyPressed(Key.Space))
{
    shots++;  // runs on ONE frame: the frame the key goes down
}
```

- `Engine.KeyDown(Key.Right)` מחזירה ערך `bool` (‏`true` או `false`). הערך הוא `true` כל עוד המקש מוחזק. השתמשו בה עבור **תנועה**.
- `Engine.KeyPressed(Key.Space)` מחזירה `true` רק בפריים הראשון של הלחיצה. השתמשו בה עבור **פעולות חד-פעמיות** כמו ירי, קפיצה או פתיחת תפריט.
- `Key.Right` הוא איבר של **enum** (טיפוס מנוי): רשימה קבועה של שמות. השמות הזמינים הם `Left`, `Right`, `Up`, `Down`, `Space`, `A`, `D`, `W`, `S`, `Z`, `X` ו-`Enter`.

## מהירות בכל פריים

מכיוון שהלולאה רצה 30 פעמים בשנייה, "תנועה" פירושה פשוט שינוי קטן של המיקום בכל פריים. אם `Speed` שווה ל-4, החזקת מקש במשך 30 פריימים (שנייה אחת) מזיזה את הריבוע 4 x 30 = 120 פיקסלים. ב-30 פריימים לשנייה, `Speed = 4` הם 120 פיקסלים לשנייה.

נהוג לתת למספר שם במקום לחזור על `4` בכל מקום:

```csharp
const int Speed = 4;   // a constant: can never change
```

עכשיו, כדי שהריבוע יהיה מהיר יותר, עורכים שורה אחת בלבד. המילה `const` גורמת למהדר (compiler) לעצור אתכם אם תנסו לשנות את הערך בטעות.

## לקרוא את התסריט

לשונית קלט השחקן (Player input) היא ה"מקלדת" של ההקלטה הזו:

```
10 right down    // at frame 10 the player starts holding right
40 right up      // at frame 40 they let go
```

כלומר מקש הימין לחוץ בפריימים 10, 11, ..., 39, שהם **30 פריימים**. ערכו את המספרים ולחצו על Run כדי לראות את הריבוע עובר מרחק אחר.

## כמה מקשים בבת אחת

השתמשו במשפט `if` נפרד (ולא `else if`) לכל מקש. כך השחקן יכול להחזיק גם Right וגם Up ולזוז באלכסון, כי שני משפטי ה-`if` רצים באותו פריים:

```csharp
if (Engine.KeyDown(Key.Right)) x += Speed;
if (Engine.KeyDown(Key.Up))    y -= Speed;
```

> **שימו לב:**
> - תנועה למעלה היא `y -= Speed` ולא `y += Speed`: הערך של y גדל מראש המסך כלפי מטה.
> - שימוש ב-`KeyDown` לירי גורם לירייה בכל פריים שבו המקש מוחזק. עבור אירוע חד-פעמי השתמשו ב-`KeyPressed`.
> - הכתיבה `Engine.KeyDown(Left)` גורמת ל-`error CS0103: The name 'Left' does not exist in the current context`. צריך לכתוב `Key.Left`.
> - הכתיבה `if (Engine.KeyDown(Key.Left)) x =- Speed;` מציבה ב-x את Speed בערך שלילי. האופרטור הוא `-=` (קודם מינוס ואחריו שווה).
> - השמה לקבוע: `Speed = 5;` גורמת ל-`error CS0131: The left-hand side of an assignment must be a variable`.

## להתקדם הלאה

בלשונית הקלט, גרמו לשחקן להחזיק את `Key.Right` ואת `Key.Down` בו-זמנית וצפו באלכסון. לאחר מכן נסו להוסיף האצה: הפכו את `Speed` למשתנה (variable) רגיל מסוג `int` ששווה ל-8 כל עוד `Key.Z` מוחזק, ול-4 אחרת.

> **תורכם:** הוסיפו משפטי `if` עבור Left, Up ו-Down (Left מחסר מ-`x`, Up מחסר מ-`y`, ו-Down מוסיף ל-`y`), וספרו ירי באמצעות `Engine.KeyPressed(Key.Space)`. השחקן מסיים ב-`x = 140, y = 60` עם `2` יריות.
