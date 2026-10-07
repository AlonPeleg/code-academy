---
title: "מיון, itertools ו-collections"
summary: "ממיינים עם פונקציות key ומשתמשים ב-Counter, defaultdict, deque ו-itertools למשימות נתונים יומיומיות."
hints:
  - "אלה חמישה כלים קטנים. Counter סופר פריטים, defaultdict יוצר ערכים חסרים אוטומטית, sorted(key=...) ממיין לפי ערך מחושב, deque היא רשימה מהירה בשני הקצוות, ו-itertools בונה צירופים."
  - "Counter(words).most_common(2). groups = defaultdict(list); for w in words: groups[len(w)].append(w). sorted(set(words), key=lambda w: (len(w), w)). d = deque([1,2,3,4,5]); d.rotate(2). ' '.join(''.join(p) for p in itertools.combinations('ABC', 2))."
  - "print(Counter(words).most_common(2))   groups = defaultdict(list)   for w in words: groups[len(w)].append(w)   print(groups[4])   print(sorted(set(words), key=lambda w: (len(w), w)))   d = deque([1, 2, 3, 4, 5]); d.rotate(2); print(list(d))   print(' '.join(''.join(p) for p in itertools.combinations('ABC', 2)))"
quiz:
  - q: "מה הארגומנט key של sorted() עושה?"
    options: ["בוחר את אלגוריתם המיון", "נותן פונקציה שהתוצאה שלה משמשת להשוואת כל פריט", "נועל את הרשימה כך שלא ניתן לשנות אותה"]
  - q: "מה היתרון של defaultdict(list) על פני dict רגיל?"
    options: ["הוא תמיד ממוין", "קריאה של מפתח חסר יוצרת עבורו רשימה ריקה במקום לזרוק KeyError", "הוא יכול להחזיק רק רשימות"]
  - q: "למה להשתמש ב-deque ולא ברשימה עבור תור?"
    options: ["הוא משתמש בפחות זיכרון עבור מספרים", "הוא שומר את הפריטים ממוינים", "הוספה והסרה בקצה השמאלי מהירות, בעוד ש-list.pop(0) איטית ברשימות גדולות"]
  - q: "מה sorted(words, key=len) עושה עם שוויון (אותו אורך)?"
    options: ["שומרת על הסדר היחסי המקורי שלהם, כי המיון של Python יציב", "ממיינת אותם באקראי", "זורקת שגיאה"]
messages:
  - "השתמשו ב-Counter(words)."
  - "השתמשו ב-defaultdict(list)."
  - "השתמשו ב-sorted(..., key=...)."
  - "צרו deque."
  - "השתמשו ב-itertools.combinations."
---

רוב התכנות היומיומי הוא הזזת נתונים: ממיינים אותם, סופרים אותם, מקבצים אותם, מעמידים אותם בתור. Python מגיעה עם כלים קטנים ובדוקים היטב למשימות האלה. כשלומדים אותם כותבים קוד קצר ונמנעים מלהמציא מחדש גרסאות איטיות או עם באגים.

## מיון עם פונקציית key

`sorted(items)` מחזירה רשימה ממוינת חדשה. `list.sort()` ממיינת במקום ומחזירה `None`. שתיהן מקבלות `key=` ו-`reverse=`:

```python
words = ["pear", "fig", "banana"]
print(sorted(words))                 # ['banana', 'fig', 'pear']
print(sorted(words, key=len))        # ['fig', 'pear', 'banana']
print(sorted(words, key=len, reverse=True))   # ['banana', 'pear', 'fig']
```

**פונקציית ה-key** נקראת פעם אחת לכל פריט, ו-Python ממיינת לפי התוצאות. היא יכולה להיות פונקציה מובנית כמו `len`, או `lambda` קטנה:

```python
people = [("Ava", 30), ("Noam", 25), ("Maya", 30)]
print(sorted(people, key=lambda p: p[1]))
# [('Noam', 25), ('Ava', 30), ('Maya', 30)]
```

