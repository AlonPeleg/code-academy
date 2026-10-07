---
title: "שלב 4: משלימים ומוחקים משימות"
summary: "משתמשים במאזין לחיצה אחד על הרשימה (event delegation) כדי לסמן משימות כהושלמו ולהסיר אותן."
hints:
  - "אל תוסיפו מאזין לכל li. שימו מאזין לחיצה אחד על ה-ul. כל לחיצה על משימה עולה (bubbles) אל הרשימה, ו-event.target אומר לכם על מה באמת לחצו."
  - "בתוך המאזין: const li = event.target.closest('li'); (וצאו מהפונקציה אם אין כזה). אז אם event.target.closest('.delete') אמת, קראו ל-li.remove(), ואחרת ל-li.classList.toggle('done'). ב-addTask בנו את ה-li מ-span.task-text ומ-button.delete."
  - "list.addEventListener('click', function (event) { const li = event.target.closest('li'); if (!li) return; if (event.target.closest('.delete')) { li.remove(); } else { li.classList.toggle('done'); } });   CSS: #task-list li.done .task-text { color: var(--muted); text-decoration: line-through; }"
messages:
  - "השתמשו ב-li.classList.toggle('done') כדי לסמן ולבטל סימון של משימה."
  - "השתמשו ב-event.target.closest('li') כדי למצוא על איזו משימה לחצו."
  - "הסירו משימה עם li.remove()."
  - "הוסיפו מאזין לחיצה אחד על הרשימה (event delegation), לא אחד לכל משימה."
quiz:
  - q: "מהו event delegation?"
    options: ["מתן מאזין משלו לכל אלמנט", "הצבת מאזין אחד על אלמנט אב ושימוש ב-event.target כדי לראות על איזה בן לחצו", "שליחת אירועים לשרת"]
  - q: "למה delegation מתאים לרשימת משימות?"
    options: ["זה עובד גם למשימות שנוספו אחר כך, כי המאזין יושב על הרשימה שתמיד קיימת", "זו הדרך היחידה להשתמש ב-classList", "זה מונע מהדף להיטען מחדש"]
  - q: "מה עושה li.classList.toggle('done')?"
    options: ["תמיד מוסיפה את המחלקה done", "מוחקת את ה-li", "מוסיפה את המחלקה אם היא חסרה ומסירה אותה אם היא קיימת"]
    explain: "בגלל toggle לחיצה כפולה על משימה מסמנת אותה ואז מבטלת את הסימון."
---

רשימת משימות שאפשר רק להוסיף אליה לא שווה הרבה. בשלב הזה תסמנו משימות כהושלמו ותמחקו אותן, ותלמדו **event delegation** (האצלת אירועים), הטכניקה ששומרת על ממשקים אמיתיים פשוטים ומהירים.

## איפה אנחנו עומדים

הטופס מוסיף משימות כפריטי רשימה פשוטים. כשלוחצים על משימה לא קורה כלום, ואין דרך להסיר אחת.

## מה נוסיף, ולמה זה חשוב

כל משימה מקבלת כפתור **Delete**, ולחיצה על המשימה עצמה מסמנת אותה כהושלמה עם קו על הטקסט. הדרך המפתה היא לחבר מאזין (listener) לכל פריט חדש בתוך `addTask`. זה עובד בהתחלה, אבל יוצר מאות מאזינים ברשימה ארוכה וקל לשכוח את זה כשפריטים נוצרים במקום אחר. אנשי מקצוע משתמשים ב-**delegation**: אירועים *עולים* (bubble) כלפי מעלה, ולכן לחיצה על כפתור בתוך משימה מגיעה גם למשימה, אחר כך לרשימה ואז לדף. מאזין אחד על הרשימה יכול לתפוס את כולם.

## הדרכה שלב אחר שלב

**1. נותנים לכל משימה יותר מבנה.** משימה היא עכשיו שורה עם טקסט וכפתור, ולכן `addTask` בונה שלושה אלמנטים ומקננת אותם:

```js
const li = document.createElement('li');

const label = document.createElement('span');
label.className = 'task-text';
label.textContent = text;

const remove = document.createElement('button');
remove.type = 'button';       // a plain button, not a submit button
remove.className = 'delete';
remove.textContent = 'Delete';

li.append(label, remove);     // append accepts several children
list.append(li);
```

**2. מאצילים את הלחיצה.** לאובייקט האירוע יש `target`, האלמנט המדויק שלחצו עליו (למשל ה-span או הכפתור). `closest(selector)` עולה מהאלמנט הזה כלפי מעלה ומחזירה את האב הקדמון הראשון שמתאים, או את האלמנט עצמו:

```js
list.addEventListener('click', function (event) {
  const li = event.target.closest('li');
  if (!li) return;                          // clicked the list's padding, not a task
  if (event.target.closest('.delete')) {
    li.remove();                            // Delete was clicked
  } else {
    li.classList.toggle('done');            // anything else toggles
  }
});
```

`classList` הוא עוזר למחלקות של אלמנט: `add`, `remove`, `contains` ו-`toggle`. `toggle('done')` מוסיפה את המחלקה כשהיא חסרה ומסירה אותה כשהיא קיימת.

**3. נותנים ל-CSS להציג את המצב.** JavaScript רק הופך מחלקה. המראה נקבע ב-CSS, וכך שני התפקידים נשארים נפרדים:

```css
#task-list li.done .task-text {
  text-decoration: line-through;
  color: var(--muted);
}
```

הפכו גם כל `li` לשורת flex (`display: flex; justify-content: space-between`) כדי שכפתור ה-Delete יישב בצד ימין.

**4. מדמים לחיצות בשביל הבודק.** לאלמנטים יש שיטה `.click()` שמפעילה אירוע לחיצה אמיתי. שורות ההדגמה מסמנות את המשימה הראשונה ומוחקות את האחרונה:

```js
list.querySelector('li').click();
list.querySelector('li:last-child .delete').click();
```

אחרי זה הדף מציג שתי משימות, ולראשונה יש את המחלקה `done`. עדיין אפשר ללחוץ בעצמכם.

> **שימו לב:**
> - שימוש ב-`event.target` ישירות: אם המשתמש לוחץ על ה-span, ה-`target` הוא ה-span ולא ה-`li`. בגלל זה אנחנו קוראים ל-`closest('li')`.
> - לחיצה על Delete גם עולה אל ה-`li`. בגלל זה הקוד משתמש ב-`if ... else`: אם מחליפים מצב קודם ובודקים Delete אחר כך, המשימה מהבהבת לפני שהיא נעלמת.
> - `li.remove` בלי הסוגריים לא עושה כלום. קראו לה: `li.remove()`.
> - `Cannot read properties of null (reading 'click')` פירושו שהסלקטור של ההדגמה לא מצא אלמנט. בדקו ש-`addTask` באמת מוסיפה כפתור `.delete`.

> **תורכם:** עדכנו את `addTask` כך שתבנה `span.task-text` ו-`button.delete`, הוסיפו מאזין לחיצה אחד על הרשימה שמסיר את המשימה כשלוחצים על Delete ואחרת מחליף את `done`, וכתבו את שלושת כללי ה-CSS מרשימת ה-TODO. עם שורות ההדגמה הדף חייב להסתיים עם שתי משימות (הראשונה הושלמה ומסומנת בקו).
