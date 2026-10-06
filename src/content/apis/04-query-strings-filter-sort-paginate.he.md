---
title: "מחרוזות שאילתה: סינון, מיון ועימוד"
summary: "בקשו בדיוק את הנתונים שאתם צריכים בעזרת ?role=editor, _sort, _page ו-_limit, וקראו את הכותרת X-Total-Count."
hints:
  - "כל מה שאחרי ה-? בכתובת הוא מחרוזת השאילתה (query string): זוגות key=value המחוברים ב-&. השרת משתמש בהם כדי לסנן (?role=editor), למיין (_sort, _order) ולחתוך פרוסה (_page, _limit). מידע על התוצאה כולה נמצא בכותרות התגובה."
  - "const res = await fetch(BASE + '/users?role=editor'); const editors = await res.json(); editors.map((u) => u.name).join(', ')   עבור כותרות: res.headers.get('X-Total-Count') נותן מחרוזת."
  - "const res5 = await fetch(BASE + '/todos?_page=2&_limit=3'); const items = await res5.json(); console.log('page 2 of ' + res5.headers.get('X-Total-Pages') + ' (' + res5.headers.get('X-Total-Count') + ' total): ' + items.map((t) => t.id).join(','));"
quiz:
  - q: "בכתובת https://api.academy.test/users?role=editor&_sort=name, מהי מחרוזת השאילתה?"
    options: ["/users", "role=editor&_sort=name", "https://api.academy.test"]
  - q: "למה להשתמש בעימוד (_page ו-_limit) במקום לשלוף הכול?"
    options: ["זה הופך את ה-JSON לתקין", "שרתים מסרבים לשלוח יותר מפריט אחד", "אוספים גדולים יהיו איטיים ובזבזניים לשליחה בבת אחת"]
  - q: "איפה ה-API הזה שם את המספר הכולל של הפריטים המתאימים כשמבקשים עמוד בודד?"
    options: ["בכותרת התגובה X-Total-Count", "בכתובת ששלחתם", "בפריט הראשון של המערך"]
    explain: "הגוף מכיל רק את העמוד. הסכומים הם מטא-נתונים, ולכן הם עוברים בכותרות."
  - q: "למה לבנות שאילתות עם new URLSearchParams({ q: 'new york' }) במקום להדביק טקסט לתוך הכתובת?"
    options: ["זה גורם לבקשה להיות מהירה יותר", "זה מבצע escape לתווים מיוחדים כמו רווחים ו-&", "זה הופך GET ל-POST"]
messages:
  - "סננו בעזרת ?role=editor."
  - "מיינו בעזרת _sort=name."
  - "בנו את שאילתת החיפוש בעזרת URLSearchParams."
  - "קראו את X-Total-Count ואת X-Total-Pages בעזרת res.headers.get(...)."
---

שליפת `/todos` מחזירה את כל עשר המשימות. בשירות אמיתי יכולים להיות עשרה מיליון, ורק לעיתים רחוקות רוצים את כולם. מחרוזות שאילתה מאפשרות לתאר *אילו* פריטים אתם רוצים, באיזה סדר, וכמה בכל פעם.

## מהי מחרוזת שאילתה?

זה החלק בכתובת שאחרי ה-`?`. היא מכילה זוגות `key=value` המופרדים ב-`&`:

```
GET /users?role=editor&_sort=name HTTP/1.1
Host: api.academy.test
```

```
https://api.academy.test/users?role=editor&_sort=name
                              |     |
                              path  query string: role=editor and _sort=name
```

הנתיב אומר **מה** (אוסף המשתמשים). מחרוזת השאילתה מדייקת **איך**: סינון, מיון, חיפוש, חיתוך פרוסה. היא אף פעם לא משנה למה הכתובת מצביעה באופן מהותי, ובגלל זה משתמשים בה עם `GET`.

## האפשרויות של ה-API הזה

| שאילתה | השפעה |
| --- | --- |
| `?role=editor` | משאירה רק פריטים שה-`role` שלהם שווה ל-`editor` (כל שדה עובד: `?done=true`, `?userId=1`) |
| `?q=london` | חיפוש טקסט חופשי בכל השדות |
| `?_sort=name` | מיון לפי שדה (הוסיפו `&_order=desc` כדי להפוך את הסדר) |
| `?_page=2&_limit=3` | לוקחת את עמוד 2 כשבכל עמוד 3 פריטים |

