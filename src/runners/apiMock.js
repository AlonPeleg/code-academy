/*
 * Academy API: a small fake web server that lives inside the JavaScript runner.
 * It answers fetch() calls to https://api.academy.test (REST + SOAP), so API lessons work offline and give the
 * same answers every time. Every run starts with fresh data. Other URLs go to the real network.
 *
 * This file is injected as plain text into the worker (see jsWorker.ts), so it must not import anything.
 */
(function () {
  var HOST = 'api.academy.test';

  /* ------------------------------------------------------------------ XML helper (workers have no DOMParser) */
  function decode(s) {
    return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
  }
  function escapeXml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function localName(n) {
    return String(n).replace(/^.*:/, '');
  }

  function node(name, attrs) {
    return {
      name: name,
      local: localName(name),
      attrs: attrs || {},
      children: [],
      text: '',
      /** first descendant with this tag name (prefix ignored), or null */
      find: function (tag) {
        var want = localName(tag);
        for (var i = 0; i < this.children.length; i++) {
          var c = this.children[i];
          if (c.local === want) return c;
          var deeper = c.find(tag);
          if (deeper) return deeper;
        }
        return null;
      },
      /** every descendant with this tag name */
      findAll: function (tag) {
        var want = localName(tag);
        var out = [];
        (function walk(n) {
          n.children.forEach(function (c) {
            if (c.local === want) out.push(c);
            walk(c);
          });
        })(this);
        return out;
      },
      /** text of the first descendant with this tag name, or '' */
      get: function (tag) {
        var f = this.find(tag);
        return f ? f.text : '';
      },
    };
  }

  function parseXML(source) {
    var xml = String(source).replace(/<\?xml[\s\S]*?\?>/g, '').replace(/<!--[\s\S]*?-->/g, '').trim();
    var re = /<(\/?)([A-Za-z_][\w.:-]*)([^>]*?)(\/?)>|([^<]+)/g;
    var root = null;
    var stack = [];
    var m;
    while ((m = re.exec(xml))) {
      if (m[5] !== undefined) {
        var t = m[5];
        if (stack.length && t.trim()) stack[stack.length - 1].text += decode(t.trim());
        continue;
      }
      var closing = m[1] === '/';
      var name = m[2];
      if (closing) {
        var top = stack.pop();
        if (!top || top.name !== name) throw new Error('Invalid XML: unexpected </' + name + '>');
        continue;
      }
      var attrs = {};
      var ar = /([\w:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
      var am;
      while ((am = ar.exec(m[3]))) attrs[am[1]] = decode(am[3] !== undefined ? am[3] : am[4]);
      var n = node(name, attrs);
      if (stack.length) stack[stack.length - 1].children.push(n);
      else if (!root) root = n;
      else throw new Error('Invalid XML: more than one root element');
      if (m[4] !== '/') stack.push(n);
    }
    if (stack.length) throw new Error('Invalid XML: <' + stack[stack.length - 1].name + '> is never closed');
    if (!root) throw new Error('Invalid XML: no elements found');
    return root;
  }
  self.parseXML = parseXML;

  /* ------------------------------------------------------------------ data (fresh for every run) */
  var users = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com', role: 'admin', city: 'London' },
    { id: 2, name: 'Grace Hopper', email: 'grace@example.com', role: 'editor', city: 'New York' },
    { id: 3, name: 'Alan Turing', email: 'alan@example.com', role: 'viewer', city: 'London' },
    { id: 4, name: 'Katherine Johnson', email: 'katherine@example.com', role: 'editor', city: 'Hampton' },
    { id: 5, name: 'Linus Torvalds', email: 'linus@example.com', role: 'viewer', city: 'Portland' },
  ];
  var todos = [
    { id: 1, userId: 1, title: 'Write the first program', done: true },
    { id: 2, userId: 1, title: 'Design the analytical engine', done: false },
    { id: 3, userId: 2, title: 'Find the first bug', done: true },
    { id: 4, userId: 2, title: 'Invent the compiler', done: true },
    { id: 5, userId: 3, title: 'Crack the cipher', done: true },
    { id: 6, userId: 3, title: 'Define computable numbers', done: false },
    { id: 7, userId: 4, title: 'Calculate the orbit', done: true },
    { id: 8, userId: 5, title: 'Release version 0.01', done: false },
    { id: 9, userId: 5, title: 'Review a patch', done: false },
    { id: 10, userId: 1, title: 'Publish the notes', done: false },
  ];
  var posts = [
    { id: 1, userId: 1, title: 'Notes on the Engine', tags: ['math', 'history'] },
    { id: 2, userId: 2, title: 'Nanoseconds', tags: ['hardware'] },
    { id: 3, userId: 3, title: 'Can machines think?', tags: ['ai', 'history'] },
    { id: 4, userId: 4, title: 'Orbits by hand', tags: ['math'] },
    { id: 5, userId: 5, title: 'Just a hobby', tags: ['os'] },
    { id: 6, userId: 1, title: 'Loops and subroutines', tags: ['code'] },
  ];
  var tokens = { 'ada@example.com': { password: 'engine123', token: 'token-ada', userId: 1 }, 'grace@example.com': { password: 'cobol456', token: 'token-grace', userId: 2 } };
  var students = {
    1: { name: 'Maya', city: 'Austin', grade: 92 },
    2: { name: 'Ben', city: 'Boston', grade: 78 },
    3: { name: 'Chen', city: 'Austin', grade: 85 },
  };
  var counters = { flaky: 0, limited: 0 };
  var nextId = { users: 6, todos: 11, posts: 7 };
  var collections = { users: users, todos: todos, posts: posts };

  /* ------------------------------------------------------------------ helpers */
  var STATUS = {
    200: 'OK', 201: 'Created', 204: 'No Content', 304: 'Not Modified', 400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden',
    404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 415: 'Unsupported Media Type', 422: 'Unprocessable Entity',
    429: 'Too Many Requests', 500: 'Internal Server Error', 503: 'Service Unavailable',
  };
  function json(status, data, headers) {
    var h = { 'content-type': 'application/json; charset=utf-8' };
    for (var k in headers || {}) h[k.toLowerCase()] = headers[k];
    return { status: status, body: status === 204 ? null : JSON.stringify(data), headers: h };
  }
  function xml(status, body, headers) {
    var h = { 'content-type': 'text/xml; charset=utf-8' };
    for (var k in headers || {}) h[k.toLowerCase()] = headers[k];
    return { status: status, body: '<?xml version="1.0" encoding="utf-8"?>\n' + body, headers: h };
  }
  function problem(status, message, extra) {
    var o = { error: message };
    for (var k in extra || {}) o[k] = extra[k];
    return json(status, o);
  }
  function sleep(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }
  function bearer(req) {
    var a = req.headers.get('authorization') || '';
    var m = /^Bearer\s+(.+)$/i.exec(a);
    return m ? m[1] : null;
  }
  function userForToken(tok) {
    for (var e in tokens) if (tokens[e].token === tok) return users.filter(function (u) { return u.id === tokens[e].userId; })[0];
    return null;
  }
  function readJson(req, text) {
    var ct = (req.headers.get('content-type') || '').toLowerCase();
    if (ct.indexOf('application/json') === -1) return { error: problem(415, 'Send JSON with the header Content-Type: application/json') };
    try {
      var v = JSON.parse(text);
      if (v === null || typeof v !== 'object' || Array.isArray(v)) return { error: problem(400, 'The body must be a JSON object') };
      return { value: v };
    } catch (e) {
      return { error: problem(400, 'The body is not valid JSON', { detail: String(e.message) }) };
    }
  }

  /* ------------------------------------------------------------------ REST collections */
  function validate(kind, body, partial) {
    var errors = {};
    function need(f, type) {
      if (body[f] === undefined) {
        if (!partial) errors[f] = 'is required';
      } else if (typeof body[f] !== type) errors[f] = 'must be a ' + type;
    }
    if (kind === 'users') {
      need('name', 'string');
      need('email', 'string');
      if (typeof body.email === 'string' && body.email.indexOf('@') === -1) errors.email = 'must be an email address';
      if (body.role !== undefined && ['admin', 'editor', 'viewer'].indexOf(body.role) === -1) errors.role = 'must be admin, editor or viewer';
    } else if (kind === 'todos') {
      need('title', 'string');
      need('userId', 'number');
      if (body.done !== undefined && typeof body.done !== 'boolean') errors.done = 'must be a boolean';
    } else if (kind === 'posts') {
      need('title', 'string');
      need('userId', 'number');
    }
    return Object.keys(errors).length ? errors : null;
  }
  function pick(kind, body) {
    var allowed = { users: ['name', 'email', 'role', 'city'], todos: ['title', 'userId', 'done'], posts: ['title', 'userId', 'tags'] }[kind];
    var o = {};
    allowed.forEach(function (k) { if (body[k] !== undefined) o[k] = body[k]; });
    return o;
  }

  function listResource(kind, url, filterBase) {
    var list = collections[kind].slice();
    if (filterBase) list = list.filter(filterBase);
    var q = url.searchParams;
    q.forEach(function (value, key) {
      if (key.charAt(0) === '_' || key === 'q') return;
      list = list.filter(function (item) { return String(item[key]) === value; });
    });
    if (q.get('q')) {
      var needle = q.get('q').toLowerCase();
      list = list.filter(function (item) { return JSON.stringify(item).toLowerCase().indexOf(needle) !== -1; });
    }
    var sort = q.get('_sort');
    if (sort) {
      var dir = q.get('_order') === 'desc' ? -1 : 1;
      list.sort(function (a, b) { return a[sort] < b[sort] ? -dir : a[sort] > b[sort] ? dir : 0; });
    }
    var total = list.length;
    var headers = { 'X-Total-Count': String(total) };
    var limit = parseInt(q.get('_limit') || '', 10);
    if (limit > 0) {
      var page = Math.max(1, parseInt(q.get('_page') || '1', 10));
      list = list.slice((page - 1) * limit, page * limit);
      headers['X-Page'] = String(page);
      headers['X-Total-Pages'] = String(Math.ceil(total / limit));
    }
    return json(200, list, headers);
  }

  async function restCollection(kind, parts, req, url, bodyText, who) {
    var method = req.method;
    var idStr = parts[1];
    var coll = collections[kind];
    var writes = method === 'POST' || method === 'PUT' || method === 'PATCH' || method === 'DELETE';
    if (writes) {
      if (!who) return json(401, { error: 'Sign in first: send the header Authorization: Bearer <token> (get one from POST /login)' }, { 'WWW-Authenticate': 'Bearer' });
    }
    if (parts.length === 1) {
      if (method === 'GET') return listResource(kind, url);
      if (method === 'POST') {
        var r = readJson(req, bodyText);
        if (r.error) return r.error;
        var errs = validate(kind, r.value, false);
        if (errs) return problem(422, 'Validation failed', { fields: errs });
        var item = Object.assign({ id: nextId[kind]++ }, pick(kind, r.value));
        coll.push(item);
        return json(201, item, { Location: 'https://' + HOST + '/' + kind + '/' + item.id });
      }
      return problem(405, 'Method ' + method + ' is not allowed here', {});
    }
    var id = parseInt(idStr, 10);
    if (isNaN(id)) return problem(400, '"' + idStr + '" is not a valid id');
    var found = coll.filter(function (x) { return x.id === id; })[0];
    if (parts.length === 3 && kind === 'users' && (parts[2] === 'todos' || parts[2] === 'posts')) {
      if (!found) return problem(404, 'No user with id ' + id);
      if (method !== 'GET') return problem(405, 'Method ' + method + ' is not allowed here');
      return listResource(parts[2], url, function (x) { return x.userId === id; });
    }
    if (parts.length > 2) return problem(404, 'Unknown path');
    if (!found) return problem(404, 'No ' + kind.replace(/s$/, '') + ' with id ' + id);
    if (method === 'GET') return json(200, found);
    if (method === 'DELETE') {
      coll.splice(coll.indexOf(found), 1);
      return json(204, null);
    }
    if (method === 'PUT' || method === 'PATCH') {
      var b = readJson(req, bodyText);
      if (b.error) return b.error;
      var e2 = validate(kind, b.value, method === 'PATCH');
      if (e2) return problem(422, 'Validation failed', { fields: e2 });
      var fields = pick(kind, b.value);
      if (method === 'PUT') {
        var replacement = Object.assign({ id: found.id }, fields);
        coll[coll.indexOf(found)] = replacement;
        return json(200, replacement);
      }
      Object.assign(found, fields);
      return json(200, found);
    }
    return problem(405, 'Method ' + method + ' is not allowed here');
  }

  /* ------------------------------------------------------------------ SOAP */
  var NS_ENV = 'http://schemas.xmlsoap.org/soap/envelope/';
  function envelope(inner) {
    return '<soap:Envelope xmlns:soap="' + NS_ENV + '">\n  <soap:Body>\n' + inner + '\n  </soap:Body>\n</soap:Envelope>';
  }
  function fault(code, message) {
    return xml(500, envelope('    <soap:Fault>\n      <faultcode>soap:' + code + '</faultcode>\n      <faultstring>' + escapeXml(message) + '</faultstring>\n    </soap:Fault>'));
  }

  var WSDL_CALC =
    '<?xml version="1.0" encoding="utf-8"?>\n' +
    '<definitions name="Calculator" targetNamespace="http://academy.test/calculator" xmlns="http://schemas.xmlsoap.org/wsdl/"\n' +
    '    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:tns="http://academy.test/calculator" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n' +
    '  <message name="AddRequest"><part name="a" type="xsd:int"/><part name="b" type="xsd:int"/></message>\n' +
    '  <message name="AddResponse"><part name="result" type="xsd:int"/></message>\n' +
    '  <message name="DivideRequest"><part name="a" type="xsd:int"/><part name="b" type="xsd:int"/></message>\n' +
    '  <message name="DivideResponse"><part name="result" type="xsd:double"/></message>\n' +
    '  <portType name="CalculatorPortType">\n' +
    '    <operation name="Add"><input message="tns:AddRequest"/><output message="tns:AddResponse"/></operation>\n' +
    '    <operation name="Subtract"/><operation name="Multiply"/>\n' +
    '    <operation name="Divide"><input message="tns:DivideRequest"/><output message="tns:DivideResponse"/></operation>\n' +
    '  </portType>\n' +
    '  <binding name="CalculatorBinding" type="tns:CalculatorPortType">\n' +
    '    <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>\n' +
    '    <operation name="Add"><soap:operation soapAction="http://academy.test/calculator/Add"/></operation>\n' +
    '    <operation name="Divide"><soap:operation soapAction="http://academy.test/calculator/Divide"/></operation>\n' +
    '  </binding>\n' +
    '  <service name="CalculatorService">\n' +
    '    <port name="CalculatorPort" binding="tns:CalculatorBinding"><soap:address location="https://' + HOST + '/soap/calculator"/></port>\n' +
    '  </service>\n' +
    '</definitions>';

  function soapService(service, req, url, bodyText) {
    if (service !== 'calculator' && service !== 'students') return problem(404, 'Unknown SOAP service. Try /soap/calculator or /soap/students');
    if (req.method === 'GET') {
      if (url.searchParams.has('wsdl') && service === 'calculator') return { status: 200, body: WSDL_CALC, headers: { 'content-type': 'text/xml; charset=utf-8' } };
      return problem(405, 'SOAP services take POST requests. Add ?wsdl to GET the calculator description.');
    }
    if (req.method !== 'POST') return problem(405, 'SOAP services take POST requests');
    var ct = (req.headers.get('content-type') || '').toLowerCase();
    if (ct.indexOf('xml') === -1) return fault('Client', 'Content-Type must be text/xml for SOAP 1.1');
    if (!req.headers.get('soapaction')) return fault('Client', 'Missing the SOAPAction header');
    var doc;
    try {
      doc = parseXML(bodyText);
    } catch (e) {
      return fault('Client', 'The request is not well-formed XML: ' + e.message);
    }
    if (doc.local !== 'Envelope') return fault('VersionMismatch', 'The root element must be soap:Envelope');
    var body = doc.find('Body');
    if (!body || !body.children.length) return fault('Client', 'The Envelope has no Body with an operation inside it');
    var op = body.children[0];
    var ns = op.attrs.xmlns || 'http://academy.test/' + service;

    if (service === 'calculator') {
      var a = parseFloat(op.get('a'));
      var b = parseFloat(op.get('b'));
      if (['Add', 'Subtract', 'Multiply', 'Divide'].indexOf(op.local) === -1) return fault('Client', 'Unknown operation ' + op.local);
      if (isNaN(a) || isNaN(b)) return fault('Client', 'Both a and b must be numbers');
      var result;
      if (op.local === 'Add') result = a + b;
      else if (op.local === 'Subtract') result = a - b;
      else if (op.local === 'Multiply') result = a * b;
      else {
        if (b === 0) return fault('Server', 'Cannot divide by zero');
        result = a / b;
      }
      return xml(200, envelope('    <' + op.local + 'Response xmlns="' + ns + '">\n      <result>' + result + '</result>\n    </' + op.local + 'Response>'));
    }

    // students
    if (op.local === 'GetStudent') {
      var s = students[parseInt(op.get('id'), 10)];
      if (!s) return fault('Client', 'No student with id ' + op.get('id'));
      return xml(200, envelope('    <GetStudentResponse xmlns="' + ns + '">\n      <student>\n        <name>' + escapeXml(s.name) + '</name>\n        <city>' + escapeXml(s.city) + '</city>\n        <grade>' + s.grade + '</grade>\n      </student>\n    </GetStudentResponse>'));
    }
    if (op.local === 'ListStudents') {
      var rows = Object.keys(students).map(function (k) {
        return '      <student id="' + k + '"><name>' + escapeXml(students[k].name) + '</name><grade>' + students[k].grade + '</grade></student>';
      });
      return xml(200, envelope('    <ListStudentsResponse xmlns="' + ns + '">\n' + rows.join('\n') + '\n    </ListStudentsResponse>'));
    }
    return fault('Client', 'Unknown operation ' + op.local);
  }

  /* ------------------------------------------------------------------ router */
  async function handle(req, url, bodyText) {
    var path = url.pathname.replace(/\/+$/, '') || '/';
    var parts = path.split('/').filter(Boolean);
    var token = bearer(req);
    var who = token ? userForToken(token) : null;

    if (path === '/') {
      return json(200, {
        name: 'Academy API', version: 1,
        rest: ['/users', '/todos', '/posts', '/login', '/me', '/config', '/flaky', '/limited', '/slow', '/headers', '/echo', '/error/500'],
        soap: ['/soap/calculator?wsdl', '/soap/students'],
      });
    }
    if (parts[0] === 'soap') return soapService(parts[1], req, url, bodyText);

    if (collections[parts[0]]) return restCollection(parts[0], parts, req, url, bodyText, who);

    if (path === '/login') {
      if (req.method !== 'POST') return problem(405, 'Use POST to log in');
      var r = readJson(req, bodyText);
      if (r.error) return r.error;
      var acct = tokens[r.value.email];
      if (!acct || acct.password !== r.value.password) return problem(401, 'Wrong email or password');
      return json(200, { token: acct.token, expiresIn: 3600 });
    }
    if (path === '/me') {
      if (!token) return json(401, { error: 'Missing token. Send Authorization: Bearer <token>' }, { 'WWW-Authenticate': 'Bearer' });
      if (!who) return json(401, { error: 'That token is not valid' }, { 'WWW-Authenticate': 'Bearer error="invalid_token"' });
      return json(200, who);
    }
    if (path === '/admin/stats') {
      if (!who) return json(401, { error: 'Sign in first' }, { 'WWW-Authenticate': 'Bearer' });
      if (who.role !== 'admin') return problem(403, 'Only admins can see this');
      return json(200, { users: users.length, todos: todos.length, posts: posts.length });
    }
    if (path === '/config') {
      if (req.headers.get('if-none-match') === '"v1"') return { status: 304, body: null, headers: { etag: '"v1"' } };
      return json(200, { theme: 'dark', pageSize: 10 }, { ETag: '"v1"', 'Cache-Control': 'max-age=60' });
    }
    if (path === '/headers') return json(200, (function () { var o = {}; req.headers.forEach(function (v, k) { o[k] = v; }); return o; })());
    if (path === '/echo') {
      var parsed = null;
      try { parsed = JSON.parse(bodyText); } catch (e) { /* not JSON */ }
      return json(200, { method: req.method, query: Object.fromEntries(url.searchParams), contentType: req.headers.get('content-type'), body: parsed !== null ? parsed : bodyText });
    }
    if (path === '/slow') {
      await sleep(300);
      return json(200, { message: 'That took a while' });
    }
    if (path === '/flaky') {
      counters.flaky++;
      if (counters.flaky <= 2) return json(503, { error: 'Temporarily unavailable, try again', attempt: counters.flaky }, { 'Retry-After': '1' });
      return json(200, { message: 'Success on attempt ' + counters.flaky });
    }
    if (path === '/limited') {
      counters.limited++;
      if (counters.limited > 3) return json(429, { error: 'Too many requests' }, { 'Retry-After': '30' });
      return json(200, { calls: counters.limited, remaining: 3 - counters.limited }, { 'X-RateLimit-Remaining': String(3 - counters.limited) });
    }
    var errMatch = /^\/error\/(\d{3})$/.exec(path);
    if (errMatch) {
      var code = parseInt(errMatch[1], 10);
      if (code >= 400 && code < 600) return json(code, { error: STATUS[code] || 'Error ' + code, status: code });
    }
    return problem(404, 'Nothing lives at ' + path);
  }

  var realFetch = self.fetch ? self.fetch.bind(self) : null;
  self.fetch = async function (input, init) {
    var req;
    try {
      req = new Request(input, init);
    } catch (e) {
      throw new TypeError('Invalid URL or options for fetch: ' + (e && e.message ? e.message : e) + ' (use a full address such as https://' + HOST + '/users)');
    }
    var url = new URL(req.url);
    if (url.hostname !== HOST) {
      if (!realFetch) throw new TypeError('Network access is not available');
      return realFetch(req);
    }
    if (url.protocol !== 'https:') throw new TypeError('Failed to fetch: use https:// for ' + HOST);
    var signal = req.signal;
    function abortError() {
      try { return new DOMException('The operation was aborted.', 'AbortError'); } catch (e) { var err = new Error('The operation was aborted.'); err.name = 'AbortError'; return err; }
    }
    if (signal && signal.aborted) throw abortError();
    var aborted = new Promise(function (_, reject) {
      if (signal) signal.addEventListener('abort', function () { reject(abortError()); });
    });
    var bodyText = '';
    if (req.method !== 'GET' && req.method !== 'HEAD') bodyText = await req.text();
    var out;
    try {
      // like a real network call, an AbortController can cancel the request while it is in flight
      out = await Promise.race([
        (async function () {
          await sleep(15);
          return handle(req, url, bodyText);
        })(),
        aborted,
      ]);
    } catch (e) {
      if (e && e.name === 'AbortError') throw e;
      out = json(500, { error: 'The server crashed: ' + (e && e.message ? e.message : e) });
    }
    var status = out.status;
    var res = new Response(status === 204 || status === 304 ? null : out.body, { status: status, statusText: STATUS[status] || '', headers: out.headers });
    try {
      Object.defineProperty(res, 'url', { value: req.url });
    } catch (e) { /* ignore */ }
    return res;
  };
})();
