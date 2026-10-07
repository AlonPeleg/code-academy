---
title: "ברייקאאוט: לבנים ומחבט שאפשר לכוון"
summary: "בנו קיר של לבנים עם לולאות מקוננות, מצאו את הלבנה שנפגעה עם std::find_if ולמדה, וספרו את השורדות."
hints:
  - "שתי משימות. הקפיצה מהמחבט דורשת שהכדור ירד למטה, הופכת את vy, ומשתמשת במרחק בין שני המרכזים כדי לקבוע את vx. עבור הלבנים, std::find_if עם למדה מוצאת את הלבנה החיה הראשונה שחופפת לכדור, ומחזירה bricks.end() כשאין כזו."
  - "מחבט: if (ball.vy > 0 && ball.box().overlaps(paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   לבנים: auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); });"
  - "מחבט: if (ball.vy > 0 && ball.box().overlaps(paddle)) { ball.vy = -ball.vy; ball.y = paddle.y - ball.size; ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5; }   לבנים: auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); }); if (hit != bricks.end()) { hit->alive = false; ball.vy = -ball.vy; }"
quiz:
  - q: "מה std::find_if מחזירה כשאף איבר לא עובר את הבדיקה?"
    options: ["nullptr", "את האיבר הראשון", "את האיטרטור end() של הטווח", "-1"]
    explain: "בגלל זה משווים ל-bricks.end() לפני השימוש בתוצאה."
  - q: "ב-[&](const Brick& b) { return b.alive && b.box.overlaps(ball.box()); } מה ה-[&] מאפשר?"
    options: ["ללמדה להשתמש ב-ball מהקוד שמסביבה", "ללמדה לרוץ מהר יותר", "ללמדה להחזיר הפניה", "כלום, זה קישוט"]
  - q: "למה המחבט מקפיץ רק כש-ball.vy > 0?"
    options: ["כי מחבטים בלתי נראים אחרת", "כדי שכדור שנע למעלה הרחק מהמחבט לא יקפוץ שוב ולא ייתקע", "כדי לספור את הקפיצות", "כי vy אף פעם לא שלילי"]
  - q: "מה std::count_if(bricks.begin(), bricks.end(), pred) מחזירה?"
    options: ["את האינדקס של ההתאמה הראשונה", "את הגודל של הוקטור", "true או false", "כמה איברים מקיימים את pred"]
---
ברייקאאוט הוא משחק של הרבה מטרות קטנות וקפיצה חכמה אחת. ב-C++ אפשר לתאר את קיר המטרות עם `vector` של אובייקטי `Brick`, למצוא את הלבנה שהכדור פגע בה עם **אלגוריתם סטנדרטי**, ולספור את השורדות עם אלגוריתם נוסף. תתנו למחבט גם **קפיצה בזווית** כדי שהשחקן יוכל לכוון.

## Rect: struct שיודע לחפוף

```cpp
struct Rect {
    int x, y, w, h;
    bool overlaps(const Rect& o) const {
        return x < o.x + o.w && x + w > o.x && y < o.y + o.h && y + h > o.y;
    }
};
```

struct יכול להחזיק גם **פונקציות**. `a.overlaps(b)` נקרא טוב יותר מ-`overlaps(a, b)`, וה-`const` בסוף אומר שהמתודה לא משנה את המלבן. ל-`Ball` יש מתודה `box()` שמחזירה את המלבן שלו, ולכן `ball.box().overlaps(paddle)` היא בדיקת התנגשות שלמה בשורה קריאה אחת.

## קיר משתי לולאות

```cpp
std::vector<Brick> bricks;
for (int r = 0; r < ROWS; r++)
    for (int c = 0; c < COLS; c++)
        bricks.push_back({{1 + c * 40, 30 + r * 16, 38, 12}, r});
```

הלולאה החיצונית היא השורה, והפנימית היא העמודה. כל לבנה היא תיבת `Rect`, מספר השורה (משמש לצבע) ודגל `alive = true` עם ערך ברירת מחדל. לבנה שנשברה לא נמחקת: היא רק מקבלת `alive = false`. השארתה בוקטור שומרת על כל האינדקסים יציבים, והספירה הסופית קלה.

