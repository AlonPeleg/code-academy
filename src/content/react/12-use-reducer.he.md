---
title: "useReducer למצב מורכב"
summary: "מעבירים עדכוני state סבוכים לפונקציה טהורה אחת שמתארת כל דרך שבה ה-state יכול להשתנות."
hints:
  - "reducer היא פונקציה טהורה (state, action) => newState. השתמשו ב-switch (action.type) עם case אחד לכל פעולה, ולעולם אל תשנו את ה-state הישן: בנו אובייקט חדש."
  - "עבור add החזירו { items: [...state.items, action.item] }. עבור remove החזירו { items: state.items.filter(i => i.id !== action.id) }. עבור clear החזירו { items: [] }. ב-App קראו ל-useReducer(cartReducer, initialState) והשתמשו ב-dispatch ב-onClick."
  - "const [state, dispatch] = useReducer(cartReducer, initialState);   <button onClick={() => dispatch({ type: \"add\", item: { id: 4, name: \"Book\", price: 12 } })}>Add a book</button>   <button onClick={() => dispatch({ type: \"clear\" })}>Clear</button>"
quiz:
  - q: "מה פונקציית reducer מקבלת ומה היא מחזירה?"
    options: ["קומפוננטה, והיא מחזירה JSX", "פונקציית dispatch, והיא לא מחזירה כלום", "את ה-state הנוכחי ופעולה (action), והיא מחזירה את ה-state החדש"]
  - q: "מה עושה dispatch({ type: \"clear\" })?"
    options: ["שולחת פעולה ל-React, שמריצה את ה-reducer ומרנדרת מחדש עם ה-state החדש", "קוראת ל-reducer ישירות ומחזירה לכם את התוצאה", "מוחקת את הקומפוננטה מהדף"]
  - q: "למה reducer חייבת להיות פונקציה טהורה שלא משנה את ה-state הישן?"
    options: ["JavaScript אוסרת לשנות אובייקטים", "React משווה בין ה-state הישן לחדש כדי לזהות שינוי, ואותו קלט חייב לתת תמיד אותו פלט", "כי משפטי switch לא יכולים לשנות ערכים"]
    explain: "reducers טהורות קלות לבדיקה, אפשר להריץ אותן מחדש על רצף פעולות (כמו שורת Replay מראה), והן מאפשרות ל-React לזהות שינויים לפי הפניה."
  - q: "מתי useReducer מתאים יותר מ-useState?"
    options: ["כשה-state הוא מספר בודד", "בכל פעם שרוצים קוד מהיר יותר", "כשכמה ערכים משתנים יחד או כשה-state הבא תלוי בקבוצה של פעולות בעלות שם"]
messages:
  - "צרו את ה-state עם  useReducer(cartReducer, initialState)."
  - "שלחו פעולות עם  dispatch({ type: ... })."
  - "טפלו בפעולה עם ענף  case \"add\":."
  - "השתמשו ב-filter כדי לבנות את הרשימה בלי הפריט שהוסר."
---

`useState` רגיל מושלם למונה או לתיבת טקסט. אבל כשלחלק אחד של state יש הרבה שדות, והרבה אירועים שונים משנים אותו בדרכים שונות, קריאות ה-`setState` מתפזרות בכל הקומפוננטה וקשה לעקוב אחריהן. `useReducer` פותר את זה בכך ש**הוא מרכז את כל הדרכים שבהן ה-state יכול להשתנות במקום אחד**. אפליקציות גדולות נשענות על התבנית הזו (Redux בנויה על אותו רעיון).

## שלושה מרכיבים

1. **State**: אובייקט שמתאר הכול, למשל `{ items: [] }`.
2. **Action (פעולה)**: אובייקט קטן שאומר *מה קרה*, למשל `{ type: "add", item: {...} }`. הוא מתאר את האירוע, לא את הדרך לטפל בו.
3. **Reducer**: פונקציה `(state, action) => newState` שמחליטה מהו ה-state החדש לכל סוג של פעולה.

