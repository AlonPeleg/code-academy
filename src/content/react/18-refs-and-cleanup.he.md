---
title: "Refs וניקוי של effects"
summary: "משתמשים ב-useRef כדי להגיע לאלמנטי DOM ולזכור ערכים בלי רינדור מחדש, ומנקים טיימרים והרשמות כשאפקט מסתיים."
hints:
  - "ref הוא קופסה: useRef נותן לכם { current: ... } ש-React שומרת בין רינדורים. כששמים אותו בתכונה ref של אלמנט, current מתמלא בצומת ה-DOM אחרי הרינדור הראשון, ולכן אפשר להשתמש בו בתוך effect. שינוי של .current לעולם לא גורם לרינדור מחדש."
  - "חלק 1: <input ref={inputRef} /> ו-effect שקורא ל-inputRef.current.focus(). חלק 2: timerRef.current = setInterval(() => { ... }, 15). חלק 3: const off = bus.on((msg) => setLast(msg)); והחזירו את off כדי ש-React תוכל לבטל את ההרשמה. המספר האחרון בדף חייב להיות בדיוק מאזין אחד (listener), ולכן צריך להסיר את המאזין של החדר הישן."
  - "useEffect(() => { inputRef.current.focus(); setFocused(document.activeElement === inputRef.current); }, []);   useEffect(() => { timerRef.current = setInterval(() => { countRef.current += 1; setTicks(countRef.current); if (countRef.current >= 3) clearInterval(timerRef.current); }, 15); return () => clearInterval(timerRef.current); }, []);   useEffect(() => { const off = bus.on((msg) => setLast(msg)); return off; }, [id]);"
quiz:
  - q: "מה קורה כששינוי הערך של ref.current?"
    options: ["הקומפוננטה מתרנדרת מחדש עם הערך החדש", "שום דבר לא מתרנדר מחדש; הערך פשוט נזכר לפעם הבאה", "React זורקת שגיאה כי refs הם לקריאה בלבד"]
    explain: "refs מיועדים לערכים ש-React לא צריכה לצייר. אם המסך אמור להשתנות, השתמשו ב-state."
  - q: "מתי inputRef.current מתמלא באלמנט ה-DOM?"
    options: ["אחרי ש-React הניחה את האלמנט בדף, ולכן בתוך effects ומטפלי אירועים, לא בזמן רינדור", "לפני הרינדור הראשון בכלל, כך שאפשר לקרוא אותו בראש הקומפוננטה", "רק אחרי שהמשתמש לוחץ על הקלט"]
  - q: "מה התפקיד של הפונקציה ש-effect מחזיר?"
    options: ["היא מריצה את ה-effect פעם שנייה כדי לבדוק אותו", "היא רצה לפני שה-effect רץ שוב וכשהקומפוננטה נעלמת, כדי שתוכלו לבטל את מה ש-effect הקים", "היא מחליטה מה הקומפוננטה מרנדרת"]
  - q: "למה השיעור שומר את מזהה ה-interval ב-ref ולא במשתנה רגיל בתוך הקומפוננטה?"
    options: ["ref שורד רינדורים מחדש, ולכן רינדור מאוחר יותר או הניקוי עדיין יכולים למצוא את אותו מזהה", "כי setInterval מקבלת רק refs", "כי משתנים בתוך קומפוננטות אסורים"]
    explain: "משתנה רגיל נוצר מחדש בכל רינדור, ולכן הוא לא היה זוכר את המזהה."
messages:
  - "חברו את ה-ref לקלט:  <input ref={inputRef} ... />"
  - "העבירו פוקוס לאלמנט בתוך effect:  inputRef.current.focus();"
  - "שמרו את מזהה ה-interval ב-ref:  timerRef.current = setInterval(...)"
  - "עצרו את הטיימר עם  clearInterval(timerRef.current)."
  - "הירשמו עם bus.on(...) בתוך ה-effect של Room."
---

רוב העבודה ב-React היא "לתאר איך המסך אמור להיראות". לפעמים צריך לצאת מזה: להעביר פוקוס לתיבת טקסט, למדוד אלמנט, להתחיל טיימר, להאזין למשהו. השיעור הזה נותן לכם שני כלים לכך. **Refs** מאפשרים להחזיק דברים ש-React לא מנהלת, ו**ניקוי של effects** (effect cleanup) מבטיח שתסדרו אחרי עצמכם.

