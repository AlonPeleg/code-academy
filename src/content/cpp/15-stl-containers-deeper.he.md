---
title: "מכלי STL לעומק"
summary: "משתמשים ב-set וב-deque, מבינים איטרטורים ומשלבים אלגוריתמים עם למבדות."
hints:
  - "set שומר פריטים ייחודיים בסדר ממוין, deque הוא מכל דמוי vector עם הכנסה מהירה בשני הקצוות. אלגוריתמים כמו count_if, transform ו-find_if מקבלים טווח (שני איטרטורים) ולמבדה."
  - "set<int> unique(nums.begin(), nums.end()); deque<int> dq; dq.push_back(1); dq.push_front(0); count_if(nums.begin(), nums.end(), [](int n) { return n % 2 == 0; }); vector<int> squares(nums.size()); transform(nums.begin(), nums.end(), squares.begin(), [](int n) { return n * n; });"
  - "auto it = find_if(nums.begin(), nums.end(), [](int n) { return n > 7; });   cout << \"first above 7: \" << *it << endl;   cout << \"sum of squares: \" << accumulate(squares.begin(), squares.end(), 0) << endl;   cout << \"has 5: \" << (unique.count(5) ? \"yes\" : \"no\") << endl;"
messages:
  - "צרו את ה-set<int> unique."
  - "השתמשו ב-push_front על ה-deque."
  - "השתמשו ב-count_if עם למבדה."
  - "השתמשו ב-transform עם למבדה."
  - "השתמשו ב-find_if עם למבדה."
quiz:
  - q: "מה קורה כשמכניסים ל-set ערך שכבר נמצא בו?"
    options: ["ה-set שומר אותו פעמיים", "נזרקת שגיאה", "כלום, set שומר כל ערך רק פעם אחת"]
  - q: "באיזה סדר std::set עוברת על הפריטים שלה?"
    options: ["ממוינים מהקטן לגדול (כברירת מחדל)", "הסדר שבו הוכנסו", "סדר אקראי"]
  - q: "למה שווה האיטרטור ש-find_if מחזירה כשאין התאמה?"
    options: ["nullptr", "איטרטור הסוף (v.end()), שאסור לבצע עליו הפניה (dereference)", "האיבר הראשון"]
  - q: "מה היתרון של deque על פני vector?"
    options: ["הוא משתמש בפחות זיכרון", "הכנסה והסרה בהתחלה מהירות, לא רק בסוף", "הוא ממיין את עצמו"]
---

אתם כבר מכירים `vector`, `map` וכמה אלגוריתמים. השיעור הזה מרחיב את ארגז הכלים בשני מכלים נוספים (`set` ו-`deque`) ומראה איך איטרטורים ולמבדות מאפשרים לאותם אלגוריתמים לעבוד על כל מכל.

## איטרטורים: הדבק

**איטרטור** (iterator) הוא אובייקט שמצביע על איבר אחד של מכל ויכול לעבור לבא. כל מכל מציע `begin()` (האיבר הראשון) ו-`end()` (**אחד אחרי** האחרון). השתמשו ב-`*it` כדי לקרוא את האיבר שהאיטרטור מצביע עליו, וב-`++it` כדי להתקדם.

```cpp
vector<int> v = {10, 20, 30};
for (auto it = v.begin(); it != v.end(); ++it) {
    cout << *it << " ";       // prints: 10 20 30
}
```

לולאת range-for `for (int n : v)` היא קיצור בדיוק לזה. אלגוריתמים כמו `sort`, `count_if` ו-`find_if` מקבלים כולם **טווח** `[begin, end)` ולכן עובדים עם כל מכל שמציע איטרטורים.

## std::set

`set<T>` שומרת ערכים **ייחודיים** ושומרת אותם **ממוינים**. כללו את `<set>`.

```cpp
set<int> s = {5, 3, 5, 1};
s.insert(4);
s.insert(3);                 // already there: ignored
for (int n : s) cout << n << " ";    // prints: 1 3 4 5
cout << s.count(4);          // prints: 1   (0 would mean missing)
s.erase(5);
```

