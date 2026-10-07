---
title: "שלב 8: חיפוש ומסנן תגיות שחי בכתובת"
summary: "מלמדים את הראוטר מחרוזות שאילתה (query string), מוסיפים חיפוש לפי כותרת ותגיות שאפשר ללחוץ עליהן, ומפרידים רכיב TagList לשימוש חוזר."
hints:
  - "שני סוגים של state, שני מקומות. מה שהקורא מקליד בתיבת החיפוש הוא זמני: שמרו אותו ב-useState בתוך Home. התגית שנבחרה צריכה להיות ניתנת לשיתוף ולשרוד טעינה מחדש, ולכן היא חיה בכתובת: #/?tag=math. קודם תקנו את הראוטר: useRoute חייב להתעלם מכל מה שאחרי ה-?, ו-useQuery() חדש קורא אותו."
  - "ראוטר: פצלו את טקסט ה-hash ב-'?' הראשון. החלק שלפניו הוא הנתיב (ריק פירושו '/'), והחלק שאחריו עובר ל-new URLSearchParams(...). ב-Home: const tag = useQuery().get('tag'); const visible = data.posts.filter((post) => (!tag || post.tags.includes(tag)) && post.title.toLowerCase().includes(needle)); כאשר needle = search.trim().toLowerCase()."
  - "TagList.jsx: <ul className=\"tags\">{tags.map((tag) => (<li key={tag}><Link className={tag === activeTag ? 'tag active' : 'tag'} to={'/?tag=' + encodeURIComponent(tag)}>{tag}</Link></li>))}</ul>  ב-Home הוסיפו את ה-label (className=\"sr-only\"), את ה-input המבוקר, div.filter-tags עם Link-ים, ואת <p className=\"result-count\" role=\"status\">Showing {visible.length} of {pluralize(data.posts.length, 'post')}{tag ? ' tagged ' + tag : ''}</p>"
messages:
  - "ב-router.jsx כתבו: export function useQuery() { ... }"
  - "useQuery מחזירה new URLSearchParams(...) של החלק שאחרי סימן השאלה."
  - "סיימו את components/TagList.jsx עם: export default TagList;"
  - "כל תגית מקשרת אל '/?tag=' + התגית."
  - "השתמשו ב-<TagList tags={post.tags} /> ב-PostCard."
  - "השתמשו גם ב-PostPage ב-<TagList ... />."
  - "קראו את התגית שנבחרה עם useQuery().get('tag')."
  - "השוו גרסאות באותיות קטנות כדי שהחיפוש יתעלם מאותיות גדולות."
  - "חשבו את הפוסטים הנראים עם posts.filter(...)."
  - "ל-input של החיפוש צריך להיות המחלקה \"search\"."
quiz:
  - q: "למה התגית שנבחרה נשמרת בכתובת בעוד שטקסט החיפוש נשמר ב-useState?"
    options: ["כתובות מתעדכנות מהר יותר מ-state", "useState לא יכול לשמור מחרוזות", "כתובת אפשר לשתף, לסמן כסימנייה ולטעון מחדש; חיפוש שהוקלד בחלקו הוא זמני ופרטי למסך הזה"]
  - q: "מה useQuery().get('tag') מחזירה עבור הכתובת #/?tag=math, ועבור #/ ?"
    options: ["'math' ו-null", "'tag=math' ו-''", "true ו-false"]
  - q: "מה היתרון בהפרדת TagList מ-PostCard ומ-PostPage?"
    options: ["הקוד נהיה ארוך יותר", "אותו מבנה HTML ואותה התנהגות (קישורים אל מסנן התגיות) נמצאים במקום אחד ומשמשים את שניהם", "זה גורם לתגיות להיטען מה-API"]
---

בבלוג עם קומץ פוסטים קל לגלוש. עם מאה פוסטים, הקוראים צריכים למצוא דברים. אתם תוסיפו תיבת חיפוש ומסנן תגיות, ותלמדו כלל תכנון חשוב: *לאן שייך כל חלק של state?*

## איפה אנחנו עומדים

עמוד הבית מציג את כל הפוסטים. עמוד הפוסט והכרטיסים מציגים תגיות כגלולות פשוטות. הראוטר מבין נתיבים כמו `/posts/2`, אבל חלק שאילתה כמו `?tag=math` עדיין לא חלק מהאוצר המילים שלו.

## מה נוסיף, ולמה זה חשוב

חלק מה-state צריך לחיות ברכיב: הטקסט שמוקלד בתיבת חיפוש חשוב רק בזמן ההקלדה. state אחר צריך לחיות ב-**כתובת** (URL): התגית שנבחרה משנה *באיזה עמוד אתם מסתכלים*. אפשר להעתיק כתובת לצ'אט, לסמן אותה כסימנייה, לטעון אותה מחדש, וכפתור החזרה עובד. לכן מסננים, מיון ומספרי עמודים שייכים לכתובת באפליקציות אמיתיות. אז יהיו לנו:

- `#/?tag=math`: עמוד הבית, מסונן לתגית `math` (ניתן לשיתוף)
- תיבת חיפוש שמצמצמת את הפוסטים הנראים תוך כדי הקלדה (state מקומי)
- תגיות שאפשר ללחוץ עליהן בכל מקום, מרכיב `TagList` אחד לשימוש חוזר

התבנית ההתחלתית נפתחת ב-`#/?tag=math` ותראו את העמוד "Page not found". זה הבאג שנתקן קודם.

## מדריך צעד אחר צעד

**1. מלמדים את הראוטר על `?`.** כרגע הנתיב הוא `/?tag=math`, שלא תואם אף נתיב. כתבו עזר קטן ב-`router.jsx` שמפצל את ה-hash בסימן השאלה הראשון:

```js
function splitHash(hash) {
  const text = hash.replace(/^#/, '');
  const index = text.indexOf('?');
  // path = before the "?" (or all of it), search = after it (or '')
  return { path: /* ... */, search: /* ... */ };
}
```

`useRoute()` מחזירה רק את `path` (ואת `'/'` כשהוא ריק). הוסיפו `export function useQuery()` שמחזירה `new URLSearchParams(search)`. `URLSearchParams` מובנית בדפדפן: `.get('tag')` מחזירה את הערך, או `null` כשהמפתח חסר. שני ה-hooks משתמשים ב-`useHash()`, ולכן שניהם מתעדכנים בכל `hashchange`.

**2. TagList.** צרו את `components/TagList.jsx` עם ה-props `tags` ו-`activeTag` אופציונלי. הרכיב מציג את `ul.tags`, וכל תגית היא `Link` אל `'/?tag=' + encodeURIComponent(tag)`. השתמשו בו ב-`PostCard` וב-`PostPage`: כתבתם את אותה רשימה פעמיים, ועכשיו שימוש שלישי (וכל שיפור עתידי) לא עולה כלום.

**3. סינון ב-Home.** קראו `const tag = useQuery().get('tag')` ושמרו `const [search, setSearch] = useState('')`. כשיש נתונים, חשבו את הפוסטים להצגה:

```js
const needle = search.trim().toLowerCase();
const visible = data.posts.filter(
  (post) => (!tag || post.tags.includes(tag)) && post.title.toLowerCase().includes(needle)
);
```

לעולם אל תשנו את `data.posts` עצמו: `filter` מחזירה מערך חדש והמקורי נשאר שלם, ולכן ניקוי המסנן מחזיר את כל הפוסטים. כל התגיות: `[...new Set(data.posts.flatMap((post) => post.tags))].sort()`. `Set` מסיר כפילויות.

**4. הפקדים.** input *מבוקר* (controlled) (`value` יחד עם `onChange`) עם `<label htmlFor="search" className="sr-only">` מוסתר אבל אמיתי: קוראי מסך צריכים תווית, ו-placeholder אינו תווית. אחר כך שורה של `Link`-ים לתגיות (ועוד *all*, אל `/`), ושורת מצב `Showing 2 of 6 posts tagged math` עם `role="status"`. כשאין התאמות, הציגו הודעה במקום עמוד ריק.

> **שימו לב:**
> - קריאה ל-`useQuery()` בתוך הבלוק `if (data)` שוברת את כללי ה-hooks (`Rendered more hooks than during the previous render`). קראו קודם לכל ה-hooks, ורק אחר כך הסתעפו.
> - `post.tags.include(tag)`: השיטה היא `includes`, עם s.
> - תגית עם רווח או `&` שוברת את הכתובת אלא אם עוטפים אותה ב-`encodeURIComponent`. `URLSearchParams` מפענחת אותה בחזרה בשבילכם.
> - השוואה `post.title.includes(search)` בלי `toLowerCase()` גורמת ל-"loops" לפספס את "Loops".

> **תורכם:** גרמו ל-`useRoute` להתעלם מהשאילתה והוסיפו את `useQuery`. כתבו את `TagList` והשתמשו בו ב-`PostCard` וב-`PostPage`. ב-`Home` הוסיפו את שדה החיפוש (`input#search.search`, עם התווית שלו), את קישורי התגיות (`div.filter-tags`) ואת השורה `Showing X of Y posts`, וסננו את הפוסטים לפי כותרת ותגית. ב-`#/?tag=math` התצוגה המקדימה חייבת להציג `Showing 2 of 6 posts tagged math`.
