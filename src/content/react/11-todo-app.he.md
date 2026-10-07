---
title: "פרויקט קטן: רשימת משימות"
summary: "משלבים state, רשימות, טפסים ומחלקות מותנות לאפליקציה קטנה."
hints:
  - "ה-state והפונקציות כבר קיימים. אתם כותבים רק את ה-markup: כותרת, טופס, רשימה שנוצרת עם map, ומונה. השתמשו ב-todo.done כדי להחליט על שם המחלקה."
  - "הטופס צריך onSubmit={addTodo}, שדה קלט עם value={text} ו-onChange={(e) => setText(e.target.value)}, וכפתור. ברשימה, עברו על todos עם map ותנו לכל li את key, onClick ו-className."
  - "<li key={todo.id} onClick={() => toggleTodo(todo.id)} className={todo.done ? \"done\" : \"\"}>{todo.text}</li>   and   <p>{remaining} left</p>"
messages:
  - "הציגו את הרשימה עם todos.map(...) ותנו לכל li את key."
  - "שלחו את הטופס עם  onSubmit={addTodo}"
  - "הפכו את שדה הקלט למבוקר:  value={text}"
  - "עדכנו את ה-state של הטקסט עם onChange."
  - "לחיצה על li צריכה לקרוא ל-toggleTodo(todo.id)."
  - "בחרו את המחלקה עם אופרטור תנאי (ternary):  className={todo.done ? \"done\" : \"\"}"
quiz:
  - q: "למה addTodo יוצרת מערך חדש עם [...todos, newItem] ולא משתמשת ב-todos.push(newItem)?"
    options: ["אסור להשתמש ב-push ב-JavaScript", "React מבחינה בשינויים רק כשנותנים ל-setter מערך חדש", "תחביר ה-spread מהיר יותר"]
  - q: "מה  todos.map((t) => t.id === id ? { ...t, done: !t.done } : t)  מייצרת?"
    options: ["מערך חדש שבו רק המשימה התואמת מוחלפת בעותק עם done הפוך", "אותו מערך, ששונה במקום", "משימה בודדת"]
  - q: "איך האפליקציה יודעת \"2 left\"?"
    options: ["היא שומרת ב-state ספירה נפרדת", "היא סופרת את הלחיצות", "היא מחשבת את זה ממערך ה-todos בזמן הרינדור"]
    explain: "ערכים שאפשר לחשב מ-state קיים לא צריכים state משלהם. חשבו אותם בזמן הרינדור."
  - q: "אילו חלקים באפליקציה הם דוגמאות ל-state?"
    options: ["רשימת המשימות והטקסט בשדה הקלט", "הכותרת", "קובץ ה-CSS"]
---

הגיע הזמן לחבר הכול. רשימת משימות משתמשת כמעט בכל מיומנות במסלול הזה: רכיבים, JSX, state, רשימות, טפסים, אירועים ועיצוב מותנה. בניית פרויקטים קטנים כמו זה היא הדרך שבה React באמת נדבקת.

## קודם מתכננים את הנתונים

לפני שכותבים markup, מחליטים מה האפליקציה צריכה לזכור. זה ה-**state** שלה:

- `todos`: מערך של אובייקטים כמו `{ id: 1, text: "Learn JSX", done: true }`.
- `text`: מה שהמשתמש הקליד עד כה בתיבת הקלט.

כל השאר במסך נגזר משני אלה. למשל, מספר המשימות שלא הושלמו לא נשמר בנפרד. הוא מחושב בזמן הרינדור:

```jsx
const remaining = todos.filter((t) => !t.done).length;
```

`filter` משאירה רק את הפריטים שהפונקציה מחזירה עבורם true, ו-`.length` סופר אותם.

## לעולם לא משנים state במקום

React מרנדרת מחדש רק כשה-setter מקבל ערך **חדש**. לכן אנחנו אף פעם לא כותבים `todos.push(...)`. במקום זה בונים מערכים חדשים:

```jsx
// add: copy all old items (...todos) and append a new one
setTodos([...todos, { id: Date.now(), text: text, done: false }]);

// toggle: copy the array with map, replace only the matching todo by a changed copy
setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
```

`{ ...t, done: !t.done }` מעתיק את כל התכונות של המשימה ואז דורס את `done` עם ההפך שלו. שתי הפונקציות האלה כבר כתובות בשבילכם בקוד ההתחלתי.

## בונים את המסך

ה-markup הוא שילוב של שיעורים קודמים:

```jsx
<form onSubmit={addTodo}>
  <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
  <button type="submit">Add</button>
</form>

<ul>
  {todos.map((todo) => (
    <li
      key={todo.id}
      onClick={() => toggleTodo(todo.id)}
      className={todo.done ? "done" : ""}
    >
      {todo.text}
    </li>
  ))}
</ul>
```

- הטופס עם שדה קלט מבוקר הוא השיעור על אירועים וטפסים.
- `todos.map` עם `key` הוא שיעור הרשימות. לכל פריט יש `id` יציב.
- `className={todo.done ? "done" : ""}` הוא רינדור מותנה שמופעל על מחלקה. קובץ ה-CSS מצייר קו על `li.done`.
- לחיצה על `li` קוראת ל-`toggleTodo` עם ה-id של אותה משימה.

נסו את זה בתצוגה המקדימה: הקלידו משימה ולחצו Enter, ואז לחצו על משימה כדי לחצות אותה וראו איך המונה משתנה.

## רעיונות להרחבה

- הוסיפו כפתור "Delete" לכל שורה בעזרת `todos.filter((t) => t.id !== id)`.
- הציגו הודעה ידידותית כשהרשימה ריקה עם `todos.length === 0 && <p>Nothing to do!</p>`.
- העבירו את פריט הרשימה לרכיב נפרד משלו, `TodoItem`, שמקבל את `todo` ואת `onToggle` בתור props.

> **שימו לב:**
> - ההקלדה בתיבה לא עושה כלום: שדה הקלט צריך גם `value={text}` וגם `onChange`.
> - הדף נטען מחדש כשלוחצים Enter: ה-handler של הטופס חייב לקרוא ל-`e.preventDefault()` (וכך הוא עושה, ב-`addTodo`).
> - `Each child in a list should have a unique "key" prop`: שימו `key={todo.id}` על ה-`li`.
> - הקו החוצה לא מופיע: שם המחלקה חייב להיות בדיוק `done`, כדי להתאים לכלל ה-CSS `li.done`.

> **תורכם:** בנו את המסך: `h1` שאומר `My todos`, את הטופס עם שדה קלט מבוקר, את ה-`ul` עם `li` לכל משימה (מחלקה `done` כשהיא הושלמה, לחיצה כדי להחליף), ואת הפסקה `{remaining} left`.
