---
title: "סרגל ניווט רספונסיבי וטפסים ב-Bootstrap"
summary: "בנו סרגל ניווט שמתקפל לכפתור תפריט בטלפונים, ועצבו טופס הרשמה מלא עם הודעות אימות."
hints:
  - "יש שתי משימות: סרגל הניווט (תבנית של nav, brand, toggler, div מתקפל וקישורי ניווט) והטופס (form-label, form-control, form-select, form-check, input-group). התחילו מסרגל הניווט."
  - "כפתור ה-toggler צריך data-bs-toggle עם הערך collapse ו-data-bs-target שמצביע על ה-id של ה-div המתקפל (#mainNav). אל תשכחו את סקריפט חבילת ה-JavaScript בסוף ה-body."
  - 'ניווט: <nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark"> ... <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>. סיסמה: <input class="form-control is-invalid"> ואחריו <div class="invalid-feedback">.'
quiz:
  - q: "איזו מחלקה גורמת לסרגל ניווט להתקפל לכפתור תפריט במסכים קטנים ולהתפרס מנקודת השבירה lg ומעלה?"
    options: ["navbar-small", "navbar-collapse-lg", "navbar-expand-lg"]
  - q: "למה כפתור ה-toggler לא עושה דבר בלי סקריפט החבילה?"
    options: ["הפתיחה והסגירה נעשות על ידי ה-JavaScript של Bootstrap; ה-CSS רק מעצב", "קובץ ה-CSS קטן מדי", "דפדפנים חוסמים את כל הכפתורים"]
  - q: "איזו מחלקה מעצבת שדה קלט טקסט?"
    options: ["form-input", "form-control", "input-text"]
  - q: "איך מציגים הודעת שגיאה אדומה מתחת לשדה?"
    options: ["alert-danger על התווית", "invalid-feedback בלי שום מחלקה אחרת", "is-invalid על שדה הקלט ואלמנט invalid-feedback מיד אחריו"]
    explain: "ההודעה מוסתרת עד שלאח הקודם שלה יש is-invalid (או שלטופס יש was-validated)."
messages:
  - "הוסיפו את חבילת ה-JavaScript של Bootstrap לפני תג ה-body הסוגר, אחרת כפתור ה-toggler לא יוכל לעבוד."
  - "תנו ל-toggler את aria-controls=mainNav."
  - "תנו ל-toggler את aria-label=Toggle navigation כדי שקוראי מסך יֵדעו מה הוא עושה."
  - "הוסיפו data-bs-theme=dark ל-nav כדי שהקישורים יהיו בהירים על הסרגל הכהה."
---

כמעט לכל אתר צריכים שני דברים: תפריט שעובד בטלפונים וטופס שאפשר למלא. Bootstrap נותן את שניהם כתבניות. בהתחלה הן נראות ארוכות, אבל לכל מחלקה יש תפקיד אחד ברור.

## תבנית סרגל הניווט

סרגל ניווט רספונסיבי הוא מתכון. למדו את הסדר פעם אחת ותוכלו להשתמש בו לתמיד:

```html
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <a class="navbar-brand" href="#">Trailhead</a>
    <button class="navbar-toggler" type="button"
            data-bs-toggle="collapse" data-bs-target="#mainNav"
            aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item"><a class="nav-link active" href="#">Home</a></li>
      </ul>
    </div>
  </div>
</nav>
```

