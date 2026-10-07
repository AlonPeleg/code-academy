---
title: "בדיקות עם assert"
summary: "כותבים פונקציות בדיקה קטנות, מריצים אותן עם מריץ קטן ותופסים באגים לפני המשתמשים."
hints:
  - "בדיקה (test) היא פונקציה קטנה שמשתמשת ב-assert condition. אם התנאי שקרי Python זורקת AssertionError והמריץ מדפיס FAIL. שמות של בדיקות מתחילים ב-test_ כדי שהמריץ ימצא אותן."
  - "is_palindrome: בנו cleaned = [c.lower() for c in text if c.isalnum()] והשוו אותה ל-cleaned[::-1]. average: if not numbers: raise ValueError('no numbers'); return sum(numbers) / len(numbers). בבדיקה האחרונה השתמשו ב-try: average([]) except ValueError: pass else: assert False, 'expected ValueError'."
  - "def is_palindrome(text):     cleaned = [c.lower() for c in text if c.isalnum()]     return cleaned == cleaned[::-1]   def average(numbers):     if not numbers:         raise ValueError('no numbers')     return sum(numbers) / len(numbers)   def test_average_empty():     try:         average([])     except ValueError:         pass     else:         assert False, 'expected ValueError'"
quiz:
  - q: "מה assert x == 3 עושה כש-x הוא 5?"
    options: ["מדפיס False וממשיך", "זורק AssertionError", "משנה את x ל-3"]
  - q: "למה שמות של פונקציות בדיקה מתחילים ב-test_ ?"
    options: ["Python דורשת את זה מכל פונקציה", "זה גורם להן לרוץ מהר יותר", "מריצי בדיקות כמו pytest והמריץ הקטן שלנו מחפשים את הקידומת הזו כדי למצוא בדיקות"]
  - q: "מהי בדיקה טובה?"
    options: ["כזו שמדפיסה הרבה", "כזו עם תוצאה צפויה ברורה שנותנת את אותה תשובה בכל פעם", "כזו שתלויה בשעה הנוכחית"]
  - q: "למה כדאי לבדוק גם מקרים חריגים כמו רשימה ריקה או מחרוזת ריקה?"
    options: ["באגים נוטים להסתתר בקצוות, שם הקוד מניח הנחות נסתרות", "כי המקרים הרגילים אף פעם לא נכשלים", "כי Python דורשת את זה"]
messages:
  - "כתבו את פונקציית הבדיקה test_average_empty."
  - "average חייבת לזרוק ValueError עבור רשימה ריקה."
  - "תפסו את ValueError בבדיקה."
---

לכל תוכנית יש באגים. השאלה היא אם אתם מוצאים אותם או שהמשתמשים שלכם מוצאים. **בדיקות אוטומטיות** (automated tests) הן חלקי קוד קטנים שקוראים לפונקציות שלכם עם קלט ידוע ובודקים את התשובות. אחרי שכתבתם אותן, להריץ אותן שוב לא עולה כלום, ולכן אפשר לשנות את הקוד מאוחר יותר ולדעת מיד אם משהו נשבר. פרויקטים אמיתיים משתמשים בכלים כמו `pytest` או `unittest`. כאן תבנו את הרעיון מאפס עם `assert` בלבד.

## הפקודה assert

`assert condition` לא עושה דבר כשהתנאי נכון, וזורקת `AssertionError` כשהוא שקרי. אפשר להוסיף הודעה אחרי פסיק:

```python
assert 1 + 1 == 2                    # fine, silent
assert len("abc") == 4, "length is wrong"
# AssertionError: length is wrong
```

assertion קובע "זה חייב להיות נכון, אחרת משהו לא בסדר". כשהוא נכשל הוא עוצר את התוכנית בדיוק בנקודה הזו עם הודעה ברורה.

## פונקציית הבדיקה הראשונה שלכם

**בדיקה** היא פונקציה רגילה שקוראת לקוד הנבדק וטוענת (assert) לגבי התוצאה:

```python
def double(x):
    return x * 2

def test_double():
    assert double(3) == 6
    assert double(0) == 0
    assert double(-2) == -4
```

