---
title: "ביטויים ב-JSX ועיצוב"
summary: "מכניסים ערכים של JavaScript לתוך JSX בעזרת סוגריים מסולסלים, ומעצבים אלמנטים."
hints:
  - "סוגריים מסולסלים פותחים חלון מתוך JSX בחזרה אל JavaScript. כל מה שבתוכם מחושב ומוצג. המאפיין class נכתב אחרת ב-JSX, ו-style מקבל אובייקט."
  - "השתמשו במשתנה ובחישוב בתוך סוגריים מסולסלים בטקסט, ב-className=\"card\" על ה-div, וב-style={{ color: \"teal\" }} על ה-h2 (הסוגריים החיצוניים הם של JSX, והפנימיים הם האובייקט)."
  - "<div className=\"card\">  <h2 style={{ color: \"teal\" }}>Hello, {name}!</h2>  <p>{items} items cost {items * 2} dollars</p>  </div>"
quiz:
  - q: "איך מציגים בתוך JSX את הערך של משתנה בשם price?"
    options: ["${price}", "{price}", "[price]"]
  - q: "איזה מאפיין מוסיף מחלקת CSS לאלמנט JSX?"
    options: ["class", "css", "className"]
  - q: "למה עיצוב מוטבע (inline style) נראה כמו style={{ color: \"red\" }}?"
    options: ["הסוגריים החיצוניים נכנסים ל-JavaScript, והפנימיים הם אובייקט של JavaScript", "סוגריים כפולים הם מילת מפתח מיוחדת של React", "זו טעות הקלדה, זוג אחד מספיק"]
  - q: "מה אפשר לשים בתוך סוגריים מסולסלים ב-JSX?"
    options: ["רק שמות של משתנים", "כל ביטוי (expression) של JavaScript, כמו items * 2", "רק טקסט במרכאות"]
    explain: "ביטוי הוא כל דבר שמפיק ערך: משתנה, חישוב, קריאה לפונקציה."
messages:
  - "הדפיסו את המשתנה עם סוגריים מסולסלים סביב שמו."
  - "חשבו את המחיר בתוך סוגריים מסולסלים:  {items * 2}"
  - "עצבו את הכותרת עם סוגריים מסולסלים כפולים:  style={{ color: \"teal\" }}"
---

JSX הייתה דרך משעממת לכתוב HTML סטטי אילו זה כל מה שהיא עושה. הכוח האמיתי שלה הוא שאפשר לערבב **ערכים של JavaScript** בתוך התגיות בעזרת סוגריים מסולסלים, ושאפשר לעצב את מה שמציגים. השיעור הזה עוסק בשניהם.

## סוגריים מסולסלים: חלון אל JavaScript

כל מה שבין `{` ל-`}` ב-JSX מטופל כ**ביטוי** (expression) של JavaScript, כלומר קטע קוד שמפיק ערך, והתוצאה מוצגת:

```jsx
function App() {
  const name = "Ava";
  const items = 3;

  return (
    <div>
      <h2>Hello, {name}!</h2>
      <p>Total: {items * 2}</p>
      <p>Loud: {name.toUpperCase()}</p>
    </div>
  );
}
```

זה מציג `Hello, Ava!`, `Total: 6` ו-`Loud: AVA`. אפשר להשתמש במשתנים, בחישובים, בקריאות לפונקציות ובמפעיל תנאי (ternary), אבל לא בפקודות כמו `if` או `for` (עוד על כך בשיעור על רינדור מותנה).

אפשר להשתמש בסוגריים מסולסלים גם ל**ערכים של מאפיינים**: `<img src={photoUrl} />` קובע את המאפיין ממשתנה במקום ממחרוזת קבועה.

## className ומאפיינים אחרים ששונה שמם

מכיוון ש-`class` היא מילה שמורה ב-JavaScript, ב-JSX משתמשים ב-**`className`**. באופן דומה `for` בתוויות (label) הופך ל-`htmlFor`. רוב האחרים (כמו `id`, `href`, `src`) נשארים אותו דבר:

```jsx
<div className="card">...</div>
```

## עיצוב מוטבע

המאפיין `style` לא מקבל מחרוזת ב-React. הוא מקבל **אובייקט** (object) של JavaScript, עם שמות מאפיינים ב-camelCase:

```jsx
<h2 style={{ color: "teal", fontSize: "24px" }}>Styled</h2>
```

יש שני זוגות של סוגריים משני טעמים: הזוג החיצוני אומר "כאן מתחילה JavaScript", והזוג הפנימי הוא האובייקט עצמו. שימו לב ל-`fontSize` ולא ל-`font-size`, ושהערכים הם מחרוזות. ברוב העיצוב תשימו כללים בקובץ CSS ותשתמשו ב-`className`, ותשאירו עיצוב מוטבע לערכים שמגיעים מנתונים.

## Fragments

אם אתם לא רוצים אלמנט עוטף נוסף בדף, השתמשו ב-**fragment**, תגית ריקה:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
);
```

> **שימו לב:**
> - `Objects are not valid as a React child`: ניסיתם להציג ישירות אובייקט, כמו `{ color: "red" }` או `user`. הציגו במקום זה אחת מהתכונות שלו, כמו `{user.name}`.
> - `The style prop expects a mapping from style properties to values, not a string`: השתמשו ב-`style={{ color: "red" }}`, לא ב-`style="color: red"`.
> - `Invalid DOM property class`: השתמשו ב-`className`.
> - כתיבת `${name}` במקום `{name}` בתוך טקסט של JSX. סימן הדולר שייך למחרוזות תבנית (template strings), והוא יוצג כפי שהוא.

> **תורכם:** תקנו את שלושת החסרים. הדפיסו את `name` ואת `items * 2` עם סוגריים מסולסלים, תנו לעוטף את המחלקה `card`, וצבעו את הכותרת בטורקיז עם עיצוב מוטבע.
