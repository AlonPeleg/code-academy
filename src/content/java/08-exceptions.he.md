---
title: "חריגות (Exceptions)"
summary: "טפלו בשגיאות זמן ריצה עם try/catch/finally, וזרקו חריגות checked משלכם."
hints:
  - "קוד מסוכן נכנס לבלוק try { }. מיד אחריו באים בלוקים של catch (SomeException e) { } שרצים רק אם נזרקה חריגה מהסוג הזה. בלוק finally { } תמיד רץ בסוף."
  - "class AgeException extends Exception { AgeException(String message) { super(message); } }. ב-safeParse: try { return Integer.parseInt(text); } catch (NumberFormatException e) { return fallback; }. המתודה שזורקת צריכה  throws AgeException  בכותרת שלה."
  - "try { int r = 10 / zero; } catch (ArithmeticException e) { System.out.println(\"Caught: \" + e.getMessage()); }  try { checkAge(30); checkAge(-5); } catch (AgeException e) { System.out.println(\"Invalid age: \" + e.getMessage()); } finally { System.out.println(\"Done\"); }"
quiz:
  - q: "מתי רץ הקוד בבלוק finally?"
    options: ["רק כשקרתה חריגה", "רק כשלא קרתה חריגה", "תמיד, בין אם קרתה חריגה ובין אם לא", "אף פעם, זה קישוט אופציונלי"]
  - q: "מהי חריגה checked?"
    options: ["כזו שהקומפיילר מחייב אתכם לתפוס או להצהיר עליה עם throws", "כזו שקורית רק בלילה", "כזו שאי אפשר לזרוק", "כל חריגה מהמחלקה Math"]
    explain: "תת-מחלקות של Exception (חוץ מ-RuntimeException) הן checked. RuntimeException והילדים שלה, כמו NullPointerException, אינן."
  - q: "מה ההבדל בין throw ל-throws?"
    options: ["הם אותו דבר", "throw יוצרת ומשגרת חריגה, ו-throws בכותרת של מתודה מצהירה שהיא עלולה לזרוק", "throws משגרת ו-throw מצהירה", "throw מיועדת רק ל-String"]
  - q: "באיזה סדר צריך לכתוב כמה בלוקים של catch?"
    options: ["הטיפוס הכללי ביותר קודם", "הטיפוס הספציפי ביותר קודם", "בסדר אלפביתי", "הסדר לא משנה"]
    explain: "catch כללי שמוצב ראשון היה בולע הכול, והקומפיילר היה מדווח על האחרים כקוד שאי אפשר להגיע אליו."
messages:
  - "AgeException חייבת לרשת מ-Exception."
  - "תפסו NumberFormatException ב-safeParse."
  - "תפסו ArithmeticException סביב החילוק."
  - "הוסיפו בלוק finally."
  - "השתמשו ב-throw new AgeException(...) ב-checkAge."
---

דברים משתבשים בזמן שתוכניות רצות: קובץ חסר, משתמש מקליד `abc` איפה שציפינו למספר, חילקתם באפס. Java מדווחת על בעיות כאלה באמצעות **חריגות** (exceptions). השיעור הזה מראה איך לטפל בהן בצורה נעימה במקום לקרוס, ואיך ליצור חריגות משלכם.

## מה קורה בלי טיפול

```java
int zero = 0;
System.out.println(10 / zero);
```

התוכנית נעצרת ומדפיסה:

```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at Main.main(Main.java:4)
```

זו חריגה שנ**זרקת** (thrown). אם שום דבר לא **תופס** (catch) אותה, היא עולה מתוך `main` ומסיימת את התוכנית. הטקסט שמתחתיה הוא ה-**stack trace**: הוא מפרט את שרשרת הקריאות למתודות, עם הקובץ והשורה, שהובילה לבעיה. קריאה שלו מלמעלה אומרת מה השתבש ואיפה.

## try ו-catch

עטפו קוד מסוכן ב-`try` וקבעו מה לעשות ב-`catch`:

```java
try {
    int n = Integer.parseInt("abc");
    System.out.println("never printed");
} catch (NumberFormatException e) {
    System.out.println("That was not a number");
}
```

ברגע שהשורה בתוך `try` זורקת חריגה, Java קופצת ישר ל-`catch` שמתאים ומדלגת על שאר בלוק ה-`try`. אחרי ה-catch התוכנית ממשיכה כרגיל. המשתנה `e` הוא אובייקט החריגה. חלקים שימושיים הם `e.getMessage()` (תיאור קצר) ו-`e.printStackTrace()`.

