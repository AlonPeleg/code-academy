---
title: "שלב 5: hook בשם useFetch ומצבי טעינה ושגיאה"
summary: "מעבירים את הטעינה, השגיאה והנתונים ל-hook אחד שאפשר להשתמש בו שוב, ומוסיפים רכיבים Loading ו-ErrorMessage נגישים."
hints:
  - "מעבירים קוד, לא כותבים אותו מחדש. useFetch(load, deps) מקבל מ-Home את ה-state, את ה-effect ואת הדגל cancelled. הוא מחזיר { data, loading, error, reload }. ב-Home נשאר רק החלק המיוחד: מה לטעון (loadHome) ואיך לצייר אותו."
  - "ב-hook: אובייקט state אחד { data, error, loading } שמתחיל עם loading: true, state מספרי בשם attempt, ו-useEffect(() => { let cancelled = false; setState(loading); load().then(...).catch(...); return () => { cancelled = true; }; }, [...deps, attempt]). reload = () => setAttempt((n) => n + 1). ב-Home: const { data, loading, error, reload } = useFetch(loadHome, []);"
  - "הרינדור ב-Home: {loading && <Loading label=\"Loading posts...\" />} {error && <ErrorMessage message={error.message} onRetry={reload} />} {data && (<> ... data.posts.map(...) ... data.authors[post.userId] ... </>)}.  loadHome היא פונקציה async ברמת המודול: const [posts, users] = await Promise.all([getPosts(), getUsers()]); בונים את authors; return { posts, authors };"
messages:
  - "ב-hooks/useFetch.js כתבו: export function useFetch(load, deps = []) { ... }"
  - "ה-hook מריץ את הבקשה בתוך useEffect."
  - "שמרו דגל בתוך ה-effect כדי שתשובה מאוחרת תתעלם אחרי הניקוי."
  - "החזירו אובייקט עם data, loading, error ו-reload."
  - "ה-hook צריך להחזיר גם פונקציית reload."
  - "סיימו את components/Loading.jsx עם: export default Loading;"
  - "סיימו את components/ErrorMessage.jsx עם: export default ErrorMessage;"
  - "תנו לתיבת השגיאה role=\"alert\" כדי שקוראי מסך יכריזו עליה."
  - "ErrorMessage מקבל prop בשם onRetry ומציג כפתור Try again."
  - "Home צריך לקרוא ל-useFetch(...) במקום לנהל את הבקשה בעצמו."
  - "ייבאו את ה-hook: import { useFetch } from '../hooks/useFetch';"
  - "Home כבר לא צריך את useState: ה-hook הוא הבעלים של ה-state."
quiz:
  - q: "מה הופך פונקציה ל-hook מותאם אישית (custom hook)?"
    options: ["היא מיוצאת עם export default", "היא מחזירה JSX", "השם שלה מתחיל ב-use והיא קוראת ל-hooks אחרים כמו useState או useEffect"]
  - q: "למה useFetch מקבל ארגומנט שני, deps?"
    options: ["כדי שהבקשה תרוץ שוב כשערך שהיא תלויה בו משתנה, למשל id של פוסט", "הוא קיים רק לצורכי תיעוד", "כדי שהנתונים יישמרו במטמון לנצח"]
  - q: "מה reload() עושה ב-hook שלנו?"
    options: ["הוא טוען מחדש את כל דף הדפדפן", "הוא משנה את מספר הניסיון (attempt), וזה גורם ל-effect לרוץ שוב ולהביא נתונים טריים", "הוא מנקה את השגיאה ולא עושה שום דבר אחר"]
    explain: "שינוי של ערך שנמצא במערך התלויות של ה-effect הוא הדרך הרגילה לבקש מ-hook לרוץ שוב."
---
כל דף שטוען נתונים צריך את אותם שלושה מצבים: *טעינה*, *שגיאה* ו*נתונים*. להעתיק ולהדביק את הקוד לכל דף יהיה טעות. בשלב הזה תעבירו אותו ל-hook אחד לשימוש חוזר ולשני רכיבים קטנים.

## איפה אנחנו

דף הבית טוען פוסטים וכותבים דרך `lib/api.js`. אבל ב-`Home.jsx` יש הרבה מנגנון: ארבעה חלקי state, effect ודגל `cancelled`. דפי הפוסט והכותב בשלבים הבאים יצטרכו את כל זה שוב.

## מה נוסיף, ולמה זה חשוב

