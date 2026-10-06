---
title: "מערכים ו-ArrayList"
summary: "אחסנו הרבה ערכים במערך בגודל קבוע או ב-ArrayList שיכול לגדול, ועברו עליהם בלולאה."
hints:
  - "למערך יש אורך קבוע שקוראים עם scores.length (בלי סוגריים). עברו עליו עם  for (int i = 0; i < scores.length; i++)  ושמרו משתנה לסכום רץ ומשתנה לערך הגבוה ביותר."
  - "ממוצע: (double) total / scores.length. לרשימה: ArrayList<String> names = new ArrayList<>(); ואז names.add(\"Ada\"); ו-names.remove(\"Linus\"); ולולאת for-each נראית כך  for (String n : names) { ... }."
  - "int total = 0; int highest = scores[0]; for (int i = 0; i < scores.length; i++) { total += scores[i]; if (scores[i] > highest) { highest = scores[i]; } }  ... System.out.println(\"Average: \" + (double) total / scores.length);  ArrayList<String> names = new ArrayList<>(); names.add(\"Ada\"); names.add(\"Linus\"); names.add(\"Grace\"); names.remove(\"Linus\"); for (String n : names) { System.out.println(\"Name: \" + n); } System.out.println(\"Count: \" + names.size());"
quiz:
  - q: "איזה אינדקס הוא האיבר הראשון של מערך?"
    options: ["1", "0", "-1", "זה תלוי בטיפוס"]
  - q: "איך מקבלים את מספר האיברים במערך int בשם a?"
    options: ["a.length()", "a.size()", "a.length", "length(a)"]
    explain: "למערכים יש שדה length (בלי סוגריים). ב-String משתמשים ב-length() וברשימות ב-size()."
  - q: "מה קורה אם קוראים את a[5] כש-a מכיל רק 5 איברים?"
    options: ["מוחזר 0", "מוחזר null", "Java זורקת ArrayIndexOutOfBoundsException", "המערך גדל"]
  - q: "מה היתרון העיקרי של ArrayList על פני מערך רגיל?"
    options: ["הוא תמיד מהיר יותר", "הוא יכול לגדול ולהתכווץ בזמן שהתוכנית רצה", "הוא יכול להחזיק כמה טיפוסים בו זמנית", "הוא לא צריך import"]
messages:
  - "השתמשו בלולאת for כדי לעבור על המערך."
  - "צרו ArrayList<String>."
  - "השתמשו ב-names.add(...) כדי להוסיף פריטים."
  - "השתמשו ב-names.remove(...) כדי להסיר פריט."
  - "השתמשו ב-names.size() לספירה."
---

לעיתים קרובות צריך להחזיק הרבה ערכים יחד: עשרה ציונים, רשימת שמות, הפיקסלים של תמונה. Java נותנת שני כלים עיקריים לכך: **מערך** (array), שהוא פשוט ובגודל קבוע, ו-**ArrayList**, שיכול לגדול ולהתכווץ.

## מערכים

מערך מחזיק מספר קבוע של ערכים מאותו **טיפוס**:

```java
int[] scores = {72, 95, 88};          // create with values
int[] zeros = new int[5];             // five ints, all start as 0
String[] days = new String[7];        // seven Strings, all start as null
```

ה-`[]` אחרי הטיפוס פירושו "מערך של". קוראים וכותבים איברים עם **אינדקס** בסוגריים מרובעים, והספירה מתחילה מ-**0**:

```java
System.out.println(scores[0]);   // prints: 72
scores[1] = 100;                 // change the second element
System.out.println(scores.length); // prints: 3
```

`scores.length` הוא מספר האיברים. שימו לב: במערכים אין סוגריים. האינדקס התקין האחרון הוא `length - 1`.

## מעבר על מערך בלולאה

הלולאה הקלאסית משתמשת באינדקס:

```java
for (int i = 0; i < scores.length; i++) {
    System.out.println(i + ": " + scores[i]);
}
```