- `navbar` הוא הסרגל; `navbar-expand-lg` אומר "הציגו את הקישורים בשורה מנקודת השבירה lg (‏992px) ומעלה, והסתירו אותם מאחורי כפתור מתחתיה".
- `bg-dark` קובע את הצבע, ו-`data-bs-theme="dark"` אומר ל-Bootstrap להשתמש בטקסט בהיר ובאייקון המבורגר בהיר עליו.
- ה-`container` הפנימי מיישר את התוכן עם שאר הדף.
- `navbar-brand` הוא הלוגו או שם האתר.
- `navbar-toggler` הוא כפתור ההמבורגר. התכונות `data-bs-toggle="collapse"` ו-`data-bs-target="#mainNav"` שלו אומרות "בלחיצה, פתחו או סגרו את האלמנט עם ה-id בשם `mainNav`". תכונות ה-`aria-*` עוזרות לקוראי מסך.
- `collapse navbar-collapse` הוא החלק שמוסתר במסכים קטנים. `navbar-nav` היא הרשימה, `nav-item` כל פריט בה, ו-`nav-link` כל קישור. `active` מדגיש את הדף הנוכחי, ו-`ms-auto` דוחף את הקישורים לצד ימין.

ה-toggler צריך את **ה-JavaScript של Bootstrap**. זה הסקריפט `bootstrap.bundle.min.js` בסוף ה-body. בלעדיו כפתור התפריט הוא כפתור מת.

## טפסים

טפסי Bootstrap הם טפסי HTML רגילים עם מחלקות נוספות:

- `form-label` על כל `<label>`, כשה-`for` תואם ל-`id` של שדה הקלט.
- `form-control` על שדות דמויי טקסט (`text`, `email`, `password`) ועל `<textarea>`. הוא הופך אותם לברוחב מלא עם מסגרת מיקוד ברורה.
- `form-select` על `<select>`.
- `form-check`, `form-check-input` ו-`form-check-label` לתיבות סימון ולכפתורי רדיו. קודם בא שדה הקלט ואחריו התווית.
- `mb-3` על כל עוטף נותן ריווח אחיד.

**קבוצות קלט** (input groups) מדביקות טקסט או כפתור לשדה קלט: עוטפים אותם ב-`input-group` ומשתמשים ב-`input-group-text` לתוספת:

```html
<div class="input-group">
  <span class="input-group-text">@</span>
  <input type="text" class="form-control">
</div>
```

## סגנונות אימות

Bootstrap לא מחליט אם ערך תקין, הוא רק צובע את התוצאה. הוסיפו `is-valid` (ירוק) או `is-invalid` (אדום) לשדה קלט, ושימו אלמנט `valid-feedback` או `invalid-feedback` מיד אחריו. ההודעה נשארת מוסתרת עד שלאח הקודם יש את המחלקה המתאימה. גם הבדיקות המובנות של הדפדפן (`required`, `minlength`) עובדות: הוסיפו `was-validated` לטופס בעזרת מעט JavaScript, ו-Bootstrap יציג את המצב.

התצוגה המקדימה אף פעם לא שולחת טופס באמת (היא מדפיסה הערה לקונסול), ושליחה אמיתית דורשת שרת או שירות טפסים.

> **שימו לב:**
> - השמטת סקריפט חבילת ה-JavaScript. אז כפתור ההמבורגר לא פותח כלום ואין הודעת שגיאה.
> - `data-bs-target` שלא תואם ל-`id` (‏`#mainNav` מול `mainnav`). מזהים (ID) רגישים לאותיות גדולות וקטנות.
> - `label` בלי `for`, כך שלחיצה על התווית לא ממקדת את שדה הקלט וקוראי מסך לא יכולים לקשר ביניהם.
> - הצבת `invalid-feedback` במקום אחר מלבד מיד אחרי השדה הלא תקין. הוא יישאר מוסתר.
> - שכחת תג ה-meta של ה-viewport, ולכן סרגל הניווט אף פעם לא מתקפל בטלפון.

> **תורכם:** בנו את סרגל הניווט לפי התבנית שלמעלה (‏`navbar navbar-expand-lg bg-dark` עם `data-bs-theme="dark"`, כפתור toggler שמכוון אל `#mainNav`, ו-`collapse navbar-collapse` סביב הקישורים). אחר כך הוסיפו את מחלקות הטופס, סמנו את הסיסמה כ-`is-invalid` עם `invalid-feedback` שאומר `Password must be at least 8 characters.`, והוסיפו את חבילת ה-JavaScript לפני תג ה-body הסוגר.
