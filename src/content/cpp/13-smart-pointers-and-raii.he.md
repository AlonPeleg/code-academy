---
title: "מצביעים חכמים ו-RAII"
summary: "נותנים לאובייקטים לנקות אחרי עצמם עם unique_ptr ו-shared_ptr."
hints:
  - "RAII פירושו שמשאב נרכש בבנאי ומשוחרר ב-destructor. מצביע חכם (smart pointer) הוא אובייקט שמחזיק בבעלות על משהו ב-heap ומוחק אותו אוטומטית כשהמצביע החכם עצמו יוצא מהתחום (scope)."
  - "ה-destructor הוא ~Resource() { cout << \"release \" << name_ << endl; }. unique_ptr<Resource> r = make_unique<Resource>(\"file\"); בתוך סוגריים מסולסלים. לשיתוף, shared_ptr<Resource> b = a; מעתיק את המצביע ומעלה את use_count ל-2; יציאה מהבלוק הפנימי מורידה אותו שוב."
  - "~Resource() { cout << \"release \" << name_ << endl; }   { auto r = make_unique<Resource>(\"file\"); r->use(); }   auto a = make_shared<Resource>(\"shared\");   { auto b = a; cout << \"count: \" << a.use_count() << endl; }   cout << \"count: \" << a.use_count() << endl;"
messages:
  - "צרו את המשאב הראשון עם make_unique<Resource>(...)."
  - "צרו את המשאב השני עם make_shared<Resource>(...)."
  - "הדפיסו את a.use_count()."
  - "כתבו את ה-destructor ~Resource()."
quiz:
  - q: "מה RAII אומר בפועל?"
    options: ["משאבים קשורים לחיי האובייקט: נרכשים בבנאי, משוחררים ב-destructor", "Read And Initialize Immediately", "Run All Instructions In order"]
  - q: "מה מיוחד ב-unique_ptr?"
    options: ["אפשר להעתיק אותו בחופשיות", "יש לו בעלים אחד בדיוק והוא לא ניתן להעתקה, רק להעברה (move)", "הוא סופר כמה בעלים קיימים"]
  - q: "מתי האובייקט שבבעלות shared_ptr נמחק?"
    options: ["ברגע שה-shared_ptr הראשון נהרס", "רק כשקוראים ל-delete", "כשה-shared_ptr האחרון שמחזיק בו נהרס"]
  - q: "למה להעדיף make_unique<T>(...) על פני new T(...)?"
    options: ["זה בטוח יותר: אין מצביע גולמי ששוכחים למחוק, וזה בטוח מבחינת חריגות (exception safe)", "זה הופך את האובייקט לגדול יותר", "new אסור ב-C++17"]
---

ב-C כל הקצאה ב-heap צריכה `free` תואם; ב-C++ הישנה כל `new` צריך `delete`. שוכחים אחד ומקבלים דליפת זיכרון, עושים אותו פעמיים והתוכנית קורסת. C++ מודרנית נמנעת מהבעיה בעזרת **RAII** ו**מצביעים חכמים** (smart pointers): אובייקטים שמנקים אחרי עצמם. זה אחד הרעיונות החשובים ביותר בשפה.

## RAII: רכישת משאב היא אתחול

שם מגושם לכלל פשוט: **רוכשים משאב בבנאי, משחררים אותו ב-destructor**. ה-destructor הוא מתודה מיוחדת בשם `~ClassName()` ש-C++ מריצה אוטומטית כשהתחום של האובייקט מסתיים, גם אם הפונקציה יוצאת מוקדם דרך `return` או חריגה (exception).

```cpp
class Timer {
public:
    Timer()  { cout << "start" << endl; }
    ~Timer() { cout << "stop" << endl; }
};

int main() {
    {
        Timer t;                 // prints: start
        cout << "working" << endl;
    }                            // prints: stop (automatic, at the closing brace)
}
```

