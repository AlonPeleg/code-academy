---
title: "שלב 4: כישורים, פרויקטים נבחרים וקריאה לפעולה"
summary: "משלימים את דף הבית עם כרטיסי Bootstrap לכישורים, שלושה כרטיסי פרויקט עם תמונות ממוזערות ב-CSS וקריאה לפעולה בסוף."
hints:
  - "אתם בונים שלושה אזורים, אחד מתחת לשני, בתוך main: ‏#skills, ‏#featured ו-.cta. כל אחד הוא section עם container. כישורים ופרויקטים נבחרים משתמשים בשורה של שלוש עמודות; הכרטיסים בתוכן הם אותו רכיב Bootstrap, רק התוכן שונה."
  - "כרטיס כישור הוא div.col-md-4 > div.card.h-100.skill-card > div.card-body עם h3.h5.card-title, עם p.card-text ועם ul.list-unstyled.d-flex.flex-wrap.gap-2 מלא ב-li > span.badge.text-bg-primary. כרטיס פרויקט הוא div.col > article.card.project-card.h-100 עם div.project-thumb.thumb-cafe (עם aria-hidden=\"true\") למעלה, card-body ו-div.card-footer שמחזיק a.btn.btn-sm.btn-outline-primary. השורה של הפרויקטים היא row row-cols-1 row-cols-md-3 g-4."
  - '<section id="featured" class="py-5 bg-body-tertiary" aria-labelledby="featured-title"><div class="container"><h2 id="featured-title" class="fw-bold mb-4">Featured projects</h2><div class="row row-cols-1 row-cols-md-3 g-4"><div class="col"><article class="card project-card h-100"><div class="project-thumb thumb-cafe" aria-hidden="true"><span>CB</span></div><div class="card-body"><h3 class="h5 card-title">Cafe Bloom</h3><p class="card-text text-body-secondary">...</p></div><div class="card-footer bg-transparent border-0 pb-3"><a class="btn btn-sm btn-outline-primary" href="https://github.com/alexrivers/cafe-bloom" target="_blank" rel="noopener noreferrer">Source code</a></div></article></div> ...two more... </div></div></section>   Skills and call to action follow the same pattern. CSS: .skill-card { border-top: 4px solid var(--brand); }   .project-thumb { display: flex; align-items: center; justify-content: center; height: 140px; color: #ffffff; }   .thumb-cafe { background: linear-gradient(135deg, #b45309, #be123c); }   .cta { background: linear-gradient(135deg, var(--brand), var(--brand-dark)); color: #ffffff; }'
messages:
  - "השתמשו ב-row-cols-1 row-cols-md-3 על השורה שמחזיקה את כרטיסי הפרויקטים."
  - "הוסיפו את מחלקות הגרדיאנט לתמונות הממוזערות (‎.thumb-cafe ואחרות) ל-css/style.css."
  - "תנו ל-.cta רקע גרדיאנט."
quiz:
  - q: "מה עושה המחלקה h-100 על כל כרטיס?"
    options: ["היא גורמת לכרטיס להיות בגובה 100 פיקסלים בדיוק", "היא גורמת לכל כרטיס להיות בגובה העמודה שלו, כך שכרטיסים באותה שורה מיושרים גם כשאורכי הטקסט שונים", "היא מסתירה את הכרטיס במסכים נמוכים מ-100 פיקסלים"]
    explain: "עמודות בשורה הן באותו גובה. h-100 קובעת גובה של 100 אחוז, ולכן הכרטיס ממלא את העמודה שלו."
  - q: "מה היתרון של row-cols-1 row-cols-md-3 לעומת מתן col-md-4 לכל עמודה?"
    options: ["מצהירים על מספר העמודות פעם אחת על השורה, ולכן הכרטיסים צריכים רק .col פשוטה", "זו הדרך היחידה לקבל שלוש עמודות", "היא טוענת פחות קבצים"]
    explain: "שתיהן עובדות. row-cols נוחה כשיש הרבה כרטיסים זהים ואולי תשנו את המספר בהמשך."
  - q: "למה לתמונות הממוזערות עם הגרדיאנט יש aria-hidden=\"true\"?"
    options: ["כדי שייטענו מהר יותר", "הן קישוט עם ראשי תיבות בלבד, וכותרת הכרטיס כבר נותנת שם לפרויקט", "קוראי מסך לא יכולים לקרוא CSS"]
---
מבקר שגולל את דף הבית צריך ללמוד במהירות שלושה דברים: מה אתם יודעים לעשות, מה בניתם ומה לעשות עכשיו. זה בדיוק מה שתוסיפו כעת.

## איפה אנחנו

בדף הבית יש סרגל ניווט (navbar), אזור hero ותחתית (footer). מתחת ל-hero יש מקום ריק שמחכה לתוכן.

## מה נוסיף, ולמה זה חשוב

שלושה אזורים בין ה-hero לתחתית:

1. **כישורים** (`#skills`): שלושה כרטיסים שמקבצים את היכולות שלכם. מגייסים סורקים מילות מפתח, ולכן תגיות (badges) מקלות למצוא אותן.
2. **פרויקטים נבחרים** (`#featured`): שלושת הפרויקטים הטובים ביותר שלכם ככרטיסים. הציגו עבודה גמורה, לא הבטחות. הקישור "לכל הפרויקטים" מוביל לדף המלא שתבנו בשלב 5.
3. **קריאה לפעולה** (`.cta`): צעד הבא ברור אחד בסוף הדף. דף שנגמר בלי הצעה מאבד מבקרים.

תשתמשו שוב ברכיב הכרטיס גם לכישורים וגם לפרויקטים. ללמוד רכיב Bootstrap אחד לעומק עדיף על לשנן עשרה.

## מעבר מודרך

**1. כרטיס הוא שלוש קופסאות מקוננות.** ל-`card` יש בפנים `card-body`, ובו כותרת, טקסט וכל דבר אחר. גורמים לכרטיסים באותה שורה להיות בגובה שווה עם `h-100`:

```html
<div class="card h-100 skill-card">
  <div class="card-body">
    <h3 class="h5 card-title">Front end</h3>
    <p class="card-text text-body-secondary">One sentence.</p>
  </div>
</div>
```

למה `h3` עם המחלקה `h5`? מבנה הדף צריך `h1` (ה-hero), `h2` (אזור) ו-`h3` (כרטיס), כדי שהכותרות ישמרו על סדר לוגי. `.h5` משנה רק את הגודל שבו הכותרת נראית.

**2. תגיות כרשימה אמיתית.** קבוצת תגיות היא רשימה, ולכן משתמשים ב-`ul` וב-`li`. `list-unstyled` של Bootstrap מסיר את הנקודות, ו-`d-flex flex-wrap gap-2` מסדר את התגיות בשורה:

```html
<ul class="list-unstyled d-flex flex-wrap gap-2 mb-0">
  <li><span class="badge text-bg-primary">HTML</span></li>
</ul>
```

**3. שלוש עמודות בדרך הקלה.** עבור שלושת כרטיסי הכישורים תנו לכל עמודה `col-md-4`. עבור כרטיסי הפרויקטים מצהירים על הפריסה פעם אחת על השורה עם `row-cols-1 row-cols-md-3`: כרטיס אחד בכל שורה בטלפונים, שלושה מנקודת השבירה `md` (768px), וכל עמודה בפנים צריכה רק את המחלקה `col`:

```html
<div class="row row-cols-1 row-cols-md-3 g-4">
  <div class="col"> <article class="card project-card h-100"> ... </article> </div>
</div>
```

כרטיס פרויקט הוא דבר שלם ועצמאי, ולכן `article` מתאים יותר מ-`div`.

**4. תמונות ממוזערות בלי תמונות.** `div` עם רקע גרדיאנט וראשי התיבות של הפרויקט מספיק. זה קישוט, ולכן מסתירים אותו מקוראי מסך עם `aria-hidden="true"`; הכותרת נושאת את המשמעות. ה-CSS נותן לו גובה ופינות עליונות מעוגלות שמתאימות לכרטיס:

```css
.project-thumb {
  height: 140px;
  border-radius: var(--bs-card-inner-border-radius) var(--bs-card-inner-border-radius) 0 0;
}
.thumb-cafe { background: linear-gradient(135deg, #b45309, #be123c); }
```

**5. קישור בתחתית הכרטיס וקריאה לפעולה.** קישורים שפותחים אתר אחר משתמשים ב-`target="_blank"` יחד עם `rel="noopener noreferrer"`, שמונע מהדף החדש לשלוט בדף שלכם. הקריאה לפעולה היא `section.cta` ברוחב מלא עם כותרת, משפט פתיחה (lead) וכפתור `btn-light` אחד, מעוצבת בגרדיאנט של המותג.

> **שימו לב:**
> - אל תדלגו על רמות כותרת. מעבר מ-`h2` ישר ל-`h4` מבלבל אנשים שמנווטים לפי כותרות.
> - `target="_blank"` בלי `rel="noopener noreferrer"` הוא סיכון אבטחה בדפדפנים ישנים ואזהרה ב-Lighthouse.
> - טקסט בכרטיס על רקע צבעוני צריך מספיק ניגודיות. השתמשו בטקסט כהה על רקע בהיר ובטקסט לבן על רקע כהה.
> - יותר מדי תגיות נראות כמו רעש. בחרו ארבע לכל היותר בכל כרטיס.

> **תורכם:** ב-`index.html` הוסיפו `section#skills` (‏`h2` ושורה של שלוש עמודות `.col-md-4`, כל אחת `.card.h-100.skill-card` עם `h3.card-title`, טקסט ותגיות), את `section#featured.bg-body-tertiary` (‏`h2`, קישור ל-`projects.html` ושורת `row-cols-1 row-cols-md-3` של שלושה `article.card.project-card`: Cafe Bloom, Pocket Budget ו-Weather Now, כל אחד עם תמונה ממוזערת, כותרת, טקסט, תגיות וקישור ל-GitHub), ואת `section.cta` עם כפתור `btn-light` אל `contact.html`. הוסיפו את הכללים המתאימים ל-`css/style.css`.
