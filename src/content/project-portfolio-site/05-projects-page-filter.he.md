---
title: "שלב 5: דף הפרויקטים עם כפתורי סינון"
summary: "הופכים את מקום השמירה לדף אמיתי עם רשת של שישה כרטיסי פרויקט וכפתורי סינון שמופעלים על ידי data attributes ו-JavaScript."
hints:
  - "יש כאן שתי משימות. משימת HTML: מחליפים את גוף מקום השמירה ב-projects.html בדף מלא (אותם navbar ו-footer כמו ב-index.html, עם data-page=\"projects\"), ומוסיפים כפתורי סינון ושישה כרטיסים. משימת JavaScript: פונקציה שמציגה או מסתירה את הכרטיסים לפי הכפתור שנלחץ."
  - "כל כרטיס נמצא ב-div.col עם data-category=\"site\", \"app\" או \"practice\". לכל כפתור יש data-filter עם אותן מילים ועוד \"all\". ב-JavaScript, הפונקציה applyFilter(filter) עוברת על הכרטיסים בלולאה: card.hidden = !(filter === \"all\" || card.dataset.category === filter). ספרו את הכרטיסים הנראים וכתבו \"Showing X of Y projects\" לתוך #filter-status. מאזין לחיצה אחד על #project-filters מוצא את הכפתור עם event.target.closest(\"[data-filter]\")."
  - 'function initProjectFilter() { const filterBar = document.getElementById("project-filters"); const grid = document.getElementById("project-grid"); if (!filterBar || !grid) return; const buttons = filterBar.querySelectorAll("[data-filter]"); const cards = grid.querySelectorAll("[data-category]"); const status = document.getElementById("filter-status"); function applyFilter(filter) { let visible = 0; cards.forEach((card) => { const show = filter === "all" || card.dataset.category === filter; card.hidden = !show; if (show) visible += 1; }); buttons.forEach((b) => { const on = b.dataset.filter === filter; b.classList.toggle("active", on); b.setAttribute("aria-pressed", String(on)); }); status.textContent = `Showing ${visible} of ${cards.length} projects`; } filterBar.addEventListener("click", (event) => { const button = event.target.closest("[data-filter]"); if (button) applyFilter(button.dataset.filter); }); applyFilter("all"); }   initProjectFilter();'
messages:
  - "האזינו לאירועי click בכפתורי הסינון."
  - "קראו את הערכים data-filter ו-data-category דרך dataset."
  - "הציגו או הסתירו כל כרטיס על ידי קביעת התכונה hidden שלו."
  - "שמרו על aria-pressed מעודכן בכפתורים, כדי שקוראי מסך ידעו איזה סינון פעיל."
  - "לכל עמודת פרויקט צריך ערך data-category (site, app או practice)."
quiz:
  - q: "למה משמשת תכונת data כמו data-category=\"app\"?"
    options: ["היא מעצבת את האלמנט בצבע \"app\"", "היא שומרת מידע משלכם על אלמנט, ש-JavaScript קורא עם element.dataset.category", "היא אומרת למנועי חיפוש על מה הדף"]
    explain: "כל תכונה שמתחילה ב-data- היא לשימושכם. JavaScript הופך את data-category ל-dataset.category."
  - q: "למה מאזין לחיצה אחד על סרגל הסינון עדיף על מאזין אחד לכל כפתור?"
    options: ["זו הדרך היחידה ש-JavaScript יכול לזהות לחיצות", "לכפתורים אי אפשר להוסיף מאזינים משלהם", "הוא דורש פחות קוד ועדיין עובד כשמוסיפים כפתור נוסף בהמשך (event delegation)"]
    explain: "לחיצות עולות (bubble) מהכפתור להורה שלו, ו-event.target.closest(...) מוצא על איזה כפתור לחצו."
  - q: "למה לכפתורים יש aria-pressed, ולמה בדף יש פסקה עם role=\"status\"?"
    options: ["הם אומרים לטכנולוגיה מסייעת איזה סינון פעיל ומכריזים בנימוס על מספר התוצאות החדש", "הם משנים את צבעי הכפתורים", "הם נדרשים כדי שהתכונה hidden תעבוד"]
---
תיק עבודות עם שלושה פרויקטים בלבד הוא התחלה טובה, אבל אוסף שגדל צריך מקום משלו ודרך לעיין בו. בשלב הזה `projects.html`, שהיה מקום שמירה, הופך לדף אמיתי עם כפתורי סינון.

## איפה אנחנו

דף הבית הושלם. שאר הדפים הם מקומות שמירה. הסרגל העליון (navbar) והתחתית (footer) קיימים רק ב-`index.html`, ו-`js/main.js` יודע להדגיש קישורים ולכתוב את השנה.

## מה נוסיף, ולמה זה חשוב