```jsx
function reducer(state, action) {
  switch (action.type) {
    case "add":
      return { items: [...state.items, action.item] };
    case "clear":
      return { items: [] };
    default:
      return state;
  }
}
```

`switch` משווה את `action.type` לכל `case` ומריץ את הענף המתאים. ענף ה-`default` מחזיר את ה-state ללא שינוי, ולכן פעולות לא מוכרות לא גורמות נזק. (שרשרת של `if / else if` עובדת גם כן; `switch` הוא המקובל.)

## שימוש בקומפוננטה

```jsx
const [state, dispatch] = useReducer(reducer, { items: [] });
```

`useReducer` מקבלת את ה-reducer ואת ה-state ההתחלתי, ומחזירה את ה-**state הנוכחי** ופונקציה בשם `dispatch`. כדי לשנות את ה-state לא קוראים ל-setter; **שולחים פעולה** (dispatch):

```jsx
<button onClick={() => dispatch({ type: "clear" })}>Clear</button>
```

React קוראת אז ל-`reducer(currentState, action)`, שומרת את מה שהוחזר ומרנדרת מחדש. כל שינוי state באפליקציה עובר עכשיו דרך פונקציה אחת, ולכן אפשר לקרוא אותה מלמעלה למטה ולראות כל אפשרות.

## reducers חייבות להיות טהורות

reducer חייבת לעמוד בשני כללים:

- **אל תשנו את ה-state הישן.** בנו והחזירו אובייקט או מערך חדש, בעזרת spread (`[...items, x]`) או `filter` / `map`. React מחליטה לרנדר מחדש לפי בדיקה אם הערך שהוחזר הוא אובייקט *חדש*.
- **בלי הפתעות**: בלי `fetch`, בלי `Date.now()`, בלי מספרים אקראיים, בלי שינוי משתנים חיצוניים. אותו state עם אותה פעולה חייבים לתת תמיד אותה תוצאה.

בונוס של טוהר: reducer היא סתם פונקציה, ולכן אפשר להריץ אותה **בלי React**. התרגיל עושה את זה: `[...actions].reduce(cartReducer, initialState)` מריץ מחדש היסטוריה שלמה של פעולות ונותן את ה-state הסופי. זה הופך reducers לנוחות מאוד לבדיקה, ובדרך הזו עובדות תכונות "undo" וכלי debug של נסיעה בזמן.

## useState או useReducer?

| מצב | מה לבחור |
| --- | --- |
| מונה, מתג, שדה קלט אחד | `useState` |
| כמה שדות שמשתנים יחד | `useReducer` |
| ה-state הבא תלוי בקודם בדרכים מסובכות | `useReducer` |
| הרבה מטפלי אירועים שנוגעים כולם באותו state | `useReducer` |

> **שימו לב:**
> - שינוי ה-state ישירות עם `state.items.push(action.item)` והחזרת `state`. React רואה את אותו אובייקט ולא מרנדרת מחדש, ולכן המסך לא מתעדכן.
> - שכחת `return` בתוך `case`. הביצוע נופל אל ה-case הבא או מסתיים ב-`undefined`, והרינדור הבא קורס עם `Cannot read properties of undefined (reading 'items')`.
> - קריאה ל-reducer בעצמכם במקום ל-`dispatch(...)`. רק `dispatch` מודיעה ל-React לרנדר מחדש.
> - שימוש ב-`Date.now()` בתוך ה-reducer ליצירת מזהים חדשים: עשו את זה במקום שבו אתם יוצרים את הפעולה, כדי שה-reducer תישאר טהורה.

## ממשיכים הלאה

נסו להוסיף פעולה `"rename"`, או פעולה `"increase"` שמעלה את המחיר של פריט אחד בעזרת `map`.

> **תורכם:** השלימו את `cartReducer` עבור הפעולות `add`, `remove` ו-`clear`, צרו את העגלה החיה עם `useReducer(cartReducer, initialState)`, והפכו את שני הכפתורים לכאלה ששולחים פעולות. אז שורת ה-Replay אמורה להציג `Replay: 2 items, total 16`.
