/**
 * Extra autocomplete for languages where Monaco only has syntax highlighting.
 * HTML, CSS, JavaScript and TypeScript already get full IntelliSense from Monaco itself.
 * Add a language here by calling `provide('<monaco language id>', { ... })`.
 */
import type * as Monaco from 'monaco-editor';
import { SQL_SCHEMA } from './sqlSchema';

type M = typeof Monaco;

interface Entry {
  label: string;
  /** Plain text or a snippet (with ${1:placeholders}) */
  insert?: string;
  detail?: string;
  doc?: string;
  kind?: 'keyword' | 'function' | 'snippet' | 'type' | 'method' | 'class' | 'field' | 'module';
}

interface LangData {
  keywords?: string[];
  types?: string[];
  functions?: Entry[];
  /** Offered after typing "." */
  methods?: Entry[];
  snippets?: Entry[];
  triggerCharacters?: string[];
}

const S = (label: string, insert: string, detail: string): Entry => ({ label, insert, detail, kind: 'snippet' });
const F = (label: string, insert: string, detail: string): Entry => ({ label, insert, detail, kind: 'function' });
const Me = (label: string, insert: string, detail: string): Entry => ({ label, insert, detail, kind: 'method' });

const PY: LangData = {
  keywords: ['and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'True', 'False', 'try', 'while', 'with', 'yield'],
  functions: [
    F('print', 'print(${1})', 'print(*values, sep=" ", end="\\n") - show text'),
    F('input', 'input(${1:"Your answer: "})', 'input(prompt) - read a line of text'),
    F('len', 'len(${1})', 'len(x) - number of items'),
    F('range', 'range(${1:10})', 'range(stop) - a sequence of numbers'),
    F('int', 'int(${1})', 'int(x) - convert to whole number'),
    F('float', 'float(${1})', 'float(x) - convert to decimal number'),
    F('str', 'str(${1})', 'str(x) - convert to text'),
    F('bool', 'bool(${1})', 'bool(x) - convert to True/False'),
    F('list', 'list(${1})', 'list(iterable)'),
    F('dict', 'dict(${1})', 'dict() - a key/value mapping'),
    F('set', 'set(${1})', 'set(iterable) - unique items'),
    F('tuple', 'tuple(${1})', 'tuple(iterable)'),
    F('sum', 'sum(${1})', 'sum(numbers)'),
    F('min', 'min(${1})', 'min(a, b, ...) - smallest'),
    F('max', 'max(${1})', 'max(a, b, ...) - largest'),
    F('abs', 'abs(${1})', 'abs(x) - absolute value'),
    F('round', 'round(${1}, ${2:2})', 'round(x, digits)'),
    F('sorted', 'sorted(${1})', 'sorted(iterable) - new sorted list'),
    F('reversed', 'reversed(${1})', 'reversed(sequence)'),
    F('enumerate', 'enumerate(${1})', 'enumerate(iterable) - (index, item) pairs'),
    F('zip', 'zip(${1}, ${2})', 'zip(a, b) - pair items up'),
    F('type', 'type(${1})', 'type(x) - what kind of value'),
    F('isinstance', 'isinstance(${1}, ${2:str})', 'isinstance(x, type)'),
    F('open', 'open(${1:"file.txt"})', 'open(path) - open a file'),
  ],
  methods: [
    Me('append', 'append(${1})', 'list.append(x) - add to the end'),
    Me('extend', 'extend(${1})', 'list.extend(items)'),
    Me('insert', 'insert(${1:0}, ${2})', 'list.insert(index, x)'),
    Me('remove', 'remove(${1})', 'list.remove(x)'),
    Me('pop', 'pop(${1})', 'list.pop(index) - remove and return'),
    Me('sort', 'sort()', 'list.sort() - sort in place'),
    Me('reverse', 'reverse()', 'list.reverse()'),
    Me('index', 'index(${1})', 'list.index(x)'),
    Me('count', 'count(${1})', 'count(x)'),
    Me('upper', 'upper()', 'str.upper() - CAPITALS'),
    Me('lower', 'lower()', 'str.lower() - lowercase'),
    Me('strip', 'strip()', 'str.strip() - trim spaces'),
    Me('split', 'split(${1})', 'str.split(sep) - break into a list'),
    Me('join', 'join(${1})', 'sep.join(items) - glue a list into text'),
    Me('replace', 'replace(${1:old}, ${2:new})', 'str.replace(old, new)'),
    Me('format', 'format(${1})', 'str.format(...)'),
    Me('startswith', 'startswith(${1})', 'str.startswith(prefix)'),
    Me('endswith', 'endswith(${1})', 'str.endswith(suffix)'),
    Me('find', 'find(${1})', 'str.find(sub)'),
    Me('keys', 'keys()', 'dict.keys()'),
    Me('values', 'values()', 'dict.values()'),
    Me('items', 'items()', 'dict.items() - (key, value) pairs'),
    Me('get', 'get(${1:key}, ${2:None})', 'dict.get(key, default)'),
    Me('update', 'update(${1})', 'dict.update(other)'),
    // --- the game engine:  import game ---
    Me('run', 'run(${1:update}, ${2:draw})', 'game.run(update, draw) - start the game loop'),
    Me('clear', 'clear(${1:game.DARK})', 'game.clear(color) - fill the screen'),
    Me('rect', 'rect(${1:x}, ${2:y}, ${3:w}, ${4:h}, ${5:game.WHITE})', 'game.rect(x, y, w, h, color)'),
    Me('circle', 'circle(${1:x}, ${2:y}, ${3:radius}, ${4:game.WHITE})', 'game.circle(x, y, radius, color)'),
    Me('line', 'line(${1:x1}, ${2:y1}, ${3:x2}, ${4:y2}, ${5:game.WHITE})', 'game.line(x1, y1, x2, y2, color)'),
    Me('text', 'text(${1:x}, ${2:y}, ${3:"message"}, ${4:game.WHITE})', 'game.text(x, y, message, color, size)'),
    Me('key_down', 'key_down("${1:left}")', 'game.key_down(name) - True while the key is held'),
    Me('key_pressed', 'key_pressed("${1:space}")', 'game.key_pressed(name) - True on the frame it goes down'),
    Me('mouse_pos', 'mouse_pos()', 'game.mouse_pos() -> (x, y)'),
    Me('mouse_down', 'mouse_down()', 'game.mouse_down() - True while the button is held'),
    Me('mouse_pressed', 'mouse_pressed()', 'game.mouse_pressed() - True on the frame it is clicked'),
    Me('time', 'time()', 'game.time() - seconds since the game started'),
    Me('stop', 'stop()', 'game.stop() - stop the game'),
    Me('WIDTH', 'WIDTH', 'game.WIDTH = 320'),
    Me('HEIGHT', 'HEIGHT', 'game.HEIGHT = 240'),
    Me('DARK', 'DARK', 'game color'),
    Me('WHITE', 'WHITE', 'game color'),
    Me('YELLOW', 'YELLOW', 'game color'),
    Me('RED', 'RED', 'game color'),
    Me('GREEN', 'GREEN', 'game color'),
    Me('BLUE', 'BLUE', 'game color'),
    Me('ORANGE', 'ORANGE', 'game color'),
    Me('PURPLE', 'PURPLE', 'game color'),
    Me('CYAN', 'CYAN', 'game color'),
    Me('PINK', 'PINK', 'game color'),
    Me('GRAY', 'GRAY', 'game color'),
    Me('BLACK', 'BLACK', 'game color'),
  ],
  snippets: [
    S('import game', 'import game\n\n${0}', 'use the game engine'),
    S('gameloop', 'import game\n\nx = 100\n\ndef update(dt):\n\tglobal x\n\t${1:pass}\n\ndef draw():\n\tgame.clear(game.DARK)\n\t${0}\n\ngame.run(update, draw)', 'game skeleton'),
    S('def', 'def ${1:name}(${2:params}):\n\t${0:pass}', 'function'),
    S('for', 'for ${1:item} in ${2:items}:\n\t${0:pass}', 'for loop'),
    S('forr', 'for ${1:i} in range(${2:10}):\n\t${0:pass}', 'for loop over numbers'),
    S('while', 'while ${1:condition}:\n\t${0:pass}', 'while loop'),
    S('if', 'if ${1:condition}:\n\t${0:pass}', 'if'),
    S('ifelse', 'if ${1:condition}:\n\t${2:pass}\nelse:\n\t${0:pass}', 'if / else'),
    S('class', 'class ${1:Name}:\n\tdef __init__(self${2}):\n\t\t${0:pass}', 'class'),
    S('try', 'try:\n\t${1:pass}\nexcept ${2:Exception} as e:\n\t${0:print(e)}', 'try / except'),
    S('main', 'if __name__ == "__main__":\n\t${0:main()}', 'script entry point'),
    S('listcomp', '[${1:x} for ${2:x} in ${3:items}]', 'list comprehension'),
  ],
};

const ENGINE_C_FUNCS: Entry[] = [
  F('engine_running', 'engine_running()', 'loop condition: while (engine_running()) { ... }'),
  F('engine_present', 'engine_present();', 'end the frame'),
  F('engine_clear', 'engine_clear(${1:RGB_DARK});', 'fill the screen with a color'),
  F('engine_rect', 'engine_rect(${1:x}, ${2:y}, ${3:w}, ${4:h}, ${5:RGB_WHITE});', 'draw a filled rectangle'),
  F('engine_circle', 'engine_circle(${1:x}, ${2:y}, ${3:radius}, ${4:RGB_WHITE});', 'draw a filled circle'),
  F('engine_line', 'engine_line(${1:x1}, ${2:y1}, ${3:x2}, ${4:y2}, ${5:RGB_WHITE});', 'draw a line'),
  F('engine_text', 'engine_text(${1:x}, ${2:y}, ${3:14}, ${4:RGB_WHITE}, ${5:"text"});', 'draw text'),
  F('engine_frames', 'engine_frames(${1:180});', 'how many frames to record (max 600)'),
  F('engine_frame', 'engine_frame()', 'number of the current frame'),
  F('key_down', 'key_down(${1:KEY_RIGHT})', '1 while the key is held'),
  F('key_pressed', 'key_pressed(${1:KEY_SPACE})', '1 on the frame the key goes down'),
  ...['KEY_LEFT', 'KEY_RIGHT', 'KEY_UP', 'KEY_DOWN', 'KEY_SPACE', 'KEY_A', 'KEY_D', 'KEY_W', 'KEY_S', 'KEY_Z', 'KEY_X', 'KEY_ENTER'].map((k) => F(k, k, 'key code')),
  ...['RGB_BLACK', 'RGB_WHITE', 'RGB_GRAY', 'RGB_DARK', 'RGB_RED', 'RGB_ORANGE', 'RGB_YELLOW', 'RGB_GREEN', 'RGB_CYAN', 'RGB_BLUE', 'RGB_PURPLE', 'RGB_PINK'].map((k) => F(k, k, 'color (three numbers)')),
  F('SCREEN_W', 'SCREEN_W', 'screen width: 320'),
  F('SCREEN_H', 'SCREEN_H', 'screen height: 240'),
];

const C_COMMON_FUNCS: Entry[] = [
  F('printf', 'printf("${1:%d}\\n", ${2});', 'printf(format, ...) - print formatted text'),
  F('scanf', 'scanf("${1:%d}", &${2:x});', 'scanf(format, &var) - read input'),
  F('puts', 'puts(${1:"text"});', 'puts(str) - print a line'),
  F('getchar', 'getchar()', 'getchar() - read one character'),
  F('strlen', 'strlen(${1})', 'size_t strlen(const char *s)'),
  F('strcpy', 'strcpy(${1:dest}, ${2:src});', 'copy a string'),
  F('strcmp', 'strcmp(${1:a}, ${2:b})', 'compare strings (0 means equal)'),
  F('strcat', 'strcat(${1:dest}, ${2:src});', 'append a string'),
  F('malloc', 'malloc(${1:size})', 'allocate memory'),
  F('free', 'free(${1:ptr});', 'release memory'),
  F('sqrt', 'sqrt(${1})', 'square root (math.h)'),
  F('pow', 'pow(${1:base}, ${2:exp})', 'power (math.h)'),
  F('abs', 'abs(${1})', 'absolute value of an int'),
  F('rand', 'rand()', 'random number'),
  F('sizeof', 'sizeof(${1})', 'size in bytes'),
];

const C_KEYWORDS = ['auto', 'break', 'case', 'const', 'continue', 'default', 'do', 'else', 'enum', 'extern', 'for', 'goto', 'if', 'return', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'volatile', 'while'];
const C_TYPES = ['int', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'signed', 'void', 'size_t', 'bool'];

const C_LANG: LangData = {
  keywords: C_KEYWORDS,
  types: C_TYPES,
  functions: [...C_COMMON_FUNCS, ...ENGINE_C_FUNCS],
  triggerCharacters: ['#'],
  snippets: [
    S('#include "engine.h"', '#include "engine.h"', 'use the game engine'),
    S('gameloop', 'while (engine_running()) {\n\t/* update */\n\t${1}\n\n\t/* draw */\n\tengine_clear(RGB_DARK);\n\t${0}\n\tengine_present();\n}', 'game loop'),
    S('#include <stdio.h>', '#include <${1:stdio.h}>', 'include a header'),
    S('main', 'int main(void) {\n\t${0}\n\treturn 0;\n}', 'main function'),
    S('for', 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}', 'for loop'),
    S('while', 'while (${1:condition}) {\n\t${0}\n}', 'while loop'),
    S('if', 'if (${1:condition}) {\n\t${0}\n}', 'if'),
    S('ifelse', 'if (${1:condition}) {\n\t${2}\n} else {\n\t${0}\n}', 'if / else'),
    S('switch', 'switch (${1:value}) {\n\tcase ${2:1}:\n\t\t${3}\n\t\tbreak;\n\tdefault:\n\t\t${0}\n}', 'switch'),
    S('struct', 'struct ${1:Name} {\n\t${0}\n};', 'struct'),
    S('func', '${1:int} ${2:name}(${3:int a}) {\n\t${0}\n}', 'function'),
  ],
};

const CPP_LANG: LangData = {
  keywords: [...C_KEYWORDS, 'class', 'public', 'private', 'protected', 'namespace', 'using', 'template', 'typename', 'new', 'delete', 'nullptr', 'this', 'virtual', 'override', 'try', 'catch', 'throw', 'constexpr', 'auto', 'true', 'false', 'std'],
  types: [...C_TYPES, 'string', 'vector', 'map', 'set', 'unordered_map', 'pair', 'array', 'int64_t'],
  functions: [
    ...C_COMMON_FUNCS,
    ...ENGINE_C_FUNCS,
    F('cout', 'cout << ${1} << endl;', 'print to the console'),
    F('cin', 'cin >> ${1:x};', 'read from the keyboard'),
    F('getline', 'getline(cin, ${1:line});', 'read a whole line'),
    F('sort', 'sort(${1:v}.begin(), ${1:v}.end());', 'sort a range (#include <algorithm>)'),
    F('to_string', 'to_string(${1})', 'number to string'),
    F('stoi', 'stoi(${1})', 'string to int'),
    F('max', 'max(${1:a}, ${2:b})', 'larger of two'),
    F('min', 'min(${1:a}, ${2:b})', 'smaller of two'),
  ],
  methods: [
    Me('push_back', 'push_back(${1})', 'vector: add to the end'),
    Me('pop_back', 'pop_back()', 'vector: remove the last item'),
    Me('size', 'size()', 'number of items'),
    Me('empty', 'empty()', 'true if there are no items'),
    Me('begin', 'begin()', 'iterator to the first item'),
    Me('end', 'end()', 'iterator after the last item'),
    Me('at', 'at(${1:i})', 'checked element access'),
    Me('length', 'length()', 'string length'),
    Me('substr', 'substr(${1:pos}, ${2:len})', 'part of a string'),
    Me('find', 'find(${1})', 'find in a string / container'),
    Me('clear', 'clear()', 'remove everything'),
    Me('insert', 'insert(${1})', 'insert items'),
    Me('erase', 'erase(${1})', 'remove items'),
  ],
  snippets: [
    S('#include "engine.h"', '#include "engine.h"', 'use the game engine'),
    S('gameloop', 'while (engine_running()) {\n\t// update\n\t${1}\n\n\t// draw\n\tengine_clear(RGB_DARK);\n\t${0}\n\tengine_present();\n}', 'game loop'),
    S('#include <iostream>', '#include <${1:iostream}>', 'include a header'),
    S('using namespace std', 'using namespace std;', 'use the std namespace'),
    S('main', 'int main() {\n\t${0}\n\treturn 0;\n}', 'main function'),
    S('for', 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}', 'for loop'),
    S('forr', 'for (const auto& ${1:item} : ${2:items}) {\n\t${0}\n}', 'range-based for loop'),
    S('while', 'while (${1:condition}) {\n\t${0}\n}', 'while loop'),
    S('if', 'if (${1:condition}) {\n\t${0}\n}', 'if'),
    S('class', 'class ${1:Name} {\npublic:\n\t${1:Name}(${2}) {}\n\t${0}\nprivate:\n};', 'class'),
    S('func', '${1:int} ${2:name}(${3:int a}) {\n\t${0}\n}', 'function'),
    S('vector', 'vector<${1:int}> ${2:v} = {${3}};', 'vector'),
  ],
};

const CS_LANG: LangData = {
  keywords: ['abstract', 'as', 'base', 'break', 'case', 'catch', 'class', 'const', 'continue', 'default', 'do', 'else', 'enum', 'false', 'finally', 'for', 'foreach', 'if', 'in', 'interface', 'internal', 'is', 'namespace', 'new', 'null', 'out', 'override', 'private', 'protected', 'public', 'readonly', 'ref', 'return', 'sealed', 'static', 'struct', 'switch', 'this', 'throw', 'true', 'try', 'using', 'var', 'virtual', 'void', 'while'],
  types: ['int', 'long', 'double', 'float', 'decimal', 'bool', 'char', 'string', 'object', 'List', 'Dictionary', 'Math', 'Console', 'Convert'],
  functions: [
    F('Console.WriteLine', 'Console.WriteLine(${1});', 'print a line'),
    F('Console.Write', 'Console.Write(${1});', 'print without a new line'),
    F('Console.ReadLine', 'Console.ReadLine()', 'read a line from the keyboard'),
    F('int.Parse', 'int.Parse(${1})', 'text to int'),
    F('double.Parse', 'double.Parse(${1})', 'text to double'),
    F('Math.Max', 'Math.Max(${1:a}, ${2:b})', 'larger of two'),
    F('Math.Min', 'Math.Min(${1:a}, ${2:b})', 'smaller of two'),
    F('Math.Sqrt', 'Math.Sqrt(${1})', 'square root'),
    F('Math.Pow', 'Math.Pow(${1:x}, ${2:y})', 'power'),
    F('Math.Round', 'Math.Round(${1})', 'round a number'),
  ],
  methods: [
    Me('Add', 'Add(${1})', 'List: add an item'),
    Me('Remove', 'Remove(${1})', 'List: remove an item'),
    Me('Contains', 'Contains(${1})', 'true if the item exists'),
    Me('Count', 'Count', 'number of items'),
    Me('Length', 'Length', 'length of a string or array'),
    Me('ToString', 'ToString()', 'convert to text'),
    Me('ToUpper', 'ToUpper()', 'UPPERCASE'),
    Me('ToLower', 'ToLower()', 'lowercase'),
    Me('Trim', 'Trim()', 'remove surrounding spaces'),
    Me('Split', 'Split(${1:\',\'})', 'break text into an array'),
    Me('Substring', 'Substring(${1:start}, ${2:length})', 'part of a string'),
    Me('Replace', 'Replace(${1:old}, ${2:new})', 'replace text'),
    Me('Sort', 'Sort()', 'List: sort in place'),
    // --- the game engine: Engine.xxx, Key.xxx, Color.xxx ---
    Me('Running', 'Running()', 'loop condition: while (Engine.Running()) { ... }'),
    Me('Present', 'Present();', 'end the frame'),
    Me('Clear', 'Clear(${1:Color.Dark});', 'fill the screen with a color'),
    Me('Rect', 'Rect(${1:x}, ${2:y}, ${3:w}, ${4:h}, ${5:Color.White});', 'draw a filled rectangle'),
    Me('Circle', 'Circle(${1:x}, ${2:y}, ${3:radius}, ${4:Color.White});', 'draw a filled circle'),
    Me('Line', 'Line(${1:x1}, ${2:y1}, ${3:x2}, ${4:y2}, ${5:Color.White});', 'draw a line'),
    Me('Text', 'Text(${1:x}, ${2:y}, ${3:14}, ${4:Color.White}, ${5:"text"});', 'draw text'),
    Me('KeyDown', 'KeyDown(${1:Key.Right})', 'true while the key is held'),
    Me('KeyPressed', 'KeyPressed(${1:Key.Space})', 'true on the frame the key goes down'),
    Me('Frames', 'Frames(${1:180});', 'how many frames to record (max 600)'),
    Me('Frame', 'Frame', 'number of the current frame'),
    Me('Width', 'Width', 'screen width: 320'),
    Me('Height', 'Height', 'screen height: 240'),
    ...['Left', 'Right', 'Up', 'Down', 'Space', 'A', 'D', 'W', 'S', 'Z', 'X', 'Enter'].map((k) => Me(k, k, 'Key.' + k)),
    ...['Black', 'White', 'Gray', 'Dark', 'Red', 'Orange', 'Yellow', 'Green', 'Cyan', 'Blue', 'Purple', 'Pink'].map((k) => Me(k, k, 'Color.' + k)),
  ],
  snippets: [
    S('using System', 'using System;', 'import System'),
    S('using System.Collections.Generic', 'using System.Collections.Generic;', 'import collections'),
    S('main', 'static void Main()\n{\n\t${0}\n}', 'Main method'),
    S('program', 'using System;\n\nclass Program\n{\n\tstatic void Main()\n\t{\n\t\t${0}\n\t}\n}', 'full program'),
    S('for', 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++)\n{\n\t${0}\n}', 'for loop'),
    S('foreach', 'foreach (var ${1:item} in ${2:items})\n{\n\t${0}\n}', 'foreach loop'),
    S('while', 'while (${1:condition})\n{\n\t${0}\n}', 'while loop'),
    S('if', 'if (${1:condition})\n{\n\t${0}\n}', 'if'),
    S('class', 'class ${1:Name}\n{\n\t${0}\n}', 'class'),
    S('method', 'static ${1:int} ${2:Name}(${3:int a})\n{\n\t${0}\n}', 'method'),
    S('prop', 'public ${1:int} ${2:Name} { get; set; }', 'property'),
    S('gameloop', 'while (Engine.Running())\n{\n\t// update\n\t${1}\n\n\t// draw\n\tEngine.Clear(Color.Dark);\n\t${0}\n\tEngine.Present();\n}', 'game loop'),
    S('list', 'var ${1:items} = new List<${2:int}> { ${3} };', 'list'),
  ],
};

const JAVA_LANG: LangData = {
  keywords: ['abstract', 'boolean', 'break', 'case', 'catch', 'class', 'continue', 'default', 'do', 'else', 'extends', 'final', 'finally', 'for', 'if', 'implements', 'import', 'instanceof', 'interface', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'static', 'super', 'switch', 'this', 'throw', 'try', 'void', 'while'],
  types: ['int', 'long', 'double', 'float', 'char', 'String', 'ArrayList', 'HashMap', 'List', 'Scanner', 'Math'],
  functions: [F('System.out.println', 'System.out.println(${1});', 'print a line'), F('System.out.print', 'System.out.print(${1});', 'print without newline')],
  snippets: [
    S('main', 'public static void main(String[] args) {\n\t${0}\n}', 'main method'),
    S('program', 'public class Main {\n\tpublic static void main(String[] args) {\n\t\t${0}\n\t}\n}', 'full program'),
    S('for', 'for (int ${1:i} = 0; ${1:i} < ${2:n}; ${1:i}++) {\n\t${0}\n}', 'for loop'),
    S('foreach', 'for (${1:String} ${2:item} : ${3:items}) {\n\t${0}\n}', 'for-each loop'),
  ],
};

const GO_LANG: LangData = {
  keywords: ['break', 'case', 'chan', 'const', 'continue', 'default', 'defer', 'else', 'for', 'func', 'go', 'if', 'import', 'interface', 'map', 'package', 'range', 'return', 'select', 'struct', 'switch', 'type', 'var'],
  types: ['int', 'int64', 'float64', 'string', 'bool', 'byte', 'rune', 'error'],
  functions: [F('fmt.Println', 'fmt.Println(${1})', 'print a line'), F('fmt.Printf', 'fmt.Printf("${1:%d}\\n", ${2})', 'print formatted'), F('len', 'len(${1})', 'length'), F('append', 'append(${1:s}, ${2})', 'append to a slice'), F('make', 'make(${1:[]int}, ${2:0})', 'create slice/map')],
  snippets: [
    S('main', 'package main\n\nimport "fmt"\n\nfunc main() {\n\t${0}\n}', 'full program'),
    S('for', 'for ${1:i} := 0; ${1:i} < ${2:n}; ${1:i}++ {\n\t${0}\n}', 'for loop'),
    S('forr', 'for ${1:i}, ${2:v} := range ${3:items} {\n\t${0}\n}', 'range loop'),
    S('func', 'func ${1:name}(${2}) ${3:int} {\n\t${0}\n}', 'function'),
  ],
};

const RUST_LANG: LangData = {
  keywords: ['as', 'break', 'const', 'continue', 'else', 'enum', 'false', 'fn', 'for', 'if', 'impl', 'in', 'let', 'loop', 'match', 'mod', 'mut', 'pub', 'return', 'self', 'struct', 'trait', 'true', 'use', 'where', 'while'],
  types: ['i32', 'i64', 'u32', 'u64', 'f64', 'bool', 'char', 'String', 'Vec', 'Option', 'Result', 'usize'],
  functions: [F('println!', 'println!("${1:{}}", ${2});', 'print a line'), F('vec!', 'vec![${1}]', 'make a vector'), F('format!', 'format!("${1:{}}", ${2})', 'format to a String')],
  snippets: [
    S('main', 'fn main() {\n\t${0}\n}', 'main function'),
    S('for', 'for ${1:i} in ${2:0..10} {\n\t${0}\n}', 'for loop'),
    S('fn', 'fn ${1:name}(${2}) -> ${3:i32} {\n\t${0}\n}', 'function'),
  ],
};

const SQL_KEYWORDS = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL', 'ORDER BY', 'GROUP BY', 'HAVING', 'LIMIT', 'OFFSET', 'DISTINCT', 'AS', 'JOIN', 'INNER JOIN', 'LEFT JOIN', 'ON', 'ASC', 'DESC', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'UNION'];
const SQL_FUNCS: Entry[] = [
  F('COUNT', 'COUNT(${1:*})', 'number of rows'),
  F('SUM', 'SUM(${1:column})', 'total'),
  F('AVG', 'AVG(${1:column})', 'average'),
  F('MIN', 'MIN(${1:column})', 'smallest'),
  F('MAX', 'MAX(${1:column})', 'largest'),
  F('ROUND', 'ROUND(${1:value}, ${2:1})', 'round to digits'),
  F('UPPER', 'UPPER(${1:column})', 'UPPERCASE'),
  F('LOWER', 'LOWER(${1:column})', 'lowercase'),
  F('LENGTH', 'LENGTH(${1:column})', 'text length'),
  F('COALESCE', 'COALESCE(${1:column}, ${2:default})', 'first non-NULL value'),
];

// Data science helpers (NumPy, pandas, matplotlib, scikit-learn): shown alongside the normal Python completions.
PY.snippets = [
  ...(PY.snippets ?? []),
  S('import numpy', 'import numpy as np', 'NumPy: fast arrays and maths'),
  S('import pandas', 'import pandas as pd', 'pandas: tables of data (DataFrame)'),
  S('import matplotlib', 'import matplotlib.pyplot as plt', 'matplotlib: draw charts'),
  S('from sklearn.model_selection import train_test_split', 'from sklearn.model_selection import train_test_split', 'split data into train and test sets'),
  S('from sklearn.linear_model import LinearRegression', 'from sklearn.linear_model import LinearRegression', 'straight-line model'),
  S('from sklearn.linear_model import LogisticRegression', 'from sklearn.linear_model import LogisticRegression', 'classification model'),
  S('from sklearn.neighbors import KNeighborsClassifier', 'from sklearn.neighbors import KNeighborsClassifier', 'k-nearest neighbours'),
  S('from sklearn.tree import DecisionTreeClassifier', 'from sklearn.tree import DecisionTreeClassifier', 'decision tree'),
  S('from sklearn.ensemble import RandomForestClassifier', 'from sklearn.ensemble import RandomForestClassifier', 'forest of trees'),
  S('from sklearn.cluster import KMeans', 'from sklearn.cluster import KMeans', 'find groups in data'),
  S('from sklearn.metrics import accuracy_score', 'from sklearn.metrics import accuracy_score', 'share of correct predictions'),
  S('train/test split', 'X_train, X_test, y_train, y_test = train_test_split(${1:X}, ${2:y}, test_size=${3:0.2}, random_state=${4:42})', 'split data'),
  S('fit and predict', 'model = ${1:LinearRegression}()\nmodel.fit(${2:X_train}, ${3:y_train})\npredictions = model.predict(${4:X_test})', 'train a model'),
  S('plot', 'plt.plot(${1:x}, ${2:y})\nplt.xlabel("${3:x}")\nplt.ylabel("${4:y}")\nplt.title("${5:title}")\nplt.show()', 'line chart'),
  S('scatter', 'plt.scatter(${1:x}, ${2:y})\nplt.show()', 'scatter chart'),
];
PY.methods = [
  ...(PY.methods ?? []),
  Me('head', 'head(${1:5})', 'DataFrame: first rows'),
  Me('describe', 'describe()', 'DataFrame: summary statistics'),
  Me('info', 'info()', 'DataFrame: columns and types'),
  Me('groupby', 'groupby(${1:"column"})', 'DataFrame: group rows'),
  Me('value_counts', 'value_counts()', 'Series: count each value'),
  Me('mean', 'mean()', 'average (NumPy / pandas)'),
  Me('std', 'std()', 'standard deviation'),
  Me('dropna', 'dropna()', 'DataFrame: remove rows with missing values'),
  Me('fillna', 'fillna(${1:0})', 'DataFrame: fill missing values'),
  Me('reshape', 'reshape(${1:-1}, ${2:1})', 'NumPy: change the shape'),
  Me('fit', 'fit(${1:X}, ${2:y})', 'scikit-learn: train the model'),
  Me('predict', 'predict(${1:X})', 'scikit-learn: make predictions'),
  Me('score', 'score(${1:X}, ${2:y})', 'scikit-learn: how good is the model'),
  Me('plot', 'plot(${1:x}, ${2:y})', 'matplotlib: line chart'),
  Me('show', 'show()', 'matplotlib: show the chart'),
  Me('append', 'append(${1})', 'list: add an item at the end'),
  Me('items', 'items()', 'dict: (key, value) pairs'),
  Me('keys', 'keys()', 'dict: all keys'),
  Me('values', 'values()', 'dict: all values'),
  Me('split', 'split(${1})', 'str: cut into a list'),
  Me('join', 'join(${1})', 'str: glue a list together'),
  Me('format', 'format(${1})', 'str: fill in {} placeholders'),
];

export function registerIntellisense(monaco: M) {
  const K = monaco.languages.CompletionItemKind;
  const kindOf: Record<NonNullable<Entry['kind']>, Monaco.languages.CompletionItemKind> = {
    keyword: K.Keyword, function: K.Function, snippet: K.Snippet, type: K.Class, method: K.Method, class: K.Class, field: K.Field, module: K.Module,
  };

  function toItem(e: Entry, range: Monaco.IRange, sort: string): Monaco.languages.CompletionItem {
    const insert = e.insert ?? e.label;
    return {
      label: e.label,
      kind: kindOf[e.kind ?? 'keyword'],
      insertText: insert,
      insertTextRules: insert.includes('$') ? monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet : undefined,
      detail: e.detail,
      documentation: e.doc,
      range,
      sortText: sort + e.label,
    };
  }

  function provide(language: string, data: LangData) {
    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: ['.', ...(data.triggerCharacters ?? [])],
      provideCompletionItems(model, position) {
        const word = model.getWordUntilPosition(position);
        const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
        const before = model.getLineContent(position.lineNumber).slice(0, word.startColumn - 1);
        const afterDot = /\.\s*$/.test(before);
        if (afterDot) {
          return { suggestions: (data.methods ?? []).map((e) => toItem(e, range, '0')) };
        }
        const out: Monaco.languages.CompletionItem[] = [];
        (data.snippets ?? []).forEach((e) => out.push(toItem(e, range, '1')));
        (data.functions ?? []).forEach((e) => out.push(toItem(e, range, '2')));
        (data.types ?? []).forEach((t) => out.push(toItem({ label: t, kind: 'type' }, range, '3')));
        (data.keywords ?? []).forEach((k) => out.push(toItem({ label: k, kind: 'keyword' }, range, '4')));
        return { suggestions: out };
      },
    });
  }

  provide('python', PY);
  provide('c', C_LANG);
  provide('cpp', CPP_LANG);
  provide('csharp', CS_LANG);
  provide('java', JAVA_LANG);
  provide('go', GO_LANG);
  provide('rust', RUST_LANG);

  // SQL: keywords, functions and the real table/column names of the sample database.
  monaco.languages.registerCompletionItemProvider('sql', {
    triggerCharacters: ['.', ' '],
    provideCompletionItems(model, position) {
      const word = model.getWordUntilPosition(position);
      const range = { startLineNumber: position.lineNumber, endLineNumber: position.lineNumber, startColumn: word.startColumn, endColumn: word.endColumn };
      const before = model.getLineContent(position.lineNumber).slice(0, word.startColumn - 1);
      const dot = /([A-Za-z_][\w]*)\.\s*$/.exec(before);
      const suggestions: Monaco.languages.CompletionItem[] = [];
      if (dot) {
        const table = Object.keys(SQL_SCHEMA).find((t) => t.toLowerCase() === dot[1].toLowerCase());
        if (table) SQL_SCHEMA[table].forEach((c) => suggestions.push(toItem({ label: c, kind: 'field', detail: `column of ${table}` }, range, '0')));
        return { suggestions };
      }
      Object.keys(SQL_SCHEMA).forEach((t) => suggestions.push(toItem({ label: t, kind: 'class', detail: `table (${SQL_SCHEMA[t].join(', ')})` }, range, '1')));
      const cols = new Set<string>();
      Object.entries(SQL_SCHEMA).forEach(([t, list]) => list.forEach((c) => cols.has(c) || (cols.add(c), suggestions.push(toItem({ label: c, kind: 'field', detail: `column (${t}...)` }, range, '2')))));
      SQL_FUNCS.forEach((e) => suggestions.push(toItem(e, range, '3')));
      SQL_KEYWORDS.forEach((k) => suggestions.push(toItem({ label: k, kind: 'keyword' }, range, '4')));
      suggestions.push(toItem(S('select *', 'SELECT *\nFROM ${1:students}\nWHERE ${2:1 = 1};', 'basic query'), range, '0'));
      return { suggestions };
    },
  });
}
