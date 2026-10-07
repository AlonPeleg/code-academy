---
title: "Mocks ו-spies"
summary: "מחליפים תלויות איטיות או בלתי צפויות ב-jest.fn() וב-jest.spyOn() כדי לבדוק חלק אחד בבידוד."
hints:
  - "ה-mock מתעד כל קריאה, ולכן התפקיד שלכם הוא רק לקרוא ל-send בצורה הנכונה: פעם אחת לכל משתמש שמאחר, עם שני ארגומנטים (כתובת, טקסט). ספרו את הקריאות במשתנה."
  - "עברו בלולאה עם for (const user of users). חשבו const days = daysLate(user.dueTime). אם days > 0, קראו ל-send(user.email, `Hi ${user.name}, your book is ${days} days late`) והוסיפו 1 למונה. החזירו את המונה אחרי הלולאה."
  - "let count = 0; for (const user of users) { const days = daysLate(user.dueTime); if (days > 0) { send(user.email, `Hi ${user.name}, your book is ${days} days late`); count++; } } return count;"
messages:
  - "קראו ל-send(user.email, message) עבור כל משתמש שמאחר."
  - "השתמשו ב-daysLate(...) כדי להחליט מי מאחר."
quiz:
  - q: "למה טובה פונקציית mock (jest.fn())?"
    options: ["להריץ את הקוד מהר יותר", "לעמוד במקום פונקציה אמיתית ולתעד איך קראו לה", "לתקן באגים אוטומטית"]
  - q: "למה מחליפים את Date.now() ב-spy בבדיקה?"
    options: ["כדי שהבדיקה תיתן אותה תוצאה בכל יום, ולא תהיה תלויה בשעון האמיתי", "כי Date.now שבורה", "כדי להאט את הבדיקה"]
    explain: "בדיקה שתלויה בשעה הנוכחית או במספרים אקראיים יכולה לעבור היום ולהיכשל מחר. שלטו בדבר הבלתי צפוי."
  - q: "מה בודקת expect(send).toHaveBeenCalledWith(\"a@b.c\", \"Hi\")?"
    options: ["ש-send החזירה \"a@b.c\"", "ש-send נקראה לפחות פעם אחת בדיוק עם הארגומנטים האלה", "ש-send נקראה רק פעם אחת"]
  - q: "למה קוראים ל-nowSpy.mockRestore() ב-afterEach?"
    options: ["כדי להחזיר את Date.now המקורית, כך שבדיקות וקוד שבאים אחר כך לא יושפעו", "כדי למחוק את הבדיקה", "כדי להדפיס את ה-spy"]
---
יש קוד שקשה לבדוק כי הוא תלוי בדברים שאי אפשר לשלוט בהם: השעה הנוכחית, מספרים אקראיים, הרשת, מסד נתונים, שרת מיילים. אתם לא רוצים בדיקה ששולחת 500 מיילים אמיתיים, או כזו שעוברת רק בימי שלישי. הפתרון הוא **להחליף** את הדברים האלה בתחליפים שאתם שולטים בהם ויכולים לבדוק. בשיעור הזה תלמדו את שני הכלים לכך: **mocks** ו-**spies**.

## פונקציות mock: jest.fn()

`jest.fn()` יוצרת פונקציה מזויפת. כברירת מחדל היא לא עושה כלום, אבל היא **זוכרת כל קריאה**:

```js
const greet = jest.fn();

greet("Ada");
greet("Grace", "hello");

console.log(greet.mock.calls);        // prints: [["Ada"], ["Grace", "hello"]]
console.log(greet.mock.calls.length); // prints: 2
```

`mock.calls` היא רשימה עם פריט אחד לכל קריאה, וכל פריט הוא רשימת הארגומנטים. אפשר לבדוק אותה ישירות, או להשתמש ב-matchers הנוחים:

```js
expect(greet).toHaveBeenCalled();                  // at least once
expect(greet).toHaveBeenCalledTimes(2);            // exactly twice
expect(greet).toHaveBeenCalledWith("Ada");         // some call had exactly these arguments
expect(greet).not.toHaveBeenCalledWith("Linus");
```

אפשר גם להחליט מה הפונקציה המזויפת **מחזירה**:

```js
const getPrice = jest.fn().mockReturnValue(10);
console.log(getPrice("apple") + getPrice("pear"));   // prints: 20

const pick = jest.fn()
  .mockReturnValueOnce("first")
  .mockReturnValue("later");
console.log(pick(), pick(), pick());   // prints: first later later

const double = jest.fn((n) => n * 2);   // give it a real behaviour
console.log(double(4));                 // prints: 8
```

(עבור פונקציות אסינכרוניות יש `mockResolvedValue(x)` ו-`mockRejectedValue(err)`, שבהן תשתמשו בשיעור על קוד אסינכרוני.)

## מעבירים את התחליף פנימה (dependency injection)

הדרך הקלה ביותר להשתמש ב-mock היא לתכנן את הפונקציה כך ש**תקבל** את מה שהיא תלויה בו כפרמטר, במקום לחפש אותו בעצמה:

```js
function sendReminders(users, send) {   // send is a parameter
  for (const user of users) send(user.email, "Please return the book");
}
```

בתוכנית האמיתית מעבירים פונקציה ששולחת מיילים. בבדיקה מעבירים `jest.fn()`, ואחר כך שואלים את ה-mock מה קרה. שום דבר לא נשלח, שום דבר לא איטי, והבדיקה בודקת בדיוק את ההיגיון של `sendReminders`. זה נקרא **בידוד** (isolating) של הקוד הנבדק.

## Spies: jest.spyOn(object, "method")

לפעמים אי אפשר להעביר את התלות פנימה, כי הקוד משתמש במשתנה גלובלי כמו `Date.now()` או `Math.random()`. **Spy** עוטף מתודה קיימת של אובייקט, כדי שתוכלו לעקוב אחריה או להחליף את התוצאה שלה:

```js
const spy = jest.spyOn(Date, "now").mockReturnValue(1000);
console.log(Date.now());   // prints: 1000
spy.mockRestore();         // put the real Date.now back
console.log(Date.now() > 1000);   // prints: true
```

בלי `mockReturnValue`, ה-spy עדיין קורא למתודה המקורית, כך שאפשר לעקוב אחרי קריאות בלי לשנות התנהגות. **תמיד שחזרו** spies בסיום הבדיקה (`mockRestore()`, בדרך כלל ב-`afterEach`), אחרת הם "דולפים" לבדיקות אחרות.

## beforeEach ו-afterEach

`beforeEach(() => {...})` רצה לפני כל בדיקה בסוויטה ו-`afterEach` רצה אחרי כל בדיקה. השתמשו בהן כדי ליצור mocks חדשים, כך שבדיקות לא ישפיעו זו על זו (ראו את קובץ הבדיקות של השיעור הזה).

> **שימו לב:**
> * **יותר מדי mocks.** אם הכול הוא mock, הבדיקה מוכיחה רק שה-mocks שלכם עובדים. עשו mock לקצוות של המערכת (שעון, רשת, מייל), לא להיגיון שלכם.
> * **שוכחים לשחזר.** spy שנשאר על `Date.now` גורם לכל בדיקה שבאה אחריו לחיות בזמן המזויף. שחזרו אותו ב-`afterEach`.
> * **סדר ארגומנטים שגוי.** `toHaveBeenCalledWith("ada@example.com", "Hi")` נכשלת אם הקוד קורא ל-`send("Hi", "ada@example.com")`. הכישלון מציג את הרשימה האמיתית של הקריאות: קראו אותה.
> * **בודקים מימוש ולא התנהגות.** בדקו את מה שהמשתמש יכול לראות (הודעות שנשלחו, ערכים שהוחזרו), לא כמה קריאות פנימיות לפונקציות עזר קרו, אחרת הבדיקות ישברו בכל פעם שתשנו את מבנה הקוד (refactor).

> **תורכם:** הבדיקות ב-`reminders.test.js` גמורות. כתבו את `sendReminders(users, send)` ב-`reminders.js`: עבור כל משתמש שמאחר ביותר מ-0 ימים, קראו ל-`send(user.email, "Hi <name>, your book is <n> days late")`, והחזירו את מספר התזכורות שנשלחו. כל 5 הבדיקות חייבות לעבור.
