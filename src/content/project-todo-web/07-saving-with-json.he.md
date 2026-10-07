---
title: "שלב 7: שמירה ושחזור עם JSON"
summary: "הופכים את מערך המשימות לטקסט JSON, שומרים אותו, ומחזירים אותו בביקור הבא."
messages:
  - "הפכו את המערך לטקסט עם JSON.stringify(tasks)."
  - "החזירו את הטקסט השמור לנתונים עם JSON.parse(text)."
  - "שמרו עם storage.setItem(STORAGE_KEY, text)."
  - "טענו עם storage.getItem(STORAGE_KEY)."
  - "עטפו את JSON.parse ב-try / catch: טקסט שמור עלול להיפגם."
hints:
  - "אפשר לשמור באחסון רק טקסט, ולכן צריך שני מתרגמים: JSON.stringify הופכת את המערך לטקסט, ו-JSON.parse הופכת טקסט בחזרה למערך. שמרו בכל פעם שהמשימות משתנות (הוספה, סימון, מחיקה)."
  - "saveTasks: const text = JSON.stringify(tasks); storage.setItem(STORAGE_KEY, text); savedJson.textContent = text;  loadTasks: const text = storage.getItem(STORAGE_KEY); if (text === null) return []; ואז try { return JSON.parse(text); } catch (error) { return []; }. הפונקציה restore() מחשבת מחדש גם את nextId."
  - "function restore() { tasks = loadTasks(); nextId = tasks.reduce(function (max, t) { return Math.max(max, t.id); }, 0) + 1; render(); }   function commit() { saveTasks(); render(); }   השתמשו ב-commit() בתוך addTask, toggleTask ו-deleteTask, וקראו ל-restore() בהתחלה במקום ל-render()."
quiz:
  - q: "מה מחזירה JSON.stringify(tasks)?"
    options: ["עותק של המערך", "את מספר המשימות", "טקסט (מחרוזת) שמתאר את המערך ואפשר לשמור או לשלוח אותו"]
  - q: "למה עוטפים את JSON.parse ב-try / catch?"
    options: ["כי טקסט שמור יכול להיות ריק או פגום, ו-JSON.parse זורקת שגיאה על JSON לא תקין", "כי JSON.parse איטית מאוד", "כי try / catch הופך את התוצאה למספר"]
  - q: "באתר אמיתי, איך ייראו שתי השורות ששומרות וטוענות את המשימות?"
    options: ["window.save(tasks) ו-window.load()", "localStorage.setItem('tasks', JSON.stringify(tasks)) ו-JSON.parse(localStorage.getItem('tasks'))", "document.cookie = tasks ו-document.cookie.tasks"]
---

סוגרים את לשונית הדפדפן והמשימות נעלמות. בשלב הזה תגרמו להן לשרוד. שמירת נתונים היא מיומנות שתשתמשו בה בכל אפליקציה שתבנו, והיא מסתכמת ברעיון אחד: **הופכים את הנתונים לטקסט, שומרים את הטקסט, ומחזירים אותו לנתונים מאוחר יותר**.

## איפה אנחנו

כל הלוגיקה נמצאת במערך `tasks` וב-`render()`. המסננים עובדים. אבל המערך נמצא רק בזיכרון, ולכן טעינה מחדש של הדף מתחילה מאפס.

## מה נוסיף, ולמה זה חשוב

דפדפנים יכולים לשמור עבור אתר פיסות טקסט קטנות. המקום הנפוץ ביותר הוא `localStorage`: זוגות של מפתח וערך שנשארים גם אחרי שסוגרים את הלשונית. הוא שומר רק **מחרוזות**, ולכן מערך של אובייקטים צריך להמיר. הפורמט הסטנדרטי לכך הוא **JSON** (JavaScript Object Notation), גרסת טקסט של מערכים ואובייקטים, כמו `[{"id":1,"text":"Buy milk","done":true}]`. זה גם הפורמט שכמעט כל API באינטרנט מדבר בו, כולל שרת התרגול שתפגשו בפרויקט ה-React.

## הדרכה צעד אחר צעד

**1. שני המתרגמים.**

```js
const text = JSON.stringify(tasks);   // array of objects -> string
const back = JSON.parse(text);        // string -> array of objects
```

