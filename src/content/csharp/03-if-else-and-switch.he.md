---
title: "if, else ו-switch"
summary: "קבלו החלטות בקוד בעזרת if, else if, else ו-switch."
hints:
  - "התנאים נבדקים מלמעלה למטה, ורק הענף הראשון שהתנאי שלו נכון רץ. התחילו עם הציון הגבוה ביותר."
  - "כתבו if (score >= 90) { ... } else if (score >= 75) { ... } else if (score >= 50) { ... } else { ... }. עבור היום השתמשו ב-switch (day) עם case 1: ... break;"
  - "if (score >= 90) Console.WriteLine(\"A\"); else if (score >= 75) Console.WriteLine(\"B\"); else if (score >= 50) Console.WriteLine(\"C\"); else Console.WriteLine(\"F\");   ואז   switch (day) { case 1: Console.WriteLine(\"Monday\"); break; case 2: Console.WriteLine(\"Tuesday\"); break; case 3: Console.WriteLine(\"Wednesday\"); break; default: Console.WriteLine(\"Other\"); break; }"
messages:
  - "השתמשו בפקודת if עבור הציון."
  - "השתמשו ב-else / else if עבור שאר הציונים."
  - "השתמשו בפקודת switch עבור היום."
quiz:
  - q: "מה ההבדל בין = ל-== ?"
    options: ["= משווה בין שני ערכים, == מבצע השמה", "= מבצע השמה של ערך, == משווה בין שני ערכים", "הם אותו דבר", "== משמש רק לטקסט"]
  - q: "מה משמעות  a && b  ?"
    options: ["a או b", "לא a", "a וגם b שניהם נכונים", "a גדול מ-b"]
  - q: "ב-switch, מה עושה \"default:\"?"
    options: ["הוא רץ כשאף case לא התאים", "הוא רץ ראשון, לפני כל ה-case", "הוא רץ בכל פעם", "הוא עוצר את התוכנית"]
  - q: "כש-int x = 5;  לאיזה ערך מחושב  if (x > 3 || x < 0)  ?"
    options: ["false", "זו שגיאה", "תלוי במחשב", "true"]
    explain: "|| פירושו 'או'. מספיק שצד אחד יהיה נכון, ו-x > 3 נכון."
---

תוכניות נעשות מעניינות כשהן יכולות לבחור מה לעשות. בשיעור הזה תשתמשו ב-`if`, ב-`else if` וב-`else` כדי לבחור מסלול אחד, וב-`switch` כדי לבחור בין הרבה ערכים קבועים.

## תנאים ו-bool

**תנאי** (condition) הוא דבר שהוא `true` או `false` (מסוג `bool`). יוצרים אותו בעזרת השוואה:

| אופרטור | משמעות |
| --- | --- |
| `==` | שווה ל |
| `!=` | לא שווה ל |
| `<` `>` | קטן מ, גדול מ |
| `<=` `>=` | קטן או שווה, גדול או שווה |

אפשר לשלב תנאים: `&&` פירושו **וגם**, `||` פירושו **או**, ו-`!` פירושו **לא**.

```csharp
int age = 17;
bool canVote = age >= 18;              // false
bool isTeen = age >= 13 && age <= 19;  // true
```

## if, else if, else

```csharp
int temperature = 25;

if (temperature > 30)
{
    Console.WriteLine("Hot");
}
else if (temperature > 20)
{
    Console.WriteLine("Nice");
}
else
{
    Console.WriteLine("Cold");
}
// prints: Nice
```

C# בודקת את התנאים **מלמעלה למטה** ומריצה רק את הבלוק הראשון שהתנאי שלו נכון. כל מה שאחריו מדולג. לכן הסדר חשוב: אם הייתם בודקים קודם `temperature > 20`, טמפרטורה של 35 הייתה מדפיסה "Nice" במקום "Hot".

לבלוק `else` אין תנאי. הוא ברירת המחדל כשום דבר מלמעלה לא התאים. אפשר שיהיה `if` לבדו, או `if` עם `else` בלבד.

## switch

כשמשווים משתנה אחד מול כמה ערכים מדויקים, `switch` מסודר יותר:

```csharp
string color = "red";

switch (color)
{
    case "red":
        Console.WriteLine("Stop");
        break;
    case "green":
        Console.WriteLine("Go");
        break;
    default:
        Console.WriteLine("Unknown");
        break;
}
// prints: Stop
```

- `switch (color)` אומר על איזה ערך להסתכל.
- כל `case` הוא ערך אפשרי אחד, ואחריו נקודתיים.
- `break;` מסיים את ה-case. ב-C# כל case חייב להסתיים ב-`break` (או ב-`return`); אי אפשר "ליפול" בטעות אל הבא אחריו.
- `default:` רץ כשאף case לא התאים.

שני case יכולים לחלוק קוד אם מניחים אותם אחד אחרי השני: `case 6: case 7: Console.WriteLine("Weekend"); break;`.

> **שימו לב:**
> - שימוש ב-`=` במקום ב-`==` בתנאי: `if (x = 5)` גורם ל-`error CS0029: Cannot implicitly convert type 'int' to 'bool'`.
> - שכחת `break;` בסוף case גורמת ל-`error CS0163: Control cannot fall through from one case label` (או `CS8070` עבור ה-case האחרון).
> - נקודה-פסיק מיד אחרי התנאי, `if (x > 3);`, גורמת ל-`if` לא לעשות כלום. הבלוק שאחריו רץ אז תמיד.
> - בדיקת התנאים בסדר הלא נכון, כך שבדיקה רחבה (`score >= 50`) מסתירה בדיקה צרה יותר (`score >= 90`).

## להמשיך הלאה

שנו את `score` ל-`95`, ל-`80` ול-`20` ובדקו שאתם מקבלים `A`, `B` ו-`F`. אחר כך הוסיפו `case 4:` ליום חמישי.

> **תורכם:** הדפיסו את אות הציון של `score` בעזרת `if` / `else if` / `else`, ואז הדפיסו את שם היום `day` בעזרת `switch`. עם ערכי ההתחלה הפלט הוא `C` ואחריו `Wednesday`.
