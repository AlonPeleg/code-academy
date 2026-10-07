---
title: "Python: ‏unittest ו-tracebacks"
summary: "קוראים traceback של Python, עושים debug עם print ועם המודול traceback, וכותבים בדיקות עם המודול המובנה unittest."
hints:
  - "traceback הוא רשימה של frames, אחד לכל פונקציה שרצה. traceback.extract_tb(error.__traceback__) מחזירה את הרשימה הזאת, ולכל frame יש תכונה .name (שם הפונקציה)."
  - "ב-where_it_failed: try: func(*args) / except Exception as error: בנו רשימה עם list comprehension על traceback.extract_tb(error.__traceback__). ב-parse_price, float() לא יודעת לקרוא פסיק, ולכן הסירו אותו קודם עם replace שני. הבדיקה החדשה היא מתודה נוספת במחלקה שמתחילה ב-test_."
  - "except Exception as error:  names = [frame.name for frame in traceback.extract_tb(error.__traceback__)]  return type(error).__name__ + \": \" + \" > \".join(names)      return float(text.replace(\"$\", \"\").replace(\",\", \"\"))      def test_total_adds_prices(self): self.assertEqual(total([\"$5\", \"$1,299.50\"]), 1304.5)"
messages:
  - "השתמשו ב-traceback.extract_tb(error.__traceback__) כדי לקבל את רשימת ה-frames."
  - "השתמשו ב-try / except ב-where_it_failed."
  - "הוסיפו מתודת בדיקה בשם test_total_adds_prices."
  - "הסירו את מפריד האלפים עם replace(\",\", \"\")."
quiz:
  - q: "ב-traceback של Python, איפה נמצאת הודעת השגיאה עצמה?"
    options: ["בשורה הראשונה", "בשורה האחרונה", "באמצע"]
    explain: "Python מדפיסה קודם 'Traceback (most recent call last)', אחר כך את הקריאות מהישנה ביותר לחדשה ביותר, ואת סוג השגיאה וההודעה בסוף."
  - q: "איך unittest מוצאת את הבדיקות בתוך מחלקת TestCase?"
    options: ["היא מריצה כל מתודה במחלקה", "היא מריצה רק את המתודה שנקראת main", "היא מריצה את המתודות ששמותיהן מתחילים ב-test"]
  - q: "מה ההבדל בין failure ל-error ב-unittest?"
    options: ["failure הוא טענה שלא הייתה נכונה, ו-error הוא חריגה (exception) בלתי צפויה בקוד או בבדיקה", "הם אותו דבר", "error הוא אזהרה ו-failure הוא קריסה"]
  - q: "איזו טענה בודקת שקוד מעלה ValueError?"
    options: ["with self.assertRaises(ValueError): ...", "self.assertTrue(ValueError)", "self.assertEqual(ValueError, None)"]
---
ל-Python יש שני כלים מצוינים למציאת באגים ולמניעתם: **tracebacks**, שמסבירים בדיוק איך קרסה התוכנית, והמודול המובנה **`unittest`**, שמאפשר לכתוב בדיקות אוטומטיות בלי להתקין שום דבר. השיעור הזה מראה את שניהם. הרעיונות זהים לשיעורי ה-JavaScript: קוראים את השגיאה, מסתכלים פנימה עם הדפסות, ומגנים על הקוד עם בדיקות.

## קריאת traceback

כשתוכנית Python קורסת, רואים משהו כזה:

```text
Traceback (most recent call last):
  File "main.py", line 12, in <module>
    print(total(["$5", "$1,299.50"]))
  File "main.py", line 9, in total
    result += parse_price(text)
  File "main.py", line 4, in parse_price
    return float(text.replace("$", ""))
ValueError: could not convert string to float: '1,299.50'
```

קראו אותו **מלמטה למעלה**:

1. **השורה האחרונה** היא השגיאה: הסוג (`ValueError`) וההודעה (`could not convert string to float: '1,299.50'`).
2. **השורה שמעליה** (עם הקוד) היא המקום שבו זה קרה: שורה 4, בתוך `parse_price`.
3. כשעולים **למעלה** רואים מי קרא למי: ל-`parse_price` קראה `total`, ולה קראו מהרמה העליונה של הקובץ (`<module>`).

הקריאה הישנה ביותר נמצאת למעלה והחדשה ביותר למטה, ולכן כתוב "most recent call last". ההודעה כאן מספרת את כל הסיפור: הטקסט `1,299.50` מכיל פסיק, ו-`float()` לא יודעת לקרוא פסיקים.

סוגי שגיאות נפוצים: `NameError` (שם לא מוכר), `TypeError` (סוג שגוי, כמו `"a" + 1`), `ValueError` (סוג נכון, ערך שגוי), `IndexError` ו-`KeyError` (אינדקס רשימה או מפתח מילון חסרים), `AttributeError` (לאובייקט אין תכונה כזאת) ו-`ZeroDivisionError`.

