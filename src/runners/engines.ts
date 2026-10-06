/**
 * The "replay edition" of the mini game engine for compiled languages.
 *
 * Compiled programs run on a server and cannot receive live keypresses. So the engine works like a screen recorder:
 *   - your program runs the whole game loop and prints a drawing command for every shape it draws,
 *   - the keys the "player" presses come from a small script in the Input tab (e.g. "10 right down"),
 *   - the browser then plays the recorded frames back on a canvas.
 *
 * Command protocol (one per line on stdout, everything else is normal console output):
 *   @F                         start of a frame
 *   @C r g b                   clear the screen
 *   @R x y w h r g b           filled rectangle
 *   @O x y radius r g b        filled circle
 *   @L x1 y1 x2 y2 r g b       line
 *   @T x y size r g b text...  text
 *   @P                         end of frame
 */

/** One header that works for both C and C++ ( #include "engine.h" ). */
export const ENGINE_H = `/* engine.h - Code Academy mini game engine (replay edition) */
#ifndef CODE_ACADEMY_ENGINE_H
#define CODE_ACADEMY_ENGINE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define SCREEN_W 320
#define SCREEN_H 240

enum { KEY_LEFT = 0, KEY_RIGHT, KEY_UP, KEY_DOWN, KEY_SPACE, KEY_A, KEY_D, KEY_W, KEY_S, KEY_Z, KEY_X, KEY_ENTER, KEY_COUNT };

/* Colors: write them where a color (three numbers) is expected, e.g.  engine_rect(10, 10, 20, 20, RGB_RED); */
#define RGB_BLACK 0, 0, 0
#define RGB_WHITE 255, 255, 255
#define RGB_GRAY 130, 130, 150
#define RGB_DARK 22, 24, 44
#define RGB_RED 239, 68, 68
#define RGB_ORANGE 249, 115, 22
#define RGB_YELLOW 250, 204, 21
#define RGB_GREEN 34, 197, 94
#define RGB_CYAN 34, 211, 238
#define RGB_BLUE 59, 130, 246
#define RGB_PURPLE 168, 85, 247
#define RGB_PINK 244, 114, 182

typedef struct { int frame; int key; int down; } engine_event_t;

static engine_event_t engine_events_[1024];
static int engine_event_count_ = 0;
static int engine_input_loaded_ = 0;
static int engine_frame_no_ = -1;
static int engine_max_frames_ = 180;
static int engine_down_[KEY_COUNT];
static int engine_pressed_[KEY_COUNT];

static inline int engine_key_index_(const char *name) {
    static const char *names[] = {"left", "right", "up", "down", "space", "a", "d", "w", "s", "z", "x", "enter"};
    int i;
    for (i = 0; i < KEY_COUNT; i++) {
        if (strcmp(names[i], name) == 0) return i;
    }
    return -1;
}

static inline void engine_load_input_(void) {
    char line[160];
    engine_input_loaded_ = 1;
    while (engine_event_count_ < 1024 && fgets(line, sizeof line, stdin)) {
        int frame;
        char name[32], action[16];
        int key;
        if (line[0] == '#') continue;
        if (sscanf(line, "%d %31s %15s", &frame, name, action) != 3) continue;
        key = engine_key_index_(name);
        if (key < 0) continue;
        engine_events_[engine_event_count_].frame = frame;
        engine_events_[engine_event_count_].key = key;
        engine_events_[engine_event_count_].down = (strcmp(action, "down") == 0);
        engine_event_count_++;
    }
}

/* How many frames to record (default 180 = 6 seconds at 30 frames per second, max 600). */
static inline void engine_frames(int n) {
    if (n < 1) n = 1;
    if (n > 600) n = 600;
    engine_max_frames_ = n;
}

/* The number of the current frame, starting at 0. */
static inline int engine_frame(void) { return engine_frame_no_; }

/* Call this as the condition of your game loop:  while (engine_running()) { ... } */
static inline int engine_running(void) {
    int i, e;
    if (!engine_input_loaded_) engine_load_input_();
    if (engine_frame_no_ + 1 >= engine_max_frames_) return 0;
    engine_frame_no_++;
    for (i = 0; i < KEY_COUNT; i++) engine_pressed_[i] = 0;
    for (e = 0; e < engine_event_count_; e++) {
        if (engine_events_[e].frame == engine_frame_no_) {
            int k = engine_events_[e].key;
            if (engine_events_[e].down) {
                if (!engine_down_[k]) engine_pressed_[k] = 1;
                engine_down_[k] = 1;
            } else {
                engine_down_[k] = 0;
            }
        }
    }
    printf("@F\\n");
    return 1;
}

/* 1 while the key is held down */
static inline int key_down(int key) { return key >= 0 && key < KEY_COUNT && engine_down_[key]; }
/* 1 only on the frame when the key goes down */
static inline int key_pressed(int key) { return key >= 0 && key < KEY_COUNT && engine_pressed_[key]; }

static inline void engine_clear(int r, int g, int b) { printf("@C %d %d %d\\n", r, g, b); }
static inline void engine_rect(int x, int y, int w, int h, int r, int g, int b) { printf("@R %d %d %d %d %d %d %d\\n", x, y, w, h, r, g, b); }
static inline void engine_circle(int x, int y, int radius, int r, int g, int b) { printf("@O %d %d %d %d %d %d\\n", x, y, radius, r, g, b); }
static inline void engine_line(int x1, int y1, int x2, int y2, int r, int g, int b) { printf("@L %d %d %d %d %d %d %d\\n", x1, y1, x2, y2, r, g, b); }
static inline void engine_text(int x, int y, int size, int r, int g, int b, const char *s) {
    printf("@T %d %d %d %d %d %d ", x, y, size, r, g, b);
    for (; *s; s++) putchar(*s == '\\n' ? ' ' : *s);
    putchar('\\n');
}
/* Call once at the end of every frame */
static inline void engine_present(void) { printf("@P\\n"); }

#endif
`;

