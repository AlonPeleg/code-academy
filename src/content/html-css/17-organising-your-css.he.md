---
title: "ארגון ה-CSS שלכם"
summary: "שומרים על גיליון סגנונות שגדל כך שיישאר ניתן לתחזוקה, עם design tokens, שמות BEM, רכיבים לשימוש חוזר וסלקטורים בעלי ספציפיות נמוכה."
hints:
  - "עבדו מתחתית הקסקדה כלפי מעלה: קודם צרו את ה-tokens ב-tokens.css, ואז השתמשו בהם ב-components.css. modifier הוא מחלקה שנייה (כמו card--featured) שמשנה רק את מה שונה."
  - "הצהירו על שלושת המשתנים בתוך :root ב-tokens.css וקראו אותם עם var(). החליפו את הסלקטור הארוך main.page article.card h2.card__title ב-.card__title. מחקו את דגל ה-important, ואז הוסיפו כללי .card--featured ו-.btn--primary (ה-modifier בא אחרי כלל הבסיס)."
  - "tokens.css: :root { --color-brand: #6d5efc; --color-text: #1f2937; --radius: 8px; }   components.css: .card__title { color: var(--color-text); font-weight: 600; }   .card--featured { border-color: var(--color-brand); }   .btn--primary { background: var(--color-brand); color: #fff; }"
messages:
  - "ב-css/tokens.css הצהירו על --color-brand, על --color-text ועל --radius בתוך כלל :root אחד."
  - "השתמשו ב-var(--color-brand) ב-components.css במקום הצבע שהועתק."
  - "השתמשו ב-var(--radius) לפינות המעוגלות."
  - "כתבו כלל .card__title פשוט (בלי main, article או h2 לפניו)."
  - "הוסיפו כלל modifier של .card--featured."
  - "הוסיפו כלל modifier של .btn--primary."
  - "הסירו את הטריק של important. תקנו את הבעיה עם סלקטור פשוט יותר והסדר הנכון במקום."
quiz:
  - q: "בשם BEM card__title--large, איזה חלק הוא ה-block?"
    options: ["card", "title", "large"]
    explain: "Block = הרכיב (card). Element = חלק ממנו (__title). Modifier = וריאציה (--large)."
  - q: "למה main.page article.card h2.card__title הוא בעיה?"
    options: ["זה CSS לא תקין", "קשה לדרוס אותו בהמשך כי הספציפיות שלו גבוהה, והוא קושר את הסגנון למבנה ה-HTML", "דפדפנים מתעלמים מסלקטורים עם יותר משני חלקים", "הוא גורם לעמוד להיטען לאט יותר מכל סלקטור אחר"]
  - q: "איפה modifier כמו .btn--primary צריך להופיע ביחס ל-.btn?"
    options: ["לפני .btn, כך שהבסיס מנצח", "בקובץ אחר שנטען קודם", "אחרי .btn, כך שהוא מנצח כששני הכללים בעלי ספציפיות שווה"]
    explain: "כשהספציפיות שווה הכלל המאוחר מנצח, ולכן שמרו כללי בסיס קודם ו-modifiers אחריהם."
  - q: "מהו design token ב-CSS?"
    options: ["מפתח סודי לגיליון הסגנונות", "ערך עם שם, בדרך כלל custom property כמו --color-brand, שמשותף לכל האתר", "קובץ שמחזיק את כל ה-media queries", "מילת מפתח שמורה כמו auto"]
---

גיליון סגנונות קל לקריאה כשיש בו עשרים כללים. כשיש בו אלפיים, ושלושה אנשים עורכים אותו, שינויים קטנים מתחילים לשבור עמודים לא קשורים. השיעור הזה נותן לכם את ההרגלים שאנשי מקצוע משתמשים בהם כדי לשמור על CSS רגוע: ערכים משותפים, שמות ברורים, רכיבים לשימוש חוזר וסלקטורים פשוטים.

## מפצלים לפי מטרה

שימו דברים בקבצים לפי מה שהם עושים, ואז קשרו אותם בסדר הגיוני. פרויקט קטן יכול להיראות כך:

```
css/
  tokens.css       variables only
  base.css         body, headings, links
  components.css   .card, .btn, .nav ...
  pages.css        rules for one specific page
```

כל קובץ ב-HTML בא אחרי זה שהוא תלוי בו, ולכן ה-tokens באים ראשונים. פרויקטים אמיתיים לעתים קרובות מדביקים קבצים יחד עם כלי build, אבל קישור של כמה תגי `<link>` עובד מצוין ללמידה.

## Design tokens: מקור אמת אחד

**design token** הוא ערך עם שם שכל האתר חולק. ב-CSS הם custom properties (הכרתם אותם בשיעור על ערכות נושא):

```css
:root {
  --color-brand: #6d5efc;
  --color-text: #1f2937;
  --radius: 8px;
}
```

