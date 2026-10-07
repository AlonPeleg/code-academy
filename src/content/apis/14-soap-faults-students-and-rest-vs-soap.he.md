---
title: "SOAP ב': תקלות, שירות הסטודנטים ו-REST מול SOAP"
summary: "מטפלים בתקלות SOAP, קוראים לשירות הסטודנטים, ואז משלבים REST ו-SOAP בתוכנית מסכמת אחת ומשווים בין שני הסגנונות."
hints:
  - "תקלת SOAP (fault) היא תשובת XML רגילה עם סטטוס HTTP 500 ואלמנט <soap:Fault> שמכיל <faultcode> ו-<faultstring>. בדקו את doc.find('Fault') לפני שאתם קוראים את התוצאה הרגילה. השתמשו ב-doc.get('name') כדי לקרוא את הטקסט של ה-<name> הראשון בתוך התשובה."
  - "const { status, doc } = await soapCall('calculator', 'Divide', '<a>10</a><b>0</b>'); if (doc.find('Fault')) console.log('fault: ' + status + ' ' + doc.get('faultcode') + ' ' + doc.get('faultstring'));   const list = await soapCall('students', 'ListStudents', ''); for (const s of list.doc.findAll('student')) { ... s.attrs.id, s.get('name'), s.get('grade') }"
  - "const students = list.doc.findAll('student'); const total = students.reduce((sum, s) => sum + Number(s.get('grade')), 0); console.log('average: ' + total / students.length);   const rest = await fetch(BASE + '/users'); const users = Number(rest.headers.get('X-Total-Count')); const add = await soapCall('calculator', 'Add', '<a>' + users + '</a><b>' + students.length + '</b>'); console.log(users + ' + ' + students.length + ' = ' + add.doc.get('result'));"
messages:
  - "השתמשו בפונקציית העזר soapCall עבור בקשות ה-SOAP."
  - "חפשו את האלמנט Fault בתשובה."
  - "השתמשו ב-doc.findAll('student') כדי לעבור על הסטודנטים בלולאה."
  - "קראו את סך המשתמשים של REST מהכותרת X-Total-Count."
  - "השתמשו בפעולה Add של המחשבון עבור הסכום האחרון."
quiz:
  - q: "קריאת SOAP נכשלת בצד השרת. איך הכישלון מגיע בדרך כלל?"
    options: ["כ-HTTP 404 עם גוף ריק", "כאלמנט Fault של XML בתוך Envelope, בדרך כלל עם סטטוס HTTP 500", "fetch זורקת חריגה (exception)"]
  - q: "ב-soap:Fault, מה faultcode בערך 'soap:Client' אומר לכם?"
    options: ["הטעות היא בבקשה ששלחתם", "השרת קרס", "הרשת אינה זמינה"]
    explain: "תקלות Client אומרות שהבקשה הייתה שגויה (קלט לא תקין, כותרת חסרה, פעולה לא מוכרת). תקלות Server אומרות שהשירות עצמו נכשל."
  - q: "מה היתרון האופייני של REST על פני SOAP עבור API ציבורי חדש?"
    options: ["הוא תומך בחוזים פורמליים וב-WS-Security", "הוא קל ופשוט יותר: כתובות URL רגילות, JSON ו-caching סטנדרטי של HTTP", "הוא תמיד צריך XML"]
  - q: "איפה SOAP עדיין מצטיין?"
    options: ["אינטגרציות ארגוניות וישנות שדורשות חוזה קפדני (WSDL), תקנים לאבטחה ולטרנזקציות", "פרויקטים קטנים של תחביב", "דפדפנים שמציירים אנימציות"]
---

בשיעור הקודם שלחתם בקשת SOAP וקראתם תשובה מוצלחת. תוכניות אמיתיות מתמודדות גם עם המקרה ההפוך: השירות אומר לא. ל-SOAP יש דרך מובנית ומתוקננת לדווח על בעיות, היא **תקלה** (fault). בשיעור הזה תלמדו לטפל בתקלות, לקרוא לשירות שני שמחזיר רשימות, ואז לשים את REST ואת SOAP זה לצד זה בתוכנית אחת.

## תקלות SOAP

תקלה היא מעטפת SOAP רגילה שבה ה-Body מכיל אלמנט `Fault` במקום תשובה. סטטוס ה-HTTP הוא `500`. נסו לחלק באפס במחשבון:

```
POST /soap/calculator HTTP/1.1
Content-Type: text/xml; charset=utf-8
SOAPAction: http://academy.test/calculator/Divide

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Divide xmlns="http://academy.test/calculator"><a>10</a><b>0</b></Divide>
  </soap:Body>
</soap:Envelope>
```

```
HTTP/1.1 500 Internal Server Error
Content-Type: text/xml; charset=utf-8

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <soap:Fault>
      <faultcode>soap:Server</faultcode>
      <faultstring>Cannot divide by zero</faultstring>
    </soap:Fault>
  </soap:Body>
</soap:Envelope>
```

- `faultcode` אומר **מי אשם**: `soap:Client` (הבקשה שלכם שגויה), `soap:Server` (השירות נכשל), `soap:VersionMismatch` (שורש מעטפת שגוי).
- `faultstring` הוא הסבר שקריא לבני אדם.

