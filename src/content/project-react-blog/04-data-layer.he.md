---
title: "שלב 4: שכבת נתונים והפוסטים מה-API"
summary: "מרכזים כל בקשה ב-lib/api.js עם טיפול בשגיאות, וטוענים את הפוסטים והכותבים של דף הבית מה-API."
hints:
  - "שני קבצים משתנים. lib/api.js מכיר את השרת: יש בו פונקציה פרטית request(path) וגם getPosts() ו-getUsers() שמיוצאות. Home.jsx אף פעם לא כותב כתובת URL: הוא קורא לעוזרים האלה בתוך useEffect ושומר ב-state את posts, authors, status ו-error."
  - "request(path): let res; try { res = await fetch(API + path); } catch { throw new Error('Could not reach the server.'); } if (!res.ok) { throw new Error(...) } return res.json();  ב-Home: Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => ...). הפכו את מערך המשתמשים לאובייקט שהמפתח בו הוא id, כדי שכל כרטיס יוכל לחפש את הכותב שלו."
  - "useEffect(() => { let cancelled = false; Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => { if (cancelled) return; const byId = {}; userList.forEach((u) => { byId[u.id] = u; }); setPosts(postList); setAuthors(byId); setStatus('ready'); }).catch((err) => { if (!cancelled) { setError(err.message); setStatus('error'); } }); return () => { cancelled = true; }; }, []);  אחר כך רנדרו <PostCard key={post.id} post={post} author={authors[post.userId]} /> וב-PostCard: {author && <p className=\"post-meta\">By {author.name}</p>}"
messages:
  - "הגדירו את כתובת ה-API ב-lib/api.js: https://api.academy.test"
  - "ב-lib/api.js כתבו: export function getPosts() { ... }"
  - "ב-lib/api.js כתבו: export function getUsers() { ... }"
  - "בדקו את res.ok: fetch לא נדחה (reject) ב-404 או ב-500."
  - "עטפו את fetch ב-try/catch כדי לטפל בשרת שאי אפשר להגיע אליו."
  - "טענו את הנתונים בתוך useEffect(...)."
  - "התחילו את שתי הבקשות יחד עם Promise.all([...])."
  - "ייבאו את העוזרים: import { getPosts, getUsers } from '../lib/api';"
  - "מחקו מ-Home.jsx את מערך ה-POSTS הקבוע."
  - "PostCard צריך לקבל prop בשם author ולהציג שורת כותב."
quiz:
  - q: "בקשה ל-/posts/99 נענית בסטטוס 404. מה fetch עושה?"
    options: ["הוא נדחה עם שגיאה", "הוא מסתיים כרגיל, ולכן צריך לבדוק את res.ok בעצמכם", "הוא מנסה שוב שלוש פעמים"]
    explain: "fetch נדחה רק כשאי אפשר לבצע את הבקשה בכלל (אין חיבור, השרת למטה). סטטוסי שגיאה של HTTP הם תשובות רגילות."
  - q: "למה כתובת ה-API וטיפול השגיאות נמצאים ב-lib/api.js ולא בתוך הדפים?"
    options: ["זה גורם לבקשות לרוץ במקביל", "דפים לא יכולים לקרוא ל-fetch", "יש מקום אחד לשנות אם השרת עובר, וכל דף מקבל את אותו טיפול בשגיאות"]
  - q: "מה Promise.all([getPosts(), getUsers()]) נותן לכם?"
    options: ["שתי הבקשות רצות באותו זמן, ומקבלים את שתי התוצאות כשהאיטית מביניהן מסתיימת", "רק את התוצאה הראשונה שמגיעה", "שתי הבקשות רצות אחת אחרי השנייה"]
---
הגיע הזמן להחליף את הפוסטים הקבועים בנתונים אמיתיים. תיצרו **שכבת נתונים** (data layer): קובץ אחד שיודע איך לדבר עם השרת. אחר כך דף הבית ישתמש בה כדי להציג פוסטים יחד עם הכותבים שלהם.

## איפה אנחנו

לאפליקציה יש Layout, נתב מבוסס hash ושני דפים. דף הבית מציג שישה פוסטים ממערך בתוך `pages/Home.jsx`. הכרטיסים לא יודעים מי כתב את הפוסטים.

