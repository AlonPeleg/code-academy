---
title: "אירועים וקוד אסינכרוני"
summary: "הגיבו למה שקורה עם EventEmitter, ועברו מ-callbacks ל-promises ול-async/await בעזרת util.promisify."
hints:
  - "ל-EventEmitter יש on(name, listener) לכל הפעמים, once(name, listener) לפעם הראשונה בלבד, ו-emit(name, ...values) שקוראת למאזינים עם הערכים האלה. בחלק 2, util.promisify הופכת פונקציה שמקבלת callback של (error, result) כארגומנט האחרון שלה לפונקציה שמחזירה promise."
  - "shop.once('open', () => console.log('shop is open')); shop.on('order', (item, qty) => console.log('order: ' + qty + ' x ' + item)); const loadUserAsync = util.promisify(loadUser); הקריאה Promise.all([loadUserAsync(1), loadUserAsync(3)]) מחזירה promise למערך עם שני המשתמשים."
  - "const user = await loadUserAsync(1); console.log('promise user: ' + user.name); try { await loadUserAsync(2); } catch (error) { console.log('error: ' + error.message); } const [a, b] = await Promise.all([loadUserAsync(1), loadUserAsync(3)]); console.log('both: ' + a.name + ', ' + b.name);"
quiz:
  - q: "מה ההבדל בין emitter.on('x', fn) ל-emitter.once('x', fn)?"
    options: ["once מריצה את fn רק בפעם הראשונה ש-x נפלט, ו-on מריצה אותה בכל פעם", "on מריצה את fn פעם אחת בלבד, ו-once מריצה אותה לנצח", "אין הבדל"]
  - q: "לפי המוסכמה של callbacks ב-Node, מהו הארגומנט הראשון של callback?"
    options: ["התוצאה", "השגיאה (או null כשהכול עבר בשלום)", "שם הפונקציה"]
    explain: "ה-callbacks של Node הם 'error-first': callback(error, result). בגלל זה util.promisify יכולה להפוך אותם ל-promises באופן אוטומטי."
  - q: "מה מקבלים כשכותבים const data = await somePromise בתוך פונקציית async?"
    options: ["את ה-promise עצמו", "כלום, await רק עוצר", "את הערך ש-promise מסתיים בו, אחרי שמחכים לו"]
  - q: "שלוש בקשות לוקחות כל אחת 100 מילישניות ולא תלויות זו בזו. איזו גרסה מסתיימת בערך אחרי 100 מילישניות?"
    options: ["await Promise.all([a(), b(), c()]);", "await a(); await b(); await c();", "for (const f of [a, b, c]) { await f(); }"]
    explain: "Promise.all מתחילה את שלושתן לפני שהיא מחכה. שתי האחרות מריצות אותן בזו אחר זו, בערך 300 מילישניות."
messages:
  - "השתמשו ב-shop.once('open', ...) כדי שהמאזין ירוץ רק בפעם הראשונה."
  - "הקשיבו עם shop.on('order', (item, qty) => ...)."
  - "המירו אותה עם util.promisify(loadUser)."
  - "התחילו את שתי הטעינות יחד עם Promise.all([...])."
---

שרת אינטרנט מבלה את רוב חייו ב**המתנה**: שקובץ ייקרא, שמסד נתונים יענה, שבקשה תגיע. Node בנויה סביב זה. במקום לקפוא בזמן שהיא מחכה, היא ממשיכה לעבוד על דברים אחרים וחוזרת כשהתשובה מוכנה. בשיעור הזה תלמדו את שני הכלים ש-Node משתמשת בהם לשם כך: **אירועים** (events) ו**קוד אסינכרוני** (asynchronous).

## אירועים: "תגידו לי כשזה קורה"

דברים רבים ב-Node מכריזים על מה שקורה דרך **EventEmitter**. מחברים **מאזין** (listener, פונקציה) לשם של אירוע, ובהמשך מישהו **פולט** (emits) את האירוע וכל המאזינים רצים:

```js
const EventEmitter = require('events');

const door = new EventEmitter();

door.on('knock', (who) => console.log(who + ' is at the door'));

door.emit('knock', 'Ada');   // prints: Ada is at the door
door.emit('knock', 'Grace'); // prints: Grace is at the door
```

- `on(name, listener)` מריצה את המאזין **בכל פעם** שהאירוע נפלט.
- `once(name, listener)` מריצה אותו רק בפעם **הראשונה** ואז מסירה אותו.
- `emit(name, ...values)` קוראת למאזינים ומעבירה להם את הערכים כארגומנטים. היא מחזירה `true` אם היה לפחות מאזין אחד.
- `off(name, listener)` מסירה מאזין, ו-`listenerCount(name)` אומרת לכם כמה יש.

שמות של אירועים הם סתם מחרוזות (strings) שאתם בוחרים. תשתמשו ברעיון הזה כל הזמן: שרת HTTP פולט `'request'`, זרם (stream) פולט `'data'`, והמחלקות (classes) שלכם יכולות להכריז על אירועים משלהן אם הן מרחיבות את `EventEmitter`:

