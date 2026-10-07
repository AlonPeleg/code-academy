---
title: "שלב 6: עמוד הפוסט ופרמטרים בנתיב"
summary: "מלמדים את הראוטר פרמטרים כמו /posts/:id ובונים עמוד פוסט שטוען פוסט אחד ואת הכותב שלו."
hints:
  - "לנתיב כמו /posts/:id יש חלק שמשתנה. ב-matchRoute, כשחלק בתבנית מתחיל ב-':', שמרו את החלק התואם מהכתובת באובייקט תחת השם בלי הנקודתיים, והחזירו את האובייקט. אחר כך טבלת הנתיבים מעבירה אותו הלאה: render: (params) => <PostPage id={params.id} />."
  - "PostPage({ id }) משתמש ב-useFetch(() => loadPost(id), [id]). הפונקציה loadPost היא אסינכרונית: const post = await getPost(id); const author = await getUser(post.userId); return { post, author }; הבקשה השנייה צריכה את התשובה של הראשונה, ולכן אי אפשר להתחיל אותן יחד. הציגו Loading, ErrorMessage או את הכתבה."
  - "matchRoute: const params = {}; לכל i: if (expected.startsWith(':')) { if (actual === '') return null; params[expected.slice(1)] = decodeURIComponent(actual); } else if (expected !== actual) return null; ... return params;  PostCard: <h2 className=\"post-title\"><Link to={'/posts/' + post.id}>{post.title}</Link></h2>"
messages:
  - "ב-matchRoute, חלק בתבנית שמתחיל ב-\":\" הוא פרמטר."
  - "פענחו את הערך עם decodeURIComponent(...)."
  - "ב-lib/api.js כתבו: export function getPost(id) { ... }"
  - "ב-lib/api.js כתבו: export function getUser(id) { ... }"
  - "סיימו את pages/PostPage.jsx עם: export default PostPage;"
  - "טענו קודם את הפוסט: const post = await getPost(id);"
  - "אחר כך טענו את הכותב שלו עם getUser(post.userId)."
  - "העבירו את [id] כרשימת התלויות של useFetch כדי ש-id חדש יטען פוסט חדש."
  - "הפכו את הכותרת ב-PostCard ל-Link אל '/posts/' + post.id."
  - "הוסיפו לטבלת הנתיבים ב-App.jsx נתיב עבור /posts/:id."
quiz:
  - q: "מה matchRoute('/posts/:id', '/posts/7') מחזירה אחרי השלב הזה?"
    options: ["{ id: '7' }", "'7'", "true"]
  - q: "למה loadPost טוענת קודם את הפוסט ורק אחר כך את הכותב, ולא משתמשת ב-Promise.all?"
    options: ["Promise.all לא יכולה לטפל בשתי בקשות", "המזהה של הכותב שמור בתוך הפוסט, ולכן אפשר לבקש את הכותב רק אחרי שהפוסט הגיע", "השרת עונה רק לבקשה אחת בכל פעם"]
  - q: "למה [id] מועבר כרשימת התלויות של useFetch ב-PostPage?"
    options: ["כדי שה-hook ירוץ פעם אחת בלבד", "כדי לתת לעמוד מפתח (key) ייחודי", "כדי שמעבר מ-/posts/1 ל-/posts/2 יטען את הפוסט החדש"]
---

רשימות הן רק חצי מבלוג: הקוראים לוחצים על כותרת ומצפים לראות את הפוסט המלא. בשלב הזה הראוטר לומד **פרמטרים** (parameters), ואתם בונים את העמוד הראשון שתלוי בכתובת.

## איפה אנחנו עומדים

עמוד הבית מציג רשימת פוסטים מה-API, עם מצב טעינה ומצב שגיאה, בזכות `useFetch`. הכותרות הן טקסט פשוט, והראוטר מבין רק נתיבים קבועים כמו `/` ו-`/about`.

## מה נוסיף, ולמה זה חשוב

בבלוג אי אפשר להגדיר נתיב נפרד לכל פוסט, כי כל יום מתווספים פוסטים חדשים. במקום זה יש **נתיב אחד עם חור**: `/posts/:id`. החלק שמתחיל בנקודתיים הוא *פרמטר*: הוא תואם כל ערך ומוסר אותו לעמוד. React Router, Next.js ו-Express משתמשות כולן באותו סימון, ולכן מה שתלמדו כאן תקף גם שם.