מכיוון שתקלה היא סתם תשובה, `fetch` **לא** זורקת שגיאה. בדקו את התשובה בעצמכם, או בחיפוש אלמנט `Fault` (הדרך האמינה) או בבדיקת הסטטוס:

```js
const { status, doc } = await soapCall('calculator', 'Divide', '<a>10</a><b>0</b>');
if (doc.find('Fault')) {
  console.log(doc.get('faultcode') + ': ' + doc.get('faultstring'));
}
```

זה משקף את כלל ה-REST משיעור 3: הצלחה ברמת HTTP אינה זהה להצלחה עסקית.

## שירות הסטודנטים

ל-`/soap/students` יש שתי פעולות:

| פעולה | פרמטרים | תשובה |
| --- | --- | --- |
| `GetStudent` | `<id>1</id>` | `<student>` אחד עם `<name>`, `<city>`, `<grade>`; תקלת `Client` כשהמזהה (id) לא מוכר |
| `ListStudents` | אין | הרבה אלמנטי `<student id="1">`, כל אחד עם `<name>` ו-`<grade>` |

תשובת `ListStudents` נראית כך, ולכן עוברים בלולאה על האלמנטים החוזרים וקוראים את המאפיין `id`:

```xml
<ListStudentsResponse xmlns="http://academy.test/students">
  <student id="1"><name>Maya</name><grade>92</grade></student>
  <student id="2"><name>Ben</name><grade>78</grade></student>
  <student id="3"><name>Chen</name><grade>85</grade></student>
</ListStudentsResponse>
```

```js
for (const s of doc.findAll('student')) {
  console.log(s.attrs.id + ': ' + s.get('name') + ' ' + s.get('grade'));
}
```

זכרו שכל ערך שמגיע מ-XML הוא **מחרוזת**: המירו ציונים עם `Number(...)` לפני שמחברים אותם.

## REST מול SOAP

שניהם שולחים בקשות HTTP, אבל יש להם פילוסופיות שונות:

| | REST | SOAP |
| --- | --- | --- |
| סגנון | משאבים (שמות עצם) בכתובות URL, שיטות HTTP כפעלים | פעולות (פעלים) שנשלחות לנקודת קצה אחת |
| פורמט | בדרך כלל JSON, וגם XML או אחרים | XML בלבד |
| חוזה | לא פורמלי; אפשר OpenAPI | **WSDL** פורמלי, טיפוסים קפדניים |
| שגיאות | קודי סטטוס של HTTP (`404`, `422`) | אלמנטי `Fault` (לרוב HTTP `500`) |
| Caching | מובנה (`GET`, ETag) | קשה: תמיד `POST` |
| משקל | קל, קל לנסות בדפדפן | כבד יותר, דורש כלים |
| תוספות | מוסיפים מה שצריך | תקנים לאבטחה (WS-Security), לטרנזקציות ולאמינות |
| שימוש אופייני | API ציבוריים של אתרים ואפליקציות | בנקים, חברות ביטוח, ממשלה, מערכות ארגוניות ישנות |

אף אחד מהם אינו "טוב יותר". בחרו ב-REST לרוב העבודות החדשות, וצפו להשתמש ב-SOAP כשמערכת קיימת דורשת זאת. לעיתים קרובות תוכנית אחת קוראת לשניהם, וזה בדיוק התרגיל המסכם שלמטה.

> **שימו לב:**
> - **התייחסות ל-HTTP 500 כאל "אין נתונים".** ב-SOAP הוא נושא את הסבר התקלה. קראו את הגוף לפני שאתם מוותרים.
> - **הנחה שתקלה אומרת ש-`fetch` זרקה שגיאה.** היא לא זרקה; הסתכלו על אלמנט Fault.
> - **קריאה ל-`parseXML` על משהו שאינו XML.** אם שרת או proxy מחזירים טקסט רגיל או HTML, היא זורקת `Invalid XML: ...`. עטפו אותה ב-`try/catch` כשמדברים עם שירותים אמיתיים.
> - **חישובים על טקסט.** `s.get('grade') + 1` נותן `"921"`, לא `93`.
> - **הצבת פרמטרים במקום הלא נכון.** `<id>` חייב להיות בתוך אלמנט הפעולה, בתוך `Body`.
> - **שכחתם ש-`findAll` מחזירה מערך ו-`find` מחזירה אלמנט אחד (או `null`).** קריאה ל-`.get` על `null` זורקת `TypeError`.

## להמשיך הלאה

גרמו ל-`soapCall` לזרוק שגיאה מותאמת `SoapFault` (כמו ה-`ApiError` משיעור 10) כשהתשובה מכילה תקלה, כך שהקוראים יוכלו להשתמש ב-`try/catch`. או חשבו את הממוצע דרך שירות המחשבון עם `Add` ו-`Divide`.

> **תורכם:** השתמשו בפונקציית העזר `soapCall` כדי להציג תקלת חלוקה באפס, להביא סטודנט אחד, לעורר את תקלת הסטודנט הלא מוכר, להציג את כל הסטודנטים עם הממוצע שלהם, ולסיים את התרגיל המסכם: ספרו את המשתמשים דרך REST, ספרו את הסטודנטים דרך SOAP וחברו את שני המספרים עם המחשבון.
