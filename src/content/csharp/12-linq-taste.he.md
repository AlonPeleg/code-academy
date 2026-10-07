---
title: "טעימה מ-LINQ"
summary: "מסננים, ממירים ומסכמים אוספים בעזרת Where, Select ו-Sum."
hints:
  - "מתודות LINQ עובדות על אוסף שלם בבת אחת. Where משאירה את הפריטים שעוברים בדיקה, Select משנה כל פריט, Sum מחברת אותם. כל אחת מקבלת למדה (lambda) קטנה כמו n => n % 2 == 0."
  - "numbers.Where(n => n % 2 == 0) נותנת את הזוגיים. שרשרו .Select(n => n * n) בסוף כדי להעלות אותם בריבוע. string.Join(\", \", ...) הופכת סדרה לטקסט. numbers.Sum() ו-numbers.Where(n => n > 5).Count() עושות את השאר."
  - "var evens = numbers.Where(n => n % 2 == 0);  Console.WriteLine(\"Evens: \" + string.Join(\", \", evens));  var squares = evens.Select(n => n * n);  Console.WriteLine(\"Squares: \" + string.Join(\", \", squares));  Console.WriteLine($\"Sum of all: {numbers.Sum()}\");  Console.WriteLine($\"Bigger than 5: {numbers.Where(n => n > 5).Count()}\");"
messages:
  - "השתמשו ב-Where כדי לסנן."
  - "השתמשו ב-Select כדי להמיר כל פריט."
  - "השתמשו ב-Sum כדי לחבר את המספרים."
quiz:
  - q: "מה Where עושה?"
    options: ["משנה כל פריט", "מחברת את הפריטים", "ממיינת את הפריטים", "משאירה רק את הפריטים שעוברים בדיקה"]
  - q: "מה  numbers.Select(n => n * 2)  מחזירה עבור { 1, 2, 3 }?"
    options: ["הסדרה 2, 4, 6", "הסדרה 1, 2, 3", "המספר 6", "רק את המספרים הגדולים מ-2"]
  - q: "איך קוראים ל-  n => n > 5  ?"
    options: ["מחלקה", "לולאה", "ביטוי למדה (lambda), מתודה זעירה בתוך הקוד", "מרחב שמות (namespace)"]
  - q: "איזו שורת using צריך כדי להשתמש ב-Where, ב-Select וב-Sum?"
    options: ["using System.Text;", "using System.Linq;", "using System.IO;", "using System.Math;"]
---

לעיתים קרובות יש לכם אוסף (collection) ואתם רוצים לשאול עליו שאלה: "אילו מהם זוגיים?", "מה הסכום?", "תנו לי כל שם באותיות גדולות". אפשר לכתוב לולאת `foreach` לכל אחת מהן, או להשתמש ב-**LINQ** (נהגה "לינק"), קבוצה של מתודות מוכנות שאומרות מה אתם רוצים בשורה קצרה אחת.

## הגדרה

LINQ נמצאת במרחב שמות (namespace) שחייבים לייבא:

```csharp
using System.Linq;
```

אחרי זה, רשימות, מערכים ואוספים אחרים מקבלים מתודות נוספות כמו `Where`, `Select`, `Sum`, `Count`, `Max`, `Min` ו-`OrderBy`.

## למדות: מתודות זעירות

רוב מתודות LINQ מקבלות בדיקה או חישוב קטן שנכתבים כ**ביטוי למדה** (lambda expression):

```csharp
n => n * n
```

קראו את החץ `=>` כ"הולך ל-": "n הולך ל-n כפול n". השם שלפני החץ הוא הפרמטר (כל שם שתרצו), ומה שאחריו הוא התוצאה. למדה היא מתודה זעירה בלי שם.

## Where, Select, Sum

```csharp
List<int> nums = new List<int> { 1, 2, 3, 4, 5 };

var big = nums.Where(n => n > 2);      // 3, 4, 5      (filter: keep items that pass)
var doubled = nums.Select(n => n * 2); // 2, 4, 6, 8, 10 (transform: change every item)
int total = nums.Sum();                // 15           (add them up)
int biggest = nums.Max();              // 5
int howMany = nums.Where(n => n > 2).Count();   // 3
```

- **Where** עונה על "אילו?": הלמדה מחזירה `true` או `false` לכל פריט.
- **Select** עונה על "מה אני מקבל מכל אחד?": הלמדה מחזירה את הערך החדש.
- **Sum, Max, Min, Count, Average** מצמצמות הכול למספר אחד.

## שרשור

כל מתודה מחזירה סדרה, ולכן אפשר לשרשר אותן משמאל לימין כמו קו ייצור:

```csharp
int result = nums.Where(n => n % 2 == 1)   // 1, 3, 5
                 .Select(n => n * 10)      // 10, 30, 50
                 .Sum();                   // 90
```

## הדפסת סדרה

`Console.WriteLine(big)` לא הייתה מדפיסה את המספרים. הפכו קודם את הסדרה לטקסט בעזרת `string.Join`:

```csharp
Console.WriteLine(string.Join(", ", big));   // 3, 4, 5
```

אפשר גם לעבור עליה בלולאה: `foreach (int n in big) { ... }`. הרשימה המקורית אף פעם לא משתנה; LINQ תמיד נותנת לכם תוצאה חדשה.

## גם מחרוזות עובדות

```csharp
List<string> names = new List<string> { "ava", "noam", "maya" };
var upper = names.Select(s => s.ToUpper());
Console.WriteLine(string.Join(" ", upper));   // AVA NOAM MAYA
```

> **שימו לב:**
> - אם שוכחים `using System.Linq;` מקבלים `error CS1061: 'List<int>' does not contain a definition for 'Where'`.
> - הדפסה ישירה של סדרה מציגה שם של טיפוס (משהו כמו System.Linq.Enumerable והמילה Iterator) במקום הערכים. השתמשו ב-`string.Join`.
> - `Sum()` ו-`Max()` על רשימה ריקה: `Sum()` היא 0, אבל `Max()` קורסת עם `InvalidOperationException: Sequence contains no elements`.
> - `Where` צריכה למדה שמחזירה `bool`. `nums.Where(n => n * 2)` גורמת לשגיאת קומפילציה.
> - בלבול ביניהן: `Where` אף פעם לא משנה את הפריטים, רק מחליטה אילו נשארים. `Select` אף פעם לא מסירה פריטים, רק משנה אותם.

## להמשך

נסו את `OrderBy(n => n)`, את `Average()` ואת `Any(n => n > 9)` (נותנת true אם לפחות פריט אחד עובר).

> **תורכם:** בעזרת הרשימה `numbers`, הדפיסו את המספרים הזוגיים, את הריבועים של המספרים הזוגיים האלה, את סכום כל המספרים ואת כמות המספרים הגדולים מ-5. השתמשו ב-`Where`, ב-`Select` וב-`Sum`.
