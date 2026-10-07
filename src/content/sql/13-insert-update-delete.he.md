---
title: "INSERT, UPDATE ו-DELETE"
summary: "שנו את הנתונים בטבלה, ואז בדקו את התוצאה עם SELECT."
hints:
  - "שלוש פקודות שונות, כל אחת מסתיימת בנקודה-פסיק, ונכתבות מעל ה-SELECT האחרון. ב-UPDATE וב-DELETE חובה לציין על איזו שורה הן פועלות."
  - "INSERT INTO students VALUES (...) עם הערכים בסדר העמודות (id, name, age, city). UPDATE students SET city = ... WHERE id = 6. DELETE FROM students WHERE id = 4."
  - "INSERT INTO students VALUES (8, 'Tal', 22, 'Haifa');   UPDATE students SET city = 'Haifa' WHERE id = 6;   DELETE FROM students WHERE id = 4;"
quiz:
  - q: "איזו פקודה מוסיפה שורה חדשה?"
    options: ["ADD ROW", "INSERT INTO", "UPDATE"]
  - q: "מה קורה אם מריצים  DELETE FROM students;  בלי WHERE?"
    options: ["כלום", "היא מוחקת רק את השורה הראשונה", "היא מוחקת כל שורה בטבלה"]
  - q: "איזה סעיף קובע איזה ערך לשנות ב-UPDATE?"
    options: ["SET", "CHANGE", "VALUES"]
  - q: "למה בשיעור הזה מסיימים עם SELECT?"
    options: ["כי INSERT דורש את זה", "כדי לראות את התוצאה, מפני שמוצגת רק טבלת התוצאה של הפקודה האחרונה", "SELECT נדרש אחרי כל שינוי"]
messages:
  - "הוסיפו את Tal עם INSERT INTO students."
  - "שנו את העיר של Dana עם UPDATE students SET."
  - "הסירו את Omer עם DELETE FROM students."
  - "ל-UPDATE ול-DELETE צריך WHERE, אחרת הם משנים כל שורה!"
---

עד עכשיו רק **קראתם** נתונים. אפליקציות אמיתיות גם מוסיפות רשומות חדשות, מתקנות טעויות ומסירות רשומות ישנות. שלוש המשימות האלה נעשות עם `INSERT`, `UPDATE` ו-`DELETE`. יחד עם `SELECT` הן מוכרות בשם **CRUD**: Create, Read, Update, Delete (יצירה, קריאה, עדכון, מחיקה).

## INSERT: הוספת שורה

```sql
INSERT INTO students VALUES (8, 'Tal', 22, 'Haifa');
```

הערכים חייבים להיות באותו סדר כמו עמודות הטבלה: `id`, `name`, `age`, `city`. צורה בטוחה וברורה יותר מציינת את שמות העמודות, וכך אפשר לדלג על חלק מהן (הן יהפכו ל-`NULL`):

```sql
INSERT INTO students (id, name, age)
VALUES (9, 'Eli', 25);
```

אפשר להוסיף כמה שורות בבת אחת על ידי הפרדת הקבוצות בפסיקים, כמו בנתוני הדוגמה.

## UPDATE: שינוי שורות קיימות

```sql
UPDATE students
SET city = 'Haifa'
WHERE id = 6;
```

- `UPDATE students` קובע איזו טבלה.
- `SET city = 'Haifa'` קובע את הערך החדש. אפשר לקבוע כמה עמודות בבת אחת: `SET city = 'Haifa', age = 20`.
- `WHERE id = 6` בוחר את השורות לשינוי.

אפשר גם לחשב מהערך הישן: `SET age = age + 1` מבגר את כולם בשנה (כשאין `WHERE`).

## DELETE: הסרת שורות

```sql
DELETE FROM students
WHERE id = 4;
```

## הכלל החשוב ביותר: תמיד השתמשו ב-WHERE

בלי `WHERE`, הפקודות `UPDATE` ו-`DELETE` חלות על **כל שורה**:

```sql
DELETE FROM students;   -- empties the whole table!
```

הרגל טוב: קודם כתבו `SELECT` עם אותו `WHERE` כדי לבדוק אילו שורות הוא מוצא, ורק אחר כך הפכו את ה-`SELECT` ל-`UPDATE` או ל-`DELETE`. השתמשו במפתח הראשי (`id`) כדי לכוון בדיוק לשורה אחת.

## לראות את התוצאה

`INSERT`, `UPDATE` ו-`DELETE` לא מחזירים טבלה; הם רק משנים נתונים. בעורך הזה לוח התוצאות מציג רק את הפקודה **האחרונה** שמחזירה שורות, ולכן סיימו את הסקריפט עם `SELECT` כדי לראות את המצב החדש. כל הרצה מתחילה מחדש מנתוני הדוגמה המקוריים, ולכן הניסויים שלכם לא יכולים לשבור שום דבר.

```sql
UPDATE courses SET credits = credits + 1 WHERE language = 'SQL';
SELECT title, credits FROM courses;
```

> **שימו לב:**
> - מפתח ראשי כפול, כמו הוספה חוזרת של `id` 1, נכשל עם `UNIQUE constraint failed: students.id`.
> - מספר ערכים לא נכון: `table students has 4 columns but 3 values were supplied`.
> - שכחת הגרשיים סביב טקסט ב-`VALUES` גורמת ל-`no such column: Tal`.
> - שכחת נקודה-פסיק בין פקודות גורמת ל-`near "UPDATE": syntax error`.
> - `UPDATE` או `DELETE` בלי `WHERE` משנים בשקט את כל השורות.

> **תורכם:** הוסיפו את Tal (id 8, גיל 22, Haifa), העבירו את Dana (id 6) ל-Haifa ומחקו את Omer (id 4). ה-`SELECT` האחרון בעורך יציג את התוצאה.
