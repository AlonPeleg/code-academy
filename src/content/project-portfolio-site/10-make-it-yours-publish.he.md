---
title: "שלב 10: הופכים את האתר לשלכם ומפרסמים"
summary: "מוסיפים פרטי פרסום (קישור canonical, נתונים מובנים ודף 404), מחליפים כל תבנית בפרטים האישיים שלכם, בודקים ומעלים את האתר לאוויר בחינם."
hints:
  - "שתי תוספות קטנות ועבודה אישית. ב-index.html מוסיפים ל-head שני דברים: קישור canonical וסקריפט מסוג application/ld+json. ב-404.html מוסיפים את תג ה-meta של noindex ב-head ואת תוכן הדף בתוך main. החלפת פרטי התבנית בפרטים שלכם היא עניין שלכם, והבודק מקבל כל טקסט."
  - "Canonical: <link rel=\"canonical\" href=\"https://yourname.github.io/\">. נתונים מובנים: <script type=\"application/ld+json\"> שמכיל אובייקט JSON אחד עם \"@context\": \"https://schema.org\", \"@type\": \"Person\", \"name\", \"jobTitle\", \"url\" ו-\"sameAs\": [שתי כתובות פרופיל]. ב-404.html: <meta name=\"robots\" content=\"noindex\"> ב-head; ב-main כותרת h1 עם \"Page not found\", פסקה p.lead וקישור a.btn.btn-primary עם href=\"index.html\"."
  - "<link rel=\"canonical\" href=\"https://alexrivers.github.io/\">   <script type=\"application/ld+json\">{ \"@context\": \"https://schema.org\", \"@type\": \"Person\", \"name\": \"Alex Rivers\", \"jobTitle\": \"Junior Web Developer\", \"url\": \"https://alexrivers.github.io/\", \"sameAs\": [\"https://github.com/alexrivers\", \"https://www.linkedin.com/in/alexrivers\"] }</script>   404.html: <meta name=\"robots\" content=\"noindex\">   <main class=\"container py-5\"><p class=\"display-1 fw-bold text-primary mb-0\" aria-hidden=\"true\">404</p><h1 class=\"h2 mb-3\">Page not found</h1><p class=\"lead mb-4\">Sorry, that page does not exist.</p><a class=\"btn btn-primary btn-lg\" href=\"index.html\">Back to the home page</a></main>"
messages:
  - "הוסיפו <link rel=\"canonical\" href=\"https://...\"> ל-head עם כתובת האתר הסופית שלכם."
  - "הנתונים המובנים צריכים את \"@context\": \"https://schema.org\"."
  - "תארו את עצמכם כ-Person בנתונים המובנים: \"@type\": \"Person\"."
  - "הוסיפו \"sameAs\": [ ... ] עם הכתובות של פרופיל ה-GitHub ופרופיל ה-LinkedIn שלכם."
  - "ב-404.html צריך להיות <meta name=\"robots\" content=\"noindex\"> כדי שמנועי חיפוש ידלגו עליו."
  - "בדף ה-404 צריכה להיות כותרת h1 שאומרת Page not found."
  - "הוסיפו קישור בעיצוב כפתור חזרה אל index.html."
quiz:
  - q: "מה תפקידו של קישור ה-canonical?"
    options: ["הוא אומר למנועי חיפוש מהי הכתובת הרשמית של הדף הזה, כך שעותקים שלו לא מתחרים זה בזה", "הוא מעביר את המבקרים לאתר אחר", "הוא גורם לדף להיטען מהר יותר"]
  - q: "למה בדף 404.html יש תג meta של robots עם noindex?"
    options: ["כדי שהדף ייטען מהר יותר", "כדי שמבקרים לא יוכלו לראות את הדף", "כדי שמנועי חיפוש לא יציגו את דף ה-\"לא נמצא\" שלכם כאילו הוא תוכן אמיתי"]
  - q: "מהי הדרך הטובה ביותר לברר עד כמה האתר המוגמר שלכם מהיר ונגיש באמת?"
    options: ["לשאול חבר אם הוא נראה יפה", "להריץ ביקורת Lighthouse ב-Chrome DevTools, לתקן את מה שהיא מדווחת ולבדוק בטלפון אמיתי", "לספור את שורות הקוד"]
---
זה השלב האחרון. הקוד כמעט גמור; מה שנשאר הוא להפוך את "Alex Rivers" ל*אתם*, לבדוק את האיכות ולהעלות את האתר למקום שבו כולם יכולים לראות אותו.

## איפה אנחנו

ארבעה דפים מלוטשים עם בסיס של Bootstrap, ערכת עיצוב משלכם, מצב כהה, מסננים, טופס עם ולידציה ובדיקת נגישות. הכול עדיין מלא בדמות התבנית Alex Rivers.

## מה נוסיף, ולמה זה חשוב

שתי נגיעות מקצועיות לסיום, ואחר כך העבודה האישית:

- **פרטי פרסום ב-head.** *קישור canonical* קובע את הכתובת הרשמית של הדף. *נתונים מובנים* (JSON-LD, בעזרת אוצר המילים של schema.org) מתארים אתכם למנועי חיפוש בפורמט שמכונות קוראות ישירות.
- **דף 404.** GitHub Pages ו-Netlify מציגים קובץ בשם `404.html` כשמבקר מקליד כתובת שגויה. דף ידידותי עם דרך חזרה משאיר אנשים באתר שלכם.