העמוד צריך אז שני דברים מה-API: את הפוסט (`/posts/2`) ואת הכותב שלו (`/users/2`), כי הפוסט שומר רק את המזהה של הכותב.

## מדריך צעד אחר צעד

**1. פרמטרים ב-`matchRoute`.** עוברים על שני המערכים של החלקים כמו קודם, אבל כשחלק התבנית מתחיל ב-`:` הוא תואם כל דבר (חוץ מחלק ריק) ונשמר:

```js
if (expected.startsWith(':')) {
  params[expected.slice(1)] = decodeURIComponent(actual);
}
```

`slice(1)` מסירה את הנקודתיים, כך ש-`':id'` הופך למפתח `id`. `decodeURIComponent` הופכת `%20` חזרה לרווח, למקרה שערך מכיל תווים מיוחדים. בסוף עושים `return params`, שהוא `{ id: '2' }` עבור `/posts/2`. שימו לב שהערך הוא מחרוזת (string).

**2. עוד שני עזרי API.** ב-`lib/api.js` הוסיפו את `getPost(id)` ואת `getUser(id)`. עטפו את המזהה ב-`encodeURIComponent` כדי שערך מוזר לעולם לא ישנה את מבנה הכתובת.

**3. העמוד.** `pages/PostPage.jsx` מקבל את המזהה כ-**prop**; הוא לא קורא את הכתובת בעצמו. כך קל לבדוק את העמוד ולהשתמש בו שוב: ניתוב הוא עניין של הראוטר. פונקציה אסינכרונית ברמת המודול טוענת את שתי הבקשות התלויות זו בזו לפי הסדר:

```js
async function loadPost(id) {
  const post = await getPost(id);
  const author = await getUser(post.userId);
  return { post, author };
}
```

אחר כך `useFetch(() => loadPost(id), [id])`. מכיוון ש-`id` נמצא ברשימת התלויות, מעבר מ-`/posts/1` ל-`/posts/2` טוען את הפוסט השני. הציגו `Link` חזרה אל `/`, ואחריו `Loading`, `ErrorMessage` או את הכתבה: כותרת ב-`h1`, שורת מחבר, תגיות, ואזור `author-box` עם השם, התפקיד והעיר של הכותב.

**4. הנתיב והקישורים.** הוסיפו את `{ path: '/posts/:id', render: (params) => <PostPage id={params.id} /> }` לטבלת הנתיבים. ב-`PostCard` הפכו את הכותרת ל-`Link` אל `'/posts/' + post.id`, כך שכל כרטיס מוביל לעמוד שלו.

התבנית ההתחלתית פותחת את התצוגה המקדימה ב-`#/posts/2` כדי שתראו את העמוד שלכם מיד. אם תשנו את המספר ל-`99` תקבלו את רכיב השגיאה: השרת עונה 404 ו-`request` הופכת את זה להודעה קריאה.

> **שימו לב:**
> - `Cannot read properties of undefined (reading 'name')`: הצגתם את `data.author.name` לפני שהנתונים הגיעו. הגנו עם `data && ...`.
> - הסדר בין הנתיבים חשוב כשתבניות חופפות: `/posts/new` שמופיע אחרי `/posts/:id` לעולם לא ייתפס.
> - פרמטרים הם מחרוזות. השוואה `post.id === params.id` נכשלת כי `2 !== '2'`.
> - אם שוכחים את `[id]` ב-`useFetch`, הפוסט הישן נשאר מוצג אחרי ששינו את הכתובת.

> **תורכם:** גרמו ל-`matchRoute` לתמוך בחלקי `:param`. הוסיפו את `getPost` ואת `getUser` ל-`lib/api.js`, כתבו את `pages/PostPage.jsx` (כותרת, `By <author>`, תגיות ואזור כותב שאומר למשל `Grace Hopper, editor, based in New York`), הוסיפו את הנתיב `/posts/:id` והפכו את הכותרות ב-`PostCard` לקישורים.
