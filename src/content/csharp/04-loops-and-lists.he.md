---
title: "לולאות ורשימות"
summary: "חזרו על פעולות עם for ו-foreach ושמרו הרבה ערכים ב-List."
hints:
  - "לולאת foreach עוברת על כל פריט ברשימה, אחד בכל פעם. בתוך הלולאה אפשר להוסיף כל פריט ל-sum."
  - "foreach (int n in numbers) { sum += n; }  נותן לכם את הסכום. List גדל עם numbers.Add(...), ו-numbers.Count אומר כמה פריטים יש בו."
  - "foreach (int n in numbers) { sum += n; }  Console.WriteLine($\"Sum: {sum}\");  numbers.Add(6);  Console.WriteLine($\"Count: {numbers.Count}\");"
messages:
  - "השתמשו בלולאת foreach כדי לסכום את המספרים."
  - "השתמשו ב-numbers.Add(6) כדי להוסיף פריט לרשימה."
quiz:
  - q: "איך מוסיפים פריט ל-List?"
    options: ["list.push(item)", "list.append(item)", "list.Insert(item)", "list.Add(item)"]
  - q: "איך מקבלים את מספר הפריטים ב-List?"
    options: ["list.Count", "list.length()", "list.Size", "len(list)"]
  - q: "מה עושה foreach?"
    options: ["ממיין את הרשימה", "מריץ את הגוף פעם אחת עבור כל פריט", "מוחק את הרשימה", "סופר את הרשימה"]
  - q: "כמה פעמים הלולאה  for (int i = 0; i < 3; i++)  מריצה את הגוף שלה?"
    options: ["2 פעמים", "4 פעמים", "היא אף פעם לא נעצרת", "3 פעמים"]
    explain: "i מקבל את הערכים 0, 1 ו-2. כש-i הופך ל-3 התנאי i < 3 אינו נכון."
---

מחשבים מצוינים בלעשות את אותו דבר פעמים רבות. **לולאה** (loop) חוזרת על קוד, ו**רשימה** (list) מחזיקה הרבה ערכים במשתנה אחד. יחד הן סוסי העבודה של כמעט כל תוכנית.

## לולאת for

השתמשו ב-`for` כשאתם יודעים כמה פעמים לחזור:

```csharp
for (int i = 0; i < 3; i++)
{
    Console.WriteLine($"Round {i}");
}
// prints: Round 0, Round 1, Round 2
```

שלושת החלקים בתוך הסוגריים מופרדים בנקודה-פסיק:

1. `int i = 0` רץ פעם אחת בהתחלה ויוצר את המונה.
2. `i < 3` נבדק לפני כל סבב. כשהוא לא נכון, הלולאה מסתיימת.
3. `i++` רץ אחרי כל סבב ומוסיף 1 ל-`i`.

מתכנתים סופרים מ-**0**, ולכן `i < 3` נותן שלושה סבבים: 0, 1, 2.

## while

`while` חוזרת כל עוד תנאי נכון:

```csharp
int n = 1;
while (n < 100)
{
    n = n * 2;
}
Console.WriteLine(n);   // 128
```

## List<T>

`List<T>` היא רשימה שיכולה לגדול. `T` הוא הטיפוס של הפריטים, ולכן `List<int>` מחזיקה מספרים ו-`List<string>` מחזיקה טקסט. צריך `using System.Collections.Generic;` בראש הקובץ.

```csharp
List<string> names = new List<string> { "Ava", "Noam" };
names.Add("Maya");
Console.WriteLine(names.Count);   // 3
Console.WriteLine(names[0]);      // Ava  (first item is index 0)
names.Remove("Noam");
Console.WriteLine(names.Count);   // 2
```

חברים שימושיים: `Add(item)`, `Remove(item)`, `Contains(item)`, `Count` (תכונה, property, בלי סוגריים!), ו-`list[index]` לקריאה או לשינוי של פריט אחד.

## foreach

`foreach` עוברת על כל פריט לפי הסדר, בלי מונה:

```csharp
foreach (string name in names)
{
    Console.WriteLine(name);
}
```

קראו את זה כך: "לכל `string` ששמו `name` ב-`names`". בתוך הסוגריים המסולסלים, `name` הוא הפריט הנוכחי. זו הדרך הפשוטה ביותר לעבור על רשימה.

סכום מצטבר משתמש באותו דפוס בכל פעם: מתחילים משתנה ב-0, ואז מוסיפים אליו בתוך הלולאה:

```csharp
int total = 0;
foreach (int price in prices)
{
    total += price;
}
```

> **שימו לב:**
> - כתיבה של `list.Count()` או `list.Length` במקום `list.Count` גורמת לשגיאות כמו `error CS1955: Non-invocable member 'List<int>.Count' cannot be used like a method` או `error CS1061: ... does not contain a definition for 'Length'`.
> - קריאה של `list[5]` כשיש רק 5 פריטים (האינדקס האחרון הוא 4) קורסת עם `ArgumentOutOfRangeException`.
> - שינוי רשימה בתוך `foreach` על אותה רשימה (הוספה או הסרה) קורס עם `InvalidOperationException: Collection was modified`.
> - שכחת `using System.Collections.Generic;` גורמת ל-`error CS0246: The type or namespace name 'List<>' could not be found`.
> - לולאה אינסופית, כמו `while` שהתנאי שלה אף פעם לא נעשה לא נכון, תתקע את התוכנית.

## מערכים בדקה אחת

ב-C# יש גם **מערכים** (arrays) בגודל קבוע: `int[] scores = new int[] { 5, 8, 2 };`. קוראים אותם עם `scores[0]` ומקבלים את הגודל עם `scores.Length`. מערכים לא יכולים לגדול; `List` יכולה, ולכן משתמשים ברשימות לעיתים קרובות יותר.

> **תורכם:** השתמשו ב-`foreach` כדי להוסיף כל מספר ל-`sum` והדפיסו `Sum: 15`. אחר כך הוסיפו (`Add`) את המספר `6` לרשימה והדפיסו `Count: 6`.
