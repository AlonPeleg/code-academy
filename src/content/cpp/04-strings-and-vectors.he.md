---
title: "מחרוזות ווקטורים"
summary: "עבדו עם טקסט ועם רשימות שיכולות לגדול."
hints:
  - "מחרוזות מצרפים לפלט עם << בדיוק כמו טקסט. לווקטור יש מתודות: push_back מוסיף פריט ו-size אומר כמה יש."
  - "scores.push_back(70); מוסיף 70 בסוף. אחר כך עברו על הווקטור בלולאה (for (int s : scores) { ... }) ושמרו סכום מצטבר ב-int שמתחיל ב-0."
  - "cout << \"Hello, \" << name << \"!\" << endl;   scores.push_back(70);   cout << \"Scores: \" << scores.size() << endl;   int total = 0; for (int s : scores) { total += s; }   cout << \"Total: \" << total << endl;"
messages:
  - "הוסיפו את הציון החדש עם scores.push_back(...)."
  - "השתמשו בלולאה כדי לסכום את הציונים."
  - "השתמשו ב-scores.size() עבור מספר הציונים."
quiz:
  - q: "איזה סוג מחזיק טקסט ב-C++?"
    options: ["text", "char[] בלבד", "string"]
  - q: "איך מוסיפים פריט לסוף של וקטור?"
    options: ["push_back", "append", "add"]
  - q: "מה עושה  for (int s : scores)  ?"
    options: ["מגדיר פונקציה", "עובר בלולאה על כל פריט ב-scores", "ממיין את scores"]
  - q: "מה הערך של  scores[0]  עבור  vector<int> scores = {80, 90, 100};  ?"
    options: ["90", "100", "80"]
    explain: "הספירה מתחילה ב-0, ולכן אינדקס 0 הוא הפריט הראשון."
---

שני סוגים שתשתמשו בהם כמעט בכל תוכנית C++: `string` לטקסט ו-`vector` לרשימה שיכולה לגדול. לשניהם יש מתודות מובנות, כך שאין צורך לנהל זיכרון בעצמכם כמו ב-C.

## מחרוזות

כללו את קובץ הכותרת והגדירו משתנה מסוג מחרוזת (string). אפשר לחבר מחרוזות עם `+` ולבקש את האורך:

```cpp
#include <string>

string name = "Ava";
string greeting = "Hello, " + name + "!";
cout << greeting << endl;            // prints: Hello, Ava!
cout << name.length() << endl;       // prints: 3
cout << name[0] << endl;             // prints: A   (first letter, index 0)
```

**מתודה** (method) היא פונקציה ששייכת לאובייקט (object) וקוראים לה עם נקודה: `name.length()`. האינדקסים מתחילים ב-**0**. (בשיעור הבא תכירו עוד הרבה מתודות של מחרוזות.)

## וקטורים

`vector<int>` הוא רשימה של מספרים שלמים שיכולה לגדול ולהתכווץ. סוג הפריטים נכתב בין הסוגריים המשולשים, ואפשר להתחיל אותו עם ערכים:

```cpp
#include <vector>

vector<int> numbers = {1, 2, 3};
numbers.push_back(4);                 // add to the end: 1 2 3 4
cout << numbers.size() << endl;       // prints: 4
cout << numbers[0] << endl;           // prints: 1
numbers[1] = 20;                      // change an item: 1 20 3 4
```

| קוד | משמעות |
| --- | --- |
| `v.push_back(x)` | מוסיף את `x` בסוף |
| `v.size()` | כמה פריטים יש |
| `v[i]` | הפריט באינדקס `i` (הראשון הוא 0) |
| `v.empty()` | אמת אם אין פריטים |
| `v.pop_back()` | מסיר את הפריט האחרון |

בניגוד למערך (array) של C, וקטור יודע מה הגודל שלו ויכול לגדול.

## מעבר בלולאה על וקטור

**לולאת for מבוססת טווח** (range-based) עוברת על כל פריט בתורו:

```cpp
int total = 0;
for (int n : numbers) {     // read: "for each int n in numbers"
    total += n;
}
```

`n` הוא עותק של הפריט הנוכחי. גם הלולאה הקלאסית עם אינדקס עובדת:

```cpp
for (int i = 0; i < numbers.size(); i++) {
    cout << numbers[i] << endl;
}
```

> **שימו לב:**
> - `numbers[10]` בווקטור עם 4 פריטים לא בודק את האינדקס. הקוד מתקמפל, ואז קורא זבל או קורס. השתמשו ב-`numbers.at(10)` כדי לקבל שגיאה מסודרת (`terminate called after throwing an instance of 'std::out_of_range'`).
> - שכחת קובץ הכותרת: `error: 'vector' was not declared in this scope`. צריך `#include <vector>` (ו-`<string>` למחרוזות).
> - שכחת `<int>`: הקוד `vector scores;` גורם ל-`error: missing template arguments before 'scores'`.
> - כתיבה של `"Hello, " + "Ava"` (שני טקסטים פשוטים במרכאות) לא מתקמפלת: `error: invalid operands of types 'const char [8]' and 'const char [4]' to binary 'operator+'`. לפחות אחד הצדדים חייב להיות משתנה מסוג `string`.
> - `size()` הוא מספר ללא סימן, ולכן השוואה שלו ל-`int` שלילי גורמת לאזהרת signed/unsigned.

## להמשיך הלאה

השתמשו ב-`pop_back()` כדי להסיר את הציון האחרון והדפיסו שוב את הגודל. אחר כך נסו `for (int i = scores.size() - 1; i >= 0; i--)` כדי להדפיס את הרשימה מהסוף להתחלה.

> **תורכם:** עקבו אחרי ההערות הממוספרות בעורך: ברכו את `name`, הוסיפו 70 עם `push_back`, הדפיסו כמה ציונים יש והדפיסו את הסכום שלהם.
