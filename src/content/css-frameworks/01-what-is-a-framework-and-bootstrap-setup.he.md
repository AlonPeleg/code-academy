---
title: "מהו framework של CSS? הגדרת Bootstrap"
summary: "הוסיפו את Bootstrap לדף עם תגית link אחת, ועצבו כותרת וכפתורים ראשונים באמצעות שמות של מחלקות בלבד."
hints:
  - "Bootstrap צריך רק שני דברים: תגית link ב-head כדי שה-CSS שלו ייטען, ושמות מחלקות על האלמנטים שלכם. התחילו מה-head ואז עברו למחלקות."
  - "השתמשו בתגית link עם rel stylesheet ובכתובת של jsDelivr שמסתיימת ב-bootstrap.min.css. אחר כך עטפו את ה-h1, את הפסקה ואת הכפתורים ב-div אחד שרשימת המחלקות שלו מתחילה ב-container."
  - 'Head: <meta name="viewport" content="width=device-width, initial-scale=1"> ו-<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">. כפתורים: class="btn btn-primary" ו-class="btn btn-outline-secondary". סוף ה-body: <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>'
quiz:
  - q: "היכן שייך הקישור לגיליון הסגנונות של Bootstrap בדף שלכם?"
    options: ["בסוף ה-body, אחרי הפסקה האחרונה", "בקובץ JavaScript", "ב-head, כדי שהדף יעוצב ברגע שהוא נטען"]
    explain: "ה-CSS צריך להיות מוכר לפני שהדפדפן מצייר את הדף, ולכן הקישור הולך ל-head."
  - q: "מה ההבדל בין המחלקות ב-class=\"btn btn-primary\"?"
    options: ["הן עושות אותו דבר; השנייה היא גיבוי", "btn נותנת צורה ורווחים, ו-btn-primary מוסיפה את הצבע הכחול", "btn-primary היא פונקציית JavaScript"]
  - q: "מה עושה תגית ה-meta של viewport?"
    options: ["גורמת לטלפונים להשתמש ברוחב המסך האמיתי שלהם כדי שהפריסה תוכל להסתגל", "מוסיפה מסגרת סביב החלון", "טוענת את Bootstrap מהר יותר"]
  - q: "איזו מאלה היא מחלקת עזר (utility), עם תפקיד זעיר אחד שאפשר להשתמש בו בכל מקום?"
    options: ["card", "mb-3", "navbar"]
    explain: "mb-3 רק מוסיפה שוליים תחתונים. card ו-navbar הם רכיבים שמורכבים מהרבה כללים."
messages:
  - "הוסיפו את גיליון הסגנונות של Bootstrap עם תגית link ב-head."
  - "הוסיפו את תגית ה-meta של viewport ב-head."
  - "הוסיפו את תגית הסקריפט של חבילת ה-JavaScript של Bootstrap ממש לפני תגית ה-body הסוגרת."
---

כתיבה של כל כלל CSS בעצמכם היא דרך מצוינת ללמוד, אבל צוותים אמיתיים מתחילים לעיתים קרובות מ-**framework של CSS**: גיליון סגנונות גדול ובדוק, מלא במחלקות מוכנות. מוסיפים שם מחלקה ל-HTML והסגנון מופיע. בשיעור הזה תוסיפו את **Bootstrap**, ה-framework הנפוץ ביותר, ותעצבו את הדף הראשון שלכם בלי לכתוב אפילו שורת CSS אחת.

## למה להשתמש ב-framework?

- **מהירות.** כפתור, כרטיס או סרגל ניווט סבירים לוקחים שורה אחת במקום שלושים.
- **עקביות.** רווחים, צבעים וגדלי גופן עוקבים אחרי מערכת אחת, ולכן הדפים נראים כאילו הם שייכים יחד.
- **רספונסיבי כברירת מחדל.** הרשת (grid) והרכיבים מסתגלים לטלפונים ולמסכים גדולים.
- **נבדק.** Bootstrap נבדק בכל הדפדפנים הגדולים, כך שאתם חוסכים הרבה באגים מוזרים.

המחיר: הדפים שלכם עלולים להיראות כמו "כל אתר Bootstrap אחר" אלא אם תתאימו אותם אישית. את זה תלמדו בשיעור האחרון של החצי הזה במסלול.

## הוספת Bootstrap עם קישור CDN

