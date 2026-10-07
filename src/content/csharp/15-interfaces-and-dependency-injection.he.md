---
title: "ממשקים (Interfaces) והזרקת תלויות"
summary: "מתכנתים מול חוזים, מחליפים מימושים ומעבירים תלויות דרך הבנאי."
hints:
  - "ממשק (interface) מפרט חתימות של מתודות בלי גוף. מחלקה שכותבת : ISender חייבת לספק כל מתודה. Notifier תלוי רק בממשק, ולכן אפשר לחבר אליו כל שולח (sender)."
  - "interface ISender { void Send(string message); }   class ConsoleSender : ISender { public void Send(string message) { Console.WriteLine(\"[console] \" + message); } }   RecordingSender שומרת List<string> ומוסיפה אליה ב-Send. ל-Notifier יש שדה פרטי מסוג ISender שמוגדר בבנאי שלו."
  - "class Notifier { private ISender sender; public Notifier(ISender sender) { this.sender = sender; } public void Welcome(string user) { sender.Send(\"Welcome, \" + user); } }   class RecordingSender : ISender { private List<string> messages = new List<string>(); public void Send(string message) { messages.Add(message); } public int Count { get { return messages.Count; } } public string Last() { return messages[messages.Count - 1]; } }"
messages:
  - "הגדירו interface ISender."
  - "ConsoleSender חייבת לממש את ISender."
  - "RecordingSender חייבת לממש את ISender."
  - "הבנאי של Notifier חייב לקבל ISender."
quiz:
  - q: "מה ממשק מכיל?"
    options: ["רק חתימות של מתודות (חוזה) שהמחלקות המממשות חייבות לספק", "מתודות שלמות שעובדות, עם שדות", "בנאים"]
  - q: "מהי \"הזרקה דרך הבנאי\" (constructor injection)?"
    options: ["המחלקה יוצרת בעצמה את העוזרים שלה עם new בתוך המתודות", "מחלקה מקבלת את האובייקטים שהיא תלויה בהם כפרמטרים של הבנאי במקום ליצור אותם", "קריאה לבנאי פעמיים"]
  - q: "למה כדאי ש-Notifier מכיר רק את ISender?"
    options: ["התוכנית מתחילה מהר יותר", "הוא חייב להיות מחלקה סטטית", "אפשר להחליף שולח אחר (למשל מזויף לצורכי בדיקות) בלי לשנות את Notifier"]
  - q: "מה מחלקה אבסטרקטית יכולה לעשות שממשק (בסגנון C# הישן הזה) לא יכול?"
    options: ["להכיל שדות וגופי מתודות מוכנים שמחלקות יורשות יורשות", "לשמש כטיפוס של פרמטר", "להיות ממומשת על ידי כמה מחלקות"]
---

ככל שתוכניות גדלות, מחלקות מתחילות להיות תלויות זו בזו: ל-`Notifier` צריך משהו לשלוח איתו הודעות, ל-`OrderService` צריך מסד נתונים. אם `Notifier` יוצר `ConsoleSender` משלו בתוך הקוד, הוא **דבוק** אליו. אי אפשר לבדוק אותו בלי להדפיס למסוף, ומעבר לדוא"ל פירושו עריכה של `Notifier`. התשובה המקצועית היא להיות תלויים ב**חוזה** (ממשק), ולקבל את האובייקט הדרוש **מבחוץ**. זה נקרא הזרקת תלויות (dependency injection), ואפשר לעשות אותה ידנית בעזרת בנאים בלבד.

## ממשקים

**ממשק** (interface) הוא רשימה של חברים שמחלקה מבטיחה לספק. לפי המוסכמה השם שלו מתחיל ב-`I`.

```csharp
interface IAnimal
{
    string Name { get; }
    string Speak();
}

class Dog : IAnimal
{
    public string Name { get { return "Rex"; } }
    public string Speak() { return "Woof"; }
}
```

`class Dog : IAnimal` אומר "Dog ממלאת את החוזה". הקומפיילר דורש אז את **כל** החברים של הממשק, כ-`public`. מחלקה יכולה לממש הרבה ממשקים (`class A : IFoo, IBar`), בניגוד לירושה ממחלקות, שבה יש רק הורה אחד.

