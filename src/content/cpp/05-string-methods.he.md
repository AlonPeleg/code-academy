---
title: "מתודות של מחרוזות"
summary: "חפשו, חתכו ושנו טקסט בעזרת המתודות של std::string."
hints:
  - "כל אלה מתודות שקוראים להן עם נקודה על המחרוזת: s.length(), s.find(\"text\"), s.substr(start, count), copy.replace(start, count, \"new text\")."
  - "find מחזירה את האינדקס שבו הטקסט מתחיל. substr(5, 7) פירושו להתחיל באינדקס 5 ולקחת 7 אותיות. לספירת התנועות השתמשו ב-for (char c : s) ובדקו את tolower(c) מול 'a', 'e', 'i', 'o' ו-'u'."
  - "cout << \"Length: \" << s.length() << endl;   size_t pos = s.find(\"Academy\");   string word = s.substr(pos, 7);   string t = s; t.replace(0, 4, \"Learn\");   int vowels = 0; for (char c : s) { char l = tolower(c); if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') { vowels++; } }"
messages:
  - "השתמשו במתודה length (או size)."
  - "השתמשו ב-s.find כדי לאתר את המילה."
  - "השתמשו ב-s.substr כדי לחתוך את המילה."
  - "השתמשו במתודה replace."
  - "השתמשו בלולאה על התווים."
quiz:
  - q: "מה מחזירה  s.find(\"ll\")  עבור s = \"hello\" ?"
    options: ["1", "2", "3"]
    explain: "סופרים מ-0: h הוא 0, e הוא 1, l הוא 2. ההתאמה ll מתחילה באינדקס 2."
  - q: "מה נותנת s.substr(1, 3) עבור s = \"abcdef\" ?"
    options: ["abc", "bcd", "bcde"]
  - q: "מה מחזירה s.find(\"xyz\") כש-\"xyz\" לא נמצא ב-s?"
    options: ["0", "-1", "הערך המיוחד string::npos"]
  - q: "איזו שורה מחברת שתי מחרוזות a ו-b?"
    options: ["a + b", "a & b", "a . b"]
---

עבודה עם טקסט היא אחת המשימות הנפוצות ביותר בתכנות: בדיקת שמות, חיתוך שורות קלט, ניקוי נתוני משתמשים. ל-`std::string` של C++ יש ארגז כלים גדול של מתודות, ולכן כמעט אף פעם אין צורך לעבור על הטקסט בלולאה ידנית. בשיעור הזה תלמדו את השימושיות שבהן.

## יסודות: אורך, אינדוקס, חיבור

```cpp
string s = "Hello";
cout << s.length() << endl;   // 5   (s.size() is the same)
cout << s[1] << endl;         // e   (index 0 is the first letter)
s[0] = 'J';                   // Jello  (you can change letters)
s += " world";                // Jello world  (append)
string t = s + "!";           // join into a new string
```

אפשר להשוות מחרוזות ישירות עם `==`, `<` וחבריהם, וזה הרבה נוח יותר מ-C: `if (name == "Ava") { ... }`.

## חיפוש עם find

`find` מחזירה את האינדקס שבו הטקסט מופיע לראשונה. אם הוא לא שם, היא מחזירה את הקבוע המיוחד `string::npos` ("אין מיקום"):

```cpp
string s = "banana";
size_t pos = s.find("nan");           // 2
if (s.find("xyz") == string::npos) {
    cout << "not found" << endl;
}
```

`size_t` הוא סוג המספר השלם ללא סימן שמחרוזות משתמשות בו למיקומים. אפשר גם לכתוב `auto pos = s.find(...)`.

## חיתוך עם substr

`s.substr(start, count)` מחזירה מחרוזת חדשה עם `count` אותיות שמתחילות באינדקס `start`. השמיטו את `count` כדי לקחת הכול עד הסוף:

```cpp
string s = "Code Academy";
cout << s.substr(5, 3) << endl;    // Aca
cout << s.substr(5) << endl;       // Academy
```

## שינוי טקסט

| מתודה | מה היא עושה | דוגמה על `"Hello"` |
| --- | --- | --- |
| `s.replace(pos, n, text)` | מחליפה `n` אותיות החל מ-`pos` ב-`text` | `replace(0, 1, "J")` נותן `Jello` |
| `s.insert(pos, text)` | מכניסה טקסט ב-`pos` | `insert(5, "!")` נותן `Hello!` |
| `s.erase(pos, n)` | מסירה `n` אותיות החל מ-`pos` | `erase(0, 1)` נותן `ello` |
| `s.push_back(c)` | מוסיפה תו אחד בסוף | `push_back('!')` |
| `s.empty()` | אמת כשאין במחרוזת אותיות | |

המתודות האלה **משנות את המחרוזת עצמה**. אם רוצים לשמור את המקור, מעתיקים אותו קודם עם `string t = s;`.

## מעבר על תווים ו-cctype

מחרוזת היא רצף של `char`ים, ולכן לולאת for מבוססת טווח עובדת עליה. קובץ הכותרת `<cctype>` מציע פונקציות עזר לתו בודד: `toupper(c)`, `tolower(c)`, `isdigit(c)`, `isalpha(c)`, `isspace(c)`.

```cpp
string code = "a1b22";
int digits = 0;
for (char c : code) {
    if (isdigit(c)) digits++;
}
// digits is 3
```

> **שימו לב:**
> - אם לא בודקים אם התקבל `npos`: `s.find("x")` מחזירה מספר עצום כשאין התאמה, ושימוש בו ב-`substr` זורק `terminate called after throwing an instance of 'std::out_of_range'`.
> - `"Hello" + " world"` (שני טקסטים במרכאות) לא מתקמפל; לפחות אחד הצדדים חייב להיות `string`.
> - `substr(start, count)` מקבלת **כמות**, לא מיקום סוף, ולכן `substr(2, 4)` אינה "מ-2 עד 4".
> - גישה אחרי הסוף (`s[20]`) לא נבדקת; השתמשו ב-`s.at(20)` כדי לקבל חריגה (exception) במקום זבל.
> - `tolower` ו-`toupper` פועלות על `char` אחד, לא על מחרוזת שלמה.

## להמשיך הלאה

כתבו לולאה שהופכת את כל המחרוזת לאותיות גדולות, או סופרת כמה מילים יש בה לפי ספירת רווחים.

> **תורכם:** עם `s = "Code Academy rocks"`, הדפיסו את האורך, את המיקום שבו `"Academy"` מתחילה, את המילה שנחתכה עם `substr`, עותק שבו ארבע האותיות הראשונות הוחלפו ב-`"Learn"`, ואת מספר התנועות. הפלט הצפוי כתוב בהערות.
