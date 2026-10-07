---
title: "מחלקות ואובייקטים"
summary: "מאגדים נתונים והתנהגות יחד עם שדות, מאפיינים (properties), בנאים ומתודות."
hints:
  - "בנאי (constructor) נראה כמו מתודה בלי טיפוס החזרה ועם אותו שם כמו המחלקה. בתוכו, העתיקו את הפרמטרים למאפיינים (Name = name;)."
  - "public Player(string name, int health) { Name = name; Health = health; }   TakeDamage מחסירה מ-Health ואם הוא ירד מתחת ל-0, מחזירה אותו ל-0. IsAlive מחזירה Health > 0."
  - "public Player(string name, int health) { Name = name; Health = health; }  public void TakeDamage(int amount) { Health -= amount; if (Health < 0) { Health = 0; } }  public bool IsAlive() { return Health > 0; }"
messages:
  - "כתבו בנאי ציבורי: public Player(string name, int health)."
  - "כתבו מתודה void TakeDamage(int amount)."
  - "כתבו מתודה bool IsAlive()."
quiz:
  - q: "מה היחס בין מחלקה לאובייקט?"
    options: ["הם אותו דבר", "אובייקט הוא תבנית, מחלקה היא עותק", "מחלקה היא תבנית, אובייקט הוא דבר אחד שנבנה ממנה", "מחלקה היא משתנה, אובייקט הוא מתודה"]
  - q: "מה המילה new עושה ב-  new Player(\"Hero\", 100)  ?"
    options: ["מוחקת את השחקן הישן", "יוצרת אובייקט חדש ומריצה את הבנאי", "מצהירה על טיפוס משתנה חדש", "מדפיסה את השחקן"]
  - q: "מה מיוחד בבנאי?"
    options: ["יש לו אותו שם כמו למחלקה ואין לו טיפוס החזרה", "הוא תמיד מחזיר int", "הוא חייב להיות static", "אפשר לקרוא לו רק פעם אחת בתוכנית"]
  - q: "מה  public  אומר על חבר?"
    options: ["רק המחלקה עצמה יכולה להשתמש בו", "הוא מוסתר מכולם", "אפשר להשתמש בו גם ממחלקות אחרות", "הוא קבוע"]
---

עד עכשיו השתמשתם בטיפוסים ש-C# נותנת: `int`, `string`, `List<int>`. **מחלקה** (class) מאפשרת ליצור טיפוס משלכם שמקבץ נתונים קשורים ואת הפעולות שעובדות עליהם. זה הלב של **תכנות מונחה עצמים** (object-oriented programming).

## מחלקה ואובייקט

מחלקה היא **תבנית** (blueprint). **אובייקט** (נקרא גם **מופע**, instance) הוא דבר אמיתי אחד שנבנה מהתבנית. מחלקה אחת `Dog` יכולה ליצור הרבה אובייקטי כלב, לכל אחד שם וגיל משלו.

```csharp
class Dog
{
    public string Name;    // a field: data stored in each object
    public int Age;

    public void Bark()     // a method: something a dog can do
    {
        Console.WriteLine($"{Name} says Woof!");
    }
}
```

יוצרים אובייקט עם `new` ומשתמשים בחברים שלו עם נקודה:

```csharp
Dog d = new Dog();
d.Name = "Rex";
d.Age = 3;
d.Bark();     // prints: Rex says Woof!
```

## מאפיינים (Properties)

במקום שדות חשופים, מתכנתי C# בדרך כלל משתמשים ב**מאפיינים** (properties). הצורה הקצרה נקראת auto-property:

```csharp
public string Name { get; set; }
```

זה נראה כמו שדה אבל אפשר להוסיף לו אחר כך כללים נוספים. `get` קורא את הערך, `set` משנה אותו. הפכו את ה-setter לפרטי (`{ get; private set; }`) כשרק המחלקה עצמה צריכה לשנות את הערך.

## בנאים

**בנאי** (constructor) הוא מתודה מיוחדת שרצה כשאובייקט נוצר. יש לו **אותו שם כמו למחלקה** ו**אין לו טיפוס החזרה**. השתמשו בו כדי לאתחל את האובייקט כך שלעולם לא יהיה בנוי חצי:

```csharp
class Dog
{
    public string Name { get; set; }
    public int Age { get; set; }

    public Dog(string name, int age)
    {
        Name = name;
        Age = age;
    }
}

Dog d = new Dog("Rex", 3);   // Name and Age are set right away
```

## מתודות ששינו את האובייקט

מתודות בתוך מחלקה יכולות לקרוא ולשנות את המאפיינים של האובייקט עצמו. לכל אובייקט יש ערכים משלו, ולכן `a.Age++` לא משפיע על `b`.

חשבו על מחלקה כעל תשובה לשתי שאלות: "מה היא יודעת?" (מאפיינים) ו"מה היא יכולה לעשות?" (מתודות).

## גישה: public ו-private

חברי `public` אפשר להשתמש בהם מחוץ למחלקה. חברי `private` (ברירת המחדל) הם לשימוש המחלקה עצמה. הסתרת פרטים מונעת משאר התוכנית להכניס אובייקט למצב לא תקין.

> **שימו לב:**
> - שכחתם `new`: `Dog d; d.Bark();` נותנת `error CS0165: Use of unassigned local variable 'd'`.
> - שכחתם `public` על חבר שמשתמשים בו ממחלקה אחרת נותן `error CS0122: 'Player.TakeDamage(int)' is inaccessible due to its protection level`.
> - קריאה לבנאי עם ארגומנטים שגויים, כמו `new Player("Hero")`, נותנת `error CS1729: 'Player' does not contain a constructor that takes 1 arguments`.
> - מתן טיפוס החזרה לבנאי (`public void Player(...)`) הופך אותו למתודה רגילה, והבנאי האמיתי חסר.
> - בתוך בנאי, `name = name;` פשוט משימה את הפרמטר לעצמו. המאפיין הוא `Name` עם N גדולה, הפרמטר הוא `name`.

## להמשיך הלאה

הוסיפו מתודה `Heal(int amount)` שמעלה את `Health`, אבל לא מעל 100. צרו שני שחקנים ובדקו שפגיעה באחד לא משנה את השני.

> **תורכם:** השלימו את המחלקה `Player`. הוסיפו בנאי `Player(string name, int health)`, מתודה `TakeDamage(int amount)` שמורידה חיים אבל אף פעם לא מתחת ל-0, ומתודה `IsAlive()` שמחזירה `true` כל עוד החיים גדולים מ-0.
