---
title: "ביצועים: memo, useCallback, useMemo"
summary: "מבינים למה קומפוננטות מתרנדרות מחדש ומדלגים על עבודה מיותרת עם memo, useCallback ו-useMemo."
hints:
  - "כברירת מחדל ילד מתרנדר מחדש בכל פעם שההורה שלו מתרנדר. memo גורם ל-React לדלג על ילד ש-props שלו שווים לפעם הקודמת, אבל פונקציה שנוצרת בתוך ההורה היא פונקציה חדשה בכל רינדור, ולכן צריך גם useCallback."
  - "ייבאו את memo, useCallback ו-useMemo מ-react. כתבו const Row = memo(function Row({ label, onSelect }) { ... }); const handleSelect = useCallback((label) => setSelected(label), []); ו-const total = useMemo(() => { sumRuns += 1; return numbers.reduce(...); }, [numbers]);"
  - "const handleSelect = useCallback((label) => { setSelected(label); }, []);   const total = useMemo(() => { sumRuns += 1; return numbers.reduce((sum, n) => sum + n, 0); }, [numbers]);   and   const Row = memo(function Row({ label, onSelect }) { ... });"
quiz:
  - q: "מתי קומפוננטת React מתרנדרת מחדש כברירת מחדל?"
    options: ["רק כש-props שלה משתנים", "רק כשהדף נטען מחדש", "כש-state שלה משתנה, או כשההורה שלה מתרנדר מחדש"]
  - q: "מה עושה memo(Component)?"
    options: ["מדלגת על רינדור מחדש של הקומפוננטה אם ה-props שלה זהים לפעם הקודמת", "שומרת את הפלט של הקומפוננטה ב-localStorage", "גורמת לקומפוננטה לרוץ ב-thread נפרד"]
  - q: "למה memo לא עוזרת כשמעבירים פונקציה inline כמו onSelect={() => ...} כ-prop?"
    options: ["פונקציות לא יכולות להיות props", "אובייקט פונקציה חדש נוצר בכל רינדור, ולכן ה-prop תמיד נראה כאילו השתנה", "memo עובדת רק עם מספרים"]
    explain: "props מושווים עם Object.is. שתי פונקציות עם אותו קוד הן עדיין אובייקטים שונים, ולכן useCallback שומרת על אותה פונקציה."
  - q: "מה ההבדל בין useMemo ל-useCallback?"
    options: ["useMemo זוכרת ערך מחושב, useCallback זוכרת פונקציה", "useMemo מיועדת ל-state ו-useCallback מיועדת ל-props", "אין הבדל"]
messages:
  - "עטפו את Row:  const Row = memo(function Row(...) { ... });"
  - "עטפו את handleSelect ב-useCallback(..., [])."
  - "עטפו את הסכום ב-useMemo(() => ..., [numbers])."
---

React מהירה כברירת מחדל, ולכן ברוב האפליקציות אף פעם לא צריך את הכלים שבשיעור הזה. אבל כשדף מרגיש איטי (רשימה ארוכה, חישוב כבד), הידיעה **למה** קומפוננטות מתרנדרות מחדש מאפשרת לתקן את זה. נלמד גם את כלל הזהב: קודם מודדים, אחר כך מייעלים.

## למה קומפוננטה מתרנדרת מחדש?

React מריצה מחדש את הפונקציה של קומפוננטה (**רינדור**, render) כאשר:

1. ה-**state** שלה השתנה, או
2. ה-**הורה** שלה התרנדר מחדש, גם אם ה-props שהיא מקבלת זהים בדיוק לקודמים.

הסיבה השנייה מפתיעה מתחילים. אם ל-`App` יש state בשם `count` והיא מרנדרת עשרה ילדים מסוג `<Row />`, כל לחיצה על כפתור המונה מריצה מחדש את `App` **ואת** כל עשר השורות. רינדור הוא רק קריאה לפונקציה שבונה תיאור של הממשק, ולכן הוא בדרך כלל זול, ו-React נוגעת בדף האמיתי רק כשמשהו באמת השתנה. זה הופך לבעיה רק אם רינדור איטי או שקורה לעיתים קרובות מאוד.