כשלא צריך את האינדקס, לולאת **for-each** קצרה יותר וקשה יותר לטעות בה:

```java
for (int s : scores) {
    System.out.println(s);
}
```

קראו אותה כ"לכל int בשם `s` בתוך `scores`".

## תבניות נפוצות

כדי לסכם, מתחילים עם סכום 0 ומוסיפים כל איבר. כדי למצוא את הגדול ביותר, מתחילים עם האיבר הראשון ומחליפים אותו בכל פעם שרואים גדול יותר:

```java
int highest = scores[0];
for (int s : scores) {
    if (s > highest) highest = s;
}
```

כדי לחשב ממוצע, זכרו את חילוק השלמים! `total / scores.length` משליך את הספרות העשרוניות. המירו קודם צד אחד ל-`double`: `(double) total / scores.length`.

## ArrayList

מערך לא יכול לשנות את גודלו לעולם. כשלא יודעים מראש כמה פריטים יהיו, משתמשים ב-`ArrayList`. הוא נמצא ב-`java.util`, ולכן צריך לייבא אותו בראש הקובץ:

```java
import java.util.ArrayList;

ArrayList<String> names = new ArrayList<>();
names.add("Ada");              // add to the end
names.add("Linus");
System.out.println(names.get(0));    // Ada
System.out.println(names.size());    // 2
names.remove("Ada");           // remove by value
names.remove(0);               // remove by index
names.set(0, "Grace");         // replace an element (list must have one)
System.out.println(names.contains("Grace"));  // true
```

החלק `<String>` אומר איזה סוג דברים הרשימה מחזיקה. זה נקרא **טיפוס גנרי** (generic type), והמהדר מסרב לתת לכם להוסיף סוג שגוי. רשימות לא יכולות להחזיק פרימיטיבים כמו `int` ישירות, ולכן כותבים `ArrayList<Integer>` ו-Java ממירה אוטומטית (זה נקרא **boxing**).

אפשר להשתמש ב-for-each גם ברשימות: `for (String n : names) { ... }`.

## מערך או ArrayList?

השתמשו במערך כשהגודל ידוע וקבוע, או כשמהירות וזיכרון חשובים. השתמשו ב-`ArrayList` כמעט לכל דבר אחר. יש לו מתודות שימושיות (`add`, `remove`, `contains`, `isEmpty`, `clear`) שחסרות במערכים.

> **שימו לב:**
> - יציאה מגבולות המערך מקריסה את התוכנית: `Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException: Index 5 out of bounds for length 5`. עברו בלולאה עם `i < length`, לא `i <= length`.
> - ב-`ArrayList` השגיאה המקבילה היא `IndexOutOfBoundsException: Index 3 out of bounds for length 3`.
> - `names.length` או `scores.size()` גורמים לשגיאה `error: cannot find symbol`. מערכים משתמשים ב-`length`, רשימות ב-`size()`.
> - שכחת ה-import גורמת לשגיאה `error: cannot find symbol  class ArrayList`.
> - הסרת פריטים תוך כדי מעבר על רשימה עם for-each זורקת `ConcurrentModificationException`. אספו קודם, והסירו אחר כך.
> - ב-`ArrayList<Integer>`, `list.remove(1)` מסירה את האיבר שב**אינדקס** 1, לא את הערך 1.

## להמשך

מיינו מערך עם `java.util.Arrays.sort(scores)` והדפיסו אותו עם `Arrays.toString(scores)`. הפכו את הרשימה בלולאה מהסוף להתחלה. נסו מערך דו-ממדי: `int[][] grid = new int[3][3];`.

> **תורכם:** עבור המערך `scores` הדפיסו את הסכום, את הציון הגבוה ביותר ואת הממוצע (`Total: 395`, `Highest: 95`, `Average: 79.0`). אחר כך בנו `ArrayList<String>` עם Ada, Linus ו-Grace, הסירו את Linus, הדפיסו כל שם שנשאר כ-`Name: ...` בעזרת לולאת for-each, וסיימו עם `Count: 2` בעזרת `size()`.
