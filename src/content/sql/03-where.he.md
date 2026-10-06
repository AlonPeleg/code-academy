---
title: "WHERE - סינון שורות"
summary: "השאירו רק את השורות שמתאימות לתנאי."
hints:
  - "סעיף סינון בא אחרי FROM. כל תנאי משווה עמודה לערך, והמילה שדורשת ששניהם יתקיימו מחברת ביניהם."
  - "השתמשו ב-WHERE עם שני תנאים: age גדול מ-20, ו-city שווה לטקסט 'Tel Aviv' (טקסט נכתב בגרשיים בודדים). חברו אותם עם AND."
  - "SELECT name, age FROM students WHERE age > 20 AND city = 'Tel Aviv';"
quiz:
  - q: "איזה סעיף מסנן שורות?"
    options: ["ORDER BY", "LIMIT", "WHERE"]
  - q: "איך כותבים טקסט ב-SQL?"
    options: ["בלי גרשיים: Haifa", "בגרשיים בודדים: 'Haifa'", "בגרש הפוך (backticks): `Haifa`"]
  - q: "איך מוצאים שורות שבהן ל-city אין ערך?"
    options: ["city IS NULL", "city = NULL", "city = ''"]
    explain: "NULL פירושו לא ידוע או חסר, ולכן חייבים לבדוק אותו עם IS NULL."
  - q: "מה מחזיר WHERE age > 20 AND city = 'Haifa' ?"
    options: ["שורות שבהן הגיל מעל 20 או שהעיר היא Haifa", "שורות שבהן שני התנאים מתקיימים", "רק שורות מחיפה"]
messages:
  - "סננו עם WHERE."
  - "חברו את שני התנאים עם AND."
---

טבלה יכולה להכיל אלפי או מיליוני שורות, אבל בדרך כלל מעניינות אתכם רק כמה מהן. `WHERE` הוא המסנן: הוא משאיר את השורות שבהן תנאי מתקיים וזורק את כל השאר.

## הצורה הבסיסית

```sql
SELECT name, age
FROM students
WHERE age >= 21;
```

קראו זאת כך: "הציגו את השם והגיל של הסטודנטים, אבל רק כאשר הגיל הוא לפחות 21". סעיף `WHERE` תמיד בא ישר אחרי `FROM`. כל שורה נבדקת בנפרד, ורק שורות שעוברות את הבדיקה מופיעות בתוצאה.

## אופרטורי השוואה

| אופרטור | משמעות | דוגמה |
| --- | --- | --- |
| `=` | שווה (סימן שווה אחד, לא שניים) | `city = 'Haifa'` |
| `<>` או `!=` | לא שווה | `city <> 'Haifa'` |
| `<` `>` | קטן, גדול | `age > 20` |
| `<=` `>=` | קטן או שווה, גדול או שווה | `age <= 21` |

שימו לב ש-SQL משתמשת ב-`=` יחיד כדי להשוות, בניגוד לשפות תכנות רבות.

## טקסט דורש גרשיים בודדים

מספרים נכתבים כמו שהם, אבל **ערכי טקסט נכתבים בגרשיים בודדים**: `city = 'Haifa'`. השוואת טקסט ב-SQLite רגישה לאותיות גדולות וקטנות עבור `=`, ולכן `'haifa'` לא תתאים ל-`'Haifa'`. גרשיים כפולים מיועדים לשמות של עמודות וטבלאות, ולכן אל תשתמשו בהם לטקסט.

## שילוב תנאים

השתמשו ב-`AND`, ב-`OR` וב-`NOT` כדי לבנות שאלות גדולות יותר:

```sql
SELECT name
FROM students
WHERE age > 20 AND city = 'Haifa';     -- both must be true

SELECT name
FROM students
WHERE city = 'Haifa' OR city = 'Eilat'; -- at least one must be true
```

כשמערבבים `AND` ו-`OR`, קודם מחושב `AND`. הוסיפו סוגריים עגולים כדי להיות ברורים: `WHERE (a OR b) AND c`.

## NULL: הערך החסר

העיר של Yael חסרה, ומסד הנתונים שומר אותה כ-`NULL`. `NULL` פירושו "לא ידוע", ושום דבר אף פעם לא שווה למשהו לא ידוע, גם לא `NULL` אחר. לכן שתי השאילתות האלה לא מחזירות שורות:

```sql
SELECT name FROM students WHERE city = NULL;   -- never matches
SELECT name FROM students WHERE city <> 'Haifa'; -- also skips Yael!
```

בודקים ערכים חסרים עם `IS NULL` או `IS NOT NULL`:

```sql
SELECT name FROM students WHERE city IS NULL;  -- Yael
```

> **שימו לב:**
> - כתיבת `city = Haifa` בלי גרשיים גורמת ל-`no such column: Haifa` כי SQL חושבת ש-Haifa היא עמודה.
> - `WHERE age = 20 OR 21` לא אומר "20 או 21". כתבו `age = 20 OR age = 21`.
> - `= NULL` לא מחזיר כלום, בלי שום הודעה. השתמשו ב-`IS NULL`.
> - `WHERE` חייב לבוא לפני `ORDER BY` ו-`LIMIT`; אם מניחים אותו אחריהם מקבלים `near "WHERE": syntax error`.

> **תורכם:** מצאו את השם והגיל של סטודנטים מעל גיל 20 שגרים ב-`'Tel Aviv'`.
