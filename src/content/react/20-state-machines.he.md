---
title: "מכונות מצבים עם useReducer"
summary: "מתארים מסך כסטטוס (idle, loading, success, error) ועוד כמה אירועים שמותר להם להעביר בין סטטוסים, כך שמצבים בלתי אפשריים לא יכולים לקרות."
hints:
  - "למכונת מצבים יש רשימה קבועה של סטטוסים וטבלה של מעברים מותרים. ב-machine, בצעו switch על state.status קודם; בתוך כל case הסתכלו על action.type, החזירו את ה-state החדש עבור המעברים שבטבלה והחזירו את state (ללא שינוי) עבור כל השאר, כולל ענף default."
  - "case \"idle\": if (action.type === \"fetch\") return { status: \"loading\", data: null, error: null }; return state;   עבור \"loading\" טפלו ב-resolve, ב-reject וב-cancel; עבור \"success\" ו-\"error\" טפלו ב-fetch וב-reset. אחר כך ב-View הוסיפו שורה אחת לכל סטטוס: {state.status === \"loading\" && <p>Loading...</p>} וכן הלאה."
  - "switch (state.status) { case \"idle\": return action.type === \"fetch\" ? { status: \"loading\", data: null, error: null } : state; case \"loading\": if (action.type === \"resolve\") return { status: \"success\", data: action.data, error: null }; if (action.type === \"reject\") return { status: \"error\", data: null, error: action.error }; if (action.type === \"cancel\") return initial; return state; ... }"
quiz:
  - q: "מה הבעיה בשמירת ערכים בוליאניים נפרדים isLoading, isError ו-isSuccess?"
    options: ["אי אפשר להשתמש בערכים בוליאניים ב-state", "אפשר לשלב אותם למצבים בלתי אפשריים, כמו loading ו-error שניהם true", "הם גורמים לקומפוננטה להתרנדר פעמיים"]
    explain: "שלושה ערכים בוליאניים מאפשרים שמונה צירופים אבל רק ארבעה הגיוניים. ערך status אחד מאפשר בדיוק את המצבים שרשמתם."
  - q: "במכונה, מה אמור לקרות אם פעולת resolve מגיעה כשהסטטוס הוא idle?"
    options: ["המכונה צריכה לזרוק שגיאה", "ה-state צריך להפוך ל-success", "מתעלמים ממנה: ה-reducer מחזירה את ה-state ללא שינוי"]
  - q: "למה machine מסתכלת קודם על state.status ורק אחר כך על סוג הפעולה?"
    options: ["אותו אירוע יכול להיות בעל משמעות שונה בסטטוסים שונים, ולכן הסטטוס הנוכחי מחליט אילו אירועים מותרים", "כי switch לא יכול לקרוא את action.type", "זה הופך את ה-reducer ללא טהורה"]
  - q: "למה משביתים את הכפתור Load בזמן שהסטטוס הוא loading?"
    options: ["כי אי אפשר ללחוץ על כפתורים בזמן ש-effect רץ", "כדי למנוע מהמשתמש להתחיל בקשה שנייה בזמן שהראשונה עדיין רצה", "כי React אוסרת לשלוח dispatch ב-loading"]
messages:
  - "השביתו את הכפתור בזמן טעינה:  disabled={state.status === \"loading\"}"
---

כמעט כל מסך שמדבר עם שרת עובר את אותו סיפור: עוד לא קרה כלום, בקשה רצה, היא הצליחה, או שהיא נכשלה. אם עוקבים אחרי הסיפור הזה עם דגלי `useState` נפרדים (`isLoading`, `isError`, `data`) קל באופן מפתיע להגיע למצב שאמור להיות בלתי אפשרי, כמו "טוען ונכשל בו זמנית". **מכונת מצבים** (state machine) מסלקת את כל משפחת הבאגים הזו. זה רעיון ישן ומעשי מאוד, ו-`useReducer` הוא מקום מושלם לבנות בו אחת.

## סטטוסים, לא דגלים

מחליפים את הדגלים בערך אחד שיכול להיות בדיוק אחד מתוך רשימה קבועה:

```jsx
const initial = { status: "idle", data: null, error: null };
// status is one of: "idle" | "loading" | "success" | "error"
```

