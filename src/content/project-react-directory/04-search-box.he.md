---
title: "שלב 4: תיבת חיפוש עם input מבוקר"
summary: "מסננים את האנשים שנטענו בזמן שהמשתמש מקליד, בעזרת state, input מבוקר ורשימה נגזרת."
hints:
  - "שני רעיונות: (1) הטקסט בתיבת החיפוש חי ב-state (input מבוקר), (2) הרשימה המסוננת אינה state חדש, היא מחושבת מ-people ומ-query בכל רינדור."
  - "const visible = people.filter((p) => p.name.toLowerCase().includes(needle) || p.city.toLowerCase().includes(needle)); כאשר needle = query.trim().toLowerCase(). ה-input צריך value={query} ו-onChange={(e) => setQuery(e.target.value)}."
  - "<input id=\"search\" className=\"search\" type=\"search\" value={query} onChange={(e) => setQuery(e.target.value)} />   <p className=\"count\">{visible.length} of {people.length} people</p>   {visible.map((person) => ( ... ))}"
messages:
  - "הפכו את ה-input למבוקר: value={query}."
  - "הוסיפו onChange כדי לעדכן את ה-state של query."
  - "קראו את הטקסט שהוקלד עם e.target.value."
  - "השוו באותיות קטנות כדי ש-'LONDON' ימצא את 'London'."
  - "עברו בלולאת map על הרשימה המסוננת (visible) ולא על כל האנשים."
  - "קבעו את FAIL_FIRST_TRY ל-false."
quiz:
  - q: "מה הופך input ל\"מבוקר\" (controlled) ב-React?"
    options: ["יש לו class של CSS", "אי אפשר לערוך אותו", "הערך שלו בא מה-state, ו-onChange מעדכן את ה-state הזה"]
  - q: "למה visible מחושב בזמן הרינדור ולא נשמר עם useState?"
    options: ["כי תמיד אפשר לחשב אותו מ-people ומ-query, ועותק שני עלול לצאת מסנכרון", "כי useState לא יכול לשמור מערכים", "כי filter מותרת רק בתוך effects"]
  - q: "מה עושה people.filter(fn)?"
    options: ["משנה את מערך people במקום", "מחזירה מערך חדש שמכיל רק את הפריטים ש-fn מחזירה עבורם true", "ממיינת את המערך"]
---

לספר כתובות עם מאות אנשים אין תועלת בלי חיפוש. בשלב הזה נוסיף תיבת חיפוש שמסננת את הרשימה בזמן ההקלדה, ונלמד שני רעיונות מהחשובים ביותר ב-React: **inputs מבוקרים** (controlled inputs) ו**נתונים נגזרים** (derived data).

## איפה אנחנו עומדים

האפליקציה טוענת חמישה אנשים מה-API, מציגה מסכי טעינה ושגיאה ומציגה את כולם ברשימה. המתג `FAIL_FIRST_TRY` עדיין דולק, ולכן היא נפתחת עם מסך השגיאה.

## מה נוסיף, ולמה זה חשוב

הקלדה בתיבה היא *state*: הטקסט משתנה עם הזמן והמסך צריך לעקוב אחריו. ב-JavaScript רגיל הדפדפן שומר את הטקסט בתוך ה-input, ואתם צריכים לקרוא אותו. ב-React הסגנון הרגיל הוא **input מבוקר**: ה-state של React הוא מקור האמת היחיד, וה-input רק מציג אותו. כך קל להשתמש בטקסט בכל מקום: לסינון, לבדיקת תקינות, לניקוי שלו ולהצגת "No results for ...".

## הדרכה שלב אחר שלב

**1. מכבים את בדיקת השגיאה.** קבעו את `FAIL_FIRST_TRY` ל-`false`. מסך השגיאה נבדק; עכשיו אנחנו רוצים אנשים.

**2. state לטקסט.**

```jsx
const [query, setQuery] = useState(DEMO_QUERY);
```

`DEMO_QUERY` הוא `'london'`. הבודק לא יודע להקליד, ולכן התיבה מתחילה כשהיא כבר מלאה. שנו אותו ל-`''` להתחלה רגילה, ואז תראו את כל חמשת האנשים.

**3. ה-input המבוקר.** שני props הופכים אותו למבוקר:

```jsx
<input
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

כל הקשה על מקש מפעילה את `onChange`. אובייקט האירוע `e` מתאר אותה, ו-`e.target.value` הוא הטקסט שנמצא עכשיו בתיבה. אנחנו שומרים אותו, React מרנדרת שוב וה-input מציג את `query`. אם נותנים ל-input את `value` בלי `onChange`, הוא הופך לקריאה בלבד ו-React מזהירה אתכם.

**4. גוזרים את הרשימה הגלויה.** אל תיצרו state שני בשביל "אנשים מסוננים". בכל פעם שאפשר לחשב משהו מ-state קיים, חשבו אותו בזמן הרינדור:

```jsx
const needle = query.trim().toLowerCase();
const visible = people.filter(
  (person) => person.name.toLowerCase().includes(needle) || person.city.toLowerCase().includes(needle)
);
```

`toLowerCase()` גורמת להתאמה להתעלם מאותיות גדולות. `includes` בודקת אם טקסט אחד מכיל טקסט אחר. המחרוזת הריקה מוכלת בכל דבר, ולכן חיפוש ריק מציג את כולם. `||` פירושו "או": התאמה בשם או בעיר מספיקה.

**5. מציגים את התוצאה בכנות.** עברו בלולאת map על `visible`, והציגו `2 of 5 people` כדי שהמשתמש יידע שמסנן פעיל. כשאין התאמות, אמרו את זה: `No people match "xyz".` רשימה ריקה בלי הסבר נראית כמו באג.

**6. תווית נגישה.** הוסיפו `label` שמקושר עם `htmlFor="search"` והמחלקה `sr-only` (מוסתרת מהעין, אבל עדיין מוקראת בקוראי מסך). placeholder לבדו אינו תווית.

## מה אמורים לראות

עם טקסט הדגמה `london` הדף מציג `2 of 5 people`: Ada Lovelace ו-Alan Turing גרים שניהם בלונדון. הקלידו משהו אחר בתיבה והרשימה תעקוב אחרי כל מקש שתלחצו.

> **שימו לב:**
> - `value={query}` בלי `onChange`: אי אפשר להקליד, וה-console מזהיר `You provided a value prop to a form field without an onChange handler`.
> - `setQuery(e.target)` שומרת את כל אלמנט ה-input. אתם רוצים את `e.target.value`.
> - סינון של `people` ושמירת התוצאה עם `setPeople(...)` זורקת את שאר האנשים לתמיד. לעולם אל תדרסו את נתוני המקור כדי לסנן.
> - מעבר בלולאת map על `people` במקום על `visible` מציג את הרשימה הלא מסוננת.
> - אותיות גדולות וקטנות: `'Ada'.includes('ada')` היא false. הפכו את שני הצדדים לאותיות קטנות.

> **תורכם:** בצעו את הערות ה-`TODO`: כבו את בדיקת הכשל, הוסיפו את ה-state בשם `query` שמתחיל ב-`DEMO_QUERY`, חשבו את `visible` עם `filter`, הוסיפו את התווית ואת ה-input המבוקר, הציגו `N of M people` ועברו בלולאת map על `visible`. עם טקסט ההדגמה הדף חייב להציג "2 of 5 people" עם Ada Lovelace ו-Alan Turing.
