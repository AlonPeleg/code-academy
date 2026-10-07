---
title: "Tailwind - עיצוב רספונסיבי ווריאנטים של מצב"
summary: "משתמשים בקידומות sm:, md: ו-lg: כדי להתאים לגודל המסך, וב-hover:, focus:, group-hover: ו-disabled: כדי להגיב למשתמש."
hints:
  - "שלושה רעיונות: קידומת לפני מחלקה פירושה 'רק כשזה נכון'. קידומות של נקודות שבירה (sm: md: lg:) פירושן 'ברוחב הזה ומעלה'. קידומות של מצב (hover: focus: active: disabled:) פירושן 'בזמן שהמשתמש עושה את זה'. group-hover: דורש את המחלקה group על הורה."
  - "קישור: transition duration-300 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-2 focus:outline-indigo-600. כרטיס: group transition duration-300 hover:shadow-lg. ריבוע: transition duration-300 group-hover:bg-indigo-600. רשת: sm:grid-cols-2 lg:grid-cols-3. כותרת: md:text-5xl. כפתור: disabled:opacity-50 disabled:cursor-not-allowed."
  - "<div id=\"features\" class=\"... grid-cols-1 gap-4 ... sm:grid-cols-2 lg:grid-cols-3\">   <article class=\"group rounded-xl bg-white p-6 shadow-sm transition duration-300 hover:shadow-lg\">   <div class=\"size-10 rounded-lg bg-indigo-100 transition duration-300 group-hover:bg-indigo-600\">   <button disabled class=\"... disabled:cursor-not-allowed disabled:opacity-50\">"
messages:
  - "הוסיפו את sm:grid-cols-2 לרשת של #features."
  - "הוסיפו את lg:grid-cols-3 לרשת של #features."
  - "הוסיפו את md:text-5xl ל-h1."
  - "השתמשו במחלקה hover:bg-... על קישור ההרשמה (Sign up)."
  - "השתמשו במחלקה active:bg-... על קישור ההרשמה (Sign up)."
  - "השתמשו במחלקה focus:outline-... על קישור ההרשמה (Sign up)."
  - "השתמשו ב-hover:shadow-lg על הכרטיסים."
  - "השתמשו ב-group-hover:bg-indigo-600 (או בגוון אחר) על הריבועים הקטנים."
quiz:
  - q: "מה md:text-5xl אומר?"
    options: ["להשתמש ב-text-5xl רק במסכים בינוניים", "להשתמש ב-text-5xl בנקודת השבירה md וברוחבים גדולים ממנה", "להשתמש ב-text-5xl במסכים עד md"]
    explain: "קידומות של נקודות שבירה הן כללי min-width, ולכן הן חלות מהרוחב הזה ומעלה."
  - q: "Tailwind היא mobile-first. מה זה אומר על מחלקה בלי קידומת, כמו grid-cols-1?"
    options: ["היא חלה בכל גודל מסך עד שקידומת גדולה יותר דורסת אותה", "היא חלה רק בטלפונים", "מתעלמים ממנה"]
  - q: "מה צריך להתקיים כדי ש-group-hover:bg-indigo-600 יעבוד?"
    options: ["האלמנט עצמו חייב להיות במעבר עכבר", "הדף חייב להשתמש במצב כהה", "לאחד מאבות הקדמונים של האלמנט חייבת להיות המחלקה group"]
  - q: "איזו מחלקה מעצבת כפתור שיש לו את המאפיין disabled?"
    options: ["disabled:opacity-50", "off:opacity-50", "button-disabled:opacity-50"]
---

דף שנראה טוב רק במקום אחד אינו גמור. אנשים פותחים את הדף שלכם בטלפונים, במחשבים ניידים ובטלוויזיות, והם מצפים שכפתורים יגיבו כשמצביעים עליהם. ב-Tailwind שני הצרכים נענים באותו תכסיס: **קידומת** (prefix) לפני מחלקה. `md:text-5xl` אומר "השתמש ב-`text-5xl`, אבל רק מנקודת השבירה הבינונית ומעלה". `hover:bg-indigo-500` אומר "השתמש ברקע הזה, אבל רק בזמן שהעכבר מעליו".

## Mobile first ונקודות שבירה

Tailwind היא **mobile first** (קודם נייד). מחלקה בלי קידומת חלה בכל גודל מסך. מחלקה עם קידומת חלה מנקודת השבירה שלה **ומעלה**. לכן מעצבים קודם את הפריסה לטלפון, ואז מוסיפים שינויים למסכים גדולים יותר.

