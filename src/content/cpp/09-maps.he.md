---
title: "מפות (Maps)"
summary: "מחפשים ערכים לפי מפתח עם std::map ו-unordered_map."
hints:
  - "map שומרת זוגות של מפתח-ערך. counts[word] מוצאת (או יוצרת) את הרשומה של המילה, ו-++ מוסיפה אחד. מעבר על map מבקר ברשומות לפי סדר המפתחות הממוין."
  - "מילוי: for (const string& w : words) { counts[w]++; }  הדפסה: for (auto& entry : counts) { ... entry.first הוא המפתח, entry.second הערך }. גודל: counts.size(). בדיקת מפתח חסר עם counts.count(\"durian\") == 0."
  - "map<string, int> counts; for (const string& w : words) { counts[w]++; }   for (auto& entry : counts) { cout << entry.first << \": \" << entry.second << endl; }   cout << \"Different words: \" << counts.size() << endl;   if (counts.count(\"durian\") == 0) { cout << \"No durian\" << endl; }   stock[\"pen\"] -= 4; cout << \"Pens left: \" << stock[\"pen\"] << endl;"
messages:
  - "הצהירו על map<string, int> counts;"
  - "השתמשו בלולאות כדי למלא ולהדפיס את ה-map."
  - "בלולאת ההדפסה השתמשו ב-pair.first עבור המפתח."
quiz:
  - q: "מה map שומרת?"
    options: ["זוגות של מפתח וערך", "רק מספרים לפי הסדר", "ערך יחיד"]
  - q: "באיזה סדר std::map מוסרת את הרשומות שלה כשעוברים עליה בלולאה?"
    options: ["סדר אקראי בכל הרצה", "הסדר שבו הוכנסו", "ממוין לפי מפתח"]
  - q: "מה counts[\"kiwi\"] עושה כש-\"kiwi\" עדיין אינו מפתח?"
    options: ["קורסת", "יוצרת את הרשומה עם ערך ברירת מחדל (0 עבור int)", "מחזירה -1 ולא משנה כלום"]
    explain: "אופרטור הסוגריים המרובעים מוסיף מפתחות חסרים. כדי רק לבדוק אם מפתח קיים השתמשו ב-count או ב-find."
  - q: "מתי unordered_map היא בחירה טובה?"
    options: ["כשצריך את המפתחות ממוינים", "כשרוצים את החיפושים המהירים ביותר ולא אכפת מהסדר", "כשהמפתחות תמיד מספרים"]
---

`vector` מוצא דברים לפי מיקום (0, 1, 2...). לעיתים קרובות רוצים למצוא דברים לפי **שם**: הגיל של אדם, המחיר של מוצר, כמה פעמים מילה מופיעה. **map** (נקראת גם מילון, dictionary) שומרת **זוגות של מפתח-ערך** ומוצאת ערך לפי המפתח שלו. ב-C++ יש שתי מפות עיקריות.

## std::map

```cpp
#include <map>

map<string, int> ages;          // keys are strings, values are ints
ages["Ava"] = 20;               // add or change an entry
ages["Ben"] = 31;
cout << ages["Ava"] << endl;    // prints: 20
cout << ages.size() << endl;    // prints: 2
```

אפשר גם להתחיל אותה עם ערכים: `map<string, int> ages = {{"Ava", 20}, {"Ben", 31}};`.

עובדות חשובות:

- `m[key]` מחפשת את הערך, ואם המפתח עדיין לא קיים היא **יוצרת** אותו עם ערך ברירת מחדל (`0` למספרים, ריק למחרוזות). לכן `counts[word]++` עובד לספירה: מילה חדשה מתחילה ב-0 והופכת ל-1.
- `m.count(key)` מחזירה `1` אם המפתח קיים ו-`0` אם לא, בלי ליצור כלום.
- `m.find(key)` מחזירה איטרטור (iterator), ששווה ל-`m.end()` כשהמפתח חסר.
- `m.erase(key)` מסירה רשומה.
- `std::map` שומרת את המפתחות שלה **ממוינים**, ולכן מעבר עליה בלולאה תמיד נותן את אותו סדר, אלפביתי (או מספרי).

## מעבר על map בלולאה

כל פריט ב-map הוא זוג (pair) עם שני חלקים, `.first` (המפתח) ו-`.second` (הערך):

```cpp
for (auto& entry : ages) {
    cout << entry.first << " is " << entry.second << endl;
}
// prints: Ava is 20
//         Ben is 31
```

`auto` אומרת לקומפיילר לגלות את הטיפוס בשבילכם (כאן `pair<const string, int>`), ולכן לא צריך לכתוב אותו.

## unordered_map

ל-`unordered_map` (מ-`<unordered_map>`) יש אותן מתודות, אבל היא בנויה על טבלת גיבוב (hash table): חיפושים בדרך כלל מהירים יותר, אבל הרשומות יוצאות ב**סדר לא מוגדר**, והסדר הזה יכול להשתנות בין קומפיילרים. השתמשו בה כשאתם רק מחפשים דברים לפי מפתח. אם מדפיסים unordered_map שלמה השורות עלולות לבוא בכל סדר, ולכן כשרוצים פלט צפוי השתמשו ב-`map` או העתיקו קודם את המפתחות ל-`vector` ממוין.

```cpp
unordered_map<string, int> stock = {{"pen", 10}, {"book", 3}};
stock["pen"] -= 4;
cout << stock["pen"] << endl;   // prints: 6
```

> **שימו לב:**
> - קריאה עם `m[key]` רק כדי לבדוק אם מפתח קיים **מוסיפה** אותו בשקט. השתמשו ב-`m.count(key)` או ב-`m.find(key)` במקום.
> - שכחתם `#include <map>` נותן `error: 'map' was not declared in this scope`.
> - אל תסתמכו על סדר ההדפסה של `unordered_map`; בודק השיעור יראה פלט שונה.
> - אי אפשר לשנות מפתחות: הם `const`, ולכן `entry.first = "x";` נותנת `error: assignment of read-only member`.
> - `m.at(key)` זורקת `std::out_of_range` כשהמפתח חסר, וזה שימושי כשמפתח חסר הוא באג אמיתי.

## להמשיך הלאה

ספרו את האותיות במחרוזת עם `map<char, int>`, או הדפיסו את המילה עם הספירה הגבוהה ביותר.

> **תורכם:** ספרו את המילים ב-`words` עם `map<string, int>` בשם `counts`, הדפיסו כל רשומה כ-`word: count`, הדפיסו את מספר המילים השונות, בדקו את `"durian"` עם `count`, ואז הסירו 4 עטים מה-`unordered_map`. הפלט הצפוי נמצא בהערות.
