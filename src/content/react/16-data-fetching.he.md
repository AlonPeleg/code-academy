---
title: "טעינת נתונים עם מצבי loading ו-error"
summary: "טוענים נתונים מ-API עם fetch בתוך useEffect ומציגים מסכי טעינה, שגיאה והצלחה."
hints:
  - "לבקשה יש שלושה שלבים, ולכן שמרו status ב-state: קודם loading, ואחר כך success או error. התחילו את הבקשה ב-useEffect עם [url] כתלויות, ובדקו בעצמכם את response.ok, כי fetch נדחית רק בכשלי רשת."
  - "fetch(url).then(response => { if (!response.ok) throw new Error('HTTP ' + response.status); return response.json(); }).then(json => { setData(json); setStatus('success'); }).catch(err => { setError(err.message); setStatus('error'); }). החזירו () => { cancelled = true } ובדקו את הדגל לפני כל setState."
  - "useEffect(() => { let cancelled = false; fetch(url).then((response) => { if (!response.ok) throw new Error(\"HTTP \" + response.status); return response.json(); }).then((json) => { if (!cancelled) { setData(json); setStatus(\"success\"); } }).catch((err) => { if (!cancelled) { setError(err.message); setStatus(\"error\"); } }); return () => { cancelled = true; }; }, [url]);   if (status === \"error\") return <p>Error: {error}</p>;   return render(data);"
quiz:
  - q: "למה שומרים status (\"loading\", \"success\", \"error\") ב-state?"
    options: ["כי fetch דורשת את זה", "כדי שהקומפוננטה תוכל להציג את המסך הנכון לכל שלב של הבקשה", "כדי להאיץ את הבקשה"]
  - q: "האם fetch דוחה את ה-promise שלה כשהשרת עונה 404?"
    options: ["כן, תמיד", "רק עבור שגיאות 500", "לא, היא נדחית רק בכשלי רשת, ולכן צריך לבדוק את response.ok"]
    explain: "404 הוא עדיין תשובת HTTP שלמה. לכן אנחנו זורקים Error משלנו כש-response.ok הוא false."
  - q: "ממה פונקציית הניקוי (דגל cancelled) מגנה עליכם?"
    options: ["מעדכון state עם התוצאה של בקשה ישנה אחרי שהקומפוננטה השתנתה או נעלמה", "מהקלדה איטית", "מדליפות זיכרון בשרת"]
  - q: "למה מערך התלויות הוא [url] ולא []?"
    options: ["מערך ריק הוא שגיאת תחביר עם fetch", "כדי שהוא ירוץ בכל רינדור", "ה-effect צריך לטעון מחדש כש-url משתנה"]
messages:
  - "קראו ל-fetch(url) בתוך ה-effect."
  - "טענו את הנתונים בתוך useEffect(...)."
  - "בדקו את response.ok, כי fetch לא נכשלת על 404."
  - "טפלו בכשלים עם .catch(...) או try / catch."
  - "הוסיפו את רשימת התלויות:  }, [url]);"
---

כמעט בכל אפליקציה אמיתית מוצגים נתונים שנמצאים בשרת: משתמשים, מוצרים, הודעות. טעינת נתונים לוקחת זמן ויכולה להיכשל, ולכן קומפוננטה טובה מטפלת ב**שלושה מצבים**: עדיין טוענת, נכשלה, וסיימה. השיעור הזה מראה את המתכון הסטנדרטי עם `fetch` ו-`useEffect`.

## ה-API לתרגול

השיעורים שלנו כוללים שרת מדומה בכתובת `https://api.academy.test`. הוא עונה לקריאות `fetch` בתוך התצוגה המקדימה, בלי צורך באינטרנט:

- `/users` מחזיר רשימה של חמישה אנשים, ו-`/users?role=editor` מסנן אותה.
- `/users/2` מחזיר משתמש אחד, ו-`/users/99` עונה בסטטוס **404** (לא נמצא).

## צורת הבקשה ב-React

```jsx
const [status, setStatus] = useState("loading");
const [data, setData] = useState(null);
const [error, setError] = useState("");

useEffect(() => {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error("HTTP " + response.status);
      return response.json();
    })
    .then((json) => { setData(json); setStatus("success"); })
    .catch((err) => { setError(err.message); setStatus("error"); });
}, [url]);
```