המיון של Python הוא **יציב** (stable): פריטים עם מפתחות שווים נשארים בסדר המקורי שלהם (Ava נשארת לפני Maya). כדי למיין לפי כמה קריטריונים מחזירים טאפל, ומשתמשים בסימן מינוס כדי להפוך מספר: `key=lambda p: (-p[1], p[0])` אומר "המבוגר ראשון, ובשוויון לפי סדר אלפביתי".

## collections.Counter

`Counter` סופר כמה פעמים כל פריט מופיע:

```python
from collections import Counter
c = Counter("banana")
print(c)                  # Counter({'a': 3, 'n': 2, 'b': 1})
print(c["a"])             # 3
print(c.most_common(1))   # [('a', 3)]
```

פריטים חסרים נספרים כ-0 במקום לזרוק שגיאה.

## collections.defaultdict

מילון רגיל זורק `KeyError` עבור מפתח חסר. `defaultdict` מקבל פונקציה שיוצרת את ערך ברירת המחדל:

```python
from collections import defaultdict
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))   # {'a': ['apple', 'avocado'], 'b': ['banana']}
```

אין צורך בבדיקת `if key not in groups`. `defaultdict(int)` מצוין לספירה.

## collections.deque

**deque** (מבטאים "דק", תור דו-צדדי) מהיר בהוספה ובהסרה בשני הקצוות. זו הבחירה הנכונה לתורים ולחלונות נעים:

```python
from collections import deque
d = deque([1, 2, 3])
d.append(4)        # right end:  1 2 3 4
d.appendleft(0)    # left end:   0 1 2 3 4
d.popleft()        # removes 0 quickly
d.rotate(1)        # shifts everything right: 4 1 2 3
```

`list.pop(0)` צריכה להזיז כל פריט אחר, ולכן היא נהיית איטית ברשימות גדולות. `deque(maxlen=3)` זורקת פריטים ישנים אוטומטית, מושלם עבור "שלושת הערכים האחרונים".

## itertools

`itertools` בונה ומשלב איטרטורים באופן עצל:

```python
import itertools
print(list(itertools.combinations("ABC", 2)))   # [('A', 'B'), ('A', 'C'), ('B', 'C')]
print(list(itertools.permutations("AB")))       # [('A', 'B'), ('B', 'A')]
print(list(itertools.chain([1, 2], [3])))       # [1, 2, 3]
print(list(itertools.islice(itertools.count(10), 3)))  # [10, 11, 12]
```

`combinations` מתעלמת מהסדר, `permutations` דואגת לו, `chain` מדביקה רצפים, `count` הוא מונה אינסופי ו-`islice` לוקחת חיתוך מכל איטרטור. `itertools.groupby` מקבצת פריטים שווים **שכנים**, ולכן ממיינים קודם.

> **שימו לב:**
> - `sorted(...)` מחזירה רשימה חדשה, ו-`my_list.sort()` מחזירה `None`. הכתיבה `x = my_list.sort()` משאירה את `x` כ-`None`.
> - מיון של טיפוסים מעורבים: `sorted([3, "a"])` זורקת `TypeError: '<' not supported between instances of 'str' and 'int'`.
> - `key=` צריך פונקציה ולא קריאה: `key=len`, לא `key=len()`.
> - `combinations` נותנת טאפלים, ולכן מחברים אותם כדי ליצור טקסט: `"".join(pair)`.
> - איטרטורים מ-itertools נגמרים אחרי מעבר אחד, כמו גנרטורים.

> **תורכם:** בצעו את חמש ההערות הממוספרות: ספרו מילים עם `Counter`, קבצו אותן עם `defaultdict(list)`, מיינו עם מפתח טאפל, סובבו `deque` והדפיסו צירופים. התאימו לפלט הצפוי בדיוק.
