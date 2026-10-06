---
title: "Tailwind - Flexbox ו-Grid"
summary: "סדרו שורות, עמודות ורשתות בעזרת מחלקות עזר, ובנו אזור תמחור עם שלוש תוכניות."
hints:
  - "מפעילים flex ו-grid במחלקה אחת על ההורה: flex או grid. מחלקות היישור הולכות על אותו הורה. הילדים צריכים מחלקות רק כשהם מיוחדים (כמו הבאנר שמתפרס על כמה עמודות)."
  - "header: flex items-center justify-between. #plans: grid grid-cols-3 gap-6. כל article: flex flex-col justify-between. #banner: col-span-3 flex items-center justify-between."
  - "<header class=\"flex items-center justify-between\">   <div id=\"plans\" class=\"mt-8 grid grid-cols-3 gap-6\">   <article class=\"flex flex-col justify-between rounded-2xl bg-white p-6 shadow-md\">   <div id=\"banner\" class=\"col-span-3 flex items-center justify-between rounded-2xl bg-indigo-600 p-6 text-white\">"
quiz:
  - q: "איפה שמים את מחלקת flex כדי לסדר שלושה פריטים בשורה?"
    options: ["על כל אחד משלושת הפריטים", "על האלמנט ההורה שמכיל אותם", "רק על ה-body"]
  - q: "איזו מחלקה יוצרת רשת עם שלוש עמודות שוות?"
    options: ["columns-3", "grid-3", "grid-cols-3"]
  - q: "בשורת flex, איזו מחלקה ממרכזת את הפריטים אנכית?"
    options: ["items-center", "justify-center", "text-center"]
    explain: "items-* מיישרת לרוחב השורה (הציר המשני); justify-* מפזרת פריטים לאורך השורה (הציר הראשי)."
  - q: "מה עושה col-span-2 על ילד של רשת?"
    options: ["מוסיפה שתי עמודות לרשת", "הופכת את הילד לרחב כמו שתי עמודות", "נותנת לילד רווח של 2"]
messages:
  - "השתמשו ב-grid-cols-3 על #plans לשלוש עמודות שוות."
  - "השתמשו ב-col-span-3 על #banner כדי שיתפרס על שלוש העמודות."
---

בפריסה Tailwind באמת מתחיל להרגיש מהיר. Flexbox ו-Grid, שתי שיטות הפריסה שאולי כבר מכירים משיעורי ה-CSS, הופכות למחלקות של מילה אחת. בשיעור הזה תבנו אזור תמחור: שורת כותרת, שלושה כרטיסי תוכניות ברשת (grid) ובאנר שמתפרס מתחתיהם.

## Flexbox במחלקות

שמים `flex` על **הורה** והילדים שלו מסתדרים בשורה. אחר כך מוסיפים מחלקות יישור לאותו הורה:

```html
<div class="flex items-center justify-between gap-4">
  <span>Logo</span>
  <a href="#">Log in</a>
</div>
```

- `flex` - מפעילה את פריסת ה-flex (‏`display: flex`).
- `items-center` - ממרכזת את הילדים לרוחב השורה, כלומר אנכית (‏`align-items: center`).
- `justify-between` - מפזרת אותם לאורך השורה עם המקום הפנוי ביניהם (‏`justify-content: space-between`). אחרות: `justify-start`, `justify-center`, `justify-end`.
- `gap-4` - 1rem בין הילדים. השתמשו ב-gap במקום בשוליים על כל ילד.
- `flex-col` - מערימה את הילדים בעמודה במקום זאת (‏`flex-direction: column`). עכשיו `justify-*` עובדת אנכית.
- `flex-wrap` - נותנת לפריטים לרדת לשורה חדשה; `flex-1` נותנת לילד אחד לגדול ולמלא את המקום הפנוי.

## Grid במחלקות

שמים `grid` על ההורה ואומרים כמה עמודות:

```html
<div class="grid grid-cols-3 gap-6">
  <div>1</div><div>2</div><div>3</div>
  <div class="col-span-3">A wide one under them</div>
</div>
```

- `grid-cols-3` - שלוש עמודות ברוחב שווה (‏`repeat(3, minmax(0, 1fr))`). כל מספר מ-1 עד 12 עובד.
- `gap-6` - 1.5rem בין שורות ועמודות. `gap-x-6` ו-`gap-y-2` קובעות אותם בנפרד.
- `col-span-3` - הילד הזה תופס שלוש עמודות. `row-span-2` עושה את אותו דבר כלפי מטה.

## Flex או Grid?

השתמשו ב-**flex** לדברים חד-ממדיים: סרגל ניווט, שורת כפתורים, פנים של כרטיס. השתמשו ב-**grid** כשחושבים על שורות ועמודות יחד: גלריה, לוח בקרה, טבלת תמחור. אפשר ורצוי לקנן אותם: התוכניות שלמטה הן פריטי רשת, וכל תוכנית היא בעצמה עמודת flex.

## פריסת התמחור, חלק אחר חלק

1. ה-`header` הוא שורת flex. `justify-between` דוחפת את הכותרת שמאלה ואת הקישור ימינה, ו-`items-center` מיישרת אותם.
2. `#plans` היא רשת עם `grid-cols-3 gap-6`. שלושת ילדיה מסוג `article` נוחתים בשלוש העמודות, והבאנר (שמתפרס על כולן) מקבל שורה משלו.
3. כל `article` הוא `flex flex-col justify-between`. החלק העליון (כותרת, מחיר, רשימה) והכפתור הופכים לשני ילדים של עמודה, ולכן `justify-between` שולחת את הכפתור למטה. כל שלושת הכפתורים מסתדרים באותו קו גם כשהרשימות באורכים שונים.
4. הבאנר משתמש ב-`col-span-3 flex items-center justify-between`: הוא ילד של הרשת שמתפרס על כל השורה, ובתוכו הוא שורת flex.

> **שימו לב:**
> - הצבת `flex` על הילדים במקום על ההורה לא עושה שום דבר מועיל. ההורה הוא תמיד המכל.
> - נדמה ש-`justify-center` לא עובדת בעמודה? ב-`flex-col` הציר הראשי הוא אנכי, והמכל צריך גובה פנוי כדי שהאפקט ייראה.
> - `grid-cols-3` בטלפון צר מכווצת את העמודות מאוד. השיעור הבא מתקן את זה עם `grid-cols-1 md:grid-cols-3`.
> - ילד עם `col-span-3` ברשת שיש בה רק שתי עמודות יוצר עמודות נוספות ומוסתרות ושובר את הפריסה. ה-span לא צריך להיות גדול מ-`grid-cols-*`.

## להמשך

נסו `grid-cols-2`, ואז `grid-cols-4`. הוסיפו `items-start` לרשת `#plans` וראו את הכרטיסים מתכווצים לגודל התוכן שלהם. החליפו את `justify-between` ב-`justify-center` ב-header.

> **תורכם:** הפכו את `header` ל-`flex items-center justify-between`; הפכו את `#plans` ל-`grid grid-cols-3 gap-6`; הפכו כל `article` ל-`flex flex-col justify-between`; והפכו את `#banner` ל-`col-span-3 flex items-center justify-between`.
