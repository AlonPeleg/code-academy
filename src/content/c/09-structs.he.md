---
title: "מבנים, enum ו-typedef"
summary: "מקבצים נתונים קשורים לטיפוסים משלכם."
hints:
  - "השתמשו ב-typedef enum { ... } Level; עבור הרמות וב-typedef struct { ... } Player; עבור השחקן. לחבר (member) ניגשים עם p1.score, ודרך מצביע עם ptr->score."
  - "typedef enum { EASY, NORMAL, HARD } Level; ואז typedef struct { char name[20]; int score; Level level; } Player; ב-main: Player p1 = {\"Ava\", 40, NORMAL}; p1.score += 10; Player *ptr = &p1; ptr->score = 60;"
  - "Player team[2] = { {\"Ben\", 30, EASY}, {\"Cy\", 45, HARD} };   for (int i = 0; i < 2; i++) { printf(\"%s: %d\\n\", team[i].name, team[i].score); }   ו-printf(\"%s has %d points on level %d\\n\", p1.name, p1.score, p1.level);"
messages:
  - "הגדירו את הטיפוס Player עם typedef struct { ... } Player;"
  - "הגדירו את הרמות עם enum { ... }."
  - "השתמשו באופרטור החץ (->) כדי לגשת לחבר דרך מצביע."
  - "השתמשו בלולאת for על המערך."
quiz:
  - q: "מהו struct?"
    options: ["לולאה שחוזרת על בלוק", "פונקציה שמחזירה כמה ערכים", "טיפוס שמקבץ יחד כמה משתנים בעלי שם"]
  - q: "איך קוראים את החבר score של משתנה struct בשם p1?"
    options: ["p1.score", "p1->score", "p1::score"]
  - q: "מתי משתמשים באופרטור החץ ->  ?"
    options: ["כשה-struct נמצא בתוך מערך", "כשיש לכם מצביע ל-struct", "כשמדפיסים struct"]
  - q: "איזה מספר יש ל-NORMAL ב-enum { EASY, NORMAL, HARD } ?"
    options: ["0", "2", "1"]
    explain: "קבועי enum סופרים מ-0 אלא אם נותנים להם ערכים: EASY הוא 0, NORMAL הוא 1, HARD הוא 2."
---

עד עכשיו כל משתנה החזיק ערך יחיד. תוכניות אמיתיות עוסקות בדברים שיש להם כמה חלקים: לשחקן יש שם, ניקוד ורמה; לנקודה יש x ו-y. בשיעור הזה תבנו טיפוסים משלכם עם `struct`, תתנו שמות לקבוצת אפשרויות עם `enum`, ותקלו על כתיבת טיפוסים בעזרת `typedef`.

## struct: צרור של משתנים

```c
struct Point {
    int x;
    int y;
};

struct Point p = {3, 4};
printf("%d %d\n", p.x, p.y);   // prints: 3 4
p.x = 10;                      // change one member
```

המשתנים שבפנים נקראים **חברים** (members), או שדות (fields). ניגשים אליהם עם **אופרטור הנקודה**: `p.x`. הסוגריים המסולסלים `{3, 4}` ממלאים את החברים לפי הסדר שבו הוצהרו.

## typedef: שם קצר יותר

לכתוב `struct Point` בכל מקום נהיה מעייף. `typedef` נותן לטיפוס שם חדש:

```c
typedef struct {
    int x;
    int y;
} Point;

Point p = {3, 4};     // no "struct" needed any more
```

הצורה היא `typedef <existing type> <new name>;`. כאן הטיפוס הקיים הוא struct ללא שם, והשם החדש `Point` בא אחרי הסוגר המסולסל הסוגר.

## enum: קבועים בעלי שם

כשמשתנה יכול לקבל אחת ממספר קטן של בחירות, `enum` נותן לכל בחירה שם קריא במקום מספר מסתורי:

```c
typedef enum { EASY, NORMAL, HARD } Level;

Level lvl = HARD;
if (lvl == HARD) {
    printf("Good luck!\n");
}
printf("%d\n", lvl);   // prints: 2
```

מאחורי הקלעים השמות הם פשוט מספרים שלמים שסופרים מ-0 (`EASY` הוא 0, `NORMAL` הוא 1, `HARD` הוא 2), ולכן מדפיסים אותם עם `%d`. `switch` על ערך של enum נקרא יפה.

## מבנים בתוך מבנים ומערכים

חבר יכול להיות מכל טיפוס, כולל enum אחר, מחרוזת ואפילו struct אחר, ואפשר ליצור מערכים של מבנים. מחרוזות מאותחלות בתוך סוגריים מסולסלים כרגיל: `Player p = {"Ava", 40, NORMAL};`. מערך של מבנים הוא `Player team[2] = { {"Ben", 30, EASY}, {"Cy", 45, HARD} };` וקוראים אחד מהם עם `team[i].score`.

## מצביעים למבנים

כשפונקציה מקבלת מצביע ל-struct (כדי שתוכל לשנות את המקור), ניגשים לחברים עם **החץ**:

```c
Point *pp = &p;
pp->x = 99;       // same as (*pp).x = 99;
```

> **שימו לב:**
> - אי אפשר לשים מחרוזת בחבר מסוג מערך תווים אחרי היצירה: `p.name = "Bob";` נותנת `error: assignment to expression with array type`. השתמשו ב-`strcpy(p.name, "Bob");`.
> - שכחת נקודה-פסיק אחרי הסוגר המסולסל הסוגר של struct נותנת `error: expected ';' ... at end of declaration`.
> - ערבוב בין `.` ל-`->`: שימוש ב-`.` על מצביע נותן `error: 'ptr' is a pointer; did you mean to use '->'?`.
> - מבנים מועתקים כשמעבירים אותם לפונקציה לפי ערך. כדי לשנות את המקור, העבירו מצביע.

## להמשיך הלאה

הוסיפו פונקציה `void print_player(const Player *p)` שמדפיסה שחקן, והשתמשו בה בלולאה. אחר כך הוסיפו ל-struct חבר `double speed`.

> **תורכם:** צרו את ה-enum בשם `Level` ואת ה-struct בשם `Player` (שניהם עם `typedef`). צרו את `p1`, הוסיפו 10 נקודות עם אופרטור הנקודה, קבעו את הניקוד ל-60 דרך מצביע עם `->`, ועברו בלולאה על מערך של שני שחקנים נוספים. הפלט הצפוי מופיע בהערות.
