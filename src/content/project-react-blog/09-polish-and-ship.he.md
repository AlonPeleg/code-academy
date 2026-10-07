---
title: "שלב 9: נגישות, error boundary ופרסום"
summary: "הופכים את הניווט לנגיש, קובעים כותרות לעמודים, תופסים קריסות עם error boundary ומכינים את הבלוג לפרסום."
hints:
  - "ארבע משימות קטנות. hook בשם usePageTitle שקובע את document.title; NavLink עם aria-current ב-Layout; ref על main עם קריאה ל-focus() אחרי כל החלפת עמוד, ובנוסף קישור דילוג; ומחלקה ErrorBoundary סביב העמוד. לבסוף מחקו את שורות ההדגמה START_ROUTE ב-App.jsx."
  - "Layout: function NavLink({ to, children }) { const path = useRoute(); return <Link to={to} aria-current={path === to ? 'page' : undefined}>{children}</Link>; }  const mainRef = useRef(null); <main id=\"main\" tabIndex={-1} ref={mainRef}>  ו-useEffect(() => { ... mainRef.current.focus(); }, [path]) (דלגו על ההרצה הראשונה בעזרת ref שני). קישור הדילוג: <a className=\"skip-link\" href=\"#main\" onClick={(e) => { e.preventDefault(); mainRef.current.focus(); }}>Skip to content</a>"
  - "class ErrorBoundary extends React.Component { constructor(props) { super(props); this.state = { error: null }; } static getDerivedStateFromError(error) { return { error }; } componentDidCatch(error, info) { console.error(error, info.componentStack); } render() { if (this.state.error) { return <div className=\"error\" role=\"alert\">...</div>; } return this.props.children; } }   App: <Layout><ErrorBoundary key={path}>{findPage(path)}</ErrorBoundary></Layout>"
messages:
  - "ב-hooks/usePageTitle.js כתבו: export function usePageTitle(title) { ... }"
  - "ה-hook קובע את document.title בתוך useEffect."
  - "קראו ל-usePageTitle('Latest posts') ב-Home."
  - "קראו ל-usePageTitle(...) ב-PostPage עם כותרת הפוסט."
  - "סמנו את הקישור של העמוד הנוכחי עם aria-current=\"page\"."
  - "העבירו את הפוקוס לאלמנט main עם mainRef.current.focus()."
  - "ל-error boundary צריך את static getDerivedStateFromError(error)."
  - "רשמו את הקריסה ללוג ב-componentDidCatch(error, info)."
  - "סיימו את components/ErrorBoundary.jsx עם: export default ErrorBoundary;"
  - "עטפו את findPage(path) באלמנט ErrorBoundary בתוך ה-Layout."
  - "מחקו את שורות ההדגמה START_ROUTE: אתר אמיתי מתחיל בעמוד הבית שלו."
  - "בקשו מהשרת את הפוסטים החדשים ביותר קודם: '/posts?_sort=id&_order=desc'."
quiz:
  - q: "מה aria-current=\"page\" על קישור ניווט עושה?"
    options: ["הוא מספר לטכנולוגיה מסייעת לאיזה קישור מצביע על העמוד הנוכחי (ה-CSS שלנו משתמש בו גם כדי להדגיש אותו)", "הוא מונע מהראוטר לטפל בקישור", "הוא גורם לקישור להיפתח בלשונית חדשה"]
  - q: "למה error boundary חייב להיות רכיב מחלקה (class)?"
    options: ["מחלקות מהירות יותר", "React מציעה את getDerivedStateFromError ו-componentDidCatch רק במחלקות", "רכיבי פונקציה לא יכולים להחזיר JSX"]
    explain: "כל השאר באפליקציה יכול להיות רכיבי פונקציה ו-hooks. ה-boundary הוא המקום היחיד שבו עדיין נדרשת מחלקה."
  - q: "למה קישור הדילוג קורא ל-event.preventDefault() ומעביר פוקוס ל-main ידנית?"
    options: ["כי עוגנים לא יכולים לקבל פוקוס", "כדי לגלול את העמוד למעלה", "לחיצה רגילה על href=\"#main\" הייתה משנה את ה-hash, והראוטר שלנו היה מתייחס ל-\"main\" כאל נתיב"]
---

הבלוג עובד. עכשיו צריך להפוך אותו לטוב מספיק כדי להציג לאנשים אחרים: שאפשר להשתמש בו עם מקלדת וקורא מסך, שעמיד כשמשהו קורס, ושמוכן לפרסום.

## איפה אנחנו עומדים

עמודי הבית, הפוסט, הכותב, About ו-NotFound, ראוטר, שכבת נתונים ומסננים: כל האפליקציה כבר שם. מה שעדיין חסר הוא שכבת הדאגה לפרטים שמבדילה בין תרגיל לבין משהו שאפשר להראות למעסיק.

## מה נוסיף, ולמה זה חשוב

ארבע נגיעות אחרונות, כל אחת קטנה וגלויה מאוד למשתמשים אמיתיים:

1. **כותרות לעמודים.** לשונית הדפדפן, ההיסטוריה וקוראי המסך משתמשים כולם ב-`document.title`. כרגע לכל העמודים יש אותו שם.
2. **ניווט שיודע איפה אתם.** `aria-current="page"` מסמן את הקישור הנוכחי לטכנולוגיות מסייעות, וה-CSS שלנו מדגיש אותו.
3. **פוקוס וקישור דילוג.** באתר רגיל טעינת עמוד מאפסת את פוקוס המקלדת. אפליקציית עמוד יחיד (single-page app) אף פעם לא נטענת מחדש, ולכן *אתם* צריכים להזיז את הפוקוס אחרי ניווט, אחרת משתמש מקלדת נשאר על הקישור שלחץ עליו. קישור דילוג מאפשר לו לקפוץ מעל הכותרת העליונה.
4. **error boundary.** אם רכיב זורק שגיאה בזמן הרינדור, React מפרקת את העץ כולו ומשאירה עמוד ריק. ה-boundary תופס את הקריסה ומציג הודעה במקום.

## מדריך צעד אחר צעד

**1. `hooks/usePageTitle.js`.** hook עם אפקט אחד: `document.title = title + ' | Dev Blog'`, עם `[title]` כתלות. קראו לו בראש כל עמוד, למשל `usePageTitle(data ? data.post.title : 'Loading post...')`, ובשאר העמודים עם כותרת קבועה. קריאה ל-hook חייבת לקרות בכל רינדור, ולכן היא באה *לפני* כל return מוקדם.

**2. NavLink ופוקוס ב-`Layout`.** `NavLink` קורא את הנתיב ומעביר `aria-current={path === to ? 'page' : undefined}` אל `Link` (בגלל זה Link מעביר הלאה את `...rest`). בשביל הפוקוס, תנו ל-`<main>` את `tabIndex={-1}` (אפשר להעביר אליו פוקוס מהקוד, אבל הוא לא עוצר את מקש Tab) ו-ref. העבירו אליו פוקוס באפקט שתלוי בנתיב, אבל דלגו על הרינדור הראשון, כי העמוד בדיוק נטען:

```jsx
useEffect(() => {
  if (firstRender.current) { firstRender.current = false; return; }
  mainRef.current.focus();
}, [path]);
```

קישור הדילוג הוא `<a className="skip-link" href="#main">` שמוצג רק כשיש עליו פוקוס (ה-CSS מטפל בזה). ה-`onClick` שלו קורא ל-`event.preventDefault()` ומעביר פוקוס ל-`main`, כי אם ה-hash היה משתנה, הראוטר היה מחפש נתיב בשם `main`.

**3. `components/ErrorBoundary.jsx`.** המחלקה היחידה בפרויקט. `static getDerivedStateFromError(error)` שומרת את השגיאה ב-state, `componentDidCatch` רושמת אותה ללוג, ו-`render` מציגה תוכן חלופי כשיש שגיאה ו-`this.props.children` אחרת. עטפו את `findPage(path)` ב-`<ErrorBoundary key={path}>`: ה-`key` נותן לכל עמוד boundary חדש, כך שאחרי קריסה הלחיצה הבאה מתאוששת. כדי לבדוק, כתבו זמנית `throw new Error('boom')` באחד העמודים.

**4. ניקיונות אחרונים.** מחקו את שורות ההדגמה ב-`App.jsx` (עזר לתצוגה המקדימה, לא נחוץ באתר אמיתי) ובקשו מהשרת את `/posts?_sort=id&_order=desc` כדי שהפוסט החדש ביותר יופיע ראשון.

## הופכים אותו לשלכם ומפרסמים

- [ ] החליפו את מקומות המילוי: שם הבלוג, טקסט About, הכותרת התחתונה. ספרו את הסיפור שלכם.
- [ ] עברו עם Tab על כל עמוד. אפשר לראות איפה הפוקוס? קישור הדילוג עובד?
- [ ] בדקו בטלפון, או במצב מכשיר של Chrome DevTools.
- [ ] הריצו **Lighthouse** ב-Chrome DevTools והסתכלו על Accessibility ועל SEO.
- [ ] השתמשו ב-**Download project**. זה פרויקט Vite: הריצו `npm install`, אחר כך `npm run dev`, ו-`npm run build` לקבלת הקבצים להעלאה. עקבו אחרי ה-README שלו כדי לפרסם ב-GitHub Pages, ב-Netlify או ב-Vercel.
- [ ] ניתוב hash לא דורש הגדרות שרת מיוחדות, ולכן הוא אידיאלי ל-GitHub Pages.

## מה לבנות הלאה

החליפו את ה-API לתרגול ב-API שלכם (משנים את `API` בקובץ אחד). תנו למשתמשים מחוברים לכתוב פוסטים עם `POST /posts`. הוסיפו עימוד (pagination) עם `_page` ו-`_limit`, מתג למצב כהה, או החליפו את הראוטר ב-react-router: עכשיו אתם יודעים בדיוק מה הוא עושה בשבילכם.

> **שימו לב:**
> - `Rendered fewer hooks than expected`: קראתם ל-hook אחרי `return` מוקדם.
> - Error boundaries לא תופסים שגיאות במטפלי אירועים או בקריאות `fetch`. אלה עדיין צריכים `try/catch` (ה-`request` וה-`useFetch` שלנו מטפלים בהן).
> - `document.title` נשאר על "Loading post..." אם שוכחים את מערך התלויות.

> **תורכם:** כתבו את `usePageTitle` והשתמשו בו בעמודים שלכם. ב-`Layout` הוסיפו `NavLink` עם `aria-current`, את טיפול הפוקוס וקישור דילוג. כתבו את `ErrorBoundary` ועטפו בו את העמוד ב-`App.jsx`. מחקו את שורות ההדגמה `START_ROUTE` ומיינו את הפוסטים מהחדש לישן. התצוגה המקדימה תיפתח אז בעמוד הבית עם קישור Home מודגש ועם `Showing 6 of 6 posts`.