## תופסים שגיאה ובודקים אותה

```python
import traceback

try:
    int("abc")
except ValueError as error:
    print(type(error).__name__)     # prints: ValueError
    print(error)                    # prints: invalid literal for int() with base 10: 'abc'
    frames = traceback.extract_tb(error.__traceback__)
    print([frame.name for frame in frames])   # prints: ['<module>']
```

`error.__traceback__` מחזיק את העקבות, ו-`traceback.extract_tb(...)` הופכת אותן לרשימה של frames. לכל frame יש `.name` (הפונקציה), `.lineno` (מספר השורה) ו-`.line` (הקוד). בטרמינל אמיתי `traceback.print_exc()` מדפיסה למסך את ה-traceback המלא הרגיל.

## Debug עם print

כמו ב-JavaScript, תייגו את מה שאתם מדפיסים, והדפיסו את ה**סוג** כשאתם לא בטוחים:

```python
price = "12"
print("price:", repr(price), type(price))   # prints: price: '12' <class 'str'>
```

`repr()` מציגה מרכאות סביב טקסט, כך שאפשר לראות רווחים ולהבדיל בין `"12"` ל-`12`. מחרוזות f עם `=` הן קיצור דרך מהיר: `print(f"{price=}")` מדפיסה `price='12'`. במחשב שלכם אפשר גם להקליד `breakpoint()` בקוד כדי לעצור ולבדוק את התוכנית ב-debugger.

## בדיקות עם unittest

`unittest` נמצא בספרייה הסטנדרטית. בדיקה היא **מתודה** בתוך מחלקה שיורשת מ-`unittest.TestCase`; שמות המתודות חייבים להתחיל ב-`test`:

```python
import unittest

def add(a, b):
    return a + b

class TestAdd(unittest.TestCase):
    def test_adds_numbers(self):
        self.assertEqual(add(2, 3), 5)

    def test_adds_negative(self):
        self.assertEqual(add(-1, -1), -2)
```

הטענות שתשתמשו בהן הכי הרבה:

| טענה | בודקת ש... |
| --- | --- |
| `assertEqual(a, b)` | `a == b` |
| `assertTrue(x)` / `assertFalse(x)` | `x` הוא truthy / falsy |
| `assertIn(item, container)` | `item` נמצא ברשימה, במחרוזת, במילון... |
| `assertAlmostEqual(a, b)` | מספרים עשרוניים שווים עד 7 ספרות אחרי הנקודה |
| `with self.assertRaises(ValueError):` | הבלוק מעלה את השגיאה הזאת |

במחשב שלכם מריצים בדיקות מהטרמינל עם `python -m unittest`. כאן אנחנו מריצים אותן מתוך התוכנית עצמה, כדי שנוכל להדפיס סיכום קצר משלנו במקום הדוח הארוך (שכולל זמנים):

```python
suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestAdd)
result = unittest.TextTestRunner(stream=io.StringIO(), verbosity=0).run(suite)
print("ran", result.testsRun, "failures", len(result.failures), "errors", len(result.errors))
```

**Failure** אומר שטענה לא הייתה נכונה. **Error** אומר שקרתה חריגה בלתי צפויה (באג בקוד או בבדיקה). `result.failures` ו-`result.errors` הן רשימות של זוגות `(test, details)`.

> **שימו לב:**
> * **שמות בדיקות שלא מתחילים ב-`test`.** `def check_add(self)` מתעלמת בשקט, ולכן `ran 0` יכול להיות רמז לכך שהבדיקות שלכם לא נמצאות.
> * **שוכחים `self`.** מתודות צריכות `self` כפרמטר הראשון, וקוראים לטענות כ-`self.assertEqual(...)`. אחרת: `TypeError: test_x() takes 0 positional arguments but 1 was given`.
> * **סדר ארגומנטים שגוי.** `assertEqual(actual, expected)` עובדת בשני הסדרים, אבל בלבול ביניהם הופך את הודעת הכישלון למבלבלת. שמרו על סדר אחד.
> * **משווים מספרים עשרוניים עם `assertEqual`.** `0.1 + 0.2` אינו `0.3`. השתמשו ב-`assertAlmostEqual`.
> * **קוראים את ה-traceback מלמעלה.** התחילו מהסוף: השורה האחרונה אומרת מה השתבש.

> **תורכם:** (1) השלימו את `where_it_failed` עם `try/except` ו-`traceback.extract_tb`, כך שההדפסה הראשונה תציג `ValueError: where_it_failed > total > parse_price`. (2) ההדפסה השנייה קורסת: קראו את ה-traceback ותקנו את `parse_price` כך שתבין `$1,299.50`. (3) הוסיפו את מתודת הבדיקה `test_total_adds_prices` למחלקת הבדיקות. שורת הפלט האחרונה חייבת להיות `ran 4 failures 0 errors 0`.
