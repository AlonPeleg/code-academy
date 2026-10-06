/**
 * The Python side of the mini game engine. It is installed into the Pyodide worker as the module `game`,
 * so learners can write:  import game
 * The JavaScript side (canvas drawing, keyboard, timing) is the `_game_js` module registered by python.worker.ts.
 */
export const GAME_SHIM = `
import traceback as _tb
import _game_js as _js

WIDTH = 320
HEIGHT = 240

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GRAY = (130, 130, 150)
DARK = (22, 24, 44)
RED = (239, 68, 68)
ORANGE = (249, 115, 22)
YELLOW = (250, 204, 21)
GREEN = (34, 197, 94)
CYAN = (34, 211, 238)
BLUE = (59, 130, 246)
PURPLE = (168, 85, 247)
PINK = (244, 114, 182)


def _rgb(color):
    try:
        r, g, b = color
    except Exception:
        raise TypeError("a color must be three numbers like (255, 0, 0), but got " + repr(color))
    return int(r), int(g), int(b)


def clear(color=BLACK):
    """Fill the whole screen with one color."""
    r, g, b = _rgb(color)
    _js.clear(r, g, b)


def rect(x, y, w, h, color=WHITE):
    """Draw a filled rectangle. (x, y) is its top-left corner."""
    r, g, b = _rgb(color)
    _js.rect(x, y, w, h, r, g, b)


def circle(x, y, radius, color=WHITE):
    """Draw a filled circle. (x, y) is its center."""
    r, g, b = _rgb(color)
    _js.circle(x, y, radius, r, g, b)


def line(x1, y1, x2, y2, color=WHITE, width=1):
    """Draw a line between two points."""
    r, g, b = _rgb(color)
    _js.line(x1, y1, x2, y2, width, r, g, b)


def text(x, y, message, color=WHITE, size=16):
    """Draw text. (x, y) is the top-left corner."""
    r, g, b = _rgb(color)
    _js.text(x, y, str(message), size, r, g, b)


def key_down(name):
    """True for every frame while the key is held. Names: left right up down space a d w s z x enter"""
    return bool(_js.key_down(str(name).lower()))


def key_pressed(name):
    """True only on the single frame when the key goes down."""
    return bool(_js.key_pressed(str(name).lower()))


def mouse_pos():
    """The mouse position as (x, y) inside the game screen."""
    return (_js.mouse_x(), _js.mouse_y())


def mouse_down():
    """True while the mouse button is held."""
    return bool(_js.mouse_down())


def mouse_pressed():
    """True only on the frame the mouse button goes down."""
    return bool(_js.mouse_pressed())


def time():
    """Seconds since the game started."""
    return _js.time()


def stop():
    """Stop the game."""
    _js.stop()


_update = None
_draw = None


def _call(fn, dt):
    if fn is None:
        return
    try:
        argc = fn.__code__.co_argcount
    except AttributeError:
        argc = 1
    if argc >= 1:
        fn(dt)
    else:
        fn()


def run(update=None, draw=None):
    """Start the game loop. update(dt) runs every frame (dt = seconds since the last frame); draw() runs after it."""
    global _update, _draw
    _update = update
    _draw = draw
    _js.register(_frame)


def _frame(dt):
    try:
        _call(_update, dt)
        if _draw is not None:
            _draw()
    except BaseException:
        _js.error(_tb.format_exc())
`;