React מאפשרת לשתף *לוגיקה* (לא רק סימון) בעזרת **hook מותאם אישית** (custom hook): פונקציה ששמה מתחיל ב-`use` ושמותר לה לקרוא ל-hooks אחרים. `useFetch` יחזיק את ה-state ואת ה-effect של כל בקשה. הדפים רק אומרים *מה* לטעון ו*איך* לצייר אותו, ולא יותר. נוסיף גם שני רכיבים קטנטנים כדי שכל דף יציג טעינה ושגיאות באותו אופן נגיש. זה ההבדל בין הדגמה לבין אפליקציה שמרגישה עקבית.

## הדרכה צעד אחר צעד

**1. הצורה של ה-hook.** החוזה שלו הוא ההחלטה החשובה ביותר בעיצוב. הקוראים מעבירים פונקציה אסינכרונית ורשימת תלויות ומקבלים אובייקט בחזרה:

```js
const { data, loading, error, reload } = useFetch(() => getPosts(), []);
```

ה-hook מקבל *פונקציה* (`load`), לא כתובת URL, ולכן הוא עובד עם כל עוזר ב-`lib/api.js` ועם שילובים כמו `Promise.all`.

**2. בתוך `hooks/useFetch.js`.** שמרו אובייקט state אחד `{ data, error, loading }` (בהתחלה `loading: true`), כך ששלושת הערכים תמיד משתנים יחד והדף אף פעם לא יציג נתונים ושגיאה בו זמנית. ה-effect מאפס את ה-state למצב טעינה, קורא ל-`load()` ושומר את התוצאה אלא אם בוטל:

```js
useEffect(() => {
  let cancelled = false;
  setState({ data: null, error: null, loading: true });
  load().then(/* store data */).catch(/* store error */);
  return () => { cancelled = true; };
}, [...deps, attempt]);
```

`attempt` הוא מונה. `reload()` מוסיף לו אחד, ה-effect רואה תלות ששונתה ורץ שוב, וזה בדיוק איך כפתור "Try again" צריך לעבוד. פיזור `...deps` בתוך המערך מאפשר לקורא להחליט מה גורם לבקשה לרוץ שוב. (כלי lint מתלוננים על התבנית הזאת; ל-hook קטן כמו זה זו פשרה מוכרת.)

**3. שני רכיבים.** `Loading` מצייר פסקה עם `role="status"`. `ErrorMessage` מצייר תיבה עם `role="alert"` ו, כשהוא מקבל פונקציה `onRetry`, כפתור *Try again*. התפקידים (roles) גורמים לקוראי מסך להכריז על מה שקורה, כך שאף אחד לא מקשיב לשקט בזמן שדף נטען.

**4. מרזים את Home.** העבירו את הבקשה המשולבת לפונקציה `async function loadHome()` ברמת המודול שמחזירה `{ posts, authors }`. הרכיב עכשיו קצר: קראו ל-`useFetch(loadHome, [])` ורנדרו את `Loading`, את `ErrorMessage` או את הרשימה בהתאם ל-`loading`, ל-`error` ול-`data`.

כדי לראות את מצב השגיאה, גרמו זמנית ל-`loadHome` לבקש נתיב שלא קיים (הוסיפו שגיאת כתיב ב-`getPosts`) וצפו בתיבה עם הכפתור שלה מופיעה.

> **שימו לב:**
> - `useFetch(loadHome(), [])`: עם הסוגריים מעבירים את ה*תוצאה* (promise) במקום את הפונקציה. העבירו `loadHome` או `() => loadHome()`.
> - רינדור של `data.posts` בזמן ש-`data` עדיין `null` קורס עם `Cannot read properties of null`. הגנו עם `data && ...`.
> - hooks רצים רק בתוך רכיבים ו-hooks אחרים. קריאה ל-`useFetch` בעוזר רגיל נותנת `Invalid hook call`.
> - אם הבקשה מתחילה מחדש בלי הפסקה, יש תלות שמשתנה בכל רינדור (למשל אובייקט שנוצר בתוך השורה). שמרו ב-`deps` ערכים פשוטים כמו מזהים.

> **תורכם:** כתבו את `hooks/useFetch.js` (`export function useFetch(load, deps = [])` שמחזיר `{ data, loading, error, reload }`), את `components/Loading.jsx` ואת `components/ErrorMessage.jsx` (עם `role="alert"` וכפתור *Try again* אופציונלי), ושכתבו את `pages/Home.jsx` כך שישתמש בהם. הדף חייב להיראות בדיוק כמו קודם.
