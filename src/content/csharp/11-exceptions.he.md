---
title: "חריגות עם try ו-catch"
summary: "מטפלים בשגיאות בצורה נעימה במקום לתת לתוכנית לקרוס."
hints:
  - "חריגה (exception) היא שגיאה שהתוכנית יכולה להתאושש ממנה. קוד שעלול להיכשל נכנס לבלוק try, וקוד ההתאוששות נכנס לבלוק catch שבא מיד אחריו."
  - "try { int value = int.Parse(text); total += value; } catch (FormatException) { ... }. זכרו שהמשתנה text עדיין זמין בתוך בלוק ה-catch."
  - "try { int value = int.Parse(text); total += value; } catch (FormatException) { Console.WriteLine($\"Bad number: {text}\"); }"
messages:
  - "עטפו את הפענוח בבלוק try { ... }."
  - "הוסיפו catch (FormatException ...) { ... }."
quiz:
  - q: "איזה בלוק מכיל את הקוד שעלול להיכשל?"
    options: ["catch", "finally", "throw", "try"]
  - q: "מתי בלוק finally רץ?"
    options: ["רק כשקרתה חריגה", "רק כששום דבר לא השתבש", "תמיד, בין אם הייתה חריגה ובין אם לא", "אף פעם, זו רק הערה"]
  - q: "איזו שורה יוצרת חריגה משלכם?"
    options: ["throw new Exception(\"Something is wrong\");", "raise Exception(\"...\")", "error(\"...\");", "catch Exception(\"...\");"]
  - q: "מה קורה לחריגה שאף בלוק catch לא מטפל בה?"
    options: ["היא מתעלמת בשקט", "התוכנית קורסת עם הודעת שגיאה", "התוכנית מתחילה מחדש", "החריגה הופכת לאזהרה"]
---

דברים משתבשים בזמן שתוכניות רצות: משתמש מקליד אותיות איפה שציפו למספר, קובץ חסר, מחלקים באפס. כשזה קורה, C# יוצרת **חריגה** (exception), שהיא אובייקט שמתאר את הבעיה. אם שום דבר לא מטפל בה, התוכנית **קורסת**. בעזרת `try` ו-`catch` אפשר לטפל בבעיה ולהמשיך.

## איך נראית קריסה

```csharp
int n = int.Parse("hello");
Console.WriteLine("This line never runs");
```

התוכנית נעצרת עם `System.FormatException: Input string was not in a correct format.` השורה השנייה אף פעם לא מגיעה לרוץ.

## try ו-catch

שמים את הקוד המסוכן בבלוק `try`. אם קורית בתוכו חריגה, C# קופצת ישר לבלוק `catch` המתאים:

```csharp
try
{
    int n = int.Parse("hello");
    Console.WriteLine("Parsed " + n);   // skipped, the line above threw
}
catch (FormatException)
{
    Console.WriteLine("That was not a number");
}
Console.WriteLine("Program continues");
// prints: That was not a number
//         Program continues
```

אחרי שבלוק ה-`catch` מסתיים, התוכנית ממשיכה כרגיל. שורות בתוך `try` שאחרי השורה שנכשלה מדולגות.

## קבלת פרטים על החריגה

אפשר לתת שם לחריגה כדי לקרוא את ההודעה שלה:

```csharp
try
{
    int zero = 0;
    Console.WriteLine(10 / zero);
}
catch (DivideByZeroException ex)
{
    Console.WriteLine("Problem: " + ex.Message);
}
```

השתמשו בכמה בלוקי `catch` כדי להגיב בצורה שונה לבעיות שונות. שימו את הטיפוסים הספציפיים קודם. הטיפוס הכללי `Exception` תופס הכול, ולכן שימו אותו אחרון, אם בכלל משתמשים בו.

## finally

בלוק `finally` רץ **בכל מקרה**, גם אחרי חריגה. זה המקום לניקוי:

```csharp
try
{
    Console.WriteLine("working");
}
catch (Exception)
{
    Console.WriteLine("failed");
}
finally
{
    Console.WriteLine("always runs");
}
```

## זריקת חריגה משלכם

אפשר להעלות חריגה בעצמכם כשמתודה (method) מקבלת משהו שהיא לא יכולה לקבל:

```csharp
static int Half(int n)
{
    if (n % 2 != 0)
    {
        throw new ArgumentException("n must be even");
    }
    return n / 2;
}
```

## חריגות לעומת בדיקות

אל תשתמשו בחריגות לדברים שאפשר פשוט לבדוק. `int.TryParse` או `if` עדיפים על `try`/`catch` כשקלט שגוי הוא דבר צפוי. חריגות מיועדות לבעיות לא צפויות באמת.

> **שימו לב:**
> - בלוק catch ריק (`catch { }`) מסתיר כל בעיה והופך באגים לקשים מאוד לאיתור. לפחות הדפיסו הודעה.
> - הצבת `catch (Exception)` לפני catch ספציפי יותר גורמת ל-`error CS0160: A previous catch clause already catches all exceptions of this or a super type`.
> - משתנה שהוגדר בתוך `try { }` אינו נראה ב-`catch` או אחרי הבלוק (`error CS0103: The name 'value' does not exist in the current context`). הגדירו אותו לפני ה-`try` אם אתם צריכים אותו אחר כך.
> - כתיבת `try` בלי `catch` או `finally` גורמת ל-`error CS1524: Unexpected symbol '}', expecting 'catch' or 'finally'`.

> **תורכם:** עטפו את הפענוח ב-`try`, והוסיפו `catch (FormatException)` שמדפיס `Bad number: abc` (בעזרת המשתנה `text`). הסכום הסופי צריך להיות `35`.
