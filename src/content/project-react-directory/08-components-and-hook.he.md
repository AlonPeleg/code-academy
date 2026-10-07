---
title: "שלב 8: מפרקים לרכיבים ול-hook בשם useUsers"
summary: "מפצלים את האפליקציה המוכנה לרכיבים קטנים ול-hook מותאם אישית, בלי לשנות את מה שהיא עושה."
hints:
  - "מעבירים קוד, לא כותבים מחדש. ב-useUsers.js נמצאים ה-state של המשתמשים וה-effect הגדול של הבקשה, והוא מחזיר את מה ש-App צריכה; ב-UserList.jsx נמצאים תיבת החיפוש וה-ul; ב-UserDetail.jsx נמצאים ה-aside, CityForm וה-effect של המשימות. כל קובץ מסתיים ב-export, ו-App מייבאת אותם."
  - "hook מותאם אישית הוא פונקציה רגילה ששמה מתחיל ב-use ושקוראת ל-hooks אחרים. export function useUsers(page, pageSize) { const [people, setPeople] = useState([]); ... useEffect(...); return { people, total, status, error, retry, replaceUser }; }  ב-App: const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);"
  - "App.jsx: import { useUsers, API } from './useUsers'; import UserList from './UserList'; import UserDetail from './UserDetail';   <UserList people={people} total={total} query={query} onQueryChange={setQuery} selectedId={selectedId} onSelect={setSelectedId} />   <UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />"
messages:
  - "ב-useUsers.js כתבו: export function useUsers(page, pageSize) { ... }"
  - "ה-effect של הבקשה נמצא עכשיו בתוך ה-hook."
  - "בנו את הכתובת המעומדת בתוך ה-hook."
  - "החזירו מה-hook אובייקט עם people, status והערכים האחרים."
  - "סיימו את UserList.jsx עם: export default UserList;"
  - "סיימו את UserDetail.jsx עם: export default UserDetail;"
  - "בקשת המשימות שייכת ל-UserDetail."
  - "ייבאו את ה-hook ב-App.jsx: import { useUsers, API } from './useUsers';"
  - "ייבאו את UserList ב-App.jsx."
  - "ייבאו את UserDetail ב-App.jsx."
  - "App.jsx כבר לא אמורה לבנות את הכתובת המעומדת: זו העבודה של ה-hook."
quiz:
  - q: "מהו hook מותאם אישית (custom hook)?"
    options: ["פונקציה ששמה מתחיל ב-use ושקוראת ל-hooks אחרים, כך שאפשר לעשות שימוש חוזר בלוגיקה עם state ולהוציא אותה מהרכיבים", "סוג מיוחד של רכיב", "פונקציה מובנית של React להבאת נתונים"]
  - q: "מה המטרה של ארגון מחדש (refactoring) כמו זה?"
    options: ["לשנות את מה שהאפליקציה עושה", "להפוך את הקוד לקל יותר לקריאה, לבדיקה ולשינוי, כשההתנהגות נשארת בדיוק אותו דבר", "להגדיל את ה-bundle"]
  - q: "למה UserList מקבל את query ואת onQueryChange כ-props ולא שומר state משלו לטקסט החיפוש?"
    options: ["props תמיד מהירים יותר", "React אוסרת state ברכיבי בן", "ה-state נשאר ב-App, ולכן הוא שורד בזמן שהדף נטען ו-UserList מוחלף בהודעת הטעינה"]
    explain: "state שייך להורה הקרוב ביותר שצריך לשמור אותו. הרשימה נעלמת בזמן שדף חדש נטען, וה-state שלה היה נעלם איתה."
---

ספר הכתובות שלכם עובד. עכשיו מגיע השלב שמבדיל בין פרויקט של תלמיד לקוד מקצועי: **להפוך אותו לנוח לעבודה**. קובץ יחיד של 250 שורות שמערבב קריאות רשת, טפסים ופריסה קשה לקריאה ומפחיד לשנות. בשלב האחרון הזה תפצלו אותו ל-hook מותאם אישית ולשלושה רכיבים. שום דבר לא ישתנה על המסך, וזה הרעיון.

## איפה אנחנו עומדים

`App.jsx` עושה הכול: טוענת משתמשים עם עימוד ושגיאות, מתחברת, שומרת ערים, טוענת משימות, מחפשת ומציירת את כל אלה. היא עובדת, אבל כשרוצים לשנות משהו צריך לקרוא הכול.

## מה נוסיף, ולמה זה חשוב

*ארגון מחדש* (refactoring) פירושו שינוי המבנה של הקוד בלי לשנות את ההתנהגות שלו. שני כלים עושים את רוב העבודה ב-React:

- **רכיבים** (components) מפצלים את *המסך*: כל אחד מקבל נתונים דרך props ומחזיר JSX. לרכיבים קטנים יש שם ברור ותפקיד אחד, וקל להשתמש בהם שוב.
- **hooks מותאמים אישית** מפצלים את *הלוגיקה*: פונקציה בשם `useSomething` שמשתמשת בתוכה ב-`useState` וב-`useEffect` ומחזירה את התוצאות. רכיב שקורא ל-`useUsers(page, 2)` לא צריך לדעת שקיימים fetch, כותרות וביטול.

כשחברי הצוות צריכים את רשימת המשתמשים בדף אחר, הם קוראים לאותו hook במקום להעתיק 40 שורות.

## הדרכה שלב אחר שלב

