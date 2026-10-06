/**
 * Source code (as a string) for formatting console arguments. It is injected
 * into iframes and web workers so `console.log({a: 1})` looks like a real console.
 */
export const FORMAT_SOURCE = `
function __fmt(v, depth) {
  depth = depth || 0;
  if (typeof v === 'string') return depth === 0 ? v : JSON.stringify(v);
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  if (typeof v === 'function') return '[Function' + (v.name ? ': ' + v.name : '') + ']';
  if (typeof v === 'symbol' || typeof v === 'bigint') return String(v) + (typeof v === 'bigint' ? 'n' : '');
  if (v instanceof Error) return v.name + ': ' + v.message;
  if (typeof v === 'object') {
    if (depth > 3) return Array.isArray(v) ? '[Array]' : '[Object]';
    try {
      if (Array.isArray(v)) return '[' + v.map(function (x) { return __fmt(x, depth + 1); }).join(', ') + ']';
      if (v instanceof Map) return 'Map(' + v.size + ') {' + Array.from(v.entries()).map(function (e) { return __fmt(e[0], depth + 1) + ' => ' + __fmt(e[1], depth + 1); }).join(', ') + '}';
      if (v instanceof Set) return 'Set(' + v.size + ') {' + Array.from(v.values()).map(function (x) { return __fmt(x, depth + 1); }).join(', ') + '}';
      var keys = Object.keys(v);
      if (!keys.length) return '{}';
      return '{ ' + keys.map(function (k) { return k + ': ' + __fmt(v[k], depth + 1); }).join(', ') + ' }';
    } catch (e) { return String(v); }
  }
  return String(v);
}
function __fmtArgs(args) {
  var a = Array.prototype.slice.call(args);
  if (typeof a[0] === 'string' && /%[sdifoOj]/.test(a[0]) && a.length > 1) {
    var i = 1;
    var first = a[0].replace(/%[sdifoOj%]/g, function (m) {
      if (m === '%%') return '%';
      if (i >= a.length) return m;
      var x = a[i++];
      if (m === '%d' || m === '%i') return String(parseInt(x, 10));
      if (m === '%f') return String(parseFloat(x));
      return __fmt(x, 1);
    });
    a = [first].concat(a.slice(i));
  }
  return a.map(function (x) { return __fmt(x, 0); }).join(' ');
}
`;
