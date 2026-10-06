---
title: "רכיבים - כרטיסים, כפתורים, תגים, התראות וקבוצות רשימה"
summary: "הרכיבו שורה של כרטיסי מוצר, התראה וקבוצת רשימה מהרכיבים המוכנים של Bootstrap."
hints:
  - "כל רכיב הוא מחלקת בסיס ועוד חלקים: alert + alert-success, list-group + list-group-item, ובכרטיס card, card-body ו-card-footer שכבר מופיעים במוצר הראשון."
  - "שנו את ה-div הראשון ל-class alert alert-success עם role alert, ואת הרשימה ל-list-group / list-group-item. בכרטיסים, העתיקו את כל ה-div של העמודה (col) ולא רק את הכרטיס, ושנו את הטקסט."
  - 'התראה: <div class="alert alert-success" role="alert">. רשימה: <ul class="list-group"> עם פריטי <li class="list-group-item">. בתוך השורה (row) הדביקו עוד שני בלוקים של <div class="col"> ... </div> עבור Keyboard ($45) ו-Webcam ($39).'
quiz:
  - q: "איזו מחלקה גורמת לכל הכרטיסים בשורה להיות באותו גובה?"
    options: ["card-equal", "h-100 על כל כרטיס", "card-body"]
    explain: "h-100 קובעת גובה של 100%, והעמודה גבוהה כמו הגבוהה ביותר בשורה."
  - q: "איך יוצרים התראה ירוקה?"
    options: ["alert יחד עם alert-success", "success לבדה", "btn-success"]
  - q: "למה משמש תג (badge)?"
    options: ["תמונת באנר גדולה", "שדה בטופס", "תווית קטנה, כמו סטטוס או מספר"]
  - q: "בתוך מה חייב להימצא list-group-item?"
    options: ["div עם המחלקה list-group-wrapper", "אלמנט עם המחלקה list-group (‏ul או div)", "רק בתוך card-body"]
messages:
  - 'הוסיפו role="alert" להתראה כדי שטכנולוגיות מסייעות יקריאו אותה.'
  - "צריך שלושה כרטיסי מוצר, וכל אחד עם המחלקות card h-100."
---

**הרכיבים** (components) של Bootstrap הם חלקי ממשק מוכנים. אתם לא מעצבים כרטיס מאפס: כותבים את מבנה ה-HTML הנכון עם שמות המחלקות הנכונים, והוא מופיע עם ריווח, פינות מעוגלות והתאמה למסכים שונים. השיעור הזה עוסק בחמישה הרכיבים שתשתמשו בהם הכי הרבה.

## כפתורים

כבר הכרתם את `btn` עם צבע. הנה עוד אפשרויות:

- צבעים: `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`, `btn-light`, `btn-dark`.
- גרסאות מתאר (outline): `btn-outline-primary` וכן הלאה.
- גדלים: `btn-sm` ו-`btn-lg`.
- עובד גם על `<button>` וגם על `<a>`. השתמשו ב-`<a href>` אמיתי לקישורים לדף אחר, וב-`<button>` לפעולות.

## כרטיסים

כרטיס (card) הוא קופסה גמישה לפיסת תוכן. המבנה חשוב:

```html
<div class="card">
  <div class="card-body">
    <h5 class="card-title">Title</h5>
    <p class="card-text">Some text.</p>
  </div>
  <div class="card-footer">Footer</div>
</div>
```

- `card` מצייר את המסגרת ואת הפינות המעוגלות.
- `card-body` מוסיף ריווח פנימי סביב התוכן. `card-header` ו-`card-footer` הם פסים אופציונליים למעלה ולמטה.
- `card-title` ו-`card-text` מסדרים את הרווחים של כותרות ופסקאות.
- יש גם `card-img-top` לתמונה בחלק העליון. בקורס הזה אנחנו נמנעים מתמונות חיצוניות, ולכן `div` צבעוני יכול לשמש במקומן.

**שורה של כרטיסים.** מניחים כל כרטיס בעמודה של הרשת (grid). `row row-cols-1 row-cols-md-3 g-4` אומר "כרטיס אחד בשורה בטלפונים, שלושה בשורה מגודל md ומעלה, עם מרווח של 4". כל ילד של השורה הופך לעמודה אוטומטית, ולכן מספיק לתת לו `col`. הוסיפו `h-100` לכל כרטיס כדי שיימתחו לאותו גובה גם כשאורכי הטקסט שונים.

## תגים

תג (badge) הוא תווית קטנה בצורת גלולה, מצוינת לסטטוסים ולמספרים: `<span class="badge text-bg-success">In stock</span>`. המחלקה `text-bg-*` קובעת גם צבע רקע וגם צבע טקסט קריא. הוסיפו `rounded-pill` לקצוות עגולים לגמרי.

## התראות

התראה (alert) היא פס הודעה צבעוני:

```html
<div class="alert alert-success" role="alert">Saved!</div>
```

`alert` היא מחלקת הבסיס, ו-`alert-success`, `alert-info`, `alert-warning`, `alert-danger` בוחרות את משפחת הצבע. `role="alert"` אומר לקוראי מסך להכריז עליה. בתוך התראה, קישורים יכולים להשתמש ב-`alert-link`. עם חבילת ה-JavaScript אפשר גם להוסיף `alert-dismissible fade show` וכפתור סגירה (`btn-close` עם `data-bs-dismiss="alert"`) כדי שאפשר יהיה לסגור אותה.

## קבוצות רשימה

קבוצת רשימה (list group) היא רשימה מעוצבת, לתפריטים, להגדרות או לפרטי משלוח:

```html
<ul class="list-group">
  <li class="list-group-item">First</li>
  <li class="list-group-item active">Second (highlighted)</li>
</ul>
```

הוסיפו `list-group-flush` כדי להסיר את המסגרות החיצוניות, או `list-group-numbered` למספור.

## איך קוראים רכיב

הביטו בכרטיס המוצר הראשון בתרגיל: `card h-100` בתוך `col`, עם `card-body` שמכיל תג, כותרת וטקסט, ו-`card-footer` שמשתמש בכלי ה-flex מהשיעור הקודם כדי למקם את המחיר והכפתור בקצוות מנוגדים. רכיבים וכלי עזר (utilities) עובדים יחד בצורה כזו כל הזמן.

> **שימו לב:**
> - הצבת `card-title` או הטקסט מחוץ ל-`card-body`. אז הם נוגעים במסגרת הכרטיס, כי הריווח מגיע מהגוף.
> - העתקת הכרטיס הפנימי בלבד בלי העוטף `col`. אז השורה מקבלת כרטיס שאינו עמודה, והפריסה של שלושה בשורה נשברת.
> - שימוש ב-`alert-success` בלי `alert`. שום דבר לא מעוצב.
> - שימוש ב-`<div class="btn">` למשהו שמנווט. השתמשו ב-`<a>` או ב-`<button>` להתנהגות נכונה במקלדת ובקורא מסך.
> - שכחת `h-100`, שגורמת לכרטיסים בגבהים שונים בשורה.

> **תורכם:** הפכו את ה-div הראשון ל-`div` עם המחלקות `alert alert-success` ועם `role="alert"`, העתיקו את עמודת המוצר פעמיים כדי להוסיף כרטיסים של Keyboard ‏($45) ו-Webcam ‏($39) עם הטקסטים מההערה, והפכו את רשימת המשלוח ל-`list-group` עם פריטי `list-group-item`.
