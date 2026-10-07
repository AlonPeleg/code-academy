---
title: "וקטורים של אובייקטים"
summary: "שמרו רשימה גדלה של כדורים ב-std::vector, הוסיפו עם push_back ונקו עם erase ו-remove_if."
hints:
  - "ירי הוא בדיקת גודל ועוד push_back. הניקוי משתמש בצורה erase-remove: remove_if מזיז את הכדורים הרעים לסוף, ו-erase חותך אותם. הבדיקה היא למדה קטנה שמקבלת כדור ואומרת אם הוא מחוץ למסך."
  - "if (key_pressed(KEY_SPACE) && bullets.size() < MAX_BULLETS) { bullets.push_back({player_x + 8, 200}); fired++; }   ניקוי: bullets.erase(std::remove_if(bullets.begin(), bullets.end(), [](const Bullet& b) { return b.y < 0; }), bullets.end());"
  - "שלב 1:  if (key_pressed(KEY_SPACE) && bullets.size() < MAX_BULLETS) { bullets.push_back({player_x + 8, 200}); fired++; }   שלב 2:  bullets.erase(std::remove_if(bullets.begin(), bullets.end(), [](const Bullet& b) { return b.y < 0; }), bullets.end());"
quiz:
  - q: "איזו קריאה מוסיפה איבר חדש בסוף של std::vector?"
    options: ["bullets.add(b)", "bullets.push_back(b)", "bullets.insert(b)", "bullets[size] = b"]
  - q: "מה עושה for (auto& b : bullets) { b.y -= 7; } ?"
    options: ["מזיזה כל כדור בוקטור (ה-& הופך את b להפניה לאיבר האמיתי)", "מזיזה עותק של כל כדור, הכדורים האמיתיים נשארים במקום", "מסירה כל כדור", "לא מתקמפלת"]
    explain: "בלי ה-&, b היה עותק והשינוי שלכם היה הולך לאיבוד."
  - q: "מה bullets.size() מחזירה?"
    options: ["את הזיכרון שבשימוש בבייטים", "את האינדקס של האיבר האחרון", "את הקיבולת של הוקטור", "את מספר האיברים שיש כרגע בוקטור"]
  - q: "למה אסור לקרוא ל-erase על וקטור בזמן מעבר עליו עם range-for?"
    options: ["זה איטי יותר", "erase עובד רק על האיבר האחרון", "מחיקה משנה את הוקטור מתחת ללולאה ושוברת אותה, ולכן מבצעים את ההסרה עם remove_if אחרי הלולאה", "אסור להשתמש ב-range-for על וקטור"]
    explain: "שינוי הגודל של וקטור מבטל את תקפות האיטרטורים של הלולאה. קודם מזיזים, ואחר כך מבצעים erase-remove."
---
משחק צריך רשימות: הרבה כדורים, הרבה אויבים, הרבה מטבעות, ולרוב לא יודעים מראש כמה. ב-C++ הכלי לזה הוא `std::vector`. זו רשימה ש**גדלה ומתכווצת** תוך כדי עבודה. בשיעור הזה תשמרו וקטור (vector) של כדורים ותלמדו את שלוש הפעולות שכל רשימה במשחק צריכה: הוספה, מעבר והסרה.

## std::vector בדקה

```cpp
#include <vector>

std::vector<Bullet> bullets;          // an empty list of Bullet objects
bullets.push_back({100, 200});        // add one at the end
bullets.push_back({140, 200});        // now there are two
std::cout << bullets.size();          // prints: 2
bullets[0].y = 150;                   // access by index, starting at 0
```

- `std::vector<Bullet>` פירושו "וקטור שמחזיק Bullets" (הטיפוס בסוגריים המשולשים).
- `push_back(x)` מוסיף איבר חדש בסוף, והוקטור מפנה מקום בעצמו.
- `size()` הוא כמה איברים יש לו כרגע. הטיפוס שלו הוא unsigned (`std::size_t`), ולכן קבוע ההגבלה למעלה משתמש באותו טיפוס.
- עם `struct Bullet { int x, y; };` אפשר לכתוב את הכדור החדש עם סוגריים מסולסלים: `{x, y}`.

