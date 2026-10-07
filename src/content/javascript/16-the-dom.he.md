---
title: "תגובה ללחיצות (אירועי DOM)"
summary: "גרמו לכפתור לשנות טקסט בדף."
hints:
  - "אתם רוצים שמשהו יקרה מאוחר יותר, כשהמשתמש לוחץ. זה אומר לתת לכפתור פונקציה להריץ באירוע ה-click שלו."
  - "קראו ל-button.addEventListener עם שני ארגומנטים: שם האירוע כמחרוזת, ופונקציה. בתוך הפונקציה, השימו ל-message.textContent."
  - "button.addEventListener(\"click\", () => { message.textContent = \"Hello, DOM!\"; });"
quiz:
  - q: "מה ראשי התיבות DOM מייצגים?"
    options: ["Data Output Method", "Digital Online Menu", "Document Object Model"]
  - q: "איזו מתודה מוצאת אלמנט לפי ה-id שלו?"
    options: ["document.getElementById()", "document.find()", "window.id()"]
  - q: "מה עושה addEventListener?"
    options: ["מוסיפה אלמנט לדף", "מריצה פונקציה כשקורה משהו, כמו לחיצה", "טוענת קובץ CSS"]
  - q: "ב-  button.addEventListener(\"click\", handle);  למה אין () אחרי handle?"
    options: ["זו שגיאת כתיב", "כי ל-handle אין פרמטרים", "אנחנו מעבירים את הפונקציה עצמה, כדי שהדפדפן יוכל לקרוא לה מאוחר יותר"]
    explain: "כתיבת handle() הייתה קוראת לה מיד. בלי סוגריים אנחנו מוסרים את הפונקציה כדי שתיקרא בכל לחיצה."
messages:
  - "השתמשו ב-button.addEventListener(\"click\", ...) כדי להגיב ללחיצה."
  - "בתוך פונקציית הלחיצה, קבעו את textContent של הכותרת ל-\"Hello, DOM!\"."
---

דף שרק מציג דברים הוא כרזה. דף ש**מגיב** הוא אפליקציה. בשיעור הזה תלמדו איך להריץ JavaScript כשהמבקר לוחץ, מקליד או מזיז את העכבר. הרגעים האלה נקראים **אירועים** (events).

## המתכון

הפיכת דף לאינטראקטיבי כמעט תמיד עוברת שלושה שלבים:

1. **למצוא** את האלמנט: `document.getElementById("btn")` (או `document.querySelector("#btn")`).
2. **להאזין** לאירוע: `button.addEventListener("click", function)`.
3. **לשנות** משהו בתוך הפונקציה: `element.textContent = "New text"`.

```js
const button = document.querySelector("#btn");

button.addEventListener("click", () => {
  console.log("clicked!");
});
```

## addEventListener, חלק אחרי חלק

- `button` הוא האלמנט שצופים בו.
- `.addEventListener(...)` אומרת "כשהאירוע הזה קורה, הריצי את הפונקציה הזו".
- `"click"` הוא **שם האירוע**, כטקסט. אחרים: `"input"` (הקלדה), `"mouseover"`, `"keydown"`, `"submit"`.
- הארגומנט השני הוא **הפונקציה** להרצה, שנקראת *event handler* (מטפל באירוע). בדרך כלל זו פונקציית חץ שכתובה ממש שם.
- שימו לב שה-handler **לא רץ מיד**. הוא נשמר, והדפדפן קורא לו בכל פעם שהאירוע קורה.

אפשר גם להעביר את השם של פונקציה שכבר כתבתם, בלי סוגריים:

```js
function sayHello() {
  message.textContent = "Hello, DOM!";
}
button.addEventListener("click", sayHello); // no () !
```

## שמירת מצב

handler יכול לזכור דברים בין לחיצות על ידי שימוש במשתנה מחוץ לפונקציה:

```js
let count = 0;
button.addEventListener("click", () => {
  count++;
  message.textContent = `Clicked ${count} times`;
});
```

## אובייקט האירוע

הדפדפן מעביר ל-handler **אובייקט אירוע** (event object) עם פרטים על מה שקרה:

```js
input.addEventListener("input", (event) => {
  message.textContent = event.target.value; // whatever the user typed
});
```

`event.target` הוא האלמנט שבו זה קרה; בשדה קלט של טקסט, `event.target.value` הוא הטקסט הנוכחי שלו.

## החלפת מחלקה

טריק פופולרי מאוד הוא להדליק ולכבות מחלקת CSS:

```js
button.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
```

עם `.dark { background: #111; color: white; }` ב-CSS שלכם.

## לנסות את זה

לחצו על הכפתור בתצוגה המקדימה כדי לבדוק. כל מה ש-`console.log` מדפיס מופיע בלשונית **Console**. שימו לב ש"בדיקת תשובה" (Check answer) לא יכולה ללחוץ בשבילכם, ולכן היא קוראת את הקוד שלכם ומחפשת את מאזין הלחיצה ואת הטקסט החדש.

> **שימו לב:**
> - כתיבת `button.addEventListener("click", sayHello())`. הסוגריים קוראים לפונקציה מיד, פעם אחת, במקום בכל לחיצה.
> - איות שגוי של האירוע: `"onclick"` או `"Click"` לא עובדים, השם הוא `"click"`, באותיות קטנות, בלי "on".
> - `TypeError: Cannot read properties of null (reading 'addEventListener')`: ה-id ב-`getElementById` לא תואם ל-HTML, או שהסקריפט רץ לפני שהאלמנטים קיימים.
> - קביעת הטקסט מחוץ ל-handler: אז הוא משתנה מיד בטעינת הדף, לא בלחיצה.
> - שכחת `.textContent` וכתיבת `message = "Hello"`, שמשנה רק את המשתנה, לא את הדף.
> - שימוש ב-`innerHTML` כדי להציג טקסט שהקליד מבקר. זה יכול להזריק HTML. העדיפו `textContent`.

## להמשיך הלאה

הוסיפו מונה שמראה כמה פעמים לחצו על הכפתור. הוסיפו כפתור שני שמאפס את ההודעה ל-"Press the button". נסו `<input>` ואירוע `"input"` כדי להעתיק את מה שהמבקר מקליד לתוך הכותרת.

> **תורכם:** ב-`script.js`, גרמו ללחיצה על הכפתור לשנות את הכותרת ל-`Hello, DOM!`.
