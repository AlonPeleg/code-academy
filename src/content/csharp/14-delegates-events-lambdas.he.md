---
title: "דלגטים, אירועים ולמדות"
summary: "מעבירים מתודות כערכים ונותנים לאובייקטים להכריז שמשהו קרה."
hints:
  - "דלגט (delegate) הוא טיפוס שמתאר חתימה של מתודה, כך שמשתנה מהטיפוס הזה יכול להחזיק כל מתודה או למדה שמתאימות. אירוע (event) הוא שדה דלגט שגורמים חיצוניים יכולים רק להירשם אליו עם += (ולא לקרוא לו ישירות)."
  - "delegate int Operation(int a, int b); static int Apply(Operation op, int a, int b) { return op(a, b); }  class Button { public event Action<string> Clicked; public void Click(string name) { Clicked?.Invoke(name); } }  נרשמים עם btn.Clicked += name => Console.WriteLine(...);"
  - "Button btn = new Button(); int clicks = 0;   btn.Clicked += name => Console.WriteLine(\"Logger saw: \" + name);   btn.Clicked += name => clicks++;   btn.Click(\"Save\"); btn.Click(\"Save\");   Console.WriteLine(\"Clicks counted: \" + clicks);   Func<int, int> square = x => x * x;"
messages:
  - "הגדירו את הדלגט: delegate int Operation(int a, int b);"
  - "הגדירו את האירוע: public event Action<string> Clicked;"
  - "הירשמו לאירוע עם +=."
  - "השתמשו בביטויי למדה (=>)."
  - "השתמשו ב-Func<int, int> עבור square."
quiz:
  - q: "מהו דלגט?"
    options: ["סוג של לולאה", "הפניה בטוחה-טיפוסים למתודה: משתנה שמחזיק מתודה", "מחלקה שאי אפשר לרשת ממנה"]
  - q: "מהו  Func<int, int>  ?"
    options: ["טיפוס דלגט לכל מתודה שמקבלת int ומחזירה int", "מתודה שמחזירה שני int-ים", "רשימה גנרית של int-ים"]
  - q: "מה ההבדל בין אירוע לבין שדה דלגט ציבורי רגיל?"
    options: ["אירועים רצים מהר יותר", "קוד חיצוני יכול רק להירשם (+=) ולבטל הרשמה (-=) לאירוע, אבל לא להפעיל אותו ולא להחליף את כל המנויים", "אין הבדל"]
  - q: "למה לכתוב Clicked?.Invoke(name) במקום Clicked(name)?"
    options: ["זה גורם למטפל לרוץ פעמיים", "Clicked היא מתודה ולא אירוע", "לאירוע בלי מנויים יש ערך null, וקריאה ל-null הייתה זורקת NullReferenceException"]
---

עד עכשיו העברתם למתודות מספרים ומחרוזות. ב-C# אפשר להעביר גם **התנהגות**: "עשו את זה עם כל פריט", "תקראו לי כשמשהו קורה". הכלים הם **דלגטים** (delegates, משתנה שמחזיק מתודה), **למדות** (lambdas, דרך קצרה לכתוב מתודה בתוך הקוד) ו**אירועים** (events, דרך בטוחה לאובייקט להכריז שמשהו קרה).

## דלגטים

טיפוס דלגט מתאר צורה של מתודה: הפרמטרים שלה וטיפוס ההחזרה.

```csharp
delegate int Operation(int a, int b);

static int Add(int a, int b) { return a + b; }

Operation op = Add;           // store the method in a variable
Console.WriteLine(op(2, 3));  // prints: 5
```

כל מתודה עם שני int-ים בכניסה ו-int אחד ביציאה מתאימה. אפשר להעביר משתנה כזה למתודה אחרת, וכך מתודה כמו `Apply(op, a, b)` יכולה להתנהג אחרת בכל פעם שקוראים לה.

## Func ו-Action: הדלגטים המוכנים

לעיתים רחוקות מגדירים טיפוסי דלגט משלכם. הפריימוורק מספק דלגטים גנריים:

