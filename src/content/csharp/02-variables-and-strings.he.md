---
title: "משתנים ומחרוזות"
summary: "שמרו ערכים במשתנים עם טיפוס ובנו טקסט בעזרת אינטרפולציה של מחרוזות."
hints:
  - "משתנה הוא קופסה עם שם עבור ערך. כבר יש לכם את name ואת age. הניחו $ לפני מחרוזת כדי שתוכלו להכניס לתוכה משתנים."
  - "אינטרפולציה נראית כך: $\"Hello, {name}!\". כדי להגדיל את age באחד אפשר לכתוב age = age + 1; (או age++;)."
  - "Console.WriteLine($\"Hello, {name}!\");  ואז  age = age + 1;  ואז  Console.WriteLine($\"{name} is now {age}\");"
messages:
  - "השתמשו באינטרפולציה של מחרוזות עם המשתנה name, למשל $\"Hello, {name}!\"."
  - "הדפיסו את המשתנה age בתוך סוגריים מסולסלים."
quiz:
  - q: "איזה טיפוס מחזיק טקסט?"
    options: ["text", "str", "char[]", "string"]
  - q: "מה עושה $ לפני מחרוזת?"
    options: ["הופך אותה למחיר", "מאפשר להכניס {משתנים} לתוך הטקסט", "הופך אותה לפרטית", "גורם לה לרוץ מהר יותר"]
  - q: "איזה טיפוס מתאים ביותר למספר 9.99?"
    options: ["int", "bool", "double", "string"]
    explain: "int מחזיק רק מספרים שלמים. double מחזיק מספרים עם נקודה עשרונית."
  - q: "מה הערך של  10 / 4  כששני המספרים הם int?"
    options: ["2.5", "2", "3", "זו שגיאה"]
    explain: "חילוק של שני int זורק את השארית, ולכן התשובה היא המספר השלם 2."
---

תוכניות צריכות לזכור דברים: שם, ניקוד, מחיר. **משתנה** (variable) הוא קופסה עם שם שמחזיקה ערך. בשיעור הזה תיצרו משתנים, תשנו אותם ותשזרו אותם בתוך משפטים.

## משתנים עם טיפוס

C# היא שפה עם **טיפוסים סטטיים** (statically typed). פירוש הדבר שלכל משתנה יש **טיפוס** (type) שאומר איזה סוג ערך הוא יכול להחזיק, ואת הטיפוס כותבים כשיוצרים את המשתנה.

```csharp
string city = "Haifa";      // text
int population = 280000;    // whole number
double price = 9.99;        // number with a decimal point
bool isOpen = true;         // true or false
char grade = 'A';           // a single character, in single quotes
```

קראו את `int population = 280000;` כך: "צרו משתנה מהטיפוס `int`, קראו לו `population`, והניחו בו את `280000`". סימן `=` בודד פירושו **השמה**, לא "שווה".

אחרי שמשתנה קיים אפשר לשנות את הערך שלו, אבל לא את הטיפוס:

```csharp
population = 281000;     // fine
population = "lots";     // error: a string does not fit in an int
```

## var

אם הערך מבהיר את הטיפוס, אפשר לתת למהדר להבין לבד עם `var`:

```csharp
var score = 10;       // still an int
var title = "Hi";     // still a string
```

`var` אינו "כל טיפוס". אחרי ההשמה הראשונה הטיפוס קבוע לתמיד.

## שינוי ערכים

```csharp
int lives = 3;
lives = lives - 1;   // 2
lives -= 1;          // 1  (shortcut for lives = lives - 1)
lives++;             // 2  (add one)
```

האופרטורים האריתמטיים הם `+ - * /` ו-`%` (שארית). היזהרו: כש**שני** הצדדים הם `int`, החילוק `/` זורק את הספרות אחרי הנקודה, ולכן `7 / 2` הוא `3`. השתמשו ב-`double` (`7.0 / 2` הוא `3.5`) אם אתם צריכים ספרות אחרי הנקודה.

## אינטרפולציה של מחרוזות

אפשר להדביק טקסט עם `+`, אבל יש דרך נקייה יותר. הניחו `$` לפני המרכאה הפותחת וכתבו משתנים בתוך `{curly braces}` (סוגריים מסולסלים):

```csharp
string city = "Haifa";
int population = 280000;
Console.WriteLine($"{city} has {population} people");
// prints: Haifa has 280000 people
```

כל מה שבתוך הסוגריים מחושב, ולכן גם `$"Next year: {population + 1000}"` עובד.

> **שימו לב:**
> - שכחת ה-`$`: הקוד `"Hello, {name}!"` מדפיס את הסוגריים כפשוטם, `Hello, {name}!`.
> - הכנסת מספר עשרוני ל-int: `int x = 3.5;` גורמת ל-`error CS0266: Cannot implicitly convert type 'double' to 'int'`.
> - שימוש במשתנה לפני שנתתם לו ערך גורם ל-`error CS0165: Use of unassigned local variable`.
> - טקסט חייב להיות במרכאות כפולות. `string s = 'hi';` היא שגיאה כי גרשיים בודדים מיועדים רק ל-`char` אחד.
> - אי אפשר להגדיר את אותו שם משתנה פעמיים באותו בלוק: `error CS0128: A local variable named 'age' is already defined`.

## להמשיך הלאה

הוסיפו משתנה `double height = 1.68;` והדפיסו אותו בתוך משפט. אחר כך נסו `Console.WriteLine(7 / 2);` ו-`Console.WriteLine(7.0 / 2);` והשוו.

> **תורכם:** הדפיסו `Hello, Ava!` בעזרת המשתנה `name`, הוסיפו 1 ל-`age`, ואז הדפיסו `Ava is now 21` בעזרת שני המשתנים. השתמשו באינטרפולציה, לא בשמות או במספרים שנכתבו ידנית.
