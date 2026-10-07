---
title: "שלב 3: נתב (router) מבוסס hash"
summary: "בונים נתב קטן בעצמכם: hook בשם useRoute, פונקציית matchRoute, רכיב Link וטבלת נתיבים, כדי שהאתר יציג כמה דפים."
hints:
  - "נתב הוא שלושה דברים קטנים: hook שמחזיר את הנתיב הנוכחי ומרנדר מחדש כשהוא משתנה (useRoute), פונקציה שמשווה תבנית לנתיב (matchRoute) ורכיב קישור (Link). החלק בשורת הכתובת שאחרי # הוא הנתיב: #/about פירושו הנתיב /about."
  - "useRoute: שמרו את window.location.hash ב-state; ב-useEffect הוסיפו מאזין ל-'hashchange' שמעדכן את ה-state, והסירו אותו בפונקציית הניקוי (cleanup). Link: החזירו <a href={'#' + to} {...rest}>{children}</a>. ב-App: const path = useRoute(); ועברו בלולאה על טבלת הנתיבים עם matchRoute עד שאחד מתאים."
  - "App: const routes = [{ path: '/', render: () => <Home /> }, { path: '/about', render: () => <About /> }]; function findPage(path) { for (const route of routes) { const params = matchRoute(route.path, path); if (params) return route.render(params); } return null; }  function App() { const path = useRoute(); return <Layout>{findPage(path)}</Layout>; }"
messages:
  - "ב-router.jsx כתבו: export function useRoute() { ... }"
  - "useRoute חייב להאזין לאירוע hashchange: window.addEventListener('hashchange', ...)."
  - "הסירו את המאזין בפונקציית הניקוי של useEffect."
  - "ב-router.jsx כתבו: export function matchRoute(pattern, path) { ... }"
  - "ב-router.jsx כתבו: export function Link({ to, children, ...rest }) { ... }"
  - "Link מרנדר עוגן (anchor) עם href={'#' + to}."
  - "סיימו את pages/Home.jsx עם: export default Home;"
  - "רשימת הפוסטים נמצאת עכשיו ב-pages/Home.jsx."
  - "סיימו את pages/About.jsx עם: export default About;"
  - "ב-App קראו: const path = useRoute();"
  - "השתמשו ב-matchRoute(route.path, path) כדי למצוא את הדף של הנתיב הנוכחי."
  - "השתמשו ברכיב Link בניווט במקום בעוגנים רגילים."
quiz:
  - q: "למה שינוי של ה-hash (#/about) לא טוען מחדש את הדף?"
    options: ["דפדפנים אף פעם לא טוענים דף מחדש כשהחלק שאחרי # משתנה, הם רק מפעילים אירוע hashchange", "React מבטלת את הטעינה מחדש בשבילנו", "כי לקישור יש את המחלקה router-link"]
  - q: "למה useEffect מחזיר פונקציה שקוראת ל-removeEventListener?"
    options: ["כדי שהמאזין ירוץ פעמיים", "כדי שהמאזין יוסר כשהרכיב נעלם ולא ייערם או יעדכן רכיב שכבר לא קיים", "כי addEventListener לא עובד בלעדיה"]
  - q: "מה ההבדל בין hook כמו useRoute לבין רכיב כמו Link?"
    options: ["hooks עובדים רק ברכיבי מחלקה", "הם אותו דבר, רק השם מתחיל אחרת", "רכיב מחזיר JSX כדי לצייר משהו, ו-hook מחזיר נתונים או התנהגות ולא מצייר כלום"]
---
עכשיו תבנו את החלק שרוב המדריכים מסתירים מאחורי ספרייה: ה**נתב** (router). הוא מחליט איזה דף להציג לפי הכתובת בדפדפן. לכתוב אחד קטן בעצמכם זו הדרך הטובה ביותר להבין מה react-router עושה בשבילכם.

## איפה אנחנו

`Layout` עוטף את הדף. קישורי הניווט קיימים, אבל שום דבר לא מגיב כשלוחצים עליהם, ותוכן דף הבית עדיין כתוב בתוך `App.jsx`.

## מה נוסיף, ולמה זה חשוב