```js
class Timer extends EventEmitter {
  finish() { this.emit('done'); }
}
```

## קוד אסינכרוני: שלושה דורות

קריאת קובץ או פנייה לשרת לוקחות זמן, ולכן פונקציות של Node נותנות לכם את התשובה **אחר כך**. יש שלושה סגנונות, לפי הסדר שבו הם הומצאו.

**1. Callbacks.** מעבירים פונקציה ש-Node קוראת לה כשהעבודה מסתיימת. לפי המוסכמה היא **error-first** (שגיאה קודם): `callback(error, result)`.

```js
loadUser(1, (error, user) => {
  if (error) return console.log('failed: ' + error.message);
  console.log(user.name);
});
```

Callbacks עובדים, אבל כשצעד 2 תלוי בצעד 1 וצעד 3 תלוי בצעד 2, הקוד נסחף ימינה ב"פירמידה" וטיפול בשגיאות חוזר על עצמו בכל מקום.

**2. Promises.** promise הוא אובייקט (object) שמייצג ערך שיהיה קיים בהמשך. משרשרים `.then(...)` ו-`.catch(...)`.

**3. async/await.** אותם promises, אבל כותבים אותם כמו קוד רגיל שרץ מלמעלה למטה. `await` עוצר את *הפונקציה הזאת* עד שה-promise מסתיים ומחזיר לכם את הערך. כשל הופך לחריגה (exception) רגילה ש-`try/catch` יכול לתפוס:

```js
try {
  const user = await loadUserAsync(1);
  console.log(user.name);
} catch (error) {
  console.log('failed: ' + error.message);
}
```

בשיעורים האלה `await` ברמה העליונה עובד בקובץ הראשי שלכם. בפרויקט משלכם הוא עובד בראש קובץ של מודול ES, ובתוך כל `async function`.

## הפיכת callbacks ל-promises

פונקציות ישנות של Node מדברות רק ב-callbacks. `util.promisify` עוטפת פונקציה בסגנון error-first כך שתחזיר promise במקום:

```js
const util = require('util');
const loadUserAsync = util.promisify(loadUser);
const user = await loadUserAsync(1);
```

ל-Node כבר יש גרסאות promise של מודולים רבים: `fs.promises.readFile`, ו-`require('timers/promises')` נותן `setTimeout` שמחזיר promise, מה שיוצר `sleep` נוח:

```js
const { setTimeout: sleep } = require('timers/promises');
await sleep(100); // wait 100 ms
```

## לעשות דברים בו זמנית

כשממתינים עם `await` לדבר אחד אחרי השני, המשימות רצות בזו אחר זו. כשהמשימות לא תלויות זו בזו, התחילו אותן יחד עם `Promise.all`, שמחכה לכולן ונותנת מערך (array) של התוצאות באותו סדר. כך שרת טוען משתמש ואת ההזמנות שלו באותו זמן.

> **שימו לב:**
> - **שכחת `await`.** `const user = loadUserAsync(1)` נותן לכם אובייקט Promise, ולכן `user.name` הוא `undefined`. הוסיפו `await`.
> - **`await` מחוץ לפונקציית async.** בפונקציה רגילה תקבלו `SyntaxError: await is only valid in async functions`. סמנו את הפונקציה כ-`async`.
> - **העברת צורה לא נכונה ל-`promisify`.** היא עובדת רק עם פונקציות שהארגומנט **האחרון** שלהן הוא callback בסגנון error-first. גם `array.map(loadUserAsync)` נשבר: `map` מעבירה את האינדקס כארגומנט שני, ולכן כתבו `ids.map((id) => loadUserAsync(id))`.
> - **פליטת `'error'` בלי מאזין.** `EventEmitter` שפולט את האירוע המיוחד `'error'` ואין לו מאזין ל-`'error'` זורק את השגיאה ועלול להפיל את התוכנית שלכם. תמיד הוסיפו `emitter.on('error', ...)` ל-emitters שעלולים להיכשל.
> - **הסרת מאזין שהוא לא אותה פונקציה.** `off` צריכה את אותה פונקציה בדיוק שנתתם ל-`on`, ולכן שמרו אותה במשתנה (variable) במקום לכתוב פונקציית חץ בתוך הקריאה.

## להמשך

הפכו את `shop` למחלקה שמרחיבה את `EventEmitter` עם מתודה `order(item, qty)` שפולטת `'order'`. אחר כך הוסיפו מאזין שני שסופר את המספר הכולל של הפריטים שהוזמנו.

> **תורכם:** ב-`main.js` חברו מאזין `once` ל-`'open'` ומאזין `on` ל-`'order'`, צרו את `loadUserAsync` עם `util.promisify(loadUser)`, המתינו (`await`) למשתמש 1, תפסו את הכשל של משתמש 2, וטענו את משתמשים 1 ו-3 יחד עם `Promise.all`. תשע שורות אמורות להיות מודפסות.
