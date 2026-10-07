---
title: "שלב 5: בוחרים אדם ומציגים את המשימות שלו"
summary: "שומרים את המזהה הנבחר ב-state וטוענים את המשימות של אותו אדם בעזרת effect שני."
hints:
  - "שמרו רק איזה אדם נבחר (selectedId), לא עותק של האדם. פאנל הפרטים מוצא את האדם עם people.find(...), ו-effect שני טוען את המשימות בכל פעם ש-selectedId משתנה."
  - "ה-effect: useEffect(() => { ... fetch(API + '/users/' + selectedId + '/todos') ... }, [selectedId]);  בכל פריט ברשימה יש כפתור: <button type=\"button\" className=\"person-row\" onClick={() => setSelectedId(person.id)}>. הפאנל הוא <aside className=\"detail\">."
  - "const selected = people.find((person) => person.id === selectedId);  const doneCount = todos.filter((todo) => todo.done).length;  <li key={person.id} className={person.id === selectedId ? 'person selected' : 'person'}><button type=\"button\" className=\"person-row\" onClick={() => setSelectedId(person.id)}>...</button></li>   <ul className=\"todos\">{todos.map((todo) => (<li key={todo.id} className={todo.done ? 'done' : ''}>{todo.title}</li>))}</ul>"
messages:
  - "ה-effect של המשימות תלוי ב-[selectedId]."
  - "הביאו את המשימות של האדם שנבחר: API + '/users/' + selectedId + '/todos'."
  - "לחיצה על אדם צריכה לקרוא ל-setSelectedId(person.id)."
  - "מצאו את האדם שנבחר עם people.find(...)."
  - "עכשיו צריך שני effects: אחד למשתמשים ואחד למשימות."
quiz:
  - q: "למה אנחנו שומרים את selectedId ולא עותק של אובייקט האדם שנבחר?"
    options: ["אי אפשר לשמור אובייקטים ב-state", "מזהים קצרים יותר להקלדה", "כדי שיהיה רק עותק אחד של הנתונים, והפאנל תמיד יציג את הגרסה העדכנית של האדם"]
  - q: "מתי effect עם מערך התלויות [selectedId] רץ?"
    options: ["אחרי הרינדור הראשון ושוב בכל פעם ש-selectedId משתנה", "רק פעם אחת", "רק כשהקומפוננטה מוסרת"]
  - q: "למה שורת האדם היא button ולא סתם li שאפשר ללחוץ עליו?"
    options: ["כפתורים נטענים מהר יותר", "אפשר להתמקד בכפתור וללחוץ עליו במקלדת, וקוראי מסך מכריזים עליו", "לאלמנטי li אי אפשר לתת onClick"]
---

עד עכשיו ספר הכתובות הוא רשימה שטוחה. באפליקציות אמיתיות יש תבנית **master-detail**: רשימה בצד אחד, ופרטי הפריט שנבחר בצד השני. בשלב הזה תבנו אותה, ותטענו נתונים נוספים עבור האדם שנבחר בעזרת בקשה שנייה.

## איפה אנחנו עומדים

האפליקציה טוענת את האנשים, מציגה מסכי טעינה ושגיאה ומאפשרת חיפוש. אי אפשר ללחוץ על השורות ואין תצוגת פרטים.

## מה נוסיף, ולמה זה חשוב

- **בחירה** (selection): לוחצים על אדם והוא מודגש.
- **פאנל פרטים** שמציג את האימייל, התפקיד והעיר של האדם ואת המשימות (todos) שלו.
- קריאה שנייה ל-API, `GET /users/:id/todos`, שהבחירה מפעילה.

התבנית *"כשהערך הזה משתנה, הביאו נתונים קשורים"* מופיעה בכל מקום: דפי מוצר, חדרי צ'אט, פרופילי משתמשים. ב-React זה פשוט effect שמערך התלויות שלו מכיל את הערך.

## הדרכה שלב אחר שלב

**1. זוכרים איזה אדם.** שמרו את המזהה, לא את האדם כולו:

```jsx
const [selectedId, setSelectedId] = useState(DEMO_SELECTED); // 1 means Ada, null means nobody
const selected = people.find((person) => person.id === selectedId);
```

`find` מחזירה את הפריט הראשון שהפונקציה אומרת עליו true, או `undefined`. מכיוון שאובייקט האדם נמצא מחדש בכל רינדור, הפאנל אף פעם לא יציג נתונים מיושנים. בשלבים הבאים תערכו אנשים, והתכנון הזה אומר שהפאנל מתעדכן אוטומטית.

**2. effect שני למשימות.** ה-effect הראשון טוען את המשתמשים פעם אחת. זה רץ שוב לכל בחירה חדשה:

```jsx
useEffect(() => {
  if (selectedId === null) return;
  let cancelled = false;
  setTodosStatus('loading');
  fetch(API + '/users/' + selectedId + '/todos')
    .then((res) => { if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
    .then((data) => { if (!cancelled) { setTodos(data); setTodosStatus('ready'); } })
    .catch(() => { if (!cancelled) setTodosStatus('error'); });
  return () => { cancelled = true; };
}, [selectedId]);
```

הדגל `cancelled` חשוב עכשיו יותר. אם לוחצים על Ada ומיד אחר כך על Grace, התשובה האיטית יותר של Ada לא צריכה לדרוס את המשימות של Grace. לכל הרצה של ה-effect יש דגל משלה, והניקוי של ההרצה הישנה הופך אותו.

**3. הופכים שורות ללחיצות בדרך הנכונה.** שימו `button` בתוך ה-`li` ותנו לו את מטפל הלחיצה:

```jsx
<li className={person.id === selectedId ? 'person selected' : 'person'}>
  <button type="button" className="person-row" onClick={() => setSelectedId(person.id)}>
    ...
  </button>
</li>
```

`onClick={() => setSelectedId(person.id)}` עוטפת את הקריאה בפונקציה. אם תכתבו `onClick={setSelectedId(person.id)}`, הקריאה תתבצע מיד בזמן הרינדור.

**4. הפריסה.** עטפו את הרשימה ואת `aside.detail` החדש ב-`div.layout` (שתי עמודות במסכים רחבים). לפאנל יש שלושה מצבים: אף אחד לא נבחר (רמז), המשימות בטעינה, המשימות מוכנות.

**5. סופרים את המשימות שהושלמו.** `todos.filter((todo) => todo.done).length` נותנת את המספר, ואנחנו מדפיסים `1 of 3 done`. גם זה נתון נגזר, לא state.

## מה אמורים לראות

השורה של Ada מודגשת במסגרת, והפאנל מציג את הפרטים שלה ושלוש משימות: "Write the first program" מסומנת בקו חוצה, והשתיים האחרות לא. לחצו על אדם אחר וראו את הפאנל משתנה.

> **שימו לב:**
> - `onClick={setSelectedId(person.id)}` רצה מיד וגורמת ל-`Too many re-renders`. השתמשו בפונקציית חץ.
> - אם חסר `[selectedId]`, המשימות לעולם לא ייטענו מחדש כשלוחצים על מישהו אחר.
> - שימוש ב-`selected.name` לפני שהאנשים נטענו: `selected` הוא `undefined`. אנחנו מגינים על זה עם `!selected ? ... : ...`.
> - משימות של האדם הקודם מהבהבות בזמן שהחדשות נטענות. קביעת הסטטוס ל-`'loading'` בתחילת ה-effect מונעת את זה.

> **תורכם:** בצעו את ששת הערות ה-`TODO`: הוסיפו את `selectedId` (שמתחיל ב-`DEMO_SELECTED`), את ה-state בשם `todos` ואת ה-effect השני, חשבו את `selected` ואת `doneCount`, הפכו את מסך ה-ready לפריסה של שתי עמודות עם שורות שאפשר ללחוץ עליהן, ובנו את פאנל הפרטים. הדף חייב להציג את Ada Lovelace כנבחרת עם שלוש המשימות שלה ו-`1 of 3 done`.