**CDN** (content delivery network, רשת להפצת תוכן) הוא שרת ציבורי מהיר שמארח ספריות פופולריות. לא מורידים כלום, רק מצביעים על הקובץ. הניחו את זה בתוך ה-`<head>`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
```

- תגית ה-meta בשם `viewport` אומרת לטלפונים להשתמש ברוחב האמיתי שלהם. בלעדיה דפדפנים בנייד מעמידים פנים שהם מסך שולחני רחב, והיכולות הרספונסיביות של Bootstrap נראות שבורות.
- `rel="stylesheet"` אומר "הקובץ הזה הוא CSS". הסיומת `.min.css` פירושה שהקובץ מכווץ (הוסרו ממנו רווחים) כדי שיורד מהר יותר.
- `@5.3.3` מקבע את הגרסה, כך שעדכון ב-CDN לא יכול לשנות את הדף שלכם בהפתעה.

רכיבים מסוימים (תפריט הנייד, חלונות מודאליים, תפריטים נפתחים) צריכים גם את ה-JavaScript של Bootstrap. הוסיפו את זה ממש לפני `</body>`:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

"Bundle" פירושו שהוא כולל את Popper, כלי עזר שממקם תפריטים נפתחים וחלונות עזר. אפשר גם להתקין את Bootstrap עם npm (`npm install bootstrap`) בפרויקט עם כלי build; ה-CDN הוא הדרך הפשוטה ביותר להתחיל. בקורס הזה בתצוגה המקדימה Bootstrap מובנה, כך שאותן תגיות עובדות גם בלי אינטרנט.

## שני סוגים של מחלקות

Bootstrap נותן לכם שתי משפחות של מחלקות, ותשלבו ביניהן כל הזמן:

1. **מחלקות רכיב** (component) מעצבות חלק שלם בממשק: `btn`, `card`, `navbar`, `alert`. בדרך כלל הן מחלקת בסיס ועוד גרסה, כמו `btn` + `btn-primary`.
2. **מחלקות עזר** (utility) עושות עבודה קטנה אחת: `py-5` (ריפוד למעלה ולמטה), `mb-3` (שוליים תחתונים), `text-center`, `fw-bold`. מערמים כמה שצריך.

## הפריסה הראשונה שלכם: ה-container

`container` היא מחלקה ל-`<div>` שממרכזת את התוכן ונותנת לו רוחב מרבי שגדל עם המסך. כמעט כל דף Bootstrap מתחיל באחד כזה:

```html
<div class="container py-5">
  <h1>Welcome</h1>
  <button type="button" class="btn btn-primary">Get started</button>
</div>
```

`py-5` פירושו "ריפוד בציר y (למעלה ולמטה), גודל 5" (3rem). הכותרת כבר מעוצבת יפה כי הסגנונות הבסיסיים של Bootstrap מאפסים את ברירות המחדל של הדפדפן עבור `h1`, `p` וחבריהם.

## כפתורים

כפתור צריך את מחלקת הבסיס `btn` ועוד מחלקת צבע אחת. `btn-primary` הוא כחול מלא, `btn-outline-secondary` הוא קו מתאר אפור. אחרים כוללים `btn-success`, `btn-danger`, `btn-warning` ו-`btn-dark`.

> **שימו לב:**
> - שכחת תגית ה-link (או טעות בכתובת). הדף ייראה שוב כמו HTML רגיל; פתחו את לשונית הרשת של הדפדפן וחפשו בקשה אדומה שנכשלה.
> - שימוש ב-`btn-primary` בלבד בלי `btn`. מחלקות הצבע צריכות את מחלקת הבסיס `btn` כדי לעבוד.
> - השמטת תגית ה-meta של viewport. בטלפון הכול נראה זעיר.
> - דילוג על ה-`container`. הטקסט אז נוגע בקצוות החלון.
> - הנחת חבילת ה-JavaScript ב-head. אפשר גם שם, אבל סוף ה-body הוא המקום הבטוח הרגיל.

> **תורכם:** הוסיפו את תגית ה-meta של viewport ואת קישור ה-CSS של Bootstrap ל-head, עטפו את התוכן ב-`div` עם המחלקות `container py-5`, תנו לכפתור הראשון `btn btn-primary` ולשני `btn btn-outline-secondary`, והוסיפו את סקריפט החבילה של JavaScript ממש לפני `</body>` הסוגר.
