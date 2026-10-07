---
title: "רכיבים אינטראקטיביים - מודאל, אקורדיון, תפריט נפתח וטולטיפ"
summary: "מוסיפים חלונות קופצים ופאנלים נפתחים בעזרת מאפייני data-bs, בלי JavaScript משלכם (חוץ משורה אחת לטולטיפים), וגורמים להם להיות נגישים."
hints:
  - "הווידג'טים של Bootstrap מופעלים על ידי מאפיינים: data-bs-toggle אומר איזה סוג של ווידג'ט, data-bs-target אומר איזה אלמנט הוא שולט בו. סקריפט ה-bundle קורא אותם בשבילכם."
  - "במודאל, ה-div החיצוני צריך את modal fade ואת מבנה ה-dialog בתוכו. באקורדיון, העתיקו את פריט 1 ושנו את faq1 ל-faq3 בכל מקום (ה-target של הכפתור, aria-controls, ה-id של הפאנל). בטולטיפים, עברו בלולאה על document.querySelectorAll עם forEach."
  - 'script.js: document.querySelectorAll(''[data-bs-toggle="tooltip"]'').forEach(el => new bootstrap.Tooltip(el)); תפריט נפתח: <div class="dropdown"> עם כפתור class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" ו-<ul class="dropdown-menu"> עם <a class="dropdown-item">.'
messages:
  - "ב-script.js, צרו טולטיפ לכל אלמנט עם new bootstrap.Tooltip(element)."
  - "ב-script.js, השתמשו ב-document.querySelectorAll כדי למצוא כל מפעיל של טולטיפ."
  - 'לכפתור השלישי של האקורדיון צריך aria-controls="faq3".'
quiz:
  - q: "איך גורמים לכפתור לפתוח מודאל?"
    options: ["מוסיפים onclick=modal(termsModal)", 'מוסיפים data-bs-toggle="modal" יחד עם data-bs-target="#termsModal"', "נותנים לכפתור את המחלקה open-modal"]
  - q: "אילו מהווידג'טים האלה חייבים להיות מופעלים בעזרת מעט JavaScript משלכם?"
    options: ["מודאלים", "אקורדיונים", "טולטיפים"]
    explain: "טולטיפים ו-popovers דורשים הפעלה ידנית (opt-in) כי הם תלויים במיקום של Popper; האחרים קוראים את מאפייני ה-data אוטומטית."
  - q: "למה למודאל יש aria-labelledby שמצביע על הכותרת שלו?"
    options: ["כדי שקוראי מסך יכריזו על החלון לפי הכותרת שלו", "כדי לשנות את צבע הכותרת", "כדי שהמודאל ייטען מהר יותר"]
  - q: "מה data-bs-parent=\"#faq\" עושה בפאנל של אקורדיון?"
    options: ["סוגר את כל הדף", "בוחר את צבע הפאנל", "מוודא שרק פאנל אחד באקורדיון הזה פתוח בכל רגע"]
---

תפריטים שנפתחים, חלונות שקופצים ופאנלים שמתרחבים נהגו לדרוש JavaScript מותאם אישית. ב-Bootstrap מתארים את ההתנהגות בעזרת **מאפייני data** (data attributes) ב-HTML, וה-bundle של JavaScript (תג ה-script בסוף ה-body) עושה את השאר. השיעור הזה מראה את ארבעת הווידג'טים הנפוצים ביותר ואת מאפייני הנגישות שהם צריכים.

## איך מאפייני data עובדים

הסקריפט של Bootstrap סורק את הדף בחיפוש מאפיינים שמתחילים ב-`data-bs-`:

- `data-bs-toggle` אומר *איזה סוג* של ווידג'ט: `modal`, `collapse`, `dropdown`, `tooltip`.
- `data-bs-target` אומר *איזה אלמנט* הוא שולט בו, בעזרת בורר CSS כמו `#termsModal`.
- `data-bs-dismiss` על כפתור בתוך ווידג'ט אומר "סגור את זה".

כל זה עובד רק כי ה-bundle נטען. אם ווידג'ט לא עושה כלום, בדקו קודם את הסקריפט הזה.

## תפריט נפתח (Dropdown)

```html
<div class="dropdown">
  <button class="btn btn-outline-secondary dropdown-toggle" type="button"
          data-bs-toggle="dropdown" aria-expanded="false">Account</button>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="#">Profile</a></li>
  </ul>
</div>
```

העוטף `dropdown` ממקם את התפריט. התפריט (`dropdown-menu`) מוסתר כברירת מחדל; כפתור ההפעלה מציג אותו. `aria-expanded` אומר לקוראי מסך אם הוא פתוח, ו-Bootstrap מעדכנת אותו בשבילכם.