| קידומת | חלה מ- | מכשיר טיפוסי |
| --- | --- | --- |
| (ללא) | 0 | טלפונים |
| `sm:` | 40rem (640px) | טלפונים גדולים |
| `md:` | 48rem (768px) | טאבלטים |
| `lg:` | 64rem (1024px) | מחשבים ניידים |
| `xl:` | 80rem (1280px) | מחשבים שולחניים |

למשל, הרשת הזאת היא עמודה אחת בטלפונים, שתיים מ-`sm`, ושלוש מ-`lg`:

```html
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"> ... </div>
```

אל תחשבו על `sm:` כ"מסכים קטנים בלבד". זה רוחב מינימלי. כדי לעצב מסכים קטנים, השתמשו במחלקה הרגילה. ודאו שב-`<head>` שלכם יש את תג ה-meta של viewport, אחרת טלפונים מעמידים פני רחבים ומתעלמים מכל זה.

## ווריאנטים של מצב

ווריאנטים של אינטראקציית משתמש עובדים באותו אופן:

- `hover:` בזמן שהמצביע מעל האלמנט.
- `focus:` בזמן שיש לו פוקוס מהמקלדת (קישורים, כפתורים, שדות קלט). תמיד תנו לדברים שאפשר להתמקד בהם סגנון פוקוס גלוי.
- `active:` בזמן שלוחצים עליו.
- `disabled:` כשיש לו את המאפיין `disabled`.
- `group-hover:` מוסבר בהמשך.

אפשר לערום ווריאנטים: `md:hover:bg-indigo-700` חל רק בטאבלטים וברחבים יותר, בזמן מעבר עכבר.

## שינויים חלקים עם כלי transition

בלי transition, שינויי hover קופצים. הוסיפו `transition` כדי להנפיש שינויים בצבע, בצל ובהזזה, ו-`duration-300` כדי שזה ייקח 300 מילישניות. `ease-in-out` משנה את עקומת המהירות ו-`delay-100` ממתינה קודם. שימו את אלה על המצב **הרגיל**, לא מאחורי `hover:`.

## Group hover

לפעמים מעבר עכבר על הורה צריך לשנות ילד. סמנו את ההורה ב-`group` והוסיפו לפני המחלקה של הילד את הקידומת `group-hover:`:

```html
<article class="group ...">
  <div class="bg-indigo-100 group-hover:bg-indigo-600"></div>
</article>
```

עכשיו מעבר עכבר בכל מקום על הכרטיס הופך את הריבוע לצבע מלא.

## בודקים

גררו את חלונית התצוגה המקדימה לצר יותר ולרחב יותר וצפו ברשת משנה עמודות. בדיקת השיעור לא יכולה לשנות את גודל החלון או להזיז עכבר, ולכן היא קוראת את שמות המחלקות שלכם בחיפוש אחר הקידומות, ומודדת מה שהיא יכולה, כמו משך ה-transition והשקיפות של הכפתור המושבת.

> **שימו לב:**
> - הקידומת מופרדת בנקודתיים בלי רווחים: `md:flex`. `md :flex` או `md-flex` לא עושים כלום.
> - משתמשים ב-`sm:` לעיצוב טלפונים. מחלקות בלי קידומת הן לטלפונים; `sm:` מתחילה ב-640px.
> - `group-hover:` בלי מחלקה `group` על הורה. שום דבר לא קורה, ואין שגיאה.
> - מסתמכים על hover בשביל משהו חשוב. למסכי מגע אין hover, ולכן לעולם אל תסתירו מאחוריו מידע חיוני.
> - שמים `transition` רק על מצב ה-hover. הוסיפו אותו למצב הרגיל כדי שההנפשה תופעל גם כשהעכבר עוזב.

## להמשך

הוסיפו `hover:-translate-y-1` לכרטיסים כדי שיתרוממו. הוסיפו `xl:grid-cols-4`. נסו את `focus-visible:outline-2` ולחצו Tab כדי לנוע בדף.

> **תורכם:** שדרגו את נקודת ההתחלה. קישור ההרשמה: `transition duration-300 hover:bg-indigo-500 active:bg-indigo-700 focus:outline-2 focus:outline-indigo-600`. כותרת: `md:text-5xl`. כפתור: `disabled:opacity-50 disabled:cursor-not-allowed`. רשת: `sm:grid-cols-2 lg:grid-cols-3`. כל כרטיס: `group transition duration-300 hover:shadow-lg`, וכל ריבוע `group-hover:bg-indigo-600`.
