---
title: "שלב 1: מבנה הפרויקט, קומפוננטות בקבצים נפרדים"
summary: "מפצלים אפליקציית React קטנה לקבצים, בעזרת ייצוא ברירת מחדל וייצוא בעל שם, וייבוא יחסי."
hints:
  - "שלושה קבצים, שלוש משימות. הקובץ lib/format.js מייצא פונקציה רגילה, הקובץ components/PostCard.jsx מייצא קומפוננטה, והקובץ App.jsx מייבא את שתיהן ומשתמש בהן. כתבו קודם את שני הקבצים הקטנים, ואז חברו אותם ב-App.jsx."
  - "ייצוא ברירת מחדל (default export) מייבאים בלי סוגריים מסולסלים: import PostCard from './components/PostCard'. ייצוא בעל שם (named export) מייבאים עם סוגריים מסולסלים: import { pluralize } from './lib/format'. הנתיבים מתחילים ב-./ כי הם יחסיים לקובץ App.jsx."
  - "ב-App, מתחת ל-h1: <p className=\"count\">{pluralize(POSTS.length, 'post')}</p> וגם <div className=\"post-list\">{POSTS.map((post) => (<PostCard key={post.id} post={post} />))}</div>. בקובץ PostCard.jsx החזירו <article className=\"post-card\"> עם <h2 className=\"post-title\">{post.title}</h2> ועם <ul className=\"tags\"> שממפה את post.tags אל <li key={tag} className=\"tag\">{tag}</li>."
quiz:
  - q: "מדוע מעבירים את PostCard לקובץ משלו במקום להשאיר הכול ב-App.jsx?"
    options:
      - "React מסרבת להריץ קבצים עם יותר מקומפוננטה אחת"
      - "קבצים קטנים עם משימה אחת קל יותר למצוא, להשתמש בהם שוב ולשנות אותם בלי לשבור דברים אחרים"
      - "קבצים מיובאים נטענים מהר יותר מקוד שנמצא באותו קובץ"
  - q: "איך מייבאים דבר שיוצא בייצוא בעל שם, כמו export function pluralize?"
    options:
      - "import pluralize from './lib/format'"
      - "require pluralize './lib/format'"
      - "import { pluralize } from './lib/format'"
    explain: "סוגריים מסולסלים בוחרים ייצוא בעל שם לפי שמו. ייצוא ברירת מחדל מייבאים בלי סוגריים, ומותר לתת לו כל שם."
  - q: "מה תפקיד ה-prop בשם key בכל PostCard?"
    options:
      - "הוא מאפשר ל-React להבדיל בין הכרטיסים כשהרשימה משתנה"
      - "הוא קובע את מחלקת ה-CSS של הכרטיס"
      - "הוא ממיין את הכרטיסים לפי סדר האלף-בית"
messages:
  - "בקובץ lib/format.js כתבו: export function pluralize(count, word) { ... }"
  - "סיימו את components/PostCard.jsx בשורה: export default PostCard;"
  - "ב-App.jsx הוסיפו: import PostCard from './components/PostCard';"
  - "ב-App.jsx הוסיפו: import { pluralize } from './lib/format';"
  - "צרו PostCard אחד לכל פוסט בעזרת POSTS.map(...)."
  - "לכל PostCard צריך key={post.id}."
---
ברוכים הבאים לפרויקט הגדול ביותר באקדמיה. במהלך תשעה שלבים תבנו את **Dev Blog**: אפליקציית React מרובת דפים עם נתב (router) משלה, שכבת נתונים, hooks לשימוש חוזר ודפים נגישים, מפוזרת על פני מבנה תיקיות אמיתי. בסוף תוכלו להוריד אותה כפרויקט Vite ולפרסם אותה.

## איפה אנחנו עומדים

אנחנו בתחילת הדרך. התצוגה המקדימה מראה כותרת. כל שלב מתחיל מהקוד המוגמר של השלב הקודם, בתוספת כמה הערות `TODO`, והקובץ `styles.css` כבר שלם, כך שאפשר להתמקד ב-React. פוסטים לדוגמה נמצאים לעת עתה בקובץ `App.jsx`; ה-API יגיע בשלב 4.

## מה נוסיף, ולמה זה חשוב

