---
title: "SOAP I: XML, envelopes and WSDL"
summary: Learn what SOAP is, read XML, build a SOAP envelope by hand and call the calculator service.
level: advanced
runner: js
files:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      // PART 1: read the WSDL (the service description).
      //   GET BASE + '/soap/calculator?wsdl', read the text and parse it with parseXML(text).
      //   Print three lines:
      //     "service: " + the name attribute of the <service> element  (wsdl.find('service').attrs.name)
      //     "operations: " + the names of the <operation> elements inside <portType>,
      //                      joined with ", "  (wsdl.find('portType').findAll('operation'))
      //     "endpoint: " + the location attribute of the <address> element

      // PART 2: call the service.
      //   Write async function calculate(operation, a, b) that:
      //     - builds this XML text (operation is Add, Subtract, Multiply or Divide):
      //         <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      //           <soap:Body>
      //             <Add xmlns="http://academy.test/calculator"><a>7</a><b>5</b></Add>
      //           </soap:Body>
      //         </soap:Envelope>
      //     - POSTs it to BASE + '/soap/calculator'
      //       with the headers  Content-Type: text/xml; charset=utf-8
      //       and               SOAPAction: http://academy.test/calculator/<operation>
      //     - parses the answer with parseXML and returns the text of <result>
      //       (doc.get('result'))
      //   Then print:
      //     "7 + 5 = 12"
      //     "6 * 7 = 42"
      //     "10 / 4 = 2.5"
      //   by calling calculate('Add', 7, 5), calculate('Multiply', 6, 7), calculate('Divide', 10, 4)
check:
  output: |
    service: CalculatorService
    operations: Add, Subtract, Multiply, Divide
    endpoint: https://api.academy.test/soap/calculator
    7 + 5 = 12
    6 * 7 = 42
    10 / 4 = 2.5
  code:
    - { pattern: 'parseXML\(', message: "Parse the XML text with parseXML(text)." }
    - { pattern: 'SOAPAction', message: "Send the SOAPAction header." }
    - { pattern: 'text/xml', message: "Set Content-Type: text/xml for SOAP 1.1." }
    - { pattern: 'Envelope', message: "Build a soap:Envelope element." }
    - { pattern: 'method\s*:\s*[''"]POST[''"]', message: "SOAP calls are POST requests." }
hints:
  - "A SOAP call is an ordinary HTTP POST whose body is an XML envelope. Three things must be right: the method POST, the header Content-Type: text/xml, and a SOAPAction header. Template strings (backticks) let you drop the operation and numbers into the XML with ${...}."
  - "const xml = `<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\"><soap:Body><${operation} xmlns=\"http://academy.test/calculator\"><a>${a}</a><b>${b}</b></${operation}></soap:Body></soap:Envelope>`;   fetch(BASE + '/soap/calculator', { method: 'POST', headers: { 'Content-Type': 'text/xml; charset=utf-8', SOAPAction: 'http://academy.test/calculator/' + operation }, body: xml })"
  - "const res = await fetch(...); const doc = parseXML(await res.text()); return doc.get('result');   WSDL: const wsdl = parseXML(await (await fetch(BASE + '/soap/calculator?wsdl')).text()); wsdl.find('portType').findAll('operation').map((o) => o.attrs.name).join(', ')"
solution:
  - name: main.js
    code: |
      const BASE = 'https://api.academy.test';

      const wsdlRes = await fetch(BASE + '/soap/calculator?wsdl');
      const wsdl = parseXML(await wsdlRes.text());
      console.log('service: ' + wsdl.find('service').attrs.name);
      console.log('operations: ' + wsdl.find('portType').findAll('operation').map((o) => o.attrs.name).join(', '));
      console.log('endpoint: ' + wsdl.find('address').attrs.location);

      async function calculate(operation, a, b) {
        const xml = `<?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <${operation} xmlns="http://academy.test/calculator">
            <a>${a}</a>
            <b>${b}</b>
          </${operation}>
        </soap:Body>
      </soap:Envelope>`;
        const res = await fetch(BASE + '/soap/calculator', {
          method: 'POST',
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            SOAPAction: 'http://academy.test/calculator/' + operation,
          },
          body: xml,
        });
        const doc = parseXML(await res.text());
        return doc.get('result');
      }

      console.log('7 + 5 = ' + (await calculate('Add', 7, 5)));
      console.log('6 * 7 = ' + (await calculate('Multiply', 6, 7)));
      console.log('10 / 4 = ' + (await calculate('Divide', 10, 4)));
quiz:
  - q: "What does a SOAP message travel inside?"
    options: ["An XML envelope with a Body (and optionally a Header), sent in an HTTP POST", "A URL query string", "A JSON object in a GET request"]
    answer: 0
  - q: "What is a WSDL document?"
    options: ["A password file", "A log of past requests", "An XML description of a service: its operations, messages and address"]
    answer: 2
  - q: "Which header names the operation you are calling in SOAP 1.1?"
    options: ["Accept", "SOAPAction", "Location"]
    answer: 1
  - q: "Why is the Content-Type for the practice SOAP service text/xml?"
    options: ["Because XML is faster", "It could be anything", "Because the body is XML text, not JSON"]
    answer: 2
