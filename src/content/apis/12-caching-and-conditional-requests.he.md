---
title: "מטמון ובקשות מותנות (ETag)"
summary: "נמנעים מהורדת אותם נתונים פעמיים בעזרת ETag, If-None-Match ותשובת 304 Not Modified."
hints:
  - "ETag הוא טביעת אצבע של הנתונים. השרת שולח אותו בכותרת התשובה ETag; בפעם הבאה שולחים אותו חזרה ב-If-None-Match. אם הנתונים לא השתנו, השרת עונה 304 בלי גוף, ואתם משתמשים שוב בעותק השמור שלכם."
  - "const first = await fetch(BASE + '/config'); const etag = first.headers.get('ETag');   const second = await fetch(BASE + '/config', { headers: { 'If-None-Match': etag } });   ערך ה-ETag כולל את המרכאות הכפולות שלו: \"v1\" (השאירו אותן כפי שהן)."
  - "async function getConfig() { const headers = {}; if (cache.etag) headers['If-None-Match'] = cache.etag; const res = await fetch(BASE + '/config', { headers }); if (res.status === 304) return { status: 304, data: cache.data }; cache.etag = res.headers.get('ETag'); cache.data = await res.json(); return { status: res.status, data: cache.data }; }"
quiz:
  - q: "מה השרת עונה כש-If-None-Match שלכם תואם ל-ETag הנוכחי?"
    options: ["200 עם כל הנתונים שוב", "304 Not Modified בלי גוף", "404 Not Found"]
  - q: "מהו ETag?"
    options: ["סיסמה ל-API", "תווית (טביעת אצבע) שמשתנה בכל פעם שהנתונים משתנים", "הזמן שהבקשה לקחה"]
  - q: "מה היתרון של בקשות מותנות?"
    options: ["הן חוסכות רוחב פס: נתונים שלא השתנו לא נשלחים שוב, ובכל זאת מקבלים תשובה עדכנית", "הן הופכות כתיבות לבטוחות יותר", "הן מסתירות את ה-URL"]
  - q: "Cache-Control: max-age=60 בתשובה אומר ללקוחות:"
    options: ["אפשר להשתמש שוב בנתונים בלי לשאול את השרת במשך 60 שניות", "הבקשה תחרוג מהזמן אחרי 60 שניות", "מותר רק 60 בקשות"]
messages:
  - "שלחו את כותרת הבקשה If-None-Match."
  - "קראו את כותרת התשובה ETag."
  - "טפלו בסטטוס 304 Not Modified."
  - "כתבו async function getConfig()."
---

הבקשה המהירה ביותר היא זו שלא שולחים אף פעם, והשנייה במהירותה היא זו שבה השרת רק אומר "אין שום דבר חדש". מטמון (caching) הוא הדרך שבה דפדפנים, אפליקציות ו-CDN נמנעים מהורדת אותם בתים שוב ושוב. הוא חוסך זמן, סוללה וכסף, והוא נושא אהוב בראיונות עבודה.

## שני סוגי מטמון

1. **רעננות (בלי בקשה בכלל).** התשובה אומרת כמה זמן הנתונים שלה תקפים, בעזרת `Cache-Control: max-age=60`: "במשך 60 שניות מותר להשתמש בזה שוב בלי לשאול אותי".
2. **אימות (בקשה זולה).** כשהנתונים אולי מיושנים, **שואלים את השרת אם הם השתנו**. אם לא, הוא עונה ב-`304 Not Modified` זעיר ובלי גוף. זה מה ש**בקשה מותנית** עושה.

## ETag ו-If-None-Match

נקודת הקצה לתרגול `/config` ממחישה את זה. התשובה הראשונה נושאת טביעת אצבע של הנתונים, ה-**ETag**:

```
GET /config HTTP/1.1
Host: api.academy.test
```

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
ETag: "v1"
Cache-Control: max-age=60

{"theme":"dark","pageSize":10}
```

שומרים את הגוף ואת ה-ETag. בפעם הבאה שולחים את ה-ETag חזרה בכותרת `If-None-Match`, שפירושה "תנו לי את הנתונים רק אם זו **לא** הגרסה שכבר יש לי":

```
GET /config HTTP/1.1
Host: api.academy.test
If-None-Match: "v1"
```

```
HTTP/1.1 304 Not Modified
ETag: "v1"

