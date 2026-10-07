---
title: "SOAP א': XML, מעטפות ו-WSDL"
summary: "לומדים מהו SOAP, קוראים XML, בונים מעטפת SOAP ביד וקוראים לשירות המחשבון."
hints:
  - "קריאת SOAP היא בקשת HTTP POST רגילה שהגוף שלה הוא מעטפת XML. שלושה דברים חייבים להיות נכונים: השיטה POST, הכותרת Content-Type: text/xml, וכותרת SOAPAction. מחרוזות תבנית (backticks) מאפשרות להכניס את הפעולה ואת המספרים לתוך ה-XML בעזרת ${...}."
  - "const xml = `<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><${operation} xmlns=\"http://academy.test/calculator\"><a>${a}</a><b>${b}</b></${operation}></soap:Body></soap:Envelope>`;   fetch(BASE + '/soap/calculator', { method: 'POST', headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: 'http://academy.test/calculator/' + operation }, body: xml })"
  - "const res = await fetch(...); const doc = parseXML(await res.text()); return doc.get('result');   WSDL: const wsdl = parseXML(await (await fetch(BASE + '/soap/calculator?wsdl')).text()); wsdl.find('portType').findAll('operation').map((o) => o.attrs.name).join(', ')"
messages:
  - "נתחו את טקסט ה-XML עם parseXML(text)."
  - "שלחו את הכותרת SOAPAction."
  - "הגדירו Content-Type: text/xml עבור SOAP 1.1."
  - "בנו אלמנט soap:Envelope."
  - "קריאות SOAP הן בקשות POST."
quiz:
  - q: "בתוך מה עוברת הודעת SOAP?"
    options: ["מעטפת XML עם Body (ואפשר גם Header), שנשלחת בבקשת HTTP POST", "מחרוזת שאילתה (query string) ב-URL", "אובייקט JSON בבקשת GET"]
  - q: "מהו מסמך WSDL?"
    options: ["קובץ סיסמאות", "יומן של בקשות קודמות", "תיאור XML של שירות: הפעולות, ההודעות והכתובת שלו"]
  - q: "איזו כותרת מציינת את הפעולה שאתם קוראים לה ב-SOAP 1.1?"
    options: ["Accept", "SOAPAction", "Location"]
  - q: "למה ה-Content-Type של שירות ה-SOAP לתרגול הוא text/xml?"
    options: ["כי XML מהיר יותר", "זה יכול להיות כל דבר", "כי הגוף הוא טקסט XML ולא JSON"]
---

לפני ש-JSON ו-REST נהיו פופולריים, חברות גדולות ובנקים חיברו את המערכות שלהם בעזרת **SOAP** (Simple Object Access Protocol). הוא עדיין חי בהרבה מערכות ארגוניות, ממשלתיות ומערכות תשלום, ולכן תפגשו אותו בעבודה במוקדם או במאוחר. החדשות הטובות: SOAP הוא פשוט HTTP שנושא XML, ואת החלק של HTTP אתם כבר מכירים.

## XML בשתי דקות

**XML** הוא פורמט טקסט שבנוי מ*אלמנטים* (elements) מקוננים עם תגית פתיחה ותגית סגירה, ולפעמים גם עם *מאפיינים* (attributes):

```xml
<student id="1">
  <name>Maya</name>
  <grade>92</grade>
</student>
```

- `<name>Maya</name>` הוא אלמנט: שם התגית הוא `name` והטקסט הוא `Maya`.
- `id="1"` הוא מאפיין של `student`.
- לכל תגית פתיחה צריכה להיות תגית סגירה, והתגיות חייבות להיות מקוננות כראוי (`<a><b></b></a>`, אף פעם לא `<a><b></a></b>`), אחרת ה-XML אינו **תקין** (well-formed).
- תווים מיוחדים עוברים קידוד: `<` הופך ל-`&lt;` ו-`&` הופך ל-`&amp;`.

בהשוואה ל-JSON, XML מילולי יותר, אבל יש בו מרחבי שמות (namespaces), שפת סכמה ועשורים של כלים.

## מעטפת ה-SOAP

כל הודעת SOAP היא XML עטוף ב**מעטפת** (Envelope). בתוכה יש Header אופציונלי ו-**Body** חובה, שמכיל אלמנט אחד שנותן שם ל**פעולה** (operation) ומכיל את הפרמטרים שלה:

```
POST /soap/calculator HTTP/1.1
Host: api.academy.test
Content-Type: text/xml; charset=utf-8
SOAPAction: http://academy.test/calculator/Add

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Add xmlns="http://academy.test/calculator">
      <a>7</a>
      <b>5</b>
    </Add>
  </soap:Body>
</soap:Envelope>
```

התשובה היא מעטפת נוספת:

```
HTTP/1.1 200 OK
Content-Type: text/xml; charset=utf-8

<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <AddResponse xmlns="http://academy.test/calculator">
      <result>12</result>
    </AddResponse>
  </soap:Body>
</soap:Envelope>
```

