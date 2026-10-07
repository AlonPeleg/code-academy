---
title: "שלב 7: טופס יצירת קשר נגיש עם ולידציה"
summary: "בונים את דף יצירת הקשר עם שדות מתויגים, עיצובי ולידציה של Bootstrap, הודעה ידידותית ב-JavaScript ו-action של שירות טפסים."
hints:
  - "אותו מתכון כמו קודם: החליפו את גוף ה-placeholder ב-contact.html בדף המלא. הטופס הוא החלק החדש. כל שדה הוא div.mb-3 שמכיל תווית (label), שדה קלט (control) ו-div.invalid-feedback, והשדה מצביע על ההודעה שלו בעזרת aria-describedby."
  - "תג הטופס: <form id=\"contact-form\" action=\"https://formspree.io/f/your-form-id\" method=\"post\" novalidate>. שדה: <label for=\"name\" class=\"form-label\">Your name</label><input type=\"text\" class=\"form-control\" id=\"name\" name=\"name\" autocomplete=\"name\" required aria-describedby=\"name-error\"><div class=\"invalid-feedback\" id=\"name-error\">Please tell me your name.</div>. ב-JavaScript הקשיבו לאירוע \"submit\" של הטופס: if (!form.checkValidity()) { event.preventDefault(); ... } ותמיד הוסיפו form.classList.add(\"was-validated\")."
  - "function initContactForm() { const form = document.getElementById(\"contact-form\"); if (!form) return; const status = document.getElementById(\"form-status\"); form.addEventListener(\"submit\", (event) => { if (!form.checkValidity()) { event.preventDefault(); status.textContent = \"Please fix the highlighted fields and try again.\"; status.classList.add(\"text-danger-emphasis\"); form.querySelector(\":invalid\").focus(); } else { status.textContent = \"Sending your message...\"; status.classList.remove(\"text-danger-emphasis\"); } form.classList.add(\"was-validated\"); }); }   initContactForm();   הוסיפו גם textarea (rows=\"5\" minlength=\"10\" required), כפתור שליחה button.btn.btn-primary, p#form-status[role=status] וקישור mailto."
quiz:
  - q: "מה עושה המאפיין novalidate על הטופס?"
    options:
      - "הוא מכבה את כל הוולידציה, כולל המאפיינים required"
      - "הוא מאפשר לקוד שלכם ול-Bootstrap להציג את ההודעות במקום בועות ברירת המחדל של הדפדפן; checkValidity() ממשיך לעבוד"
      - "הוא גורם לטופס להישלח פעמיים"
    explain: "כללי הוולידציה (required, type=\"email\", minlength) עדיין חלים. רק החלון הקופץ של הדפדפן כבוי."
  - q: "מדוע placeholder אינו תחליף ל-label?"
    options:
      - "אסור להשתמש ב-placeholder בטפסים"
      - "תוויות נטענות מהר יותר"
      - "ה-placeholder נעלם כשמקלידים, וקוראי מסך רבים לא מכריזים עליו באופן אמין"
  - q: "מה עושה aria-describedby=\"email-error\"?"
    options:
      - "הוא מקשר את שדה הקלט לאלמנט עם ה-id הזה, כך שקורא מסך מקריא את טקסט השגיאה אחרי שם השדה"
      - "הוא צובע את שדה הקלט באדום"
      - "הוא מעתיק את הטקסט לתוך שדה הקלט"
    explain: "aria-describedby מצביע על תיאור נוסף לפי id. כאן התיאור הוא הודעת הוולידציה."
messages:
  - "תנו לטופס action, הכתובת של שירות טפסים כמו Formspree."
  - "הוסיפו novalidate כדי שהדפדפן לא יציג בועות משלו; Bootstrap והסקריפט שלכם מציגים את ההודעות."
  - "השתמשו ב-form.checkValidity() כדי לברר אם כל השדות תקינים."
  - "עצרו שליחה של טופס לא תקין בעזרת event.preventDefault()."
  - "הוסיפו לטופס את המחלקה was-validated כדי ש-Bootstrap יציג את הודעות השגיאה."
---
דף יצירת קשר הוא המקום שבו מבקרים הופכים לשיחות. הוא צריך להיות קל לשימוש, קל להבנה כשמשהו משתבש, והוא חייב להגיע אליכם.

## איפה אנחנו עומדים

דף הבית, דף הפרויקטים ודף ה-About גמורים ומשתפים את אותו סרגל ניווט ואותה כותרת תחתונה. הקישור Contact עדיין מוביל ל-placeholder.

## מה נוסיף, ולמה זה חשוב

טופס עם שלושה שדות (שם, אימייל והודעה), ולידציה שמסבירה בעיות בשפה פשוטה, ודרך שנייה להגיע אליכם: קישור `mailto:` והפרופילים החברתיים שלכם. הטופס חייב לעבוד עם מקלדת, עם קורא מסך ובטלפון. פורטפוליו רבים נכשלים כאן, ולכן זה מקום טוב לבלוט.

