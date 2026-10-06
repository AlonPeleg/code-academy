---
title: "טיפוגרפיה, צבעים ומחלקות עזר"
summary: "עצבו טקסט, צבעים, רווחים, שורות flex, מסגרות וצללים עם מחלקות העזר של Bootstrap, ולמדו לקרוא את השמות שלהן."
hints:
  - "קראו כל id בהערה ותרגמו אותו לשמות מחלקות: משפחת bg- מיועדת לרקעים, text- לצבעים וליישור, p- לריפוד, ו-d-flex ו-justify-content- לשורות flex."
  - 'הבאנר צריך bg-dark, text-white, p-5, rounded-3 ו-shadow. שורת הפעולות צריכה d-flex, justify-content-between ו-align-items-center. הקישור צריך btn, btn-light ו-btn-lg.'
  - 'באנר: class="bg-dark text-white p-5 rounded-3 shadow". Kicker: class="text-uppercase fw-bold text-info mb-2". כותרת: class="display-5 fw-bold mb-3". הקדמה: class="lead text-white-50". פעולות: class="d-flex justify-content-between align-items-center mt-4". תאריך: class="border border-light rounded-pill px-3 py-2". קישור: class="btn btn-light btn-lg".'
quiz:
  - q: "מה פירוש mt-3?"
    options: ["שוליים בכל ארבעת הצדדים, גודל 3", "margin-top, גודל 3 (1rem)", "טבלה עם 3 שורות"]
    explain: "m = margin, t = top, 3 = הצעד השלישי בסולם הרווחים, שהוא 1rem."
  - q: "מה px-4 מוסיפה?"
    options: ["ריפוד משמאל ומימין", "ריפוד למעלה ולמטה", "ריפוד למעלה בלבד"]
  - q: "אילו מחלקות יוצרות שורה שהפריטים בה יושבים בקצה השמאלי הרחוק ובקצה הימני הרחוק?"
    options: ["text-flex between", "display-flex space", "d-flex justify-content-between"]
  - q: "מה עושה  d-none d-md-block  ?"
    options: ["מציגה את האלמנט רק בטלפונים", "מסתירה אותו במסכים קטנים ומציגה אותו מנקודת השבירה md ומעלה", "מסתירה אותו בכל מקום"]
    explain: "d-none מסתירה אותו כברירת מחדל; d-md-block מחזירה אותו מ-768px."
messages:
  - "הוסיפו את המחלקה shadow לבאנר."
  - "תנו לכותרת את המחלקה display-5."
  - "תנו לפסקת ההקדמה את המחלקה lead."
  - "תנו להקדמה את הצבע text-white-50."
  - "תנו לתאריך את המחלקה rounded-pill."
  - "הפכו את קישור ההרשמה לכפתור גדול עם btn-lg."
---

רכיבים כמו כרטיסים (cards) נוחים, אבל רוב הזמן מכווננים דף בעזרת **מחלקות עזר** (utility classes): מחלקות זעירות שכל אחת עושה בדיוק עבודה אחת. ברגע שאתם יכולים לקרוא את השמות שלהן, אפשר לעצב כמעט הכול בלי לפתוח קובץ CSS.

## קריאת השמות

רוב מחלקות העזר עוקבות אחרי דפוס: **תכונה, צד, גודל**. מחלקות הרווחים הן הדוגמה הטובה ביותר.

- `m` הוא margin (שוליים), `p` הוא padding (ריפוד).
- הצד בא אחר כך: `t` למעלה, `b` למטה, `s` התחלה (שמאל בשפות משמאל לימין), `e` סוף (ימין), `x` שמאל וימין, `y` למעלה ולמטה. בלי אות פירושו כל הצדדים.
- הגודל הוא מספר מ-`0` עד `5` (או `auto` לשוליים).

כך ש-`mt-3` היא "שוליים למעלה, צעד 3", `px-4` היא "ריפוד שמאל וימין, צעד 4" ו-`p-5` היא "ריפוד בכל הצדדים, צעד 5". הסולם בנוי על `1rem` (בדרך כלל 16px):

| מספר | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| גודל | 0 | 0.25rem | 0.5rem | 1rem | 1.5rem | 3rem |