הרגלים טובים לבחירת בדיקות:

- **מקרה אופייני**: קלט רגיל.
- **מקרי קצה**: רשימה ריקה, אפס, פריט אחד, טקסט ארוך מאוד, מספרים שליליים.
- **מקרי שגיאה**: קלט שאמור לגרום לשגיאה.

## מריץ בדיקות קטן

מריץ מוצא את הבדיקות, מריץ כל אחת, תופס כישלונות ומדווח. זה כל מה ש-pytest עושה בליבה:

```python
def run_tests():
    for name in [n for n in list(globals()) if n.startswith("test_")]:
        try:
            globals()[name]()
            print("PASS", name)
        except AssertionError as error:
            print("FAIL", name, error)
```

`globals()` היא מילון של כל שם שהוגדר בקובץ שלכם, ולכן אפשר למצוא כל פונקציה ששמה מתחיל ב-`test_`. assert שנכשל זורק `AssertionError`, ואנחנו תופסים אותו כדי שהבדיקות האחרות ימשיכו לרוץ. מכיוון שמילונים שומרים על סדר ההוספה, הבדיקות רצות בסדר שבו כתבתם אותן, וזה שומר על פלט דטרמיניסטי.

## בדיקה שאכן קרתה שגיאה

לפעמים ההתנהגות הנכונה היא לזרוק חריגה. בודקים אותה עם `try`, `except` ו-`else`:

```python
def test_divide_by_zero():
    try:
        1 / 0
    except ZeroDivisionError:
        pass                          # good, this is what we wanted
    else:
        assert False, "expected ZeroDivisionError"
```

החלק `else` רץ רק כשלא קרתה חריגה, וזה אומר שהבדיקה חייבת להיכשל. (ב-pytest הייתם כותבים `with pytest.raises(ZeroDivisionError):`.)

## קודם בדיקה, אחר כך תיקון

תהליך עבודה עוצמתי: כותבים קודם את הבדיקה שנכשלת, רואים אותה נכשלת, ואז כותבים את הקוד עד שהיא עוברת. הריצו את קוד ההתחלה של השיעור הזה ותראו כישלונות. להפוך את כולם לירוקים זה התרגיל. כשתמצאו באג מאוחר יותר, כתבו קודם בדיקה שמשחזרת אותו, ואז הוא לא יוכל לחזור בלי שישימו לב.

## מספרים עשרוניים

אל תשוו מספרים עשרוניים עם `==`: הביטוי `0.1 + 0.2 == 0.3` הוא `False`. השתמשו ב-`abs(a - b) < 1e-9` או ב-`math.isclose(a, b)`.

> **שימו לב:**
> - בדיקה שאף פעם לא רצה: אם השם לא מתחיל ב-`test_`, המריץ מדלג עליה בשקט. בדקו את הספירה בשורת הסיכום.
> - `assert (x == 1, "message")` עם סוגריים סביב שני החלקים הוא תמיד אמת, כי טאפל לא ריק נחשב אמת (truthy). כתבו `assert x == 1, "message"`.
> - הרצת Python עם האפשרות `-O` מסירה פקודות assert, ולכן לעולם אל תשתמשו ב-assert כדי לאמת קלט ממשתמש. השתמשו ב-`if` וב-`raise ValueError(...)` במקום. זו גם הסיבה ש-`average` זורקת חריגה ולא משתמשת ב-assert.
> - בדיקות שתלויות באקראיות, בשעון או ברשת נכשלות באופן בלתי צפוי. שמרו על בדיקות דטרמיניסטיות.
> - הרבה בדיקות לא קשורות בבדיקה אחת: הכישלון הראשון מסתיר את השאר. העדיפו בדיקות קטנות וממוקדות עם שמות ברורים.

> **תורכם:** ממשו את `is_palindrome` ואת `average` (שזורקת `ValueError("no numbers")` עבור רשימה ריקה), ואז כתבו את הבדיקה החסרה `test_average_empty`. כל ארבע הבדיקות אמורות להדפיס PASS.
