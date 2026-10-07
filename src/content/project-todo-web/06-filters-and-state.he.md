---
title: "שלב 6: מסננים עם מערך מצב ו-render()"
summary: "שומרים את המשימות במערך, מציירים את הדף ממנו עם render(), ומוסיפים מסננים All, Active ו-Done."
messages:
  - "שמרו את המשימות במערך בתוך משתנה: let tasks = [];"
  - "כתבו פונקציה render() שמציירת את הדף מתוך המצב."
  - "השתמשו בשיטת המערך .filter(...) כדי לבחור את המשימות המתאימות."
  - "קראו את המסנן שנבחר מהתכונה data-filter של הכפתור."
hints:
  - "שנו את דרך החשיבה: המערך tasks הוא האמת, והדף הוא רק תמונה שלו. כל פעולה (add, toggle, delete, setFilter) משנה את המערך או את המסנן ואז קוראת ל-render()."
  - "render() מרוקנת את הרשימה עם list.replaceChildren(), עוברת בלולאה על visibleTasks(), בונה li לכל משימה וקובעת li.dataset.id = task.id. visibleTasks() משתמשת ב-tasks.filter(...) בהתאם למשתנה filter. עבור הכפתורים: button.classList.toggle('active', button.dataset.filter === filter)."
  - "function visibleTasks() { if (filter === 'active') return tasks.filter(t => !t.done); if (filter === 'done') return tasks.filter(t => t.done); return tasks; }   function toggleTask(id) { const task = tasks.find(t => t.id === id); if (task) { task.done = !task.done; render(); } }   function deleteTask(id) { tasks = tasks.filter(t => t.id !== id); render(); }"
quiz:
  - q: "מה הרעיון המרכזי בשמירת מערך מצב ופונקציית render()?"
    options: ["הדף הוא תמונה של הנתונים: משנים את הנתונים, קוראים ל-render(), והדף לא יכול לצאת מסנכרון", "זה גורם לדפדפן לשמור את הנתונים לתמיד", "זה מונע שימוש ב-DOM לגמרי"]
  - q: "מה מחזירה tasks.filter(task => !task.done)?"
    options: ["את המשימה הראשונה שלא הושלמה", "מערך חדש שמכיל רק את המשימות שלא הושלמו", "את מספר המשימות שלא הושלמו"]
  - q: "למה שומרים את מזהה המשימה ב-li.dataset.id?"
    options: ["כדי שהדפדפן יוכל למיין את הרשימה", "כי מזהים נחוצים ל-CSS", "כדי שלחיצה על li תגיד לנו איזו משימה במערך לשנות"]
    explain: "תכונות data-* הן הדרך הרגילה לצרף פיסות מידע קטנות לאלמנט."
---

עד עכשיו הדף עצמו היה המקום היחיד שידע על המשימות. זה עובד בצעצוע, אבל מתפרק ברגע שרוצים מסנן: אם המשימות שהושלמו מוסתרות, איפה נמצא המידע עליהן? בשלב הזה תעבירו את הנתונים מהדף למערך (array) רגיל של JavaScript. זה הרעיון החשוב ביותר בפיתוח front-end מודרני, והוא הרעיון שמאחורי React, Vue ו-Svelte.

## איפה אנחנו

האפליקציה יכולה להוסיף, לסמן ולמחוק משימות, והיא מציגה מונה והודעה ריקה. הנתונים קיימים רק כפריטי רשימה בדף.

## מה נוסיף, ולמה זה חשוב

נוסיף שלושה כפתורי סינון: **All**, **Active** ו-**Done**. כדי שיעבדו בצורה נקייה נציג:

- **מצב** (state): המשתנים שמתארים את האפליקציה ברגע זה: המערך `tasks` והמסנן הנוכחי `filter`.
- **`render()`**: פונקציה אחת שמציירת את כל הדף מתוך המצב הזה.

המחזור תמיד זהה: *קורה אירוע, משנים את המצב, קוראים ל-render()*. מכיוון שהדף נבנה מחדש מהמצב בכל פעם, הוא לא יכול לסתור אותו. לעולם לא תצטרכו לכתוב שוב "אם אני מסתיר את זה, צריך לזכור לעדכן גם את זה".

