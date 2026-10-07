---
title: "רשימה מקושרת עם malloc ו-free"
summary: "בונים שרשרת צמתים שיכולה לגדול ב-heap, עוברים עליה עם מצביע ומשחררים כל צומת."
hints:
  - "כל צומת (node) שומר ערך ומצביע לצומת הבא, וה-next האחרון הוא NULL. כדי לעבור על הרשימה, החזיקו מצביע כמו current והזיזו אותו עם current = current->next עד שהוא NULL."
  - "push_front: הקצו צומת, קבעו node->value ו-node->next = head, והחזירו את node. push_back: הקצו, קבעו next ל-NULL, ואז עברו בלולאה while (current->next != NULL) כדי למצוא את הצומת האחרון. free_list: while (head != NULL) { struct Node *next = head->next; free(head); head = next; }"
  - "struct Node *node = malloc(sizeof(struct Node)); node->value = value; node->next = head; return node;   הדפסה: for (const struct Node *p = head; p != NULL; p = p->next) printf(\"%d -> \", p->value); printf(\"NULL\\n\");   אורך: int n = 0; for (...) n++;"
messages:
  - "הקצו צומת עם malloc(sizeof(struct Node))."
  - "שחררו כל צומת עם free."
  - "עקבו אחרי השרשרת דרך מצביע ה-next (node->next)."
quiz:
  - q: "מה מסמן את סוף הרשימה המקושרת?"
    options: ["צומת שהערך שלו 0", "צומת שמצביע ה-next שלו הוא NULL", "גודל המערך"]
  - q: "למה free_list חייבת לשמור את head->next לפני הקריאה ל-free(head)?"
    options: ["free משנה את מצביע ה-next ל-NULL", "זו רק בחירה של סגנון", "אחרי free הזיכרון של הצומת נעלם, ולכן קריאת head->next תהיה שימוש אחרי שחרור (use after free)"]
  - q: "מה היתרון של רשימה מקושרת על פני מערך?"
    options: ["הוספה בהתחלה זולה, והיא גדלה צומת אחד בכל פעם בלי להעתיק הכול", "קריאת האיבר ה-1000 מהירה יותר", "היא משתמשת בפחות זיכרון לכל איבר"]
  - q: "מה המשמעות של העברת struct Node *head לפי ערך ל-push_front עבור המשתנה של הקורא?"
    options: ["הפונקציה משנה את המשתנה של הקורא אוטומטית", "הפונקציה מקבלת עותק של המצביע, ולכן היא מחזירה את ה-head החדש והקורא חייב לשים אותו במשתנה", "הרשימה מועתקת"]
    explain: "לכן כותבים list = push_front(list, 3). הפונקציה לא יכולה לשנות את משתנה המצביע של הקורא, רק את מה שהוא מצביע עליו."
---

למערך יש גודל קבוע והאיברים שלו יושבים זה ליד זה. **רשימה מקושרת** (linked list) היא דרך אחרת לאחסן סדרה: כל פריט גר בבלוק קטן משלו של זיכרון ב-heap שנקרא **צומת** (node), וכל צומת מחזיק מצביע לצומת הבא. השרשרת יכולה לגדול ולהתכווץ בזמן שהתוכנית רצה. רשימות מקושרות הן התרגיל הקלאסי להבנת מצביעים, `malloc` ו-`free` יחד, והרעיון שמאחורי הרבה מבני נתונים אמיתיים (תורים, מחסניות, דליים של טבלאות גיבוב).

## הצומת

```c
struct Node {
    int value;
    struct Node *next;
};
```

`Node` שומר `value` ומצביע ל-`Node` אחר. C מאפשרת ל-struct להכיל מצביע לטיפוס של עצמו. הרשימה כולה מיוצגת על ידי מצביע לצומת הראשון, ה-**head**. ה-`next` של הצומת האחרון הוא `NULL`, שפירושו "אין המשך". רשימה ריקה היא פשוט `head == NULL`.

```text
head -> [3 | *]--> [2 | *]--> [1 | NULL]
```

## הוספת צמתים

כל צומת מגיע מ-`malloc`, ולכן הוא נשאר חי גם אחרי שהפונקציה שיצרה אותו חוזרת:

```c
struct Node *push_front(struct Node *head, int value) {
    struct Node *node = malloc(sizeof(struct Node));
    node->value = value;
    node->next = head;     // the old list hangs behind the new node
    return node;           // the new node is the new head
}
```

שני דברים שכדאי לשים לב אליהם:

- `node->value` הוא קיצור של `(*node).value`: החץ `->` ניגש לחבר דרך מצביע.
- הפונקציה **מחזירה את ה-head החדש**. פונקציה מקבלת *עותק* של מצביע ה-`head`, ולכן השמה אליו בפנים לא תשנה את המשתנה של הקורא. הקורא כותב `list = push_front(list, 3);`.

הוספה ב**סוף** דורשת הליכה: מתחילים מה-head ועוקבים אחרי `next` עד שמגיעים לצומת שה-`next` שלו הוא `NULL`:

```c
struct Node *current = head;
while (current->next != NULL) {
    current = current->next;
}
current->next = node;
```

זו הדרך הסטנדרטית **לעבור** (traverse) על רשימה, והיא לוקחת זמן יחסי לאורך. (לכן הוספה בהתחלה זולה, והוספה בסוף לא, אלא אם זוכרים גם מצביע לזנב.)

## הדפסה וספירה

אותה הליכה עובדת עם לולאת `for`:

```c
for (const struct Node *p = head; p != NULL; p = p->next) {
    printf("%d -> ", p->value);
}
printf("NULL\n");        // prints: 3 -> 2 -> 1 -> NULL
```

אנחנו לא מדפיסים כתובות, רק ערכים, ולכן הפלט זהה בכל הרצה.

## שחרור הרשימה

כל `malloc` צריך `free`, ולכן חייבים לבקר בכל צומת. יש מלכודת: ברגע ש-`free(head)` רץ, הצומת נעלם, וקריאת `head->next` אחר כך היא **שימוש אחרי שחרור** (use after free). לכן שמרו קודם את מצביע ה-next:

```c
while (head != NULL) {
    struct Node *next = head->next;   // remember where to go
    free(head);                       // now release this node
    head = next;
}
```

אחרי זה המצביע של הקורא עדיין מחזיק את הכתובת הישנה של הצומת הראשון, שאינה תקפה. הרגל טוב הוא לקבוע אותו מיד ל-`NULL`, כמו ש-`main` עושה.

## בדיקת העבודה

במחשב שלכם אפשר לקמפל עם `gcc -fsanitize=address -g` ו-AddressSanitizer מדווח על דליפות ועל שימוש אחרי שחרור; `valgrind ./a.out` עושה עבודה דומה.

> **שימו לב:**
> - שכחתם לקבוע `node->next = NULL` עבור צומת אחרון חדש: הזבל בשדה שלא אותחל גורם להליכה לצאת מהקצה ולקרוס עם `Segmentation fault`.
> - שחרור צומת ואז קריאת `head->next`: שימוש אחרי שחרור, עם תוצאות אקראיות או `AddressSanitizer: heap-use-after-free`.
> - אי שחרור בכלל: **דליפת זיכרון** (`LeakSanitizer: detected memory leaks`).
> - קריאה ל-`current->next` כש-`current` הוא `NULL`: segmentation fault. ב-`push_back`, טפלו קודם ברשימה ריקה.
> - כתיבת `push_front(list, 3);` בלי לשים את התוצאה במשתנה: הצומת החדש אבד, והוא דולף.

## להמשיך הלאה

כתבו `reverse(head)` שהופכת את כל מצביעי ה-`next` בעזרת שלושה מצביעים (`previous`, `current`, `next`), או `remove_value(head, v)` שמנתקת את הצומת הראשון שמחזיק `v` ומשחררת אותו.

> **תורכם:** כתבו את `push_front`, `push_back`, `print_list`, `length` ו-`free_list` כך ש-`main` תדפיס את הרשימה כ-`3 -> 2 -> 1 -> NULL`, אחר כך `3 -> 2 -> 1 -> 0 -> NULL`, אחר כך `Length: 4`, ולבסוף `NULL` עבור הרשימה המשוחררת (הריקה).