set מושלמת ל"הסרת כפילויות" ול"האם ראיתי את זה קודם?". אפשר לבנות אחת ישר ממכל אחר: `set<int> u(v.begin(), v.end());`. הכנסה, חיפוש ומחיקה לוקחים זמן יחסי ל-log n, כי ה-set נשמרת כעץ מאוזן. (`unordered_set` היא בת הדודה שמבוססת גיבוב: בדרך כלל מהירה יותר, אבל לא ממוינת.)

## std::deque

`deque` (קוראים "דק", תור דו-צדדי, double-ended queue) עובד כמו vector אבל מהיר גם ב**התחלה**:

```cpp
deque<int> d;
d.push_back(1);
d.push_back(2);
d.push_front(0);            // 0 1 2
d.pop_front();              // 1 2
cout << d.front() << d.back();   // prints: 12
```

ב-`vector` צריך להזיז כל איבר כשמכניסים בהתחלה, וזה איטי עבור נתונים גדולים. השתמשו ב-`deque` לתורים, לחלונות נעים ולרשימות "ביטול" (undo). הוא תומך גם באינדוקס `d[i]`.

## אלגוריתמים עם למבדות

השיעור הקודם הראה שאפשר לתת למבדה ל-`sort`. הרבה אלגוריתמים אחרים מקבלים למבדה כבדיקה או כחישוב:

```cpp
vector<int> v = {1, 2, 3, 4, 5, 6};

int evens = count_if(v.begin(), v.end(), [](int n) { return n % 2 == 0; });   // 3

vector<int> sq(v.size());
transform(v.begin(), v.end(), sq.begin(), [](int n) { return n * n; });       // 1 4 9 16 25 36

auto it = find_if(v.begin(), v.end(), [](int n) { return n > 4; });
if (it != v.end()) cout << *it;      // prints: 5
```

- `count_if` סופרת פריטים שהלמבדה מחזירה עבורם true.
- `transform` מפעילה פונקציה על כל פריט וכותבת את התוצאות החל מאיטרטור יעד. ליעד חייב כבר להיות מקום, ולכן יצרנו את `sq` עם `v.size()` איברים.
- `find_if` מחזירה איטרטור להתאמה הראשונה, או `v.end()` אם אין. תמיד השוו ל-`end()` לפני שמבצעים הפניה.
- `accumulate(begin, end, 0)` מ-`<numeric>` מסכמת הכול.

> **שימו לב:**
> - הפניה ל-`end()`: `*v.end()` היא התנהגות לא מוגדרת (זבל או קריסה). בדקו `it != v.end()` אחרי `find_if` או `find`.
> - `transform` לתוך וקטור ריק: כתיבה מעבר לגודלו היא התנהגות לא מוגדרת. צרו קודם את הווקטור בגודל הנכון (`vector<int> out(v.size());`), או השתמשו ב-`back_inserter(out)`.
> - שינוי איבר של set דרך איטרטור: `error: assignment of read-only location`. מחקו את הערך הישן והכניסו את החדש.
> - שינוי וקטור (push_back, erase) בזמן מעבר עליו עם איטרטורים עלול לפסול אותם. סיימו קודם את הלולאה.
> - set שומרת רק עותק אחד, ולכן `s.size()` יכול להיות קטן ממספר ההכנסות.

## להמשיך הלאה

נסו `s.lower_bound(4)` כדי לקבל איטרטור לאיבר הראשון שאינו קטן מ-4, או `remove_if` יחד עם `erase` כדי למחוק מווקטור את כל הפריטים המתאימים.

> **תורכם:** עקבו אחרי ההערות הממוספרות: בנו `set` מהמספרים, השתמשו ב-`deque` משני הקצוות, ואז השתמשו ב-`count_if`, ב-`transform` וב-`find_if` עם למבדות. הדפיסו את שבע השורות שמופיעות בפלט הצפוי.
