---
title: "ה-DOM: מציאת אלמנטים ושינויים בהם"
summary: "בחרו אלמנטים בדף ושנו את הטקסט, העיצוב והמחלקות שלהם עם JavaScript."
hints:
  - "הדפדפן הופך את ה-HTML שלכם לאובייקטים שאפשר להגיע אליהם מ-JavaScript. קודם בוחרים אלמנט, ואז משנים אחד מהמאפיינים שלו."
  - "document.querySelector(\"#title\") מוצאת אלמנט אחד, document.querySelectorAll(\".info\") מוצאת את כולם. שנו את הטקסט עם .textContent, את הצבע עם .style.color, והוסיפו מחלקה עם .classList.add(...)."
  - "document.querySelector(\"#title\").textContent = \"Hello, DOM!\";  const infos = document.querySelectorAll(\".info\");  console.log(infos.length);  for (const p of infos) { p.style.color = \"green\"; }  document.querySelector(\"#list li:nth-child(2)\").classList.add(\"highlight\");"
quiz:
  - q: "מה מחזירה document.querySelector(\".info\") ?"
    options: ["כל אלמנט עם המחלקה info", "את האלמנט הראשון עם המחלקה info", "את הטקסט שבתוך .info"]
  - q: "איזה מאפיין משנה את הטקסט שבתוך אלמנט?"
    options: ["textContent", "text", "innerName"]
  - q: "למה בדרך כלל משנים עיצוב על ידי הוספת מחלקה (classList.add) במקום לכתוב הרבה שורות style.x?"
    options: ["JavaScript מחייבת את זה", "זה רץ מהר יותר", "המראה נשאר בקובץ ה-CSS ו-JavaScript רק מדליקה ומכבה אותו"]
  - q: "למה תג ה-script ממוקם בסוף ה-body?"
    options: ["כדי שהאלמנטים כבר יהיו קיימים כשהסקריפט מחפש אותם", "כדי שהדף ייטען בשפה אחרת", "כי אסור לשים סקריפטים ב-head"]
messages:
  - "השתמשו ב-querySelectorAll כדי לבחור כל אלמנט עם המחלקה info."
  - "השתמשו ב-classList.add כדי להוסיף את המחלקה highlight."
---

JavaScript הופכת למרתקת באמת כשהיא יכולה לשנות דף אינטרנט. בשיעור הזה תלמדו איך **למצוא** אלמנטים בדף ו**לשנות** אותם: את הטקסט שלהם, את הצבע שלהם ואת מחלקות ה-CSS שלהם.

## ה-DOM

כשדפדפן טוען את ה-HTML שלכם, הוא בונה בזיכרון עץ של אובייקטים שנקרא **DOM** (Document Object Model). כל תג הופך לאובייקט ש-JavaScript יכולה לקרוא ולשנות. כשמשנים אחד האובייקטים האלה, הדף מתעדכן מיד. האובייקט שמייצג את הדף כולו נקרא `document`.

## שלב 1: בחירת אלמנט

`document.querySelector` מקבלת **סלקטור של CSS** (אותם סלקטורים שהשתמשתם בהם ב-CSS) ומחזירה את האלמנט **הראשון** שמתאים:

```js
const title = document.querySelector("#title");        // by id
const firstInfo = document.querySelector(".info");      // by class
const firstItem = document.querySelector("#list li");   // descendant
```

כדי לקבל **את כל** ההתאמות משתמשים ב-`querySelectorAll`. היא מחזירה רשימה שאפשר לעבור עליה בלולאה:

```js
const infos = document.querySelectorAll(".info");
console.log(infos.length); // prints: 2
for (const p of infos) {
  console.log(p.textContent);
}
```

יש גם את `document.getElementById("title")` הישנה יותר, שעושה אותו דבר כמו `querySelector("#title")` עבור מזהים (id).

## שלב 2: שינוי

ברגע שיש לכם אלמנט ביד, אתם משנים את המאפיינים שלו:

```js
title.textContent = "Hello, DOM!";   // replace the text
title.style.color = "tomato";        // set an inline CSS style
```

- `textContent` הוא הטקסט שבתוך האלמנט.
- `style` מאפשר לקבוע מאפייני CSS ישירות. שמות CSS עם מקפים הופכים ל-camelCase ב-JavaScript: `background-color` הופך ל-`style.backgroundColor`.

## מחלקות טובות יותר מסגנונות

במקום הרבה שורות `style`, הכינו מחלקה ב-CSS ותנו ל-JavaScript להדליק ולכבות אותה:

```js
item.classList.add("highlight");     // add the class
item.classList.remove("highlight");  // take it off
item.classList.toggle("highlight");  // add if missing, remove if present
```

קובץ ה-CSS שומר את כל המראה, ו-JavaScript מחליטה מתי להשתמש בו.

## איפה הסקריפט נמצא?

תג ה-script נמצא ב**סוף ה-body** כדי שכל האלמנטים שמעליו כבר יהיו קיימים כשהקוד רץ. אם הסקריפט היה רץ קודם, `querySelector` הייתה מחזירה `null`, כי הדף עדיין לא נבנה.

## סלקטורים שימושיים

| סלקטור | משמעות |
| --- | --- |
| `"#title"` | האלמנט עם id בשם title |
| `".info"` | אלמנטים עם המחלקה info |
| `"p"` | כל הפסקאות |
| `"#list li"` | אלמנטי li בתוך #list |
| `"li:nth-child(2)"` | li שהוא הילד השני של ההורה שלו |

> **שימו לב:**
> - שכחת ה-`#` או ה-`.` בסלקטור: `querySelector("title")` מחפשת תג `<title>` ולא מוצאת כלום.
> - שימוש בתוצאה כשלא נמצאה התאמה: `querySelector` נותנת `null`, ואז `null.textContent = "x"` נכשלת עם `TypeError: Cannot set properties of null (setting 'textContent')`. בדקו את האיות של הסלקטור.
> - שימוש ב-`style` על רשימה מ-`querySelectorAll`: `infos.style.color = "green"` לא עושה שום דבר מועיל. עברו בלולאה על הפריטים וקבעו את העיצוב על כל אחד.
> - כתיבת `style.background-color`. JavaScript קוראת את זה כחיסור. השתמשו ב-`style.backgroundColor`.
> - הוספת נקודה לשם המחלקה ב-`classList`: `classList.add(".highlight")` שגוי, כתבו `classList.add("highlight")`.
> - הרצת הסקריפט ב-`<head>` לפני שהדף קיים.

## להמשיך הלאה

שנו את הצבע של כל פריט ברשימה בעזרת לולאה. נסו `document.querySelector("#list").innerHTML = "<li>New</li>"` וראו איך `innerHTML` קוראת תגי HTML (השתמשו בה בזהירות, היא יכולה להיות לא בטוחה עם טקסט של משתמשים).

> **תורכם:** עקבו אחרי שלוש ההערות ב-`script.js`: שנו את הכותרת, הדפיסו את מספר הפסקאות `.info` וצבעו אותן בירוק, והוסיפו את המחלקה `highlight` לפריט השני ברשימה.
