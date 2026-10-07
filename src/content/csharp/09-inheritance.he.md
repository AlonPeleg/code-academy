---
title: "ירושה וממשקים"
summary: "משתמשים שוב במחלקה עם ירושה, משנים התנהגות עם virtual ו-override, ופוגשים ממשקים (interfaces)."
hints:
  - "Dog ו-Cat כבר יורשות מ-Animal (הנקודתיים ב-class Dog : Animal). כדי להחליף את ההתנהגות של מתודה virtual, מחלקת הבן מצהירה עליה שוב עם המילה override."
  - "בתוך class Dog הוסיפו מתודה עם אותה חתימה כמו של Animal:  public override string Speak() { ... }  והחזירו את הטקסט הנכון. עשו אותו דבר בתוך Cat."
  - "ב-Dog:  public override string Speak() { return \"Woof\"; }   ב-Cat:  public override string Speak() { return \"Meow\"; }"
messages:
  - "גם ל-Dog וגם ל-Cat צריכה להיות  public override string Speak()  משלהן."
quiz:
  - q: "איך אומרים ש-Dog יורשת מ-Animal?"
    options: ["class Dog extends Animal", "class Dog inherits Animal", "class Dog -> Animal", "class Dog : Animal"]
  - q: "אילו מילות מפתח מאפשרות למחלקת בן להחליף מתודה של האב?"
    options: ["virtual באב, override בבן", "new באב, replace בבן", "static בשניהם", "abstract בבן בלבד"]
  - q: "מה ממשק (interface) מכיל?"
    options: ["קוד מוכן שכל מחלקה חייבת להשתמש בו", "רק את השמות והחתימות של חברים שמחלקה מבטיחה לספק", "שדות פרטיים", "את המתודה Main"]
  - q: "משתנה מטיפוס Animal מחזיק אובייקט Dog, ואתם קוראים ל-Speak(). איזו גרסה רצה?"
    options: ["תמיד הגרסה של Animal", "אף אחת, זו שגיאה", "שתי הגרסאות, זו אחרי זו", "הגרסה של Dog, בגלל override"]
    explain: "זה פולימורפיזם: המתודה שרצה תלויה בטיפוס האמיתי של האובייקט, לא בטיפוס של המשתנה."
---

לעיתים קרובות כמה דברים חולקים את רוב ההתנהגות שלהם ושונים בפרטים: כלב וחתול הם שניהם חיות, אבל הם משמיעים קולות שונים. **ירושה** (inheritance) מאפשרת למחלקה אחת להישען על אחרת כדי שלא תחזרו על עצמכם, ו**פולימורפיזם** (polymorphism) מאפשר להתייחס לסוגים שונים של אובייקטים באותה דרך.

## ירושה ממחלקה

כתבו נקודתיים ואת שם מחלקת האב אחרי מחלקת הבן:

```csharp
class Animal
{
    public string Name { get; set; }

    public void Eat()
    {
        Console.WriteLine($"{Name} eats");
    }
}

class Dog : Animal
{
    public void Fetch()
    {
        Console.WriteLine($"{Name} fetches the ball");
    }
}
```

ל-`Dog` יש אוטומטית את `Name` ואת `Eat()` מ-`Animal`, ובנוסף את `Fetch()` שלה. `Animal` היא **מחלקת הבסיס** (base class, האב), `Dog` היא **המחלקה הנגזרת** (derived class, הבן). כל `Dog` **היא** `Animal`.

## virtual ו-override

בן יכול לשנות מה שמתודה שירש עושה. האב מסמן את המתודה `virtual` ("מותר להחליף"), והבן משתמש ב-`override`:

```csharp
class Animal
{
    public virtual string Speak() { return "Some sound"; }
}

class Dog : Animal
{
    public override string Speak() { return "Woof"; }
}
```

החתימה חייבת להתאים בדיוק (אותו שם, פרמטרים וטיפוס החזרה). בן עדיין יכול להגיע לגרסת האב עם `base.Speak()`, וזה שימושי כשרוצים להוסיף להתנהגות הישנה במקום להחליף אותה.

## פולימורפיזם

מכיוון ש-`Dog` היא `Animal`, משתנה מטיפוס `Animal` יכול להחזיק `Dog`. כשקוראים למתודה virtual, C# מריצה את הגרסה ששייכת ל**אובייקט האמיתי**:

```csharp
Animal a = new Dog();
Console.WriteLine(a.Speak());   // Woof, not "Some sound"
```

לכן `foreach` אחד על `List<Animal>` יכול לגרום לכל חיה לדבר בדרך שלה, בלי אף `if` ששואל "איזה סוג את/ה?".

## בנאים ו-base

בנאי של בן יכול להעביר ערכים לבנאי של האב עם `: base(...)`:

```csharp
class Dog : Animal
{
    public Dog(string name) : base(name) { }
}
```

## ממשקים (Interfaces)

**ממשק** הוא הבטחה: הוא מפרט חברים (בלי קוד) שכל מחלקה שמשתמשת בו חייבת לספק. לפי המקובל השם שלו מתחיל ב-`I`:

```csharp
interface IShape
{
    double Area();
}

class Square : IShape
{
    public double Side;
    public double Area() { return Side * Side; }
}
```

מחלקה יכולה לרשת מ**מחלקת בסיס אחת** בלבד אבל לממש **הרבה** ממשקים. השתמשו בממשק כשמחלקות שאינן קשורות צריכות לחלוק יכולת ("אפשר לצייר", "אפשר להשוות").

> **שימו לב:**
> - דריסה של מתודה שאינה `virtual` נותנת `error CS0506: 'Dog.Speak()': cannot override inherited member 'Animal.Speak()' because it is not marked virtual, abstract, or override`.
> - שכחתם `override` בבן מסתירה את מתודת האב במקום להחליף אותה, עם `warning CS0114`. אז גרסת האב רצה דרך משתנה `Animal`.
> - מחלקה שמממשת ממשק אבל חסר לה חבר נותנת `error CS0535: 'Square' does not implement interface member 'IShape.Area()'`.
> - בנאי של בן נכשל עם `error CS1729: ... does not contain a constructor that takes 0 arguments` אם לאב אין בנאי ללא פרמטרים והבן לא קורא ל-`: base(...)`.

> **תורכם:** גרמו ל-`Dog.Speak()` להחזיר `Woof` ול-`Cat.Speak()` להחזיר `Meow` על ידי דריסת מתודת האב בשתי המחלקות. אז `Main` מדפיסה `Some sound`, `Woof`, `Meow`.
