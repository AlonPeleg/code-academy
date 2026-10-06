---
title: "שלב 2: סרגל ניווט רספונסיבי וכותרת תחתונה"
summary: "מוסיפים סרגל ניווט דביק של Bootstrap שמתכווץ בטלפונים, כותרת תחתונה, ומעט JavaScript שמדגיש את העמוד הנוכחי וכותב את השנה."
hints:
  - "עובדים מבחוץ פנימה. קודם משנים את תג ה-body, אחר כך מדביקים header עם nav בתוכו, אחר כך מוסיפים את המחלקה ל-main, ואז את הכותרת התחתונה אחרי main. אחרי זה עוברים ל-JavaScript: פונקציה אחת לקישור הפעיל ופונקציה אחת לשנה."
  - "סרגל הניווט צריך שלושה חלקים: קישור מותג, כפתור מתג (data-bs-toggle=\"collapse\" ו-data-bs-target=\"#main-nav\") ו-div.collapse.navbar-collapse עם id=\"main-nav\" שמחזיק ul.navbar-nav עם ארבעה קישורי li.nav-item. כל קישור נושא data-page=\"home|projects|about|contact\". ה-JavaScript משווה את link.dataset.page אל document.body.dataset.page."
  - "ב-main.js: function highlightCurrentLink() { const currentPage = document.body.dataset.page; document.querySelectorAll(\".navbar .nav-link\").forEach((link) => { const isCurrent = link.dataset.page === currentPage; link.classList.toggle(\"active\", isCurrent); if (isCurrent) link.setAttribute(\"aria-current\", \"page\"); else link.removeAttribute(\"aria-current\"); }); }   function setFooterYear() { const el = document.getElementById(\"year\"); if (el) el.textContent = new Date().getFullYear(); }   קוראים לשתי הפונקציות. ב-CSS: .navbar-brand { color: var(--brand-text); }   .navbar .nav-link.active { font-weight: 600; box-shadow: inset 0 -2px 0 var(--brand); }"
quiz:
  - q: "מה גורם לסרגל הניווט להתכווץ לכפתור תפריט בטלפונים?"
    options:
      - "פונקציית JavaScript שאתם כותבים בעצמכם"
      - "המחלקה navbar-expand-lg יחד עם כפתור מתג ועם מכל collapse (הסקריפט של Bootstrap הוא זה שפותח)"
      - "תג ה-meta של viewport"
    explain: "navbar-expand-lg מציגה את התפריט המלא מנקודת השבירה lg (992px). מתחתיה המתג פותח וסוגר את המכל .collapse."
  - q: "למה הקוד של הקישור הפעיל קורא את document.body.dataset.page ולא מסתכל על שורת הכתובת?"
    options:
      - "זה עובד גם בתצוגה המקדימה, ושם העמוד נשאר קל לקריאה ולשינוי"
      - "שורת הכתובת לא זמינה ל-JavaScript"
      - "dataset מהיר יותר מ-location"
    explain: "תכונת data-page היא מפורשת. פענוח של ה-URL שביר כשעמוד מוגש מתיקיות שונות."
  - q: "מה משיג השילוב d-flex flex-column min-vh-100 על ה-body ועוד flex-grow-1 על main?"
    options:
      - "הוא מגדיל את הטקסט"
      - "הוא ממרכז את הדף אופקית"
      - "הכותרת התחתונה יושבת בתחתית החלון גם כשיש בדף מעט מאוד תוכן"
messages:
  - "קראו את שם העמוד הנוכחי מתוך document.body.dataset.page."
  - "תנו לקישור המתאים את המחלקה \"active\" בעזרת classList."
  - "השתמשו ב-new Date().getFullYear() כדי לקבל את השנה הנוכחית."
---
האתר צריך דרך לנוע בתוכו. בשלב הזה תוסיפו סרגל ניווט שעובד במחשבים ובטלפונים, כותרת תחתונה (footer), ואת קטע ה-JavaScript הראשון שלכם.

## איפה אנחנו עומדים

דף הבית טוען את Bootstrap, את גיליון הסגנונות שלכם ואת הסקריפט שלכם, ומציג כותרת. עדיין אין ניווט, ולכן מבקר לא יכול להגיע לעמודים האחרים.

## מה נוסיף, ולמה זה חשוב

ניווט הוא הדבר הראשון שאנשים מחפשים. הוא חייב לעבוד עם עכבר, עם אצבע ועם מקלדת, והוא חייב להתאים למסך טלפון צר. סרגל הניווט של Bootstrap כבר פותר את רוב זה, ולכן תלמדו את המבנה שלו במקום להמציא אותו מחדש. הכותרת התחתונה חוזרת על העיקר (זכויות יוצרים וקישורים לרשתות חברתיות), וסקריפט קטן שומר אוטומטית על שני פרטים נכונים: איזה קישור מודגש ואיזו שנה מוצגת.

