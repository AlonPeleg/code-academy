---
title: "אפקטים עם useEffect"
summary: "מריצים קוד אחרי הרינדור כדי לסנכרן את הדף עם דברים מחוץ ל-React, כמו כותרת הלשונית."
hints:
  - "useEffect מקבלת פונקציה ש-React מריצה אחרי שציירה את הדף, ומערך תלויות שאומר מתי להריץ אותה שוב. זכרו לייבא אותה מ-react."
  - "בתוך האפקט בצעו השמה של מחרוזת תבנית (template string) עם count אל document.title, ואז העבירו את document.title אל setTitle. מערך התלויות מכיל את count."
  - "useEffect(() => { document.title = `Clicked ${count} times`; setTitle(document.title); }, [count]);"
messages:
  - "ייבאו אותה:  import { useState, useEffect } from 'react';"
  - "קראו ל-useEffect(() => { ... }, [count]);"
  - "קבעו את כותרת הדפדפן:  document.title = ..."
  - "הוסיפו את מערך התלויות אחרי הפונקציה:  }, [count]);"
quiz:
  - q: "מתי הפונקציה שבתוך useEffect רצה?"
    options: ["לפני שהרכיב מתרנדר", "אחרי שהרכיב התרנדר", "רק כשסוגרים את הדף"]
  - q: "מה פירושו של מערך תלויות ריק, כמו ב-  useEffect(fn, []) ?"
    options: ["האפקט אף פעם לא רץ", "האפקט רץ אחרי כל רינדור", "האפקט רץ פעם אחת, אחרי הרינדור הראשון"]
  - q: "מה פירוש  [count]  בתור מערך התלויות?"
    options: ["להריץ את האפקט שוב בכל פעם ש-count משתנה", "להריץ את האפקט count פעמים", "להעביר את count לאפקט בתור ארגומנט"]
  - q: "איזו משימה מתאימה ל-useEffect?"
    options: ["חישוב ערך להצגה ב-JSX", "סנכרון עם העולם החיצון, כמו כותרת המסמך", "חיבור של שני מספרים"]
    explain: "אם אפשר לחשב משהו בזמן הרינדור, פשוט עשו את זה שם. אפקטים נועדו לדבר עם דברים שמחוץ ל-React."
---

התפקיד העיקרי של רכיב ב-React הוא **לחשב איך המסך צריך להיראות** לפי ה-props וה-state שלו. אבל לפעמים צריך לעשות משהו בעולם שבחוץ: לשנות את כותרת הלשונית של הדפדפן, להתחיל טיימר, לטעון נתונים משרת, להירשם למשהו. את הדברים האלה קוראים **תופעות לוואי** (side effects), ו-React נותנת לכם בשבילן את ה-hook בשם `useEffect`.

## הצורה של useEffect

```jsx
import { useState, useEffect } from 'react';

function Page() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Clicked ${count} times`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click me</button>;
}
```

מפרקים את זה לחלקים:

1. `useEffect(fn, deps)` מקבלת שני ארגומנטים: פונקציה ורשימה.
2. React קודם מרנדרת את הרכיב ומעדכנת את הדף. **אחרי זה** היא קוראת לפונקציה שלכם. בגלל זה בטוח לגעת שם בדברים שמחוץ ל-React.
3. `document.title = ...` משנה את הטקסט של לשונית הדפדפן, שבכלל לא חלק מה-JSX של הרכיב שלכם. זה מה שהופך את זה לאפקט.
4. `[count]` הוא **מערך התלויות** (dependency array). React זוכרת אותו, ובפעם הבאה מריצה את האפקט שוב רק אם אחד מהערכים ברשימה השתנה.

## מערך התלויות

| מה כותבים | מתי האפקט רץ |
| --- | --- |
| `useEffect(fn, [])` | פעם אחת, אחרי הרינדור הראשון |
| `useEffect(fn, [count])` | אחרי הרינדור הראשון, ושוב בכל פעם ש-`count` משתנה |
| `useEffect(fn)` | אחרי כל רינדור |

כלל טוב: רשמו כל prop או משתנה state שפונקציית האפקט משתמשת בו. אם האפקט משתמש ב-`count`, שימו את `count` במערך.

## גם אפקטים יכולים לקבוע state

אפקט יכול לקרוא מהעולם החיצון ולשמור ב-state, וזה גורם לזה להופיע על המסך:

```jsx
const [title, setTitle] = useState("");

useEffect(() => {
  document.title = `Clicked ${count} times`;
  setTitle(document.title);
}, [count]);

return <p>Tab title: {title}</p>;
```

הרינדור הראשון מציג כותרת ריקה, ואז האפקט רץ, קובע את ה-state, ו-React מרנדרת שוב עם הכותרת מלאה. זה קורה כל כך מהר שלעולם לא רואים את המצב הריק.

## ניקוי

אפקט יכול להחזיר פונקציה ש-React קוראת לה לפני ההרצה הבאה, או כשהרכיב נעלם. משתמשים בה כדי לבטל דברים כמו טיימרים או הרשמות:

```jsx
useEffect(() => {
  const id = setInterval(() => console.log("tick"), 1000);
  return () => clearInterval(id);   // cleanup
}, []);
```

## להמשך

Hooks הם פשוט פונקציות שמתחילות ב-`use`. אפשר לארוז לוגיקה משלכם, כמו `useDocumentTitle(count)`, ב-**hook מותאם אישית** (custom hook) ולהשתמש בו מחדש בהרבה רכיבים.

> **שימו לב:**
> - שכחתם את מערך התלויות. בלעדיו האפקט רץ אחרי כל רינדור, ואפקט שקובע state היה נכנס ללולאה אינסופית.
> - השמטתם ערך שהאפקט משתמש בו, ולכן הוא ממשיך להציג נתונים ישנים. הודעת ה-linter אומרת `React Hook useEffect has a missing dependency`.
> - שימוש באפקט למשהו שאפשר לחשב בזמן הרינדור. חשבו אותו בגוף הרכיב במקום.
> - `useEffect is not defined`: ייבאו אותה עם `import { useState, useEffect } from 'react';`.

> **תורכם:** ייבאו את `useEffect`, קבעו את `document.title` ל-`Clicked {count} times` כש-`count` משתנה, והעתיקו אותו ל-state בשם `title` כך שהדף יציג `Tab title: Clicked 0 times`.
