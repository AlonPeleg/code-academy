---
title: "אירועים וטפסים"
summary: "מגיבים להקלדה וללחיצות בעזרת שדות קלט מבוקרים (controlled inputs)."
hints:
  - "לשדה קלט מבוקר יש שני חצאים: הערך שלו מגיע מה-state, ו-handler של onChange כותב כל הקשה חזרה ל-state. הפסקה פשוט מדפיסה את ה-state."
  - "צרו const [name, setName] = useState(\"Ava\"). על ה-input הוסיפו value={name} ו-onChange עם פונקציה שמקבלת את האירוע. הטקסט החדש נמצא ב-event.target.value."
  - "<input type=\"text\" value={name} onChange={(e) => setName(e.target.value)} />  <p>Hello, {name}!</p>  <button onClick={() => setName(\"\")}>Clear</button>"
messages:
  - "התחילו את ה-state עם הטקסט Ava:  useState(\"Ava\")"
  - "תנו לשדה הקלט ערך מה-state:  value={name}"
  - "הקשיבו להקלדה עם onChange."
  - "קראו את הטקסט שהוקלד עם  event.target.value"
  - "גרמו לכפתור Clear לקרוא ל-  setName(\"\")  כדי לרוקן את השם."
quiz:
  - q: "מהו שדה קלט מבוקר (controlled input)?"
    options: ["שדה קלט שהערך שלו חי ב-state של React", "שדה קלט שמושבת", "שדה קלט עם מחלקת CSS"]
  - q: "איפה מוצאים את הטקסט שהמשתמש הקליד בתוך handler של onChange?"
    options: ["event.value", "event.target.value", "event.text"]
  - q: "איזה handler רץ כששולחים טופס?"
    options: ["onSend", "onEnter", "onSubmit"]
  - q: "למה קוראים ל-event.preventDefault() ב-handler של שליחה?"
    options: ["זה מונע מהדפדפן לטעון מחדש את הדף", "זה מנקה את הטופס", "זה מאמת את הטקסט"]
    explain: "כברירת מחדל שליחת טופס גורמת לדפדפן לטעון מחדש את הדף, וזה היה זורק את כל ה-state שלכם."
---

דפים מתעוררים לחיים כשהם מגיבים למשתמש: לחיצות, הקלדה, שליחת טופס. React קוראת לאלה **אירועים** (events), והטיפול בהם הוא צעד קטן מעל ה-state.

## מטפלי אירועים (event handlers)

מחברים פונקציה לאלמנט עם תכונה בכתיב camelCase: `onClick`, `onChange`, `onSubmit`, `onKeyDown` וכן הלאה. React קוראת לפונקציה שלכם ומעבירה לה **אובייקט אירוע** (event object) שמתאר מה קרה:

```jsx
<button onClick={() => console.log("clicked")}>Click me</button>
```

זכרו להעביר פונקציה ולא לקרוא לה: `onClick={handle}` או `onClick={() => handle(5)}`, אף פעם לא `onClick={handle(5)}`.

## שדות קלט מבוקרים

בדרך כלל `<input>` שומר את הטקסט שלו בתוך הדפדפן. ב-React בדרך כלל הופכים את ה-state למקור האמת היחיד. זה נקרא **שדה קלט מבוקר**, ויש לו שני חצאים:

```jsx
const [name, setName] = useState("Ava");

<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
<p>Hello, {name}!</p>
```

1. `value={name}` גורם לתיבה להציג תמיד את מה שנמצא ב-state.
2. `onChange` רץ בכל הקשה. `e` הוא האירוע, `e.target` הוא אלמנט הקלט, ו-`e.target.value` הוא הטקסט הנוכחי שלו.
3. `setName(...)` שומרת את הטקסט, React מרנדרת מחדש, והתיבה (והפסקה) מציגות את הערך החדש.

מכיוון שהטקסט נמצא ב-state שלכם, חלקים אחרים בדף יכולים להשתמש בו מיד, כמו הברכה למעלה, ואפשר לרוקן את התיבה עם `setName("")`.

## טפסים

עטפו שדות קלט ב-`<form>` וטפלו ב-`onSubmit` כדי להגיב ל-Enter או ללחצן שליחה:

```jsx
function handleSubmit(e) {
  e.preventDefault();      // stop the browser from reloading the page
  console.log("Saving", name);
}

<form onSubmit={handleSubmit}>
  <input value={name} onChange={(e) => setName(e.target.value)} />
  <button type="submit">Save</button>
</form>
```

סוגי קלט אחרים פועלים לפי אותו רעיון. תיבת סימון (checkbox) משתמשת ב-`checked={done}` וב-`e.target.checked`, ו-`<select>` משתמש ב-`value` וב-`e.target.value`.

> **שימו לב:**
> - `You provided a value prop to a form field without an onChange handler`: שדה קלט מבוקר צריך את שני החצאים. בלי `onChange` התיבה קפואה ואי אפשר להקליד.
> - ההקלדה לא עושה כלום כי כתבתם `onChange={setName(e.target.value)}`, שקורא ל-setter מיד. השתמשו בפונקציית חץ.
> - הדף נטען מחדש כששולחים טופס: שכחתם `e.preventDefault()`.
> - `Cannot read properties of undefined (reading 'target')`: לפונקציית ה-handler שלכם אין פרמטר עבור האירוע.

> **תורכם:** הפכו את שדה הקלט למבוקר (כשהוא מתחיל עם השם `Ava`), הציגו `Hello, {name}!` בפסקה, וגרמו לכפתור `Clear` לרוקן את השם.
