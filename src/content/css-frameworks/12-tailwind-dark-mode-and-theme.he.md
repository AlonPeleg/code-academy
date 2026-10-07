---
title: "Tailwind - מצב כהה וערכת נושא משלכם"
summary: "מוסיפים מצב כהה בעזרת הווריאנט dark, הופכים אותו להחלפה בלחיצת כפתור ומגדירים צבע מותג משלכם."
hints:
  - "יש ארבע משימות קטנות: שורת @custom-variant ובלוק @theme בתוך תג ה-style, מחלקות dark: על ה-body, הכרטיס והפסקה, bg-brand-500 על הכפתור, ושורה אחת של JavaScript בשביל המתג."
  - "בתוך תג ה-style כתבו: @custom-variant dark (&:where(.dark, .dark *));   ו-   @theme { --color-brand-500: #7c3aed; --color-brand-600: #6d28d9; }. ב-JavaScript אלמנט השורש הוא document.documentElement, ו-classList.toggle(\"dark\") מוסיפה או מסירה את המחלקה."
  - "<body class=\"min-h-screen bg-slate-100 p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-100\">   <main class=\"... bg-white ... dark:bg-slate-800\">   <p class=\"mt-2 text-slate-600 dark:text-slate-300\">   <button id=\"cta\" class=\"rounded-lg bg-brand-500 px-4 py-2 font-semibold text-white hover:bg-brand-600\">   document.documentElement.classList.toggle(\"dark\");"
messages:
  - "הוסיפו: @custom-variant dark (&:where(.dark, .dark *)); בתוך תג ה-style."
  - "הוסיפו בלוק @theme שמגדיר --color-brand-500: #7c3aed;"
  - "השתמשו ב-bg-brand-500 על הכפתור Start a session."
  - "הוסיפו hover:bg-brand-600 לכפתור."
  - "הוסיפו מחלקה dark:bg-slate-... (למשל dark:bg-slate-900)."
  - "הוסיפו מחלקה dark:text-... כדי שהטקסט יישאר קריא על הרקע הכהה."
  - "במטפל הלחיצה השתמשו ב-document.documentElement.classList.toggle(\"dark\");"
quiz:
  - q: "כברירת מחדל (בלי הגדרה נוספת), מה מפעיל את הווריאנט dark: ב-Tailwind v4?"
    options: ["מחלקה dark על אלמנט html", "ההגדרה של המערכת אצל המבקר (prefers-color-scheme: dark)", "כפתור שחייבים תמיד להוסיף"]
  - q: "מה @custom-variant dark (&:where(.dark, .dark *)); עושה?"
    options: ["הוא גורם ל-dark: לחול בתוך כל אלמנט עם המחלקה dark (או עליו)", "הוא מכהה כל צבע בדף", "הוא מוחק את הווריאנט dark"]
  - q: "אחרי שמגדירים את --color-brand-500 ב-@theme, איזו מחלקה משתמשת בו?"
    options: ["color-brand-500", "bg-brand-500", "brand-500-bg"]
    explain: "השם שאחרי --color- הופך לשם הצבע, ולכן bg-, text-, border- ושאר הקידומות עובדות איתו."
  - q: "איך כפתור המתג מחליף מצב כהה עם הווריאנט המותאם?"
    options: ["הוא טוען מחדש את הדף עם גיליון סגנונות אחר", "הוא משנה את כתובת הסקריפט של Tailwind", "הוא מוסיף או מסיר את המחלקה dark על אלמנט html בעזרת JavaScript"]
---

הרבה אנשים משתמשים בערכות נושא כהות בלילה, והרבה אתרים תומכים בהן. Tailwind הופכת את זה לכמעט חינם: כותבים קודם את העיצוב הבהיר ומוסיפים מחלקות `dark:` רק איפה שהגרסה הכהה שונה. בשיעור הזה גם תלמדו את Tailwind את צבע המותג שלכם, כך ש-`bg-brand-500` יעבוד כמו כל מחלקה מובנית.

## הווריאנט dark:

שימו `dark:` לפני כל מחלקה כדי להחיל אותה רק במצב כהה:

```html
<body class="bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
```

במצב בהיר הדף חיוור עם טקסט כהה. במצב כהה השניים מתחלפים. כותבים רק את המחלקות שמשתנות; כל השאר עובר הלאה.

## הוא הולך אחרי הגדרת המערכת

כברירת מחדל, `dark:` מאזין למערכת ההפעלה של המבקר דרך יכולת ה-CSS בשם `prefers-color-scheme: dark`. אם הטלפון או המחשב הנייד שלו במצב כהה, גם הדף שלכם כהה, בלי JavaScript. זו ברירת מחדל טובה, אבל אין למבקר דרך לדרוס אותה בדף שלכם. (אם התצוגה המקדימה שלכם כבר נראית כהה לפני ששניתם משהו, זו הסיבה.)