## הדרכה צעד אחר צעד

**1. צרו את המצב.** המשימות הופכות לאובייקטים במערך:

```js
let tasks = [];      // [{ id: 1, text: 'Buy milk', done: false }, ...]
let filter = 'all';  // 'all' | 'active' | 'done'
let nextId = 1;      // the id the next new task will get
```

אנחנו משתמשים ב-`let` כי המשתנים האלה יוחלפו עם הזמן. המזהה (id) מאפשר לנו למצוא משימה שוב בהמשך, גם אחרי שהרשימה סוננה או שסדרה השתנה.

**2. כתבו את `visibleTasks()`.** שיטת המערך `filter` שומרת את הפריטים שהפונקציה שלכם מחזירה עבורם אמת, ונותנת לכם מערך **חדש**:

```js
function visibleTasks() {
  if (filter === 'active') return tasks.filter(function (t) { return !t.done; });
  if (filter === 'done') return tasks.filter(function (t) { return t.done; });
  return tasks;
}
```

**3. כתבו את `render()`.** היא בנויה בצורה *ניקוי, בנייה מחדש, עדכון השאר*:

```js
function render() {
  list.replaceChildren();                    // remove all old li elements
  for (const task of visibleTasks()) {
    const li = document.createElement('li');
    li.dataset.id = task.id;                 // becomes data-id="3" in the HTML
    li.classList.toggle('done', task.done);  // second argument: force on or off
    // ... build the span and the Delete button as before ...
    list.append(li);
  }
  // counter, empty message and the active filter button come here
}
```

`classList.toggle('done', task.done)` עם ארגומנט שני כבר אינה היפוך: היא מכריחה את המחלקה להיות **דולקת** כשהערך אמת, ו**כבויה** כשהוא שקר. אותו טריק מסמן את כפתור הסינון שנבחר: `button.classList.toggle('active', button.dataset.filter === filter)`.

**4. הפעולות נוגעות רק במצב.** שימו לב כמה הן נעשות קצרות:

```js
function addTask(text) { tasks.push({ id: nextId++, text: text, done: false }); render(); }
function deleteTask(id) { tasks = tasks.filter(function (t) { return t.id !== id; }); render(); }
function setFilter(name) { filter = name; render(); }
```

`nextId++` נותן את המספר הנוכחי ואז מוסיף אחד. לצורך סימון, `tasks.find(...)` מחזירה את האובייקט המתאים, ואתם הופכים את הדגל `done` שלו.

**5. קראו את המזהה מהלחיצה.** `li.dataset.id` הוא תמיד טקסט, ולכן ממירים אותו: `Number(li.dataset.id)`. גם סרגל המסננים משתמש בהאצלה (delegation), עם `event.target.closest('button[data-filter]')`.

**6. ההדגמה.** הסקריפט מוסיף שלוש משימות, לוחץ על הראשונה (הושלמה) ואז לוחץ על המסנן Active, כך שבסוף הדף מציג שתי משימות ו-"2 tasks left".

> **שימו לב:**
> - `li.dataset.id` הוא מחרוזת ו-`task.id` הוא מספר, ולכן `t.id === li.dataset.id` אף פעם לא מתקיים. המירו עם `Number(...)`.
> - משנים את המערך אבל שוכחים `render()`: הנתונים משתנים והדף לא.
> - `tasks.filter(...)` לא משנה את `tasks`, היא מחזירה מערך חדש. בזמן מחיקה שימו אותו בחזרה (`tasks = tasks.filter(...)`).
> - סופרים את המשימות שנשארו מתוך `visibleTasks()` במקום מתוך `tasks`: עם המסנן Done המונה יציג "0 tasks left". ספרו מהמערך המלא.

> **תורכם:** עקבו אחרי רשימת ה-TODO ב-`script.js` (ואחרי ה-TODO של ה-HTML וה-CSS): צרו את `tasks`, `filter` ו-`nextId`, כתבו את `visibleTasks()` ו-`render()`, כתבו מחדש את הפעולות ואת המאזינים, והוסיפו את סרגל המסננים. כשההדגמה מסתיימת הכפתור "Active" מודגש, שתי משימות מוצגות והמונה מציג "2 tasks left".
