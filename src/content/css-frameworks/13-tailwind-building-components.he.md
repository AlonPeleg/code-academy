---
title: "Tailwind - בונים סט רכיבים"
summary: "בונים navbar, hero, רשת כרטיסים ו-footer, ולומדים איך מטפלים בחזרתיות, @apply, @utility וערכים שרירותיים."
hints:
  - "ארבע משימות: @apply בתוך @layer components בשביל .btn, מחלקות על ה-hero ועל ה-footer, רשת עם ערך שרירותי בשביל #cards, ולולאה ב-script.js שכותבת את הכרטיסים."
  - "בתוך השכבה כתבו .btn { @apply rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white; }. הרשת היא grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]. ב-JavaScript, courses.forEach((course) => { list.innerHTML += `...${course.title}...`; });"
  - "#cards: class=\"mt-8 grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6\"   #hero: class=\"bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-20 text-center text-white\"   h1: text-4xl font-bold   footer: class=\"border-t border-slate-200 py-8 text-center text-sm text-slate-500\"   כרטיס: class=\"flex min-h-[200px] flex-col justify-between rounded-2xl bg-white p-6 shadow-md\""
messages:
  - "הגדירו את .btn בתוך @layer components עם @apply rounded-lg ... ;"
  - "השתמשו בערך שרירותי עבור העמודות של #cards, כמו grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]."
  - "עברו בלולאה על הקורסים ב-script.js (forEach, map או לולאת for)."
  - "השתמשו בערך השרירותי min-h-[200px] במחלקות של הכרטיס."
quiz:
  - q: "למה class=\"bg-${color}-500\" בתוך מחרוזת תבנית היא רעיון גרוע?"
    options: ["זה ארוך מדי", "Tailwind מחפשת שמות מחלקות שלמים בקוד המקור שלכם, ולכן שם שנבנה בחצי עלול לא לקבל אף פעם את ה-CSS שלו", "מחרוזות תבנית לא יכולות להכיל מרכאות"]
  - q: "מתי @apply היא בחירה טובה?"
    options: ["לכל אלמנט, כדי לשמור על HTML קצר", "אף פעם - היא הוצאה משימוש", "לחתיכה קטנה וחוזרת שאי אפשר להפוך בקלות לרכיב או לתבנית, כמו מחלקת כפתור"]
  - q: "מה w-[320px] עושה?"
    options: ["קובעת רוחב של בדיוק 320 פיקסלים בעזרת ערך שרירותי", "קובעת את הרוחב לצעד ה-320 בסולם", "כלום - סוגריים מרובעים הם הערות"]
  - q: "בפרויקט אמיתי, מהי בדרך כלל הדרך הטובה ביותר להימנע מחזרה על מחרוזת ארוכה של מחלקות כרטיס?"
    options: ["להעתיק ולהדביק, ולתקן טעויות אחר כך", "ליצור רכיב, תבנית או partial לשימוש חוזר ולהשתמש בו שוב", "להעביר את כל המחלקות לגיליון סגנונות ענק אחד"]
---

דפים קטנים הם קלים. לאתר אמיתי יש navbar, hero, רשימות של כרטיסים ו-footer, ואתם תחזרו על תבניות עשרות פעמים. בשיעור הזה תרכיבו דף שלם מארבעה רכיבים ותלמדו את ההרגלים ששומרים על פרויקט Tailwind מסודר: טיפול בחזרתיות, שימוש זהיר ב-`@apply`, הוספת כלים (utilities) משלכם, שימוש בערכים שרירותיים ושמירה על מחרוזות מחלקות קריאות.

## ארבעת הרכיבים

- **Navbar** - `flex items-center justify-between` בתוך קונטיינר ממורכז `max-w-5xl`. נקודת ההתחלה נותנת לכם אותו; שימו לב כמה מעט מחלקות הוא צריך.
- **Hero** - פס צבעוני גדול: רקע מדורג (gradient), ריפוד אנכי נדיב (`py-20`), טקסט ממורכז, פסקה צרה (`mx-auto max-w-xl`).
- **רשת כרטיסים** - `grid` אחד עם `gap`, וכרטיסים זהים בתוכו.
- **Footer** - גבול למעלה, ריפוד, טקסט אפור קטן.

הגרדיאנט של ה-hero הוא `bg-linear-to-r from-violet-600 to-indigo-600`: קודם הכיוון, ואז צבעי ההתחלה והסוף. (ב-v3 זה היה `bg-gradient-to-r`.)

## טיפול בחזרתיות

מחלקות utility יוצרות מחרוזות ארוכות, וכרטיס עם 12 מחלקות שחוזר שש פעמים הוא כאב. התשובה היא **לא** קובץ CSS גדול. התשובה היא לחזור על ה-*markup* ממקום אחד:

- ב-HTML רגיל עם JavaScript, עברו בלולאה על הנתונים וכתבו כל כרטיס מתוך **מחרוזת תבנית** (template string), כמו ב-`script.js`. מחרוזת מחלקות אחת, שנכתבת פעם אחת.
- בפריימוורק (React, Vue, Svelte, Astro), צרו **רכיב** `<Card />`.
- באתר שמרונדר בשרת (Django, Rails, Laravel, Eleventy), השתמשו ב-**partial** או ב-**include** או בלולאה בתבנית.

