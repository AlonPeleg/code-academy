---
title: "שלב 6: עריכת עיר עם PATCH וטוקן התחברות"
summary: "מתחברים כדי לקבל טוקן, שולחים בקשת PATCH מורשית מתוך טופס ומעדכנים את המסך לפי התשובה של השרת."
hints:
  - "כתיבת נתונים דורשת שני דברים שבקשות ה-GET לא דרשו: טוקן (מקבלים אותו פעם אחת מ-POST /login ושומרים ב-state) ובקשה עם method, headers וגוף JSON. אחרי PATCH מוצלח השרת מחזיר את האדם המעודכן: שימו אותו ברשימה."
  - "fetch(API + '/users/' + id, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify({ city: city }) }). אחר כך const updated = await res.json(); setPeople((list) => list.map((p) => (p.id === updated.id ? updated : p)));"
  - "useEffect(() => { async function signIn() { const res = await fetch(API + '/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }) }); if (res.ok) { const data = await res.json(); setToken(data.token); } } signIn(); }, []);   וההדגמה: useEffect(() => { if (DEMO_CITY && token && status === 'ready') saveCity(DEMO_SELECTED, DEMO_CITY); }, [token, status]);"
messages:
  - "שלחו את השינוי עם method: 'PATCH'."
  - "שלחו את הטוקן בכותרת Authorization."
  - "ערך הכותרת הוא 'Bearer ' ואחריו הטוקן."
  - "התחברו עם POST /login כדי לקבל טוקן."
  - "הגוף של POST או PATCH חייב להיות טקסט JSON: JSON.stringify(...)."
  - "ספרו לשרת שאתם שולחים JSON: 'Content-Type': 'application/json'."
  - "עדכנו את הרשימה בצורה הפונקציונלית setPeople((list) => list.map(...))."
quiz:
  - q: "מה ההבדל בין PATCH ל-PUT?"
    options: ["PATCH עובדת רק עם טוקנים", "PATCH זהה ל-GET", "PATCH משנה רק את השדות שנשלחו, ו-PUT מחליפה את הרשומה כולה"]
  - q: "איפה הטוקן נמצא בבקשה?"
    options: ["בכותרת Authorization בצורה 'Bearer <token>'", "בכתובת אחרי סימן שאלה, תמיד", "בכותרת הדף"]
  - q: "למה אנחנו מחליפים את האדם בתשובה של השרת (updated) ולא סומכים על הטיוטה שלנו?"
    options: ["כי setPeople צריכה אובייקט חדש", "השרת הוא מקור האמת: ייתכן שהוא ניקה או שינה את הערך, ועכשיו המסך מציג את מה שבאמת נשמר", "כדי שהבקשה תהיה מהירה יותר"]
---

עד עכשיו ספר הכתובות יכול היה רק לקרוא נתונים. אפליקציות אמיתיות גם **כותבות**: הן יוצרות דברים, משנות אותם ומוחקות אותם. השלב הזה הוא הקפיצה הגדולה ביותר בפרויקט. תתחברו, תשלחו בקשת `PATCH` מורשית עם גוף JSON, תטפלו בהצלחה ובכישלון ותעדכנו את המסך. את כל אלה תחזרו עליהם בכל אפליקציית אינטרנט רצינית.

## איפה אנחנו עומדים

הספר טוען אנשים, מחפש, נותן לבחור אחד ומציג את המשימות שלו. הכול לקריאה בלבד.

## מה נוסיף, ולמה זה חשוב

טופס קטן בפאנל הפרטים משנה את **העיר** של האדם. כתיבה שונה מקריאה בשלושה דברים:

1. **אימות** (authentication). שרתים מסרבים לשינויים מזרים (`401 Unauthorized`). מתחברים עם `POST /login` ומקבלים **טוקן** (token), טקסט סודי ארוך. בשרת התרגול אנחנו מתחברים בתור Ada עם חשבון ההדגמה; אפליקציה אמיתית מציגה טופס התחברות ולעולם לא שמה סיסמה בקוד.
2. **שיטה וגוף.** ברירת המחדל של `fetch` היא `GET`. לשינוי מעבירים אובייקט אפשרויות: `method`, `headers` ו-`body`.
3. **סומכים על התשובה של השרת.** השרת עונה עם הרשומה ששמר. שימו אותה ב-state, כך שהמסך יציג את מה שבאמת שמור.

