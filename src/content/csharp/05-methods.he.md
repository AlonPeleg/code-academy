---
title: "מתודות"
summary: "ארזו קוד במתודות לשימוש חוזר, עם פרמטרים וערכי החזרה."
hints:
  - "לכל מתודה יש סוג החזרה לפני השם שלה (int, string, bool). הפקודה return מוסרת ערך למי שקרא למתודה."
  - "Square: return n * n;   Greet: return $\"Hello, {name}!\";   IsEven: מספר הוא זוגי כש-number % 2 הוא 0, לכן השוו עם ==."
  - "return n * n;   return $\"Hello, {name}!\";   return number % 2 == 0;"
messages:
  - "ב-Square צריך להחזיר n * n."
  - "ב-IsEven צריך להשתמש באופרטור השארית, number % 2."
  - "ב-Greet צריך להשתמש בפרמטר name בתוך הטקסט."
quiz:
  - q: "מה משמעות המילה void לפני שם של מתודה?"
    options: ["המתודה ריקה", "המתודה לא מחזירה כלום", "המתודה פרטית", "המתודה מחזירה אפס"]
  - q: "איזו פקודה שולחת ערך בחזרה ממתודה?"
    options: ["send", "give", "yield break", "return"]
  - q: "ב-static int Add(int a, int b)  מה הם a ו-b?"
    options: ["פרמטרים, הקלטים של המתודה", "ערכי החזרה", "מחלקות", "הערות"]
  - q: "מה מדפיסה  Console.WriteLine(7 % 3);  ?"
    options: ["2", "1", "2.33", "0"]
    explain: "% נותן את השארית של החילוק. 7 חלקי 3 הם 2 ונשאר 1."
---

**מתודה** (method) היא בלוק קוד בעל שם שאפשר להריץ מתי שרוצים. עד עכשיו כל הקוד שלכם ישב בתוך `Main`. תוכניות אמיתיות מחלקות את העבודה למתודות קטנות, כך שלכל חלק יש תפקיד אחד, שם ברור, ואפשר להשתמש בו שוב.

## האנטומיה של מתודה

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

- `static` בינתיים פירושו רק "שייכת לתוכנית, לא צריך אובייקט". השאירו אותו במתודות שאתם קוראים להן מתוך `Main`.
- `int` הוא **סוג ההחזרה** (return type): סוג הערך שהמתודה מוסרת חזרה.
- `Add` הוא ה**שם**. השתמשו בפועל והתחילו באות גדולה.
- `(int a, int b)` הם ה**פרמטרים** (parameters): הקלטים, כל אחד עם טיפוס ושם.
- `return a + b;` שולח את התשובה חזרה ומסיים את המתודה.

**קוראים** למתודה על ידי כתיבת השם שלה עם הערכים (שנקראים **ארגומנטים**, arguments) בסוגריים:

```csharp
int total = Add(3, 4);
Console.WriteLine(total);      // 7
Console.WriteLine(Add(10, 5)); // 15
```

הערך של `Add(3, 4)` הוא מה שהיא מחזירה, ולכן אפשר לשמור אותו, להדפיס אותו, או אפילו להעביר אותו למתודה אחרת.

## מתודות void

אם מתודה עושה משהו אבל אין לה מה להחזיר, סוג ההחזרה שלה הוא `void` והיא לא צריכה `return`:

```csharp
static void SayHi(string name)
{
    Console.WriteLine($"Hi, {name}!");
}

SayHi("Noam");   // prints: Hi, Noam!
```

## החזרת טיפוסים שונים

מתודה יכולה להחזיר כל טיפוס:

```csharp
static string Shout(string text)
{
    return text.ToUpper() + "!";
}

static bool IsAdult(int age)
{
    return age >= 18;
}
```

ערכי `bool` מודפסים כ-`True` או `False` (עם אות גדולה) ב-C#.

## בשביל מה כל זה?

השוו בין כתיבת `n * n` עשר פעמים לכתיבת `Square(n)`. אם מצאתם באג, מתקנים אותו במקום אחד. גם השם `IsAdult(age)` נקרא טוב יותר מאשר `age >= 18` שפזור בכל הקוד.

> **שימו לב:**
> - שכחת `return` במתודה עם טיפוס שאינו void גורמת ל-`error CS0161: 'Program.Add(int, int)': not all code paths return a value`.
> - החזרת טיפוס שגוי, כמו `return "5";` ממתודת `int`, גורמת ל-`error CS0029: Cannot implicitly convert type 'string' to 'int'`.
> - קריאה עם מספר ארגומנטים שגוי: `Add(1)` גורמת ל-`error CS1501: No overload for method 'Add' takes 1 arguments`.
> - קריאה למתודה שאינה static מתוך `Main` שהיא static גורמת ל-`error CS0120: An object reference is required to access non-static member`. הוסיפו `static` למתודה.
> - כתיבת `Add(3, 4);` לבד וציפייה לראות 7. התוצאה נזרקת אלא אם שומרים אותה או מדפיסים אותה.

## להמשיך הלאה

כתבו מתודה `Max(int a, int b)` שמחזירה את הגדול מבין השניים בעזרת `if`. אחר כך קראו לה עם שלושה מספרים: `Max(Max(a, b), c)`.

> **תורכם:** השלימו את שלוש המתודות בקוד ההתחלה. `Square` מחזירה `n * n`, `Greet` מחזירה `Hello, NAME!`, ו-`IsEven` מחזירה אם המספר מתחלק ב-2 בלי שארית. את `Main` כבר כתבו עבורכם; רק תקנו את המתודות.
