---
title: "גנריקס (Generics) ואילוצים"
summary: "כותבים מחלקה אחת או מתודה אחת שעובדת עבור הרבה טיפוסים, ומגבילים אותה בעזרת where."
hints:
  - "בגנריקס משתמשים בשם טיפוס זמני, בדרך כלל T, בתוך סוגריים משולשים: class MyStack<T> ו-Max<T>(...). בפנים אפשר להשתמש ב-T כמו בכל טיפוס אמיתי. אילוץ (constraint) אחרי רשימת הפרמטרים מגביל אילו טיפוסים מותרים."
  - "class MyStack<T> { private List<T> items = new List<T>(); public void Push(T item) { items.Add(item); } ... public int Count { get { return items.Count; } } }   עבור Max: static T Max<T>(List<T> items) where T : IComparable<T> { T best = items[0]; foreach (T x in items) { if (x.CompareTo(best) > 0) best = x; } return best; }"
  - "public T Pop() { T last = items[items.Count - 1]; items.RemoveAt(items.Count - 1); return last; }   public T Peek() { return items[items.Count - 1]; }   static class Helper { public static T Max<T>(List<T> items) where T : IComparable<T> { ... } }"
messages:
  - "הגדירו class MyStack<T>."
  - "הוסיפו את האילוץ where T : IComparable<T>."
  - "כתבו מתודה גנרית static T Max<T>(...)."
  - "שמרו את הפריטים ב-List<T>."
quiz:
  - q: "מה T מייצג ב-class MyStack<T>?"
    options: ["מקום שמור לטיפוס, שמתמלא כשמשתמשים במחלקה, למשל MyStack<int>", "טיפוס מובנה בשם T", "המילה 'Type' כמילת מפתח"]
  - q: "מה האילוץ  where T : IComparable<T>  מבטיח?"
    options: ["ש-T חייב להיות מספר", "ש-T הוא מחלקה", "שאפשר להשוות ערכים מטיפוס T בעזרת CompareTo, ולכן המתודה רשאית להשתמש בה"]
  - q: "למה גנריקס טובים יותר ממחסנית של object?"
    options: ["קצר יותר להקליד אותם", "הם שומרים על בטיחות טיפוסים: בלי המרות, וטעויות נמצאות בזמן הקומפילציה", "מחסניות של object לא קיימות"]
  - q: "איזו שורה יוצרת מחסנית של מחרוזות?"
    options: ["MyStack<string> s = new MyStack<string>();", "MyStack s = new MyStack(string);", "MyStack<> s = new MyStack<T>();"]
---

דמיינו מחסנית (stack, אחרון נכנס ראשון יוצא) של מספרים שלמים. אחר כך אתם צריכים מחסנית של מחרוזות. להעתיק את המחלקה ולשנות `int` ל-`string` זה בזבוז. שימוש ב-`object` לכל דבר מאבד את בטיחות הטיפוסים: תצטרכו להמיר ערכים בחזרה ולקוות שאף אחד לא דחף את הדבר הלא נכון. **גנריקס** (generics) פותרים את זה: כותבים את הקוד פעם אחת עם מקום שמור לטיפוס, והקומפיילר בודק כל שימוש.

כבר השתמשתם בגנריקס: `List<int>` ו-`Dictionary<string, int>` הן מחלקות גנריות.

## מחלקה גנרית

```csharp
class Box<T>
{
    private T value;

    public Box(T value)
    {
        this.value = value;
    }

    public T Get()
    {
        return value;
    }
}

Box<int> a = new Box<int>(5);
Box<string> b = new Box<string>("hi");
int x = a.Get();          // no cast needed, it is already an int
```

- `<T>` אחרי שם המחלקה מגדיר **פרמטר טיפוס** (type parameter). `T` הוא רק מוסכמה, וגם `TItem` או `TKey` נפוצים.
- בתוך המחלקה `T` עובד כמו טיפוס אמיתי עבור שדות, פרמטרים וערכי החזרה.
- כשכותבים `Box<int>`, הקומפיילר מתייחס לכל `T` כאל `int`. `Box<int>` ו-`Box<string>` הם טיפוסים שונים, ו-`a.Get()` מחזירה `int`, לא `object`.

