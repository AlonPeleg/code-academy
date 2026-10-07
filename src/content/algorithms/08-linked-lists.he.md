---
title: "רשימות מקושרות"
summary: "בונים שרשרת של צמתים ביד, ואז מוסיפים לה ומהפכים אותה על ידי חיווט מחדש של מצביעים."
hints:
  - "רשימה מקושרת היא פשוט צמתים שמצביעים על צמתים. כדי להוסיף, מצאו את הצומת האחרון (זה שה-next שלו הוא None) ושימו ב-next שלו Node חדש. ברשימה ריקה הציבו את self.head במקום."
  - "append: node = Node(value); if self.head is None: self.head = node; return. אחר כך last = self.head; while last.next is not None: last = last.next; last.next = node. reverse: previous = None; current = self.head; while current is not None: ..."
  - "while current is not None:   following = current.next   current.next = previous   previous = current   current = following      ואחרי הלולאה:   self.head = previous"
quiz:
  - q: "מה הצומת האחרון ברשימה מקושרת שומר בשדה next שלו?"
    options: ["את הצומת הראשון", "None", "אפס"]
  - q: "מה היתרון של רשימה מקושרת על פני רשימה של Python?"
    options: ["הכנסה בתחילת הרשימה היא O(1), בלי להזיז פריטים אחרים", "גישה מהירה יותר לפריט מספר i", "היא משתמשת בפחות זיכרון לכל פריט"]
  - q: "כמה זמן לוקחת קריאה של הפריט במיקום i ברשימה מקושרת?"
    options: ["O(1)", "O(log n)", "O(n), כי צריך ללכת מהראש"]
  - q: "בזמן ההיפוך, למה חייבים לשמור את current.next לפני ששוני אותו?"
    options: ["Python דורשת את זה", "אחרת מאבדים את שאר השרשרת", "כדי שהלולאה תהיה מהירה יותר"]
    explain: "ברגע ש-current.next מצביע אחורה, הדרך היחידה להגיע לשאר הצמתים הייתה הקישור הישן."
messages:
  - "עברו לאורך השרשרת עם לולאת while."
  - "הפכו על ידי הפניית הקישור next של כל צומת אחורה, אל הצומת הקודם."
  - "אל תשתמשו בפונקציות היפוך של רשימות. חווטו מחדש את הקישורים next."
---

רשימה של Python שומרת את הפריטים שלה אחד ליד השני בזיכרון. **רשימה מקושרת** (linked list) עושה את זה אחרת: כל פריט חי באובייקט (object) קטן משלו שנקרא **צומת** (node), וכל צומת מחזיק **מצביע** (pointer, כלומר הפניה) לצומת הבא. מעקב אחרי המצביעים מבקר בפריטים לפי הסדר. רשימות מקושרות הן מבנה הנתונים הראשון ש"בונים בעצמכם", והן מלמדות לחשוב על הפניות, וזה שימושי בכל שפה.

## צמתים ושרשרות

לצומת יש שני שדות: ה-`value` שלו וקישור `next` לצומת הבא. ה-`next` של הצומת האחרון הוא `None`, כלומר "זה הסוף".

```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
```

```text
head
  |
  v
[ 1 | * ]--->[ 2 | * ]--->[ 3 | None ]
```

אובייקט הרשימה עצמו זוכר רק את **הראש** (head): הצומת הראשון. את כל השאר מגיעים אליו בקפיצה מצומת לצומת:

```python
a = Node(1)
b = Node(2)
a.next = b            # a points at b
print(a.next.value)   # prints: 2
```

## הליכה לאורך השרשרת

כדי לבקר בכל פריט, מתחילים בראש וממשיכים לעקוב אחרי `next` עד שנופלים מהקצה:

```python
node = head
while node is not None:
    print(node.value)
    node = node.next
```

זכרו את הלולאה הזאת. כמעט כל שיטה ברשימה מקושרת היא וריאציה שלה. שימו לב שאי אפשר לקפוץ לפריט מספר 5: צריך לעבור על פריטים 0 עד 4. לכן קריאה לפי מיקום היא **O(n)**, בעוד שרשימה של Python עושה את זה ב-O(1).

