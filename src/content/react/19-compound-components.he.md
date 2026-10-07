---
title: "קומפוננטות מורכבות ו-render props"
summary: "בונים קומפוננטות גמישות שעובדות יחד דרך context, וקומפוננטות שנותנות למי שקורא להחליט מה לצייר באמצעות העברת פונקציה כ-children."
hints:
  - "בקומפוננטה מורכבת (compound component) ההורה שומר את ה-state ומשתף אותו דרך context; כל ילד קורא את מה שהוא צריך עם useContext (כאן ה-helper בשם useTabsContext). render prop הוא פשוט prop (כאן children) שהערך שלו הוא פונקציה שאתם קוראים לה."
  - "Tab: const { active, setActive } = useTabsContext(); החזירו button עם role=\"tab\", aria-selected={active === value} ו-onClick={() => setActive(value)}. Panel: if (active !== value) return null; אחרת div עם role=\"tabpanel\". Toggle: useState(initial), ואז החזירו children({ on, toggle })."
  - "function Tab({ value, children }) { const { active, setActive } = useTabsContext(); return <button role=\"tab\" aria-selected={active === value} onClick={() => setActive(value)}>{children}</button>; }   function Toggle({ initial = false, children }) { const [on, setOn] = useState(initial); return children({ on, toggle: () => setOn(!on) }); }"
quiz:
  - q: "בקומפוננטה מורכבת כמו Tabs, איך Tab ו-Panel יודעים איזו לשונית פעילה?"
    options: ["ההורה מעביר props לכל אחד ביד", "הם קוראים את ה-state המשותף מ-context ש-Tabs ההורה מספק", "הם מחפשים ב-DOM את הכפתור הנבחר"]
  - q: "מה זה render prop?"
    options: ["prop שמחזיק פונקציה שהקומפוננטה קוראת לה כדי לגלות מה לצייר", "תכונת CSS ש-React מרנדרת", "prop שזמין רק בזמן הרינדור הראשון"]
    explain: "הקומפוננטה מחזיקה את הלוגיקה (state, טיימרים, נתונים) ומי שקורא מחזיק את המראה."
  - q: "למה הקומפוננטה Toggle מחזירה children({ on, toggle }) ולא JSX משלה?"
    options: ["כי קומפוננטות חייבות תמיד להחזיר פונקציות", "כדי שה-toggle ירוץ מהר יותר", "כדי שכל מי שקורא יוכל לצייר את מצב ה-on/off בדרך שלו, בזמן ש-Toggle רק מספקת את הלוגיקה"]
  - q: "מה היתרון המרכזי של Tabs.Tab ו-Tabs.Panel על פני קומפוננטת Tabs אחת עם prop ענק בשם tabs?"
    options: ["מי שקורא שולט בסדר ובתוכן של החלקים עם JSX רגיל, ויכול להוסיף כל דבר ביניהם", "זה משתמש בפחות זיכרון", "קומפוננטות מורכבות הן הדרך היחידה להשתמש ב-context"]
messages:
  - "קראו את ה-state המשותף ב-Tab וב-Panel עם  const { active } = useTabsContext();"
  - "סמנו את הלשונית הפעילה עבור קוראי מסך:  aria-selected={active === value}"
  - "קראו לפונקציית ה-children ותנו לה אובייקט:  children({ on, toggle })"
---

יש קומפוננטות שיש להן משמעות רק כצוות. ל-`<select>` צריך אלמנטי `<option>`, לטבלה צריך שורות. ב-React אפשר לתכנן קומפוננטות משלכם באותה דרך: **הורה** שמחזיק את ה-state ו**ילדים** ששיתפו איתו פעולה. ואפשר ללכת צעד אחד קדימה ולתת למי שקורא להחליט מה מצויר. שתי התבניות מופיעות בספריות אמיתיות (תפריטים, אקורדיונים, ספריות טפסים), ולכן זיהוי שלהן הופך קוד של אחרים לקל הרבה יותר לקריאה.

## קומפוננטות מורכבות (Compound components)

דמיינו ווידג'ט של לשוניות (tabs). התכנון הראשון שעולה לראש הוא קומפוננטה אחת עם prop של הגדרות:

```jsx
<Tabs tabs={[{ id: "a", title: "A", content: "..." }, { id: "b", title: "B", content: "..." }]} />
```

זה עובד עד שרוצים אייקון באחת הכותרות, או קישור בין שני פאנלים. ממשיכים להוסיף props. תבנית **הקומפוננטות המורכבות** הופכת את ה-prop הגדול לחלקים קטנים שמי שקורא מסדר ב-JSX רגיל:

```jsx
<Tabs defaultValue="billing">
  <Tabs.Tab value="profile">Profile</Tabs.Tab>
  <Tabs.Tab value="billing">Billing</Tabs.Tab>
  <Tabs.Panel value="profile">...</Tabs.Panel>
  <Tabs.Panel value="billing">...</Tabs.Panel>
</Tabs>
```

איך החלקים מדברים זה עם זה? דרך **context** (ראו את השיעור על context). `Tabs` יוצרת את ה-state ומפרסמת אותו עם Provider. `Tab` ו-`Panel` קוראות ל-`useContext` כדי לקרוא אותו. אף אחת מהן לא מקבלת שום דבר ביד, ולכן מי שקורא יכול לשים אותן בכל מקום בתוך `Tabs`.

הנקודות המצחיקות (`Tabs.Tab`) הן רק תחבולת שמות. פונקציה היא אובייקט ב-JavaScript, ולכן אפשר לצרף לה תכונות: `Tabs.Tab = Tab;`. זה אומר לקורא "החלקים האלה שייכים יחד".

נגיעה ידידותית היא hook עזר שזורק שגיאה ברורה כשחלק משמש מחוץ להורה שלו:

```jsx
function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tab and Panel must be used inside <Tabs>");
  return context;
}
```

פרט נוסף: `aria-selected` ו-`role="tab"` אומרים לקוראי מסך איזו לשונית נבחרה, ולכן בנייה נכונה של התבנית הופכת את הקומפוננטה שלכם גם לנגישה.

## Render props

לפעמים לקומפוננטה יש **לוגיקה** שימושית אבל היא לא צריכה להחליט איך הדברים נראים. מתג (toggle) זוכר on/off. דף אחד רוצה מנורה, דף אחר רוצה דלת. הפתרון הוא לקבל **פונקציה** ממי שקורא ולקרוא לה:

```jsx
function Toggle({ initial = false, children }) {
  const [on, setOn] = useState(initial);
  return children({ on, toggle: () => setOn(!on) });
}

<Toggle>
  {({ on, toggle }) => <button onClick={toggle}>{on ? "ON" : "OFF"}</button>}
</Toggle>
```

קראו לאט. כל מה ששמים בין `<Toggle>` ל-`</Toggle>` הופך ל-prop בשם `children`. כאן זה לא JSX אלא **פונקציית חץ**. `Toggle` קוראת לה עם אובייקט ומחזירה את התוצאה כפלט שלה. פונקציית החץ משתמשת ב**פירוק** (destructuring) (`({ on, toggle })`) כדי לשלוף את שני הערכים. כל prop יכול להחזיק את הפונקציה (גם `render={...}` נפוץ), אבל `children` הוא הבחירה הפופולרית.

כיום רוב האנשים פונים ל-**custom hook** (`useToggle`) למשימה הזו, ו-hooks בדרך כלל פשוטים יותר. Render props עדיין זורחים כשהפונקציה צריכה להיות ממוקמת בתוך ה-JSX, ותפגשו אותם בקוד ישן יותר ובספריות.

> **שימו לב:**
> - `Element type is invalid: expected a string ... but got: undefined`: כתבתם `<Tabs.Tab>` אבל שכחתם לצרף `Tabs.Tab = Tab`, או שטעיתם באיות השם.
> - `children is not a function`: השתמשתם ב-`<Toggle>` עם JSX רגיל בפנים, אבל `Toggle` קוראת ל-children שלה כפונקציה.
> - `Cannot destructure property 'active' of ... as it is null`: `Tab` נמצאת מחוץ ל-`<Tabs>` ולכן אין Provider. ה-hook העוזר עם הודעת שגיאה ברורה מונע את החידה הזו.
> - פאנל שנשאר ריק או כפתור שלא עושה כלום: בדקו ש-`Panel` משווה את אותן מחרוזות `value` שכפתורי `Tab` משתמשים בהן (`"billing"` הוא לא `"Billing"`). כדי לא לצייר כלום, כתבו `return null;`.

> **תורכם:** כתבו את `Tab` (כפתור עם `role="tab"`, `aria-selected` ומטפל לחיצה שבוחר אותו), את `Panel` (מרנדרת רק כשהיא הפעילה) ואת `Toggle` (שומרת state וקוראת ל-`children({ on, toggle })`). הדף אמור להציג את פאנל החיוב (billing), אור דולק ודלת סגורה.