אפשר לכתוב כמה בלוקים של catch לסוגים שונים, והראשון שמתאים הוא שרץ. שימו טיפוסים **ספציפיים** לפני כלליים. אפשר גם לרשום חלופות בבלוק אחד: `catch (IOException | NumberFormatException e)`.

## finally

בלוק `finally` רץ **בכל מקרה**: אחרי סיום רגיל, אחרי catch, ואפילו אם נעשה שימוש ב-`return`. זה המקום לניקיון, כמו סגירת קובץ:

```java
try {
    // use a resource
} catch (Exception e) {
    // handle
} finally {
    System.out.println("cleanup");
}
```

בהמשך תפגשו את **try-with-resources**, `try (Scanner in = new Scanner(...)) { ... }`, שסוגר את המשאב בשבילכם אוטומטית.

## חריגות checked ו-unchecked

Java מחלקת חריגות לשתי משפחות:

* **Unchecked** (תת-מחלקות של `RuntimeException`): באגים כמו `NullPointerException`, `ArithmeticException`, `ArrayIndexOutOfBoundsException`. אתם לא חייבים לתפוס אותן. התיקון הטוב ביותר הוא בדרך כלל לתקן את הקוד.
* **Checked** (תת-מחלקות אחרות של `Exception`, כמו `IOException`): בעיות שיכולות לקרות גם בתוכניות נכונות, כמו קובץ חסר. הקומפיילר **מחייב** אתכם או לתפוס אותן או להצהיר שהמתודה שלכם מעבירה אותן הלאה עם `throws`.

## לזרוק חריגה משלכם

השתמשו ב-`throw` עם אובייקט חריגה חדש. אם החריגה checked, הוסיפו `throws` לכותרת המתודה כדי שהקוראים ידעו:

```java
static void checkAge(int age) throws AgeException {
    if (age < 0) {
        throw new AgeException("Age cannot be negative: " + age);
    }
}
```

כדי ליצור טיפוס משלכם, ירשו מ-`Exception` (checked) או מ-`RuntimeException` (unchecked) והעבירו הודעה להורה:

```java
class AgeException extends Exception {
    AgeException(String message) {
        super(message);
    }
}
```

מי שקורא ל-`checkAge` חייב עכשיו לעטוף את הקריאה ב-`try/catch (AgeException e)` או להצהיר בעצמו `throws AgeException`. העיצוב הזה הופך שגיאות לחלק מהחוזה של המתודה.

## הרגלים טובים

* תפסו את החריגה הספציפית ביותר שאפשר, ורק במקום שבו אתם באמת יכולים לעשות משהו מועיל.
* לעולם אל תשאירו בלוק `catch` ריק. כשלים שקטים קשים מאוד לדיבוג (debug).
* השתמשו בחריגות למצבים חריגים, לא לזרימת בקרה רגילה כמו סיום לולאה.
* בדקו קלטים מוקדם וזרקו `IllegalArgumentException` על ארגומנטים שגויים.

> **שימו לב:**
> - קריאה למתודה שזורקת חריגה checked בלי לטפל בה גורמת ל-`error: unreported exception AgeException; must be caught or declared to be thrown`.
> - תפיסה של חריגה checked שבלוק ה-`try` לעולם לא יכול לזרוק גורמת ל-`error: exception AgeException is never thrown in body of corresponding try statement`.
> - הצבת `catch (Exception e)` לפני catch ספציפי יותר גורמת ל-`error: exception NumberFormatException has already been caught`.
> - משתנה שהוגדר בתוך `try { }` אינו נראה אחרי הבלוק. הגדירו אותו לפני ה-`try` אם אתם צריכים אותו אחר כך.
> - כתיבת `catch (Exception e) { }` בלי לעשות כלום מסתירה באגים אמיתיים. לפחות הדפיסו את ההודעה.

## להמשיך הלאה

קראו את ה-stack trace של חריגה שלא נתפסה מתוך קריאה למתודה מקוננת. נסו `Integer.parseInt(null)` ו-`"abc".charAt(10)`, ובדקו אילו סוגי חריגות מתקבלים. עטפו חריגה אחת בחריגה אחרת בעזרת `new RuntimeException("context", e)`.

> **תורכם:** כתבו `AgeException extends Exception`, מתודה `safeParse` שחוזרת לערך ברירת מחדל על `NumberFormatException`, ומתודה `checkAge` שזורקת `AgeException` עבור גילאים שליליים. ב-`main`, תפסו את ה-`ArithmeticException` מחילוק באפס והדפיסו `Caught: / by zero`, והשתמשו ב-`try / catch / finally` סביב `checkAge(30)` ו-`checkAge(-5)`, כשהסיום הוא `Done`.