## מעבר עם range-for

אין צורך באינדקס כדי לבקר בכל האיברים:

```cpp
for (auto& b : bullets) {
    b.y -= BULLET_SPEED;          // changes the real bullet
}

for (const auto& b : bullets) {
    engine_rect(b.x, b.y, 4, 10, RGB_YELLOW);     // only looks, never changes
}
```

- `for (X : list)` פירושו "לכל איבר ברשימה".
- `auto` נותן למהדר להבין את הטיפוס (`Bullet`) בעצמו.
- ה-`&` הופך את `b` ל**הפניה** (reference), שם נוסף לאיבר האמיתי. בלעדיו הייתם מקבלים עותק, והשינוי שלכם היה נעלם.
- `const` אומר "אני רק קורא".

## הסרה: צורת erase-remove

כשכדור יוצא מראש המסך אנחנו רוצים שייעלם. הסרת איברים מאמצע וקטור דורשת שני שלבים, שמתכנתי C++ כותבים כביטוי אחד:

```cpp
bullets.erase(
    std::remove_if(bullets.begin(), bullets.end(),
                   [](const Bullet& b) { return b.y < 0; }),
    bullets.end());
```

1. `std::remove_if(first, last, test)` מזיז את האיברים שרוצים לשמור לתחילה, ומחזיר איפה החלק ה"טוב" נגמר. אלה שהבדיקה בחרה נשארים מאחוריו.
2. `erase(from, to)` חותך הכול מהנקודה הזאת עד הסוף.

הבדיקה `[](const Bullet& b) { return b.y < 0; }` היא **למדה** (lambda): פונקציה זעירה ללא שם. ה-`[]` פותח אותה, `(const Bullet& b)` הוא הפרמטר שלה, והגוף מחזיר true עבור כדורים שמחוץ למסך. תראו את התבנית הזאת בכל קוד C++.

חלופה היא לולאה עם אינדקס. היא עובדת, אבל קל לטעות בהסרה בתוכה, ולכן erase-remove הוא ההרגל הבטוח יותר:

```cpp
for (std::size_t i = 0; i < bullets.size(); i++) {
    bullets[i].y -= BULLET_SPEED;
}
```

## הגבלת הכמות

`bullets.size() < MAX_BULLETS` היא הבדיקה שעוצרת את הכדור הרביעי. מכיוון ש-`&&` נעצר בחלק הראשון שהוא שקר, אף פעם לא מגיעים ל-`push_back` כשאין מקום. ירייה שנדחתה לא נספרת כירייה שנורתה.

> **שימו לב:**
> - `for (auto b : bullets) b.y -= 7;` לא עושה כלום: בלי `&` הלולאה עובדת על עותקים.
> - קריאה ל-`bullets.erase(...)` בתוך range-for קורסת או מדלגת על איברים. בצעו את הניקוי אחרי הלולאה.
> - אם שוכחים את הארגומנט השני `bullets.end()` של `erase`, מוסר רק איבר אחד. השגיאה שקטה, הכדורים פשוט מצטברים.
> - קריאת `bullets[5]` כשהוקטור קטן יותר היא התנהגות לא מוגדרת (undefined behavior); אף אחד לא יזהיר אתכם. בדקו קודם את `size()`.

## להמשיך הלאה

הדפיסו את `bullets.size()` בכל פריים, או ציירו אותו כטקסט עם `std::to_string`. נסו `MAX_BULLETS = 10` ולחצו על רווח שוב ושוב כדי לראות את כולם עפים.

> **תורכם:** הוסיפו את כלל הירי (SPACE נלחץ ויש מקום לעוד כדור: `push_back` של כדור ב-`{player_x + 8, 200}` וספירתו ב-`fired`), ואז מחקו את הכדורים שה-`y` שלהם קטן מ-0 בעזרת `erase` ו-`remove_if`. עם המקשים שניתנו התוכנית אמורה להדפיס `fired: 7, in flight: 2`.