/** Appended after the learner's C# code (so it uses fully-qualified names; no "using" lines allowed here). */
export const ENGINE_CS = `public enum Key { Left = 0, Right, Up, Down, Space, A, D, W, S, Z, X, Enter }

public struct Color
{
    public int R, G, B;
    public Color(int r, int g, int b) { R = r; G = g; B = b; }
    public static readonly Color Black = new Color(0, 0, 0);
    public static readonly Color White = new Color(255, 255, 255);
    public static readonly Color Gray = new Color(130, 130, 150);
    public static readonly Color Dark = new Color(22, 24, 44);
    public static readonly Color Red = new Color(239, 68, 68);
    public static readonly Color Orange = new Color(249, 115, 22);
    public static readonly Color Yellow = new Color(250, 204, 21);
    public static readonly Color Green = new Color(34, 197, 94);
    public static readonly Color Cyan = new Color(34, 211, 238);
    public static readonly Color Blue = new Color(59, 130, 246);
    public static readonly Color Purple = new Color(168, 85, 247);
    public static readonly Color Pink = new Color(244, 114, 182);
}

public static class Engine
{
    public const int Width = 320;
    public const int Height = 240;

    static int frame = -1;
    static int maxFrames = 180;
    static bool loaded = false;
    static readonly bool[] down = new bool[12];
    static readonly bool[] pressed = new bool[12];
    static readonly System.Collections.Generic.List<int[]> events = new System.Collections.Generic.List<int[]>();

    static int KeyIndex(string name)
    {
        string[] names = { "left", "right", "up", "down", "space", "a", "d", "w", "s", "z", "x", "enter" };
        for (int i = 0; i < names.Length; i++)
        {
            if (names[i] == name) return i;
        }
        return -1;
    }

    static void Load()
    {
        loaded = true;
        string line;
        while ((line = System.Console.In.ReadLine()) != null)
        {
            line = line.Trim();
            if (line.Length == 0 || line[0] == '#') continue;
            string[] parts = line.Split(new char[] { ' ', '\\t' }, System.StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length < 3) continue;
            int f;
            if (!int.TryParse(parts[0], out f)) continue;
            int k = KeyIndex(parts[1]);
            if (k < 0) continue;
            events.Add(new int[] { f, k, parts[2] == "down" ? 1 : 0 });
        }
    }

    /// <summary>How many frames to record (default 180 = 6 seconds at 30 frames per second, max 600).</summary>
    public static void Frames(int n)
    {
        if (n < 1) n = 1;
        if (n > 600) n = 600;
        maxFrames = n;
    }

    /// <summary>The number of the current frame, starting at 0.</summary>
    public static int Frame { get { return frame; } }

    /// <summary>Use as the condition of your game loop:  while (Engine.Running()) { ... }</summary>
    public static bool Running()
    {
        if (!loaded) Load();
        if (frame + 1 >= maxFrames) return false;
        frame++;
        for (int i = 0; i < pressed.Length; i++) pressed[i] = false;
        foreach (int[] ev in events)
        {
            if (ev[0] != frame) continue;
            if (ev[2] == 1)
            {
                if (!down[ev[1]]) pressed[ev[1]] = true;
                down[ev[1]] = true;
            }
            else
            {
                down[ev[1]] = false;
            }
        }
        System.Console.WriteLine("@F");
        return true;
    }

    /// <summary>True while the key is held down.</summary>
    public static bool KeyDown(Key key) { return down[(int)key]; }
    /// <summary>True only on the frame when the key goes down.</summary>
    public static bool KeyPressed(Key key) { return pressed[(int)key]; }

    public static void Clear(int r, int g, int b) { System.Console.WriteLine("@C " + r + " " + g + " " + b); }
    public static void Clear(Color c) { Clear(c.R, c.G, c.B); }

    public static void Rect(int x, int y, int w, int h, int r, int g, int b) { System.Console.WriteLine("@R " + x + " " + y + " " + w + " " + h + " " + r + " " + g + " " + b); }
    public static void Rect(int x, int y, int w, int h, Color c) { Rect(x, y, w, h, c.R, c.G, c.B); }

    public static void Circle(int x, int y, int radius, int r, int g, int b) { System.Console.WriteLine("@O " + x + " " + y + " " + radius + " " + r + " " + g + " " + b); }
    public static void Circle(int x, int y, int radius, Color c) { Circle(x, y, radius, c.R, c.G, c.B); }

    public static void Line(int x1, int y1, int x2, int y2, int r, int g, int b) { System.Console.WriteLine("@L " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + r + " " + g + " " + b); }
    public static void Line(int x1, int y1, int x2, int y2, Color c) { Line(x1, y1, x2, y2, c.R, c.G, c.B); }

    public static void Text(int x, int y, int size, int r, int g, int b, string s)
    {
        System.Console.WriteLine("@T " + x + " " + y + " " + size + " " + r + " " + g + " " + b + " " + s.Replace("\\n", " "));
    }
    public static void Text(int x, int y, int size, Color c, string s) { Text(x, y, size, c.R, c.G, c.B, s); }

    /// <summary>Call once at the end of every frame.</summary>
    public static void Present() { System.Console.WriteLine("@P"); }
}
`;

