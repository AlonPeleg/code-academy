---
title: "שלב 6: דף ה-About עם ציר זמן"
summary: "כותבים את הסיפור שלכם, מפרטים עובדות מהירות, מציירים ציר זמן של הניסיון שלכם ב-CSS ומוסיפים פסי כישורים נגישים."
hints:
  - "אותו מתכון כמו בשלב 5: החליפו את גוף ה-placeholder ב-about.html בדף מלא (מאפייני body, סרגל ניווט וכותרת תחתונה), ואז מלאו אותו. התוכן מורכב משלושה חלקים: עמודה צרה עם האווטאר והעובדות המהירות, ועמודה רחבה עם הסיפור שלכם, ציר הזמן ופסי הכישורים."
  - "פריסה: div.row.gy-5.gx-lg-5 עם aside.col-lg-4 ו-div.col-lg-8. עובדות: dl.row עם זוגות dt.col-5 / dd.col-7. ציר זמן: ol.timeline עם ארבעה li.timeline-item, וכל אחד מכיל p.timeline-date, h3.h5 ו-p. כישורים: לכל כישור div עם תווית ו-div.progress[role=progressbar] שמכיל div.progress-bar עם style=\"width: 90%\". CSS: ל-.timeline-item יש position relative, וה-::before שלו הוא position absolute, כדי שיוכל לשבת על הקו."
  - "<ol class=\"timeline mt-4\"><li class=\"timeline-item\"><p class=\"timeline-date mb-1\">2026 to now</p><h3 class=\"h5 mb-1\">Junior Web Developer, Brightside Studio</h3><p class=\"text-body-secondary mb-0\">...</p></li> ...three more... </ol>   <div class=\"progress\" role=\"progressbar\" aria-labelledby=\"skill-html\" aria-valuenow=\"90\" aria-valuemin=\"0\" aria-valuemax=\"100\"><div class=\"progress-bar\" style=\"width: 90%\"></div></div>   CSS: .timeline { list-style: none; margin: 0; padding: 0 0 0 1.5rem; border-left: 2px solid var(--bs-border-color); }   .timeline-item { position: relative; padding-bottom: 1.75rem; }   .timeline-item::before { content: \"\"; position: absolute; left: calc(-1.5rem - 7px); top: 0.35rem; width: 12px; height: 12px; border-radius: 50%; background: var(--brand); }   .progress { --bs-progress-height: 0.75rem; }"
quiz:
  - q: "מדוע ציר הזמן הוא רשימה ממוספרת (ol) ולא קבוצה של div-ים?"
    options:
      - "div לא יכול להכיל כותרות"
      - "רשימות ממוספרות הן האלמנטים היחידים שאפשר למקם"
      - "סדר הפריטים חשוב, והרשימה מספרת לטכנולוגיה מסייעת כמה פריטים יש"
    explain: "אלמנטים סמנטיים נותנים משמעות בחינם. קורא מסך מכריז \"list, 4 items\" לפני שהוא מקריא את הפריטים."
  - q: "מה צריך להתקיים כדי ש-::before עם position absolute ישב על הקו של ציר הזמן?"
    options:
      - "ההורה שלו, .timeline-item, צריך להיות עם position relative, כדי שההיסטים יימדדו ממנו"
      - "ל-pseudo-element צריך תג HTML משלו"
      - "את הקו צריך לצייר בעזרת תמונה"
    explain: "אלמנט עם position absolute ממוקם ביחס לאב הקדמון הממוקם הקרוב ביותר. בלי position relative על הפריט, הנקודה הייתה קופצת לפינת הדף."
  - q: "אילו מאפיינים הופכים פס התקדמות של Bootstrap להבנה עבור קורא מסך?"
    options:
      - "style=\"width: 90%\" על הפס בלבד"
      - "role=\"progressbar\" עם aria-valuenow, aria-valuemin ו-aria-valuemax, ועם תווית"
      - "המחלקה progress-bar-striped"
messages:
  - "סימנו ציר זמן כרשימה ממוספרת: השתמשו ב-<ol class=\"timeline\">."
  - "ציירו את נקודות ציר הזמן עם .timeline-item::before ועם content: \"\"."
  - "הפכו את הנקודה לעגולה בעזרת border-radius: 50%."
---
דף ה-About עונה על השאלה שכל מגייס או מגייסת שואלים אחרי דף הבית: "מי האדם הזה?". כשהוא נעשה היטב, הוא אישי, כן וקל לסריקה.

## איפה אנחנו עומדים

דף הבית ודף הפרויקטים גמורים. הקישור About בסרגל הניווט מוביל ל-placeholder, כי עד עכשיו רק דף הבית ודף הפרויקטים מכילים את סרגל הניווט ואת הכותרת התחתונה.

## מה נוסיף, ולמה זה חשוב

דף בשתי עמודות: עמודה צרה עם האווטאר והעובדות המהירות שלכם, ועמודה רחבה עם הסיפור, ציר זמן של ניסיון והשכלה, ופסי כישורים. ציר זמן מראה את הדרך שלכם במבט אחד, וזה חשוב במיוחד אם החלפתם קריירה: הוא הופך את העבודה הקודמת שלכם ליתרון ("למדתי להסביר דברים בפשטות") במקום לחור בקורות החיים.

