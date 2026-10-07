---
title: "מיון, חיפוש וספירה"
summary: "נותנים לספרייה הסטנדרטית לעשות את העבודה עם sort, find, count ושות'."
hints:
  - "קבצי ה-header כבר כלולים. כל הפונקציות האלה עובדות על טווח (range) שניתן בעזרת שני איטרטורים: v.begin() (ההתחלה) ו-v.end() (מיד אחרי הפריט האחרון)."
  - "sort(v.begin(), v.end()); find(v.begin(), v.end(), 8) נותנת איטרטור, חסרו ממנו v.begin() כדי לקבל אינדקס; count(v.begin(), v.end(), 3); accumulate(v.begin(), v.end(), 0); *max_element(v.begin(), v.end()); מיון יורד מוסיף greater<int>() כארגומנט שלישי."
  - "sort(v.begin(), v.end()); show(\"Sorted\", v);   auto it = find(v.begin(), v.end(), 8); cout << \"8 is at index \" << (it - v.begin()) << endl;   cout << \"Threes: \" << count(v.begin(), v.end(), 3) << endl;   cout << \"Sum: \" << accumulate(v.begin(), v.end(), 0) << endl;   cout << \"Largest: \" << *max_element(v.begin(), v.end()) << endl;   sort(v.begin(), v.end(), greater<int>()); show(\"Descending\", v);"
messages:
  - "השתמשו ב-sort(v.begin(), v.end())."
  - "השתמשו ב-find כדי לאתר את ה-8."
  - "השתמשו ב-count כדי לספור את ה-3."
  - "השתמשו ב-accumulate עבור הסכום."
  - "השתמשו ב-max_element עבור הגדול ביותר."
quiz:
  - q: "מה v.begin() ו-v.end() מתארים?"
    options: ["הערך הראשון והאחרון", "תחילת הטווח והמיקום מיד אחרי הפריט האחרון שלו", "המינימום והמקסימום"]
  - q: "איך ממיינים וקטור v מהגדול לקטן?"
    options: ["sort(v.begin(), v.end(), greater<int>());", "sort(v, desc);", "v.sort(reverse);"]
  - q: "מה find מחזירה כשהערך אינו בטווח?"
    options: ["-1", "את איטרטור הסוף (זהה ל-v.end())", "0"]
  - q: "איזה header מכיל את sort, find ו-count?"
    options: ["<vector>", "<sort>", "<algorithm>"]
---

אפשר לכתוב לולאה כדי למיין רשימה, לחפש ערך או לספור כמה פעמים משהו מופיע. אבל ב-C++ כבר יש גרסאות מהירות ובדוקות היטב של עשרות עבודות כאלה ב-header בשם `<algorithm>`. שימוש בהן הופך את הקוד לקצר יותר ופחות מועד לטעויות.

## טווחים ואיטרטורים

כל אלגוריתם עובד על **טווח** (range) שמתואר על ידי שני **איטרטורים** (iterators), שהם כמו סימניות שמצביעות לתוך המכל (container):

- `v.begin()` מצביע על הפריט **הראשון**.
- `v.end()` מצביע **מיד אחרי** הפריט האחרון (זה סמן ל"הסוף", לא פריט).

```cpp
vector<int> v = {5, 3, 8};
sort(v.begin(), v.end());       // v is now 3 5 8
```

אפשר להגיע לערך שאיטרטור מצביע עליו עם `*`: `*v.begin()` הוא הפריט הראשון. חיסור של שני איטרטורים נותן מרחק, ולכן `it - v.begin()` הוא ה**אינדקס** של `it`.

## הדברים החיוניים

```cpp
#include <algorithm>
#include <numeric>      // for accumulate

sort(v.begin(), v.end());                       // ascending
sort(v.begin(), v.end(), greater<int>());       // descending (needs <functional>)
reverse(v.begin(), v.end());                    // flip the order

auto it = find(v.begin(), v.end(), 8);          // first 8, or v.end() if missing
if (it != v.end()) {
    cout << "found at " << (it - v.begin()) << endl;
}

int threes = count(v.begin(), v.end(), 3);      // how many equal 3
int total  = accumulate(v.begin(), v.end(), 0); // sum, starting from 0
int biggest  = *max_element(v.begin(), v.end());
int smallest = *min_element(v.begin(), v.end());
```

`accumulate` נמצאת ב-`<numeric>`. הארגומנט השלישי הוא ערך ההתחלה, והטיפוס שלו קובע את טיפוס התוצאה: השתמשו ב-`0.0` כדי לסכם `vector<double>`.

## ספירה עם תנאי

`count_if` וגרסאות `_if` אחרות מקבלות פונקציה קטנה (**למבדה**, lambda) כארגומנט האחרון:

```cpp
int big = count_if(v.begin(), v.end(), [](int n) { return n > 4; });
```

החלק `[](int n) { return n > 4; }` הוא פונקציה בלי שם: היא מקבלת `int` ומחזירה אם הוא גדול מ-4. אפשר גם למיין לפי כלל משלכם עם למבדה, למשל `sort(words.begin(), words.end(), [](const string& a, const string& b) { return a.size() < b.size(); });` ממיינת מחרוזות לפי אורך.

## מיון עובד גם על טקסט

`sort` גם ממיינת `vector<string>` לפי סדר אלפביתי, כי מחרוזות יודעות להשוות את עצמן.

> **שימו לב:**
> - כתיבת `sort(v)` נכשלת: `error: no matching function for call to 'sort(std::vector<int>&)'`. העבירו את שני האיטרטורים.
> - הפניה (dereference) לתוצאה של `find` בלי לבדוק אותה: אם הערך חסר התוצאה שווה ל-`v.end()` ו-`*it` היא התנהגות לא מוגדרת.
> - בלבול בין איטרטור הסוף לפריט האחרון: `v.end()` הוא אחד אחרי הפריט האחרון, ולכן לעולם אל תקראו `*v.end()`.
> - `sort` צריכה מכל עם גישה אקראית כמו `vector`. היא לא עובדת על `list` או `map`.
> - שכחתם include: `error: 'accumulate' was not declared in this scope` אומר שצריך `<numeric>`.

## להמשיך הלאה

השתמשו ב-`reverse` כדי להפוך את הווקטור הממוין, או ב-`count_if` כדי לספור את המספרים הזוגיים. נסו `sort` על `vector<string>` והדפיסו את התוצאה.

> **תורכם:** עקבו אחרי ההערות הממוספרות: מיינו בסדר עולה והציגו, מצאו את ה-8 והדפיסו את האינדקס שלו, ספרו את ה-3, סכמו הכול עם `accumulate`, הדפיסו את הגדול ביותר עם `max_element`, ולבסוף מיינו בסדר יורד עם `greater<int>()`.
