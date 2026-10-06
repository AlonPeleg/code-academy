---
title: "משתנים, טיפוסים ומחרוזות"
summary: "אחסנו מספרים, טקסט וערכי אמת/שקר במשתנים עם טיפוס, ועבדו עם מתודות של String."
hints:
  - "Java דורשת לציין את הטיפוס של כל משתנה: String לטקסט, int למספרים שלמים, double למספרים עשרוניים. הצורה היא  type name = value;"
  - "String name = \"Ada\"; int age = 36; double price = 4.5; int count = 3; double total = price * count;  ואז מדפיסים עם System.out.println(name + \" is \" + age + \" years old\");"
  - "System.out.println(name + \" is \" + age + \" years old\");  System.out.println(\"Total: \" + total);  System.out.println(name.toUpperCase() + \" has \" + name.length() + \" letters\");"
quiz:
  - q: "באיזה טיפוס תבחרו כדי לאחסן את המספר 42?"
    options: ["String", "int", "boolean", "char"]
  - q: "מה התוצאה של 7 / 2 כששני המספרים הם int?"
    options: ["3.5", "4", "3", "שגיאה"]
    explain: "חילוק שלמים משליך את השארית, ולכן 7 / 2 הוא 3. השתמשו ב-7 / 2.0 כדי לקבל 3.5."
  - q: "איזו מהאפשרויות הבאות היא דרך תקינה להצהיר על משתנה טקסט?"
    options: ["string s = \"hi\";", "String s = 'hi';", "String s = \"hi\";", "text s = \"hi\";"]
    explain: "הטיפוס נכתב String עם S גדולה, וטקסט משתמש במרכאות כפולות."
  - q: "איך מגלים כמה תווים יש ב-String בשם s?"
    options: ["s.length", "s.size", "length(s)", "s.length()"]
messages:
  - "הצהירו על משתנה הטקסט עם: String name = ...;"
  - "הצהירו על משתנה של מספר שלם: int age = ...;"
  - "הצהירו על total כ-double (טיפוס עשרוני)."
  - "השתמשו במתודה toUpperCase() של String."
  - "השתמשו במתודה length() של String (עם סוגריים)."
---

תוכניות זוכרות דברים ב**משתנים** (variables). בשיעור הזה תלמדו איך Java מאחסנת מספרים, טקסט וערכי אמת/שקר, למה Java מחייבת לציין את הטיפוס של כל אחד מהם, ואיך עושים דברים שימושיים עם טקסט.

## למשתנים יש טיפוסים

Java היא שפה עם **טיפוסים סטטיים** (statically typed). זה אומר שלכל משתנה יש טיפוס שכותבים כשיוצרים אותו, והטיפוס אף פעם לא יכול להשתנות. הצורה היא:

```java
type name = value;
```

הטיפוסים הנפוצים ביותר:

| טיפוס | מה הוא מחזיק | דוגמה |
|---|---|---|
| `int` | מספרים שלמים | `int age = 36;` |
| `double` | מספרים עשרוניים | `double price = 4.5;` |
| `boolean` | `true` או `false` | `boolean done = false;` |
| `char` | תו בודד אחד, במרכאות בודדות | `char grade = 'A';` |
| `String` | טקסט, במרכאות כפולות | `String name = "Ada";` |

שימו לב ש-`String` מתחיל באות גדולה. הוא לא אחד הטיפוסים הבסיסיים אלא מחלקה (class), ולכן יש לו מתודות שאפשר לקרוא להן.

למה טיפוסים עוזרים? כי המהדר יכול לתפוס טעויות מטופשות עוד לפני שהתוכנית רצה. אם תכתבו `int age = "thirty";` Java תעצור אתכם מיד.

## חישובים

אפשר להשתמש ב-`+ - * /` וב-`%` (השארית). היזהרו: כששני הצדדים הם `int`, התשובה היא `int` וכל חלק עשרוני נחתך.

```java
int a = 7 / 2;        // 3, not 3.5
double b = 7 / 2.0;   // 3.5, because one side is a double
int c = 7 % 2;        // 1, the remainder
```

כדי לשנות משתנה, מבצעים השמה מחדש בלי לחזור על הטיפוס: `age = age + 1;` או הצורות הקצרות `age += 1;` ו-`age++;`.

## חיבור טקסט

האופרטור `+` מחבר String עם כל דבר אחר:

```java
String name = "Ada";
int age = 36;
System.out.println(name + " is " + age + " years old");
// prints: Ada is 36 years old
```

Java הופכת את המספר לטקסט בשקט. אבל היזהרו מהסדר: `1 + 2 + "x"` הוא `"3x"` כי המספרים נחברים קודם, אבל `"x" + 1 + 2` הוא `"x12"`.

## מתודות של String

String הוא אובייקט, ולאובייקטים יש **מתודות**, פעולות שקוראים להן עם נקודה וסוגריים:

```java
String s = "Hello";
s.length()          // 5
s.toUpperCase()     // "HELLO"
s.toLowerCase()     // "hello"
s.charAt(1)         // 'e'  (counting starts at 0)
s.substring(1, 3)   // "el" (from index 1 up to, not including, 3)
s.contains("ell")   // true
s.equals("Hello")   // true
```

מחרוזות הן **בלתי ניתנות לשינוי** (immutable): מתודה כמו `toUpperCase()` לא משנה את `s`, היא מחזירה String חדש. אם רוצים לשמור את התוצאה, מאחסנים אותה: `s = s.toUpperCase();`.

## קבועים ו-var

אם שמים `final` לפני משתנה, הוא הופך לקבוע שאי אפשר לשנות: `final int MAX = 10;`. מאז Java 10 אפשר גם לכתוב `var x = 5;` ולתת למהדר להבין את הטיפוס, אבל הטיפוס עדיין קבוע ברגע שנבחר. בקורס הזה אנחנו בדרך כלל כותבים את הטיפוס במפורש, כי זה הופך את הקוד לקל יותר לקריאה בזמן הלמידה.

> **שימו לב:**
> - השוואת Strings עם `==` היא באג קלאסי. השתמשו ב-`s.equals("Hello")` במקום. `==` בודק אם שני משתנים מצביעים על אותו אובייקט בדיוק, לא אם הטקסט זהה.
> - השמת מספר עשרוני ל-int, `int x = 4.5;`, גורמת לשגיאה `error: incompatible types: possible lossy conversion from double to int`.
> - `length` בלי סוגריים על String גורם לשגיאה `error: cannot find symbol`. ב-String זה `length()` (אבל `length` בלי סוגריים במערכים, שיגיעו בהמשך).
> - שימוש במשתנה לפני שנתנו לו ערך גורם לשגיאה `error: variable x might not have been initialized`.
> - הצהרה על אותו שם פעמיים באותו תחום גורמת לשגיאה `error: variable x is already defined in method main(String[])`.

## להמשך

שנו את `age` ל-`double` והדפיסו אותו. נסו `name.charAt(0)` ו-`name.substring(1)`, ובנו את המחרוזת `"da"` מתוך `"Ada"`. נסו לחלק שני int-ים, ואז המירו אחד מהם ל-double בעזרת המרה (cast): `(double) a / b`.

> **תורכם:** הצהירו על `String name = "Ada"`, `int age = 36`, `double price = 4.5`, `int count = 3` ו-`double total = price * count`. הדפיסו `Ada is 36 years old`, אחר כך `Total: 13.5`, ואז את השם באותיות גדולות ואת אורכו כמו `ADA has 3 letters` בעזרת `toUpperCase()` ו-`length()`.
