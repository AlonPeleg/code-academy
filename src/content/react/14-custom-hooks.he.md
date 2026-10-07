---
title: "Custom hooks"
summary: "אורזים state ו-effects בפונקציות use... משלכם שאפשר להשתמש בהן שוב ושוב."
hints:
  - "custom hook הוא פונקציה רגילה ששמה מתחיל ב-use ושקוראת ל-hooks אחרים בתוכה. היא מחזירה את מה שהקומפוננטה צריכה: מערך עבור useToggle, אובייקט עבור useCounter."
  - "useToggle: const [on, setOn] = useState(initial); function toggle() { setOn(!on); } והחזירו [on, toggle]. useCounter: const [count, setCount] = useState(start); ב-increment השתמשו ב-setCount(c => c + step); ב-reset השתמשו ב-setCount(start)."
  - "function useToggle(initial) { const [on, setOn] = useState(initial); return [on, () => setOn(!on)]; }   function useCounter(start, step) { const [count, setCount] = useState(start); const increment = () => setCount((c) => c + step); const reset = () => setCount(start); return { count, increment, reset }; }"
quiz:
  - q: "מה הופך פונקציה ל-custom hook?"
    options: ["שמה מתחיל ב-use והיא יכולה לקרוא ל-hooks אחרים", "היא מיוצאת מקובץ משלה", "היא מחזירה JSX"]
  - q: "אם שתי קומפוננטות קוראות שתיהן ל-useToggle(), האם הן חולקות את אותו ערך on/off?"
    options: ["כן, hooks חולקים state באופן גלובלי", "רק אם הן אחיות (siblings)", "לא, כל קריאה יוצרת state פרטי משלה"]
    explain: "custom hook חולק לוגיקה, לא state. כל קומפוננטה שקוראת לו מקבלת עותק נפרד של ה-state שבפנים."
  - q: "למה השיעור משתמש ב-setCount((c) => c + step) ולא ב-setCount(count + step)?"
    options: ["זה קצר יותר", "שתי הגדלות באותו רגע היו קוראות את אותו count ישן, והצורה הפונקציונלית משתמשת בערך העדכני ביותר", "הצורה הראשונה היא שגיאת תחביר"]
  - q: "איפה מותר לקרוא ל-hooks כמו useState?"
    options: ["בכל מקום, אפילו בתוך משפטי if ולולאות", "רק בתוך מטפלי אירועים", "רק ברמה העליונה של קומפוננטה או של hook אחר"]
messages:
  - "useToggle צריך לקרוא ל-useState בתוכו."
  - "useCounter צריך לקרוא ל-useState בתוכו."
  - "useCounter צריך להחזיר אובייקט:  return { count, increment, reset };"
---

כבר השתמשתם ב-hooks כמו `useState` ו-`useEffect`. החלק הכי טוב ב-hooks הוא שאפשר לכתוב **hooks משלכם**. custom hook הוא הדרך לקחת לוגיקה שאתם מעתיקים שוב ושוב (מתג, מונה, טעינת נתונים) ולתת לה שם, כך שכל קומפוננטה יכולה להשתמש בה בשורה אחת.

## מה זה custom hook

custom hook הוא פשוט פונקציה ש:

1. שמה מתחיל ב-`use` (כך React והלינטר שלה מזהים אותה), ו
2. קוראת ל-hooks אחרים בתוכה (`useState`, `useEffect`, ...).

זה הכול. אין API מיוחד. הנה הדוגמה הקלאסית:

```jsx
function useToggle(initial) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(!on);
  return [on, toggle];
}

function LightSwitch() {
  const [on, toggle] = useToggle(true);
  return <button onClick={toggle}>{on ? "on" : "off"}</button>;
}
```

`useToggle` מקבל את ערך ההתחלה, מחזיק חלק של state, ומחזיר את מה שהקומפוננטה צריכה. החזרת **מערך** (כמו ש-`useState` עושה) מאפשרת למי שקורא לבחור שמות כלשהם בפירוק (destructuring). החזרת **אובייקט** (`{ count, increment, reset }`) עדיפה כשיש שלושה דברים או יותר, כי מי שקורא יכול לבחור רק את אלה שהוא צריך.

## הלוגיקה משותפת, ה-state לא

קריאה ל-`useToggle()` בשתי קומפוננטות לא גורמת להן לחלוק ערך אחד. כל קריאה יוצרת **state פרטי משלה**, בדיוק כמו קריאה ל-`useState` פעמיים. custom hook חולק את ה*מתכון*, לא את ה*תוצאה*. (כדי לשתף ערך בין קומפוננטות, השתמשו בהרמת state למעלה או ב-context.)

## הצורה הפונקציונלית של ה-setter

במונה כדאי לכתוב `setCount((c) => c + step)` במקום `setCount(count + step)`. הראשונה נותנת ל-React פונקציה שמקבלת את ה-state **העדכני ביותר**. השנייה משתמשת ב-`count` מהרינדור שאתם נמצאים בו, ולכן אם קוראים לה פעמיים ברצף, הצעד מתווסף רק פעם אחת:

```jsx
increment(); increment();     // with setCount(count + step): 10 -> 15 (not 20)
                              // with setCount(c => c + step): 10 -> 20
```

התרגיל מריץ בדיוק את הבדיקה הזו עם `QuickStepper`.

## עוד שני hooks שכדאי להכיר

**state בסגנון useLocalStorage** שומר ערך באחסון של הדפדפן, וחוזר ל-state רגיל אם האחסון חסום (חלונות פרטיים, תצוגות מקדימות):

```jsx
function useStoredState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initial : JSON.parse(saved);
    } catch (e) {
      return initial;            // storage unavailable: plain in-memory state
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }, [key, value]);
  return [value, setValue];
}
```

`useState(() => ...)` עם פונקציה נקרא **אתחול עצל** (lazy initialisation): הפונקציה רצה רק ברינדור הראשון. ה-`try / catch` שומר שהאפליקציה תמשיך לעבוד כשהאחסון זורק שגיאה.

**useFetch** עוטף טעינת נתונים (state עבור `data`, `loading`, `error` ו-effect עם `fetch`). תבנו את התבנית הזו בשיעור על טעינת נתונים, וברגע שהיא נמצאת ב-hook, כל קומפוננטה צריכה רק `const { data, loading, error } = useFetch(url)`.

## כללי ה-hooks

- קראו ל-hooks רק ב**רמה העליונה** של קומפוננטה או של hook אחר: לעולם לא בתוך `if`, לולאות או פונקציות מקוננות.
- קראו להם רק מקומפוננטות או מ-custom hooks, לעולם לא מפונקציות רגילות או ממטפלי אירועים.
- התחילו תמיד את השם ב-`use`.

> **שימו לב:**
> - hook שנקרא בתנאי: `React has detected a change in the order of Hooks called`.
> - קריאה ל-hook בפונקציה רגילה ששמה לא מתחיל ב-`use...`: `Invalid hook call`.
> - שכחת `return` של הערכים מה-hook, ואז הקומפוננטה מציגה `TypeError: useToggle is not a function or its return value is not iterable` (עבור מערך) או `Cannot destructure property 'count' of undefined`.
> - ציפייה ששתי קומפוננטות יחלקו מונה אחד רק כי הן משתמשות באותו hook.

> **תורכם:** כתבו את `useToggle(initial)` שמחזיר `[on, toggle]` ואת `useCounter(start, step)` שמחזיר `{ count, increment, reset }` (השתמשו ב-setter הפונקציונלי). הדף אמור להציג `Lights: on`, `Count: 10` ו-`Quick count: 20`.
