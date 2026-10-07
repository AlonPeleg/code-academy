---
title: "שלב 9: SEO, נגישות ו-meta tags"
summary: "מוסיפים כותרות, תיאורים, תגי Open Graph ו-favicon, ואז מתקנים landmarks, קישורי דילוג, שמות קישורים וסגנונות מיקוד בכל דף."
hints:
  - "שלוש קבוצות עבודה ב-index.html: (1) ה-head: description, author, theme-color, ארבעה תגי Open Graph וקישור icon; (2) ה-body: קישור דילוג לפני ה-header, ו-id=\"main\" tabindex=\"-1\" על main; (3) שלושת הקישורים בכרטיסים, שצריכים שם שכולל את שם הפרויקט. אחר כך סגנונות המיקוד ב-css/style.css."
  - "קישור דילוג: <a class=\"visually-hidden-focusable skip-link\" href=\"#main\">Skip to main content</a> כילד הראשון של body. Main: <main id=\"main\" tabindex=\"-1\" class=\"flex-grow-1\">. קישורי הכרטיסים: הוסיפו aria-label=\"Cafe Bloom source code (opens in a new tab)\" ואותו דפוס לשני האחרים. Head: <meta name=\"description\" content=\"...\"> (50 עד 160 תווים) ו-<meta property=\"og:title\" content=\"...\">."
  - "<meta name=\"description\" content=\"Portfolio of Alex Rivers, a junior web developer in Lisbon who builds fast, accessible, responsive websites with HTML, CSS, JavaScript and Bootstrap.\">   <meta name=\"author\" content=\"Alex Rivers\">   <meta name=\"theme-color\" content=\"#4f46e5\">   <meta property=\"og:type\" content=\"website\">   <meta property=\"og:title\" content=\"Alex Rivers | Junior Web Developer\">   <meta property=\"og:description\" content=\"...\">   <meta property=\"og:url\" content=\"https://alexrivers.github.io/\">   <link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3C/svg%3E\">   CSS: :focus-visible { outline: 3px solid var(--brand-text); outline-offset: 3px; }   .skip-link:focus { position: fixed; top: 0.75rem; left: 0.75rem; z-index: 2000; padding: 0.5rem 1rem; background: var(--bs-body-bg); }"
quiz:
  - q: "למה משמש ה-meta description?"
    options:
      - "זה הטקסט שמנועי חיפוש מציגים לעיתים מתחת לכותרת הדף שלכם, ולכן הוא צריך להיות סיכום ברור של 50 עד 160 תווים"
      - "הוא גורם לדף להיטען מהר יותר"
      - "הוא מוצג בראש חלון הדפדפן"
  - q: "במה עוזר קישור דילוג (skip link)?"
    options:
      - "דילוג על אנימציית הטעינה"
      - "משתמשי מקלדת וקורא מסך יכולים לקפוץ מעבר לניווט ישירות לתוכן הראשי"
      - "דילוג לעמוד התוצאות הבא"
  - q: "כמה כפתורים בדף אומרים \"Source code\". מדוע הם מקבלים aria-label כמו \"Cafe Bloom source code\"?"
    options:
      - "כדי להגדיל את הטקסט על הכפתור"
      - "כי aria-label נדרש בכל קישור"
      - "אנשים שמציגים רשימה של הקישורים בדף ישמעו אחרת \"Source code, Source code, Source code\" ולא יוכלו להבדיל ביניהם"
    explain: "טקסט של קישור צריך להיות הגיוני גם מחוץ להקשר. השם הנגיש שומר על המילים הגלויות (\"source code\") ומוסיף את שם הפרויקט."
messages:
  - "תיאור ה-meta צריך להיות באורך של 50 עד 160 תווים."
  - "הוסיפו favicon בתור SVG בתוך data URI."
  - "תנו ל-:focus-visible קו מתאר (outline) ברור."
  - "עצבו את .skip-link:focus כדי שהקישור יהיה גלוי כשמשתמש מקלדת מגיע אליו."
---
האתר שלכם נראה טוב. עכשיו דאגו שגם אנשים וגם מכונות יוכלו *למצוא* אותו, *לשתף* אותו ו*להשתמש* בו בכל כלי. השלב הזה הוא רשימת בדיקה שתשתמשו בה שוב בכל אתר שתבנו.

## איפה אנחנו עומדים

האתר שלם ובעל ערכת נושא, עם מצב כהה ואפקטי hover. מתחת לפני השטח עדיין חסרים לו הפרטים הבלתי נראים שמנועי חיפוש, רשתות חברתיות וטכנולוגיה מסייעת מחפשים.

## מה נוסיף, ולמה זה חשוב

**SEO** (אופטימיזציה למנועי חיפוש, search engine optimisation) מתחיל בסימון פשוט וכן: `title` ייחודי לכל דף, `meta description`, ותגי Open Graph שקובעים איך קישור נראה כשמדביקים אותו בצ'אט. **נגישות** פירושה שכולם יכולים להשתמש באתר: משתמשי מקלדת, משתמשי קורא מסך, אנשים עם ראייה לקויה. יש חפיפה גדולה בין השניים: כותרות ברורות וטקסט קישור טוב עוזרים גם למנועי חיפוש וגם לאנשים. מעסיקים (וגם Lighthouse, שתפגשו בשלב 10) בודקים את הדברים האלה.

