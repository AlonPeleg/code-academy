---
title: "שלב 8: ערכת נושא, צבעי מותג ומצב כהה"
summary: "מחברים את Bootstrap לצבעי המותג שלכם בעזרת משתני CSS, מוסיפים מתג למצב כהה בעזרת data-bs-theme ומשפרים את הכרטיסים עם אפקטי hover."
hints:
  - "שלוש משימות, שלושה מקומות. משתני CSS: גרמו ל-Bootstrap להשתמש בצבעים שלכם. JavaScript: בנו את כפתור המתג והפכו את data-bs-theme על אלמנט ה-html. שוב CSS: אפקטי hover ו-focus-within ל-.project-card. התחילו במשתנים."
  - "ערכת הנושא הבהירה ב-\":root, [data-bs-theme=\"light\"]\" (קבעו את --bs-primary, את --bs-primary-rgb, את צבעי הקישורים, את --bs-body-bg ואת צבע הרקע השלישוני). ערכת הנושא הכהה רק ב-[data-bs-theme=\"dark\"]. כפתורים לא קוראים את --bs-primary, ולכן דרסו את .btn-primary { --bs-btn-bg: var(--brand); --bs-btn-border-color: var(--brand); --bs-btn-hover-bg: var(--brand-dark); ... } ואת .card { --bs-card-border-radius: var(--radius); }."
  - ":root, [data-bs-theme=\"light\"] { --bs-primary: #4f46e5; --bs-primary-rgb: 79, 70, 229; --bs-body-bg: #fbfbfe; --bs-body-bg-rgb: 251, 251, 254; }   [data-bs-theme=\"dark\"] { --brand-text: #a5b4fc; --bs-body-bg: #0f1020; --bs-body-bg-rgb: 15, 16, 32; }   .btn-primary { --bs-btn-bg: var(--brand); --bs-btn-border-color: var(--brand); --bs-btn-hover-bg: var(--brand-dark); --bs-btn-hover-border-color: var(--brand-dark); }   .card { --bs-card-border-radius: var(--radius); --bs-card-inner-border-radius: calc(var(--radius) - 1px); }   .project-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }   .project-card:hover, .project-card:focus-within { transform: translateY(-6px); box-shadow: var(--bs-box-shadow-lg); }   @media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }   JS: document.documentElement.setAttribute(\"data-bs-theme\", theme);"
quiz:
  - q: "מדוע דריסות ערכת הנושא הבהירה צריכות להיות על \":root, [data-bs-theme=\"light\"]\" ולא רק על :root?"
    options:
      - "כי :root לא עובד ב-Bootstrap"
      - "כי כלל :root פשוט מהקובץ שלכם היה גובר גם על ערכת הנושא הכהה של Bootstrap ומשאיר את הדף בהיר"
      - "כי דפדפנים מתעלמים ממשתנים על :root"
    explain: "Bootstrap מגדיר את הערכים הבהירים על \":root, [data-bs-theme=light]\" ואת הכהים על [data-bs-theme=dark]. שימוש באותם סלקטורים שומר על ספציפיות שווה, כך שהכללים הכהים עדיין יכולים לחול."
  - q: "קבעתם את --bs-primary לצבע המותג שלכם, אבל כפתורי .btn-primary נשארים כחולים. מדוע?"
    options:
      - "צריך לטעון את הדף מחדש"
      - "כפתורי Bootstrap 5.3 קוראים משתנים משלהם כמו --bs-btn-bg, ואותם צריך לדרוס על .btn-primary"
      - "אפשר לשנות צבע של כפתורים רק בעזרת Sass"
  - q: "את מי מגנה שאילתת המדיה prefers-reduced-motion?"
    options:
      - "אנשים עם חיבור אינטרנט איטי"
      - "טלפונים עם סוללה קטנה"
      - "אנשים שמסתחררים או מוסחים מאנימציה וביקשו מהמערכת שלהם פחות תנועה"
