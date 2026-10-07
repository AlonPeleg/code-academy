---
title: "פונקציות, הפניות (references) ו-const"
summary: "מעבירים ערכים בעותק, בהפניה ובהפניה קבועה (const reference)."
hints:
  - "פרמטר מסוג הפניה (reference) מוצהר עם & אחרי הטיפוס. זה שם נוסף למשתנה של הקורא, ולכן שינויים נראים בחוץ. const מונע מהפונקציה לשנות אותו."
  - "חתימות: void swap_values(int& a, int& b), void shout(const string& s), int sum(const vector<int>& v), int power(int base, int times = 2). ל-swap צריך משתנה זמני."
  - "void swap_values(int& a, int& b) { int temp = a; a = b; b = temp; }   void shout(const string& s) { cout << s << \"!\" << endl; }   int sum(const vector<int>& v) { int total = 0; for (int n : v) { total += n; } return total; }   int power(int base, int times = 2) { int result = 1; for (int i = 0; i < times; i++) { result *= base; } return result; }"
messages:
  - "קבלו את שני המספרים בהפניה: int& a, int& b."
  - "קבלו את המחרוזת כ-const string&."
  - "קבלו את הווקטור כ-const vector<int>&."
  - "תנו לפרמטר ערך ברירת מחדל: int times = 2."
quiz:
  - q: "מה פרמטר הפניה כמו  int& x  מאפשר?"
    options: ["הפונקציה יכולה לשנות את המשתנה של הקורא", "הפונקציה מקבלת עותק", "הפונקציה לא יכולה להשתמש ב-x"]
  - q: "למה כותבים  const vector<int>& v  בפונקציה שרק קוראת את הווקטור?"
    options: ["זה הופך את הווקטור לגדול יותר", "זה מונע העתקה של כל הווקטור ומבטיח לא לשנות אותו", "זה נדרש לכל וקטור"]
  - q: "בהינתן  void f(int n) { n = 99; }  ו-  int x = 1; f(x);  מה x אחר כך?"
    options: ["99", "0", "1"]
    explain: "בלי & הפונקציה עובדת על עותק, ולכן ה-x של הקורא לא משתנה."
  - q: "מה עושה ארגומנט ברירת מחדל כמו  int times = 2  ?"
    options: ["מכריח את הקורא להעביר 2", "משמש כשהקורא משמיט את הארגומנט הזה", "הופך את הפרמטר ל-const"]
---

פונקציות מאפשרות לתת שם לבלוק קוד ולהשתמש בו שוב. רוב השאלות המעניינות הן על **איך ארגומנטים נכנסים לפונקציה**: כעותק או כדבר האמיתי? השיעור הזה מראה את שלוש הדרכים ש-C++ מציעה, ובנוסף ארגומנטים של ברירת מחדל.

## רענון קצר על פונקציות

```cpp
int add(int a, int b) {       // return type, name, parameters
    return a + b;
}

int main() {
    cout << add(2, 3) << endl;   // prints: 5
}
```

C++ קוראת את הקובץ מלמעלה למטה, ולכן הגדירו פונקציה **מעל** `main`, או כתבו **אב-טיפוס** (prototype) (השורה הראשונה ועוד `;`) בראש הקובץ. פונקציה שלא מחזירה כלום מקבלת את טיפוס ההחזרה `void`.

## העברה לפי ערך (עותק)

כברירת מחדל הפונקציה מקבלת **עותק**:

```cpp
void tryToChange(int n) {
    n = 99;               // changes only the copy
}

int x = 1;
tryToChange(x);
cout << x << endl;        // still 1
```

## העברה בהפניה (המשתנה האמיתי)

הוסיפו `&` אחרי הטיפוס והפרמטר הופך ל**הפניה** (reference), שהיא פשוט שם נוסף למשתנה של הקורא:

```cpp
void setTo99(int& n) {
    n = 99;               // changes the caller's variable
}

int x = 1;
setTo99(x);
cout << x << endl;        // prints: 99
```

קוראים לה בדיוק כמו קודם: `setTo99(x)`, בלי סימן נוסף. כך כותבים `swap`, או כל פונקציה שצריכה להחזיר תוצאות דרך הארגומנטים שלה.

## הפניות const (קריאה בלבד, בלי העתקה)

להעתיק `string` או `vector` גדולים בכל קריאה לפונקציה זה בזבוז. העברה בהפניה נמנעת מההעתקה, והוספת `const` מבטיחה שהפונקציה לא תשנה אותם:

```cpp
int count_items(const vector<int>& v) {
    return v.size();      // reading is fine; v.push_back(1) would not compile
}
```

כלל אצבע: דברים קטנים (`int`, `double`, `char`, `bool`) לפי ערך; דברים גדולים (`string`, `vector`, המחלקות שלכם) ב-`const&` כשרק קוראים אותם, וב-`&` רגיל כשהפונקציה חייבת לשנות אותם.

## ארגומנטים של ברירת מחדל

לפרמטר יכול להיות ערך ברירת מחדל, שמשמש כשהקורא משמיט אותו. ערכי ברירת מחדל באים בסוף רשימת הפרמטרים:

```cpp
int power(int base, int times = 2) { ... }
power(5);       // times is 2
power(5, 3);    // times is 3
```

## העמסה (overloading)

כמה פונקציות יכולות לחלוק שם אם הפרמטרים שלהן שונים, ו-C++ בוחרת את הנכונה: `int area(int side)` ו-`int area(int w, int h)`.

> **שימו לב:**
> - העברת ליטרל להפניה שאינה const: `swap_values(3, 7)` נותנת `error: cannot bind non-const lvalue reference of type 'int&' to an rvalue of type 'int'`. הפניה צריכה משתנה אמיתי.
> - שכחתם את ה-`&` כשרציתם לשנות את המשתנה של הקורא. שום דבר לא נכשל, השינוי פשוט נעלם.
> - שינוי של פרמטר `const`: `error: assignment of read-only reference 's'`.
> - ארגומנט ברירת מחדל באמצע (`int f(int a = 1, int b)`) נותן `error: default argument missing for parameter 2`.
> - קריאה לפונקציה לפני שהוצהרה: `error: 'power' was not declared in this scope`.

## להמשיך הלאה

כתבו `void double_all(vector<int>& v)` שמכפילה כל איבר במקום בעזרת `for (int& n : v)` (הפניה במשתנה הלולאה מאפשרת ללולאה לשנות את האיברים).

> **תורכם:** החליפו את ארבעת השלדים: `swap_values` תקבל הפניות ותחליף, `shout` תקבל `const string&` ותדפיס אותה עם `!`, `sum` תקבל `const vector<int>&` ותחזיר את הסכום, ול-`power` יהיה ארגומנט שני עם ברירת מחדל 2.