## useRef: קופסה ששורדת רינדורים

```jsx
const countRef = useRef(0);
countRef.current += 1;     // change it any time
console.log(countRef.current);
```

`useRef(initial)` מחזירה אובייקט `{ current: initial }`. React נותנת לכם את **אותו אובייקט בכל רינדור**, ויש כלל גדול אחד: שינוי של `.current` **לא** גורם לרינדור מחדש. זה הופך ref למקום הנכון לערכים שחשובים לקוד שלכם אבל לא למסך: מזהה טיימר, הערך הקודם של משהו, דגל.

השוו:

| | `useState` | `useRef` |
| --- | --- | --- |
| שורד רינדורים מחדש | כן | כן |
| שינוי שלו גורם לרינדור מחדש | כן | לא |
| משתמשים בו עבור | מה שמוצג על המסך | דברים שמאחורי הקלעים |

## Refs וה-DOM

התפקיד השני של ref הוא להצביע על אלמנט אמיתי בדף:

```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

כש-React מניחה את ה-`<input>` בדף היא שומרת את אלמנט ה-DOM האמיתי ב-`inputRef.current`. לפני הרגע הזה `current` הוא `null`, ולכן נוגעים בו בתוך **effect** (הוא רץ אחרי שהדף צויר) או מטפל אירועים, לעולם לא בזמן רינדור. מתודות שימושיות: `.focus()`, `.scrollIntoView()`, `.select()`, `.value`.

## ניקוי של effect

Effects יכולים להתחיל דברים שממשיכים לרוץ: טיימר, מאזין אירועים, חיבור לצ'אט. אם אף פעם לא עוצרים אותם הם נערמים (**דליפה**, leak) וממשיכים לעדכן קומפוננטות שכבר לא קיימות. התיקון הוא **להחזיר פונקציה** מה-effect:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);   // the cleanup
}, []);
```

React מריצה את הניקוי בשני מצבים: **לפני שה-effect רץ שוב** (כי תלות השתנתה) ו**כשהקומפוננטה מוסרת**. בתרגיל, `Room` נרשמת לערוץ הודעות עבור חדר `id`. כשהחדר משתנה מ-`a` ל-`b`, React מריצה קודם את הניקוי הישן (ביטול ההרשמה לחדר a) ואחר כך את ה-effect החדש (הרשמה לחדר b). בלי הניקוי הערוץ היה מסתיים עם שני מאזינים, והדף מדווח כמה יש.

הרגל טוב: בכל פעם ש-effect *מתחיל* משהו, שאלו "מי עוצר אותו?"

## שמים מזהה טיימר ב-ref

אם הטיימר מתחיל ב-effect ונעצר באותו effect, `const id` מקומי מספיק. ref עוזר כשמשהו אחר צריך לעצור אותו, למשל כפתור Stop או ה-callback של ה-interval עצמו. ה-`Ticker` שומר את המזהה שלו ב-`timerRef.current` וגם סופר ב-`countRef`. למה לא להשתמש ב-state של `ticks` לספירה? ה-callback של ה-interval נוצר בזמן הרינדור הראשון ו**זוכר** `ticks === 0` לנצח (זה נקרא "stale closure"). ל-ref תמיד יש את הערך הנוכחי.

> **שימו לב:**
> - `Cannot read properties of null (reading 'focus')`: השתמשתם ב-`inputRef.current` בזמן רינדור, או ששכחתם `ref={inputRef}` על האלמנט.
> - המונה ממשיך לרוץ אחרי שהקומפוננטה נעלמת והקונסולה מציגה `Can't perform a React state update on an unmounted component`: לא החזרתם ניקוי.
> - כתיבת `useEffect(async () => ...)`: פונקציית effect לא יכולה להיות async, כי היא תחזיר promise במקום פונקציית ניקוי.
> - שימוש ב-ref למשהו שצריך להיות על המסך: המסך לא יתעדכן כי שינוי של `.current` לא גורם לרינדור מחדש.

> **תורכם:** ב-`FocusInput` חברו את ה-ref והעבירו פוקוס לקלט ב-effect. ב-`Ticker` התחילו interval ששומר את המזהה שלו ב-`timerRef`, סופר עד 3 בעזרת `countRef`, ואז נעצר. ב-`Room` הירשמו לערוץ והחזירו את פונקציית ביטול ההרשמה. הדף אמור לדווח על מאזין פעיל אחד בדיוק.
