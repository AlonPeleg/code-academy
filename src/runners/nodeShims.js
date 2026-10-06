/*
 * Node.js practice environment for the JavaScript runner.
 * It gives lesson code a small, in-memory version of the Node modules backend lessons use:
 *   express, http, fs, path, events, assert, util, crypto, os, url, timers/promises, cors  +  process, Buffer, __dirname
 * and a Jest-style test runner (describe / it / test / expect / jest.fn).
 * A server started with app.listen(3000) is reachable with fetch('http://localhost:3000/...') inside the same run.
 *
 * Injected as plain text into the worker (see jsWorker.ts), so it must not import anything.
 * Everything is exposed through three globals: __runMain(files, main), __runTests(), and (for tests) __nodeRequire.
 */
(function () {
  var G = self;
  var CWD = '/app';

  /* ------------------------------------------------------------------ helpers */
  function makeError(code, message, extra) {
    var e = new Error(code + ': ' + message);
    e.code = code;
    if (extra) for (var k in extra) e[k] = extra[k];
    return e;
  }
  function escapeHtml(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  var STATUS_CODES = {
    100: 'Continue', 200: 'OK', 201: 'Created', 202: 'Accepted', 204: 'No Content', 301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
    400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found', 405: 'Method Not Allowed', 409: 'Conflict', 413: 'Payload Too Large',
    415: 'Unsupported Media Type', 422: 'Unprocessable Entity', 429: 'Too Many Requests', 500: 'Internal Server Error', 501: 'Not Implemented',
    502: 'Bad Gateway', 503: 'Service Unavailable',
  };
  function deepEqual(a, b, strict) {
    if (b && typeof b === 'object' && typeof b.asymmetricMatch === 'function') return b.asymmetricMatch(a);
    if (a && typeof a === 'object' && typeof a.asymmetricMatch === 'function') return a.asymmetricMatch(b);
    if (strict ? Object.is(a, b) : a == b) return true; // eslint-disable-line eqeqeq
    if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
    if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b)) return false;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (a instanceof Map && b instanceof Map) {
      if (a.size !== b.size) return false;
      var ok = true;
      a.forEach(function (v, k) { if (!b.has(k) || !deepEqual(v, b.get(k), strict)) ok = false; });
      return ok;
    }
    if (a instanceof Set && b instanceof Set) {
      if (a.size !== b.size) return false;
      var ok2 = true;
      a.forEach(function (v) { if (!b.has(v)) ok2 = false; });
      return ok2;
    }
    var ka = Object.keys(a), kb = Object.keys(b);
    if (ka.length !== kb.length) return false;
    for (var i = 0; i < ka.length; i++) {
      if (!Object.prototype.hasOwnProperty.call(b, ka[i])) return false;
      if (!deepEqual(a[ka[i]], b[ka[i]], strict)) return false;
    }
    return true;
  }
  function show(v) {
    if (typeof G.__fmt === 'function') {
      if (typeof v === 'string') return JSON.stringify(v);
      return G.__fmt(v, 1).replace(/^"|"$/g, function (m) { return m; });
    }
    try { return JSON.stringify(v); } catch (e) { return String(v); }
  }

  /* ------------------------------------------------------------------ Buffer (small) */
  var enc = new TextEncoder(), dec = new TextDecoder();
  var B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  function toBase64(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length; i += 3) {
      var n = (bytes[i] << 16) | ((bytes[i + 1] || 0) << 8) | (bytes[i + 2] || 0);
      out += B64[(n >> 18) & 63] + B64[(n >> 12) & 63] + (i + 1 < bytes.length ? B64[(n >> 6) & 63] : '=') + (i + 2 < bytes.length ? B64[n & 63] : '=');
    }
    return out;
  }
  function fromBase64(str) {
    str = String(str).replace(/-/g, '+').replace(/_/g, '/').replace(/[^A-Za-z0-9+/]/g, '');
    var out = [];
    for (var i = 0; i < str.length; i += 4) {
      var a = B64.indexOf(str[i]), b = B64.indexOf(str[i + 1]), c = i + 2 < str.length ? B64.indexOf(str[i + 2]) : -1, d = i + 3 < str.length ? B64.indexOf(str[i + 3]) : -1;
      out.push((a << 2) | (b >> 4));
      if (c >= 0) out.push(((b & 15) << 4) | (c >> 2));
      if (d >= 0) out.push(((c & 3) << 6) | d);
    }
    return Uint8Array.from(out);
  }
  function NodeBuffer(arg) { return NodeBuffer.from(arg); }
  NodeBuffer.from = function (v, encoding) {
    var bytes;
    if (typeof v === 'string') {
      encoding = encoding || 'utf8';
      if (encoding === 'hex') { bytes = new Uint8Array(v.length >> 1); for (var i = 0; i < bytes.length; i++) bytes[i] = parseInt(v.substr(i * 2, 2), 16); }
      else if (encoding === 'base64' || encoding === 'base64url') bytes = fromBase64(v);
      else bytes = enc.encode(v);
    } else bytes = Uint8Array.from(v);
    Object.setPrototypeOf(bytes, NodeBuffer.prototype);
    return bytes;
  };
  NodeBuffer.alloc = function (n) { return NodeBuffer.from(new Array(n).fill(0)); };
  NodeBuffer.concat = function (list) { var all = []; list.forEach(function (b) { all.push.apply(all, Array.prototype.slice.call(b)); }); return NodeBuffer.from(all); };
  NodeBuffer.byteLength = function (s) { return enc.encode(String(s)).length; };
  NodeBuffer.isBuffer = function (b) { return b instanceof NodeBuffer; };
  NodeBuffer.prototype = Object.create(Uint8Array.prototype);
  NodeBuffer.prototype.constructor = NodeBuffer;
  NodeBuffer.prototype.toString = function (encoding) {
    var b = Uint8Array.from(this);
    if (encoding === 'hex') return Array.prototype.map.call(b, function (x) { return (x < 16 ? '0' : '') + x.toString(16); }).join('');
    if (encoding === 'base64') return toBase64(b);
    if (encoding === 'base64url') return toBase64(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return dec.decode(b);
  };
  NodeBuffer.prototype.toJSON = function () { return { type: 'Buffer', data: Array.prototype.slice.call(this) }; };
  if (typeof G.Buffer === 'undefined') G.Buffer = NodeBuffer;

  /* ------------------------------------------------------------------ SHA-256 / HMAC / PBKDF2 (synchronous) */
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
  ];
  function sha256(bytes) {
    var h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
    var len = bytes.length, total = (((len + 9 + 63) >> 6) << 6);
    var m = new Uint8Array(total);
    m.set(bytes); m[len] = 0x80;
    var bits = len * 8;
    m[total - 4] = (bits >>> 24) & 255; m[total - 3] = (bits >>> 16) & 255; m[total - 2] = (bits >>> 8) & 255; m[total - 1] = bits & 255;
    var w = new Array(64);
    function rotr(x, n) { return (x >>> n) | (x << (32 - n)); }
    for (var off = 0; off < total; off += 64) {
      for (var i = 0; i < 16; i++) w[i] = (m[off + i * 4] << 24) | (m[off + i * 4 + 1] << 16) | (m[off + i * 4 + 2] << 8) | m[off + i * 4 + 3];
      for (i = 16; i < 64; i++) {
        var s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3), s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
      }
      var a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (i = 0; i < 64; i++) {
        var S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25), ch = (e & f) ^ (~e & g), t1 = (hh + S1 + ch + K[i] + w[i]) | 0;
        var S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22), mj = (a & b) ^ (a & c) ^ (b & c), t2 = (S0 + mj) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0; h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    var out = new Uint8Array(32);
    for (var j = 0; j < 8; j++) { out[j * 4] = h[j] >>> 24; out[j * 4 + 1] = (h[j] >>> 16) & 255; out[j * 4 + 2] = (h[j] >>> 8) & 255; out[j * 4 + 3] = h[j] & 255; }
    return out;
  }
  function toBytes(x) { return typeof x === 'string' ? enc.encode(x) : Uint8Array.from(x); }
  function concatBytes(a, b) { var o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; }
  function hmac256(key, msg) {
    key = toBytes(key); msg = toBytes(msg);
    if (key.length > 64) key = sha256(key);
    var ipad = new Uint8Array(64), opad = new Uint8Array(64);
    for (var i = 0; i < 64; i++) { var kb = key[i] || 0; ipad[i] = kb ^ 0x36; opad[i] = kb ^ 0x5c; }
    return sha256(concatBytes(opad, sha256(concatBytes(ipad, msg))));
  }
  function digestOut(bytes, encoding) { var b = NodeBuffer.from(bytes); return encoding ? b.toString(encoding) : b; }
  var cryptoShim = {
    createHash: function (alg) {
      if (String(alg).toLowerCase() !== 'sha256') throw new Error('Digest method not supported in this practice environment: ' + alg + ' (use sha256)');
      var data = new Uint8Array(0);
      var h = { update: function (d) { data = concatBytes(data, toBytes(d)); return h; }, digest: function (encoding) { return digestOut(sha256(data), encoding); } };
      return h;
    },
    createHmac: function (alg, key) {
      if (String(alg).toLowerCase() !== 'sha256') throw new Error('Digest method not supported in this practice environment: ' + alg + ' (use sha256)');
      var data = new Uint8Array(0);
      var h = { update: function (d) { data = concatBytes(data, toBytes(d)); return h; }, digest: function (encoding) { return digestOut(hmac256(key, data), encoding); } };
      return h;
    },
    pbkdf2Sync: function (password, salt, iterations, keylen) {
      var out = new Uint8Array(0), block = 1;
      while (out.length < keylen) {
        var s = concatBytes(toBytes(salt), new Uint8Array([(block >>> 24) & 255, (block >>> 16) & 255, (block >>> 8) & 255, block & 255]));
        var u = hmac256(password, s), t = Uint8Array.from(u);
        for (var i = 1; i < iterations; i++) { u = hmac256(password, u); for (var j = 0; j < t.length; j++) t[j] ^= u[j]; }
        out = concatBytes(out, t); block++;
      }
      return NodeBuffer.from(out.slice(0, keylen));
    },
    randomBytes: function (n) { var a = new Uint8Array(n); G.crypto.getRandomValues(a); return NodeBuffer.from(a); },
    randomUUID: function () { return G.crypto.randomUUID(); },
    randomInt: function (a, b) { if (b === undefined) { b = a; a = 0; } return a + Math.floor(Math.random() * (b - a)); },
    timingSafeEqual: function (a, b) {
      if (a.length !== b.length) throw new RangeError('Input buffers must have the same byte length');
      var d = 0; for (var i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0;
    },
  };

  /* ------------------------------------------------------------------ events */
  function EventEmitter() { this._events = {}; }
  EventEmitter.prototype._list = function (n) { if (!this._events) this._events = {}; return this._events[n] || (this._events[n] = []); };
  EventEmitter.prototype.on = EventEmitter.prototype.addListener = function (n, fn) { this._list(n).push({ fn: fn }); return this; };
  EventEmitter.prototype.prependListener = function (n, fn) { this._list(n).unshift({ fn: fn }); return this; };
  EventEmitter.prototype.once = function (n, fn) { this._list(n).push({ fn: fn, once: true }); return this; };
  EventEmitter.prototype.off = EventEmitter.prototype.removeListener = function (n, fn) {
    var l = this._list(n);
    for (var i = 0; i < l.length; i++) if (l[i].fn === fn) { l.splice(i, 1); break; }
    return this;
  };
  EventEmitter.prototype.removeAllListeners = function (n) { if (n === undefined) this._events = {}; else this._events[n] = []; return this; };
  EventEmitter.prototype.listenerCount = function (n) { return this._list(n).length; };
  EventEmitter.prototype.listeners = function (n) { return this._list(n).map(function (x) { return x.fn; }); };
  EventEmitter.prototype.eventNames = function () { var self = this; return Object.keys(this._events || {}).filter(function (k) { return self._events[k].length; }); };
  EventEmitter.prototype.emit = function (n) {
    var args = Array.prototype.slice.call(arguments, 1);
    var l = this._list(n).slice();
    if (!l.length) {
      if (n === 'error') throw args[0] instanceof Error ? args[0] : new Error('Unhandled error. (' + show(args[0]) + ')');
      return false;
    }
    for (var i = 0; i < l.length; i++) {
      if (l[i].once) this.off(n, l[i].fn);
      l[i].fn.apply(this, args);
    }
    return true;
  };
  EventEmitter.EventEmitter = EventEmitter;
  EventEmitter.once = function (em, n) { return new Promise(function (res) { em.once(n, function () { res(Array.prototype.slice.call(arguments)); }); }); };

  /* ------------------------------------------------------------------ path */
  function normalizeParts(parts, abs) {
    var out = [];
    parts.forEach(function (p) { if (!p || p === '.') return; if (p === '..') { if (out.length && out[out.length - 1] !== '..') out.pop(); else if (!abs) out.push('..'); } else out.push(p); });
    return out;
  }
  var pathShim = {
    sep: '/', delimiter: ':',
    normalize: function (p) { var abs = p.charAt(0) === '/'; var r = normalizeParts(p.split('/'), abs).join('/'); return (abs ? '/' : '') + r + (p.length > 1 && p.slice(-1) === '/' && r ? '/' : '') || (abs ? '/' : '.'); },
    join: function () { var parts = Array.prototype.filter.call(arguments, function (x) { return x !== ''; }); return parts.length ? pathShim.normalize(parts.join('/')) : '.'; },
    resolve: function () {
      var p = '';
      for (var i = arguments.length - 1; i >= 0; i--) { if (!arguments[i]) continue; p = arguments[i] + (p ? '/' + p : ''); if (arguments[i].charAt(0) === '/') break; }
      if (p.charAt(0) !== '/') p = CWD + (p ? '/' + p : '');
      return '/' + normalizeParts(p.split('/'), true).join('/');
    },
    isAbsolute: function (p) { return p.charAt(0) === '/'; },
    basename: function (p, ext) { var b = p.replace(/\/+$/, '').split('/').pop(); return ext && b.slice(-ext.length) === ext ? b.slice(0, -ext.length) : b; },
    dirname: function (p) { var s = p.replace(/\/+$/, ''); var i = s.lastIndexOf('/'); return i < 0 ? '.' : i === 0 ? '/' : s.slice(0, i); },
    extname: function (p) { var b = pathShim.basename(p); var i = b.lastIndexOf('.'); return i <= 0 ? '' : b.slice(i); },
    relative: function (from, to) {
      var a = pathShim.resolve(from).split('/').filter(Boolean), b = pathShim.resolve(to).split('/').filter(Boolean);
      while (a.length && b.length && a[0] === b[0]) { a.shift(); b.shift(); }
      return a.map(function () { return '..'; }).concat(b).join('/');
    },
    parse: function (p) { var base = pathShim.basename(p), ext = pathShim.extname(p); return { root: p.charAt(0) === '/' ? '/' : '', dir: pathShim.dirname(p), base: base, ext: ext, name: ext ? base.slice(0, -ext.length) : base }; },
    format: function (o) { return (o.dir ? o.dir + '/' : '') + (o.base || (o.name || '') + (o.ext || '')); },
  };
  pathShim.posix = pathShim;

  /* ------------------------------------------------------------------ fs (in memory, fresh for every run) */
  var fsFiles = {}, fsDirs = { '/': true, '/app': true };
  function abs(p) { return pathShim.resolve(String(p)); }
  function ensureDir(d) { d = abs(d); while (d !== '/') { fsDirs[d] = true; d = pathShim.dirname(d); } }
  function enoent(op, p) { return makeError('ENOENT', 'no such file or directory, ' + op + " '" + p + "'", { errno: -2, syscall: op, path: p }); }
  var fsSync = {
    existsSync: function (p) { p = abs(p); return p in fsFiles || !!fsDirs[p]; },
    readFileSync: function (p, o) {
      var a = abs(p);
      if (!(a in fsFiles)) throw enoent('open', p);
      var encoding = typeof o === 'string' ? o : o && o.encoding;
      return encoding ? fsFiles[a] : NodeBuffer.from(fsFiles[a]);
    },
    writeFileSync: function (p, data) {
      var a = abs(p);
      if (fsDirs[a]) throw makeError('EISDIR', "illegal operation on a directory, open '" + p + "'");
      if (!fsDirs[pathShim.dirname(a)]) throw enoent('open', p);
      fsFiles[a] = typeof data === 'string' ? data : String(data);
    },
    appendFileSync: function (p, data) {
      var a = abs(p);
      if (!fsDirs[pathShim.dirname(a)]) throw enoent('open', p);
      fsFiles[a] = (fsFiles[a] || '') + String(data);
    },
    unlinkSync: function (p) { var a = abs(p); if (!(a in fsFiles)) throw enoent('unlink', p); delete fsFiles[a]; },
    mkdirSync: function (p, o) {
      var a = abs(p);
      if (o && o.recursive) return ensureDir(a);
      if (fsDirs[a] || a in fsFiles) throw makeError('EEXIST', "file already exists, mkdir '" + p + "'");
      if (!fsDirs[pathShim.dirname(a)]) throw enoent('mkdir', p);
      fsDirs[a] = true;
    },
    readdirSync: function (p) {
      var a = abs(p);
      if (!fsDirs[a]) throw enoent('scandir', p);
      var prefix = a === '/' ? '/' : a + '/', out = {};
      Object.keys(fsFiles).concat(Object.keys(fsDirs)).forEach(function (k) {
        if (k !== a && k.indexOf(prefix) === 0) out[k.slice(prefix.length).split('/')[0]] = true;
      });
      return Object.keys(out).sort();
    },
    rmSync: function (p, o) {
      var a = abs(p);
      if (a in fsFiles) return void delete fsFiles[a];
      if (fsDirs[a]) {
        var prefix = a + '/';
        var inside = Object.keys(fsFiles).concat(Object.keys(fsDirs)).filter(function (k) { return k.indexOf(prefix) === 0; });
        if (inside.length && !(o && o.recursive)) throw makeError('ERR_FS_EISDIR', 'Path is a directory: rm returned EISDIR (is a directory) ' + p);
        inside.forEach(function (k) { delete fsFiles[k]; delete fsDirs[k]; });
        delete fsDirs[a];
        return;
      }
      if (!(o && o.force)) throw enoent('rm', p);
    },
    renameSync: function (from, to) { var a = abs(from); if (!(a in fsFiles)) throw enoent('rename', from); fsFiles[abs(to)] = fsFiles[a]; delete fsFiles[a]; },
    copyFileSync: function (from, to) { var a = abs(from); if (!(a in fsFiles)) throw enoent('copyfile', from); fsFiles[abs(to)] = fsFiles[a]; },
    statSync: function (p) {
      var a = abs(p);
      if (a in fsFiles) return { isFile: function () { return true; }, isDirectory: function () { return false; }, size: enc.encode(fsFiles[a]).length };
      if (fsDirs[a]) return { isFile: function () { return false; }, isDirectory: function () { return true; }, size: 0 };
      throw enoent('stat', p);
    },
  };
  function asyncVersion(name) {
    return function () {
      var args = Array.prototype.slice.call(arguments), cb = typeof args[args.length - 1] === 'function' ? args.pop() : null;
      var result, error = null;
      try { result = fsSync[name + 'Sync'].apply(null, args); } catch (e) { error = e; }
      var done = function () { if (cb) error ? cb(error) : cb(null, result); };
      setTimeout(done, 0);
    };
  }
  function promiseVersion(name) {
    return function () {
      var args = arguments;
      return new Promise(function (res, rej) { setTimeout(function () { try { res(fsSync[name + 'Sync'].apply(null, args)); } catch (e) { rej(e); } }, 0); });
    };
  }
  var fsShim = Object.assign({}, fsSync, { promises: {}, constants: { F_OK: 0 } });
  ['readFile', 'writeFile', 'appendFile', 'unlink', 'mkdir', 'readdir', 'rm', 'rename', 'copyFile', 'stat'].forEach(function (n) {
    fsShim[n] = asyncVersion(n);
    fsShim.promises[n] = promiseVersion(n);
  });
  fsShim.access = function (p, mode, cb) { if (typeof mode === 'function') cb = mode; setTimeout(function () { cb(fsSync.existsSync(p) ? null : enoent('access', p)); }, 0); };
  fsShim.promises.access = function (p) { return new Promise(function (res, rej) { fsSync.existsSync(p) ? res() : rej(enoent('access', p)); }); };
  fsShim.exists = function (p, cb) { setTimeout(function () { cb(fsSync.existsSync(p)); }, 0); };

  /* ------------------------------------------------------------------ servers (shared by http and express) */
  var servers = {};
  function registerServer(port, dispatch) {
    port = Number(port) || 0;
    if (!port) port = 40000 + Object.keys(servers).length;
    if (servers[port]) throw makeError('EADDRINUSE', 'address already in use :::' + port, { port: port });
    servers[port] = { dispatch: dispatch };
    return port;
  }
  function unregisterServer(port) { delete servers[port]; }

  var baseFetch = G.fetch ? G.fetch.bind(G) : null;
  G.fetch = async function (input, init) {
    if (G.__busy) G.__busy(1);
    try { return await fetchImpl(input, init); } finally { if (G.__busy) G.__busy(-1); }
  };
  async function fetchImpl(input, init) {
    var req;
    try { req = new Request(input, init); } catch (e) { return baseFetch(input, init); }
    var url = new URL(req.url);
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '[::1]' || url.hostname === '0.0.0.0') {
      var port = url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80;
      var srv = servers[port];
      if (!srv) {
        var err = new TypeError('fetch failed');
        err.cause = makeError('ECONNREFUSED', 'connect ECONNREFUSED 127.0.0.1:' + port, { errno: -111, syscall: 'connect', address: '127.0.0.1', port: port });
        throw err;
      }
      var body = null;
      if (req.method !== 'GET' && req.method !== 'HEAD') body = await req.text();
      var headers = {};
      req.headers.forEach(function (v, k) { headers[k.toLowerCase()] = v; });
      if (!headers.host) headers.host = url.host;
      var out = await srv.dispatch({ method: req.method, url: url.pathname + url.search, headers: headers, body: body });
      var res = new Response(out.status === 204 || out.status === 304 ? null : out.body, { status: out.status, statusText: STATUS_CODES[out.status] || '', headers: out.headers });
      try { Object.defineProperty(res, 'url', { value: req.url }); } catch (e) { /* ignore */ }
      // reading a body takes real time in a browser: keep the program alive until the body has been read
      ['text', 'json', 'arrayBuffer', 'blob'].forEach(function (m) {
        var orig = res[m].bind(res);
        res[m] = function () {
          if (G.__busy) G.__busy(1);
          return orig().finally(function () { if (G.__busy) G.__busy(-1); });
        };
      });
      return res;
    }
    return baseFetch(input, init);
  }

  /* ------------------------------------------------------------------ express */
  function compilePath(path, end) {
    if (path instanceof RegExp) return { re: path, keys: [] };
    var keys = [];
    var src = String(path).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\\\*/g, '*');
    src = src.replace(/\/:(\w+)(\?)?/g, function (_, k, opt) { keys.push(k); return opt ? '(?:/([^/]+?))?' : '/([^/]+?)'; });
    src = src.replace(/\*/g, '(.*)');
    if (path === '/' && !end) src = '';
    return { re: new RegExp('^' + src + (end ? '/?$' : '(?=/|$)'), 'i'), keys: keys };
  }
  function parseQuery(search) {
    var q = {};
    new URLSearchParams(search).forEach(function (v, k) {
      if (k in q) q[k] = [].concat(q[k], v); else q[k] = v;
    });
    return q;
  }

  function createRouter() {
    var stack = [];
    function router(req, res, next) { router.handle(req, res, next); }
    router.__isRouter = true;
    router.stack = stack;

    function addRoute(method, path, handlers) {
      var flat = [];
      handlers.forEach(function (h) { (Array.isArray(h) ? h : [h]).forEach(function (x) { flat.push(x); }); });
      flat.forEach(function (h) { if (typeof h !== 'function') throw new TypeError('Route.' + (method || 'all').toLowerCase() + '() requires a callback function but got a ' + typeof h); });
      var c = compilePath(path, true);
      stack.push({ kind: 'route', method: method, path: path, re: c.re, keys: c.keys, handlers: flat });
    }
    ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].forEach(function (m) {
      router[m] = function (path) {
        if (m === 'get' && arguments.length === 1 && router.__settings) return router.__settings[path];
        addRoute(m.toUpperCase(), path, Array.prototype.slice.call(arguments, 1));
        return router;
      };
    });
    router.all = function (path) { addRoute(null, path, Array.prototype.slice.call(arguments, 1)); return router; };
    router.use = function () {
      var args = Array.prototype.slice.call(arguments), path = '/';
      if (typeof args[0] === 'string' || args[0] instanceof RegExp) path = args.shift();
      var flat = [];
      args.forEach(function (h) { (Array.isArray(h) ? h : [h]).forEach(function (x) { flat.push(x); }); });
      flat.forEach(function (h) { if (typeof h !== 'function') throw new TypeError('app.use() requires a middleware function'); });
      var c = compilePath(path, false);
      stack.push({ kind: 'use', path: path, re: c.re, keys: c.keys, handlers: flat });
      return router;
    };
    router.route = function (path) {
      var r = {};
      ['get', 'post', 'put', 'patch', 'delete', 'all'].forEach(function (m) {
        r[m] = function () { addRoute(m === 'all' ? null : m.toUpperCase(), path, Array.prototype.slice.call(arguments)); return r; };
      });
      return r;
    };
    router.handle = function (req, res, done) {
      var i = 0, parentUrl = req.url, parentBase = req.baseUrl || '', parentParams = req.params;
      function restore() { req.url = parentUrl; req.baseUrl = parentBase; }
      function next(err) {
        restore();
        if (err === 'route' || err === 'router') err = undefined;
        if (res.__finished) return;
        var layer = null, m = null;
        var pathOnly = req.url.split('?')[0];
        while (i < stack.length) {
          var l = stack[i++];
          if (l.kind === 'route' && l.method && l.method !== req.method && !(l.method === 'GET' && req.method === 'HEAD')) continue;
          var mm = l.re.exec(pathOnly);
          if (!mm) continue;
          layer = l; m = mm; break;
        }
        if (!layer) return done(err);
        var params = Object.assign({}, parentParams);
        layer.keys.forEach(function (k, idx) { if (m[idx + 1] !== undefined) { try { params[k] = decodeURIComponent(m[idx + 1]); } catch (e) { params[k] = m[idx + 1]; } } });
        req.params = params;
        if (layer.kind === 'use') {
          var matched = m[0];
          req.baseUrl = parentBase + matched.replace(/\/$/, '');
          req.url = (pathOnly.slice(matched.length) || '/') + (req.url.indexOf('?') >= 0 ? '?' + req.url.split('?').slice(1).join('?') : '');
          if (req.url.charAt(0) !== '/') req.url = '/' + req.url;
        }
        runHandlers(layer.handlers, err, req, res, next);
      }
      next();
    };
    return router;
  }

  function runHandlers(handlers, err, req, res, outerNext) {
    var j = 0;
    function step(e) {
      if (e === 'route') return outerNext();
      if (e === 'router') return outerNext('router');
      if (res.__finished && !e) return;
      var fn = handlers[j++];
      if (!fn) return outerNext(e);
      var isErrHandler = fn.length === 4;
      if (e && !isErrHandler) return step(e);
      if (!e && isErrHandler) return step();
      var called;
      try {
        called = e ? fn(e, req, res, step) : fn(req, res, step);
      } catch (thrown) { return step(thrown); }
      if (called && typeof called.then === 'function') called.then(undefined, function (rej) { step(rej instanceof Error ? rej : new Error(String(rej))); });
    }
    step(err);
  }

  function makeRes(onFinish, app) {
    var res = {
      statusCode: 200, __headers: {}, __chunks: [], __finished: false, headersSent: false, locals: {}, app: app,
      status: function (c) { if (!(c >= 100 && c <= 999)) throw new RangeError('Invalid status code: ' + c + '. Status code must be greater than 99 and less than 1000.'); res.statusCode = c; return res; },
      set: function (k, v) {
        if (typeof k === 'object') { for (var kk in k) res.set(kk, k[kk]); return res; }
        res.__headers[String(k).toLowerCase()] = Array.isArray(v) ? v.join(', ') : String(v);
        return res;
      },
      get: function (k) { return res.__headers[String(k).toLowerCase()]; },
      append: function (k, v) { var cur = res.get(k); res.set(k, cur ? cur + ', ' + v : v); return res; },
      type: function (t) { var map = { json: 'application/json', html: 'text/html', text: 'text/plain', txt: 'text/plain', xml: 'application/xml', css: 'text/css', js: 'application/javascript' }; res.set('Content-Type', map[t] || t); return res; },
      cookie: function (name, value, o) {
        var c = name + '=' + encodeURIComponent(typeof value === 'object' ? 'j:' + JSON.stringify(value) : value);
        if (o) { if (o.maxAge !== undefined) c += '; Max-Age=' + Math.floor(o.maxAge / 1000); if (o.path !== false) c += '; Path=' + (o.path || '/'); if (o.httpOnly) c += '; HttpOnly'; if (o.secure) c += '; Secure'; if (o.sameSite) c += '; SameSite=' + o.sameSite; } else c += '; Path=/';
        res.append('Set-Cookie', c);
        return res;
      },
      clearCookie: function (name) { return res.cookie(name, '', { maxAge: 0 }); },
      redirect: function (a, b) { var code = typeof a === 'number' ? a : 302, url = typeof a === 'number' ? b : a; res.status(code).set('Location', url).send(STATUS_CODES[code] + '. Redirecting to ' + url); },
      sendStatus: function (c) { res.status(c).type('text').send(STATUS_CODES[c] || String(c)); },
      json: function (o) {
        if (!res.get('content-type')) res.set('Content-Type', 'application/json; charset=utf-8');
        var spaces = app && app.__settings && app.__settings['json spaces'];
        return res.__send(JSON.stringify(o, null, spaces));
      },
      send: function (body) {
        if (body === undefined || body === null) body = '';
        if (typeof body === 'number' || typeof body === 'boolean') throw new TypeError('res.send(' + body + ') is not supported: send a string or an object, and use res.status(...) for status codes');
        if (typeof body === 'object' && !NodeBuffer.isBuffer(body)) return res.json(body);
        if (!res.get('content-type')) res.set('Content-Type', 'text/html; charset=utf-8');
        return res.__send(String(body));
      },
      end: function (chunk) { if (chunk !== undefined && chunk !== null) res.__chunks.push(String(chunk)); return res.__finish(); },
      write: function (chunk) { res.__chunks.push(String(chunk)); return true; },
      writeHead: function (code, headers) { res.statusCode = code; if (headers) res.set(headers); return res; },
      setHeader: function (k, v) { res.set(k, v); return res; },
      getHeader: function (k) { return res.get(k); },
      removeHeader: function (k) { delete res.__headers[String(k).toLowerCase()]; },
      __send: function (text) {
        if (res.__finished) throw makeError('ERR_HTTP_HEADERS_SENT', 'Cannot set headers after they are sent to the client');
        res.__chunks = [text];
        return res.__finish();
      },
      __finish: function () {
        if (res.__finished) return res;
        res.__finished = true; res.headersSent = true;
        if (app && app.__settings && app.__settings['x-powered-by'] !== false && !res.__headers['x-powered-by']) res.__headers['x-powered-by'] = 'Express';
        var body = res.__chunks.join('');
        if (res.statusCode !== 204 && res.statusCode !== 304 && !res.__headers['content-length']) res.__headers['content-length'] = String(enc.encode(body).length);
        onFinish({ status: res.statusCode, headers: res.__headers, body: body });
        return res;
      },
    };
    return res;
  }

  function makeReq(raw, app) {
    var u = new URL('http://localhost' + raw.url);
    var req = {
      method: raw.method, url: raw.url, originalUrl: raw.url, baseUrl: '', path: u.pathname, params: {}, query: parseQuery(u.search), headers: raw.headers,
      body: undefined, app: app, ip: '::1', protocol: 'http', hostname: 'localhost', secure: false, __raw: raw.body,
      get: function (k) { return req.headers[String(k).toLowerCase()]; },
      header: function (k) { return req.headers[String(k).toLowerCase()]; },
      is: function (t) { var ct = req.headers['content-type'] || ''; return ct.indexOf(t) >= 0 ? t : false; },
    };
    return req;
  }

  function finalHandler(app) {
    return function (err, req, res) {
      if (res.__finished) return;
      if (err) {
        var status = err.status || err.statusCode || 500;
        if (status < 400 || status > 599) status = 500;
        res.statusCode = status;
        var prod = G.process && G.process.env && G.process.env.NODE_ENV === 'production';
        res.set('Content-Type', 'text/html; charset=utf-8');
        var text = prod ? STATUS_CODES[status] : err.name + ': ' + err.message;
        res.__send('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>' + escapeHtml(text) + '</pre>\n</body>\n</html>\n');
        return;
      }
      res.statusCode = 404;
      res.set('Content-Type', 'text/html; charset=utf-8');
      res.__send('<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot ' + req.method + ' ' + escapeHtml(req.path) + '</pre>\n</body>\n</html>\n');
    };
  }

  function expressApp() {
    var app = createRouter();
    app.__settings = { 'x-powered-by': true };
    app.locals = {};
    app.set = function (k, v) { app.__settings[k] = v; return app; };
    app.enable = function (k) { app.__settings[k] = true; return app; };
    app.disable = function (k) { app.__settings[k] = false; return app; };
    app.enabled = function (k) { return !!app.__settings[k]; };
    app.disabled = function (k) { return !app.__settings[k]; };
    var routerGet = app.get;
    app.get = function (path) {
      if (arguments.length === 1 && typeof path === 'string' && !path.startsWith('/') ) return app.__settings[path];
      return routerGet.apply(app, arguments);
    };
    app.__dispatch = function (raw) {
      return new Promise(function (resolve) {
        var req = makeReq(raw, app);
        var res = makeRes(resolve, app);
        res.req = req;
        var fin = finalHandler(app);
        app.handle(req, res, function (err) { fin(err, req, res); });
      });
    };
    app.listen = function () {
      var args = Array.prototype.slice.call(arguments), cb = typeof args[args.length - 1] === 'function' ? args.pop() : null;
      var port = registerServer(args[0], app.__dispatch);
      var server = new EventEmitter();
      server.close = function (done) { unregisterServer(port); server.emit('close'); if (done) setTimeout(done, 0); return server; };
      server.address = function () { return { address: '::', family: 'IPv6', port: port }; };
      server.listening = true;
      if (cb) setTimeout(cb, 0);
      return server;
    };
    return app;
  }
  function express() { return expressApp(); }
  express.Router = function () { return createRouter(); };
  express.json = function () {
    return function (req, res, next) {
      if (req.body !== undefined || !req.__raw || !/json/i.test(req.headers['content-type'] || '')) { if (req.body === undefined) req.body = req.__raw !== undefined && req.__raw !== null && !req.__raw ? undefined : req.body; return next(); }
      try { req.body = JSON.parse(req.__raw); next(); } catch (e) { var err = new SyntaxError(e.message); err.status = 400; err.type = 'entity.parse.failed'; next(err); }
    };
  };
  express.urlencoded = function () {
    return function (req, res, next) {
      if (req.body !== undefined || !req.__raw || !/urlencoded/i.test(req.headers['content-type'] || '')) return next();
      req.body = parseQuery(req.__raw); next();
    };
  };
  express.text = function () { return function (req, res, next) { if (req.body === undefined && req.__raw && /text\/plain/i.test(req.headers['content-type'] || '')) req.body = req.__raw; next(); }; };
  express.static = function () { return function (req, res, next) { next(); }; };

  function cors(opts) {
    opts = opts || {};
    return function (req, res, next) {
      res.set('Access-Control-Allow-Origin', opts.origin && typeof opts.origin === 'string' ? opts.origin : '*');
      if (req.method === 'OPTIONS') { res.set('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE'); return res.status(204).end(); }
      next();
    };
  }

  /* ------------------------------------------------------------------ http (no framework) */
  var httpShim = {
    STATUS_CODES: STATUS_CODES,
    createServer: function (handler) {
      var server = new EventEmitter();
      if (handler) server.on('request', handler);
      server.listen = function () {
        var args = Array.prototype.slice.call(arguments), cb = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        var port = registerServer(args[0], function (raw) {
          return new Promise(function (resolve) {
            var req = new EventEmitter();
            req.method = raw.method; req.url = raw.url; req.headers = raw.headers; req.setEncoding = function () {};
            var res = new EventEmitter();
            res.statusCode = 200; res.headersSent = false;
            var headers = {}, chunks = [], done = false;
            res.setHeader = function (k, v) { headers[String(k).toLowerCase()] = String(v); };
            res.getHeader = function (k) { return headers[String(k).toLowerCase()]; };
            res.removeHeader = function (k) { delete headers[String(k).toLowerCase()]; };
            res.writeHead = function (code, h) { res.statusCode = code; if (h) for (var k in h) res.setHeader(k, h[k]); return res; };
            res.write = function (c) { chunks.push(String(c)); return true; };
            res.end = function (c) {
              if (done) return res;
              done = true; res.headersSent = true;
              if (c !== undefined && c !== null) chunks.push(String(c));
              resolve({ status: res.statusCode, headers: headers, body: chunks.join('') });
              res.emit('finish');
              return res;
            };
            try { server.emit('request', req, res); } catch (e) { if (!done) { res.statusCode = 500; res.end('Internal Server Error'); } }
            setTimeout(function () { if (raw.body) req.emit('data', raw.body); req.emit('end'); }, 0);
          });
        });
        server.__port = port;
        server.listening = true;
        if (cb) setTimeout(cb, 0);
        return server;
      };
      server.close = function (done) { unregisterServer(server.__port); server.listening = false; server.emit('close'); if (done) setTimeout(done, 0); return server; };
      server.address = function () { return { address: '::', family: 'IPv6', port: server.__port }; };
      return server;
    },
  };

  /* ------------------------------------------------------------------ util, assert, os, url, timers */
  var utilShim = {
    promisify: function (fn) { return function () { var args = Array.prototype.slice.call(arguments), self = this; return new Promise(function (res, rej) { args.push(function (err, v) { err ? rej(err) : res(v); }); fn.apply(self, args); }); }; },
    format: function () { return typeof G.__fmtArgs === 'function' ? G.__fmtArgs(arguments) : Array.prototype.join.call(arguments, ' '); },
    inspect: function (v) { return typeof G.__fmt === 'function' ? G.__fmt(v, 1) : String(v); },
    inherits: function (ctor, sup) { ctor.super_ = sup; Object.setPrototypeOf(ctor.prototype, sup.prototype); },
    isDeepStrictEqual: function (a, b) { return deepEqual(a, b, true); },
    types: { isPromise: function (p) { return !!p && typeof p.then === 'function'; } },
    TextEncoder: G.TextEncoder, TextDecoder: G.TextDecoder,
  };

  function AssertionError(message, actual, expected, operator) {
    var e = new Error(message);
    e.name = 'AssertionError'; e.code = 'ERR_ASSERTION'; e.actual = actual; e.expected = expected; e.operator = operator; e.generatedMessage = false;
    return e;
  }
  function assertFn(v, m) { if (!v) throw m instanceof Error ? m : AssertionError(m || 'The expression evaluated to a falsy value:\n\n  assert(' + show(v) + ')\n', v, true, '=='); }
  assertFn.ok = assertFn;
  assertFn.equal = function (a, b, m) { if (a != b) throw AssertionError(m || show(a) + ' == ' + show(b), a, b, '=='); }; // eslint-disable-line eqeqeq
  assertFn.notEqual = function (a, b, m) { if (a == b) throw AssertionError(m || show(a) + ' != ' + show(b), a, b, '!='); }; // eslint-disable-line eqeqeq
  assertFn.strictEqual = function (a, b, m) { if (!Object.is(a, b)) throw AssertionError(m || 'Expected values to be strictly equal:\n\n' + show(a) + ' !== ' + show(b) + '\n', a, b, 'strictEqual'); };
  assertFn.notStrictEqual = function (a, b, m) { if (Object.is(a, b)) throw AssertionError(m || 'Expected "actual" to be strictly unequal to: ' + show(b), a, b, 'notStrictEqual'); };
  assertFn.deepEqual = function (a, b, m) { if (!deepEqual(a, b, false)) throw AssertionError(m || 'Expected values to be loosely deep-equal:\n\n' + show(a) + '\n\nshould loosely deep-equal\n\n' + show(b), a, b, 'deepEqual'); };
  assertFn.deepStrictEqual = function (a, b, m) { if (!deepEqual(a, b, true)) throw AssertionError(m || 'Expected values to be strictly deep-equal:\n' + show(a) + '\n\nshould equal\n\n' + show(b), a, b, 'deepStrictEqual'); };
  assertFn.notDeepStrictEqual = function (a, b, m) { if (deepEqual(a, b, true)) throw AssertionError(m || 'Expected "actual" not to be strictly deep-equal to: ' + show(b), a, b, 'notDeepStrictEqual'); };
  assertFn.throws = function (fn, expected, m) {
    var threw = false, err;
    try { fn(); } catch (e) { threw = true; err = e; }
    if (!threw) throw AssertionError(typeof expected === 'string' ? expected : m || 'Missing expected exception.', undefined, expected, 'throws');
    if (expected instanceof RegExp && !expected.test(String(err && err.message ? err.message : err))) throw err;
    if (typeof expected === 'function' && expected.prototype !== undefined && !(err instanceof expected)) throw err;
  };
  assertFn.doesNotThrow = function (fn) { try { fn(); } catch (e) { throw AssertionError('Got unwanted exception.\nActual message: "' + (e && e.message) + '"', e, undefined, 'doesNotThrow'); } };
  assertFn.rejects = async function (p, expected) {
    var promise = typeof p === 'function' ? p() : p, threw = false, err;
    try { await promise; } catch (e) { threw = true; err = e; }
    if (!threw) throw AssertionError('Missing expected rejection.', undefined, expected, 'rejects');
    if (expected instanceof RegExp && !expected.test(String(err && err.message ? err.message : err))) throw err;
  };
  assertFn.fail = function (m) { throw AssertionError(m || 'Failed', undefined, undefined, 'fail'); };
  assertFn.AssertionError = AssertionError;
  assertFn.strict = assertFn;

  var osShim = { EOL: '\n', platform: function () { return 'linux'; }, cpus: function () { return [{}, {}]; }, tmpdir: function () { return '/tmp'; }, homedir: function () { return '/home/learner'; }, hostname: function () { return 'academy'; } };
  var urlShim = { URL: G.URL, URLSearchParams: G.URLSearchParams, fileURLToPath: function (u) { return String(u).replace(/^file:\/\//, ''); }, pathToFileURL: function (p) { return new G.URL('file://' + p); } };
  var timersPromises = { setTimeout: function (ms, v) { return new Promise(function (r) { setTimeout(function () { r(v); }, ms); }); } };

  /* ------------------------------------------------------------------ process */
  var processShim = {
    env: {}, argv: ['/usr/bin/node', CWD + '/main.js'], platform: 'linux', pid: 1, version: 'v22.0.0', versions: { node: '22.0.0' }, exitCode: undefined,
    cwd: function () { return CWD; },
    exit: function (code) { var e = new Error('process.exit(' + (code === undefined ? '' : code) + ') was called'); e.name = 'ProcessExit'; e.exitCode = code; throw e; },
    nextTick: function (fn) { var args = Array.prototype.slice.call(arguments, 1); Promise.resolve().then(function () { fn.apply(null, args); }); },
    on: function () { return processShim; }, once: function () { return processShim; }, off: function () { return processShim; }, emitWarning: function () {},
    uptime: function () { return 1.5; },
    hrtime: Object.assign(function () { var t = Date.now(); return [Math.floor(t / 1000), (t % 1000) * 1e6]; }, { bigint: function () { return BigInt(Date.now()) * 1000000n; } }),
    memoryUsage: function () { return { rss: 50000000, heapTotal: 20000000, heapUsed: 10000000 }; },
    stdout: { write: function (s) { String(s).split('\n').forEach(function (line, i, arr) { if (!(i === arr.length - 1 && line === '')) console.log(line); }); return true; }, isTTY: false, columns: 80 },
    stderr: { write: function (s) { console.error(String(s).replace(/\n$/, '')); return true; } },
  };
  if (typeof G.process === 'undefined') G.process = processShim;

  /* ------------------------------------------------------------------ require() */
  var builtins = {
    express: express, http: httpShim, fs: fsShim, 'fs/promises': fsShim.promises, path: pathShim, events: EventEmitter, assert: assertFn, 'assert/strict': assertFn,
    util: utilShim, crypto: cryptoShim, os: osShim, url: urlShim, 'timers/promises': timersPromises, cors: cors, buffer: { Buffer: NodeBuffer },
    process: processShim,
  };
  function stripExt(n) { return n.replace(/\.(m?js|cjs|jsx|ts|json)$/i, ''); }
  function resolveFile(files, from, spec) {
    var dir = from.indexOf('/') >= 0 ? from.slice(0, from.lastIndexOf('/')) : '';
    var parts = (dir ? dir.split('/') : []).concat(spec.split('/'));
    var norm = normalizeParts(parts, false).join('/');
    var candidates = [norm, norm + '.js', norm + '.json', norm + '/index.js'];
    for (var i = 0; i < candidates.length; i++) if (candidates[i] in files) return candidates[i];
    return null;
  }
  G.__makeRequire = function (files, cache) {
    function requireFrom(from) {
      return function (spec) {
        var name = String(spec).replace(/^node:/, '');
        if (name.charAt(0) === '.' || name.charAt(0) === '/') {
          var file = resolveFile(files, from, name.replace(/^\//, ''));
          if (!file) throw makeError('MODULE_NOT_FOUND', "Cannot find module '" + spec + "'\nThe files in this lesson are: " + Object.keys(files).join(', '), { code: 'MODULE_NOT_FOUND' });
          if (cache[file]) return cache[file].exports;
          var mod = { exports: {}, id: file, filename: '/app/' + file };
          cache[file] = mod;
          if (/\.json$/i.test(file)) { mod.exports = JSON.parse(files[file]); return mod.exports; }
          new Function('exports', 'module', 'require', '__dirname', '__filename', files[file])(mod.exports, mod, requireFrom(file), '/app' + (file.indexOf('/') >= 0 ? '/' + file.slice(0, file.lastIndexOf('/')) : ''), '/app/' + file);
          return mod.exports;
        }
        if (Object.prototype.hasOwnProperty.call(builtins, name)) return builtins[name];
        var e = new Error("Cannot find module '" + spec + "'. This practice environment has: " + Object.keys(builtins).filter(function (k) { return k !== 'process'; }).join(', ') + ' (and your own files, e.g. require("./routes/users")).');
        e.code = 'MODULE_NOT_FOUND';
        throw e;
      };
    }
    return requireFrom;
  };

  /** Runs the first file (main) as an async function (top-level await works) with require() for the others. */
  G.__runMain = async function (files, main) {
    var cache = {};
    var mk = G.__makeRequire(files, cache);
    var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    var mod = { exports: {}, id: '.', filename: '/app/' + main };
    G.__nodeRequire = mk(main);
    try {
      await new AsyncFunction('exports', 'module', 'require', '__dirname', '__filename', files[main])(mod.exports, mod, G.__nodeRequire, '/app', '/app/' + main);
    } catch (e) {
      if (e && e.name === 'ProcessExit') return;
      throw e;
    }
  };

  /* ------------------------------------------------------------------ tests: describe / it / expect / jest.fn */
  var suiteStack = [{ name: '', tests: [], suites: [], before: [], after: [], beforeAll: [], afterAll: [], depth: -1 }];
  function curSuite() { return suiteStack[suiteStack.length - 1]; }
  var anyTests = false;

  function describeFn(name, fn) {
    anyTests = true;
    var parent = curSuite();
    var s = { name: name, tests: [], suites: [], before: [], after: [], beforeAll: [], afterAll: [], parent: parent, depth: parent.depth + 1 };
    parent.suites.push(s); parent.tests.push({ suite: s });
    suiteStack.push(s);
    try { fn(); } finally { suiteStack.pop(); }
  }
  function testFn(name, fn, opts) {
    anyTests = true;
    if (opts && opts.only) hasOnly = true;
    curSuite().tests.push({ name: name, fn: fn, skip: opts && opts.skip, todo: opts && opts.todo, only: opts && opts.only });
  }
  var hasOnly = false;
  function eachFactory(base) {
    return function (table) {
      return function (name, fn) {
        table.forEach(function (row) {
          var args = Array.isArray(row) ? row : [row], i = 0;
          var title = name.replace(/%[sdifjoOp%]/g, function (m) { if (m === '%%') return '%'; var v = args[i++]; return typeof v === 'string' ? v : show(v); });
          base(title, function () { return fn.apply(null, args); });
        });
      };
    };
  }
  G.describe = describeFn;
  G.describe.skip = function (name) { anyTests = true; curSuite().tests.push({ suite: { name: name, tests: [], suites: [], before: [], after: [], beforeAll: [], afterAll: [], depth: curSuite().depth + 1, skipped: true } }); };
  G.describe.each = function (table) { return function (name, fn) { table.forEach(function (row) { var args = Array.isArray(row) ? row : [row], i = 0; describeFn(name.replace(/%[sdifjoOp]/g, function () { return show(args[i++]); }), function () { fn.apply(null, args); }); }); }; };
  G.it = G.test = testFn;
  G.it.skip = G.test.skip = function (name, fn) { testFn(name, fn, { skip: true }); };
  G.it.only = G.test.only = function (name, fn) { testFn(name, fn, { only: true }); };
  G.it.todo = G.test.todo = function (name) { testFn(name, null, { todo: true }); };
  G.it.each = G.test.each = eachFactory(testFn);
  G.beforeEach = function (fn) { curSuite().before.push(fn); };
  G.afterEach = function (fn) { curSuite().after.push(fn); };
  G.beforeAll = function (fn) { curSuite().beforeAll.push(fn); };
  G.afterAll = function (fn) { curSuite().afterAll.push(fn); };

  function Matcher(received, negate, mode) { this.received = received; this.negate = negate; this.mode = mode; }
  function fail(msg) { var e = new Error(msg); e.name = 'AssertionError'; e.isExpect = true; throw e; }
  function lines(label, expected, received) { return label + '\n  Expected: ' + show(expected) + '\n  Received: ' + show(received); }
  var matchers = {
    toBe: function (r, e) { return { pass: Object.is(r, e), msg: lines('toBe (Object.is equality)', e, r), neg: 'Expected value not to be ' + show(e) }; },
    toEqual: function (r, e) { return { pass: deepEqual(r, e, false), msg: lines('toEqual (deep equality)', e, r), neg: 'Expected value not to equal ' + show(e) }; },
    toStrictEqual: function (r, e) { return { pass: deepEqual(r, e, true), msg: lines('toStrictEqual', e, r), neg: 'Expected value not to strictly equal ' + show(e) }; },
    toBeTruthy: function (r) { return { pass: !!r, msg: 'Expected a truthy value\n  Received: ' + show(r), neg: 'Expected a falsy value\n  Received: ' + show(r) }; },
    toBeFalsy: function (r) { return { pass: !r, msg: 'Expected a falsy value\n  Received: ' + show(r), neg: 'Expected a truthy value\n  Received: ' + show(r) }; },
    toBeNull: function (r) { return { pass: r === null, msg: lines('toBeNull', null, r), neg: 'Expected value not to be null' }; },
    toBeUndefined: function (r) { return { pass: r === undefined, msg: lines('toBeUndefined', undefined, r), neg: 'Expected value not to be undefined' }; },
    toBeDefined: function (r) { return { pass: r !== undefined, msg: 'Expected value to be defined', neg: 'Expected value to be undefined' }; },
    toBeNaN: function (r) { return { pass: Number.isNaN(r), msg: 'Expected NaN\n  Received: ' + show(r), neg: 'Expected value not to be NaN' }; },
    toBeGreaterThan: function (r, e) { return { pass: r > e, msg: 'Expected ' + show(r) + ' to be greater than ' + show(e), neg: 'Expected ' + show(r) + ' not to be greater than ' + show(e) }; },
    toBeGreaterThanOrEqual: function (r, e) { return { pass: r >= e, msg: 'Expected ' + show(r) + ' to be greater than or equal to ' + show(e), neg: 'Expected ' + show(r) + ' not to be >= ' + show(e) }; },
    toBeLessThan: function (r, e) { return { pass: r < e, msg: 'Expected ' + show(r) + ' to be less than ' + show(e), neg: 'Expected ' + show(r) + ' not to be less than ' + show(e) }; },
    toBeLessThanOrEqual: function (r, e) { return { pass: r <= e, msg: 'Expected ' + show(r) + ' to be less than or equal to ' + show(e), neg: 'Expected ' + show(r) + ' not to be <= ' + show(e) }; },
    toBeCloseTo: function (r, e, d) { d = d === undefined ? 2 : d; return { pass: Math.abs(r - e) < Math.pow(10, -d) / 2, msg: lines('toBeCloseTo (' + d + ' digits)', e, r), neg: 'Expected ' + show(r) + ' not to be close to ' + show(e) }; },
    toContain: function (r, e) { var ok = typeof r === 'string' ? r.indexOf(e) >= 0 : Array.from(r).indexOf(e) >= 0; return { pass: ok, msg: 'Expected ' + show(r) + ' to contain ' + show(e), neg: 'Expected ' + show(r) + ' not to contain ' + show(e) }; },
    toContainEqual: function (r, e) { return { pass: Array.from(r).some(function (x) { return deepEqual(x, e, false); }), msg: 'Expected ' + show(r) + ' to contain an item equal to ' + show(e), neg: 'Expected ' + show(r) + ' not to contain an item equal to ' + show(e) }; },
    toHaveLength: function (r, e) { return { pass: r != null && r.length === e, msg: lines('toHaveLength', e, r && r.length), neg: 'Expected length not to be ' + e }; },
    toMatch: function (r, e) { var ok = e instanceof RegExp ? e.test(r) : String(r).indexOf(e) >= 0; return { pass: ok, msg: 'Expected ' + show(r) + ' to match ' + String(e), neg: 'Expected ' + show(r) + ' not to match ' + String(e) }; },
    toHaveProperty: function (r, key, val) {
      var cur = r, ok = r != null;
      if (ok) String(key).split('.').forEach(function (k) { if (ok && cur != null && k in Object(cur)) cur = cur[k]; else ok = false; });
      if (ok && val !== undefined) ok = deepEqual(cur, val, false);
      return { pass: ok, msg: 'Expected ' + show(r) + ' to have property ' + show(key) + (val !== undefined ? ' with value ' + show(val) : ''), neg: 'Expected ' + show(r) + ' not to have property ' + show(key) };
    },
    toMatchObject: function (r, e) {
      function sub(a, b) { if (typeof b !== 'object' || b === null) return deepEqual(a, b, false); if (typeof a !== 'object' || a === null) return false; return Object.keys(b).every(function (k) { return sub(a[k], b[k]); }); }
      return { pass: sub(r, e), msg: lines('toMatchObject', e, r), neg: 'Expected ' + show(r) + ' not to match object ' + show(e) };
    },
    toBeInstanceOf: function (r, e) { return { pass: r instanceof e, msg: 'Expected ' + show(r) + ' to be an instance of ' + (e && e.name), neg: 'Expected value not to be an instance of ' + (e && e.name) }; },
    toThrow: function (r, e) {
      var threw = false, err;
      try { r(); } catch (x) { threw = true; err = x; }
      var ok = threw;
      if (threw && e !== undefined) {
        var m = err && err.message !== undefined ? String(err.message) : String(err);
        if (typeof e === 'string') ok = m.indexOf(e) >= 0; else if (e instanceof RegExp) ok = e.test(m); else if (typeof e === 'function') ok = err instanceof e; else if (e && e.message) ok = m === e.message;
      }
      return { pass: ok, msg: threw ? 'Expected the error to match ' + show(e) + '\n  Received message: ' + show(err && err.message) : 'Expected the function to throw, but it did not', neg: 'Expected the function not to throw, but it threw: ' + show(err && err.message) };
    },
    toHaveBeenCalled: function (r) { return { pass: r.mock && r.mock.calls.length > 0, msg: 'Expected the mock function to have been called', neg: 'Expected the mock function not to have been called, but it was called ' + (r.mock && r.mock.calls.length) + ' time(s)' }; },
    toHaveBeenCalledTimes: function (r, n) { return { pass: r.mock && r.mock.calls.length === n, msg: lines('toHaveBeenCalledTimes', n, r.mock && r.mock.calls.length), neg: 'Expected the mock not to have been called ' + n + ' times' }; },
    toHaveBeenCalledWith: function (r) { var args = Array.prototype.slice.call(arguments, 1); return { pass: r.mock && r.mock.calls.some(function (c) { return deepEqual(c, args, false); }), msg: 'Expected the mock to have been called with ' + show(args) + '\n  Calls: ' + show(r.mock ? r.mock.calls : []), neg: 'Expected the mock not to have been called with ' + show(args) }; },
    toHaveReturnedWith: function (r, v) { return { pass: r.mock && r.mock.results.some(function (x) { return deepEqual(x.value, v, false); }), msg: 'Expected the mock to have returned ' + show(v), neg: 'Expected the mock not to have returned ' + show(v) }; },
  };
  matchers.toHaveBeenLastCalledWith = function (r) { var args = Array.prototype.slice.call(arguments, 1); var calls = r.mock ? r.mock.calls : []; return { pass: calls.length > 0 && deepEqual(calls[calls.length - 1], args, false), msg: 'Expected the last call to be ' + show(args) + '\n  Calls: ' + show(calls), neg: 'Expected the last call not to be ' + show(args) }; };
  matchers.toHaveBeenNthCalledWith = function (r, n) { var args = Array.prototype.slice.call(arguments, 2); var calls = r.mock ? r.mock.calls : []; return { pass: calls.length >= n && deepEqual(calls[n - 1], args, false), msg: 'Expected call number ' + n + ' to be ' + show(args) + '\n  Calls: ' + show(calls), neg: 'Expected call number ' + n + ' not to be ' + show(args) }; };
  matchers.toHaveReturned = function (r) { return { pass: !!(r.mock && r.mock.results.some(function (x) { return x.type === 'return'; })), msg: 'Expected the mock to have returned', neg: 'Expected the mock not to have returned' }; };
  matchers.toBeCalled = matchers.toHaveBeenCalled; matchers.toBeCalledWith = matchers.toHaveBeenCalledWith; matchers.toEqualStrict = matchers.toStrictEqual;
  Object.keys(matchers).forEach(function (name) {
    Matcher.prototype[name] = function () {
      var self = this, args = Array.prototype.slice.call(arguments);
      var run = function (received) {
        var r = matchers[name].apply(null, [received].concat(args));
        if (self.negate ? r.pass : !r.pass) fail(self.negate ? r.neg : r.msg);
      };
      if (self.mode === 'resolves') return Promise.resolve(self.received).then(run);
      if (self.mode === 'rejects') return Promise.resolve(self.received).then(function () { fail('Expected the promise to reject, but it resolved'); }, function (e) { return run(name === 'toThrow' ? function () { throw e; } : e); });
      return run(self.received);
    };
  });
  function expectFn(received) {
    var m = new Matcher(received, false, 'sync');
    m.not = new Matcher(received, true, 'sync');
    m.resolves = new Matcher(received, false, 'resolves'); m.resolves.not = new Matcher(received, true, 'resolves');
    m.rejects = new Matcher(received, false, 'rejects'); m.rejects.not = new Matcher(received, true, 'rejects');
    return m;
  }
  expectFn.assertions = function () {}; expectFn.hasAssertions = function () {};
  function asym(test, label) { return { asymmetricMatch: test, toString: function () { return label; }, inspect: function () { return label; } }; }
  expectFn.anything = function () { return asym(function (x) { return x !== null && x !== undefined; }, 'Anything'); };
  expectFn.any = function (C) {
    return asym(function (x) {
      if (C === String) return typeof x === 'string' || x instanceof String;
      if (C === Number) return typeof x === 'number' || x instanceof Number;
      if (C === Boolean) return typeof x === 'boolean' || x instanceof Boolean;
      if (C === Function) return typeof x === 'function';
      if (C === Object) return typeof x === 'object' && x !== null;
      if (C === Array) return Array.isArray(x);
      return x instanceof C;
    }, 'Any<' + (C && C.name) + '>');
  };
  expectFn.objectContaining = function (o) { return asym(function (x) { return x !== null && typeof x === 'object' && Object.keys(o).every(function (k) { return k in x && deepEqual(x[k], o[k], false); }); }, 'ObjectContaining ' + show(o)); };
  expectFn.arrayContaining = function (arr) { return asym(function (x) { return Array.isArray(x) && arr.every(function (item) { return x.some(function (y) { return deepEqual(y, item, false); }); }); }, 'ArrayContaining ' + show(arr)); };
  expectFn.stringContaining = function (t) { return asym(function (x) { return typeof x === 'string' && x.indexOf(t) >= 0; }, 'StringContaining ' + show(t)); };
  expectFn.stringMatching = function (re) { return asym(function (x) { return typeof x === 'string' && new RegExp(re).test(x); }, 'StringMatching ' + String(re)); };
  G.expect = expectFn;

  function mockFn(impl) {
    var queue = [], defImpl = impl;
    var fn = function () {
      var args = Array.prototype.slice.call(arguments);
      fn.mock.calls.push(args); fn.mock.instances.push(this);
      var use = queue.length ? queue.shift() : defImpl, result = { type: 'return', value: undefined };
      try { result.value = use ? use.apply(this, args) : undefined; } catch (e) { result = { type: 'throw', value: e }; fn.mock.results.push(result); throw e; }
      fn.mock.results.push(result);
      return result.value;
    };
    fn._isMock = true;
    fn.mock = { calls: [], results: [], instances: [] };
    fn.mockReturnValue = function (v) { defImpl = function () { return v; }; return fn; };
    fn.mockReturnValueOnce = function (v) { queue.push(function () { return v; }); return fn; };
    fn.mockImplementation = function (f) { defImpl = f; return fn; };
    fn.mockImplementationOnce = function (f) { queue.push(f); return fn; };
    fn.mockResolvedValue = function (v) { defImpl = function () { return Promise.resolve(v); }; return fn; };
    fn.mockRejectedValue = function (v) { defImpl = function () { return Promise.reject(v); }; return fn; };
    fn.mockName = function (n) { fn._name = n; return fn; };
    fn.getMockName = function () { return fn._name || 'jest.fn()'; };
    fn.mockClear = function () { fn.mock.calls = []; fn.mock.results = []; fn.mock.instances = []; return fn; };
    fn.mockReset = function () { fn.mockClear(); defImpl = undefined; queue = []; return fn; };
    return fn;
  }
  G.jest = {
    fn: mockFn,
    spyOn: function (obj, method) {
      var orig = obj[method], spy = mockFn(function () { return orig.apply(this, arguments); });
      spy.mockRestore = function () { obj[method] = orig; };
      obj[method] = spy;
      return spy;
    },
    clearAllMocks: function () {}, restoreAllMocks: function () {},
  };

  async function runHooks(list) { for (var i = 0; i < list.length; i++) await list[i](); }
  function collectBefore(s) { var out = []; for (var x = s; x; x = x.parent) out = x.before.concat(out); return out; }
  function collectAfter(s) { var out = []; for (var x = s; x; x = x.parent) out = out.concat(x.after); return out; }

  G.__runTests = async function () {
    if (!anyTests) return;
    var passed = 0, failed = 0, skipped = 0;
    function out(depth, text) { console.log('  '.repeat(Math.max(depth, 0)) + text); }
    async function runSuite(s) {
      if (s.name) out(s.depth, s.name);
      if (s.skipped) { out(s.depth + 1, '○ skipped'); skipped++; return; }
      try { await runHooks(s.beforeAll); } catch (e) { failed++; out(s.depth + 1, '✗ beforeAll hook: ' + (e && e.message)); return; }
      for (var i = 0; i < s.tests.length; i++) {
        var t = s.tests[i];
        if (t.suite) { await runSuite(t.suite); continue; }
        var d = s.depth + 1;
        if (t.skip || (hasOnly && !t.only)) { out(d, '○ ' + t.name + ' (skipped)'); skipped++; continue; }
        if (t.todo) { out(d, '○ ' + t.name + ' (todo)'); skipped++; continue; }
        try {
          await runHooks(collectBefore(s));
          var r = t.fn();
          if (r && typeof r.then === 'function') await r;
          await runHooks(collectAfter(s));
          passed++; out(d, '✓ ' + t.name);
        } catch (e) {
          failed++;
          out(d, '✗ ' + t.name);
          var msg = e && e.message !== undefined ? String(e.message) : String(e);
          if (e && !e.isExpect && e.name && e.name !== 'AssertionError') msg = e.name + ': ' + msg;
          msg.split('\n').forEach(function (l) { out(d + 2, l); });
          try { await runHooks(collectAfter(s)); } catch (e2) { /* ignore */ }
        }
      }
      try { await runHooks(s.afterAll); } catch (e3) { /* ignore */ }
    }
    await runSuite(suiteStack[0]);
    console.log('');
    console.log('Tests: ' + (failed ? failed + ' failed, ' : '') + passed + ' passed' + (skipped ? ', ' + skipped + ' skipped' : '') + ', ' + (passed + failed + skipped) + ' total');
  };
})();