אפשר לשלב ביניהן: `/todos?done=false&_sort=title&_limit=2`.

## עימוד וכותרות

עימוד (pagination) מחזיר פרוסה. הגוף מכיל רק את הפרוסה הזו, אז איך יודעים כמה עמודים יש? השרת אומר לכם ב**כותרות התגובה**:

```
HTTP/1.1 200 OK
Content-Type: application/json
X-Total-Count: 10
X-Page: 2
X-Total-Pages: 4

[{"id":4, ...},{"id":5, ...},{"id":6, ...}]
```

עם `fetch`, קוראים כותרות מ-`res.headers`:

```js
const res = await fetch(BASE + '/todos?_page=2&_limit=3');
const items = await res.json();
console.log(items.length);                   // prints: 3
console.log(res.headers.get('X-Total-Count')); // prints: 10
```

שמות כותרות אינם רגישים לאותיות גדולות וקטנות, ולכן `x-total-count` עובד גם הוא. ערכי כותרות הם תמיד **מחרוזות**: השתמשו ב-`Number(res.headers.get('X-Total-Count'))` אם אתם צריכים חישוב. כותרת שחסרה מחזירה `null`.

## בונים שאילתות בבטחה

הדבקת מחרוזות ביד עובדת עבור ערכים פשוטים, אבל נשברת כשערך מכיל רווח, `&` או `#`. `URLSearchParams` בונה מחרוזת שאילתה תקינה ומבצעת escape לכול:

```js
const params = new URLSearchParams({ q: 'new york', _limit: 2 });
console.log(params.toString()); // prints: q=new+york&_limit=2
const res = await fetch(BASE + '/users?' + params);
```

שרשור אובייקט למחרוזת (`'?' + params`) קורא ל-`toString()` אוטומטית.

## שני סגנונות עימוד

ה-API הזה משתמש ב**מספרי עמודים** (`_page`, `_limit`). ממשקים אחרים משתמשים ב**היסט** (offset) (`?offset=20&limit=10`) או ב**סמן** (cursor) (`?after=abc123`), שנשאר נכון גם כשמוסיפים פריטים בזמן שאתם עוברים בין עמודים. הרעיון זהה: מבקשים פרוסה מוגבלת, קוראים את הסכומים, מבקשים את הפרוסה הבאה.

> **שימו לב:**
> - **שגיאות כתיב בשם המסנן.** `/users?rol=editor` מחזיר רשימה ריקה `[]` ולא שגיאה, כי "אין משתמש שה-`rol` שלו שווה ל-editor". תוצאות ריקות יכולות להעיד על מפתח עם שגיאת כתיב.
> - **לשכוח שערכי כותרות הם מחרוזות.** `X-Total-Count + 1` נותן `"101"` במקום `11`.
> - **לשים `?` פעמיים.** `/users?role=editor?_sort=name` הוא ערך אחד שנוצר לא נכון. המפריד השני חייב להיות `&`.
> - **לא לקודד קלט של משתמש.** חיפוש כמו `Tom & Jerry` שמודבק לכתובת נחתך ב-`&`. השתמשו ב-`URLSearchParams`.
> - **לסנן בצד הלקוח כשהשרת יכול לעשות את זה.** הורדת 10,000 פריטים כדי למצוא 3 מבזבזת רוחב פס.

## להמשיך הלאה

עברו בלולאה על כל העמודים: שלפו את `/todos?_page=1&_limit=4`, קראו את `X-Total-Pages`, ואז המשיכו לשלוף עד שאספתם את כל עשר המשימות.

> **תורכם:** בצעו חמש בקשות. סננו עורכים (editors), ספרו את המשימות שהושלמו, קחו את המשתמש הראשון במיון יורד לפי שם, חפשו `london` בעזרת `URLSearchParams`, והדפיסו את עמוד 2 של המשימות (limit 3) עם הסכומים שנקראו מכותרות התגובה.
