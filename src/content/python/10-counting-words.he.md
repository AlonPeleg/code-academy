---
title: "ניתוח טקסט וספירת מילים"
summary: "מפצלים טקסט לחלקים, סופרים בעזרת מילון (dictionary) ומחברים את התוצאות בחזרה."
messages:
  - "השתמשו ב-.split() כדי לחתוך את השורה למילים."
  - "השתמשו ב-.join() לשורה האחרונה."
  - "השתמשו במילון כדי לספור."
hints:
  - "שלושה כלים עושים את העבודה: split כדי לחתוך טקסט לרשימה, מילון כדי לספור, ו-join כדי להדביק רשימה בחזרה לטקסט."
  - "words = line.split(). אחר כך לולאה: for word in words: counts[word] = counts.get(word, 0) + 1. לסדר אלפביתי עוברים בלולאה על sorted(counts). חיבור נראה כך: \",\".join(a_list)."
  - "words = line.split()   counts = {}   for word in words: counts[word] = counts.get(word, 0) + 1   for word in sorted(counts): print(f\"{word}: {counts[word]}\")   print(\",\".join(sorted(counts)))"
quiz:
  - q: "מה מחזירה \"a b c\".split()?"
    options: ["הטקסט 'a b c'", "רשימה: ['a', 'b', 'c']", "המספר 3"]
  - q: "מה מחזירה \",\".join([\"x\", \"y\"])?"
    options: ["['x', 'y']", "x y", "x,y"]
  - q: "מה מחזירה counts.get(\"zebra\", 0) כש-\"zebra\" אינו מפתח?"
    options: ["0", "שגיאה", "None"]
  - q: "מה מחזירה \"10,20\".split(\",\")?"
    options: ["['10,20']", "['10', '20']", "[10, 20]"]
    explain: "split נותנת חלקי טקסט. המירו אותם עם int() אם אתם צריכים מספרים."
---

חלק עצום מהתכנות האמיתי הוא לקחת טקסט מבולגן, כמו משפט, שורה מקובץ CSV או שורה מיומן (log), ולהפוך אותו לנתונים מובנים שאפשר לעבוד איתם. בשיעור הזה תלמדו לחתוך טקסט לחלקים, לספור דברים בעזרת מילון (dictionary), ולחבר טקסט בחזרה.

## split: מטקסט לרשימה

`.split()` חותכת מחרוזת (string) לרשימה של חלקים. בלי ארגומנט היא מפצלת לפי כל רווח לבן; עם ארגומנט היא מפצלת לפי הטקסט המדויק הזה:

```python
print("red green blue".split())      # prints: ['red', 'green', 'blue']
print("10,20,30".split(","))         # prints: ['10', '20', '30']
```

שימו לב שהחלקים עדיין **טקסט**. כדי לחשב צריך להמיר אותם:

```python
parts = "10,20,30".split(",")
total = 0
for p in parts:
    total = total + int(p)           # convert each piece before adding
print(total)                         # prints: 60
```

## join: מרשימה לטקסט

`.join()` היא ההפך. קודם כותבים את טקסט ה"דבק", ואז קוראים ל-`.join` עם הרשימה:

```python
words = ["a", "b", "c"]
print("-".join(words))     # prints: a-b-c
print(" ".join(words))     # prints: a b c
print("".join(words))      # prints: abc
```

כל הפריטים חייבים להיות מחרוזות. עבור מספרים השתמשו ב-`",".join(str(n) for n in nums)` או המירו קודם.

## ספירה עם מילון

מילון הוא הכלי הטבעי ל"כמה יש מכל אחד". הרעיון: לכל פריט מוסיפים 1 לרשומה שלו.

```python
counts = {}
for letter in "banana":
    counts[letter] = counts.get(letter, 0) + 1
print(counts)    # prints: {'b': 1, 'a': 3, 'n': 2}
```

כך נראה מה קורה בכל סיבוב:

- `counts.get(letter, 0)` מחפשת את הספירה הנוכחית, או נותנת `0` אם האות חדשה.
- `+ 1` מוסיפה את המופע הזה.
- `counts[letter] = ...` שומרת את הסכום החדש.

מילונים זוכרים את הסדר שבו המפתחות נוספו, אבל כשמדפיסים דוח נעים יותר למיין. `sorted(counts)` נותנת את המפתחות בסדר אלפביתי, ואפשר להשתמש בכל מפתח כדי לשלוף את הספירה שלו. כדי למיין לפי ספירה אפשר להשתמש ב-`sorted(counts.items(), key=...)`, שתוכלו לחקור בהמשך.

## ניקוי הקלט

בטקסט אמיתי יש בלגן. שרשרו את העזרים האלה:

```python
text = "  Hello World  "
print(text.strip().lower().split())   # prints: ['hello', 'world']
```

> **שימו לב:**
> - `counts[word] += 1` עבור מילה חדשה נותנת `KeyError: 'dog'`. השתמשו ב-`.get(word, 0)` או בדקו `if word in counts`.
> - `.join` נקראת על ה"דבק", לא על הרשימה: `",".join(items)`, לא `items.join(",")` (שנותנת `AttributeError`).
> - חיבור של ערכים שאינם מחרוזות נכשל: `",".join([1, 2])` נותנת `TypeError: sequence item 0: expected str instance, int found`.
> - מילים עם אותיות גדולות שונות נספרות בנפרד: `The` ו-`the` הן שני מפתחות. השתמשו קודם ב-`.lower()` כשזה לא מה שרציתם.

> **תורכם:** פצלו את המשפט למילים, ספרו אותן במילון, הדפיסו `word: count` לכל מילה בסדר אלפביתי, וסיימו עם המילים מחוברות בפסיקים.