/** Splice the engine into the learner's source so it compiles as a single file. */
export function mergeEngine(langKey: string, fileName: string, code: string): { code: string; missingInclude: boolean } {
  if (langKey === 'csharp') {
    return { code: code.replace(/\s*$/, '') + '\n\n#line 1 "Engine.cs"\n' + ENGINE_CS, missingInclude: false };
  }
  const re = /^[ \t]*#[ \t]*include[ \t]*"engine\.h(?:pp)?"[ \t]*\r?$/m;
  const m = re.exec(code);
  if (!m) return { code, missingInclude: true };
  const lineNo = code.slice(0, m.index).split('\n').length;
  const replacement = `#line 1 "engine.h"\n${ENGINE_H}\n#line ${lineNo + 1} "${fileName}"`;
  return { code: code.slice(0, m.index) + replacement + code.slice(m.index + m[0].length), missingInclude: false };
}

/** Pull drawing commands out of the program's output; everything else stays normal console output. */
export function parseReplay(lines: { level: string; text: string }[]) {
  const frames: { cmds: (string | number)[][] }[] = [];
  const rest: typeof lines = [];
  let current: { cmds: (string | number)[][] } | null = null;
  const MAX_FRAMES = 600;
  const MAX_CMDS = 3000;

  for (const l of lines) {
    if (l.level !== 'stdout' || l.text.charCodeAt(0) !== 64 /* @ */) {
      rest.push(l);
      continue;
    }
    const tag = l.text.charAt(1);
    if (tag === 'F') {
      if (frames.length < MAX_FRAMES) {
        current = { cmds: [] };
        frames.push(current);
      }
      continue;
    }
    if (tag === 'P') continue;
    if (!'CROLT'.includes(tag)) {
      rest.push(l);
      continue;
    }
    if (!current) {
      current = { cmds: [] };
      frames.push(current);
    }
    if (current.cmds.length >= MAX_CMDS) continue;
    if (tag === 'T') {
      const parts = l.text.split(' ');
      const nums = parts.slice(1, 7).map(Number);
      current.cmds.push(['T', ...nums, parts.slice(7).join(' ')]);
    } else {
      current.cmds.push([tag, ...l.text.split(' ').slice(1).map(Number)]);
    }
  }
  return { frames, rest };
}