השדות `data` ו-`error` רק נושאים את הפרטים. עכשיו המסך הוא החלטה פשוטה: מסתכלים על `status` ומציירים את הדבר המתאים. אין דרך להיות "idle וגם loading" כי `status` מחזיק מילה אחת בלבד.

## אירועים ומעברים מותרים

מכונה היא רשימת הסטטוסים ועוד **טבלה של מעברים מותרים**. כל מעבר הוא "בסטטוס X, אירוע Y מעביר אתכם לסטטוס Z":

| מ | אירוע | אל |
| --- | --- | --- |
| idle | fetch | loading |
| loading | resolve | success |
| loading | reject | error |
| loading | cancel | idle |
| success, error | fetch | loading (ניסיון חוזר) |
| success, error | reset | idle |

כל מה שלא בטבלה **מתעלמים ממנו**. אם `resolve` מאוחר מגיע אחרי שהמשתמש ביטל, שום דבר לא נשבר, כי `resolve` פשוט לא מעבר חוקי מתוך `idle`.

## ה-reducer היא הטבלה

כבר הכרתם reducers משיעור `useReducer`. reducer של מכונה מתפצלת קודם לפי **הסטטוס הנוכחי**:

```jsx
function machine(state, action) {
  switch (state.status) {
    case "idle":
      if (action.type === "fetch") return { status: "loading", data: null, error: null };
      return state;            // anything else: ignore
    case "loading":
      if (action.type === "resolve") return { status: "success", data: action.data, error: null };
      return state;
    default:
      return state;
  }
}
```

למה סטטוס קודם? כי אותו אירוע פירושו דברים שונים במקומות שונים. `fetch` ב-`idle` מתחיל בקשה, אבל `fetch` ב-`loading` **לא** אמור להתחיל בקשה שנייה.

שימו לב ש-reducer של מכונה היא עדיין **טהורה**: היא לא עושה fetch בעצמה. הקומפוננטה מתחילה את הבקשה (בתוך effect) ואז שולחת `resolve` או `reject` כשהיא מסתיימת. ההפרדה הזו גם הופכת את המכונה לקלה לבדיקה, כמו שרשימת **Traces** בתרגיל מראה. `trace` מריצה מחדש רשימת אירועים בלי React בכלל ומדפיסה את הסטטוסים שבהם ביקרה, כך שאפשר לבדוק את הטבלה בקריאה.

## מציירים

```jsx
{state.status === "loading" && <p>Loading...</p>}
{state.status === "success" && <p>Loaded: {state.data}</p>}
{state.status === "error" && <p>Error: {state.error}</p>}
<button disabled={state.status === "loading"}>Load</button>
```

`a && b` מצייר את `b` רק כש-`a` נכון. השבתת הכפתור בזמן טעינה היא התאום הפונה למשתמש של כלל ה"התעלמות" ב-reducer. מגינים בשני המקומות: הממשק לא מציע את המעבר, והמכונה מסרבת לו בכל מקרה.

> **שימו לב:**
> - החזרת `undefined` מתוך `case` כי שכחתם `return state;`. הרינדור הבא קורס עם `Cannot read properties of undefined (reading 'status')`.
> - שינוי ה-state עם `state.status = "loading"` במקום להחזיר אובייקט חדש. React רואה את אותו אובייקט ולא מרנדרת מחדש.
> - הכנסת הבקשה לתוך ה-reducer. reducers חייבות להיות טהורות; עשו את ה-`fetch` ב-effect או במטפל אירועים ושלחו את התוצאה עם dispatch.
> - שכחת ניקוי ה-`data` או ה-`error` הישנים כשבקשה חדשה מתחילה, ואז שגיאה ישנה מהבהבת ליד "Loading...".

## ממשיכים הלאה

הוסיפו אירוע `"timeout"` שמעביר מ-`loading` ל-`error`, וכפתור "Cancel" שמצויר רק בזמן טעינה. ספריות אמיתיות כמו XState לוקחות את הרעיון הזה הרבה יותר רחוק, אבל הליבה היא מה שכתבתם עכשיו.

> **תורכם:** השלימו את `machine` לפי הטבלה, ציירו פסקה אחת לכל סטטוס ב-`View`, והשביתו את הכפתור בזמן טעינה. שתי המכונות החיות אמורות להסתיים ב-`success` וב-`error`, וארבעת ה-traces אמורים להתאים לטבלה.
