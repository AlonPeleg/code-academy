---
title: "Context לשיתוף state"
summary: "משתפים ערך עם כל קומפוננטה שמתחת ל-provider בלי להעביר props דרך כל שכבה."
hints:
  - "ל-context יש שני צדדים. Provider גבוה בעץ מניח ערך על ה'מדף', וכל קומפוננטה מתחתיו יכולה לקחת את הערך עם useContext, לא משנה כמה עמוק היא."
  - "ב-ThemeLabel השתמשו ב-const theme = useContext(ThemeContext); וב-Greeting השתמשו ב-useContext(UserContext). ב-App עטפו את <Page /> ב-<ThemeContext.Provider value={theme}> ובתוכו ב-<UserContext.Provider value={user}>."
  - "<ThemeContext.Provider value={theme}><UserContext.Provider value={user}><Page /></UserContext.Provider></ThemeContext.Provider>   and   const theme = useContext(ThemeContext);   const user = useContext(UserContext);"
quiz:
  - q: "איזו בעיה context פותר?"
    options: ["הוא גורם לקומפוננטות להתרנדר מהר יותר", "העברת ערך דרך שכבות רבות של קומפוננטות שלא משתמשות בו (prop drilling)", "אחסון נתונים בשרת"]
  - q: "איזה hook קורא את הערך הקרוב ביותר של context?"
    options: ["useState", "useEffect", "useContext"]
  - q: "מה קומפוננטה מקבלת מ-useContext כשאין Provider מעליה?"
    options: ["את ערך ברירת המחדל שהועבר ל-createContext", "נזרקת שגיאה", "תמיד undefined"]
  - q: "מה קורה לקומפוננטות שקוראות context כשהערך של ה-Provider משתנה?"
    options: ["כלום עד שהדף נטען מחדש", "הן מתרנדרות מחדש עם הערך החדש", "רק ה-Provider מתרנדר מחדש"]
    explain: "בזכות זה context מתאים לדברים כמו ערכת נושא או המשתמש המחובר, שהרבה קומפוננטות מציגות."
messages:
  - "קראו את ערכת הנושא עם  useContext(ThemeContext)."
  - "קראו את המשתמש עם  useContext(UserContext)."
  - "עטפו את הדף:  <ThemeContext.Provider value={theme}> ... </ThemeContext.Provider>"
  - "עטפו אותו גם ב-  <UserContext.Provider value={user}>."
---

בשיעור על הרמת state למעלה (lifting state up) העברתם ערכים למטה כ-props. זה בסדר לרמה אחת או שתיים, אבל דמיינו הגדרת ערכת נושא (theme) שכפתור קטן, בעומק של שבע קומפוננטות, צריך להכיר. להעביר את `theme` דרך כל קומפוננטה באמצע, גם כאלה שלא מתעניינות בו, נקרא **prop drilling**, וזה מעייף. **Context** מאפשר לקומפוננטה להניח ערך במקום גבוה בעץ, ולכל קומפוננטה מתחתיה לקרוא אותו ישירות.

## שלושת השלבים

**1. יוצרים את ה-context.** עושים את זה פעם אחת, מחוץ לכל קומפוננטה:

```jsx
import { createContext } from 'react';

const ThemeContext = createContext('light');
```

הארגומנט הוא **ערך ברירת המחדל**, שבו משתמשים רק כשקומפוננטה קוראת את ה-context ואין provider מעליה.

**2. מספקים ערך.** עוטפים חלק מהעץ ב-`Provider` של ה-context ונותנים לו `value`:

```jsx
<ThemeContext.Provider value="dark">
  <Page />
</ThemeContext.Provider>
```

כל מה שבתוך `<Page />`, לא משנה כמה עמוק, יכול עכשיו לראות את `"dark"`.

**3. צורכים אותו.** כל קומפוננטה שמתחת קוראת ל-`useContext`:

```jsx
import { useContext } from 'react';

function ThemeLabel() {
  const theme = useContext(ThemeContext);
  return <p>Theme: {theme}</p>;
}
// prints: Theme: dark
```

חשבו על מדף: ה-provider מניח עליו משהו, וכל צאצא יכול להושיט יד ולקחת אותו. הקומפוננטות שבאמצע (`Page`, `Toolbar`) לא נוגעות בו בכלל.

## Context ועוד state

ה-`value` של provider הוא בדרך כלל state, ולכן הוא יכול להשתנות עם הזמן. כשהוא משתנה, React מרנדרת מחדש כל קומפוננטה שקוראת את ה-context הזה:

```jsx
function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Page />
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>Switch</button>
    </ThemeContext.Provider>
  );
}
```

לחצו על הכפתור וכל `ThemeLabel` מתעדכן, בלי props בכלל. אפשר גם להעביר אובייקט שכולל את ה-setter, למשל `value={{ theme, setTheme }}`, כך שגם קומפוננטות עמוקות יכולות לשנות את הערך.

## כמה contexts

שמרו על contexts קטנים ונפרדים לפי נושא: אחד לערכת הנושא, אחד למשתמש הנוכחי, אחד לשפה. קננו את ה-providers זה בתוך זה. קומפוננטה יכולה לקרוא ל-`useContext` כמה פעמים שהיא צריכה.

## hook מותאם לקוד מסודר

בפרויקטים אמיתיים מסתירים לעיתים קרובות את ה-context מאחורי hook קטן, כך שהקומפוננטות קוראות ל-`useTheme()` במקום ל-`useContext(ThemeContext)`. נכיר hooks מותאמים אישית בשיעור הבא.

## מתי לא להשתמש ב-context

Context הוא לא תחליף ל-props. אם רק הורה והילד שלו חולקים ערך, props ברורים וקלים יותר למעקב. השתמשו ב-context לנתונים שהם באמת **כמעט גלובליים**: ערכת נושא, משתמש מחובר, שפה, עגלת קניות. זכרו גם שכל צרכן מתרנדר מחדש כשהערך משתנה, ולכן אל תניחו ערכים שמשתנים במהירות (כמו מיקום העכבר) בתוך context אחד גדול.

> **שימו לב:**
> - שכחת ה-provider: `useContext` מחזיר בשקט את ערך ברירת המחדל, ולכן תראו `Theme: light` או `stranger` במקום הנתונים האמיתיים שלכם. אם ערך ברירת המחדל הוא `null`, הגישה ל-`user.name` קורסת עם `Cannot read properties of null (reading 'name')`.
> - העברת אובייקט literal חדש כ-`value={{ a, b }}` בכל רינדור גורמת לכל הצרכנים להתרנדר מחדש בכל פעם שההורה מתרנדר. צרו אותו עם `useMemo` אם זה חשוב.
> - כתיבת `<ThemeContext value=...>` במקום `<ThemeContext.Provider value=...>`: האקדמיה הזו משתמשת ב-React 18, שבה רק `.Provider` עובד וה-context לא מסופק.
> - קריאה ל-`useContext` מחוץ לקומפוננטה או ל-hook: `Invalid hook call`.

> **תורכם:** ב-`ThemeLabel` קראו את ערכת הנושא עם `useContext(ThemeContext)`, ב-`Greeting` קראו את המשתמש עם `useContext(UserContext)`, ועטפו את `<Page />` בשני ה-providers ב-`App`. הדף אמור להציג `Theme: dark` ו-`Hello, Ada!`.
