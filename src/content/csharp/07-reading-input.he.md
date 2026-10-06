---
title: "קריאת קלט"
summary: "קראו שורות טקסט מהמשתמש עם Console.ReadLine והפכו אותן למספרים."
hints:
  - "Console.ReadLine() ממתינה לשורת קלט אחת ומחזירה אותה כ-string. קראו לה שלוש פעמים, פעם לכל שורה."
  - "טקסט עדיין אינו מספר. עטפו את השורה ב-int.Parse(...) כדי להפוך את \"7\" ל-7:  int a = int.Parse(Console.ReadLine());"
  - "string name = Console.ReadLine();  int a = int.Parse(Console.ReadLine());  int b = int.Parse(Console.ReadLine());  ואז הדפיסו $\"Hello, {name}!\", $\"{a} + {b} = {a + b}\" ו-$\"Product: {a * b}\"."
messages:
  - "קראו את הקלט עם Console.ReadLine()."
  - "המירו את הטקסט למספר עם int.Parse."
quiz:
  - q: "איזה טיפוס Console.ReadLine() מחזירה?"
    options: ["int", "char", "string", "double"]
  - q: "איך הופכים את הטקסט \"42\" למספר 42?"
    options: ["int.Parse(\"42\")", "string(42)", "\"42\".ToNumber", "(int) \"42\""]
  - q: "מה Console.ReadLine() מחזירה כשאין יותר קלט?"
    options: ["מחרוזת ריקה", "המספר 0", "null", "היא מדפיסה שגיאה וממשיכה"]
    explain: "בסוף הקלט ReadLine מחזירה null, וכך אפשר לזהות שלא נשאר דבר."
  - q: "מה קורה עם int.Parse(\"abc\")?"
    options: ["היא מחזירה 0", "היא זורקת FormatException", "היא מחזירה -1", "היא מחזירה את הטקסט ללא שינוי"]
---

עד עכשיו כל ערך בתוכניות שלכם נכתב בתוך הקוד. תוכניות אמיתיות שואלות שאלות ומגיבות לתשובות. השיעור הזה מראה איך לקרוא את מה שהמשתמש מקליד, ואיך להפוך טקסט למספרים שאפשר לחשב איתם.

## Console.ReadLine

`Console.ReadLine()` עוצרת את התוכנית, ממתינה לשורת קלט אחת, ומחזירה את השורה הזו כ-**string**:

```csharp
Console.WriteLine("What is your name?");
string name = Console.ReadLine();
Console.WriteLine($"Nice to meet you, {name}!");
```

כאן באתר אין מקלדת להקליד עליה בזמן שהתוכנית רצה. במקום זה, תיבת **Input** שמתחת לעורך מחזיקה את השורות שהתוכנית תקרא. כל קריאה ל-`ReadLine()` לוקחת את השורה הבאה מהתיבה. בשיעור הזה היא מכילה:

```text
Maya
7
5
```

כך ש-`ReadLine()` הראשונה מחזירה `"Maya"`, השנייה `"7"` והשלישית `"5"`. שנו את תיבת Input והריצו שוב כדי לנסות ערכים אחרים.

## טקסט אינו מספר

כל מה שמגיע מ-`ReadLine` הוא טקסט. המחרוזת `"7"` והמספר `7` הם דברים שונים, ו-`"7" + "5"` הוא `"75"`, לא 12. כדי לחשב, ממירים קודם:

```csharp
int a = int.Parse("7");           // the number 7
double d = double.Parse("2.5");   // the number 2.5
```

בדרך כלל משלבים את שני השלבים בשורה אחת:

```csharp
int age = int.Parse(Console.ReadLine());
Console.WriteLine($"Next year you will be {age + 1}");
```

עבדו מבפנים החוצה: `Console.ReadLine()` רצה ראשונה ומחזירה טקסט, ואז `int.Parse(...)` הופכת את הטקסט הזה ל-`int`.

## כשאין קלט

אם הקלט נגמר, `ReadLine()` מחזירה `null` (שפירושו "כלום"). אפשר להשתמש בזה כדי לקרוא רשימה שלמה של שורות:

```csharp
string line = Console.ReadLine();
while (line != null)
{
    Console.WriteLine("Got: " + line);
    line = Console.ReadLine();
}
```

## המרה בטוחה יותר

`int.TryParse` לא קורסת על קלט שגוי. היא מחזירה `true` או `false` ומוסרת את המספר דרך `out`:

```csharp
int number;
if (int.TryParse("abc", out number))
{
    Console.WriteLine(number);
}
else
{
    Console.WriteLine("Not a number");
}
```

> **שימו לב:**
> - `int.Parse("abc")` קורסת עם `System.FormatException: Input string was not in a correct format.` אותו דבר קורה עם שורה ריקה או עם טקסט כמו `3.5` שמומר ל-`int`.
> - אם בתיבת Input יש פחות שורות ממה שהתוכנית שלכם קוראת, `ReadLine()` מחזירה `null`, ו-`int.Parse(null)` קורסת עם `ArgumentNullException`.
> - ניסיון לכתוב `int a = Console.ReadLine();` גורם ל-`error CS0029: Cannot implicitly convert type 'string' to 'int'`.
> - קריאת שורות בסדר שונה מזה שבו הן מופיעות בתיבת Input מבלבלת בין הערכים (שם מגיע למקום שבו ציפיתם למספר).

> **תורכם:** קראו את השם ואת שני המספרים מהקלט, ואז הדפיסו `Hello, Maya!`, `7 + 5 = 12` ו-`Product: 35`, כשאתם מחשבים את הערכים מתוך המשתנים.