```

אין **גוף**: ממשיכים להשתמש בעותק השמור. אילו הנתונים היו משתנים, השרת היה עונה `200` עם הגוף החדש ו-ETag חדש, ואתם הייתם מחליפים את המטמון.

התהליך בתמונה אחת:

```
client                                  server
  | GET /config                            |
  |--------------------------------------->|
  |   200 + ETag "v1" + body               |   (client stores etag and body)
  |<---------------------------------------|
  | GET /config  If-None-Match: "v1"       |
  |--------------------------------------->|
  |   304 Not Modified (no body)           |   (client reuses its copy)
  |<---------------------------------------|
```

## בקוד

```js
const first = await fetch(BASE + '/config');
const etag = first.headers.get('ETag');            // "v1" (with the quotes!)
const second = await fetch(BASE + '/config', {
  headers: { 'If-None-Match': etag },
});
console.log(second.status);                        // prints: 304
```

שימו לב לשני פרטים:

- `304` **אינה** שגיאה, ו-`res.ok` הוא `false` עבורה (`ok` פירושו 200 עד 299). בדקו במפורש `res.status === 304`, לפני הטיפול הכללי בשגיאות.
- ל-`304` אין גוף, ולכן `res.json()` הייתה זורקת `SyntaxError: Unexpected end of JSON input`. השתמשו בעותק השמור שלכם במקום.

אובייקט (object) מטמון קטן הופך את התבנית לשימושית שוב ושוב:

```js
const cache = { etag: null, data: null };
async function getConfig() {
  const headers = {};
  if (cache.etag) headers['If-None-Match'] = cache.etag;
  const res = await fetch(BASE + '/config', { headers });
  if (res.status === 304) return cache.data;
  cache.etag = res.headers.get('ETag');
  cache.data = await res.json();
  return cache.data;
}
```

## דפדפנים אמיתיים עושים את זה בשבילכם

כשקוראים ל-`fetch` בדפדפן אמיתי, מטמון ה-HTTP כבר שומר תשובות עם `Cache-Control` ושולח `If-None-Match` אוטומטית. כתיבה ידנית עדיין חשובה: לסקריפטים בצד שרת, לאפליקציות נייד וללקוחות קטנים אין מטמון כזה, וההבנה של הכותרות עוזרת לעשות debug למה שהדפדפן עושה.

## מלכודות ועקרונות תכנון של מטמון

- **מה לשמור במטמון:** נתונים שמשתנים לעיתים רחוקות (הגדרות, מדינות, רשימות מוצרים). לא סודות של משתמש במטמונים משותפים, ולא נתונים שחייבים להיות תמיד חיים.
- **ביטול תוקף של מטמון** (cache invalidation) קשה באופן מפורסם: אם `PUT` משנה את הנתונים, העותק השמור שלכם מיושן. ETag חדש פותר את זה, כי הבקשה המותנית הבאה מחזירה `200`.
- **ETag חלש מול חזק.** ערך כמו `W/"v1"` הוא מאמת *חלש*: "שקול מספיק". התייחסו ל-ETag כאל מחרוזת אטומה ושלחו אותו חזרה ללא שינוי.

> **שימו לב:**
> - **השמטת המרכאות.** ערך ה-ETag הוא `"v1"` כולל המרכאות הכפולות. שליחת `v1` לא תואמת, ומקבלים `200` מלא בכל פעם.
> - **קריאה ל-`res.json()` על 304.** אין גוף: `SyntaxError: Unexpected end of JSON input`. החזירו את הנתונים השמורים.
> - **התייחסות ל-304 ככישלון** כי `res.ok` הוא false. בדקו `304` לפני בדיקת השגיאה.
> - **שכחתם לעדכן את המטמון** כשמקבלים `200`: הבקשה המותנית הבאה עדיין תשתמש ב-ETag הישן ותמשיך לקבל תשובות מלאות.
> - **שמירה במטמון של תשובות ל-POST, PUT או DELETE.** רק קריאות בטוחות וחוזרות (בדרך כלל `GET`) נשמרות במטמון.

## להמשיך הלאה

הוסיפו חותמת זמן `Date.now()` למטמון וכבדו את `max-age=60`: דלגו על הבקשה לגמרי כל עוד העותק רענן, ושלחו בקשה מותנית רק אחרי שהוא פג.

> **תורכם:** הביאו את `/config` והדפיסו את הסטטוס, את `ETag` ואת `Cache-Control`. חזרו על זה עם `If-None-Match` כדי לראות את ה-`304` ואת הגוף הריק שלו, ואז עם ETag שגוי. לבסוף כתבו את `getConfig()` עם מטמון קטן וקראו לה שלוש פעמים.