העתק-הדבק כמה פעמים בדף סטטי קטן הוא בסדר. כשמדביקים בפעם השלישית, חלצו את זה.

## @apply לתבניות זעירות

`@apply` מושכת utilities לתוך מחלקת ה-CSS שלכם. היא נכנסת לתג ה-style מסוג `text/tailwindcss`:

```css
@layer components {
  .btn {
    @apply rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white;
  }
}
```

עכשיו `class="btn"` נותנת את כל חמשת ה-utilities. מכיוון ש-`components` היא שכבה נמוכה יותר מ-`utilities`, utility על האלמנט עדיין מנצח: `btn bg-white text-indigo-700` הוא כפתור לבן. בגלל זה הכפתור ב-hero נראה שונה מהכפתורים בכרטיסים.

**מתי לא להשתמש בה:** אל תעשו `@apply` לכל העיצוב שלכם למחלקות כמו `.card-title-large`. אתם מאבדים את היתרונות של utilities (בלי מתן שמות, בלי מעבר בין קבצים) ובונים מחדש את הבעיה ש-Tailwind פותרת. השתמשו בה רק לדברים קטנים שבאמת חוזרים, כמו כפתור, והעדיפו קודם רכיב או תבנית.

## @utility ל-utilities משלכם

כש-Tailwind לא מספקת utility שאתם צריכים, הגדירו אחד אמיתי עם `@utility`. הוא עובד אוטומטית עם ווריאנטים כמו `hover:` ו-`md:`:

```css
@utility scrollbar-none {
  scrollbar-width: none;
}
```

## ערכים שרירותיים

צריכים ערך שאינו בסולם? שימו אותו בסוגריים מרובעים: `w-[320px]`, `min-h-[200px]`, `bg-[#4f46e5]`, `top-[3px]`. הם גם מטפלים בערכים מורכבים; קווים תחתונים מייצגים רווחים. `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]` יוצרת רשת שמכניסה כמה שיותר עמודות של 16rem שנכנסות, בלי נקודות שבירה בכלל. השתמשו בערכים שרירותיים במשורה: אם אתם כותבים `p-[17px]` הרבה, חסר בעיצוב שלכם צעד בסולם.

## מחרוזות מחלקות קריאות

סדר עקבי עוזר לסרוק: פריסה (`flex`, `grid`), קופסה (`p-6`, `max-w-5xl`), טיפוגרפיה (`text-lg font-bold`), צבעים (`bg-white text-slate-600`), ואז מצבים ונקודות שבירה (`hover:`, `md:`). הרבה צוותים מתקינים את התוסף הרשמי של Prettier, שממיין מחלקות בשבילכם אוטומטית. באלמנטים ארוכים, פצלו את מאפיין ה-class על פני כמה שורות.

> **שימו לב:**
> - בונים שמות של מחלקות מחלקים, למשל `"bg-" + color + "-500"` או <code>text-${size}</code>. Tailwind מוצאת מחלקות בסריקת קוד המקור שלכם לחיפוש שמות שלמים. build לפרודקשן לא ייצור CSS לשמות שהוא אף פעם לא רואה כתובים במלואם. כתבו את השם כולו (<code>bg-red-500</code>) ובחרו בין שמות מלאים בקוד שלכם. <!-- validator-compat: ` ` ` ` `. Tailwind finds classes by scanning your source for complete names. A production build will not generate CSS for names it never sees written out. Write the whole name (` -->
> - בקשר לזה: ב-build לפרודקשן קיימות רק המחלקות שנמצאו בקבצים שלכם. אם מחלקה עובדת בתצוגה המקדימה אבל נעלמת אחרי ה-build, ה-build לא סורק את הקובץ הזה.
> - שימוש מוגזם ב-`@apply` ויצירה מחדש של גיליון סגנונות רגיל. השתמשו קודם ברכיבים.
> - שמים רווח בתוך ערך שרירותי: `grid-cols-[repeat(3, 1fr)]` שובר את המחלקה. השתמשו ב-`_` במקום רווחים, או השמיטו אותם.
> - הוספה ל-`innerHTML` עם `+=` בתוך לולאה גדולה היא בסדר לרשימות זעירות, אבל בגדולות בנו קודם את המחרוזת המלאה והשמו אותה פעם אחת.

> **תורכם:** סיימו את הדף. צרו את `.btn` עם `@apply` בתוך `@layer components`; עצבו את ה-hero (גרדיאנט, `py-20`, ממורכז, טקסט לבן, כותרת `text-4xl`); הפכו את `#cards` לרשת `gap-6` עם `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]` שרירותי; עצבו את ה-footer; וב-`script.js` עברו בלולאה על `courses` כדי לכתוב כרטיס אחד לכל קורס, עם `min-h-[200px]` ושמות מחלקות מלאים.