## הדרכה צעד אחר צעד

**1. Canonical ונתונים מובנים** נכנסים ל-head של `index.html`:

```html
<link rel="canonical" href="https://alexrivers.github.io/">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Alex Rivers",
  "jobTitle": "Junior Web Developer",
  "url": "https://alexrivers.github.io/",
  "sameAs": ["https://github.com/alexrivers"]
}
</script>
```

ה-JSON חייב להיות תקין: גרשיים כפולים בלבד וללא פסיק אחרי הפריט האחרון.

**2. דף ה-404.** פתחו את `404.html`. ב-head הוסיפו `<meta name="robots" content="noindex">`. בתוך `main` כתבו "404" גדול (מוסתר מקוראי מסך בעזרת `aria-hidden`), כותרת `h1` שאומרת "Page not found", פסקת `lead` קצרה וקישור בעיצוב כפתור אל `index.html`. הדף הזה טוען מה-CDN רק את Bootstrap ואין לו CSS משלו, כי בכתובת עמוקה שהוקלדה בטעות נתיב יחסי כמו `css/style.css` יצביע למקום הלא נכון.

**3. הופכים אותו לשלכם.** השתמשו בחיפוש והחלפה בעורך הקוד עבור כל פריט:

- [ ] שם, ראשי תיבות (אווטאר, favicon, תוויות `AR`), תואר התפקיד וטקסט ה-hero
- [ ] כתובת אימייל, כתובות GitHub ו-LinkedIn (פוטר, דף יצירת קשר, JSON-LD)
- [ ] הפרויקטים האמיתיים שלכם: כותרות, תיאורים, תגיות, קישורים, קטגוריות
- [ ] ציר זמן וכישורים: רק מה שנכון, במילים שלכם
- [ ] ה-action של הטופס (צרו טופס Formspree חינמי והדביקו את הכתובת שלו)
- [ ] `og:url`, `canonical` ורשימת `sameAs` עם כתובת האתר הסופית שלכם
- [ ] צבעי ההדגשה בבלוק `:root` אם רוצים מראה אחר

**4. בדיקות.** פתחו כל דף ולחצו על כל קישור. הקטינו את החלון עד רוחב של טלפון. עברו עם Tab על כל דף ושימו לב לפוקוס. נסו את המצב הכהה. אחר כך פתחו את Chrome DevTools, בחרו **Lighthouse**, סמנו Performance, Accessibility, Best Practices ו-SEO והריצו. ציונים מעל 90 הם יעד ריאלי לאתר הזה. קראו את הדוח: כל פריט שנכשל מסביר איך לתקן אותו.

**5. מפרסמים בחינם.** השתמשו ב-**Download project** באקדמיה; בתיקייה יש קובץ README עם הצעדים המדויקים. בקצרה:

- **GitHub Pages:** צרו repository בשם `yourname.github.io`, העלו את הקבצים ואז Settings, Pages, והפעילו פריסה מהענף main.
- **Netlify:** גררו את תיקיית הפרויקט אל דף ה-"Deploys" של Netlify. תקבלו כתובת מיד, ויש בו טיפול מובנה בטפסים.
- **Vercel:** ייבאו את ה-repository מ-GitHub; ל-HTML פשוט אין צורך בשום הגדרה.

אחר כך עדכנו את ה-canonical, את `og:url` ואת כתובת הטופס לדומיין האמיתי.

> **שימו לב:**
> - אם תשאירו תבניות, מעסיק יראה "Alex Rivers" באתר שלכם. חפשו `alexrivers` ו-`Alex` לפני הפרסום.
> - שמות קבצים בשרתי אינטרנט רגישים לאותיות גדולות וקטנות. `Index.html` ו-`index.html` הם קבצים שונים באינטרנט, גם אם המחשב שלכם רואה אותם כזהים.
> - קישורים לדפים שלכם חייבים להיות יחסיים (`about.html`, לא `C:\Users\...`).
> - לעולם אל תפרסמו סודות (מפתחות API, סיסמאות) באתר סטטי. כל מה שבקבצים שלכם פומבי.

## מה לבנות הלאה

- הוסיפו צילומי מסך אמיתיים לכרטיסי הפרויקטים (עם טקסט `alt`, עם `loading="lazy"` ועם מאפייני width ו-height).
- כתבו אזור בלוג קטן, או העבירו את סרגל הניווט החוזר לתבנית בעזרת מחולל אתרים סטטיים כמו Eleventy או Astro.
- למדו Sass כדי להתאים את Bootstrap במקור, או נסו את Tailwind CSS לגישה שמבוססת על מחלקות עזר.
- הוסיפו `og:image`, מפת אתר (sitemap) ודומיין מותאם אישית.
- בנו מחדש את דף הפרויקטים עם React, כשפרויקט Dev Blog משמש מדריך.

> **תורכם:** ב-`index.html` הוסיפו ל-head את קישור ה-canonical ואת סקריפט ה-JSON-LD (`@context`, `@type` מסוג Person, name, jobTitle, url ו-`sameAs`). ב-`404.html` הוסיפו את תג ה-meta `noindex` ואת תוכן הדף בתוך `main`: הטקסט `404`, כותרת `h1` שאומרת "Page not found", פסקה קצרה וקישור `btn` אל `index.html`. אחר כך עברו על רשימת המשימות ופרסמו. מזל טוב, בניתם אתר אמיתי.
