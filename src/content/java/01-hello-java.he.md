---
title: "שלום, Java"
summary: "כתבו את תוכנית ה-Java הראשונה שלכם ולמדו מה כל שורה במבנה שלה אומרת."
hints:
  - "הדפסה ב-Java נעשית בעזרת מתודה שקוראים לה עם נקודה: System.out.println. כל קריאה מדפיסה שורת טקסט אחת."
  - "הטקסט נכתב בתוך מרכאות כפולות, הקריאה עטופה בסוגריים, וכל פקודה מסתיימת בנקודה-פסיק. צריך שלוש פקודות כאלה."
  - "System.out.println(\"Hello, Java!\"); ואחריה System.out.println(\"Java runs on a virtual machine.\"); ואחריה System.out.println(\"Compile once, run anywhere.\");"
quiz:
  - q: "מהו שם המתודה שבה כל תוכנית Java מתחילה לרוץ?"
    options: ["start", "main", "run", "begin"]
    explain: "מכונת ה-Java הווירטואלית מחפשת את public static void main(String[] args) ומתחילה משם."
  - q: "מה ההבדל בין System.out.println(\"Hi\") ל-System.out.print(\"Hi\")?"
    options: ["println מוסיפה שורה חדשה אחרי הטקסט, print לא", "print מוסיפה שורה חדשה, println לא", "הן זהות לגמרי", "println מדפיסה באדום"]
  - q: "מה חייב לסיים כמעט כל פקודה ב-Java?"
    options: ["נקודתיים", "נקודה", "נקודה-פסיק", "כלום, Java משתמשת בירידות שורה"]
  - q: "במה הופך קוד המקור של Java לפני שהוא רץ?"
    options: ["קוד מכונה למחשב ספציפי אחד בלבד", "bytecode שמכונת ה-Java הווירטואלית מריצה", "דף אינטרנט", "אנגלית פשוטה"]
    explain: "המהדר (javac) מייצר bytecode, וה-JVM מריץ אותו בכל מערכת הפעלה."
messages:
  - "השתמשו ב-System.out.println(...) כדי להדפיס כל שורה."
---

בשיעור הזה תכתבו ותריצו את תוכנית ה-Java הראשונה שלכם, ותלמדו מה כל אחת מהמילים המוזרות שסביבה אומרת. Java משמשת לאפליקציות אנדרואיד, למערכות ענק בחברות, למשחקים כמו Minecraft ועוד הרבה, ולכן השורות הראשונות האלה הן תחילתה של דרך ארוכה.

## התוכנית הראשונה שלכם

לכל תוכנית Java בקורס הזה יש אותה צורה:

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, world!");
    }
}
```

כשמריצים אותה, היא מדפיסה:

```
Hello, world!
```

זה נראה כמו הרבה טקס בשביל שורת פלט אחת. בואו נפרק אותה חלק אחרי חלק.

## מה כל חלק אומר

* `public class Main { ... }` מצהירה על **מחלקה** (class) בשם `Main`. ב-Java כל הקוד חי בתוך מחלקות. חשבו על מחלקה כעל קופסה מסומנת שמחזיקה את הקוד שלכם. הקובץ נקרא `Main.java`, ו-Java מתעקשת שלמחלקה ציבורית (public) יהיה אותו שם כמו לקובץ שלה.
* `public static void main(String[] args) { ... }` היא **מתודת ה-main**. מתודה (method) היא בלוק הוראות בעל שם. כשמריצים תוכנית Java, מכונת ה-Java הווירטואלית (JVM) מחפשת בדיוק את המתודה הזאת ומתחילה משם.
  * `public` פירושו "כל אחד רשאי לקרוא לזה".
  * `static` פירושו "זה שייך למחלקה עצמה, אין צורך ליצור קודם אובייקט". תבינו את זה לעומק בשיעור על מחלקות.
  * `void` פירושו "המתודה הזאת לא מחזירה כלום".
  * `String[] args` היא רשימה של ערכי טקסט שהמשתמש יכול להעביר משורת הפקודה. נתעלם ממנה כרגע, אבל היא חייבת להיות שם.
* `System.out.println("...");` מדפיסה טקסט ואז עוברת לשורה חדשה. `System` היא מחלקה מובנית, `out` הוא זרם הפלט שלה, ו-`println` ("print line", הדפס שורה) היא מתודה של הזרם הזה.
* **הסוגריים המסולסלים** `{ }` מסמנים איפה בלוק מתחיל ואיפה הוא נגמר. לכל `{` צריך `}` תואם.
* **נקודה-פסיק** `;` מסיימת פקודה (statement), כמו שנקודה מסיימת משפט.

## קומפילציה והרצה

Java היא שפה **מקומפלת** (compiled). תוכנית בשם מהדר (`javac`) קוראת את קובץ ה-`.java` שלכם ובודקת אם יש בו טעויות. אם הכול תקין, היא יוצרת קובץ `.class` מלא ב-**bytecode**. אחר כך הפקודה `java` מפעילה את ה-JVM, שמריץ את ה-bytecode. מכיוון שה-JVM קיימת ל-Windows, ל-macOS ול-Linux, אותו bytecode רץ בכל מקום. זה הרעיון המפורסם "compile once, run anywhere" (מקמפלים פעם אחת, מריצים בכל מקום). באתר הזה שלבי הקומפילציה וההרצה קורים עבורכם כשלוחצים על Run.

## print לעומת println

`println` מסיימת את השורה, `print` לא:

```java
System.out.print("Hello, ");
System.out.print("Java");
System.out.println("!");
```

זה מדפיס `Hello, Java!` בשורה אחת, כי רק הקריאה האחרונה עוברת לשורה הבאה.

## הערות

טקסט אחרי `//` הוא **הערה** (comment). Java מתעלמת ממנו, והוא רק פתק לבני אדם:

```java
// this line is ignored by the compiler
System.out.println("This line runs"); // so is this part
```

> **שימו לב:**
> - נקודה-פסיק חסרה גורמת לשגיאה `error: ';' expected`. המהדר מצביע על סוף השורה שצריכה אותה.
> - Java היא **רגישה לאותיות גדולות וקטנות**. כתיבת `system.out.println` או `System.out.Println` גורמת לשגיאה `error: package system does not exist` או `cannot find symbol`.
> - מרכאות בודדות מיועדות לתו בודד. `System.out.println('Hello')` גורמת לשגיאה `error: unclosed character literal`. טקסט צריך מרכאות כפולות.
> - אם הקובץ נקרא `Main.java` אבל המחלקה היא `Program`, מקבלים `error: class Program is public, should be declared in a file named Program.java`. באתר הזה תמיד השאירו את שם המחלקה `Main`.
> - סוגר מסולסל סוגר חסר גורם לשגיאה `error: reached end of file while parsing`.

## להמשך

נסו להדפיס שורה ריקה עם `System.out.println();`, או השתמשו ב-`\n` בתוך מחרוזת (`"one\ntwo"`) כדי לראות איך הטקסט נשבר. נסו למחוק נקודה-פסיק אחת בכוונה כדי לראות את הודעת המהדר, ואז החזירו אותה. קריאת הודעות שגיאה היא מיומנות שתשתמשו בה כל יום.

> **תורכם:** בתוך `main`, השתמשו ב-`System.out.println` שלוש פעמים כדי להדפיס בדיוק את שלוש השורות האלה: `Hello, Java!`, `Java runs on a virtual machine.` ו-`Compile once, run anywhere.`