## מדריך צעד אחר צעד

**1. מכינים את ה-body.** דף קצר צריך בכל זאת לדחוף את הכותרת התחתונה לתחתית החלון. הפכו את ה-body ל-flexbox בעמודה שגבוה לפחות כמו החלון (`min-vh-100`) ותנו ל-`main` לגדול אל תוך המקום הפנוי:

```html
<body data-page="home" class="d-flex flex-column min-vh-100">
...
<main class="flex-grow-1">
```

`data-page="home"` היא תכונת נתונים מותאמת. הסקריפט שלנו קורא אותה כדי לדעת באיזה עמוד הוא נמצא.

**2. בונים את סרגל הניווט.** שימו אותו בתוך `header` עם המחלקה `sticky-top`, כדי שהסרגל יישאר גלוי בזמן גלילה. למה על ה-header ולא על ה-nav? אלמנט דביק נדבק רק בתוך ההורה שלו, וה-header הוא ההורה הגבוה שאנחנו רוצים:

```html
<header class="sticky-top">
  <nav class="navbar navbar-expand-lg bg-body-tertiary border-bottom" aria-label="Main navigation">
    <div class="container">
      <a class="navbar-brand fw-bold" href="index.html">Alex Rivers</a>
      <button class="navbar-toggler" type="button"
              data-bs-toggle="collapse" data-bs-target="#main-nav"
              aria-controls="main-nav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="main-nav">
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item"><a class="nav-link" data-page="home" href="index.html">Home</a></li>
          <!-- Projects, About, Contact: the same shape -->
        </ul>
      </div>
    </div>
  </nav>
</header>
```

חלק אחרי חלק: `navbar-expand-lg` מציגה את הקישורים בשורה מ-992px ומעלה ומסתירה אותם מאחורי הכפתור מתחת לכך. ה-`data-bs-target` של הכפתור חייב להתאים ל-`id` של מכל ה-collapse. `ms-auto` דוחפת את הקישורים לימין. ערכי `aria-label` נותנים לקוראי מסך שמות עבור הניווט ועבור הכפתור שיש בו רק אייקון.

**3. מוסיפים את הכותרת התחתונה** אחרי `main`. היא משתמשת בשורת flex במסכים רחבים ובעמודה במסכים צרים (`flex-column flex-sm-row`). השנה יושבת ב-`span` עם id, כי JavaScript ימלא אותה:

```html
<p>&copy; <span id="year">2026</span> Alex Rivers.</p>
```

**4. כותבים את הסקריפט.** ב-`js/main.js` כתבו שתי פונקציות קטנות. הן בודקות שהאלמנטים שלהן קיימים, כי אותו קובץ רץ בכל עמוד:

```js
function highlightCurrentLink() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.navbar .nav-link').forEach((link) => {
    const isCurrent = link.dataset.page === currentPage;
    link.classList.toggle('active', isCurrent);
    // aria-current tells screen readers which link is the current page
  });
}
```

`classList.toggle(name, true/false)` מוסיפה או מסירה מחלקה לפי הארגומנט השני. פונקציית הכותרת התחתונה היא אותו רעיון: למצוא את `#year` ולהציב ב-`textContent` את `new Date().getFullYear()`.

**5. מעצבים את הפרטים** ב-`css/style.css`: צבע מותג לקישור הלוגו, וקישור פעיל מודגש ועם קו תחתון.

> **שימו לב:**
> - אם `data-bs-target="#main-nav"` של המתג וה-`id` של המכל שונים, הכפתור לא עושה כלום והתפריט אף פעם לא נפתח בטלפון.
> - גם שכחת סקריפט החבילה של Bootstrap (שלב 1) שוברת את המתג. ה-CSS של Bootstrap לבדו לא יכול לפתוח תפריט.
> - לכל עמוד צריך עותק משלו של סרגל הניווט. החזרה הזו נורמלית באתרי HTML פשוטים. מחוללי אתרים סטטיים ו-frameworks קיימים כדי להעלים אותה, אבל העתקה והדבקה בסדר גמור לארבעה עמודים.
> - `getFullYear` היא מתודה, ולכן היא צריכה סוגריים: `getFullYear()`.

> **תורכם:** עקבו אחרי הערות ה-`TODO` ב-`index.html`, ב-`js/main.js` וב-`css/style.css`. ה-body מקבל `data-page="home"` ואת מחלקות ה-flex. הוסיפו את ה-header הדביק עם סרגל הניווט (ארבעה קישורים עם ערכי `data-page` של `home`, `projects`, `about` ו-`contact`), ואחר כך את הכותרת התחתונה עם `span#year`. הסקריפט חייב לסמן את הקישור הנוכחי עם `active` ו-`aria-current="page"` ולכתוב את השנה. הקישור Home צריך להיראות פעיל בתצוגה המקדימה.