## הדרכה שלב אחר שלב

**1. מתחברים פעם אחת.** בתוך effect, הגדירו פונקציה `async` וקראו לה. (פונקציית ה-effect עצמה אסור שתהיה `async`.)

```jsx
useEffect(() => {
  async function signIn() {
    const res = await fetch(API + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ada@example.com', password: 'engine123' }),
    });
    if (res.ok) {
      const data = await res.json();
      setToken(data.token);
    }
  }
  signIn();
}, []);
```

`await` עוצרת את הפונקציה עד שלהבטחה (promise) יש ערך, וכך הקוד נקרא כמו קוד רגיל מלמעלה למטה. `JSON.stringify` הופכת את האובייקט לטקסט שהשרת מצפה לו, והכותרת `Content-Type` אומרת לו שהטקסט הוא JSON.

**2. בקשת ה-PATCH.**

```jsx
const res = await fetch(API + '/users/' + id, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
  body: JSON.stringify({ city: city }),
});
```

`PATCH` שולחת רק את השדות ששונו; `PUT` הייתה מחליפה את הרשומה כולה. הכותרת `Authorization: Bearer <token>` היא הדרך שבה השרת יודע מי אתם. אחר כך בדקו את `res.ok`, קראו את האדם המעודכן והחליפו אותו ברשימה בצורת **העדכון הפונקציונלי**:

```jsx
setPeople((list) => list.map((p) => (p.id === updated.id ? updated : p)));
```

העברת פונקציה נותנת לכם את הרשימה העדכנית ביותר, וזה בטוח יותר משימוש במשתנה `people` מרינדור ישן. `map` מחזירה מערך חדש; אף פעם לא משנים state במקום.

**3. טופס עם טיוטה משלו.** `CityForm` שומר את מה שאתם מקלידים ב-state משלו, `useState(person.city)`, כך שכל הקשה לא מרנדרת מחדש את כל האפליקציה. הרכיב האב נותן לו `key={selected.id}`: כשה-key משתנה React זורקת את הטופס הישן ובונה חדש, ולכן הטיוטה מתאפסת כשבוחרים מישהו אחר.

**4. מדווחים על התוצאה.** השתמשו ב-state בשם `notice` להודעות: `Saved city for Ada Lovelace` בהצלחה ו-`Could not save: HTTP 403` בכישלון. `role="status"` גורם לקוראי מסך להקריא אותה.

**5. ההדגמה.** effect עם `[token, status]` קורא ל-`saveCity(DEMO_SELECTED, DEMO_CITY)` כשהטוקן והאנשים שניהם מוכנים. העיר של Ada משתנה ל-`Cambridge` מעצמה, כך שהבודק (ואתם) יכולים לראות סבב PATCH אמיתי. הקלידו עיר אחרת ולחצו על Save כדי לעשות את זה ידנית. שנו קודם את `DEMO_QUERY` ל-`''`, אחרת חיפוש של `london` יסתיר את Ada אחרי שתעבור.

> **שימו לב:**
> - שכחתם `JSON.stringify`: אתם שולחים `[object Object]` והשרת עונה `400` או `415`.
> - שכחתם את הכותרת `Content-Type`: השרת עונה `415 Unsupported Media Type`.
> - `401` פירושו שאין טוקן או שהוא לא תקין, ו-`403` פירושו טוקן תקין שאין לו הרשאה לעשות את זה. אלה בעיות שונות.
> - שינוי state במקום: `people[0].city = 'x'` לא מפעיל רינדור מחדש. תמיד צרו מערכים ואובייקטים חדשים.
> - לעולם אל תעשו commit של סיסמאות או טוקנים אמיתיים לקוד. זה שכאן קיים רק בשביל שרת התרגול.

> **תורכם:** בצעו את רשימת ה-`TODO`: הוסיפו את ה-state בשם `token` ו-`notice`, התחברו עם `POST /login`, כתבו את `saveCity` עם ה-`PATCH`, הוסיפו את הרכיב `CityForm` ואת ההודעה לפאנל הפרטים, ואת ה-effect של ההדגמה. אחרי שהדף נרגע הוא חייב להציג את העיר של Ada כ-`Cambridge` ואת ההודעה `Saved city for Ada Lovelace`.