## מודאל (Modal)

**מודאל** הוא חלון דיאלוג מעל הדף. המבנה שלו הוא קינון של ארבע שכבות: `modal` (שכבת ההכהיה), `modal-dialog` (ממקם את התיבה), `modal-content` (התיבה הלבנה) ואז `modal-header`, `modal-body` ו-`modal-footer`. הוסיפו `fade` לאפקט של הופעה הדרגתית.

כאן הנגישות חשובה במיוחד:

- `tabindex="-1"` מאפשר לסקריפט להעביר פוקוס לחלון.
- `aria-labelledby="termsTitle"` מצביע על ה-`id` של הכותרת, כך שקוראי מסך יכריזו "Club terms, dialog".
- כפתור הסגירה `btn-close` הוא רק אייקון, ולכן הוא צריך `aria-label="Close"` כדי שיהיה לו שם.

## אקורדיון (Accordion)

אקורדיון הוא ערימה של פאנלים שבה נפתח אחד בכל פעם. לכל `accordion-item` יש כפתור כותרת ופאנל מתקפל. ה-`data-bs-target` וה-`aria-controls` של הכפתור חייבים לציין את ה-`id` של הפאנל. `data-bs-parent="#faq"` על הפאנל אומר "סגור את האחים כשזה נפתח". לפריט הפתוח יש `show` על הפאנל ואין מחלקה `collapsed` על הכפתור שלו; בפריטים סגורים זה הפוך, ו-`aria-expanded` תואם.

הגרסה של פאנל בודד, בלי ה-parent, היא פשוט **collapse**: כל אלמנט עם המחלקה `collapse` אפשר להציג ולהסתיר בעזרת כפתור עם `data-bs-toggle="collapse"`. תפריט ה-navbar שבניתם קודם הוא collapse.

## טולטיפ (Tooltip)

טולטיפ הוא תווית קטנה שמופיעה במעבר עכבר או בפוקוס. הוסיפו `data-bs-toggle="tooltip"` ו-`data-bs-title="..."` לאלמנט. טולטיפים הם היוצא מן הכלל ל"בלי JavaScript": מטעמי ביצועים, Bootstrap מחייבת אתכם להפעיל אותם בעזרת סקריפט קצר:

```js
const triggers = document.querySelectorAll('[data-bs-toggle="tooltip"]');
triggers.forEach((el) => new bootstrap.Tooltip(el));
```

`bootstrap` הוא אובייקט גלובלי שה-bundle יוצר; `bootstrap.Tooltip` היא המחלקה, ו-`new` יוצרת אחד לכל אלמנט. אל תסתמכו על טולטיפ בשביל מידע חיוני, כי למסכי מגע אין מעבר עכבר.

## בודקים בעצמכם

בדיקת השיעור לא יכולה ללחוץ, ולכן היא בודקת את ה-markup שלכם. אתם יכולים ללחוץ על הכול בתצוגה המקדימה, אז נסו: המודאל מופיע בהדרגה, האקורדיון סוגר את הפאנל האחר, התפריט הנפתח נסגר כשלוחצים מחוצה לו.

> **שימו לב:**
> - שוכחים את סקריפט ה-bundle, או טוענים רק את `bootstrap.min.js` (בלי Popper, תפריטים נפתחים וטולטיפים נכשלים). קובץ ה-bundle כולל את Popper.
> - `data-bs-target` שלא תואם ל-id (`#termsModal` מול `termsmodal`). אז הלחיצה לא עושה כלום ובקונסולה עלולה להופיע שגיאה.
> - הצבת ה-markup של המודאל בתוך קונטיינר עם `overflow: hidden` או עם transforms. מקמו מודאלים כילדים ישירים של ה-body או של עוטף פשוט.
> - העתקת פריט אקורדיון תוך השארת ה-ids הישנים. שני פאנלים עם אותו id גורמים לפאנל הלא נכון להיפתח.
> - טולטיפים שאף פעם לא מופיעים כי ה-JavaScript שיוצר אותם רץ לפני שה-bundle נטען. טענו את `script.js` אחרי ה-bundle.

> **תורכם:** בנו את כל ארבעת הווידג'טים. הכינו את התפריט הנפתח (`dropdown`, `dropdown-toggle`, `dropdown-menu`, `dropdown-item`), הוסיפו `data-bs-toggle="tooltip"` ו-`data-bs-title` לכפתור Save draft, חברו את המודאל עם המבנה המלא ומאפייני ה-`aria-` שלו, והוסיפו את פריטי האקורדיון שניים ושלושה (ה-ids `faq2` ו-`faq3`). ב-`script.js`, צרו את הטולטיפים עם `new bootstrap.Tooltip`.
