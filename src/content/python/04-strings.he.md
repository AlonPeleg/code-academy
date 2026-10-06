---
title: "מחרוזות ושיטות טקסט"
summary: "מחברים, מודדים ומשנים טקסט בעזרת מחרוזות f ושיטות של מחרוזות."
hints:
  - "למחרוזות יש פעולות מובנות שנקראות שיטות (methods), שנכתבות עם נקודה אחרי המחרוזת: text.method(). קודם שמרו במשתנה את הגרסה עם אות גדולה בתחילת כל מילה, כדי שתוכלו להשתמש בה שוב."
  - "השיטות שתצטרכו הן title, upper, replace והפונקציה len. אות בודדת נבחרת עם סוגריים מרובעים ואינדקס, והאינדקס 0 הוא התו הראשון."
  - "nice = full_name.title()   print(nice)   print(nice.upper())   print(len(nice))   print(nice.replace(\"Ada\", \"Augusta\"))   print(nice[0])   print(f\"Hello, {nice}!\")"
quiz:
  - q: "מה מחזירה הפקודה \"abc\".upper()?"
    options: ["abc", "Abc", "ABC"]
  - q: "מה מחזירה הפקודה len(\"hello\")?"
    options: ["5", "4", "6"]
  - q: "מה הערך של \"python\"[0]?"
    options: ["y", "p", "n"]
    explain: "הספירה מתחילה ב-0, ולכן האינדקס 0 הוא התו הראשון."
  - q: "האם אפשר לשנות תו בתוך מחרוזת, כמו word[0] = \"X\"?"
    options: ["כן, תמיד", "רק במחרוזות קצרות", "לא, מחרוזות הן immutable (בלתי ניתנות לשינוי)"]
    explain: "אי אפשר לשנות מחרוזת במקום. שיטות כמו replace() מחזירות מחרוזת חדשה במקומה."
messages:
  - "השתמשו בשיטה .title()."
  - "השתמשו בשיטה .upper()."
  - "השתמשו ב-len() כדי לספור תווים."
  - "השתמשו בשיטה .replace()."
  - "השתמשו במחרוזת f בשורה האחרונה."
---

טקסט נמצא בכל מקום: שמות, הודעות, סיסמאות, דפי אינטרנט. Python קוראת לקטע טקסט **מחרוזת** (string), ומצרפת לה ארגז כלים של פעולות מוכנות לעבודה איתה.

## יצירת מחרוזות

השתמשו במרכאות בודדות או כפולות, איך שנוח לכם, כל עוד אתם סוגרים באותו סוג:

```python
word = "python"
other = 'it\'s fine'      # \' puts a quote inside the text
print(word)               # prints: python
```

אפשר **לחבר** מחרוזות עם `+` ו**לחזור** עליהן עם `*`:

```python
print("Hello, " + "world")   # prints: Hello, world
print("ha" * 3)              # prints: hahaha
```

## אורך ואינדקסים

`len()` אומרת כמה תווים יש במחרוזת (גם רווחים נספרים). לכל תו יש מיקום שנקרא **אינדקס** (index), והאינדקס הראשון הוא **0**, לא 1:

```python
word = "python"
print(len(word))     # prints: 6
print(word[0])       # prints: p
print(word[1])       # prints: y
print(word[-1])      # prints: n   (negative numbers count from the end)
```

## שיטות של מחרוזות

**שיטה** (method) היא פונקציה ששייכת לערך. קוראים לה עם נקודה: `value.method()`.

| שיטה | מה היא עושה | דוגמה | תוצאה |
| --- | --- | --- | --- |
| `.upper()` | כל האותיות גדולות | `"hi".upper()` | `HI` |
| `.lower()` | כל האותיות קטנות | `"HI".lower()` | `hi` |
| `.title()` | אות גדולה בתחילת כל מילה | `"ada lovelace".title()` | `Ada Lovelace` |
| `.strip()` | מסירה רווחים משני הקצוות | `"  hi  ".strip()` | `hi` |
| `.replace(a, b)` | מחליפה טקסט | `"cat".replace("c", "b")` | `bat` |
| `.startswith(x)` | מתחילה ב...? | `"python".startswith("py")` | `True` |
| `.find(x)` | המיקום של x, או -1 | `"python".find("t")` | `2` |

מחרוזות הן **immutable** (בלתי ניתנות לשינוי): שיטה אף פעם לא משנה את המקור, היא מחזירה מחרוזת חדשה. לכן צריך לשמור את התוצאה:

```python
name = "ada"
name.upper()          # does nothing useful, the result is thrown away
name = name.upper()   # now name is "ADA"
```

## מחרוזות f

כבר הכרתם מחרוזות f. הן הדרך הנקייה ביותר לערבב טקסט וערכים, והן יכולות גם לעצב מספרים:

```python
price = 3.5
print(f"Price: {price:.2f} dollars")   # prints: Price: 3.50 dollars
```

`:.2f` פירושו "הציגו שתי ספרות אחרי הנקודה העשרונית".

> **שימו לב:**
> - אם שוכחים את הסוגריים: `name.upper` (בלי `()`) לא הופכת לאותיות גדולות, אלא רק מדפיסה משהו כמו `<built-in method upper of str object>`.
> - בקשה לאינדקס גדול מדי מניבה `IndexError: string index out of range`.
> - `word[0] = "X"` מניבה `TypeError: 'str' object does not support item assignment`.
> - חיבור טקסט ומספר עם `+`, כמו `"Age: " + 5`, מניב `TypeError`. השתמשו במקום זה במחרוזת f.

> **תורכם:** התוכנית קוראת שם באותיות קטנות. השתמשו ב-`.title()`, ב-`.upper()`, ב-`len()`, ב-`.replace()`, באינדקס ובמחרוזת f כדי להדפיס את ששת השורות שמופיעות בהערות.
