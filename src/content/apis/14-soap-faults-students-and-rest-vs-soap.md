---
title: "SOAP II: faults, the students service and REST vs SOAP"
summary: Handle SOAP faults, call the students service, then combine REST and SOAP in one capstone program and compare the two styles.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // Already written: sends one SOAP call and returns { status, doc } (doc is the parsed XML).
      //   service    'calculator' or 'students'
      //   operation  e.g. 'Divide' or 'GetStudent'
      //   innerXml   the parameters as XML text, e.g. '<id>1</id>'
      async function soapCall(service, operation, innerXml) {
        const xml =
          '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' +
          '<' + operation + ' xmlns="http://academy.test/' + service + '">' + innerXml + '</' + operation + '>' +
          '</soap:Body></soap:Envelope>';
        const res = await fetch(BASE + '/soap/' + service, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://academy.test/' + service + '/' + operation,
          },
          body: xml,
        });
        return { status: res.status, doc: parseXML(await res.text()) };
      }

      // 1. FAULT: call the calculator Divide with <a>10</a><b>0</b>.
      //    The server replies with HTTP status 500 and a <soap:Fault>. Print
      //      "fault: 500 soap:Server Cannot divide by zero"
      //    built from the status, doc.get('faultcode') and doc.get('faultstring').
      //    Only print it when doc.find('Fault') exists.

      // 2. GetStudent with <id>1</id>. Print "student 1: Maya from Austin, grade 92"
      //    using doc.get('name'), doc.get('city') and doc.get('grade').

      // 3. GetStudent with <id>99</id> (no such student). It is a fault again.
      //    Print "student 99: " + faultcode + " " + faultstring

      // 4. ListStudents (no parameters: pass an empty string).
      //    Loop over doc.findAll('student') and print "1: Maya 92" (the id is the attribute
      //    attrs.id, then name, then grade). Then print "average: " + the average grade.

      // 5. CAPSTONE, REST and SOAP together:
      //    - REST: fetch BASE + '/users' and read the X-Total-Count header. Print "REST users: 5"
      //    - SOAP: the number of students from ListStudents. Print "SOAP students: 3"
      //    - SOAP: ask the calculator to Add the two numbers and print "5 + 3 = 8".
check:
  output: |
    fault: 500 soap:Server Cannot divide by zero
    student 1: Maya from Austin, grade 92
    student 99: soap:Client No student with id 99
    1: Maya 92
    2: Ben 78
    3: Chen 85
    average: 85
    REST users: 5
    SOAP students: 3
    5 + 3 = 8
  code:
    - { pattern: 'soapCall\(', message: "Use the soapCall helper for the SOAP requests." }
    - { pattern: 'Fault', message: "Look for the Fault element in the answer." }
    - { pattern: 'findAll\(', message: "Use doc.findAll('student') to loop over the students." }
    - { pattern: 'X-Total-Count', message: "Read the REST total from the X-Total-Count header." }
    - { pattern: 'Add', message: "Use the calculator Add operation for the final sum." }
hints:
  - "A SOAP fault is a normal XML answer with HTTP status 500 and a <soap:Fault> element holding <faultcode> and <faultstring>. Check doc.find('Fault') before reading the normal result. Use doc.get('name') to read the text of the first <name> inside the answer."
  - "const { status, doc } = await soapCall('calculator', 'Divide', '<a>10</a><b>0</b>'); if (doc.find('Fault')) console.log('fault: ' + status + ' ' + doc.get('faultcode') + ' ' + doc.get('faultstring'));   const list = await soapCall('students', 'ListStudents', ''); for (const s of list.doc.findAll('student')) { ... s.attrs.id, s.get('name'), s.get('grade') }"
  - "const students = list.doc.findAll('student'); const total = students.reduce((sum, s) => sum + Number(s.get('grade')), 0); console.log('average: ' + total / students.length);   const rest = await fetch(BASE + '/users'); const users = Number(rest.headers.get('X-Total-Count')); const add = await soapCall('calculator', 'Add', '<a>' + users + '</a><b>' + students.length + '</b>'); console.log(users + ' + ' + students.length + ' = ' + add.doc.get('result'));"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      async function soapCall(service, operation, innerXml) {
        const xml =
          '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body>' +
          '<' + operation + ' xmlns="http://academy.test/' + service + '">' + innerXml + '</' + operation + '>' +
          '</soap:Body></soap:Envelope>';
        const res = await fetch(BASE + '/soap/' + service, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://academy.test/' + service + '/' + operation,
          },
          body: xml,
        });
        return { status: res.status, doc: parseXML(await res.text()) };
      }

      const divide = await soapCall('calculator', 'Divide', '<a>10</a><b>0</b>');
      if (divide.doc.find('Fault')) {
        console.log('fault: ' + divide.status + ' ' + divide.doc.get('faultcode') + ' ' + divide.doc.get('faultstring'));
      }

      const one = await soapCall('students', 'GetStudent', '<id>1</id>');
      console.log('student 1: ' + one.doc.get('name') + ' from ' + one.doc.get('city') + ', grade ' + one.doc.get('grade'));

      const missing = await soapCall('students', 'GetStudent', '<id>99</id>');
      if (missing.doc.find('Fault')) {
        console.log('student 99: ' + missing.doc.get('faultcode') + ' ' + missing.doc.get('faultstring'));
      }

      const list = await soapCall('students', 'ListStudents', '');
      const students = list.doc.findAll('student');
      let total = 0;
      for (const s of students) {
        console.log(s.attrs.id + ': ' + s.get('name') + ' ' + s.get('grade'));
        total += Number(s.get('grade'));
      }
      console.log('average: ' + total / students.length);

      const rest = await fetch(BASE + '/users');
      const users = Number(rest.headers.get('X-Total-Count'));
      console.log('REST users: ' + users);
      console.log('SOAP students: ' + students.length);
      const add = await soapCall('calculator', 'Add', '<a>' + users + '</a><b>' + students.length + '</b>');
      console.log(users + ' + ' + students.length + ' = ' + add.doc.get('result'));