אפליקציית React עם כמה דפים היא עדיין דף HTML **אחד**. כשהכתובת משתנה, JavaScript מחליף את התוכן. הכתובת הפשוטה ביותר שלעולם לא גורמת לטעינת דף היא ה-**hash**: ב-`index.html#/about` כל מה שאחרי `#` פנוי לשימוש שלנו. שני יכולות של הדפדפן מאפשרות לבנות נתב:

- `window.location.hash` מכיל את הטקסט הזה (`'#/about'`), והצבת ערך בו משנה את הכתובת.
- האירוע `hashchange` מופעל על `window` בכל פעם שהוא משתנה (גם כשהמשתמש לוחץ על Back).

לנתב שלנו יש שלושה ייצואים (exports) ב-`router.jsx`: `useRoute()`, `matchRoute()` ו-`Link`.

## הדרכה צעד אחר צעד

**1. useRoute.** **Hook** הוא פונקציה ששמה מתחיל ב-`use` ושמותר לה לקרוא ל-hooks אחרים. זה שומר את ה-hash ב-state, כך ש-React מרנדרת מחדש כשהוא משתנה:

```jsx
function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    function handleChange() { setHash(window.location.hash); }
    window.addEventListener('hashchange', handleChange);
    return () => window.removeEventListener('hashchange', handleChange);
  }, []);
  return hash;
}
```

הפונקציה שמוחזרת מה-effect היא ה-**cleanup** (ניקוי): React מריצה אותה כשהרכיב נעלם. אחר כך `useRoute()` הופכת את `'#/about'` ל-`'/about'` ו-hash ריק ל-`'/'`.

**2. matchRoute(pattern, path).** פצלו את שתי המחרוזות לפי `/` והשוו את החלקים אחד אחד. החזירו `null` כשהם שונים ו-`{}` כשהם מתאימים (בצעד 6 האובייקט ישא פרמטרים כמו id).

**3. Link.** הוא מרנדר `<a>` רגיל עם `href={'#' + to}`. הסימון `{...rest}` מעביר הלאה כל prop אחר (`className`, ובהמשך `aria-current`), כך ש-Link מתנהג כמו עוגן.

**4. שני דפים.** העבירו את רשימת הפוסטים מ-`App.jsx` אל `pages/Home.jsx` (הייבוא עולה עכשיו תיקייה אחת למעלה: `'../components/PostCard'`) וכתבו `pages/About.jsx` קצר. **דף** (page) הוא פשוט רכיב שממלא את האזור הראשי. התיקיות מספרות לקורא למה משמש כל קובץ.

**5. טבלת הנתיבים.** שימו את הדפים במערך של אובייקטים מהצורה `{ path, render }`. הפונקציה `findPage(path)` עוברת עליו בלולאה עם `matchRoute` ומחזירה את ההתאמה הראשונה. `App` קוראת ל-`useRoute()` ומרנדרת `<Layout>{findPage(path)}</Layout>`. טבלה היא נתונים, ולכן הוספת דף בהמשך היא שורה חדשה אחת.

**6. Link בתוך ה-Layout.** החליפו את העוגנים הרגילים ב-`Layout.jsx` (הלוגו ושני קישורי הניווט) ב-`Link`, עם `to="/about"` במקום `href="#/about"`.

בקוד ההתחלתי יש שורה של "demo only" שקובעת את `#/about` ככתובת פתיחה, כדי שהתצוגה המקדימה תיפתח על הדף הזה. אתרים אמיתיים לא צריכים אותה.

> **שימו לב:**
> - אם שוכחים את ה-`[]` ב-`useEffect(..., [])`, נוסף מאזין חדש אחרי כל רינדור.
> - חובה לקרוא ל-hook ברמה העליונה של רכיב או של hook אחר, אף פעם לא בתוך `if` או לולאה.
> - `Link` מקבל `to="/about"`, לא `to="#/about"`: Link מוסיף את ה-`#` בעצמו.
> - אם הדף נשאר ריק, בדקו ש-`findPage` מחזירה את האלמנט ושבשני הדפים יש `export default`.

> **תורכם:** כתבו את `router.jsx` (`useRoute`, `matchRoute`, `Link`), את הדפים `pages/Home.jsx` (רשימת הפוסטים) ו-`pages/About.jsx` (`h1` שאומר `About Dev Blog`), בנו את טבלת הנתיבים ב-`App.jsx` והחליפו את הניווט ב-Layout ל-`Link`. התצוגה המקדימה אמורה להיפתח על דף ה-About.
