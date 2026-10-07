---
title: "מצביעים לפונקציות ו-callbacks"
summary: "שומרים פונקציה במשתנה, מעבירים אותה לפונקציות אחרות וממיינים עם qsort."
hints:
  - "מצביע לפונקציה (function pointer) מחזיק את הכתובת של פונקציה, ולכן אפשר להעביר \"מה לעשות\" כארגומנט. הטיפוס של פרמטר כזה נכתב כמו החתימה של הפונקציה, כשהשם בסוגריים אחרי כוכבית."
  - "פרמטר: int (*op)(int, int). בתוך apply: return op(x, y). פונקציית השוואה של qsort קוראת את המספרים עם *(const int *)a ו-*(const int *)b, ומחזירה מספר שלילי, אפס או חיובי (למשל ההפרש, או (x > y) - (x < y))."
  - "int apply(int x, int y, int (*op)(int, int)) { return op(x, y); }   int compare_ascending(const void *a, const void *b) { int x = *(const int *)a; int y = *(const int *)b; return (x > y) - (x < y); }   (יורד: החליפו בין x ל-y)   qsort(numbers, n, sizeof(int), compare_ascending);"
messages:
  - "טיפוס הפרמטר הוא  int (*op)(int, int)."
  - "מיינו עם qsort(numbers, n, sizeof(int), compare_ascending)."
  - "מיינו שוב עם compare_descending."
  - "קראו ל-apply(6, 7, multiply)."
quiz:
  - q: "מה משמעות ההצהרה  int (*op)(int, int)  ?"
    options: ["op היא פונקציה שמחזירה מצביע ל-int", "op הוא מצביע לפונקציה שמקבלת שני מספרים שלמים ומחזירה מספר שלם", "op הוא מערך של שני מספרים שלמים"]
  - q: "איך מעבירים את הפונקציה add לפונקציה אחרת?"
    options: ["add(1, 2)", "&add()", "add"]
    explain: "שם של פונקציה בלי סוגריים הוא הכתובת שלה. עם סוגריים הייתם קוראים לה ומעבירים את התוצאה שלה."
  - q: "מה פונקציית השוואה של qsort חייבת להחזיר כשהאיבר הראשון צריך לבוא לפני השני?"
    options: ["מספר שלילי", "מספר חיובי", "תמיד 0"]
  - q: "למה פונקציית ההשוואה של qsort מקבלת פרמטרים מסוג const void * ?"
    options: ["כי ב-C אין מצביעים ל-int", "כדי שהמיון יהיה מהיר יותר", "כדי ש-qsort תוכל למיין איבר מכל טיפוס: בפנים ממירים אותם בחזרה לטיפוס האמיתי"]
---

עד עכשיו העברתם לפונקציות **נתונים**. ב-C אפשר להעביר לפונקציה גם **פונקציה**, וכך קטע קוד אחד יכול לומר "בצע את המיון, והשתמש ב*כלל הזה* כדי להחליט על הסדר". משתנה שמחזיק את הכתובת של פונקציה הוא **מצביע לפונקציה** (function pointer). הם מניעים callbacks, מערכות תוספים ואת `qsort` של הספרייה הסטנדרטית.

## לפונקציות יש כתובות

כל פונקציה גרה איפשהו בזיכרון, והשם שלה, כשהוא כתוב בלי סוגריים, הוא הכתובת שלה:

```c
int add(int a, int b) { return a + b; }

int (*op)(int, int) = add;     // op points to add
printf("%d\n", op(2, 3));      // prints: 5
```

איך קוראים את `int (*op)(int, int)`: מתחילים מהאמצע. `op` הוא מצביע (`*op`) לפונקציה שמקבלת `(int, int)` ומחזירה `int`. הסוגריים סביב `*op` הכרחיים. בלעדיהם, `int *op(int, int)` מצהירה על פונקציה שמחזירה `int *`.

קוראים דרך המצביע כך: `op(2, 3)` (או בכתיבה הישנה יותר `(*op)(2, 3)`).

## העברת פונקציה כארגומנט

