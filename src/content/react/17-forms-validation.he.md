---
title: "טפסים עם ולידציה"
summary: "בודקים קלט עם פונקציה טהורה, מציגים שגיאות רק אחרי שהמשתמש ביקר בשדה, ומשביתים את כפתור השליחה עד שהטופס תקין."
hints:
  - "validate היא פונקציה רגילה: התחילו עם const errors = {}, הוסיפו מפתח רק כששדה שגוי (errors.name = \"...\"), והחזירו את errors בסוף. מכיוון שהיא טהורה אפשר לראות את התשובות שלה ברשימת הבדיקה העצמית. הערכים errors ו-isValid בתוך הקומפוננטה הם סתם קריאות ל-validate(values), לא state."
  - "ב-validate השתמשו ב-if (!values.name.trim()) errors.name = ...; באימייל בדקו קודם ריק, ואז את התבנית עם else if; בסיסמה בדקו values.password.length < 8. בקומפוננטה: const errors = validate(values); const isValid = Object.keys(errors).length === 0; ובכפתור הוסיפו disabled עם ההפך של isValid."
  - "setValues({ ...values, [e.target.name]: e.target.value });   setTouched({ ...touched, [e.target.name]: true });   e.preventDefault(); setSentName(values.name);   <button type=\"submit\" disabled={!isValid}>Sign up</button>"
quiz:
  - q: "למה עדיף לחשב את השגיאות מהערכים בכל רינדור מאשר לשמור אותן ב-state משלהן?"
    options: ["state לא מורשה להחזיק אובייקטים", "השגיאות אף פעם לא יוצאות מסנכרון עם הערכים, כי הן נגזרות מהם", "ערכים מחושבים גורמים לקומפוננטה להתרנדר פחות"]
    explain: "בכל פעם שאפשר לחשב משהו מ-state קיים, חשבו אותו. שני עותקים של אותה אמת יתנגשו בסוף."
  - q: "מה עושה השורה { ...values, [e.target.name]: e.target.value }?"
    options: ["מעתיקה את כל השדות ומחליפה רק את זה ששמו תואם לקלט שהשתנה", "מוחקת כל שדה חוץ מזה שהשתנה", "משנה את אובייקט values הישן במקום"]
  - q: "למה עוקבים אחרי אילו שדות נגעו בהם (touched)?"
    options: ["כדי שהדפדפן יוכל למלא אותם אוטומטית", "כי validate לא יכולה לרוץ על שדות ריקים", "כדי לא להציג למשתמש הודעות שגיאה אדומות עבור שדות שעוד לא ביקר בהם"]
  - q: "מה קורה אם מטפל שליחה לא קורא ל-e.preventDefault()?"
    options: ["כלום, React תמיד מונעת את זה", "הדפדפן טוען את הדף מחדש וה-state אובד", "כפתור השליחה מושבת לנצח"]
messages:
  - "עדכנו שדה אחד עם מפתח מחושב:  { ...values, [e.target.name]: e.target.value }"
  - "קראו ל-e.preventDefault() ב-handleSubmit כדי שהדף לא ייטען מחדש."
  - "השביתו את הכפתור כל עוד הטופס לא תקין:  disabled={!isValid}"
  - "סמנו את השדה כשביקרו בו ב-handleBlur: setTouched({ ...touched, [e.target.name]: true })."
---

טופס שמקבל כל דבר הוא טופס ששובר משהו בסוף. **ולידציה** (validation) פירושה לבדוק מה המשתמש הקליד ולומר לו, בנימוס ומוקדם, מה לתקן. בשיעור הזה תבנו טופס הרשמה עם שלושה הרגלים של טופס React טוב: פונקציית ולידציה טהורה, שגיאות שמופיעות ברגע הנכון, וכפתור שליחה שכבוי עד שהכול תקין.

## שלב 1: ולידציה היא סתם פונקציה

החלק שנשמע הכי קשה הוא בעצם הפשוט ביותר. כותבים פונקציה רגילה שמקבלת את ערכי הטופס ומחזירה אובייקט של הודעות שגיאה:

```jsx
function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (values.password.length < 8) errors.password = "Password needs 8 or more characters";
  return errors;
}

validate({ name: "", password: "abc" });
// { name: "Name is required", password: "Password needs 8 or more characters" }
```

