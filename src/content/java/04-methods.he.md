---
title: "מתודות"
summary: "ארזו קוד במתודות לשימוש חוזר עם פרמטרים וערכי החזרה, כולל העמסה ורקורסיה."
hints:
  - "כותרת של מתודה כוללת: static, טיפוס ההחזרה, השם, והפרמטרים עם הטיפוסים שלהם. דוגמה: static int square(int n) { ... }. התוצאה נשלחת חזרה עם המילה return."
  - "square מחזירה n * n. ב-max אפשר להשתמש ב-if: if (a > b) { return a; } else { return b; }. isEven מחזירה n % 2 == 0. greet מחזירה \"Hello, \" + name + \"!\". ב-factorial, מקרה הבסיס הוא if (n == 0) { return 1; }."
  - "static int square(int n) { return n * n; }  static int max(int a, int b) { if (a > b) { return a; } return b; }  static boolean isEven(int n) { return n % 2 == 0; }  static String greet(String name) { return \"Hello, \" + name + \"!\"; }  static int factorial(int n) { if (n == 0) { return 1; } return n * factorial(n - 1); }"
quiz:
  - q: "מה פירוש המילה void בכותרת של מתודה?"
    options: ["המתודה לא מחזירה כלום", "אי אפשר לקרוא למתודה", "המתודה מחזירה טקסט", "למתודה אין שם"]
  - q: "מה ההבדל בין פרמטר (parameter) לארגומנט (argument)?"
    options: ["אין הבדל, זו אותה מילה", "פרמטר הוא המשתנה בכותרת המתודה, ארגומנט הוא הערך שמעבירים בקריאה", "ארגומנט נמצא בכותרת, פרמטר הוא הערך שמעבירים", "פרמטרים קיימים רק למחרוזות"]
  - q: "מהי העמסת מתודות (overloading)?"
    options: ["קריאה למתודה יותר מדי פעמים", "מתודה שהיא ארוכה מדי", "כמה מתודות עם אותו שם אבל רשימות פרמטרים שונות", "מתודה שקוראת לעצמה"]
  - q: "מה חייב להיות בכל מתודה רקורסיבית כדי שלא תרוץ לנצח?"
    options: ["המילה static", "מקרה בסיס שעוצר את הרקורסיה", "טיפוס החזרה void", "פרמטר מסוג String"]
messages:
  - "כתבו static int square(int n)."
  - "כתבו static boolean isEven(int n)."
  - "factorial חייבת לקרוא לעצמה עם n - 1 (רקורסיה)."
---

**מתודה** (method) היא בלוק קוד בעל שם שאפשר להריץ מתי שרוצים. מתודות מאפשרות לכתוב משהו פעם אחת ולהשתמש בו שוב, ומאפשרות לפצל בעיה גדולה לחלקים קטנים וברורים.

## הגדרה וקריאה למתודה

```java
static int square(int n) {
    return n * n;
}
```

נפרק את הכותרת:

* `static` פירושו שהמתודה שייכת למחלקה ואפשר לקרוא לה ישירות מ-`main` (עד שתלמדו על אובייקטים, כל המתודות שלכם יהיו `static`).
* `int` הוא **טיפוס ההחזרה** (return type): סוג הערך שהמתודה מחזירה. משתמשים ב-`void` אם היא לא מחזירה כלום.
* `square` הוא השם. לפי המוסכמה, שמות ב-Java מתחילים באות קטנה ומשתמשים ב-camelCase: `isEven`, `printReport`.
* `(int n)` היא **רשימת הפרמטרים**: הקלטים, כל אחד עם טיפוס. `n` הוא **פרמטר**, משתנה שקיים רק בתוך המתודה.
* `return n * n;` שולחת את התשובה חזרה למי שקרא למתודה ומסיימת את המתודה.

קוראים למתודה בכתיבת שמה והעברת ערכים (**ארגומנטים**):

```java
int result = square(5);
System.out.println(result);   // prints: 25
```