quiz:
  - q: "A SOAP call fails on the server side. How does the failure normally arrive?"
    options: ["As HTTP 404 with an empty body", "As an XML Fault inside an Envelope, usually with HTTP status 500", "fetch throws an exception"]
    answer: 1
  - q: "In a soap:Fault, what is faultcode 'soap:Client' telling you?"
    options: ["The mistake is in the request you sent", "The server crashed", "The network is down"]
    answer: 0
    explain: "Client faults mean the request was wrong (bad input, missing header, unknown operation). Server faults mean the service itself failed."
  - q: "Which is a typical advantage of REST over SOAP for a new public web API?"
    options: ["It supports formal contracts and WS-Security", "It is lighter and simpler: plain URLs, JSON and standard HTTP caching", "It always needs XML"]
    answer: 1
  - q: "Where does SOAP still shine?"
    options: ["Enterprise and legacy integrations that need a strict contract (WSDL), standards for security and transactions", "Tiny hobby projects", "Browsers drawing animations"]
    answer: 0
---

Last lesson you sent a SOAP request and read a successful answer. Real programs also face the other case: the service says no. SOAP has a built-in, standardized way to report problems, the **fault**. In this lesson you learn to handle faults, call a second service that returns lists, and then put REST and SOAP side by side in one program.

## SOAP faults

A fault is a normal SOAP envelope whose Body contains a `Fault` element instead of a response. The HTTP status is `500`. Try dividing by zero on the calculator:

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

- `faultcode` says **who is at fault**: `soap:Client` (your request is wrong), `soap:Server` (the service failed), `soap:VersionMismatch` (wrong envelope root).
- `faultstring` is a human-readable explanation.

Because a fault is just a response, `fetch` does **not** throw. Check the answer yourself, either by looking for the `Fault` element (the reliable way) or by checking the status:

```js
const { status, doc } = await soapCall('calculator', 'Divide', '<a>10</a><b>0</b>');
if (doc.find('Fault')) {
  console.log(doc.get('faultcode') + ': ' + doc.get('faultstring'));
}
```

This mirrors the REST rule from lesson 3: HTTP-level success is not the same as business success.

## The students service

`/soap/students` has two operations:

| Operation | Parameters | Answer |
| --- | --- | --- |
| `GetStudent` | `<id>1</id>` | one `<student>` with `<name>`, `<city>`, `<grade>`; fault `Client` when the id is unknown |
| `ListStudents` | none | many `<student id="1">` elements, each with `<name>` and `<grade>` |

A `ListStudents` answer looks like this, so you loop over the repeating elements and read the `id` attribute:

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

Remember that every value from XML is a **string**: convert grades with `Number(...)` before adding them.

## REST versus SOAP

Both send HTTP requests, but they have different philosophies:

| | REST | SOAP |
| --- | --- | --- |
| Style | resources (nouns) at URLs, HTTP methods as verbs | operations (verbs) sent to one endpoint |
| Format | usually JSON, also XML or others | XML only |
| Contract | informal; optionally OpenAPI | formal **WSDL**, strong typing |
| Errors | HTTP status codes (`404`, `422`) | `Fault` elements (often HTTP `500`) |
| Caching | built in (`GET`, ETag) | difficult: always `POST` |
| Weight | light, easy to try in a browser | heavier, needs tooling |
| Extras | add what you need | standards for security (WS-Security), transactions, reliability |
| Typical use | public web and mobile APIs | banks, insurers, government, older enterprise systems |

Neither is "better". Choose REST for most new work, and expect to use SOAP when an existing system demands it. Often one program calls both, which is exactly the capstone below.

> **Watch out:**
> - **Treating HTTP 500 as "no data".** For SOAP it carries the fault explanation. Read the body before giving up.
> - **Assuming a fault means `fetch` threw.** It did not; look at the Fault element.
> - **Calling `parseXML` on non-XML.** If a server or proxy returns plain text or HTML, it throws `Invalid XML: ...`. Wrap it in `try/catch` when talking to real services.
> - **Doing arithmetic on text.** `s.get('grade') + 1` gives `"921"`, not `93`.
> - **Putting parameters in the wrong place.** `<id>` must be inside the operation element, inside `Body`.
> - **Forgetting `findAll` returns an array and `find` returns one element (or `null`).** Calling `.get` on `null` throws `TypeError`.

## Going further

Make `soapCall` throw a custom `SoapFault` error (like the `ApiError` of lesson 10) when the answer contains a fault, so that callers can use `try/catch`. Or compute the average through the calculator service with `Add` and `Divide`.

> **Your turn:** use the `soapCall` helper to show a divide-by-zero fault, fetch one student, provoke the unknown-student fault, list all students with their average, and finish the capstone: count the users via REST, count the students via SOAP and add the two numbers with the calculator.