שדה תקין פשוט לא מקבל מפתח. אובייקט ריק `{}` פירושו "אין בעיות". מכיוון ש-`validate` לא משתמשת ב-React בכלל (היא **טהורה**: אותו קלט, אותו פלט), אפשר לבדוק אותה עם נתוני דוגמה. התרגיל מדפיס רשימת "בדיקה עצמית" כדי שתראו מיד שהכללים שלכם עובדים.

לאימייל משתמשים ב**ביטוי רגולרי** (regular expression), שפה זעירה של תבניות לטקסט. `/^\S+@\S+\.\S+$/` פירושו: כמה תווים שאינם רווח, `@`, עוד כמה, נקודה, עוד כמה. הוא לא מושלם (הכללים האמיתיים של אימייל פרועים) אבל הוא תופס את שגיאות ההקלדה הטיפוסיות.

## שלב 2: גוזרים, לא שומרים

בתוך הקומפוננטה שומרים את ה**ערכים** ב-state, אבל לא שומרים את השגיאות ב-state:

```jsx
const errors = validate(values);
const isValid = Object.keys(errors).length === 0;
```

השורות האלה רצות בכל רינדור, ולכן השגיאות תמיד תואמות את הערכים הנוכחיים. אם הייתם שומרים אותן ב-state הייתם צריכים לזכור לעדכן אותן בכל מטפל, ויום אחד הייתם שוכחים.

## שלב 3: מטפל אחד להרבה קלטים

תנו לכל קלט תכונה `name` ששווה למפתח שלו ב-`values`. אז `handleChange` אחד יכול לשרת את כולם:

```jsx
function handleChange(e) {
  setValues({ ...values, [e.target.name]: e.target.value });
}
```

`...values` מעתיק את השדות הישנים. `[e.target.name]` הוא **מפתח מחושב** (computed key): הסוגריים המרובעים פירושם "השתמש בערך של הביטוי הזה כשם התכונה". אם תיבת האימייל השתנתה, הקוד נקרא כמו `email: "new text"`.

## שלב 4: מציגים שגיאות ברגע הנכון

להציג "Name is required" ברגע שהדף נטען מרגיש גס. הכלל הרגיל הוא: מציגים שגיאה של שדה רק אחרי שהמשתמש **נגע** בו, כלומר לחץ בתוכו ויצא ממנו (אירוע `onBlur`). שומרים אובייקט `touched` ב-state, קובעים `touched[name] = true` ב-`handleBlur`, ומציגים `touched[name] ? errors[name] : ""`.

## שלב 5: שליחה

```jsx
function handleSubmit(e) {
  e.preventDefault();   // do not reload the page
  // send the data somewhere
}

<button type="submit" disabled={!isValid}>Sign up</button>
```

`disabled={!isValid}` מאפיר את הכפתור עד ש-`validate` מחזירה `{}`. שימו לב שבאפליקציות אמיתיות עדיין צריך לבדוק גם בצד ה**שרת**: כל אחד יכול לעקוף את הקוד שרץ בדפדפן. ולידציה בצד הלקוח נועדה להיות ידידותית, לא בטוחה.

> **שימו לב:**
> - `Warning: A component is changing an uncontrolled input to be controlled`: ערך התחיל כ-`undefined`. התחילו כל שדה עם `""`, כמו שהתרגיל עושה.
> - הקלדה בשדה אחד מוחקת את האחרים כי כתבתם `setValues({ [e.target.name]: e.target.value })` ושכחתם את `...values`.
> - הדף מהבהב וכל הטקסט שלכם נעלם בשליחה: שכחתם את `e.preventDefault()`.
> - `Cannot read properties of undefined (reading 'trim')`: קראתם ל-`validate` עם משהו שאין לו שדה `name`.

## ממשיכים הלאה

נסו להוסיף שדה "אישור סיסמה" שהכלל שלו הוא `values.confirm !== values.password`, ומונה תווים ליד הסיסמה.

> **תורכם:** השלימו את `validate`, חשבו את `errors` ו-`isValid` ב-`SignupForm`, כתבו את שלושת המטפלים (`handleChange`, `handleBlur`, `handleSubmit`) והשביתו את הכפתור כל עוד הטופס לא תקין. רשימת הבדיקה העצמית אמורה אז להציג את ההודעה הנכונה לכל דוגמה.
