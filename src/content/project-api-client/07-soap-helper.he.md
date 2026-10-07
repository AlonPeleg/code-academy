---
title: "שלב 7: עוזר SOAP וההדגמה הסופית"
summary: "בונים את מעטפת ה-SOAP, שולחים אותה עם הכותרת SOAPAction, מנתחים את ה-XML והופכים faults ל-ApiError."
hints:
  - "קריאת SOAP היא POST שהגוף שלו הוא XML: Envelope > Body > <action>parameters</action>. הוסיפו את הכותרות Content-Type text/xml ו-SOAPAction, ואז נתחו את טקסט התשובה עם parseXML."
  - "אחרי parseXML, חפשו קודם את doc.find(\"Fault\"): אם הוא קיים, זרקו new ApiError(response.status, fault.get(\"faultstring\"), { code: fault.get(\"faultcode\") }). אחרת החזירו את doc.find(\"Body\").children[0]. xmlParams({ a: 2, b: 3 }) בונה \"<a>2</a><b>3</b>\" עם escapeXml על כל ערך."
  - "const envelope = '<?xml version=\"1.0\" encoding=\"utf-8\"?><soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><' + action + ' xmlns=\"' + namespace + '\">' + bodyXml + \"</\" + action + \"></soap:Body></soap:Envelope>\";  fetch(this.baseUrl + \"/soap/\" + service, { method: \"POST\", headers: { \"Content-Type\": \"text/xml; charset=utf-8\", SOAPAction: namespace + \"/\" + action }, body: envelope });"
messages:
  - "הוסיפו את המתודה soapCall(service, action, bodyXml)."
  - "שלחו את הכותרת SOAPAction."
  - "נתחו את התשובה עם parseXML(text)."
  - "חפשו את האלמנט soap:Fault וזרקו ApiError."
  - "עטפו את הבקשה ב-soap:Envelope."
quiz:
  - q: "מהי ה-Envelope של SOAP?"
    options: ["מעטפת ה-XML החיצונית שמכילה את ה-Body עם הפעולה", "כותרת של סיסמה", "סטטוס התשובה"]
  - q: "למה מבצעים escape לערכים כמו Tom & Jerry עם escapeXml לפני שמכניסים אותם ל-XML?"
    options: ["כדי שהבקשה תהיה קטנה יותר", "SOAP אוסר על שמות", "תו & או < בלי escape שובר את מבנה ה-XML, והשרת אומר שהוא לא well-formed"]
  - q: "איך שירות SOAP מדווח על שגיאה?"
    options: ["עם תשובה ריקה", "עם אלמנט soap:Fault בתשובת ה-XML (וסטטוס HTTP 500)", "עם אובייקט JSON מהצורה { error }"]
---
לא כל שירות מדבר JSON. בנקים, ממשלות ומערכות ישנות רבות בחברות עדיין משתמשים ב-**SOAP**, פרוטוקול מבוסס XML. בשלב האחרון הזה הלקוח שלכם לומד לקרוא לשירותי SOAP והופך את השגיאות שלהם לאותו `ApiError` כמו כל השאר. אחר כך תריצו את הספרייה כולה בהדגמה סופית.

## איפה אנחנו

`ApiClient` מטפל בהתחברות, ב-CRUD, בניסיונות חוזרים, ב-timeouts ובעימוד עבור שירותי REST/JSON. SOAP שונה בארבעה דברים: הגוף הוא XML, חייבים לעטוף אותו ב**מעטפת** (envelope), כל קריאה צריכה כותרת `SOAPAction`, והשגיאות חוזרות גם הן כ-XML.

## מה נוסיף, ולמה

עוזר בשם `client.soapCall(service, action, bodyXml)` שמסתיר את כל זה. מי שקורא פשוט כותב:

```js
const result = await client.soapCall("calculator", "Add", xmlParams({ a: 2, b: 3 }));
console.log(result.get("result"));   // 5
```

מקום אחד מכיר את פורמט המעטפת, ולכן שינוי בפרוטוקול הוא שינוי בפונקציה אחת.

## הדרכה צעד אחר צעד

**1. המעטפת.** בקשת SOAP 1.1 היא XML בצורה הזו:

```xml
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <Add xmlns="http://academy.test/calculator"><a>2</a><b>3</b></Add>
  </soap:Body>
</soap:Envelope>
```

