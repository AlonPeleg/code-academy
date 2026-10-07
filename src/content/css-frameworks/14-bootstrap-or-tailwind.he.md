---
title: "Bootstrap או Tailwind - במה להשתמש?"
summary: "בונים את אותו כרטיס מוצר עם שני הפריימוורקים, משווים ביניהם ולומדים איך בוחרים."
hints:
  - "בצד של Bootstrap הכול רכיבים מוכנים. צריך card, card-body, card-title, card-text, btn ו-btn-primary. בצד של Tailwind מתארים את המראה בעזרת מחלקות קטנות על כל אלמנט."
  - "Bootstrap: card h-100 shadow-sm על ה-div החיצוני, card-body על ה-div הפנימי, card-title h4 על ה-h2, card-text text-secondary על ה-p, btn btn-primary על הקישור. Tailwind: flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm על #tw-card."
  - "<div id=\"bs-card\" class=\"card h-100 shadow-sm\"> ... <h2 class=\"card-title h4\"> <p class=\"card-text text-secondary\"> <a href=\"#\" class=\"btn btn-primary\">   <div id=\"tw-card\" class=\"flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm\">   כותרת: text-xl font-bold text-slate-900   טקסט: text-slate-600   <button class=\"mt-2 self-start rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white\">"
quiz:
  - q: "איזו טענה על גודל ה-bundle קרובה ביותר לאמת?"
    options: ["Bootstrap שולחת את כל גיליון הסגנונות שלה; פרויקט Tailwind אחרי build שולח רק את ה-utilities שהשתמשתם בהם", "Tailwind תמיד שולחת קובץ גדול יותר מ-Bootstrap", "אף אחד מהפריימוורקים לא משפיע על גודל הדף"]
  - q: "אתם צריכים השבוע דשבורד ניהול מלוטש עם מודאלים, תפריטים נפתחים ופריסת טופס, ואין לכם עיצוב. מה התחלה קלה יותר?"
    options: ["Tailwind, כי אין בה רכיבים ואפשר לעצב הכול", "Bootstrap, כי היא מגיעה עם רכיבים מוכנים ונגישים", "HTML רגיל בלבד"]
  - q: "למה הכפתור של Tailwind בשיעור הזה משתמש ב-px-6 ולא ב-px-4?"
    options: ["px-4 אינה מחלקה של Tailwind", "px-6 נדרשת על ידי הרשת של Tailwind", "שני הפריימוורקים מגדירים את px-4 עם ערכים שונים, וזו של Bootstrap מנצחת"]
    explain: "ה-px-4 של Bootstrap הוא 1.5rem והוא משתמש ב-!important, וזה של Tailwind הוא 1rem. זו עוד סיבה לא לטעון את שניהם בפרויקט אמיתי."
  - q: "איזה תיאור מתאים ביותר ל-Tailwind?"
    options: ["מחלקות utility ברמה נמוכה שמשלבים כדי לבנות עיצוב משלכם", "רכיבים מוכנים שרק צריך לכוונן", "פריימוורק JavaScript לבניית אפליקציות"]
---

למדתם עכשיו שתי דרכים לעצב דף במהירות, ושאלה נפוצה מאוד היא "במה כדאי להשתמש?". התשובה הכנה היא: שניהם טובים, והם טובים בדברים שונים. בשיעור הזה תבנו את אותו כרטיס מוצר עם כל אחד מהם, ואז תשוו ביניהם ותקבלו מדריך החלטה קצר.

## אותו כרטיס, בשתי דרכים

**Bootstrap** נותנת לכם רכיב מוגמר. אתם נותנים שם לרכיב ולחלקים שלו:

```html
<div class="card h-100 shadow-sm">
  <div class="card-body">
    <h2 class="card-title h4">Trail Backpack</h2>
    <p class="card-text text-secondary">...</p>
    <a href="#" class="btn btn-primary">Add to cart</a>
  </div>
</div>
```

אתם כותבים בערך חמישה שמות מחלקות ומקבלים ריפוד, גבול, פינות מעוגלות וכפתור כחול. אם אתם רוצים משהו ש-Bootstrap לא תכננה, אתם דורסים אותו עם CSS.

**Tailwind** לא נותנת לכם רכיב. אתם בונים את המראה מ-utilities זעירים:

```html
<div class="flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm">
  <div class="text-xl font-bold text-slate-900">Trail Backpack</div>
  <button class="rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white">Add to cart</button>
</div>
```

יותר מחלקות, אבל כל אחת גלויה ב-HTML, ושום דבר לא מוסתר מאחורי שם. שינוי של רדיוס פינה בכפתור אחד הוא עריכה של מילה אחת.

## השוואה