לאתר סטטי אין server, ולכן לטופס צריך להיות לאן ללכת. שתי אפשרויות נפוצות: **שירות טפסים** (Formspree, Netlify Forms ודומיהם) נותן לכם כתובת אינטרנט שאותה שמים ב-`action` של הטופס; או **קישור `mailto:`** שפותח את אפליקציית האימייל של המבקר. אנחנו משתמשים באפשרות הראשונה לטופס ובשנייה כגיבוי. בתצוגה המקדימה של האקדמיה טפסים אף פעם לא נשלחים באמת; ב-Console מופיעה במקום זאת הערה קצרה.

## הדרכה שלב אחר שלב

**1. תג הטופס.**

```html
<form id="contact-form" action="https://formspree.io/f/your-form-id" method="post" novalidate>
```

`action` הוא המקום שאליו הנתונים הולכים (החליפו את `your-form-id` כשתיצרו טופס Formspree חינמי משלכם), ו-`method="post"` שולח אותם בגוף הבקשה. `novalidate` מכבה את בועות השגיאה של ברירת המחדל של הדפדפן כדי שנוכל להציג הודעות ידידותיות יותר, אבל הכללים עצמם עדיין חלים.

**2. שדה אחד = תווית + שדה קלט + הודעה.**

```html
<div class="mb-3">
  <label for="email" class="form-label">Your email</label>
  <input type="email" class="form-control" id="email" name="email"
         autocomplete="email" required aria-describedby="email-error">
  <div class="invalid-feedback" id="email-error">Please enter a valid email address.</div>
</div>
```

- `for` ו-`id` מחברים את התווית לשדה הקלט. לחיצה על התווית מעבירה את המיקוד לשדה.
- `type="email"` גורם לדפדפן לבדוק את הפורמט ולהציג בטלפונים את המקלדת המתאימה.
- `required` ו-`minlength="10"` (על ה-textarea) הם כללי הוולידציה.
- `autocomplete` מאפשר לדפדפן למלא ערכים מוכרים, וזה גם מהיר יותר וגם יתרון בנגישות.
- `name` הוא המפתח שבו הערך נשלח. בלעדיו השדה לא נשלח בכלל.
- `aria-describedby` מקשר את שדה הקלט לטקסט השגיאה שלו לפי id.

Bootstrap מסתיר את `.invalid-feedback` עד שהטופס (או השדה) מסומן כמאומת, ומציג אותו ליד שדה שאינו תקין.

**3. שורת הסטטוס.** האלמנט `p` עם `role="status"` הוא אזור חי (live region). כש-JavaScript משנה את הטקסט שלו, קוראי מסך מכריזים על ההודעה בנימוס. מקמו אותו ליד כפתור השליחה.

**4. ולידציה בשליחה.** דפדפנים כבר יודעים אם שדה תקין; `checkValidity()` שואלת אותם. אם הטופס אינו תקין, עצרו את השליחה בעזרת `preventDefault()`, הציגו הודעה והעבירו את המיקוד לבעיה הראשונה, כדי שמשתמשי מקלדת יגיעו למקום הנכון:

```js
form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    form.querySelector(':invalid').focus();
  }
  form.classList.add('was-validated');
});
```

הוספת `was-validated` מפעילה את מצבי האדום והירוק של Bootstrap וחושפת את ההודעות. אם הטופס *כן* תקין, אנחנו לא קוראים ל-`preventDefault()`, ולכן הדפדפן שולח אותו כרגיל.

**5. דרכים נוספות להגיע אליכם.** כרטיס (card) עם קישור `mailto:`, ה-GitHub וה-LinkedIn שלכם. קישורים אמיתיים נותנים למבקרים בחירה.

> **שימו לב:**
> - שדה בלי `name` נשמט בשקט מהשליחה.
> - שימוש בטקסט `placeholder` במקום ב-`label` נכשל בבדיקות נגישות ומבלבל משתמשי קורא מסך.
> - `invalid-feedback` חייב לבוא *אחרי* שדה הקלט שלו כאח (sibling), כי ה-CSS של Bootstrap משתמש ב-`:invalid ~ .invalid-feedback`.
> - אל תסתירו שגיאות בטקסט אדום בלבד. טקסט ההודעה והעברת המיקוד הם מה שהופך את הטופס לשמיש לכולם.

> **תורכם:** החליפו את גוף ה-placeholder ב-`contact.html` בדף המלא: מאפייני body, סרגל ניווט, `section.page-header` עם `h1` שכתוב בו "Get in touch", `form#contact-form` (עם `action`, `method="post"` ו-`novalidate`) עם השדות שם, אימייל והודעה, כל אחד עם `label.form-label`, `.form-control` ו-`.invalid-feedback`, כפתור שליחה ראשי "Send message" ו-`p#form-status[role="status"]`. הוסיפו כרטיס "Other ways to reach me" עם קישור `mailto:` אל hello@alexrivers.dev וקישור ה-GitHub שלכם, ואחר כך את הכותרת התחתונה. כתבו את `initContactForm()` ב-`js/main.js` ואת כללי הטופס הקטנים ב-`css/style.css`.
