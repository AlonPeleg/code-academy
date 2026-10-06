---
title: "רינדור מותנה"
summary: "מציגים דברים שונים לפי ערך, בעזרת ternary ו-&&."
hints:
  - "ל-ternary יש שלושה חלקים: תנאי, סימן שאלה עם התוצאה במקרה של true, נקודתיים והתוצאה במקרה של false. אפשר להשתמש בו בתוך סוגריים מסולסלים ב-JSX. למשימה השלישית אופרטור אחר מציג משהו רק כשתנאי מתקיים."
  - "בתוך הפסקה והכפתור, השתמשו בסוגריים מסולסלים עם loggedIn ? (טקסט עבור true) : (טקסט עבור false). מתחת, כתבו {unread > 0 && <p>...</p>} כך שהפסקה קיימת רק כשיש הודעות."
  - "<p>{loggedIn ? \"Welcome back!\" : \"Please log in\"}</p>  <button ...>{loggedIn ? \"Log out\" : \"Log in\"}</button>  {unread > 0 && <p>You have {unread} unread messages</p>}"
quiz:
  - q: "איך בוחרים בין שני דברים בתוך JSX?"
    options: ["משפט if בתוך הסוגריים", "ternary:  condition ? a : b", "לולאת for"]
  - q: "מה עושה {isAdmin && <AdminPanel />}?"
    options: ["מציגה את AdminPanel רק כש-isAdmin הוא true", "מציגה את AdminPanel תמיד", "מציגה את AdminPanel כש-isAdmin הוא false"]
  - q: "מה מוצג על ידי {0 && <p>Hi</p>}?"
    options: ["כלום", "הפסקה", "המספר 0"]
    explain: "&& מחזיר את הצד השמאלי כשהוא falsy, ו-React מדפיסה את המספר 0. השוו לערך בוליאני, כמו count > 0 &&."
  - q: "מה קומפוננטה מציגה אם היא מחזירה null?"
    options: ["את המילה null", "שום דבר", "שגיאה"]
messages:
  - "השתמשו ב-ternary על loggedIn:  loggedIn ? ... : ..."
  - "הציגו את שורת ההודעות עם &&:  unread > 0 && ..."
---

ממשקים משתנים: תפריט פתוח או סגור, משתמש מחובר או מנותק, רשימה ריקה או מלאה. **רינדור מותנה** (conditional rendering) פירושו לבחור מה להציג לפי ערך. ל-React אין תחביר מיוחד בשביל זה. פשוט משתמשים ב-JavaScript רגילה.

## למה לא if בתוך JSX?

סוגריים מסולסלים ב-JSX מקבלים **ביטויים** (דברים שמפיקים ערך). משפט `if` לא מפיק ערך, ולכן אי אפשר לכתוב אותו בתוך התגיות. יש שתי דרכים לעקוף את זה.

### 1. מחליטים לפני ה-return

```jsx
function Status({ online }) {
  if (online) {
    return <p>Online</p>;
  }
  return <p>Offline</p>;
}
```

מושלם כשחלקים שלמים שונים. קומפוננטה יכולה אפילו להחזיר `return null;` כדי לא להציג כלום.

### 2. אופרטור ה-ternary

לבחירה קטנה באמצע התגיות, משתמשים ב-ternary `condition ? ifTrue : ifFalse`, שהוא **כן** ביטוי:

```jsx
<p>{loggedIn ? "Welcome back!" : "Please log in"}</p>
```

קראו אותו בקול: "האם loggedIn הוא true? אז הציגו Welcome back!, אחרת הציגו Please log in". כל צד יכול להיות גם אלמנט: `{loggedIn ? <Dashboard /> : <LoginForm />}`.

### 3. האופרטור && ל"להציג או כלום"

כשאין חלק של "אחרת", משתמשים ב-`&&`. אם הצד השמאלי נכון, JavaScript נותנת את הצד הימני. אם הוא שקרי, מקבלים את הערך השקרי ו-React לא מרנדרת כלום:

```jsx
{unread > 0 && <p>You have {unread} unread messages</p>}
```

## משנים את התנאי עם state

בשילוב עם ה-state מהשיעור הקודם, התצוגה מתעדכנת מעצמה:

```jsx
const [open, setOpen] = useState(false);

<button onClick={() => setOpen(!open)}>
  {open ? "Hide" : "Show"} details
</button>
{open && <p>Here are the details.</p>}
```

`!open` פירושו "לא פתוח": הוא הופך `true` ל-`false` ולהפך. לחצו על הכפתור בתצוגה המקדימה כדי לראות את ההיגיון עובד.

> **שימו לב:**
> - המספר אפס: `{items.length && <List />}` מציג `0` כפשוטו כשהרשימה ריקה, כי `0 && x` הוא `0`. השוו במפורש: `items.length > 0 && <List />`.
> - `Unexpected token` כשכותבים `{if (x) ...}` ב-JSX. השתמשו שם ב-ternary או ב-`&&`, או החליטו מעל ה-`return`.
> - שכחת החלק של הנקודתיים ב-ternary: `{x ? "a"}` היא שגיאת תחביר. אם יש רק ענף של true, השתמשו ב-`&&`.
> - טקסט בתוך הענפים צריך מרכאות: `loggedIn ? Welcome : Bye` מתייחס למשתנים בשם `Welcome` ו-`Bye`.

> **תורכם:** מלאו את הפסקה והכפתור עם ternary על `loggedIn`, והציגו את שורת ההודעות שלא נקראו עם `&&`. הדף ההתחלתי צריך להציג `Please log in`, לכלול כפתור `Log in` ולהציג `You have 3 unread messages`.
