---
title: "מבנים (structs) לאובייקטים במשחק"
summary: "אורזים את הנתונים של אובייקט במשחק לתוך struct וכותבים פונקציות שמקבלות מצביע אליו."
hints:
  - "בתוך player_update ניגשים לכל שדה דרך המצביע בעזרת חץ: p->x, p->y, p->speed. ב-main צריך למסור לפונקציה את הכתובת של המשתנה player."
  - "כתבו ארבעה if כמו  if (key_down(KEY_LEFT)) p->x -= p->speed;  וב-main קראו לפונקציה עם האופרטור &."
  - "הוסיפו: if (key_down(KEY_LEFT)) p->x -= p->speed;  if (key_down(KEY_RIGHT)) p->x += p->speed;  if (key_down(KEY_UP)) p->y -= p->speed;  if (key_down(KEY_DOWN)) p->y += p->speed;   ובלולאה: player_update(&player);"
messages:
  - "קראו ל-player_update(&player) בתוך הלולאה."
  - "השתמשו ב-p->x += p->speed (וב--=) כדי לזוז."
quiz:
  - q: "מהו struct?"
    options: ["לולאה שאף פעם לא נגמרת", "דרך לאגד כמה משתנים קשורים לטיפוס חדש אחד", "סוג של הערה", "פונקציה שמחזירה שני ערכים"]
    explain: "struct מסוג Player יכול להחזיק יחד את x, y, size ו-speed, כך שמשתנה אחד מתאר את כל האובייקט."
  - q: "גם player.x וגם p->x ניגשים לשדה x. מתי משתמשים בחץ?"
    options: ["כשיש לכם מצביע ל-struct", "כש-x שלילי", "רק בתוך main", "כשל-struct יש יותר משלושה שדות"]
    explain: "משתמשים בנקודה על משתנה מסוג struct ובחץ על מצביע ל-struct."
  - q: "למה player_update מקבלת מצביע (Player *p) ולא Player רגיל?"
    options: ["מצביעים מהירים יותר להקלדה", "C לא מרשה structs רגילים כפרמטרים", "כדי שהפונקציה לא תחזיר כלום", "Player רגיל יהיה עותק, והשינויים בעותק יאבדו"]
    explain: "C מעבירה ארגומנטים בהעתקה. מצביע נותן לפונקציה לשנות את המקור."
  - q: "איך מעבירים את המשתנה  Player player;  לפונקציה שמצפה ל-Player *p ?"
    options: ["player_update(player)", "player_update(*player)", "player_update(&player)", "player_update(player.p)"]
    explain: "האופרטור & פירושו 'הכתובת של'."
---
ככל שמשחק גדל, צריך עוד ועוד משתנים בשביל השחקן: `player_x`, `player_y`, `player_speed`, `player_size`, ובקרוב אותו דבר גם לאויבים. זה נהיה מבולגן מהר. בשיעור הזה תלמדו על **structs** (מבנים), שמאגדים ערכים קשורים לדבר מסודר אחד, ועל **מצביעים** (pointers), שמאפשרים לפונקציה לשנות את הדבר הזה.

## טיפוס משלכם

`struct` מקבץ משתנים (שנקראים **שדות**, fields) תחת שם אחד:

```c
typedef struct {
    int x, y;
    int size;
    int speed;
} Player;
```

`typedef` נותן לטיפוס החדש שם קצר, `Player`, כך שאפשר לכתוב `Player` במקום `struct Player`. עכשיו אפשר ליצור משתנים מהטיפוס הזה ולמלא את השדות לפי הסדר:

```c
Player player = {150, 110, 20, 4};   /* x, y, size, speed */
printf("%d\n", player.x);            /* prints: 150 */
player.x = player.x + 10;            /* the dot reaches a field */
```

כל מה שקשור לשחקן נע עכשיו יחד כמשתנה אחד.

## פונקציות שמשנות struct

C מעבירה ארגומנטים **בהעתקה**. אילו כתבתם `void player_update(Player p)`, הפונקציה הייתה מקבלת עותק פרטי משלה, משנה אותו וזורקת אותו כשהיא חוזרת. השחקן האמיתי שלכם אף פעם לא היה זז.

כדי לשנות את המקור, תנו לפונקציה את ה**כתובת** שלו, שהיא **מצביע** (pointer):

```c
void player_update(Player *p) {     /* p holds the address of a Player */
    if (key_down(KEY_RIGHT)) p->x += p->speed;
}

player_update(&player);             /* &player means "the address of player" */
```

- `Player *p` אומר "p הוא מצביע ל-Player".
- `&player` מפיק את הכתובת הזאת כשקוראים לפונקציה.
- `p->x` אומר "לך ל-Player ש-p מצביע עליו והשתמש ב-x שלו". החץ מחליף את הנקודה כשיש מצביע.

לפונקציה שרק **קוראת** את ה-struct, כמו ציור, כתבו `const Player *p`. ה-`const` מבטיח שהפונקציה לא תשנה אותו, והקומפיילר יזהיר אתכם אם היא תנסה.

## למה זה נעים

כשהנתונים והפונקציות שעובדות עליהם מקובצים כ-`Player`, `player_update` ו-`player_draw`, הלולאה הראשית נקראת כמו משפט:

```c
while (engine_running()) {
    player_update(&player);
    engine_clear(RGB_DARK);
    player_draw(&player);
    engine_present();
}
```

אם רוצים אובייקט שני, כמו אויב, יוצרים עוד משתנה מסוג struct ומשתמשים שוב באותן פונקציות. ב-C אין מחלקות, אבל התבנית הזאת (struct ועוד פונקציות בשם `thing_action`) היא הדרך שבה הרבה קוד C אמיתי מאורגן.

> **שימו לב:**
> - כתיבת `p.x` כש-`p` הוא מצביע גורמת ל-`error: 'p' is a pointer; did you mean to use '->'?`. השתמשו ב-`p->x`.
> - כתיבת `player_update(player)` בלי `&` גורמת ל-`incompatible type for argument 1`. העבירו את הכתובת עם `&player`.
> - שוכחים את ה-`;` אחרי ה-`}` הסוגר של הגדרת `struct` רגילה וזה גורם לשגיאה מבלבלת בשורה הבאה. עם `typedef struct { ... } Player;` ה-`;` בא אחרי השם.
> - העברת ה-struct בהעתקה מתקמפלת ורצה, אבל השחקן אף פעם לא זז. אם נראה שהעדכון שלכם לא עושה כלום, בדקו אם חסר `*`.

## להמשך

צרו אובייקט שני, `Player enemy = {10, 10, 20, 2};`, וציירו אותו בעזרת אותה `player_draw(&enemy)`. פונקציה אחת, שני אובייקטים.

> **תורכם:** כתבו את ארבע שורות התנועה בתוך `player_update` בעזרת `p->x`, `p->y` ו-`p->speed`, וקראו ל-`player_update(&player);` בלולאת המשחק. התוכנית צריכה להדפיס `final: 260, 170`.