למשתנה יכול להיות הממשק כטיפוס, והוא יכול להחזיק כל אובייקט שמממש אותו:

```csharp
IAnimal a = new Dog();
Console.WriteLine(a.Speak());     // prints: Woof
```

## מחלקות אבסטרקטיות

**מחלקה אבסטרקטית** (abstract class) נמצאת בין ממשק למחלקה רגילה. אי אפשר ליצור אותה ישירות (`new Shape()` היא שגיאה), היא יכולה להכיל שדות ומתודות מוכנות, והיא יכולה להגדיר מתודות `abstract` שמחלקות יורשות חייבות לדרוס (override):

```csharp
abstract class Shape
{
    public abstract double Area();                  // no body, must be overridden
    public string Describe() { return "area " + Area(); }  // shared code
}

class Square : Shape
{
    private double side;
    public Square(double side) { this.side = side; }
    public override double Area() { return side * side; }
}
```

כלל אצבע: השתמשו ב**ממשק** ליכולת שמחלקות לא קשורות יכולות לקבל ("יכול לשלוח", "יכול להיות מושווה"). השתמשו ב**מחלקה אבסטרקטית** כשמחלקות קשורות חולקות קוד ומצב אמיתיים.

## הזרקת תלויות ביד

השוו בין שני עיצובים:

```csharp
// Tightly coupled: Notifier decides which sender to use
class Notifier
{
    private ConsoleSender sender = new ConsoleSender();
    public void Welcome(string user) { sender.Send("Welcome, " + user); }
}

// Loosely coupled: the sender is injected through the constructor
class Notifier
{
    private ISender sender;
    public Notifier(ISender sender) { this.sender = sender; }
    public void Welcome(string user) { sender.Send("Welcome, " + user); }
}
```

בגרסה השנייה `Notifier` מכיר רק את הממשק `ISender`. הקוד שבונה את התוכנית (כאן `Main`, שנקרא לעיתים **composition root**) מחליט באיזה מימוש להשתמש: `new Notifier(new ConsoleSender())` היום, שולח דוא"ל מחר. אין צורך לשנות את `Notifier`.

## למה בדיקות אוהבות את זה

בדיקה יכולה להזריק **מזויף** (fake), כמו `RecordingSender`, ששומר הודעות ברשימה בלבד. אז הבדיקה בודקת את הרשימה במקום להסתכל על המסוף או לשלוח דוא"ל אמיתי. פריימוורקים גדולים כמו ASP.NET Core כוללים "מכל" (container) מובנה שיוצר את האובייקטים ומזריק אותם אוטומטית, אבל הם עושים בדיוק מה שאתם עושים כאן ביד.

> **שימו לב:**
> - שוכחים `public` במתודה שמממשת: `error CS0535: 'ConsoleSender' does not implement interface member 'ISender.Send(string)'` (חברים שמממשים ממשק חייבים להיות ציבוריים).
> - יצירת מופע של ממשק: `ISender s = new ISender();` גורמת ל-`error CS0144: Cannot create an instance of the abstract class or interface 'ISender'`.
> - העברת `null` כתלות: הקריאה הראשונה ל-`sender.Send` זורקת `NullReferenceException`. בדקו בבנאי אם צריך.
> - "דליפה" של הטיפוס הקונקרטי: אם ל-`Notifier` יש שדה מסוג `ConsoleSender`, היתרון נעלם. השדה והפרמטר של הבנאי חייבים להיות הממשק.
> - דריסה בלי `override` במחלקה אבסטרקטית: `error CS0534: 'Square' does not implement inherited abstract member 'Shape.Area()'`.

## להמשך

הוסיפו תלות שנייה, כמו ממשק שעון `IClock` עם `string Now()`, כדי שבדיקות יוכלו להשתמש בזמן קבוע במקום בזמן האמיתי.

> **תורכם:** הגדירו את `ISender`, את שני המימושים `ConsoleSender` ו-`RecordingSender`, ואת `Notifier` עם הזרקה דרך הבנאי. `Notifier` רשאי להכיר רק את הממשק `ISender`.