## מתודה גנרית

למתודות יכולים להיות פרמטרי טיפוס משלהן:

```csharp
static void Swap<T>(ref T a, ref T b)
{
    T temp = a;
    a = b;
    b = temp;
}

int p = 1, q = 2;
Swap(ref p, ref q);       // T is inferred as int
```

C# בדרך כלל **מסיקה** (infers) את `T` מהארגומנטים, ולכן לעיתים רחוקות צריך לכתוב `Swap<int>(...)`.

## אילוצים עם where

מה אם המתודה רוצה להשוות שני ערכים? `T` רגיל יכול להיות כל דבר, אפילו טיפוס שאי אפשר להשוות, ולכן זה לא מתקמפל:

```csharp
static T Max<T>(T a, T b)
{
    return a > b ? a : b;     // error CS0019: Operator '>' cannot be applied to operands of type 'T' and 'T'
}
```

**אילוץ** (constraint) אומר לקומפיילר מה מובטח ש-`T` תומך בו:

```csharp
static T Max<T>(T a, T b) where T : IComparable<T>
{
    return a.CompareTo(b) > 0 ? a : b;
}
```

`IComparable<T>` היא ממשק (interface) עם המתודה `CompareTo`, שמחזירה מספר שלילי, אפס או מספר חיובי. `int`, `double` ו-`string` כולם מממשים אותו. אילוצים שימושיים נוספים:

| אילוץ | משמעות |
|---|---|
| `where T : class` | T חייב להיות טיפוס הפניה (reference type) |
| `where T : struct` | T חייב להיות טיפוס ערך (value type) כמו int |
| `where T : new()` | ל-T חייב להיות בנאי (constructor) ציבורי בלי פרמטרים, כך שאפשר לכתוב `new T()` |
| `where T : SomeInterface` | T חייב לממש את הממשק הזה |
| `where T : SomeBaseClass` | T חייב לרשת מהמחלקה הזאת |

אפשר לשלב כמה אילוצים: `where T : class, IComparable<T>, new()`.

## למה זה חשוב

אוספים גנריים הם מהירים ובטוחים: `List<int>` שומרת מספרים שלמים רגילים בלי לעטוף אותם באובייקטים, והקומפיילר מסרב ל-`list.Add("text")`. כשכותבים קוד לשימוש חוזר (מטמון, repository, עטיפה של תוצאה), הפכו אותו לגנרי.

> **שימו לב:**
> - אם שוכחים את האילוץ ומשתמשים באופרטור או במתודה: `error CS1061: 'T' does not contain a definition for 'CompareTo'` או `error CS0019: Operator '>' cannot be applied to operands of type 'T' and 'T'`.
> - כתיבת `new T()` בלי `where T : new()`: `error CS0304: Cannot create an instance of the variable type 'T' because it does not have the new() constraint`.
> - שימוש במחלקה הגנרית בלי הטיפוס שלה: `MyStack s = new MyStack();` גורם ל-`error CS0305: Using the generic type 'MyStack<T>' requires 1 type arguments`.
> - קריאה ל-`Max` על רשימה ריקה: `items[0]` זורקת `ArgumentOutOfRangeException`. קוד אמיתי בודק קודם `items.Count == 0`.
> - ערבוב טיפוסים: `Max(3, "a")` לא יכולה להסיק `T` אחד ולא מתקמפלת.

## להמשך

הוסיפו תכונה (property) `bool IsEmpty` ל-`MyStack<T>`, או כתבו `Min<T>` ומתודה `Swap<T>(List<T> list, int i, int j)`.

> **תורכם:** כתבו את המחלקה הגנרית `MyStack<T>` (`Push`, `Pop`, `Peek`, `Count`) שנשענת על `List<T>`, ואת המתודה הגנרית הסטטית `Helper.Max<T>` עם האילוץ `where T : IComparable<T>`. אחר כך `Main` מדפיסה את חמש השורות הצפויות.