**1. מוציאים את ה-hook, `useUsers.js`.** גזרו מ-`App.jsx` את ה-state של המשתמשים (`people`, `total`, `status`, `error`, `attempt`), את ה-effect הגדול ואת המתג `FAIL_FIRST_TRY` והדביקו אותם בתוך פונקציה:

```jsx
export function useUsers(page, pageSize) {
  const [people, setPeople] = useState([]);
  // ... the other state and the fetch effect, now using pageSize ...
  function retry() { setAttempt(attempt + 1); }
  function replaceUser(user) { setPeople((list) => list.map((p) => (p.id === user.id ? user : p))); }
  return { people, total, status, error, retry, replaceUser };
}
```

הכללים של hooks עדיין תקפים: קראו ל-hooks ברמה העליונה של הפונקציה ולעולם לא בתוך תנאים או לולאות. ה-hook מקבל את `page` ואת `pageSize` כארגומנטים, וה-effect שלו תלוי בהם. בנוסף, עשו `export const API` מהקובץ הזה כדי ששאר הקבצים יוכלו להשתמש שוב בכתובת.

**2. משתמשים בו ב-`App`.** שורה אחת מחליפה בערך חמישים:

```jsx
const { people, total, status, error, retry, replaceUser } = useUsers(page, PAGE_SIZE);
```

זה *פירוק* (destructuring): הוא שולף את התכונות מהאובייקט המוחזר אל משתנים. עכשיו `saveCity` קוראת ל-`replaceUser(updated)` במקום ל-`setPeople`.

**3. מוציאים את `UserList.jsx`.** הוא מקבל הכול כ-props ומדווח על אירועים כלפי מעלה:

```jsx
function UserList({ people, total, query, onQueryChange, selectedId, onSelect }) { ... }
export default UserList;
```

הוא מחשב את `visible` בעצמו, כי רק הרשימה מתעניינת בו. טקסט החיפוש נשאר ב-`App` (הרמת state כלפי מעלה, lifting state up): בזמן שדף חדש נטען, `App` מציגה את הודעת הטעינה והרשימה מוסרת מהמסך, וכל state שבתוכה היה נזרק.

**4. מוציאים את `UserDetail.jsx`.** הפאנל הוא הבעלים של ה-state של המשימות ושל ה-effect של המשימות (התלות שלו היא המזהה של האדם, ולכן הוא נטען מחדש כשהבחירה משתנה). `CityForm` הקטן עובר איתו, כי אף אחד אחר לא משתמש בו. הוא מייבא את `API` מקובץ ה-hook.

**5. מחברים הכול.** `App` שומרת את מה שחייב להיות משותף: דף, חיפוש, בחירה, טוקן, הודעה, התחברות, שמירה והדגמה. ה-JSX שלה נעשה קצר וקריא:

```jsx
<UserList people={people} total={total} query={query} onQueryChange={setQuery} selectedId={selectedId} onSelect={setSelectedId} />
<UserDetail person={selected} canSave={Boolean(token)} notice={notice} onSave={saveCity} />
```

**6. בודקים שדבר לא השתנה.** הדף חייב להציג בדיוק מה שהציג בשלב 7. הבדיקה קוראת גם את הקבצים שלכם: ה-hook חייב להכיל את לוגיקת הבקשה ואת הכתובת המעומדת, ו-`App.jsx` חייבת לייבא את שלושת המודולים החדשים.

> **שימו לב:**
> - אם שוכחים את `export default UserList;` מקבלים `Cannot read properties of undefined` או שגיאת רכיב `undefined`, בהתאם לייבוא.
> - שם של hook חייב להתחיל ב-`use`. בלי זה הכלים של כללי ה-hooks לא יכולים להגן עליכם.
> - העברת state לרכיב בן שמוסר מאפסת אותו (כמו טקסט החיפוש). החליטו מי הבעלים של כל חלק ב-state.
> - נתיבי ייבוא: `'./useUsers'` ו-`'./UserList'` צריכים את ה-`./`. בלעדיו React חושבת שהתכוונתם לחבילה.
> - עשו ארגון מחדש בצעדים קטנים והריצו אחרי כל אחד: העבירו חלק אחד, בדקו את הדף, העבירו את הבא.

> **תורכם:** בצעו את הערות ה-TODO בארבעת הקבצים: כתבו את `useUsers.js`, את `UserList.jsx` ואת `UserDetail.jsx` עם הקוד שהוצא מ-`App.jsx`, ואז פשטו את `App.jsx` כך שתייבא ותשתמש בהם. הדף עדיין חייב להיפתח על דף 2 כש-Alan Turing נבחר, נשמר כ-Cambridge, ו-`Page 2 of 3`.

## מה לבנות הלאה

בניתם צד לקוח (front end) שלם ומציאותי. רעיונות להמשך: שלחו את טקסט החיפוש לשרת עם `?q=` והוסיפו השהיה קצרה (debounce) בזמן ההקלדה; הוסיפו טופס "New person" עם `POST /users` וכפתור Delete עם `DELETE /users/:id`; סמנו משימות כהושלמו עם `PATCH /todos/:id`; שמרו את האדם הנבחר ואת הדף בכתובת; כתבו hook בשם `useTodos(personId)`; והחליפו את ההתחברות של ההדגמה בטופס התחברות אמיתי ששומר את הטוקן. הפרויקט הבא באקדמיה, ספריית לקוח ל-API (API Client Library), מראה איך לבנות עוזר בקשות מסודר עם ניסיונות חוזרים ושגיאות מוגדרות, שהאפליקציה הזו יכולה לשתף.