`stringify` ו-`parse` הן הפכים מדויקים. אי אפשר לשמור פונקציות וכמה ערכים מיוחדים, אבל המשימות שלנו (מספרים, טקסט, ערכים בוליאניים) כולן בסדר.

**2. localStorage באתר אמיתי.** באתר משלכם, שמירה וטעינה לוקחות בדיוק שתי שורות:

```js
localStorage.setItem('tasks', JSON.stringify(tasks));
tasks = JSON.parse(localStorage.getItem('tasks')) || [];
```

`setItem(key, text)` שומרת את הטקסט תחת שם. `getItem(key)` מחזירה את הטקסט, או `null` אם עוד לא נשמר דבר. `JSON.parse(null)` נותנת `null`, ו-`null || []` חוזרת למערך ריק.

**3. למה השיעור הזה משתמש בתחליף.** התצוגה המקדימה שאתם משתמשים בה רצה בתוך **iframe מבודד** (sandboxed), קופסה נעולה שמונעת מקוד השיעור לגעת באחסון האמיתי של הדפדפן. בתוכה `localStorage` זורקת `SecurityError`. לכן אנחנו יוצרים אובייקט קטן עם אותן שתי שיטות, `setItem` ו-`getItem`, ששומר את הטקסט במשתנה:

```js
const storage = { data: {}, setItem(k, v) { this.data[k] = String(v); }, getItem(k) { return k in this.data ? this.data[k] : null; } };
```

כל שאר הקוד קורא ל-`storage.setItem(...)` ול-`storage.getItem(...)`. כשתעתיקו את הפרויקט לאתר אמיתי, החליפו את האובייקט האחד הזה ב-`const storage = window.localStorage;` וכל השאר ימשיך לעבוד. קוד טוב מבודד תלות מהסוג הזה במקום אחד.

**4. שמרו בכל שינוי.** הוסיפו את `commit()`, ששומרת ואז מציירת, וקראו לה מתוך `addTask`, `toggleTask` ו-`deleteTask`. `setFilter` משנה רק את המראה, ולכן היא ממשיכה לקרוא ל-`render()`.

**5. טענו בזהירות.** טקסט שמגיע מחוץ לתוכנית שלכם יכול להיות חסר, ריק או פגום, ולכן `loadTasks()` לא יכולה לקרוס:

```js
function loadTasks() {
  const text = storage.getItem(STORAGE_KEY);
  if (text === null) return [];
  try { return JSON.parse(text); } catch (error) { return []; }
}
```

**6. שחזרו את מונה המזהים.** אחרי הטעינה `nextId` שוב שווה ל-1, ומשימה חדשה תקבל מזהה שכבר קיים. ב-`restore()` חשבו את המזהה הגבוה ביותר והוסיפו אחד בעזרת `reduce`.

**7. ההדגמה.** הסקריפט מוסיף שלוש משימות, מסמן אחת ומדפיס את הטקסט השמור ב-Console. אחר כך הוא קובע `tasks = []` וקורא ל-`render()` כדי לדמות דף חדש, וקורא ל-`restore()` כמו שביקור חדש היה עושה. אם השמירה והטעינה עובדות, הדף מציג שוב את שלוש המשימות, ואחת מהן עדיין מסומנת.

> **שימו לב:**
> - שומרים את המערך ישירות: `setItem('tasks', tasks)` שומרת את הטקסט חסר התועלת `[object Object]`. תמיד עשו קודם `JSON.stringify`.
> - `JSON.parse` על טקסט ריק או שבור זורקת `SyntaxError: Unexpected end of JSON input`. השתמשו ב-`try / catch`.
> - שוכחים לעדכן את `nextId` אחרי הטעינה: שתי משימות עם אותו מזהה, ולחיצה על אחת מסמנת את השנייה.
> - לעולם אל תשמרו סיסמאות או סודות ב-`localStorage`: כל סקריפט בדף יכול לקרוא אותו.

> **תורכם:** עקבו אחרי רשימת ה-TODO ב-`script.js`: כתבו את `saveTasks`, `loadTasks`, `restore` ו-`commit`, השתמשו ב-`commit()` בשלוש הפעולות וקראו ל-`restore()` בהתחלה. ההדגמה צריכה להדפיס `Saved text: [...]` ב-Console עם שלוש המשימות כ-JSON, ולהסתיים עם שלוש משימות בדף, "2 tasks left" במונה ומשימה אחת מסומנת.