messages:
  - "שימו את משתני ערכת הנושא הבהירה על \":root, [data-bs-theme=\"light\"]\" כדי שלא יגברו על ערכת הנושא הכהה."
  - "הוסיפו כלל [data-bs-theme=\"dark\"] שדורס את --bs-body-bg ואת חבריו."
  - "כוונו מחדש את משתני הכפתור: .btn-primary { --bs-btn-bg: var(--brand); ... }"
  - "הרימו את הכרטיס ב-hover בעזרת transform: translateY(...)."
  - "כבדו אנשים שמעדיפים פחות תנועה בעזרת @media (prefers-reduced-motion: reduce)."
  - "החליפו ערכות נושא בעזרת הגדרת המאפיין data-bs-theme על document.documentElement."
  - "התחילו מההעדפה של המערכת של המבקר: matchMedia(\"(prefers-color-scheme: dark)\")."
  - "עטפו את localStorage ב-try/catch, כי אפשר לחסום את האחסון."
---
אתר שנראה כמו כל אתר Bootstrap אחר קל לשכוח. עכשיו תיתנו לאתר שלכם אישיות, מצב כהה ומעט תנועות עדינות.

## איפה אנחנו עומדים

כל ארבעת הדפים עובדים. הצבעים מגיעים בחלקם מ-Bootstrap (כפתורים, קישורים, תגיות) ובחלקם מהמשתנים שלכם (hero, אווטאר, תמונות ממוזערות). השניים עדיין לא מחוברים: כפתור Bootstrap כחול יושב ליד גרדיאנטים בצבע אינדיגו.

## מה נוסיף, ולמה זה חשוב

1. **שכבת ערכת נושא** (theme) ב-`css/style.css` שגורמת ל-Bootstrap להשתמש בצבעי המותג שלכם.
2. מתג **מצב כהה**. מגרסה 5.3 Bootstrap תומך במצבי צבע: קבעו `data-bs-theme="dark"` על אלמנט ה-`html`, וכל רכיב משנה את הצבעים שלו. מבקרים רבים מעדיפים מצב כהה, והצעה שלו מעידה על אכפתיות.
3. **שיפורי hover** בכרטיסי הפרויקטים, תוך התחשבות במבקרים שמעדיפים פחות תנועה.

שלושתם משתמשים במשתני CSS, וכך מתאימים את Bootstrap המודרני בלי Sass (כלי בנייה ל-CSS שאולי תלמדו בהמשך).

## הדרכה שלב אחר שלב

**1. דריסת המשתנים של Bootstrap.** Bootstrap מצהיר על הצבעים שלו כמאפיינים מותאמים אישית (custom properties) מסוג `--bs-*`. גיליון הסגנונות שלכם בא אחריו, ולכן כללים שווים שלכם גוברים. שמרו על אותו סלקטור ש-Bootstrap משתמש בו לערכת הנושא הבהירה:

```css
:root,
[data-bs-theme="light"] {
  --bs-primary: #4f46e5;
  --bs-primary-rgb: 79, 70, 229;
  --bs-link-color-rgb: 67, 56, 202;
  --bs-body-bg: #fbfbfe;
}
```

למה הסלקטור השני? כלל `:root` פשוט שלכם היה בעל אותו משקל כמו הכלל `[data-bs-theme=dark]` של Bootstrap, ומכיוון שהכלל שלכם בא מאוחר יותר, הוא היה גובר ושובר את המצב הכהה. התאמה לסלקטורים של Bootstrap מונעת את זה. שימו לב לתאומים `-rgb`: חלקים ב-Bootstrap בונים צבעים כ-`rgba(var(--bs-primary-rgb), ...)`, ולכן צריך לעדכן את שני הערכים. קישורים קוראים את `--bs-link-color-rgb`, לא את `--bs-link-color`.

**2. ערכת הנושא הכהה** צריכה לשנות רק את מה שונה: רקע הדף, צבע הקישורים והטוקנים שלכם:

```css
[data-bs-theme="dark"] {
  --brand-text: #a5b4fc;
  --bs-body-bg: #0f1020;
}
```

מכיוון שגרדיאנט ה-hero בנוי מ-`var(--brand-soft)`, מ-`var(--bs-body-bg)` ומ-`var(--accent-soft)`, הוא משתנה עם ערכת הנושא באופן אוטומטי. זה הפרס על שימוש במשתנים מההתחלה.

**3. לרכיבים יש משתנים משלהם.** ב-Bootstrap 5.3 הכפתור `.btn-primary` לא קורא את `--bs-primary`. הוא מצהיר על `--bs-btn-bg` ועל חבריו. דרסו אותם על המחלקה:

```css
.btn-primary {
  --bs-btn-bg: var(--brand);
  --bs-btn-border-color: var(--brand);
  --bs-btn-hover-bg: var(--brand-dark);
}
```

כרטיסים עובדים באותה צורה: `.card { --bs-card-border-radius: var(--radius); }` מעגל כל כרטיס. כפתורי המתאר האפורים של Bootstrap בהירים מעט מדי על רקע מגוון או כהה, ולכן תנו ל-`.btn-outline-secondary` את צבע הטקסט של הגוף (`--bs-btn-color: var(--bs-body-color)`), שמסתגל לשתי ערכות הנושא.

**4. המתג ב-JavaScript.** צרו את הכפתור ב-`main.js` (כדי שלא תצטרכו להדביק אותו בארבעה דפים), התחילו מהבחירה השמורה או מההעדפה של המערכת, והפכו את המאפיין בלחיצה:

```js
document.documentElement.setAttribute('data-bs-theme', theme);
toggle.setAttribute('aria-pressed', String(theme === 'dark'));
```

השתמשו בתווית הכפתור "Dark mode" ותנו ל-`aria-pressed` לומר אם הוא פועל. שמירת הבחירה ב-`localStorage` היא תוספת נחמדה, אבל אפשר לחסום אחסון (חלונות פרטיים, התצוגה המקדימה הזו), ולכן תמיד עטפו אותה ב-`try { ... } catch { ... }`.

**5. אפקטי hover.** מעבר (transition) יוצר אנימציה של השינוי בין שני מצבים. הפעילו אותו גם עם `:focus-within`, כדי שמשתמשי מקלדת יקבלו אותו משוב, וכבו את התנועה לאנשים שביקשו פחות:

```css
.project-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.project-card:hover, .project-card:focus-within { transform: translateY(-6px); }
@media (prefers-reduced-motion: reduce) { .project-card { transition: none; } }
```

> **שימו לב:**
> - שינוי של `--bs-primary` בלבד לא צובע מחדש כפתורים. דרסו את המשתנים של הכפתור עצמו.
> - צבעים שכתובים בקוד (`#fff`, `black`) ב-CSS שלכם לא עוקבים אחרי ערכת הנושא. השתמשו במשתנים כמו `var(--bs-body-bg)`.
> - אל תסתמכו על hover בלבד. למסכי מגע אין hover, ומקלדות צריכות `:focus-within` או `:focus-visible`.
> - קריאה מ-`localStorage` בלי `try/catch` יכולה לזרוק שגיאה `SecurityError` בהקשרים מבודדים (sandbox) או פרטיים ולעצור את כל הסקריפט שלכם.

> **תורכם:** ב-`css/style.css` הוסיפו את בלוקי המשתנים הבהיר והכהה, את הדריסות של `.btn-primary` ושל `.btn-outline-primary`, את רדיוס `.card`, את צבע הפס של `.progress` ואת כללי ה-hover עם שאילתת reduced-motion. ב-`js/main.js` כתבו את `initThemeToggle()` שמוסיפה את `button#theme-toggle` אל `.navbar-collapse`, קובעת את `data-bs-theme` על `<html>` לפי ההעדפה השמורה או של המערכת, והופכת אותו בלחיצה.