שימו לב להבדלים מ-REST:

| | REST | SOAP |
| --- | --- | --- |
| כתובת | הרבה כתובות URL (`/users/3`) | נקודת קצה **אחת** (`/soap/calculator`) |
| שיטה | GET, POST, PUT, DELETE... | תמיד **POST** |
| מה רוצים | השיטה וה-URL | **אלמנט הפעולה** בגוף ההודעה (`Add`) |
| פורמט | בדרך כלל JSON | תמיד XML |

`xmlns="..."` הוא **מרחב שמות של XML** (namespace): שם ייחודי שמונע בלבול בין אלמנטי `Add` של שני שירותים שונים. מבחינתנו זו מחרוזת קבועה.

## שתי הכותרות המיוחדות

- `Content-Type: text/xml; charset=utf-8` אומרת לשרת שהגוף הוא XML (SOAP 1.1). בלעדיה שירות התרגול עונה בתקלה (fault): `Content-Type must be text/xml for SOAP 1.1`.
- `SOAPAction: ...` נותנת שם לפעולה שאתם רוצים. היא חובה: אם משמיטים אותה מקבלים את התקלה `Missing the SOAPAction header`.

## WSDL: השירות מתאר את עצמו

שירות SOAP מפרסם קובץ **WSDL** (Web Services Description Language), חוזה XML שמפרט את הפעולות, את הפרמטרים ואת הכתובת. כלים יכולים לקרוא אותו וליצור ממנו קוד. נסו:

```js
const res = await fetch(BASE + '/soap/calculator?wsdl');
const text = await res.text();
```

הטקסט מתחיל ב-`<definitions name="Calculator" ...>` ומכיל `<portType>` עם הפעולות (`Add`, `Subtract`, `Multiply`, `Divide`), `<binding>` ו-`<service>` עם הכתובת.

## ניתוח XML עם parseXML

בדפדפנים יש `DOMParser`, אבל קוד שרץ ב-worker (כמו העורך הזה) אינו כולל אותו, ולכן הקורס מספק פונקציה גלובלית `parseXML(text)` שמחזירה עץ קטן:

```js
const doc = parseXML(text);
doc.get('result');            // text of the first <result> anywhere inside, or ''
doc.find('student');          // the first <student> element (or null)
doc.findAll('student');       // an array of all <student> elements
doc.find('student').attrs.id; // an attribute, here "1"
doc.text;                     // the element's own text
doc.children;                 // its child elements
```

תחיליות כמו `soap:` מתעלמים מהן בחיפוש, ולכן `find('Body')` מוצאת את `<soap:Body>`. XML פגום גורם ל-`parseXML` לזרוק את השגיאה `Invalid XML: ...`.

## בניית הבקשה

מחרוזות תבנית (backticks) מושלמות להרכבת XML, כי `${...}` מכניסה ערכים למקום:

```js
const xml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body><${operation} xmlns="http://academy.test/calculator"><a>${a}</a><b>${b}</b></${operation}></soap:Body>
</soap:Envelope>`;
```

אם הערכים מגיעים ממשתמשים, קודדו קודם את `<`, `>` ו-`&`; אחרת הם עלולים לשבור את ה-XML שלכם (או להזריק אליו תוכן).

> **שימו לב:**
> - **שכחתם את `SOAPAction`** או שלחתם `Content-Type: application/json`. שניהם גורמים לתקלת SOAP.
> - **תגיות שלא תואמות.** `<a>7</b>` אינו XML תקין, והשרת עונה `The request is not well-formed XML`.
> - **שימוש ב-`res.json()` על התשובה.** התשובה היא טקסט XML: השתמשו ב-`res.text()` וב-`parseXML`.
> - **טעות בשורש.** האלמנט חייב להיות `Envelope`; כל דבר אחר גורם לתקלת `VersionMismatch`.
> - **ציפייה למספרים.** `doc.get('result')` מחזירה **מחרוזת**, ולכן השתמשו ב-`Number(...)` לפני חישובים.
> - **שכחתם ש-SOAP משתמש ב-POST גם לקריאה בלבד**, ושתקלות SOAP חוזרות בדרך כלל כ-HTTP 500 (בשיעור הבא).

## להמשיך הלאה

קראו ל-`Subtract` עם `a=3` ו-`b=10`. אחר כך שנו את SOAPAction לערך ריק (או הסירו אותה) וקראו את גוף השגיאה.

> **תורכם:** נתחו את ה-WSDL של המחשבון והדפיסו את שם השירות, את שמות הפעולות ואת נקודת הקצה. אחר כך כתבו את `calculate(operation, a, b)` ששולחת מעטפת SOAP עם הכותרות הנכונות ומחזירה את טקסט ה-`<result>`, והדפיסו את שלושת החישובים.
