---
title: "מתודות מחרוזת ועיצוב"
summary: "נקו, חפשו ועצבו טקסט בעזרת המתודות המובנות של מחרוזות."
hints:
  - "למחרוזות יש מתודות שקוראים להן עם נקודה, כמו text.Trim(). מחרוזות לעולם לא משתנות במקום, לכן שמרו את התוצאה במשתנה חדש."
  - "string trimmed = text.Trim();   ואז השתמשו ב-trimmed.ToUpper(), ב-trimmed.Length (בלי סוגריים) וב-trimmed.Replace(\"world\", \"there\"). עבור המחיר הניחו :F2 אחרי שם המשתנה בתוך הסוגריים המסולסלים."
  - "string trimmed = text.Trim();   ואז הדפיסו את {trimmed}, את {trimmed.ToUpper()} ואת {trimmed.Length} בתוך מחרוזות עם אינטרפולציה;   string replaced = trimmed.Replace(\"world\", \"there\");   ועבור המחיר השתמשו ב-$\"Price: ${price:F2}\""
messages:
  - "השתמשו במתודה Trim()."
  - "השתמשו במתודה ToUpper()."
  - "השתמשו במתודה Replace."
  - "עצבו את המחיר עם :F2 בתוך הסוגריים המסולסלים."
quiz:
  - q: "מה מחזירה  \"abc\".ToUpper()  ?"
    options: ["\"abc\" (המחרוזת המקורית משתנה)", "\"Abc\"", "שגיאה", "\"ABC\""]
  - q: "איך מקבלים את מספר התווים במחרוזת s?"
    options: ["s.Length", "s.Count()", "s.Size", "length(s)"]
  - q: "מה נותנת  \"a-b-c\".Split('-')  ?"
    options: ["הטקסט \"abc\"", "המספר 3", "מערך עם \"a\", \"b\" ו-\"c\"", "מחרוזת אחת עם רווחים"]
  - q: "מה מפיק  $\"{3.14159:F2}\"  ?"
    options: ["3", "3.14159", "3.1", "3.14"]
    explain: "F2 פירושו נקודה קבועה עם 2 ספרות אחרי הנקודה העשרונית, ולכן הערך מעוגל ל-3.14."
---

טקסט נמצא בכל מקום בתוכניות: שמות, הודעות, תוכן של קבצים. ל-`string` ב-C# יש הרבה **מתודות** מוכנות (פעולות שקוראים להן עם נקודה) לניקוי, לחיפוש ולעיצוב שלה. בשיעור הזה תלמדו את אלה שתשתמשו בהן הכי הרבה.

## קריאה למתודות על מחרוזת

```csharp
string s = "  Code Academy  ";
Console.WriteLine(s.Trim());      // "Code Academy"  (spaces removed from both ends)
Console.WriteLine(s.ToUpper());   // "  CODE ACADEMY  "
Console.WriteLine(s.ToLower());   // "  code academy  "
Console.WriteLine(s.Length);      // 16  (property, no parentheses)
```

העובדה החשובה ביותר: **מחרוזות הן immutable** (בלתי ניתנות לשינוי), כלומר מתודה אף פעם לא משנה את המקור. היא נותנת לכם מחרוזת **חדשה**. אם רוצים לשמור את התוצאה, שומרים אותה:

```csharp
s = s.Trim();            // now s itself holds the trimmed text
```

## חיפוש וחיתוך

```csharp
string word = "banana";
Console.WriteLine(word.Contains("nan"));       // True
Console.WriteLine(word.StartsWith("ba"));      // True
Console.WriteLine(word.IndexOf("n"));          // 2  (position of the first match, -1 if none)
Console.WriteLine(word.Substring(1, 3));       // "ana"  (start at 1, take 3 characters)
Console.WriteLine(word.Replace("a", "o"));     // "bonono"
Console.WriteLine(word[0]);                    // b  (a single char; first position is 0)
```

## Split ו-Join

`Split` חותכת מחרוזת למערך של חלקים, ו-`string.Join` מדביקה חלקים חזרה יחד:

```csharp
string line = "red,green,blue";
string[] colors = line.Split(',');
Console.WriteLine(colors.Length);              // 3
Console.WriteLine(colors[1]);                  // green
Console.WriteLine(string.Join(" | ", colors)); // red | green | blue
```

## עיצוב מספרים בתוך מחרוזות

בתוך מחרוזת עם אינטרפולציה אפשר להוסיף **פורמט** אחרי נקודתיים:

```csharp
double price = 4.5;
int n = 42;
Console.WriteLine($"{price:F2}");      // 4.50   (2 decimals)
Console.WriteLine($"{n,5}");           // "   42" (right-aligned in 5 characters)
Console.WriteLine($"{n,-5}|");         // "42   |" (left-aligned)
Console.WriteLine($"Cost: ${price:F2}"); // Cost: $4.50
```

`F2` פירושו "נקודה קבועה, 2 ספרות אחרי הנקודה". סימן `$` שנמצא מחוץ לסוגריים המסולסלים הוא סתם סימן דולר רגיל. אפשר גם לקרוא למתודות בתוך הסוגריים: `{name.ToUpper()}`.

אם אתם צריכים מרכאה כפולה בתוך מחרוזת, כתבו לפניה קו נטוי הפוך: `"She said \"hi\""`. כשקריאה למתודה צריכה מרכאות משלה, כמו `Replace("world", "there")`, ברור יותר לשמור קודם את התוצאה במשתנה ולהדפיס את המשתנה.

> **שימו לב:**
> - כתיבה של `s.Trim();` לבד לא עושה שום דבר שימושי, כי המחרוזת החדשה נזרקת. כתבו `s = s.Trim();` או שמרו אותה במשתנה אחר.
> - `s.Length()` גורמת ל-`error CS1955: Non-invocable member 'string.Length' cannot be used like a method`. ל-Length אין סוגריים.
> - `Substring` עם טווח ארוך מדי קורסת עם `ArgumentOutOfRangeException`. במילה של 6 אותיות, `Substring(4, 5)` ארוכה מדי.
> - השוואה עם `==` רגישה לאותיות גדולות וקטנות: `"Hi" == "hi"` היא `false`. השתמשו ב-`a.ToLower() == b.ToLower()` לבדיקה שאינה רגישה לגודל האותיות.
> - גרשיים בודדים יוצרים `char`, מרכאות כפולות יוצרות `string`. `'ab'` היא שגיאה.

> **תורכם:** לפי ההערות, צרו את `trimmed` עם `Trim()`, ואז הדפיסו את הגרסה באותיות גדולות שלה, את האורך שלה, גרסה שבה `world` הוחלפה ב-`there`, ואת המחיר מעוצב עם `F2`.