אפשר לעקוב אחרי רינדורים עם מונה `useRef`. ref שורד בין רינדורים, ושינוי שלו לא גורם לרינדור נוסף:

```jsx
const renders = useRef(0);
renders.current += 1;   // how many times this component function ran
```

## memo: מדלגים על ילד כשה-props שווים

`memo` עוטפת קומפוננטה כך ש-React משווה את ה-props החדשים לקודמים ו**מדלגת על הרינדור** אם שום דבר לא השתנה:

```jsx
const Row = memo(function Row({ label, onSelect }) {
  return <li onClick={() => onSelect(label)}>{label}</li>;
});
```

props מושווים עם `Object.is`, ולכן מחרוזות ומספרים עובדים מצוין. אבל אובייקטים, מערכים ופונקציות מושווים **לפי זהות**, לא לפי תוכן. פונקציה שנכתבת בתוך `App` היא אובייקט חדש לגמרי בכל רינדור, ולכן ילד עם memo עדיין רואה prop "ששונה".

## useCallback: שומרים על אותה פונקציה

`useCallback(fn, deps)` מחזירה את **אותו אובייקט פונקציה** בין רינדורים, עד שערך ב-`deps` משתנה:

```jsx
const handleSelect = useCallback((label) => {
  setSelected(label);
}, []);
```

כאן `[]` פירושו "לעולם אל תיצור מחדש". זה בטוח כי `setSelected` לעולם לא משתנה, והפונקציה לא קוראת שום state אחר. אם הפונקציה שלכם כן קוראת state או props, רשמו אותם ב-`deps`, אחרת היא תמשיך להשתמש בערכים ישנים.

## useMemo: זוכרים ערך מחושב

`useMemo(() => value, deps)` מריצה את הפונקציה, זוכרת את התוצאה, ומחשבת מחדש רק כשמשהו ב-`deps` משתנה:

```jsx
const total = useMemo(() => numbers.reduce((sum, n) => sum + n, 0), [numbers]);
```

השתמשו בה לעבודה יקרה באמת (מיון או סינון של אלפי פריטים), או כדי לשמור על זהות יציבה של אובייקט או מערך עבור ילד עם `memo` או תלות של effect.

## התרגיל

קוד ההתחלה מרנדר את `App` ארבע פעמים (effect מדמה שלוש לחיצות מהירות). בלי עזרה, כל `Row` מתרנדר ארבע פעמים והסכום מחושב ארבע פעמים. אחרי שתוסיפו `memo`, `useCallback` ו-`useMemo`, כל שורה מתרנדרת פעם אחת והסכום מחושב פעם אחת, לא משנה כמה פעמים `App` מתעדכן.

## מתי לייעל

- אל תעטפו הכול: ה-hooks האלה עולים בזיכרון והופכים את הקוד לקשה יותר לקריאה.
- מדדו קודם עם לשונית "Profiler" של React DevTools בדפדפן.
- תיקון זול יותר הוא לעיתים קרובות מבני: מזיזים state למטה אל הקומפוננטה הקטנה שצריכה אותו, כך שפחות דברים מתרנדרים מחדש.

> **שימו לב:**
> - `memo` יחד עם prop של פונקציית חץ inline: הילד עדיין מתרנדר מחדש בכל פעם. עטפו את הפונקציה ב-`useCallback`.
> - תלות חסרה ב-`useCallback` או ב-`useMemo` גורמת לנתונים ישנים: הפונקציה ממשיכה להשתמש ב-state ישן. הלינטר מזהיר `React Hook useCallback has a missing dependency`.
> - קריאה ל-`useMemo` עבור משהו זול כמו `a + b`: הניהול הפנימי עולה יותר ממה שהוא חוסך.
> - `useMemo is not defined`: ייבאו אותה עם `import { useMemo } from 'react';`.
> - תופעת לוואי (בקשה, שינוי משתנה) בתוך `useMemo`: היא צריכה רק לחשב. React עשויה לקרוא לה שוב מתי שתרצה.

> **תורכם:** עטפו את `Row` ב-`memo`, עטפו את `handleSelect` ב-`useCallback(..., [])`, ועטפו את הסכום ב-`useMemo(..., [numbers])`. כל שורה אמורה להציג `rendered 1x` והדף אמור לומר `Sum computed: 1 time(s)`.
