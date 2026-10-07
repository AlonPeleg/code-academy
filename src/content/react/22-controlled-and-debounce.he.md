---
title: "קלטים מבוקרים ולא מבוקרים, ו-hook של debounce"
summary: "לומדים מתי קלט צריך לחיות ב-state ומתי ה-DOM יכול להחזיק אותו, ואז כותבים hook לשימוש חוזר בשם useDebounce שמחכה שהמשתמש יפסיק להקליד."
hints:
  - "קלט לא מבוקר (uncontrolled) שומר את הטקסט שלו בתוך הדפדפן: נותנים לו טקסט התחלתי עם defaultValue ושואלים את ה-DOM מה הטקסט הנוכחי דרך ref כשצריך. ב-hook, debounce הוא טיימר שמבוטל ומתחיל מחדש בכל פעם שהערך משתנה, ולכן הוא יורה רק אחרי תקופה שקטה."
  - "חלק 1: <input ref={nameRef} defaultValue=\"Ada\" /> ו-effect עם setSeen(nameRef.current.value). חלק 2: const [debounced, setDebounced] = useState(value); ואז useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); והחזירו debounced."
  - "function useDebounce(value, delay) { const [debounced, setDebounced] = useState(value); useEffect(() => { const timer = setTimeout(() => setDebounced(value), delay); return () => clearTimeout(timer); }, [value, delay]); return debounced; }"
quiz:
  - q: "מהו קלט לא מבוקר?"
    options: ["קלט ש-React לא מורשית לרנדר", "קלט שהדפדפן עצמו שומר את הטקסט שלו, ואותו קוראים דרך ref או טופס כשצריך", "קלט שהושבת"]
  - q: "איזו תכונה נותנת לקלט לא מבוקר את הטקסט ההתחלתי שלו?"
    options: ["value", "placeholder", "defaultValue"]
    explain: "שימוש ב-value בלי onChange יוצר קלט מבוקר קפוא; defaultValue קובעת רק את הטקסט ההתחלתי."
  - q: "מה עושה ערך debounced?"
    options: ["הוא מתעדכן רק אחרי שהערך המקורי הפסיק להשתנות למשך זמן מוגדר", "הוא מתעדכן פי שניים מהר יותר מהמקורי", "הוא מתעדכן רק בפעם הראשונה שהמקורי משתנה"]
  - q: "למה ה-effect בתוך useDebounce מחזיר clearTimeout(timer)?"
    options: ["כדי לשחרר זיכרון כשהדף נסגר", "כדי שהקשה חדשה תבטל את הטיימר שממתין וההמתנה תתחיל מחדש", "כי setTimeout לא יכולה לרוץ בלי ניקוי"]
    explain: "בלי הניקוי, כל הקשה עדיין הייתה יורה טיימר משלה, והייתם מקבלים עדכון אחד לכל מקש, רק מאוחר יותר."
messages:
  - "תנו לקלט הלא מבוקר את הטקסט ההתחלתי שלו עם  defaultValue=\"Ada\"."
  - "חברו את ה-ref לקלט:  <input ref={nameRef} ... />"
---

טפסים נותנים לכם בחירה: לתת ל-**React** להחזיק את מה שהמשתמש הקליד, או לתת ל-**דפדפן** להחזיק אותו. לכל בחירה יש שימוש טוב. אחר כך תכתבו אחד מה-hooks הקטנים השימושיים ביותר ב-React היומיומית, `useDebounce`, שמונע מהקוד שלכם לעשות עבודה יקרה בכל הקשה בודדת.

## מבוקר ולא מבוקר

קלט **מבוקר** (controlled) מקבל את הטקסט שלו מה-state ומדווח על כל שינוי בחזרה, כמו שראיתם בשיעורי הטפסים:

```jsx
<input value={query} onChange={(e) => setQuery(e.target.value)} />
```

React היא מקור האמת היחיד. כל דבר אחר בדף יכול להגיב לכל הקשה, אפשר לבצע ולידציה חיה, או לכפות אותיות גדולות.

קלט **לא מבוקר** (uncontrolled) נותן לדפדפן להחזיק את הטקסט, כמו ב-HTML רגיל. נותנים לו רק טקסט התחלתי וקוראים את הטקסט הנוכחי כשצריך:

```jsx
const nameRef = useRef(null);

<input ref={nameRef} defaultValue="Ada" />

// later, for example in a submit handler:
nameRef.current.value   // the text that is in the box right now
```

`defaultValue` קובע את הטקסט ההתחלתי פעם אחת; אחר כך הדפדפן אחראי. (שימוש ב-`value` בלי `onChange` ייתן לכם קלט קפוא ואזהרה בקונסולה.) מכיוון שלא נשמר דבר ב-state, הקלדה בכלל לא מרנדרת מחדש את הקומפוננטה.

| | מבוקר | לא מבוקר |
| --- | --- | --- |
| איפה הטקסט חי | state של React | אלמנט ה-DOM |
| איך קוראים אותו | משתנה ה-state | `ref.current.value` (או `FormData`) |
| ולידציה חיה, עיצוב | קל | מסורבל |
| רינדור מחדש בכל מקש | כן | לא |
| מתאים ל | רוב הטפסים | טפסים פשוטים, קלטי קבצים, שילוב קוד שאינו React |

`<input type="file">` הוא תמיד לא מבוקר, כי JavaScript לא מורשית לקבוע איזה קובץ המשתמש בחר. בחרו מבוקר כברירת מחדל ולא מבוקר כשזה הופך את הקוד לפשוט יותר.

## הבעיה ש-debounce פותר

דמיינו תיבת חיפוש ששואלת את השרת על תוצאות בכל פעם שהטקסט משתנה. הקלדת "react" הייתה שולחת חמש בקשות: עבור `r`, `re`, `rea`, `reac` ו-`react`. ארבע מהן מבוזבזות ואפילו עלולות להגיע בסדר הפוך. מה שאנחנו רוצים: לחכות עד שהמשתמש **עוצר**, ואז לחפש פעם אחת. זה נקרא **debouncing**.

## כותבים את ה-hook

הרעיון: מחזיקים עותק מאוחר של הערך. בכל פעם שהערך משתנה, מתחילים טיימר. אם הערך משתנה שוב לפני שהטיימר מסיים, מבטלים אותו ומתחילים חדש. רק טיימר שמשאירים אותו בשקט מצליח לעדכן את העותק.

```jsx
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);   // cancel the old timer
  }, [value, delay]);

  return debounced;
}
```

זה בדיוק ה-**ניקוי** משיעור ה-refs שעושה עבודה אמיתית. בכל פעם ש-`value` משתנה, React מריצה קודם את הניקוי הקודם (ביטול הטיימר הישן) ואז את ה-effect החדש (התחלת טיימר חדש). בקומפוננטה שלכם משתמשים בו כמו בכל ערך אחר:

```jsx
const [query, setQuery] = useState("");
const debounced = useDebounce(query, 300);   // 300 ms is a common choice
// use query for the input, and debounced for the expensive work
```

הקלט נשאר זריז כי הוא משתמש ב-`query`; החיפוש משתמש ב-`debounced` ורץ פעם אחת בכל הפסקה.

> **שימו לב:**
> - שכחת הניקוי: כל הקשה עדיין יורה טיימר משלה, ולכן מקבלים את כל חמשת העדכונים, רק 300 ms מאוחר יותר.
> - השארת `delay` או `value` מחוץ לרשימת התלויות, כך שה-hook ממשיך להשתמש בערך ישן.
> - ערבוב שני הסגנונות בקלט אחד: `value` יחד עם `defaultValue` נותנים את האזהרה `contains an input of type text with both value and defaultValue props`.
> - קריאת `nameRef.current.value` בזמן רינדור: האלמנט עדיין לא קיים ברינדור הראשון (`Cannot read properties of null`). קראו אותו במטפל אירועים או ב-effect.

## ממשיכים הלאה

בן דוד קרוב הוא **throttling**: רצים לכל היותר פעם אחת בכל N אלפיות שנייה גם כשהמשתמש ממשיך, וזה שימושי לאירועי scroll ו-resize. אפשר גם לכתוב `useDebouncedCallback(fn, delay)`, שמבצע debounce לפונקציה במקום לערך.

> **תורכם:** הפכו את קלט השם ללא מבוקר עם `defaultValue="Ada"` ו-ref, וקראו אותו ב-effect. אחר כך השלימו את `useDebounce`. הדף אמור להראות שהקלדתם `linus`, חיפשתם `linus`, ושלחתם בקשה אחת בלבד, שמוצאת את Linus Torvalds.