- `Func<T1, T2, TResult>` מחזיר ערך; הטיפוס **האחרון** הוא טיפוס ההחזרה. `Func<int, int>` מקבל int ומחזיר int.
- `Action<T1, T2>` לא מחזיר כלום (void). `Action<string>` מקבל מחרוזת.

```csharp
Func<int, int, int> add = (a, b) => a + b;
Action<string> greet = name => Console.WriteLine("Hi " + name);
greet("Ava");                  // prints: Hi Ava
```

## למדות

`(a, b) => a + b` הוא **ביטוי למדה**: פרמטרים בצד שמאל, החץ `=>` ("הולך ל-"), והתוצאה בצד ימין. כשיש פרמטר אחד הסוגריים אופציונליים (`x => x * x`). לכמה פקודות משתמשים בסוגריים מסולסלים וב-`return`:

```csharp
Func<int, string> describe = n =>
{
    if (n % 2 == 0) return "even";
    return "odd";
};
```

למדות יכולות להשתמש במשתנים מקומיים של המתודה שמקיפה אותן; זה נקרא **לכידה** (capturing), והלמדה רואה את הערך הנוכחי של המשתנה, לא עותק:

```csharp
int total = 0;
Action<int> addToTotal = n => total += n;
addToTotal(5);
addToTotal(7);
Console.WriteLine(total);     // prints: 12
```

## אירועים

דמיינו `Button` שצריך לספר לשאר התוכנית כשלוחצים עליו, בלי לדעת מי מאזין. **אירוע** עושה את זה (תבנית publish/subscribe, או תבנית המשקיף):

```csharp
class Button
{
    public event Action<string> Clicked;

    public void Click(string name)
    {
        Clicked?.Invoke(name);    // notify every subscriber
    }
}

Button b = new Button();
b.Clicked += name => Console.WriteLine("Clicked " + name);   // subscribe
b.Click("OK");                                               // prints: Clicked OK
```

- `+=` מוסיף מנוי; `-=` מסיר מנוי (השתמשו במתודה בעלת שם אם אתם מתכננים לבטל הרשמה).
- המנויים רצים לפי הסדר שבו נרשמו.
- רק המחלקה שהאירוע שייך לה יכולה להפעיל אותו. גורמים חיצוניים לא יכולים לקרוא ל-`b.Clicked(...)` או למחוק הרשמות של אחרים. זה ההבדל משדה דלגט ציבורי רגיל.
- כשאף אחד לא נרשם האירוע הוא `null`, ולכן משתמשים ב-`?.Invoke(...)` (האופרטור **null-conditional**: מבצע את הקריאה רק אם הערך אינו null).

בספריות ממשק משתמש אמיתיות ובפריימוורקים לווב כמעט הכול (לחיצות, טיימרים, הודעות נכנסות) הוא אירוע.

> **שימו לב:**
> - קריאה לאירוע בלי מנויים עם `Clicked(name)` רגילה: `NullReferenceException`. השתמשו ב-`Clicked?.Invoke(name)`.
> - צורה שגויה של למדה: השמה של `(a, b) => a + b` ל-`Action<string>` גורמת ל-`error CS1593: Delegate 'Action<string>' does not take 2 arguments`.
> - שוכחים ש-`Func` מציין את טיפוס ההחזרה אחרון: `Func<int, string>` מקבל int ומחזיר string.
> - הפעלת האירוע מחוץ למחלקה: `error CS0070: The event 'Button.Clicked' can only appear on the left hand side of += or -=`.
> - משתנים לכודים משתנים: למדות שנוצרו בלולאה עלולות כולן לראות את הערך הסופי של משתנה משותף. העתיקו אותו קודם למשתנה מקומי בתוך הלולאה.

## להמשך

השתמשו בלמדות עם מתודות LINQ שאתם מכירים (`numbers.Where(n => n > 3)`), או תנו ל-`Button` אירוע שני `DoubleClicked`.

> **תורכם:** השלימו את התוכנית לפי ההערות הממוספרות: הגדירו את הדלגט `Operation`, את המחלקה `Button` עם האירוע `Clicked`, את המתודה `Apply`, שתי למדות עבור `Apply`, למדה `square`, ושני מטפלים שנרשמים לכפתור.