| | Bootstrap | Tailwind |
| --- | --- | --- |
| הרעיון | רכיבים מוכנים ורשת של 12 עמודות | utilities ברמה נמוכה שמשלבים |
| תוצאה ראשונה | מהירה מאוד, הדף נראה סביר מיד | מהירה אחרי שמכירים את שמות המחלקות |
| עקומת למידה | מתונה: לומדים שמות של רכיבים | בינונית: לומדים את הסולם ואת תבנית השמות |
| המראה | "מראה Bootstrap" מזוהה אלא אם מתאימים אישית | נראה כמו כל מה שמעצבים |
| חלקי JavaScript | כלולים: מודאל, תפריט נפתח, קרוסלה, טולטיפ | אין. מביאים משלכם או משתמשים בספרייה |
| התאמה אישית | משתני CSS, build של Sass, או דריסות | עורכים את ערכת הנושא (`@theme`), מרכיבים utilities |
| גודל | כל גיליון הסגנונות: בערך 230 KB, כ-30 KB דחוס | build מוציא רק מחלקות שבשימוש, לעיתים קרובות 10 עד 30 KB |
| הכי מתאימה ל- | דשבורדים, כלי ניהול, אבות טיפוס, צוותים שרוצים עקביות | עיצובים מותאמים, אפליקציות מבוססות רכיבים (React, Vue וכן הלאה) |

## איך בוחרים

שאלו את עצמכם את השאלות האלה לפי הסדר:

1. **האם יש לי עיצוב מותאם שצריך להתאים אליו?** בחרו ב-Tailwind. הרכיבים של Bootstrap נלחמים בכם כשצריך להיראות ייחודי.
2. **האם אני צריך ממשק עובד עד מחר בלי מעצב?** בחרו ב-Bootstrap. Navbar, מודאל, טפסים והתראות עובדים מהקופסה.
3. **האם הפרויקט בנוי מרכיבים (React, Vue, Svelte)?** Tailwind מתאימה מאוד, כי החזרתיות חיה ברכיבים.
4. **האם הצוות הוא בעיקר מפתחי backend שלא אוהבים לכתוב CSS?** קל יותר לשמור על עקביות עם Bootstrap.
5. **האם אני כבר מכיר אחת מהן היטב?** השתמשו בה. מיומנות מנצחת תיאוריה.

הרבה מפתחים לומדים קודם Bootstrap, ואז עוברים ל-Tailwind בפרויקטים מאוחרים יותר. אף בחירה אינה קבועה; ה-CSS שבבסיס, שלמדתם, זהה.

## למה בכפתור של Tailwind יש סימן קריאה

טעינה של שתי הספריות היא **רק בשביל השיעור הזה**. לעשות זאת באמת גורם להתנגשויות. שתי דוגמאות שאפשר לראות בתרגיל הזה:

- האיפוס של Bootstrap אומר `button { border-radius: 0 }`, ו-Tailwind v4 שמה את המחלקות שלה ב"שכבה" נמוכה יותר של CSS, ולכן Bootstrap מנצחת. הוספת `!` בסוף (`rounded-lg!`) היא **מגדיר החשיבות** (important modifier) של Tailwind וגורמת למחלקה לנצח.
- בשני הפריימוורקים יש מחלקות עם אותו שם אבל ערכים שונים. ה-`px-4` של Bootstrap הוא 1.5rem ומסומן כחשוב; ה-`px-4` של Tailwind הוא 1rem. בגלל זה הכפתור של Tailwind משתמש ב-`px-6`, ש-Bootstrap לא מגדירה.

מכיוון ש-Bootstrap מעצבת אלמנטים חשופים כמו `p`, `h2` ו-`a`, הכרטיס של Tailwind משתמש באלמנטי `div` בשביל הטקסט שלו. בפרויקט שמשתמש רק ב-Tailwind הייתם משתמשים ב-`p` וב-`h2` כרגיל.

> **שימו לב:**
> - אל תעלו לאוויר דף שבו שני הפריימוורקים טעונים. אתם משלמים על שני גיליונות סגנונות ונלחמים בהתנגשויות שלהם.
> - שגיאות כתיב עדיין לא עושות כלום. `btn-primary` חסרה נותנת לכם קישור בלי עיצוב, ו-`bg-indgo-600` נותנת כפתור שקוף.
> - אל תחליטו רק לפי פופולריות. שתיהן בשימוש נרחב ומתוחזקות היטב, ולכן בחרו לפי צורכי הפרויקט.
> - זכרו שהחלקים האינטראקטיביים של Bootstrap (כפתור ה-navbar, מודאל) צריכים גם את קובץ ה-JavaScript שלה ולא רק את ה-CSS.

## להמשך

עצבו מחדש את הכרטיס של Bootstrap בעזרת דריסת המשתנים שלו (הוסיפו `style="--bs-card-border-radius: 1rem"`), והחליפו את `bg-indigo-600` ב-`bg-emerald-600` בכרטיס של Tailwind. איזה שינוי הרגיש לכם טבעי יותר?

> **תורכם:** השלימו את שני הכרטיסים. Bootstrap: `card h-100 shadow-sm`, `card-body`, `card-title h4`, `card-text text-secondary`, `btn btn-primary`. Tailwind: `flex h-full flex-col gap-2 rounded-xl bg-white p-6 shadow-sm` על הכרטיס, `text-xl font-bold` על הכותרת, ו-`rounded-lg! bg-indigo-600 px-6 py-2 font-semibold text-white` על הכפתור.
