---
title: "list comprehension"
summary: "בונים רשימות חדשות מרשימות ישנות בשורה אחת קריאה."
messages:
  - "בנו את squares עם [... for n in nums]."
  - "בנו את evens עם comprehension שיש בו מסנן if."
  - "בנו את shouting עם comprehension שיש בו מסנן if."
hints:
  - "comprehension הוא לולאה שנכתבת בתוך סוגריים מרובעים: [what_to_store for item in collection]. if אופציונלי בסוף מסנן פריטים."
  - "ריבועים: [n * n for n in nums]. עבור זוגיים מוסיפים מסנן בסוף: [n for n in nums if n % 2 == 0]. עבור המילים שמרו len(w) או w.upper()."
  - "squares = [n * n for n in nums]   evens = [n for n in nums if n % 2 == 0]   lengths = [len(w) for w in words]   shouting = [w.upper() for w in words if len(w) > 4]"
quiz:
  - q: "מה מייצר [n * 2 for n in [1, 2, 3]]?"
    options: ["[1, 2, 3]", "[2, 4, 6]", "6"]
  - q: "איפה נכנס המסנן ב-[n for n in nums ___ ] ?"
    options: ["בהתחלה ממש", "לפני המילה for", "בסוף, כ-if condition"]
  - q: "מה נותן [c for c in \"hey\"]?"
    options: ["['h', 'e', 'y']", "'hey'", "3"]
  - q: "איזו לולאה רגילה שקולה ל-[x + 1 for x in nums] ?"
    options: ["מתחילים ברשימה ריקה, עוברים בלולאה על nums, ובכל פעם מוסיפים x + 1 עם append", "עוברים בלולאה על nums ומדפיסים רק x + 1", "ממיינים את nums ומוסיפים 1"]
---

משימה נפוצה מאוד היא "קחו את הרשימה הזאת ובנו ממנה רשימה חדשה": להעלות בריבוע כל מספר, להשאיר רק מילים ארוכות, לשלוף שדה מכל רשומה. אפשר לעשות את זה עם לולאת `for` ו-`append`, אבל לפייתון יש צורה קצרה ופופולרית מאוד לכך: **list comprehension**, בעברית "הבנת רשימה".

## מלולאה ל-comprehension

הדרך עם לולאה:

```python
nums = [1, 2, 3, 4]
squares = []
for n in nums:
    squares.append(n * n)
print(squares)       # prints: [1, 4, 9, 16]
```

אותו דבר בשורה אחת:

```python
squares = [n * n for n in nums]
print(squares)       # prints: [1, 4, 9, 16]
```

קראו את זה משמאל לימין כמו משפט באנגלית: "make a list of `n * n` for each `n` in `nums`". החלקים הם:

1. `[` `]` הרשימה החדשה.
2. `n * n` ה**ביטוי** (expression): מה לשמור עבור כל פריט.
3. `for n in nums` הלולאה שמספקת את הפריטים.

## סינון עם if

הוסיפו `if condition` בסוף כדי להשאיר רק חלק מהפריטים:

```python
nums = [1, 2, 3, 4, 5, 6]
evens = [n for n in nums if n % 2 == 0]
print(evens)         # prints: [2, 4, 6]
```

כאן הביטוי הוא רק `n` (שומרים את הפריט עצמו), וה-`if` מחליט אילו מהם שורדים.

אפשר לשלב שינוי וסינון:

```python
words = ["apple", "kiwi", "banana"]
print([w.upper() for w in words if len(w) > 4])   # prints: ['APPLE', 'BANANA']
```

## מקורות אחרים

כל דבר שאפשר לעבור עליו בלולאה עובד, כמו טקסט או `range`:

```python
print([c for c in "hey"])            # prints: ['h', 'e', 'y']
print([i * 10 for i in range(1, 4)]) # prints: [10, 20, 30]
```

יש גם תחביר קרוב למילונים: `{w: len(w) for w in words}` בונה מילון (dict).

## מתי לא להשתמש בו

comprehensions מצטיינים בשינויים קצרים ופשוטים. אם צריך כמה שלבים, תנאי if מקוננים או משפטי print, לולאת `for` רגילה ברורה יותר. קריאות חשובה יותר מתחכום.

> **שימו לב:**
> - שמים את המסנן במקום הלא נכון: `[n if n > 2 for n in nums]` היא `SyntaxError`. המסנן בא בסוף.
> - comprehension בונה רשימה **חדשה** ומשאיר את המקורית בשקט.
> - שוכחים ש-`print` מחזירה `None`: `[print(n) for n in nums]` עובד אבל בונה רשימה חסרת תועלת של `None`. להדפסה השתמשו בלולאה רגילה.
> - משתנה בתוך ה-comprehension (`n`) לא "דולף" החוצה ולא זמין אחר כך: תראו `NameError`.

> **תורכם:** בנו את `squares`, `evens`, `lengths` ו-`shouting` עם list comprehension בשורה אחת, והדפיסו כל רשימה.