## מצב כהה שאפשר להחליף

כדי לתת למשתמשים כפתור, אומרים ל-Tailwind v4 ללכת אחרי **מחלקה** במקום אחרי המערכת. בתוך תג style עם הסוג המיוחד `text/tailwindcss` כותבים **וריאנט מותאם** (custom variant):

```html
<style type="text/tailwindcss">
  @custom-variant dark (&:where(.dark, .dark *));
</style>
```

קראו את זה כך: "הווריאנט `dark:` חל על אלמנט שיש לו את המחלקה `dark`, או שנמצא בתוך אחד כזה". עכשיו שימו `class="dark"` על האלמנט `<html>` וכל מחלקות ה-`dark:` מופעלות. סקריפט זעיר הופך אותה:

```js
document.documentElement.classList.toggle("dark");
```

`document.documentElement` הוא האלמנט `<html>`, ו-`toggle` מוסיפה את המחלקה אם היא חסרה ומסירה אותה אם היא שם. אתרים אמיתיים גם שומרים את הבחירה (למשל ב-`localStorage`) כדי שתשרוד רענון; התצוגה המקדימה של השיעור לא יכולה לשמור דברים, ולכן מדלגים על זה.

## ערכת נושא משלכם עם @theme

ערכי העיצוב של Tailwind חיים במשתני CSS שנקראים **משתני נושא** (theme variables). הוסיפו משלכם בבלוק `@theme`:

```html
<style type="text/tailwindcss">
  @theme {
    --color-brand-500: #7c3aed;
    --color-brand-600: #6d28d9;
  }
</style>
```

השם שאחרי `--color-` הופך לשם צבע. מיד קיימות `bg-brand-500`, `text-brand-500`, `border-brand-600`, `hover:bg-brand-600` ו-`ring-brand-500`. אפשר גם לשנות פונטים (`--font-display`), נקודות שבירה (`--breakpoint-3xl`) ועוד, באותו רעיון. ב-Tailwind v4 ההגדרה הזאת, שמבוססת CSS קודם כול, מחליפה את קובץ `tailwind.config` הישן.

## מעצבים לשני המצבים

- אל תהפכו צבעים סתם. צרפו משטח בהיר למשטח כהה: `bg-white dark:bg-slate-800`.
- שמרו על טקסט קריא: `text-slate-600` על לבן הופך ל-`dark:text-slate-300` על צפחה כהה.
- צבעי מותג לעיתים קרובות עובדים בשני המצבים. בדקו כפתורים וגבולות בכל אחד מהם.
- בדקו את הניגודיות של שתי ערכות הנושא, לא רק של הבהירה.

> **שימו לב:**
> - כותבים מחלקות `dark:` אבל אף פעם לא מוסיפים את הווריאנט המותאם (או את המחלקה `dark` על `html`), ואז תוהים למה הכפתור לא עושה כלום. בהגדרה ברירת המחדל רק הגדרת המערכת קובעת.
> - שמים את הקוד של `@custom-variant` או `@theme` בתג `<style>` רגיל. הוא חייב להיות `<style type="text/tailwindcss">`, אחרת הדפדפן מתייחס אליו כ-CSS רגיל ומתעלם ממנו.
> - שוכחים את התאום הכהה של רקע. מקבלים טקסט כהה על כרטיס כהה, שאי אפשר לקרוא. בכל פעם שמוסיפים `dark:bg-...`, חשבו גם על טקסט וגבולות.
> - טעות בשם הצבע: `--colour-brand-500` (איות בריטי) או `--color-brand500` מגדירים משהו ש-Tailwind לא מכירה, ולכן `bg-brand-500` פשוט לא עושה כלום, בשקט.

## להמשך

הוסיפו `--color-brand-100: #ede9fe;` והשתמשו ב-`bg-brand-100` כרקע הדף במצב בהיר. הוסיפו כלל `dark:hover:bg-brand-500`, או הגדירו פונט עם `--font-display: Georgia, serif;` והשתמשו ב-`font-display` על הכותרת.

> **תורכם:** בתג ה-style הוסיפו את הווריאנט המותאם `dark` ובלוק `@theme` עם `--color-brand-500: #7c3aed;` ו-`--color-brand-600: #6d28d9;`. הוסיפו מחלקות `dark:` ל-body, לכרטיס ולפסקה. תנו לכפתור Start את `bg-brand-500 hover:bg-brand-600`, וגרמו למטפל של המתג לקרוא ל-`classList.toggle("dark")` על אלמנט `html`.