---

Before JSON and REST became popular, big companies and banks connected their systems with **SOAP** (Simple Object Access Protocol). It is still alive in many enterprise, government and payment systems, so you will meet it at work sooner or later. The good news: SOAP is just HTTP carrying XML, and you already know the HTTP part.

## XML in two minutes

**XML** is a text format built from nested *elements* with opening and closing tags, optionally with *attributes*:

```xml
<student id="1">
  <name>Maya</name>
  <grade>92</grade>
</student>
```

- `<name>Maya</name>` is an element: tag name `name`, text `Maya`.
- `id="1"` is an attribute of `student`.
- Every opening tag needs a closing tag, and tags must nest properly (`<a><b></b></a>`, never `<a><b></a></b>`), otherwise the XML is not **well-formed**.
- Special characters are escaped: `<` is `&lt;`, `&` is `&amp;`.

Compared with JSON, XML is more verbose, but it has namespaces, a schema language, and decades of tooling.

## The SOAP envelope

Every SOAP message is XML wrapped in an **Envelope**. Inside is an optional Header and a required **Body**, which holds one element naming the **operation** with its parameters:

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

The answer is another envelope:

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

Notice the differences from REST:

| | REST | SOAP |
| --- | --- | --- |
| Address | many URLs (`/users/3`) | **one** endpoint (`/soap/calculator`) |
| Method | GET, POST, PUT, DELETE... | always **POST** |
| What you want | the method and URL | the **operation element** in the body (`Add`) |
| Format | usually JSON | always XML |

`xmlns="..."` is an **XML namespace**: a unique name that stops two services' `Add` elements from being confused. For us it is a fixed string.

## The two special headers

- `Content-Type: text/xml; charset=utf-8` tells the server the body is XML (SOAP 1.1). Without it the practice service answers with a fault: `Content-Type must be text/xml for SOAP 1.1`.
- `SOAPAction: ...` names the action you want. It is required: leaving it out gives the fault `Missing the SOAPAction header`.

## WSDL: the service describes itself

A SOAP service publishes a **WSDL** (Web Services Description Language) file, an XML contract listing the operations, the parameters and the address. Tools can read it and generate code. Try it:

```js
const res = await fetch(BASE + '/soap/calculator?wsdl');
const text = await res.text();
```

The text begins with `<definitions name="Calculator" ...>` and contains a `<portType>` with the operations (`Add`, `Subtract`, `Multiply`, `Divide`), a `<binding>`, and a `<service>` with the address.

## Parsing XML with parseXML

Browsers have `DOMParser`, but code running in a worker (like this editor) does not, so the course provides a global function `parseXML(text)` that returns a small tree:

```js
const doc = parseXML(text);
doc.get('result');            // text of the first <result> anywhere inside, or ''
doc.find('student');          // the first <student> element (or null)
doc.findAll('student');       // an array of all <student> elements
doc.find('student').attrs.id; // an attribute, here "1"
doc.text;                     // the element's own text
doc.children;                 // its child elements
```

Prefixes like `soap:` are ignored when searching, so `find('Body')` finds `<soap:Body>`. Malformed XML makes `parseXML` throw `Invalid XML: ...`.

## Building the request

Template literals (backticks) are perfect for assembling XML, because `${...}` drops values into place:

```js
const xml = `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body><${operation} xmlns="http://academy.test/calculator"><a>${a}</a><b>${b}</b></${operation}></soap:Body>
</soap:Envelope>`;
```

If values come from users, escape `<`, `>` and `&` first; otherwise they could break (or inject into) your XML.

> **Watch out:**
> - **Forgetting `SOAPAction`** or sending `Content-Type: application/json`. Both cause a SOAP fault.
> - **Mismatched tags.** `<a>7</b>` is not well-formed, and the server answers `The request is not well-formed XML`.
> - **Using `res.json()` on the answer.** The reply is XML text: use `res.text()` and `parseXML`.
> - **Mistyping the root.** The element must be an `Envelope`; anything else gives a `VersionMismatch` fault.
> - **Expecting numbers.** `doc.get('result')` returns a **string**, so use `Number(...)` before doing arithmetic.
> - **Forgetting that SOAP uses POST even for reads**, and that SOAP errors usually come back as HTTP 500 (next lesson).

## Going further

Call `Subtract` with `a=3` and `b=10`. Then change the SOAPAction to an empty value (or remove it) and read the error body.

> **Your turn:** parse the calculator WSDL and print the service name, the operation names and the endpoint. Then write `calculate(operation, a, b)` that sends a SOAP envelope with the right headers and returns the `<result>` text, and print the three calculations.