מפרקים את זה לחלקים:

1. **שלושה חלקי state** מתארים את הבקשה: איפה היא נמצאת (`status`), מה חזר (`data`), מה השתבש (`error`).
2. הכול נמצא ב-**`useEffect`**, כי בקשה היא תופעת לוואי: היא מדברת עם העולם שמחוץ ל-React. ה-effect רץ אחרי הרינדור הראשון, ולכן הדף מציג קודם `Loading...`.
3. **`fetch(url)`** מחזירה promise לתשובה. ה-`.then` הראשון בודק את `response.ok` (נכון עבור סטטוס 200 עד 299). הבדיקה הזו חיונית: `fetch` נדחית רק בכשלי רשת, כמו חוסר חיבור. 404 או 500 הם עדיין תשובה שלמה, ולכן אנחנו **זורקים שגיאה משלנו** כדי לקפוץ אל `.catch`.
4. **`response.json()`** קוראת את הגוף ומפענחת אותו, ומחזירה promise נוסף, שה-`.then` השני מקבל.
5. **`.catch`** מטפל בכל דבר שהשתבש, בכל אחד משני השלבים.
6. **`[url]`** גורם ל-effect לרוץ שוב אם הכתובת משתנה.

## מרנדרים כל שלב

```jsx
if (status === "loading") return <p>Loading...</p>;
if (status === "error") return <p>Error: {error}</p>;
return <ul>{data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
```

משפטי `return` מוקדמים שומרים על המסלול התקין פשוט. עד שהשורה האחרונה רצה, `data` בהחלט קיים.

## גרסת async / await

אולי תעדיפו `async` ו-`await`. פונקציית ה-effect עצמה לא יכולה להיות `async` (היא חייבת להחזיר כלום או פונקציית ניקוי), ולכן מגדירים פונקציה בפנים וקוראים לה:

```jsx
useEffect(() => {
  async function load() {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("HTTP " + response.status);
      setData(await response.json());
      setStatus("success");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }
  load();
}, [url]);
```

## מצבי race וניקוי

אם `url` משתנה במהירות (המשתמש לוחץ על הרבה פריטים ברצף), התשובה של בקשה ישנה ואיטית עלולה להגיע אחרי בקשה חדשה יותר ולדרוס אותה. התיקון הסטנדרטי הוא דגל ש**פונקציית הניקוי** הופכת:

```jsx
useEffect(() => {
  let cancelled = false;
  fetch(url).then(...).then((json) => { if (!cancelled) setData(json); });
  return () => { cancelled = true; };   // runs before the next effect, or on unmount
}, [url]);
```

כשהלוגיקה הזו קיימת במקום אחד, העבירו אותה ל-custom hook, `useFetch(url)`, שמחזיר `{ status, data, error }`, וכל קומפוננטה יכולה לטעון נתונים בשורה אחת.

> **שימו לב:**
> - שכחת בדיקת `response.ok`, ואז גוף של 404 מוצג כאילו היה נתון תקין, או שמופיע `Cannot read properties of undefined`.
> - חסר `[url]` (אין מערך תלויות): ה-effect רץ אחרי כל רינדור, קובע state, מרנדר שוב, ונכנס ללולאה אינסופית.
> - הפיכת פונקציית ה-callback של ה-effect ל-`async`: React מזהירה `An effect function must not return anything besides a function`.
> - קריאת `data.name` לפני שהנתונים הגיעו. טפלו תמיד קודם במצב הטעינה.
> - שרתים אמיתיים בדומיינים אחרים עשויים לחסום את הבקשה שלכם (CORS). ה-API לתרגול לא עושה את זה.

> **תורכם:** ב-`Loader`, הוסיפו את ה-effect עם `fetch(url)`, בדקו את `response.ok`, קבעו את `data` ואת הסטטוס, טפלו בכשלים והחזירו את הניקוי. הציגו `Error: ...` עבור סטטוס השגיאה ו-`render(data)` בהצלחה. הדף אמור להציג את שני העורכים ולהציג `Error: HTTP 404` עבור המשתמש החסר.