אפליקציה זעירה יכולה לחיות בקובץ אחד. אפליקציה אמיתית לא יכולה: אף אחד לא מצליח למצוא דבר בקובץ של 2,000 שורות, ושני אנשים שעורכים אותו בו זמנית יוצרים התנגשויות בלי סוף. לכן אנחנו מפצלים לפי **משימה**:

```
App.jsx                 the entry point: puts the pieces together
styles.css              the styles
components/PostCard.jsx one reusable piece of screen
lib/format.js           plain helper functions, no React
```

בהמשך נוסיף את `pages/`, את `hooks/` ונתב, ותראו את אותו רעיון בכל פעם: קובץ אחד, משימה אחת ושם ברור. הקבצים שאתם עורכים כאן הם בדיוק הקבצים של פרויקט Vite אמיתי (הכלי שרוב צוותי React משתמשים בו). כשתורידו את הפרויקט בשלב האחרון, `App.jsx` יהפוך ל-`src/App.jsx`, ו-Vite יוסיף קובץ קטן בשם `main.jsx` שמרנדר את `<App />` אל תוך הדף.

## הדרכה שלב אחר שלב

**1. פונקציית עזר עם ייצוא בעל שם.** קובץ משתף רק את מה שסימנתם ב-`export`. בקובץ `lib/format.js` כתבו פונקציה שמוסיפה "s" אלא אם הכמות היא 1:

```js
export function pluralize(count, word) {
  // return something like '6 posts'
}
```

בקובץ יכולים להיות הרבה ייצואים בעלי שם. הקובץ המייבא חייב להשתמש באותו שם, בתוך סוגריים מסולסלים: `import { pluralize } from './lib/format';`. הסימן `./` פירושו "החל מהתיקייה של הקובץ הזה".

**2. קומפוננטה עם ייצוא ברירת מחדל.** הקובץ `components/PostCard.jsx` מתאר כרטיס אחד. קומפוננטה היא פונקציה שמתחילה באות גדולה, מקבלת **props** (הקלטים, כאן `{ post }`) ומחזירה JSX:

```jsx
import React from 'react';

function PostCard({ post }) {
  return <article className="post-card">...</article>;
}

export default PostCard;
```

בכל קובץ יש לכל היותר `export default` אחד, והקובץ המייבא בוחר כל שם שירצה: `import PostCard from './components/PostCard';`. לפי המקובל, קומפוננטות משתמשות בייצוא ברירת מחדל ופונקציות עזר משתמשות בייצוא בעל שם. השורה `import React` נחוצה בכל קובץ עם JSX בתצוגה המקדימה הזו (היא ממירה JSX בעזרת `React.createElement`). בהגדרות Vite מודרניות היא לא נדרשת, אבל היא לא מזיקה.

**3. שימוש בהם ב-App.jsx.** ייבאו את שניהם, הציגו את הכמות בעזרת `pluralize(POSTS.length, 'post')`, והפכו את המערך לכרטיסים בעזרת `POSTS.map(...)`, עם `<PostCard key={post.id} post={post} />` אחד לכל פוסט. ה-`key` עוזר ל-React להבדיל בין הכרטיסים כשהרשימה משתנה.

> **שימו לב:**
> - `Cannot find module './components/PostCard'`: בדקו את הנתיב ואת האותיות הגדולות. Windows סולחת על `postcard`, אבל השרת שמארח את האתר שלכם לא יסלח.
> - `Element type is invalid: expected a string... but got: undefined` מופיעה בדרך כלל כשייבאתם בסוגריים מסולסלים משהו שיוצא כברירת מחדל (או להפך), או כששכחתם `export default`.
> - קומפוננטות חייבות להתחיל באות גדולה. `<postCard />` מתפרש כתגית HTML.
> - כל קובץ שמכיל JSX צריך את השורה `import React from 'react';` בראשו בפרויקט הזה.

> **תורכם:** כתבו את `pluralize` בקובץ `lib/format.js` (ייצוא בעל שם) ואת `PostCard` בקובץ `components/PostCard.jsx` (ייצוא ברירת מחדל: `article.post-card` עם `h2.post-title` ועם `ul.tags` שבו `li.tag` אחד לכל תגית). ב-`App.jsx` ייבאו את שתיהן, הציגו `6 posts` בתוך `p.count`, ורנדרו את כל הפוסטים בתוך `div.post-list`, `PostCard` אחד לכל פוסט, עם `key`.