> הצבעים עובדים דרך טבלה. `RGB_RED` מתרחב לשלושה מספרים, ולכן הוא נכנס בתוך סוגריים מסולסלים: `const int palette[3][3] = {{RGB_RED}, {RGB_ORANGE}, {RGB_YELLOW}};`. אז `palette[row]` הוא צבע אחד.

## מציאת הלבנה שנפגעה

אפשר לכתוב לולאת `for` עם `break`. לספרייה הסטנדרטית יש חלופה אקספרסיבית:

```cpp
auto hit = std::find_if(bricks.begin(), bricks.end(), [&](const Brick& b) {
    return b.alive && b.box.overlaps(ball.box());
});
if (hit != bricks.end()) {
    hit->alive = false;
    ball.vy = -ball.vy;
}
```

- `std::find_if(first, last, test)` עוברת על הטווח ומחזירה **איטרטור** (iterator, סוג של מצביע) לאיבר הראשון שעבורו `test` הוא true.
- הבדיקה היא **למדה** (lambda). `[&]` נותן לה לראות את `ball` מהקוד שמסביבה, ו-`(const Brick& b)` הוא הפרמטר שלה.
- אם שום דבר לא התאים, היא מחזירה `bricks.end()`, הסמן "אחד אחרי האחרון". בגלל זה משווים ל-`end()` לפני השימוש בתוצאה.
- `hit->alive` משתמש בחץ כי `hit` מתנהג כמו מצביע.

מכיוון ש-`find_if` נעצרת בהתאמה **הראשונה**, הכדור יכול לשבור רק לבנה אחת בפריים. זה חשוב: היפוך `vy` פעמיים היה שולח את הכדור ישר דרך הקיר.

## מחבט שאפשר לכוון

אם המחבט היה מחזיר את הכדור באותה זווית בכל פעם, המשחק היה משעמם ולבנים מסוימות היו בלתי נגישות. הטריק הוא להשתמש ב**מקום שבו הכדור נוגע במחבט**:

```cpp
ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5;
```

זה המרחק ממרכז המחבט למרכז הכדור, שלילי בחצי השמאלי וחיובי בימני. פגיעה באמצע שולחת את הכדור ישר למעלה, פגיעה ליד הקצה הימני שולחת אותו בחדות ימינה. החילוק ב-5 הופך פיקסלים למהירות סבירה. אנחנו גם מקפיצים רק כש-`ball.vy > 0` (נע למטה) ומניחים את הכדור על גבי המחבט, אחרת הוא יכול להיתקע בפנים ולרעוד.

## ספירת השורדות

```cpp
long left = std::count_if(bricks.begin(), bricks.end(), [](const Brick& b) { return b.alive; });
```

`count_if` מחזירה כמה איברים עוברים את הבדיקה. אין משתנה מונה שצריך לשמור מסונכרן.

> **שימו לב:**
> - שימוש ב-`*hit` או ב-`hit->` כש-`hit == bricks.end()` הוא התנהגות לא מוגדרת (בדרך כלל קריסה). תמיד בדקו קודם.
> - למדה עם `[]` במקום `[&]` שמזכירה את `ball` לא מתקמפלת: `error: 'ball' is not captured`.
> - אם שוכחים `const` ב-`overlaps`, מקבלים `passing 'const Rect' as 'this' argument discards qualifiers` כשקוראים לה על אובייקט const.
> - `find_if`, `count_if` ו-`std::max` צריכים `#include <algorithm>`.

## להמשיך הלאה

הוסיפו `std::vector<int>` של ניקוד לכל שורה, או הדפיסו כמה פעמים המחבט פגע בכדור. ערכו את הלשונית קלט השחקן (Player input) וראו איך מספר הלבנים שנשארו משתנה.

> **תורכם:** (1) מחבט: כש-`ball.vy > 0` ו-`ball.box()` חופף ל-`paddle`, קבעו `ball.vy = -ball.vy`, `ball.y = paddle.y - ball.size` ו-`ball.vx = (ball.x + ball.size / 2 - (paddle.x + paddle.w / 2)) / 5`. (2) לבנים: השתמשו ב-`std::find_if` עם למדה כדי למצוא את הלבנה החיה הראשונה שחופפת ל-`ball.box()`; אם נמצאה, קבעו את `alive` שלה ל-`false` והפכו את `ball.vy`. עם המקשים שניתנו התוכנית מדפיסה `bricks left: 5`.
