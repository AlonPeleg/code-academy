---
title: "שלב 7: עמודי כותבים, קישורים בין עמודים ועמוד 404"
summary: "מוסיפים עמוד כותב שטוען במקביל, מקשרים בין פוסטים לכותבים ומציגים עמוד NotFound לכתובות לא מוכרות."
hints:
  - "AuthorPage הוא בן דוד של PostPage: הוא מקבל id כ-prop ומשתמש ב-useFetch. ההבדל הוא בפונקציית הטעינה: את הכותב (getUser) ואת הפוסטים שלו (getUserPosts) אפשר לבקש באותו זמן עם Promise.all, כי שתי הבקשות צריכות רק את ה-id מהכתובת."
  - "api.js: export function getUserPosts(id) { return request('/users/' + encodeURIComponent(id) + '/posts'); }  פונקציית הטעינה: const [author, posts] = await Promise.all([getUser(id), getUserPosts(id)]); return { author, posts };  הנתיב: { path: '/authors/:id', render: (params) => <AuthorPage id={params.id} /> }. בסוף findPage החזירו <NotFound /> במקום null."
  - "שורת המחבר ב-PostCard וב-PostPage: By <Link to={'/authors/' + author.id}>{author.name}</Link>. כותרת עמוד הכותב: <header className=\"author-header\"><h1>{data.author.name}</h1><p className=\"lede\">{data.author.role}, {data.author.city}</p></header> ואחריה <p className=\"count\">{pluralize(data.posts.length, 'post')} by {data.author.name}</p> ואת post-list עם PostCard אחד לכל פוסט."
messages:
  - "ב-lib/api.js כתבו: export function getUserPosts(id) { ... }"
  - "getUserPosts מבקשת את '/users/' + id + '/posts'."
  - "סיימו את pages/AuthorPage.jsx עם: export default AuthorPage;"
  - "הכותב והפוסטים לא תלויים זה בזה: טענו אותם עם Promise.all."
  - "סיימו את pages/NotFound.jsx עם: export default NotFound;"
  - "הפכו את שם הכותב ב-PostPage לקישור אל '/authors/' + המזהה של הכותב."
  - "הפכו את שורת המחבר ב-PostCard לקישור אל '/authors/' + המזהה של הכותב."
  - "הוסיפו לטבלת הנתיבים נתיב עבור /authors/:id."
  - "findPage צריכה להחזיר <NotFound /> כשאף נתיב לא תואם."
quiz:
  - q: "למה עמוד הכותב יכול להשתמש ב-Promise.all בעוד שעמוד הפוסט לא יכול היה?"
    options: ["Promise.all עובדת רק בעמודי כותבים", "שתי הבקשות צריכות רק את ה-id מהכתובת, ולכן אף אחת לא מחכה לשנייה", "נקודת הקצה של הכותב מהירה יותר"]
  - q: "מה עמוד NotFound מחליף?"
    options: ["את ה-Layout", "את מצב הטעינה", "עמוד ריק כשאף נתיב לא תואם לכתובת"]
  - q: "איך משתמש מגיע מעמוד הכותב חזרה לפוסט?"
    options: ["כל כותרת של PostCard היא Link אל /posts/:id, ולכן גם הכרטיסים בעמוד הכותב עובדים", "דרך טעינה מחדש של העמוד", "רק עם כפתור החזרה של הדפדפן"]
---

עמודים שאי אפשר להגיע מאחד לשני הם לא אתר. בשלב הזה אתם מוסיפים את עמוד הכותב, מחברים בין פוסטים לכותבים בעזרת קישורים, ודואגים שכתובת שגויה תוביל לעמוד ידידותי ולא למסך ריק.

## איפה אנחנו עומדים

עמוד הבית מציג רשימת פוסטים. כל כותרת מקשרת לעמוד פוסט שמציג את הפוסט ואת הכותב שלו. שם הכותב הוא טקסט פשוט, וכתובת לא מוכרת כמו `#/nothing` מציגה אזור ראשי ריק.

## מה נוסיף, ולמה זה חשוב

