---
title: "מנהלי הקשר והפקודה with"
summary: "מבטיחים שההכנה והניקוי תמיד יתבצעו, על ידי כתיבת בלוקי with משלכם."
hints:
  - "בלוק with קורא בשבילכם לשתי מתודות מיוחדות: אחת כשהוא מתחיל ואחת כשהוא מסתיים, גם אם קרתה שגיאה בפנים. גנרטור עם yield יחיד יכול למלא את שני התפקידים."
  - "במחלקה כתבו __enter__(self) ו-__exit__(self, exc_type, exc, tb). החזרת True מ-__exit__ בולעת את השגיאה. עבור tag, הדפיסו את התגית הפותחת, ואז try: yield, finally: הדפיסו את התגית הסוגרת. בשלב 3 השתמשו ב-with contextlib.suppress(ZeroDivisionError): מעל החילוק."
  - "def __enter__(self): print('open', self.name); return self   def __exit__(self, exc_type, exc, tb): print('close', self.name); if exc_type is ValueError: print('handled:', exc); return True; return False   @contextlib.contextmanager def tag(name): print('<' + name + '>'); try: yield; finally: print('</' + name + '>')"
quiz:
  - q: "מהי ההבטחה העיקרית של הפקודה with?"
    options: ["קוד הניקוי רץ כשהבלוק מסתיים, גם אם קרתה שגיאה בפנים", "הבלוק רץ מהר יותר מקוד רגיל", "שגיאות בתוך הבלוק תמיד מוסתרות"]
  - q: "מאיפה מגיע הערך שאחרי as ב-with Resource('db') as r ?"
    options: ["מערך ההחזרה של __exit__", "מערך ההחזרה של __enter__", "מהארגומנט שניתן ל-Resource"]
  - q: "מה קורה כש-__exit__ מחזירה True?"
    options: ["בלוק ה-with רץ פעם שנייה", "התוכנית נעצרת", "החריגה שנזרקה בתוך הבלוק נבלעת"]
    explain: "החזרת False או None מאפשרת לחריגה להמשיך כלפי מעלה, וזה מה שרוצים ברוב המקרים."
  - q: "למה מנהל הקשר מבוסס גנרטור שם את ה-yield בתוך try/finally?"
    options: ["כדי שהקוד שאחרי ה-yield ירוץ גם כשהבלוק זורק שגיאה", "כי yield עובד רק בתוך try", "כדי שהגנרטור יהיה מהיר יותר"]
messages:
  - "הגדירו מתודת __enter__."
  - "הגדירו מתודת __exit__."
  - "קשטו את tag עם @contextlib.contextmanager."
  - "ל-tag צריך yield במקום שבו בלוק ה-with רץ."
  - "השתמשו ב-try/finally סביב ה-yield כדי שהתגית הסוגרת תודפס תמיד."
  - "השתמשו ב-contextlib.suppress(ZeroDivisionError) סביב החילוק."
---

אתם כבר מכירים מנהל הקשר (context manager) אחד: התבנית `with open(...) as file:` מהטיפול בקבצים. בשיעור הזה תלמדו מה באמת קורה מאחורי ה-`with`, ואיך לכתוב מנהלי הקשר משלכם. זה חשוב בכל פעם שצריך לבטל משהו אחרי שמשתמשים בו: קבצים, חיבורי מסד נתונים, נעילות, הגדרות זמניות, שעונים.

## הבעיה בניקוי ידני

דמיינו משאב שחייבים לסגור אחרי השימוש:

```python
resource = open_something()
use(resource)          # what if this line raises an error?
resource.close()       # never reached!
```

אפשר לעטוף הכול ב-`try/finally`, אבל תחזרו על התבנית הזו שוב ושוב. הפקודה `with` אורזת אותה:

```python
with open_something() as resource:
    use(resource)
# resource is closed here, no matter what happened above
```

## הפרוטוקול: __enter__ ו-__exit__

אובייקט עובד בפקודת `with` כשיש לו שתי מתודות מיוחדות:

- `__enter__(self)` רצה כשהבלוק מתחיל. מה שהיא מחזירה הוא מה ש-`as name` מקבל (לעיתים קרובות `self`).
- `__exit__(self, exc_type, exc, tb)` רצה כשהבלוק מסתיים, באופן רגיל או בגלל שגיאה. אם לא הייתה שגיאה, שלושת הארגומנטים הנוספים הם `None`. אחרת הם מכילים את מחלקת החריגה, את אובייקט החריגה ואת ה-traceback.

```python
class Timer:
    def __enter__(self):
        print("start")
        return self

    def __exit__(self, exc_type, exc, tb):
        print("stop")
        return False        # do not swallow errors

with Timer():
    print("working")
# prints: start, working, stop
```

ערך ההחזרה של `__exit__` מכריע לגבי השגיאה: `True` אומר "טיפלתי בה, המשיכו אחרי הבלוק", ו-`False` או `None` אומרים "תנו לה להמשיך". בליעת שגיאות בשקט מסוכנת, ולכן עשו זאת רק עבור סוג חריגה מסוים, כמו בתרגיל.

## הקיצור: contextlib.contextmanager

כתיבת מחלקה מסורבלת כשרוצים רק "עשו את זה לפני, ועשו את ההוא אחרי". הדקורטור `@contextlib.contextmanager` הופך גנרטור עם `yield` **אחד** למנהל הקשר. הקוד שלפני ה-`yield` הוא ההכנה, והקוד שאחריו הוא הניקוי:

```python
import contextlib

@contextlib.contextmanager
def announce(title):
    print("begin", title)
    try:
        yield               # the with-block runs here
    finally:
        print("end", title)

with announce("demo"):
    print("body")
# prints: begin demo, body, end demo
```

אם הבלוק זורק שגיאה, החריגה נזרקת מחדש **בשורת ה-yield**. לכן הניקוי שייך ל-`finally`: בלעדיו הקוד שאחרי `yield` היה מדולג כשיש שגיאות. אפשר גם לכתוב `yield value` כדי שהבלוק יקבל משהו דרך `as`.

## עזרים מוכנים

ל-`contextlib` יש כלים שימושיים: `contextlib.suppress(SomeError)` מתעלם משגיאה זו בתוך הבלוק, ו-`contextlib.redirect_stdout(stream)` מפנה זמנית את הפלט של `print` לזרם כמו `io.StringIO`.

```python
with contextlib.suppress(KeyError):
    del settings["theme"]      # no crash if the key is missing
```

אפשר גם לפתוח כמה בפקודה אחת: `with A() as a, B() as b:`. הם יוצאים בסדר הפוך, כמו קופסאות מוערמות.

> **שימו לב:**
> - אם שוכחים `return self` ב-`__enter__`, אז `as r` נותן `None`, ואז `r.name` נכשל עם `AttributeError: 'NoneType' object has no attribute 'name'`.
> - מחלקה שחסרה בה אחת משתי המתודות נכשלת עם `AttributeError: __enter__` (או `__exit__`).
> - גנרטור של `@contextmanager` עם שתי פקודות `yield` נכשל עם `RuntimeError: generator didn't stop`.
> - הנחת הניקוי אחרי `yield` בלי `try/finally`: הוא פשוט לא רץ כשהבלוק זורק שגיאה.
> - `__exit__` חייבת לקבל שלושה ארגומנטים נוספים, אחרת מקבלים `TypeError` על ארגומנטים חסרים.

## להמשיך הלאה

כתבו מנהל הקשר `timer` שמודד בלוק עם `time.perf_counter()` ושומר את התוצאה על האובייקט (אל תדפיסו זמנים גולמיים בשיעור, הם משתנים בכל הרצה). או כתבו עזרים בסגנון `cd(path)` שמשנים הגדרה ותמיד מחזירים את הערך הישן ב-`finally`.

> **תורכם:** השלימו את `Resource` עם `__enter__` ו-`__exit__` (שבולעת רק `ValueError`), כתבו את `tag` עם `@contextlib.contextmanager` ו-`try/finally`, ועטפו את החילוק ב-`contextlib.suppress(ZeroDivisionError)` כדי שהתוכנית תדפיס `done`.
