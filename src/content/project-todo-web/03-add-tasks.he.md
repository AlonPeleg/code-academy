---
title: "שלב 3: הוספת משימות עם JavaScript"
summary: "מאזינים לשליחת הטופס ויוצרים פריטי רשימה חדשים בדף בעזרת ה-DOM."
hints:
  - "יש כאן שתי משימות: (1) פונקציה addTask(text) שבונה פריט רשימה ומוסיפה אותו לרשימה, (2) מאזין לאירוע submit של הטופס שקורא את התוכן מהשדה וקורא ל-addTask."
  - "בנו את הפריט עם document.createElement('li'), קבעו li.textContent = text ואז list.append(li). במאזין, התחילו עם event.preventDefault(), אחר כך קראו את input.value.trim() וצאו מהפונקציה מוקדם (return) אם המחרוזת ריקה."
  - "function addTask(text) { const li = document.createElement('li'); li.textContent = text; list.append(li); }   form.addEventListener('submit', function (event) { event.preventDefault(); const text = input.value.trim(); if (text === '') return; addTask(text); input.value = ''; input.focus(); });"
quiz:
  - q: "למה קוראים ל-event.preventDefault() בטיפול באירוע submit?"
    options:
      - "כדי שהכפתור יהפוך לכחול"
      - "כדי למחוק את שדה הקלט"
      - "כדי למנוע מהדפדפן לשלוח את הטופס ולטעון מחדש את הדף"
  - q: "למה li.textContent = text בטוח יותר מ-li.innerHTML = text עבור קלט של משתמש?"
    options:
      - "textContent מתייחס לטקסט כטקסט רגיל, ולכן HTML או סקריפטים שהמשתמש הקליד לא יופעלו"
      - "innerHTML לא קיים בדפדפנים"
      - "textContent תמיד מהיר יותר להקלדה"
    explain: "הכנסת קלט של משתמש ל-innerHTML היא פרצת אבטחה קלאסית שנקראת cross-site scripting (או בקיצור XSS)."
  - q: "מה מחזיר document.querySelector('#task-list')?"
    options:
      - "את כל האלמנטים בדף"
      - "את האלמנט הראשון שמתאים לסלקטור, או null אם אין כזה"
      - "עותק של טקסט ה-HTML"
messages:
  - "צרו את פריט הרשימה עם document.createElement('li')."
  - "האזינו לאירוע submit של הטופס עם addEventListener('submit', ...)."
  - "קראו ל-event.preventDefault() כדי שהדף לא ייטען מחדש."
  - "השתמשו ב-.trim() כדי שמשימה שמורכבת מרווחים בלבד תתעלם."
  - "רוקנו את שדה הקלט אחרי ההוספה: input.value = '';"
  - "מחקו את פריט הרשימה הסטטי Placeholder task מהקובץ index.html."
---
עד עכשיו הדף היה רק ציור. בשלב הזה הוא מתעורר לחיים: מקלידים משימה, לוחצים על **Add** ושורה חדשה מופיעה. זו המיומנות המרכזית בפיתוח צד לקוח (front-end), שינוי הדף מתוך JavaScript, וכל מה שאחרי השלב הזה נשען עליה.

## איפה אנחנו עומדים

מבנה הדף מוכן (שלב 1) והוא נראה טוב (שלב 2). כפתור ה-Add טוען מחדש את הדף, והרשימה מכילה פריט זמני סטטי.

## מה נוסיף, ולמה זה חשוב

הדפדפן מחזיק עץ חי של כל מה שמופיע בדף, שנקרא **DOM** (Document Object Model). JavaScript יכולה לקרוא את העץ הזה ולשנות אותו, והדף מתעדכן מיד. אפליקציות אמיתיות עושות בדיוק את זה: הן מגיבות ל**אירועים** (events), כמו לחיצה, הקשה על מקש או שליחת טופס, ומעדכנות את ה-DOM.

## הדרכה צעד אחר צעד

**1. מוצאים את האלמנטים פעם אחת.** `document.querySelector` מקבלת סלקטור של CSS ומחזירה את האלמנט הראשון שמתאים. שומרים את התוצאות בקבועים בראש הקובץ, כדי ששאר הקוד יוכל להשתמש בהם:

```js
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
```

הסימן `#` פירושו "האלמנט עם ה-id הזה", בדיוק כמו ב-CSS. אם שגיתם באיות ה-id תקבלו `null`, והשורה הראשונה שמשתמשת בו תזרוק שגיאה.

**2. כותבים פונקציה (function) שיוצרת משימה אחת.** יצירת אלמנט חדש כוללת שלוש פעולות: יוצרים אותו, ממלאים אותו, ומחברים אותו לדף.

```js
function addTask(text) {
  const li = document.createElement('li'); // 1. create, not yet on the page
  li.textContent = text;                   // 2. fill with plain text
  list.append(li);                         // 3. attach at the end of the list
}
```

אנחנו משתמשים ב-`textContent` ולא ב-`innerHTML` במכוון. `textContent` מציג בדיוק את מה שהמשתמש הקליד. עם `innerHTML` גולש יכול להקליד `<img src=x onerror=...>` ולהריץ קוד בדף שלכם.

**3. מגיבים לטופס.** `addEventListener` מקבלת שם של אירוע ופונקציה שרצה בכל פעם שהוא מתרחש:

```js
form.addEventListener('submit', function (event) {
  event.preventDefault();
  const text = input.value.trim();
  if (text === '') return;
  addTask(text);
  input.value = '';
  input.focus();
});
```

שורה אחר שורה:

- `event.preventDefault()` מבטלת את פעולת ברירת המחדל של הדפדפן, שבמקרה של טופס היא שליחת הנתונים וטעינה מחדש. בלעדיה המשימה החדשה תהבהב ותיעלם.
- `input.value` הוא מה שהוקלד בתיבה. `.trim()` חותכת רווחים משני הקצוות, כך ש-`"   "` הופך ל-`""`.
- `if (text === '') return;` היא **יציאה מוקדמת** (early return): עוצרים כאן אם הקלט ריק. כך שאר הפונקציה נשארת פשוטה.
- אחרי ההוספה אנחנו מרוקנים את התיבה ומחזירים אליה את הסמן עם `input.focus()`, כדי שאפשר יהיה להקליד הרבה משימות במהירות.

**4. שורות הדגמה.** הבודק לא יכול להקליד או ללחוץ, ולכן השורות האחרונות קוראות בעצמן ל-`addTask('Buy milk')` ול-`addTask('Read a chapter')` כשהדף נטען. אתם עדיין יכולים להקליד משימות משלכם. הטריק הזה, קריאה לפונקציה שלכם עם נתוני דוגמה, הוא גם הדרך שבה מפתחים בודקים דברים במהירות.

## נסו בעצמכם

הקלידו משימה ולחצו על Enter במקום ללחוץ על Add. זה עובד גם כך, כי הקשה על Enter בתוך טופס שולחת אותו. נסו להקליד רווחים בלבד: לא קורה כלום.

> **שימו לב:**
> - `Cannot read properties of null (reading 'addEventListener')`: הפונקציה `querySelector` לא מצאה כלום. בדקו את ה-id ב-HTML וזכרו את הסימן `#`.
> - הסקריפט של הדף נטען לפני שה-HTML קיים: השאירו את `<script src="script.js">` בסוף ה-body, כמו בקובץ שלנו.
> - אם שוכחים את `preventDefault()`, הדף נטען מחדש והמשימות שלכם נעלמות.
> - הוספת המחרוזת עצמה לרשימה (`list.append(text)`) מוסיפה טקסט חופשי ולא פריט רשימה. תמיד צרו קודם את האלמנט `li`.

> **תורכם:** ב-`index.html` מחקו את פריט הרשימה הזמני. ב-`script.js` מצאו את שלושת האלמנטים, כתבו את `addTask(text)` והוסיפו מאזין ל-submit שמונע את הטעינה מחדש, חותך רווחים, מתעלם מקלט ריק, מוסיף את המשימה ומרוקן את שדה הקלט. השאירו את שתי שורות ההדגמה: הדף צריך להציג את "Buy milk" ואת "Read a chapter" כשני פריטי רשימה.