אפשר להשתמש בקריאה בכל מקום שבו מתאים ערך מהטיפוס הזה: `System.out.println(square(4) + 1);` מדפיסה `17`.

## מתודות void

מתודת `void` עושה משהו אבל לא מחזירה כלום. אין בה `return value;`:

```java
static void sayHi(String name) {
    System.out.println("Hi, " + name);
}
```

## כמה פרמטרים והחזרה מוקדמת

```java
static int max(int a, int b) {
    if (a > b) {
        return a;
    }
    return b;
}
```

כש-Java מריצה `return`, המתודה מסתיימת שם. לכן אחרי שה-`if` מחזיר את `a`, מגיעים לשורה `return b;` רק אם `a` לא היה גדול יותר. כל מסלול במתודה שיש לה טיפוס החזרה חייב להסתיים ב-`return`, אחרת המהדר מתלונן.

## העמסה (Overloading)

Java מאפשרת לתת לכמה מתודות אותו שם כל עוד רשימות הפרמטרים שלהן שונות. זה נקרא **העמסה**:

```java
static int add(int a, int b)       { return a + b; }
static double add(double a, double b) { return a + b; }
static int add(int a, int b, int c)  { return a + b + c; }
```

Java בוחרת את הגרסה שמתאימה לארגומנטים: `add(2, 3)` משתמשת בראשונה, `add(1.5, 2.5)` בשנייה. גם `System.out.println` עצמה מועמסת: יש גרסה ל-int-ים, גרסה ל-Strings, וכן הלאה.

## רקורסיה

מתודה יכולה לקרוא לעצמה. זה נקרא **רקורסיה** (recursion). היא צריכה **מקרה בסיס** (מתי לעצור) וצעד שמתקדם אליו:

```java
static int factorial(int n) {
    if (n == 0) {
        return 1;                 // base case
    }
    return n * factorial(n - 1);  // smaller problem
}
```

`factorial(3)` הופך ל-`3 * factorial(2)`, אחר כך ל-`3 * 2 * factorial(1)`, אחר כך ל-`3 * 2 * 1 * factorial(0)`, שהוא `3 * 2 * 1 * 1 = 6`. כל קריאה מחכה לזו שמתחתיה. אם שוכחים את מקרה הבסיס, הקריאות לא נעצרות ו-Java זורקת `StackOverflowError`.

## העברה לפי ערך

כשקוראים למתודה, Java נותנת לה **עותק** של כל ארגומנט פרימיטיבי. שינוי הפרמטר בתוך המתודה לא משנה את המשתנה של הקורא:

```java
static void tryToChange(int x) { x = 99; }
int a = 1;
tryToChange(a);
System.out.println(a);   // still 1
```

> **שימו לב:**
> - שכחת `return` במתודה עם טיפוס החזרה גורמת לשגיאה `error: missing return statement`.
> - החזרת טיפוס שגוי, כמו `return "5";` ממתודת `int`, גורמת לשגיאה `error: incompatible types: String cannot be converted to int`.
> - קריאה למתודה עם מספר ארגומנטים שגוי גורמת לשגיאה `error: method square in class Main cannot be applied to given types`.
> - קריאה למתודה שאינה static מתוך `static void main` גורמת לשגיאה `error: non-static method foo() cannot be referenced from a static context`. כרגע, הוסיפו `static` למתודות שלכם.
> - קוד שאחרי `return` לעולם לא ירוץ, והמהדר מדווח `error: unreachable statement`.

## להמשך

כתבו `static boolean isPrime(int n)`, או `static void printStars(int count)` שמדפיסה שורה של כוכביות. נסו לכתוב `fibonacci` ברקורסיה, ואז שימו לב כמה היא נעשית איטית בקלטים גדולים.

> **תורכם:** כתבו את חמש המתודות הסטטיות `square`, `max`, `isEven`, `greet` ו-`factorial` כך שמתודת `main` תדפיס את חמש השורות הצפויות. `factorial` חייבת להיות רקורסיבית.