רכיבים אומרים אז `border-radius: var(--radius)` במקום להעתיק את `8px` לכל מקום. שינוי מיתוג הופך לשינוי של שורה אחת.

## מתן שמות עם BEM

כשהרבה אנשים נותנים שמות בחופשיות מקבלים `.box2`, `.blue-thing` ו-`.title`. **BEM** (Block, Element, Modifier) היא מוסכמת מתן שמות שגורמת לכל מחלקה לספר לכם מה היא:

| חלק | תבנית | דוגמה |
| --- | --- | --- |
| Block | הרכיב | `.card` |
| Element | חלק מה-block, עם שני קווים תחתונים | `.card__title` |
| Modifier | וריאציה, עם שני מקפים | `.card--featured` |

למה להתאמץ? השם אומר לאן המחלקה שייכת, ולכן `.title` פשוט לא יכול להתנגש ב-`.title` של רכיב אחר. ומכיוון שכל מחלקה היא שם שטוח אחד, שום דבר לא תלוי בקינון ה-HTML.

## רכיבים עם modifiers

**רכיב** (component) הוא חתיכת ממשק לשימוש חוזר. מחלקת הבסיס מחזיקה את מה שתמיד נכון; modifiers מחזיקים רק את ההבדל. ב-HTML משתמשים בשתי המחלקות יחד:

```html
<a class="btn btn--primary" href="#">Choose</a>
```

```css
.btn {
  border: 2px solid var(--color-brand);
  color: var(--color-brand);
}

.btn--primary {          /* after .btn: same specificity, later wins */
  background: var(--color-brand);
  color: #ffffff;
}
```

## שומרים על ספציפיות נמוכה

**ספציפיות** (specificity) קובעת איזה כלל מנצח כשכמה מתאימים לאותו אלמנט. מזהים (IDs) מנצחים מחלקות, מחלקות מנצחות תגים, ו-`!important` מנצח כמעט הכול. סלקטור כמו `main.page article.card h2.card__title` מקבל ציון גבוה, ולכן כדי לשנות אותו בהמשך צריך משהו אפילו גבוה יותר. התוצאה הרגילה היא מרוץ חימוש שמסתיים ב-`!important` בכל מקום.

התרופה פשוטה: עצבו עם **מחלקה אחת לכל כלל**, ותנו לסדר הכללים לעשות את השאר. אם חייבים להעלות עדיפות, הוסיפו את מחלקת ה-modifier במקום סלקטור ארוך יותר.

## שכבות קסקדה, בקצרה

כשסדר הקבצים לא מספיק, `@layer` נותן להצהיר על הסדר של קבוצות שלמות של כללים:

```css
@layer base, components, utilities;

@layer components {
  .btn { padding: 8px 16px; }
}
```

כללים בשכבה מאוחרת יותר מנצחים כללים בשכבה מוקדמת יותר *בלי קשר לספציפיות*. זה עוצמתי, וזה גם משהו ללמוד אחרי שאתם נוחים עם היסודות שלמעלה.

> **שימו לב:**
> - משתמשים ב-`!important` כדי לנצח במאבק. זה עובד פעם אחת, ואז צריך עוד `!important` כדי לנצח אותו. הורידו את הספציפיות של הכללים במקום.
> - קינון של שמות BEM כמו `.card__body__title`. אלמנטים שייכים ל-block, לא לאלמנטים אחרים: השתמשו ב-`.card__title`.
> - שמים את ה-modifier לפני כלל הבסיס בקובץ. אז הבסיס דורס אותו וה-modifier "לא עושה כלום".
> - משתמשים ב-modifier בלי מחלקת הבסיס (`class="btn--primary"`). הכפתור מאבד את הסגנונות המשותפים. תמיד כתבו את שתיהן.
> - שוכחים סוגר, כמו ב-`var(--color-brand;`. ההצהרה כולה הופכת לבלתי תקינה והדפדפן מתעלם ממנה בשקט, ולכן בדקו את חלונית ה-Styles ב-DevTools כשצבע נעלם.

## להמשך

הוסיפו modifier בשם `.card--compact` שמקטין את ה-padding, ואז `.btn--small`. שימו לב שנגעתם רק ב-CSS, אף פעם לא במבנה של הרכיבים.

> **תורכם:** ב-`css/tokens.css` הצהירו על `--color-brand` (`#6d5efc`), על `--color-text` (`#1f2937`) ועל `--radius` (`8px`) על `:root`. ב-`css/components.css` השתמשו בהם עם `var()`, החליפו את סלקטור הכותרת הארוך בכלל `.card__title` פשוט (font-weight של `600`), מחקו את ה-`!important`, והוסיפו את ה-modifiers‏ `.card--featured` (צבע מסגרת של המותג) ו-`.btn--primary` (רקע של המותג, טקסט לבן) אחרי כללי הבסיס שלהם.
