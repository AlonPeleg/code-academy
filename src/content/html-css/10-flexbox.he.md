---
title: "פריסה עם Flexbox"
summary: "מסדרים אלמנטים בשורה ומרווחים ביניהם."
hints:
  - "רק ההורה (.row) צריך להשתנות. הערך של display שלו קובע איך הילדים שלו מסודרים."
  - "קודם הפכו את .row למיכל flex בעזרת המאפיין display. אחר כך השתמשו במאפיין שני שמפזר את האלמנטים לאורך השורה."
  - "display: flex;   ו-   justify-content: space-between;"
quiz:
  - q: "איזו הצהרה הופכת אלמנט למיכל flex?"
    options: ["position: flex;", "flex: container;", "display: flex;"]
  - q: "איזה מאפיין מפזר פריטי flex לאורך הציר הראשי (למשל space-between)?"
    options: ["align-items", "justify-content", "flex-wrap"]
    explain: "justify-content פועל לאורך הציר הראשי (שורה, כברירת מחדל). align-items פועל לרוחבו."
  - q: "כברירת מחדל, פריטי flex מסודרים ב..."
    options: ["שורה", "עמודה", "מעגל"]
  - q: "על איזה אלמנט שמים display flex?"
    options: ["על כל ילד (הפריטים)", "על ההורה (המיכל)", "רק על ה-body"]
---

בדרך כלל אלמנטי `<div>` נערמים זה מעל זה, אחד בכל שורה. **Flexbox** הוא כלי פריסה שמאפשר לסדר ילדים בשורה (או בעמודה) ולשלוט ברווחים וביישור שלהם. כך בנויים רוב סרגלי הניווט, שורות הכרטיסים וסרגלי הכלים באינטרנט.

## מיכל ופריטים

ב-Flexbox תמיד יש שתי רמות. **ההורה** הוא *מיכל ה-flex* (flex container), ו**הילדים הישירים** שלו הם *פריטי ה-flex* (flex items). מפעילים אותו עם שורה אחת על ההורה:

```css
.row {
  display: flex;
}
```

מיד התיבות קופצות לשורה אחת, זו לצד זו. לא נגעתם בתיבות עצמן.

## שני הצירים

Flexbox חושב בשני כיוונים:

- **הציר הראשי** (main axis) הוא הכיוון שבו הפריטים זורמים. כברירת מחדל זה משמאל לימין (שורה).
- **הציר המשני** (cross axis) הוא הכיוון השני (מלמעלה למטה).

שני מאפיינים שולטים בהם:

- `justify-content` ממקם פריטים לאורך הציר **הראשי**.
- `align-items` ממקם פריטים לאורך הציר **המשני**.

```css
.row {
  display: flex;
  justify-content: space-between; /* spread out, first and last touch the edges */
  align-items: center;            /* centre vertically */
  gap: 12px;                      /* space between items */
}
```

ערכים שאפשר להשתמש בהם עבור `justify-content`:

| ערך | תוצאה |
| --- | --- |
| `flex-start` | הפריטים צמודים להתחלה (ברירת מחדל) |
| `center` | הפריטים באמצע |
| `flex-end` | הפריטים צמודים לסוף |
| `space-between` | רווח שווה בין הפריטים, בלי רווח בקצוות |
| `space-around` | רווח שווה סביב כל פריט |

## כיוון ושבירת שורות

- `flex-direction: column;` מסדר פריטים אנכית. עכשיו הציר הראשי מצביע כלפי מטה, ולכן `justify-content` פועל אנכית.
- `flex-wrap: wrap;` נותן לפריטים לעבור לשורה חדשה כשאין מספיק מקום.

## פריטים שגדלים

הוסיפו `flex: 1;` לפריט והוא יגדל וייקח את המקום הפנוי. אם לכל שלוש התיבות יש `flex: 1;` הן חולקות את הרוחב שווה בשווה.

## קלאסיקה: מירכוז מושלם

```css
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
```

> **שימו לב:**
> - שמים `display: flex` על הילדים במקום על ההורה. שום דבר לא קורה, כי המיכל חייב להיות ההורה.
> - נדמה ש-`justify-content: space-between` לא עושה כלום: ייתכן שהמיכל לא רחב יותר מהתוכן שלו (למשל אם הוא inline), או שיש רק פריט אחד.
> - `justify-content: middle` אינו תקין. המילה היא `center`.
> - בלבול בין שני הצירים אחרי המעבר ל-`flex-direction: column`: התפקידים של `justify-content` ושל `align-items` מחליפים כיוונים.
> - שימוש ב-margins יחד עם `space-between` שנותן ריווח לא צפוי. העדיפו `gap`.

## להמשך

הוסיפו `gap: 12px` ו-`align-items: center` ל-`.row`. שנו את `justify-content` ל-`center`, ואחר כך ל-`flex-end`. הוסיפו `flex-direction: column` וראו מה קורה.

> **תורכם:** הפכו את `.row` למיכל flex עם `justify-content: space-between`.