הוסיפו נקודת שבירה כדי לשנות את הערך במסכים גדולים יותר: `p-2 p-md-5` פירושו ריפוד קטן בטלפונים וריפוד גדול מ-`md` ומעלה. `gap-3` מרווחת את הילדים של מיכל flex או grid.

## טקסט וצבע

- גודל ועובי: `fs-1` (הגדול ביותר) עד `fs-6`, `fw-bold`, `fw-light`, `fst-italic`, `small`.
- כותרות גדולות: `display-1` עד `display-6` יוצרות כותרות דקות ענקיות לאזורי hero. `lead` מגדילה פסקת הקדמה.
- יישור ואותיות: `text-start`, `text-center`, `text-end`, `text-uppercase`.
- צבעי טקסט: `text-primary`, `text-success`, `text-danger`, `text-white`, `text-white-50`, `text-body-secondary` (אפור עמום).
- רקעים: `bg-primary`, `bg-dark`, `bg-light`, `bg-success-subtle`.
- קיצור דרך שקובע רקע וצבע טקסט קריא יחד: `text-bg-primary`, `text-bg-warning`.

שמות הצבעים זהים בכל מקום: primary (כחול), secondary (אפור), success (ירוק), danger (אדום), warning (צהוב), info (תכלת), light ו-dark.

## עזרי תצוגה ו-flex

`d-block`, `d-inline`, `d-none` ו-`d-flex` קובעות את ערך ה-display, וגרסאות כמו `d-md-none` עובדות בנקודות שבירה. אחרי שאלמנט הוא `d-flex`, הוסיפו:

- `flex-row` או `flex-column` לכיוון,
- `justify-content-start | center | end | between | around` לציר הראשי,
- `align-items-start | center | end` לציר המשני,
- `flex-wrap` ו-`gap-*` לגלישה ולרווחים.

## מסגרות, פינות וצללים

`border` מוסיפה מסגרת, `border-0` מסירה אותה, `border-primary` או `border-2` משנות צבע ועובי. `rounded` מעגלת פינות; `rounded-3` מעגלת יותר, ו-`rounded-pill` ו-`rounded-circle` יוצרות קפסולות ועיגולים. `shadow-sm`, `shadow` ו-`shadow-lg` נותנות צל קטן, בינוני או גדול.

## למה מחלקות עזר שימושיות (ומה המגבלה שלהן)

מחלקות עזר מהירות, עקביות ולא צריכות CSS חדש. המגבלה היא קריאות: רשימת מחלקות ארוכה נעשית רועשת. כשחוזרים על אותן עשר מחלקות פעמים רבות, צרו רכיב קטן משלכם (מחלקה ב-`style.css`) או תבנית לשימוש חוזר.

> **שימו לב:**
> - שילוב של מחלקת עזר עם CSS משלכם ותהייה מדוע הכלל שלכם מפסיד. הרבה מחלקות עזר משתמשות ב-`!important`, ולכן הן מנצחות כללים רגילים. הסירו את מחלקת העזר או הגדילו את הספציפיות של הכלל שלכם.
> - כתיבת `d-flex` ואז שכחה ש-`justify-content-*` ו-`align-items-*` משפיעות רק על הילדים הישירים.
> - שימוש ב-`text-white` על רקע בהיר. בדקו ניגודיות: טקסט חיוור על רקע חיוור אינו קריא.
> - המצאת גדלים כמו `mt-6`. הסולם נעצר ב-5.
> - שימוש ב-`ms-` וב-`me-` וציפייה לשמאל ולימין בכל השפות. הם פירושם התחלה וסוף, והם מתהפכים בשפות מימין לשמאל.

> **תורכם:** עצבו את הבאנר. תנו לכל אלמנט את המחלקות שמופיעות בהערה: רקע כהה, טקסט לבן, ריפוד `p-5`, `rounded-3` ו-`shadow` על `#banner`; `text-info` מודגש באותיות גדולות על `#kicker`; `display-5 fw-bold` על `#title`; `lead text-white-50` על `#intro`; שורת `d-flex` עם `justify-content-between align-items-center` על `#actions`; מסגרת `rounded-pill` על `#date`; ו-`btn btn-light btn-lg` על `#signup`.
