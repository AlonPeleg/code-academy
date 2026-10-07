---
title: "למבדות וסטרימים"
summary: "העבירו התנהגות כלמבדה ועבדו על אוספים עם צינורות של filter, map ו-collect."
hints:
  - "למבדה היא מתודה זעירה בלי שם: (x) -> x * 2. צינור (pipeline) של stream נקרא משמאל לימין: nums.stream().filter(...).map(...).collect(...). כל שלב מקבל למבדה."
  - "filter(n -> n % 2 == 0).map(n -> n * n).collect(Collectors.toList()). לסכום: nums.stream().mapToInt(n -> n).sum(). מיון: names.sort(Comparator.comparing(s -> s.length())) או (a, b) -> a.length() - b.length()."
  - "List<Integer> sq = nums.stream().filter(n -> n % 2 == 0).map(n -> n * n).collect(Collectors.toList());  int sum = nums.stream().mapToInt(n -> n).sum();  names.sort((a, b) -> a.length() - b.length());  Arrays.asList(\"Grace\", \"Ada\", \"Linus\", \"Alan\").stream().map(s -> s.toUpperCase()).collect(Collectors.joining(\", \"));  Function<Integer, Integer> doubler = x -> x * 2; doubler.apply(7)"
quiz:
  - q: "מהו ביטוי למבדה?"
    options: ["מחלקה עם הרבה שדות", "פונקציה קצרה בלי שם שאפשר להעביר הלאה, כמו x -> x * 2", "סוג של לולאה", "שגיאת קומפילציה"]
  - q: "מה צינור של stream לא עושה כברירת מחדל?"
    options: ["מחזיר תוצאה חדשה", "משנה את הרשימה המקורית", "מאפשר שלבי filter ו-map", "מסתיים בפעולה סופית כמו collect או sum"]
    explain: "סטרימים לא משנים את המקור שלהם. הם מפיקים תוצאות חדשות, וזו אחת הסיבות שהם בטוחים לשימוש."
  - q: "איזו מהפעולות האלה היא פעולה סופית (terminal) שבאמת מפעילה את הצינור?"
    options: ["filter", "map", "sorted", "collect"]
    explain: "filter, map ו-sorted הן פעולות ביניים (עצלניות). שום דבר לא רץ עד שפעולה סופית כמו collect, sum, forEach או count מופעלת."
  - q: "אפשר להשתמש בלמבדה במקום ש-Java מצפה ל..."
    options: ["כל מחלקה", "ממשק פונקציונלי (ממשק עם מתודה מופשטת אחת)", "מערך", "חבילה"]
messages:
  - "התחילו צינור עם .stream()."
  - "השתמשו ב-.filter(...) כדי לשמור את המספרים הזוגיים."
  - "השתמשו ב-.map(...) כדי לשנות כל איבר."
  - "כתבו לפחות למבדה אחת עם החץ ->."
  - "השתמשו ב-Collectors כדי לאסוף את התוצאות."
  - "הצהירו על doubler כ-Function<Integer, Integer>."
---

Java המודרנית מאפשרת להעביר **התנהגות** בקלות כמו נתונים. **למבדות** (lambdas) הן פונקציות אנונימיות קצרות, ו-**סטרימים** (streams) משתמשים בהן כדי לעבד אוספים בצינור ברור, שלב אחר שלב. זה הסגנון שתפגשו כמעט בכל בסיס קוד מודרני של Java.

## ממשקים פונקציונליים

הרבה ממשקי API של Java מצפים ל"קטע קוד להרצה". לפני Java 8 היה צריך לכתוב מחלקה שלמה בשביל זה. עכשיו כותבים **למבדה**:

```java
(parameters) -> expression
```

דוגמאות:

```java
x -> x * 2                      // one parameter, returns x * 2
(a, b) -> a + b                 // two parameters
(String s) -> s.length()        // explicit parameter type
s -> { System.out.println(s); } // a block body with statements
```

אפשר להשתמש בלמבדה בכל מקום ש-Java מצפה ל**ממשק פונקציונלי**, כלומר ממשק עם מתודה מופשטת אחת בדיוק. הספרייה הסטנדרטית מספקת הרבה כאלה ב-`java.util.function`:

| ממשק | מתודה | משמעות |
|---|---|---|
| `Function<T, R>` | `R apply(T t)` | הופכת T ל-R |
| `Predicate<T>` | `boolean test(T t)` | שאלת כן/לא |
| `Consumer<T>` | `void accept(T t)` | עושה משהו עם T |
| `Supplier<T>` | `T get()` | מפיק T |

```java
Function<Integer, Integer> doubler = x -> x * 2;
System.out.println(doubler.apply(7));   // 14
Predicate<String> empty = s -> s.isEmpty();
System.out.println(empty.test(""));     // true
```

למבדות יכולות להשתמש במשתנים מקומיים מבחוץ, אבל רק אם המשתנים האלה אף פעם לא משתנים אחר כך (הם חייבים להיות **effectively final**).

## הפניות למתודות

כשלמבדה רק קוראת למתודה קיימת אחת, אפשר לכתוב אותה קצר יותר עם `::`:

```java
names.forEach(s -> System.out.println(s));
names.forEach(System.out::println);        // same thing
```

`String::toUpperCase`, `String::length` ו-`Integer::sum` הן דוגמאות נפוצות.

## סטרימים

**Stream** הוא רצף של איברים שמעבדים בצינור. לצינור יש שלושה חלקים:

1. **מקור**: `list.stream()` או `Arrays.stream(array)`;
2. אפס או יותר **פעולות ביניים** שמחזירות stream נוסף: `filter`, `map`, `sorted`, `distinct`, `limit`;
3. **פעולה סופית** אחת שמפיקה את התוצאה: `collect`, `sum`, `count`, `forEach`, `anyMatch`, `max`.

```java
List<Integer> nums = Arrays.asList(5, 12, 8, 21);

List<Integer> squares = nums.stream()
        .filter(n -> n % 2 == 0)       // keep 12, 8
        .map(n -> n * n)               // 144, 64
        .collect(Collectors.toList()); // gather into a list
System.out.println(squares);           // prints: [144, 64]
```

קראו את זה כמו משפט: "קחו את המספרים, שמרו את הזוגיים, העלו כל אחד בריבוע, אספו לרשימה". `filter` מקבלת Predicate ושומרת את האיברים שעבורם הוא true. `map` מקבלת Function ומחליפה כל איבר בתוצאה שלה. הטיפוס יכול להשתנות: `names.stream().map(s -> s.length())` הופכת מחרוזות ל-Integer.

### מספרים וחיבור

עבור מספרים פרימיטיביים, `mapToInt(...)` נותנת `IntStream` עם מתודות נוחות:

```java
int sum = nums.stream().mapToInt(n -> n).sum();
double avg = nums.stream().mapToInt(n -> n).average().orElse(0);
```

כדי לבנות טקסט, משתמשים ב-`Collectors.joining`:

```java
String s = names.stream().map(String::toUpperCase).collect(Collectors.joining(", "));
```

### עצלנות

פעולות ביניים הן **עצלניות** (lazy): שום דבר לא קורה עד שהפעולה הסופית רצה, והאיברים זורמים דרך כל הצינור אחד אחד. כך `limit(3)` יכולה לעצור מוקדם, אפילו על מקור עצום או אינסופי. אפשר להשתמש ב-stream רק **פעם אחת**. סטרימים אף פעם לא משנים את האוסף המקורי, הם מפיקים תוצאות חדשות.

## מיון עם למבדה

`List.sort` מקבלת **Comparator**, שהוא בעצמו ממשק פונקציונלי:

```java
names.sort((a, b) -> a.length() - b.length());
names.sort(Comparator.comparing(s -> s.length()));   // same idea
```

המיון הוא **יציב** (stable): איברים שנחשבים שווים שומרים על הסדר היחסי המקורי שלהם, וזה הופך את התוצאה לצפויה.

## לולאה או stream?

סטרימים מצטיינים במשימות של "סנן, המר, אסוף". לולאה רגילה עדיין יכולה להיות ברורה יותר עבור לוגיקה מורכבת עם יציאות מוקדמות או שינוי של כמה משתנים. אף אחד מהם לא טוב יותר תמיד. בחרו באחד שחבר צוות יוכל לקרוא הכי מהר.

> **שימו לב:**
> - שימוש במשתנה מבחוץ ששיניתם אחר כך גורם ל-`error: local variables referenced from a lambda expression must be final or effectively final`.
> - שימוש חוזר ב-stream שכבר נצרך זורק `IllegalStateException: stream has already been operated upon or closed`.
> - שכחת הפעולה הסופית פירושה שבכלל לא קורה כלום. צינור שמסתיים ב-`.map(...)` לא עושה שום עבודה.
> - `Arrays.asList(...)` מחזירה רשימה בגודל קבוע: `add` או `remove` זורקות `UnsupportedOperationException`. עטפו אותה ב-`new ArrayList<>(...)` אם צריך לשנות אותה. `List.of(...)` מחמירה אפילו יותר (אי אפשר לשנות אותה בכלל).
> - למבדות עם גוף של בלוק צריכות `return` עבור פונקציות שמחזירות ערך: `x -> { return x * 2; }`.

## להמשיך הלאה

נסו `sorted()`, `distinct()`, `limit(2)`, `count()` ו-`anyMatch(...)` על רשימת המספרים. השתמשו ב-`Collectors.groupingBy(String::length)` כדי לקבץ את השמות לפי אורך. השוו בין `IntStream.rangeClosed(1, 5).sum()` לבין אותה משימה בלולאה.

> **תורכם:** בעזרת `nums`, השתמשו ב-stream כדי להדפיס `Even squares: [144, 64, 256, 100]`, ואז השתמשו ב-`mapToInt` כדי להדפיס `Sum: 75`. מיינו את `names` לפי אורך עם למבדה או `Comparator.comparing` (`Sorted: [Ada, Alan, Grace, Linus]`), הפכו את הסדר המקורי לאותיות גדולות וחברו אותו עם `Collectors.joining(", ")`, ולבסוף צרו `Function<Integer, Integer>` בשם `doubler` והדפיסו `Doubled: 14`.