## הוספה לסוף

כדי להוסיף לסוף צריך את הצומת האחרון, זה ש-`next` שלו הוא `None`. הולכים עד שמוצאים אותו, ואז מחברים את הצומת החדש:

```python
def append(self, value):
    node = Node(value)
    if self.head is None:          # empty list: the new node is the head
        self.head = node
        return
    last = self.head
    while last.next is not None:   # stop ON the last node, not after it
        last = last.next
    last.next = node
```

הליכה עד הסוף בכל פעם הופכת את `append` ל-O(n). מימושים אמיתיים שומרים גם מצביע `tail` כדי שזה יהיה O(1). הכנסה ב**תחילת** הרשימה היא O(1) גם בלי tail: `node.next = self.head; self.head = node`. זה היתרון האמיתי של רשימות מקושרות: אין צורך להזיז פריטים, בניגוד להכנסה בתחילת רשימה של Python.

## היפוך במקום

היפוך הוא החידה הקלאסית של רשימות מקושרות. לא מזיזים אף ערך. רק **הופכים את החיצים**. משתמשים בשלושה שמות: `previous`, `current` ו-`following`.

```text
start:   None   1 -> 2 -> 3
         prev  cur

step 1:  save following = 2, flip 1 to point at None, move forward
         None <- 1    2 -> 3
                prev  cur

step 2:  save following = 3, flip 2 to point at 1, move forward
         None <- 1 <- 2    3
                     prev  cur

step 3:  flip 3 to point at 2; current becomes None, loop ends
         None <- 1 <- 2 <- 3
                          prev   -> prev is the new head
```

בקוד:

```python
previous = None
current = self.head
while current is not None:
    following = current.next     # 1. remember what comes next
    current.next = previous      # 2. flip the arrow
    previous = current           # 3. step forward
    current = following
self.head = previous
```

הסדר של שתי השורות הראשונות חיוני. אם הופכים את החץ קודם, מאבדים את הקישור היחיד לשאר השרשרת. זה רץ בזמן **O(n)** ובזיכרון נוסף **O(1)**, כי משתמשים מחדש בצמתים הקיימים.

## רשימה מקושרת או רשימה של Python?

| פעולה | רשימה של Python | רשימה מקושרת |
| --- | --- | --- |
| קריאת פריט i | O(1) | O(n) |
| הכנסה בתחילה | O(n) | O(1) |
| הוספה בסוף | O(1) | O(n), או O(1) עם tail |
| זיכרון נוסף עבור קישורים | לא | כן |

ב-Python היומיומית הרשימה המובנית כמעט תמיד טובה יותר. רשימות מקושרות חשובות כדרך חשיבה, וכאבן בניין של מבנים אחרים (מחסניות, תורים, דליים בטבלאות גיבוב, עצים).

> **שימו לב:**
> - `AttributeError: 'NoneType' object has no attribute 'next'` אומר שעקבתם אחרי מצביע אל מעבר לסוף. בדקו `is not None` לפני שימוש ב-`.next`.
> - לולאה עם `while last is not None` נופלת מהקצה. ב-append צריך `while last.next is not None`.
> - אם שוכחים את `self.head = previous` בסוף `reverse`, הראש ממשיך להצביע על הצומת הראשון הישן, שעכשיו הוא האחרון, ולכן רואים רק פריט אחד.
> - אם שוכחים את מקרה הרשימה הריקה ב-`append`, התוכנית קורסת עם ה-`AttributeError` שלמעלה.

## להמשיך הלאה

הוסיפו `prepend(value)` (הכנסה בתחילה), `find(value)` ו-`remove(value)`. ההסרה היא המסובכת ביותר: צריך לשמור מצביע `previous` כדי שאפשר יהיה לגרום לו לדלג על הצומת שהוסר.

> **תורכם:** ממשו את `append` ואת `reverse` עבור המחלקה (class) `LinkedList`. הפכו על ידי היפוך הקישורים `next` בלולאת `while`, ולא על ידי העתקת ערכים לרשימה של Python.