## הדרכה שלב אחר שלב

**1. ה-head.** כל דף צריך טקסט משלו:

```html
<meta name="description" content="Portfolio of Alex Rivers, a junior web developer in Lisbon ...">
<meta name="theme-color" content="#4f46e5">
<meta property="og:type" content="website">
<meta property="og:title" content="Alex Rivers | Junior Web Developer">
<meta property="og:description" content="Fast, accessible, responsive websites ...">
<meta property="og:url" content="https://alexrivers.github.io/">
```

שמרו על תיאורים באורך של 50 עד 160 תווים, אחרת מנועי חיפוש חותכים אותם. `theme-color` צובע את סרגל הכתובת בטלפונים. תגי Open Graph (`og:`) נקראים על ידי אפליקציות צ'אט ורשתות חברתיות. `og:image` אמיתי (1200 על 630 פיקסלים, מאוחסן באתר שלכם) הופך קישורים משותפים לאטרקטיביים הרבה יותר; אנחנו מדלגים עליו כדי שהפרויקט לא יצטרך קבצי תמונה.

**2. Favicon בלי קובץ.** האייקון הקטן בלשונית הדפדפן יכול להיות SVG בתוך *data URI*. תווים בעלי משמעות מיוחדת בכתובות URL חייבים לעבור escape; `#` הופך ל-`%23`, `<` הופך ל-`%3C`, ו-`>` הופך ל-`%3E`:

```html
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%234f46e5'/%3E%3C/svg%3E">
```

**3. קישור דילוג.** משתמשי מקלדת צריכים לעבור עם Tab על כל סרגל הניווט בכל דף. קישור דילוג, האלמנט הראשון שאפשר למקד, מאפשר להם לקפוץ לתוכן. המחלקה `visually-hidden-focusable` של Bootstrap מסתירה אותו עד שהוא מקבל מיקוד; הכלל `.skip-link:focus` שלנו גורם לו להופיע. היעד צריך `id="main"`, ו-`tabindex="-1"` מאפשר לדפדפן להעביר אליו מיקוד בפועל:

```html
<a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
...
<main id="main" tabindex="-1" class="flex-grow-1">
```

**4. שמות קישורים שמובנים גם לבד.** משתמשי קורא מסך מציגים לעיתים קרובות רשימה של כל הקישורים בדף. שלושה קישורים שכולם אומרים "Source code" חסרי תועלת. `aria-label` מחליף את השם הנגיש. שמרו בתוכו את המילים הגלויות, כדי שמשתמשים בשליטה קולית עדיין יוכלו לומר את מה שהם רואים:

```html
<a ... aria-label="Cafe Bloom source code (opens in a new tab)">Source code</a>
```

**5. מיקוד שאפשר לראות.** לעולם אל תסירו את ה-outline בלי תחליף. כלל אחד נותן לכל אלמנט שאפשר למקד טבעת חזקה:

```css
:focus-visible { outline: 3px solid var(--brand-text); outline-offset: 3px; }
```

`:focus-visible` חל על מיקוד מקלדת ושותק בלחיצות עכבר.

**6. שאר רשימת הבדיקה (כבר נעשה, ועכשיו אתם יודעים למה):** `h1` אחד בכל דף וכותרות לפי הסדר; `lang="en"` על `html`; landmarks (`header`, `nav`, `main`, `footer`); תוויות לשדות טופס; צורות דקורטיביות מוסתרות עם `aria-hidden="true"`; תמונות מידעיות היו צריכות טקסט `alt` שאומר מה התמונה מראה, ותמונות דקורטיביות מקבלות `alt=""`. לגבי ניגודיות, טקסט רגיל צריך יחס של לפחות 4.5 ל-1 מול הרקע שלו (3 ל-1 לטקסט גדול); צבעי הטקסט של המותג שלכם נבחרו כדי לעבור את הבדיקה.

> **שימו לב:**
> - תיאור שהועתק לכל דף גורם לדפים להיראות זהים למנועי חיפוש. כתבו תיאור אחד לכל דף.
> - `tabindex="-1"` על `main` זה בסדר. מספרים חיוביים כמו `tabindex="3"` יוצרים סדר Tab מבלבל; הימנעו מהם.
> - `aria-label` שאינו מכיל את הטקסט הגלוי (למשל "Click here" גלוי ותווית "Download") שובר שליטה קולית.
> - ARIA היא ערכת תיקון, לא בחירה ראשונה. `button` או `a` אמיתיים עדיפים על `div` עם `role="button"`.

> **תורכם:** ב-`index.html` הוסיפו ל-head את ה-description, ה-author, ה-theme-color, ארבעת תגי Open Graph וה-favicon בתוך השורה, שימו את קישור הדילוג ראשון ב-body, תנו ל-`main` את המאפיינים `id="main"` ו-`tabindex="-1"`, והוסיפו `aria-label` ששם את הפרויקט לכל אחד משלושת הקישורים בכרטיסים. ב-`css/style.css` הוסיפו את ה-outline של `:focus-visible` ואת הכלל `.skip-link:focus`. בשלושת הדפים האחרים יש רמזי `TODO`: חזרו שם על אותם שינויים עם טקסט שמתאים לכל דף.
