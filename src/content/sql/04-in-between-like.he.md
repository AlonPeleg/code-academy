---
title: "IN, BETWEEN, LIKE ו-NOT"
summary: "כתבו מסננים עשירים יותר עם רשימות, טווחים ותבניות טקסט."
hints:
  - "צריך שלושה תנאים מחוברים, וכל אחד משתמש בעזר אחר: בדיקת רשימה, בדיקת טווח ובדיקת תבנית, ובנוסף דרך לומר לא."
  - "city IN ('Haifa', 'Eilat', 'Jerusalem'), אחר כך age BETWEEN 19 AND 21, ואחר כך name NOT LIKE 'N%' (סימן האחוז מייצג כל מספר של תווים). חברו אותם עם AND."
  - "SELECT name, city FROM students WHERE city IN ('Haifa', 'Eilat', 'Jerusalem') AND age BETWEEN 19 AND 21 AND name NOT LIKE 'N%' ORDER BY name;"
quiz:
  - q: "מה בודק  city IN ('Haifa', 'Eilat')  ?"
    options: ["ש-city הוא גם Haifa וגם Eilat", "ש-city הוא אחד מהערכים ברשימה", "ש-city מכיל את האותיות Haifa"]
  - q: "האם  age BETWEEN 19 AND 21  כולל את 19 ואת 21?"
    options: ["לא, רק 20", "רק 19", "כן, שני הקצוות נכללים"]
  - q: "איזו תבנית מתאימה לשמות שמתחילים ב-A?"
    options: ["LIKE '%A'", "LIKE 'A%'", "LIKE '%A%'"]
  - q: "מה עושה קו תחתון ב-  LIKE '_a%' ?"
    options: ["מתאים בדיוק לתו אחד", "מתאים לכל מספר של תווים", "מתאים לקו תחתון עצמו"]
messages:
  - "השתמשו ב-IN ( ... ) עם רשימת ערים."
  - "השתמשו ב-BETWEEN לטווח הגילים."
  - "השתמשו ב-LIKE לתבנית השם."
  - "השתמשו ב-NOT כדי להוציא שמות שמתחילים ב-N."
---

התנאי הבסיסי `WHERE age > 20 AND city = 'Haifa'` מספיק לשאלות פשוטות. SQL מציעה גם כמה קיצורי דרך שהופכים שאלות גדולות יותר לקצרות וקריאות יותר.

## IN: התאמה לכל ערך ברשימה

במקום לשרשר כמה `OR`:

```sql
SELECT name FROM students
WHERE city = 'Haifa' OR city = 'Eilat' OR city = 'Jerusalem';
```

כתבו רשימה:

```sql
SELECT name FROM students
WHERE city IN ('Haifa', 'Eilat', 'Jerusalem');
```

הערך מתאים אם הוא שווה ל**אחד** מהפריטים ברשימה. גם מספרים עובדים: `id IN (1, 3, 5)`.

## BETWEEN: טווח

```sql
SELECT name, age FROM students
WHERE age BETWEEN 19 AND 21;
```

זה זהה ל-`age >= 19 AND age <= 21`. **שני הקצוות נכללים.** המספר הראשון חייב להיות הקטן.

## LIKE: תבניות טקסט פשוטות

`LIKE` משווה טקסט לתבנית, בעזרת שני סימנים מיוחדים:

| סימן | משמעות |
| --- | --- |
| `%` | כל מספר של תווים (גם אפס) |
| `_` | תו אחד בדיוק |

| תבנית | מתאימה ל- |
| --- | --- |
| `'A%'` | מתחיל ב-A: Ava |
| `'%a'` | מסתיים ב-a: Ava, Maya, Dana |
| `'%ao%'` | מכיל "ao" בכל מקום |
| `'_a%'` | האות השנייה היא a: Maya, Dana, Yael |

ב-SQLite, `LIKE` מתעלם מהבדל בין אותיות גדולות לקטנות באותיות אנגליות רגילות, ולכן `'a%'` מתאים גם ל-Ava.

## NOT: הפיכת תנאי

`NOT` עובד לפני תנאים וגם לפני העזרים שלמעלה:

```sql
WHERE city NOT IN ('Haifa', 'Eilat')
WHERE age NOT BETWEEN 19 AND 21
WHERE name NOT LIKE 'A%'
WHERE NOT (age > 20 AND city = 'Haifa')
```

## משלבים הכול

כל עזר הוא תנאי רגיל, ולכן אפשר לחבר אותם עם `AND` / `OR` בדיוק כמו קודם. כתבו כל תנאי בשורה נפרדת לשם קריאות:

```sql
SELECT name, city
FROM students
WHERE city IN ('Haifa', 'Tel Aviv')
  AND age BETWEEN 20 AND 25
  AND name LIKE '%a'
ORDER BY name;
```

זכרו את ההשפעה של הערך החסר: `city NOT IN ('Haifa')` מדלג על Yael, כי השוואה של `NULL` לכל דבר אף פעם אינה אמת. אם רוצים שהיא תיכלל, הוסיפו `OR city IS NULL`.

> **שימו לב:**
> - אם שוכחים את הסוגריים אחרי `IN` מקבלים `near "'Haifa'": syntax error`.
> - כתיבת `BETWEEN 21 AND 19` (הגדול קודם) לא מחזירה כלום, בלי שום שגיאה.
> - `LIKE 'Ava'` בלי `%` היא פשוט בדיקת שוויון.
> - ערבוב `AND` ו-`OR` בלי סוגריים: `a OR b AND c` פירושו `a OR (b AND c)`.
> - `NOT IN` עם `NULL` ברשימה לא מחזיר כלום. הרחיקו את `NULL` מרשימות.

> **תורכם:** הציגו את השם והעיר של סטודנטים שגרים ב-Haifa, ב-Eilat או ב-Jerusalem, בני 19 עד 21, ושהשם שלהם לא מתחיל ב-`N`. מיינו לפי שם.