## מה נוסיף, ולמה זה חשוב

באפליקציה אמיתית דפים לא צריכים להכיר כתובות URL, כותרות או קודי סטטוס. הם מבקשים "את הפוסטים" ומקבלים פוסטים או שגיאה. כשמרכזים את הבקשות ב-`lib/api.js` יש מקום אחד לכתובת השרת, לטיפול בשגיאות ובהמשך גם להזדהות. אם השרת משתנה, רק הקובץ הזה משתנה. שרת התרגול ב-`https://api.academy.test` עונה ל-`/posts` (לכל פוסט יש `id`, `userId`, `title`, `tags`) ול-`/users` (עם `id`, `name`, `role`, `city`). פוסט שומר רק את ה-id של הכותב, ולכן כדי להדפיס שם צריך את שתי הרשימות.

## הדרכה צעד אחר צעד

**1. עוזר `request` פרטי.** ל-`fetch` יש מלכודת: הוא **נדחה** (reject) רק כשאי אפשר היה להביא שום תשובה. 404 או 500 הם תשובה רגילה, ולכן חייבים לבדוק את `res.ok`. מטפלים בשני המקרים פעם אחת:

```js
async function request(path) {
  let res;
  try {
    res = await fetch(API + path);
  } catch (err) {
    throw new Error('Could not reach the server.');
  }
  if (!res.ok) {
    // build a readable message, then: throw new Error(message);
  }
  return res.json();
}
```

כשהשרת שולח שגיאה, בגוף ה-JSON שלה יש שדה `error` עם הודעה טובה. נסו `await res.json()` בתוך `try/catch` משלו, כי דף שגיאה אולי אינו JSON. כל מה שמחוץ ל-`lib/api.js` רואה מעכשיו רק אובייקטי `Error` רגילים עם הודעות קריאות.

**2. עוזרים מיוצאים.** `export function getPosts() { return request('/posts'); }` ואותו דבר עבור `getUsers()`. רק שני השמות האלה נראים לקבצים אחרים, ו-`request` נשאר פרטי.

**3. טעינה ב-Home.** שמרו ארבעה חלקי state: `posts`, `authors`, `status` (`'loading'`, `'error'` או `'ready'`) ו-`error`. טענו ב-`useEffect` עם מערך תלויות ריק כדי שירוץ פעם אחת. שתי הבקשות לא תלויות זו בזו, ולכן מתחילים אותן יחד:

```jsx
Promise.all([getPosts(), getUsers()]).then(([postList, userList]) => {
  // build an object that maps each user id to the user, then set the state
});
```

הדגל `cancelled` בפונקציית הניקוי דואג שתשובה מאוחרת תתעלם אם בינתיים עזבו את הדף.

**4. מציגים את הכותב.** העבירו `author={authors[post.userId]}` לכל `PostCard`, ובקשו מ-`PostCard` להדפיס `By <name>` כשהוא מקבל כותב. רינדור לפי סטטוס (`Loading posts...`, תיבת שגיאה או הרשימה) שומר על הדף ישר כל עוד הנתונים בדרך.

> **שימו לב:**
> - אם שוכחים `async`/`await` ב-`request`: מקבלים `res.json is not a function` או Promise שמודפס כ-`[object Promise]`.
> - כשמניחים את `fetch` ישירות בגוף הרכיב (ולא ב-`useEffect`), נשלחת בקשה אחרי כל רינדור: לולאה אינסופית של רינדורים.
> - עדכון state אחרי שהרכיב כבר נעלם מציג אזהרה ב-console: זה מה ש-`cancelled` מונע.
> - `authors[post.userId]` הוא `undefined` עד שהמשתמשים מגיעים: הבדיקה `author &&` ב-PostCard מגנה עליכם.

> **תורכם:** כתבו את `lib/api.js` (כתובת ה-`API`, פונקציה פרטית `request` שמטפלת בשגיאות רשת וב-`res.ok`, ו-`getPosts` ו-`getUsers` מיוצאות). שנו את `pages/Home.jsx` כך שיטען פוסטים ומשתמשים עם `Promise.all`, מחקו את המערך הקבוע והציגו `6 posts`. עדכנו את `PostCard` כך שכל כרטיס יציג `By <author name>`.