אפשר לטפל כך בקבצים, בנעילות, בחיבורי רשת ובזיכרון. הספרייה הסטנדרטית כבר עושה זאת בשבילכם: `ifstream` סוגר את הקובץ שלו, `vector` משחרר את הזיכרון שלו, `lock_guard` משחרר את ה-mutex שלו.

## unique_ptr: בעלים אחד בדיוק

`unique_ptr<T>` מחזיק בבעלות על אובייקט ב-heap ומוחק אותו כש-`unique_ptr` נהרס. כללו את `<memory>`.

```cpp
auto p = make_unique<Resource>("file");   // allocates and constructs
p->use();                                 // arrow calls a method, like a normal pointer
(*p).use();                               // * gives the object itself
// no delete needed: freed automatically at the end of the scope
```

`make_unique<T>(args...)` מעבירה את הארגומנטים לבנאי. את `unique_ptr` **אי אפשר להעתיק** (חייב להיות בעלים אחד בלבד), אבל אפשר להעביר את הבעלות עם `std::move`:

```cpp
auto q = move(p);     // q owns it now, p is empty (nullptr)
```

שימוש ב-`p` אחרי העברה הוא באג. אפשר לבדוק אם מצביע חכם ריק עם `if (p)`.

## shared_ptr: בעלות משותפת

כשכמה חלקים בתוכנית צריכים את אותו אובייקט ואף אחד לא הבעלים הברור שלו, השתמשו ב-`shared_ptr<T>`. הוא שומר **מונה הפניות** (reference count) של כמה `shared_ptr` מצביעים על האובייקט, ומוחק את האובייקט כשהמונה מגיע לאפס.

```cpp
auto a = make_shared<Resource>("shared");
cout << a.use_count();       // prints: 1
{
    auto b = a;              // copying shares ownership
    cout << a.use_count();   // prints: 2
}                            // b is destroyed, count drops
cout << a.use_count();       // prints: 1
```

## באיזה להשתמש?

- ברירת המחדל היא **אובייקטים רגילים על המחסנית** (stack) (`Resource r("x");`). פשוט ומהיר.
- צריכים הקצאה ב-heap או פולימורפיזם: `unique_ptr`.
- בעלות משותפת באמת: `shared_ptr`. הוא עולה קצת יותר בגלל המונה.
- הימנעו מ-`new` ו-`delete` גולמיים בקוד חדש.

שני `shared_ptr` שמצביעים זה על זה יוצרים מעגל ולא מגיעים לאפס לעולם (דליפה). שברו מעגלים כאלה עם `weak_ptr`, צופה שאינו בעלים.

> **שימו לב:**
> - העתקת unique_ptr: `error: use of deleted function 'std::unique_ptr<...>::unique_ptr(const std::unique_ptr<...>&)'`. השתמשו ב-`move` או העבירו הפניה.
> - שכחתם `#include <memory>`: `error: 'unique_ptr' was not declared in this scope`.
> - יצירת שני `shared_ptr` נפרדים מאותו מצביע גולמי: שניהם חושבים שהם הבעלים והאובייקט נמחק פעמיים. תמיד צרו עם `make_shared` והעתיקו את ה-`shared_ptr`.
> - שימוש ב-unique_ptr אחרי `move`: הוא null, והפניה אליו קורסת (segmentation fault).
> - שכחתם שסדר ההרס הפוך לסדר היצירה: האובייקט האחרון שנוצר בתוך תחום נהרס ראשון.

## להמשיך הלאה

צרו וקטור של `unique_ptr<Resource>` וצפו באובייקטים משתחררים לפי הסדר כשהווקטור יוצא מהתחום.

> **תורכם:** הוסיפו destructor ל-`Resource` שמדפיס `release <name>`. ב-`main`, צרו `unique_ptr` בתוך בלוק, ואז `shared_ptr` עם בעלים שני בבלוק פנימי והדפיסו את מוני השימוש כפי שההערות מתארות.