## הדרכה שלב אחר שלב

**1. שימוש חוזר במסגרת הדף.** כמו בשלב 5: הגדירו את מאפייני ה-body (`data-page="about"` ומחלקות ה-flex), העתיקו את סרגל הניווט ואת הכותרת התחתונה מ-`index.html`, והוסיפו `section.page-header` עם `h1`.

**2. פריסה.** השתמשו באותה רשת כמו ב-hero: `row gy-5 gx-lg-5`, עם `col-lg-4` לעובדות ו-`col-lg-8` לטקסט הארוך. העמודה הצרה היא `aside`, כי זה תוכן קשור אבל משני. חברו אותה לכותרת שלה בעזרת `aria-labelledby`.

**3. עובדות מהירות כרשימת תיאורים.** האלמנט `dl` מכיל מונחים (`dt`) ותיאורים (`dd`). אם תוסיפו ל-`dl` את המחלקה `row`, תוכלו לקבוע גודל לכל `dt` ו-`dd` כעמודות, כך שהתוויות יהיו מיושרות:

```html
<dl class="row">
  <dt class="col-5">Based in</dt>
  <dd class="col-7">Lisbon, Portugal</dd>
</dl>
```

**4. ציר הזמן ב-HTML.** הסדר חשוב, ולכן משתמשים ברשימה ממוספרת. לכל פריט יש תאריך, כותרת ותיאור קצר:

```html
<ol class="timeline">
  <li class="timeline-item">
    <p class="timeline-date mb-1">2026 to now</p>
    <h3 class="h5 mb-1">Junior Web Developer, Brightside Studio</h3>
    <p class="text-body-secondary mb-0">What you did and learned.</p>
  </li>
</ol>
```

**5. ציר הזמן ב-CSS.** הסירו את המספרים מהרשימה, תנו לה קו אנכי (גבול שמאלי) והזיזו את הפריטים ימינה. כל פריט מצייר לעצמו נקודה בעזרת **pseudo-element**: תיבה שנוצרת על ידי CSS, בלי HTML. הוא זקוק ל-`content: ""`, אחרת הוא לא קיים:

```css
.timeline-item { position: relative; }
.timeline-item::before {
  content: "";
  position: absolute;
  left: calc(-1.5rem - 7px);   /* back over the padding, onto the line */
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--brand);
}
```

`position: relative` על הפריט הופך אותו לנקודת הייחוס של הנקודה הממוקמת בצורה אבסולוטית. הפונקציה `calc()` מערבבת יחידות: 1.5rem הוא ה-padding של הרשימה, ו-7px ממרכזים את הנקודה בגודל 12px על הקו בעובי 2px.

**6. פסי כישורים.** רכיב ה-progress של Bootstrap זקוק למאפייני ARIA הנכונים. הרוחב החזותי של הפס נקבע בתוך השורה (inline), והאחוז משמש גם כערך עבור טכנולוגיה מסייעת:

```html
<div class="progress" role="progressbar" aria-labelledby="skill-html"
     aria-valuenow="90" aria-valuemin="0" aria-valuemax="100">
  <div class="progress-bar" style="width: 90%"></div>
</div>
```

הטקסט "90%" לידו הוא קישוט למשתמשים רואים, ולכן הוא מקבל `aria-hidden="true"`, אחרת הערך מוקרא פעמיים. אזהרה הוגנת: אחוזים הם עניין סובייקטיבי. מנהלי גיוס רבים מעדיפים משפט על מה בניתם עם כישור מסוים, ולכן שמרו על הפסים כנים.

> **שימו לב:**
> - pseudo-element בלי `content` בלתי נראה. אפילו מחרוזת ריקה מספיקה: `content: ""`.
> - אם הנקודה במקום הלא נכון, בדקו קודם את `position: relative` על ההורה, ואחר כך את המספרים ב-`left` וב-`top`.
> - אל תשתמשו בכותרות רק כדי לקבל טקסט גדול יותר. בחרו את הרמה הנכונה (`h2` לחלקים, `h3` לפריטי ציר הזמן) וקבעו את הגודל בעזרת מחלקה כמו `h5`.
> - הערך `aria-valuenow` חייב להתאים לרוחב החזותי, אחרת משתמשי קורא מסך ישמעו מספר אחר.

> **תורכם:** החליפו את גוף ה-placeholder ב-`about.html` בדף המלא: מאפייני body, סרגל ניווט, `section.page-header` עם `h1` שכתוב בו "About me", `aside` עם האווטאר ו-`dl.row` של עובדות מהירות (כולל Lisbon, Portugal), הכותרות "My story", "Experience and education" ו-"Skills", `ol.timeline` עם ארבעה `li.timeline-item`, שישה פסי `.progress` עם מאפייני ARIA תקינים, והכותרת התחתונה. הוסיפו את כללי ציר הזמן ופסי ההתקדמות ל-`css/style.css`.