אתרים אמיתיים הם רשת של קישורים: מפוסט אל הכותב שלו, מהכותב אל הפוסטים האחרים שלו, וחזרה. קישורים גם מאפשרים שימוש חוזר ברכיבים: עמוד הכותב מציג את אותו `PostCard` של עמוד הבית, ולכן הוא מקבל אוטומטית את הקישורים אל הפוסטים. לבסוף, **נתיב קליטה כללי** (catch-all route) מטפל בכל כתובת שלא תכננתם. בלעדיו, כתובת עם שגיאת הקלדה גורמת לאתר להיראות שבור.

## מדריך צעד אחר צעד

**1. עוד עזר API אחד.** בשרת יש נקודת קצה (endpoint) ל"כל הפוסטים של משתמש אחד": `/users/1/posts`. הוסיפו את `getUserPosts(id)` ל-`lib/api.js`, עם אותה זהירות של `encodeURIComponent` כמו קודם.

**2. העמוד.** `pages/AuthorPage.jsx` מקבל prop בשם `id`, כמו `PostPage`. הפעם אפשר להתחיל את שתי הבקשות בבת אחת:

```js
async function loadAuthor(id) {
  const [author, posts] = await Promise.all([getUser(id), getUserPosts(id)]);
  return { author, posts };
}
```

השוו לשלב 6: שם הבקשה השנייה הייתה צריכה נתונים מהראשונה (הפוסט מחזיק את המזהה של הכותב), ולכן הן רצו זו אחר זו. כאן שום דבר לא תלוי בשום דבר, ולכן הרצה במקביל הופכת את העמוד למהיר פי שניים בערך. הבחירה בין הרצה סדרתית להרצה מקבילית היא אחד ההרגלים השימושיים ביותר בממשקים שמבוססים על נתונים.

הציגו קישור חזרה, `Loading`/`ErrorMessage`, `header.author-header` עם השם (`h1`) ושורה כמו `admin, London`, אחר כך `2 posts by Ada Lovelace` ואת הכרטיסים ב-`div.post-list`. אל תעבירו כאן prop בשם `author` לכרטיסים: לכל הפוסטים אותו כותב, ולכן שורת מחבר הייתה חוזרת על כותרת העמוד.

**3. מקשרים הכול.** ב-`PostCard` וב-`PostPage` עטפו את שם הכותב ב-`<Link to={'/authors/' + author.id}>`. הוסיפו קישור שני בסוף תיבת הכותב, *More posts by ...*. ב-`App.jsx` הוסיפו את הנתיב `{ path: '/authors/:id', ... }`.

**4. עמוד NotFound.** עמוד קטן ב-`pages/NotFound.jsx`: כותרת, משפט אחד וקישור הביתה. אחר כך שנו את השורה האחרונה של `findPage` מ-`return null;` ל-`return <NotFound />;`. מכיוון שטבלת הנתיבים נבדקת לפי הסדר, מגיעים לברירת המחדל רק כשדבר לא תאם.

נסו: שנו את הנתיב ההתחלתי ב-`App.jsx` ל-`#/authors/99`. השרת עונה 404, `request` הופכת את זה להודעת שגיאה, ותיבת `ErrorMessage` מציגה אותה עם כפתור ניסיון חוזר. אחר כך החזירו את `#/authors/1`.

> **שימו לב:**
> - `Element type is invalid ... got: undefined`: בקובץ של העמוד החדש חסר `export default`, או שהייבוא ב-`App.jsx` משתמש בסוגריים מסולסלים.
> - קישור שמוסיף `#` פעמיים (`to="#/authors/1"`) שובר את הנתיב: `Link` מוסיף את ה-hash בעצמו.
> - "Loading author..." אינסופי: חסר `[id]` ברשימת התלויות, או שפונקציית הטעינה נקראת במקום להיות מועברת.
> - עטיפה של כל הכרטיס ב-`Link` הייתה מקננת קישור בתוך קישור (קישור הכותב). שמרו קישורים על חלקים קטנים ונפרדים.

> **תורכם:** הוסיפו את `getUserPosts` ל-`lib/api.js`, כתבו את `pages/AuthorPage.jsx` (טענו את הכותב ואת הפוסטים שלו עם `Promise.all`) ואת `pages/NotFound.jsx`, הוסיפו את הנתיב `/authors/:id`, גרמו ל-`findPage` להחזיר `<NotFound />` לנתיבים לא מוכרים, והפכו את שם הכותב ב-`PostCard` וב-`PostPage` לקישור. התצוגה המקדימה נפתחת ב-`#/authors/1`.