פרמטר של פונקציה יכול להיות מצביע לפונקציה. זה נקרא **callback**: מוסרים פונקציה שהקוד השני יקרא לה בחזרה בהמשך.

```c
int apply(int x, int y, int (*op)(int, int)) {
    return op(x, y);
}

printf("%d\n", apply(6, 7, add));        // prints: 13
printf("%d\n", apply(6, 7, multiply));   // prints: 42
```

`apply` לא יודעת מה `op` עושה. היא יודעת רק את הצורה: שני מספרים שלמים נכנסים, מספר שלם אחד יוצא. מחליפים את הפונקציה ומשנים את ההתנהגות בלי לגעת ב-`apply`.

לשיפור הקריאות הרבה מתכנתים נותנים לטיפוס שם עם `typedef`:

```c
typedef int (*BinaryOp)(int, int);
int apply(int x, int y, BinaryOp op);
```

## מיון עם qsort

`<stdlib.h>` מספקת את `qsort`, מיון מהיר שעובד על **כל** מערך, כי אתם אומרים לו איך להשוות שני איברים:

```c
qsort(array, count, size_of_one_element, compare);
```

| ארגומנט | משמעות |
| --- | --- |
| `array` | המערך למיון |
| `count` | כמה איברים |
| `size_of_one_element` | `sizeof(int)` עבור מערך של int |
| `compare` | ה-callback שלכם |

ל-callback יש חתימה קבועה. הוא מקבל שני מצביעים מסוג **`const void *`** (מצביע ל"משהו"), כי `qsort` לא מכירה את טיפוס האיברים. בפנים ממירים אותם בחזרה ומשווים:

```c
int compare_ascending(const void *a, const void *b) {
    int x = *(const int *)a;     // cast to int pointer, then read the value
    int y = *(const int *)b;
    return (x > y) - (x < y);    // -1, 0 or 1
}
```

ערך ההחזרה אומר ל-`qsort` מה הסדר: **שלילי** פירושו ש-`a` בא קודם, **אפס** פירושו שווים, **חיובי** פירושו ש-`b` בא קודם. הביטוי `(x > y) - (x < y)` מפיק בדיוק -1, 0 או 1. כדי למיין **בסדר יורד**, פשוט החליפו בין `x` ל-`y`.

כתיבת `return x - y;` נפוצה אבל מסוכנת: עבור ערכים גדולים (כמו `INT_MAX` פחות מספר שלילי) החיסור גולש ונותן סימן שגוי.

## להמשיך הלאה

אותו רעיון ממיין מחרוזות או מבנים: רק ההמרה משתנה. עבור מערך של מבנים תכתבו `const struct Person *p = a;` ותשוו את `p->age`.

> **שימו לב:**
> - `int *op(int, int)` במקום `int (*op)(int, int)`: זה מתקמפל, אבל מצהיר על פונקציה ולא על מצביע, ומקבלים `warning: initialization of 'int *' from incompatible pointer type`.
> - העברת `add()` במקום `add`: קוראים לפונקציה ומעבירים `int`. שגיאה: `passing argument 3 of 'apply' makes pointer from integer without a cast`.
> - חתימת השוואה שגויה (למשל `int cmp(int *a, int *b)`): `warning: passing argument 4 of 'qsort' from incompatible pointer type`, והתוכנית עלולה להתנהג מוזר.
> - העברת `count` או `sizeof` שגויים ל-`qsort`: היא ממיינת זבל או קורסת. השתמשו ב-`sizeof(array) / sizeof(array[0])` עבור הכמות וב-`sizeof(array[0])` עבור גודל האיבר.
> - קריאה דרך מצביע לפונקציה שהוא `NULL` קורסת עם `Segmentation fault`.

> **תורכם:** השלימו את `apply` עם פרמטר `int (*op)(int, int)`, כתבו את שתי פונקציות ההשוואה, הדפיסו `Sum: 13` ו-`Product: 42`, ואז מיינו את `numbers` בסדר עולה וביורד עם `qsort` והדפיסו את שתי התוצאות.