דף שמציג שישה פרויקטים ברשת, וארבעה כפתורים (All, Websites, Apps, Practice) שמציגים רק את הפרויקטים המתאימים. סינון הוא קטע JavaScript קטן וקלאסי: הוא משתמש ב-data attributes, בטיפול באירועים וב-DOM, וזה בדיוק מה שמעסיקים רוצים לראות בתיק עבודות של מפתח מתחיל. הוא חייב להישאר גם נגיש, ולכן הכפתורים מדווחים על המצב שלהם לקוראי מסך.

## מעבר מודרך

**1. מעתיקים את החלקים המשותפים.** כל דף באתר סטטי חוזר על הסרגל העליון ועל התחתית. העתיקו את שניהם מ-`index.html` לדף החדש, וקבעו `data-page="projects"` על ה-body כדי שהסקריפט משלב 2 ידגיש את הקישור Projects. ה-head כבר מקשר את Bootstrap ואת ה-CSS שלכם.

**2. כותרת לדף.** רצועה פשוטה עם `h1` ופסקת פתיחה (lead) מציגה את הדף. העיצוב שלה (`.page-header`) הוא גרדיאנט רך.

**3. מסמנים כל כרטיס בסוג שלו.** הרשת היא שורה של Bootstrap; כל עמודה נושאת `data-category`:

```html
<div id="project-grid" class="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
  <div class="col" data-category="site"> <article class="card project-card h-100"> ... </article> </div>
  <div class="col" data-category="app"> ... </div>
</div>
```

`row-cols-md-2 row-cols-xl-3` פירושו עמודה אחת בטלפונים, שתיים בטאבלטים ושלוש במחשבים גדולים. חשוב לשים את תכונת ה-data על העמודה (ולא על הכרטיס): כשנסתיר כרטיס, גם העמודה הריקה שלו חייבת להיעלם, אחרת יישאר חור.

**4. כפתורים שנושאים את הסינון שלהם.** שימו את הכפתורים בקבוצה עם תווית. `data-filter` מחזיק את הקטגוריה שהם מציגים, ו-`aria-pressed` אומר לטכנולוגיה מסייעת אם הכפתור פעיל:

```html
<div id="project-filters" role="group" aria-label="Filter projects by type">
  <button type="button" class="btn btn-outline-primary filter-btn active" data-filter="all" aria-pressed="true">All</button>
</div>
<p id="filter-status" role="status"></p>
```

אלמנט עם `role="status"` הוא אזור חי מנומס (live region): כשהטקסט שלו משתנה, קוראי מסך מקריאים את הטקסט החדש בלי לגנוב את הפוקוס.

**5. פונקציית הסינון.** בתוך `initProjectFilter()` פונקציה אחת מחליטה מה גלוי. התכונה `hidden` מושלמת כאן, כי ה-reboot של Bootstrap גורם ל-`[hidden]` להיות `display: none`:

```js
function applyFilter(filter) {
  let visible = 0;
  cards.forEach((card) => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.hidden = !show;
    if (show) visible += 1;
  });
  status.textContent = `Showing ${visible} of ${cards.length} projects`;
}
```

עדכנו גם את הכפתורים באותה פונקציה (החליפו את `active`, קבעו `aria-pressed`) כך שיהיה מקור אמת אחד. אחר כך השתמשו ב-**event delegation**: מאזין אחד על הסרגל במקום ארבעה על הכפתורים.

```js
filterBar.addEventListener('click', (event) => {
  const button = event.target.closest('[data-filter]');
  if (button) applyFilter(button.dataset.filter);
});
```

> **שימו לב:**
> - אם מסתירים את הכרטיס אבל משאירים את העמודה שלו גלויה, ברשת נשאר חור ריק. הסתירו את האלמנט שמחזיק את `data-category`.
> - מחרוזות תבנית (template strings) צריכות backticks: `` `Showing ${visible}` ``. With normal quotes you would print `${visible}` literally. (כלומר, בלי backticks הטקסט לא יוחלף בערך.)
> - `dataset.filter` קורא את `data-filter`. שם בן שתי מילים, כמו `data-project-type`, הופך ל-`dataset.projectType`.
> - שכחת `type="button"` לא מזיקה כאן, אבל בתוך טופס כפתור היה שולח אותו.

> **תורכם:** החליפו את גוף מקום השמירה ב-`projects.html` בדף המלא: `data-page="projects"` ומחלקות flex על ה-body, הסרגל העליון, `section.page-header` עם `h1` "Projects", את `#project-filters` עם ארבעה כפתורי `.filter-btn` (‏`all`, ‏`site`, ‏`app`, ‏`practice`), את `p#filter-status`, את `#project-grid` עם שישה כרטיסי `div.col[data-category]` (Cafe Bloom, Pocket Budget, Weather Now, Todo Board, Portfolio Site, CSS Animation Lab), ואת התחתית. אחר כך כתבו את `initProjectFilter()` ב-`js/main.js` ואת הכללים הקטנים `.page-header` ו-`.filter-btn` ב-CSS. כשהדף נטען הוא חייב להציג "Showing 6 of 6 projects".