ה-`Envelope` הוא העטיפה החיצונית, ה-`Body` מחזיק את הפעולה, ואלמנט הפעולה (`Add`) מכיל את הפרמטרים שלה. בקוד בונים את זה בשרשור מחרוזות. עוזר קטן `xmlParams({ a: 2, b: 3 })` מייצר `<a>2</a><b>3</b>`; הוא מבצע **escape** לתווים כמו `<` ו-`&` (`&lt;`, `&amp;`) כדי שנתוני משתמש לעולם לא ישברו את מבנה ה-XML, אותו רעיון כמו ההגנה מפני SQL injection.

**2. הבקשה.** SOAP תמיד משתמש ב-`POST`, עם שתי כותרות מיוחדות:

```js
fetch(this.baseUrl + "/soap/" + service, {
  method: "POST",
  headers: { "Content-Type": "text/xml; charset=utf-8", SOAPAction: namespace + "/" + action },
  body: envelope,
});
```

`SOAPAction` נותנת שם לפעולה שנקראת. בלעדיה השרת עונה עם fault: `Missing the SOAPAction header`.

**3. ניתוח התשובה.** בדפדפנים יש `DOMParser`, אבל ל-workers שרצים ברקע אין, ולכן סביבת ההרצה הזו נותנת לכם את הפונקציה הגלובלית `parseXML(text)`. היא מחזירה עץ של צמתים (nodes): `node.get("result")` הוא הטקסט של הצאצא הראשון בשם `result`, `node.find("Fault")` הוא הצומת הראשון שמתאים או `null`, `node.findAll("student")` היא רשימה, `node.attrs` מחזיק את התכונות (attributes) ו-`node.children` את צמתי הילדים. תחיליות של מרחבי שמות (namespace) כמו `soap:` מתעלמים מהן בחיפוש.

**4. Faults הופכים לשגיאות.** SOAP מדווח על כשלים כאלמנט XML בשם `Fault` (השרת גם משתמש בסטטוס HTTP 500). חפשו אותו **לפני** שאתם מחפשים תוצאות:

```js
const fault = doc.find("Fault");
if (fault) {
  throw new ApiError(response.status, fault.get("faultstring"), { code: fault.get("faultcode") });
}
return doc.find("Body").children[0];
```

הילד הראשון של ה-Body הוא אלמנט התשובה, למשל `AddResponse`. אם הטקסט בכלל אינו XML תקין, `parseXML` זורקת שגיאה, ואת זה עוטפים גם כן ב-`ApiError`, כך שמי שקורא צריך לתפוס רק סוג אחד של שגיאה.

## ההדגמה הסופית

ההדגמה בתחתית בודקת הכול: התחברות, CRUD, עימוד, ניסיונות חוזרים ו-SOAP, כולל fault של חלוקה באפס וחיפוש תלמיד. קראו אותה כמדריך שימוש לספרייה שלכם.

> **שימו לב:**
> - שליחת כותרות JSON לשירות SOAP: השרת עונה `Content-Type must be text/xml for SOAP 1.1`.
> - לשכוח ש-fault של SOAP מגיע עם סטטוס כשל וגם עם גוף: נתחו את ה-XML לפני שאתם מחליטים שזו "סתם שגיאת HTTP".
> - לא לבצע escape לערכים: שם כמו `Tom & Jerry` הופך את ה-XML ללא תקין (`The request is not well-formed XML`).
> - ל-`ListStudents` אין פרמטרים: העבירו מחרוזת ריקה בתור `bodyXml`.

## מה לבנות הלאה

* גרמו ל-`soapCall` להשתמש באותו קוד של timeout ושל ניסיונות חוזרים כמו `send`.
* הוסיפו מתודות עטיפה כמו `client.soap.calculator.add(2, 3)` שנבנות על `soapCall`.
* שמרו תוצאות GET במטמון (cache) בעזרת הכותרות ETag ו-`If-None-Match` (`/config` תומך בזה: `304 Not Modified`).
* הוסיפו בדיקה של הכותרת `Retry-After` כדי שההמתנה בין ניסיונות תכבד את מה שהשרת מבקש.
* כתבו את הספרייה כמודול אמיתי ופרסמו אותה לפרויקטים שלכם.

> **תורכם:** הוסיפו את `escapeXml`, את `xmlParams` ואת `soapCall(service, action, bodyXml)` ל-`ApiClient`: בנו את המעטפת, שלחו אותה ב-POST עם `Content-Type: text/xml` ועם `SOAPAction`, נתחו את התשובה עם `parseXML`, זרקו `ApiError` עבור `Fault`, ואחרת החזירו את הילד הראשון של ה-Body. אחר כך הריצו את ההדגמה הסופית.
