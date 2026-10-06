---
title: "רשימות ומילונים"
summary: "אוספים ערכים ברשימות ומחפשים אותם במילונים."
hints:
  - "רשימה גדלה בעזרת שיטה, ומילון גדל בהשמה למפתח חדש. אחר כך len() סופרת פריטים ו-sum() מחברת מספרים."
  - "רשימה: fruits.append(...). מילון: prices[\"cherry\"] = 5. המחירים הם הערכים (VALUES) של המילון, ולכן sum(prices.values())."
  - "fruits.append(\"cherry\")   prices[\"cherry\"] = 5   print(len(fruits))   print(sum(prices.values()))"
quiz:
  - q: "איך מוסיפים פריט לסוף רשימה?"
    options: ["list.add(item)", "list.push(item)", "list.append(item)"]
  - q: "איך קוראים את המחיר של \"apple\" ממילון בשם prices?"
    options: ["prices.apple()", "prices[\"apple\"]", "prices(\"apple\")"]
  - q: "מהו האינדקס הראשון של רשימה?"
    options: ["1", "-1", "0"]
  - q: "מה שומר מילון (dict)?"
    options: ["זוגות של מפתח וערך", "רק מספרים", "פריטים ממוינים לפי גודל"]
messages:
  - "השתמשו ב-.append() כדי להוסיף לרשימה."
  - "השתמשו ב-sum() על המחירים."
  - "השתמשו ב-len() כדי לספור את הפירות."
---

תוכניות אמיתיות עובדות עם אוספים של דברים: רשימת שמות, טבלת מחירים, קבוצת ציונים. Python נותנת לכם שני כלי עבודה עיקריים בשביל זה, רשימות ומילונים.

## רשימות

**רשימה** (list) שומרת פריטים לפי סדר, בתוך סוגריים מרובעים:

```python
colors = ["red", "green"]
colors.append("blue")        # add to the end
print(colors)                # prints: ['red', 'green', 'blue']
print(colors[0])             # prints: red   (index 0 = first item)
print(colors[-1])            # prints: blue  (negative = from the end)
print(len(colors))           # prints: 3
```

כלי רשימות שימושיים:

| כלי | מה הוא עושה |
| --- | --- |
| `items.append(x)` | מוסיף את x בסוף |
| `items.insert(0, x)` | מוסיף את x במקום 0 |
| `items.remove(x)` | מסיר את ה-x הראשון |
| `items.pop()` | מסיר ומחזיר את הפריט האחרון |
| `items.sort()` | ממיין במקום |
| `x in items` | האם x נמצא ברשימה? |
| `len(items)` | כמה פריטים יש |

אפשר לשנות פריט לפי אינדקס: `colors[0] = "pink"`. ואפשר לעבור על רשימה בלולאה:

```python
for color in colors:
    print(color)
```

## מילונים

**מילון** (dictionary, או dict) ממפה **מפתחות** (keys) ל**ערכים** (values), בתוך סוגריים מסולסלים. הוא כמו ספר טלפונים: מחפשים שם (המפתח) ומקבלים את המספר (הערך).

```python
ages = {"Ava": 21, "Noam": 19}
ages["Maya"] = 23            # add a new pair
ages["Ava"] = 22             # change an existing value
print(ages["Ava"])           # prints: 22
print("Noam" in ages)        # prints: True (checks the keys)
```

כך עוברים על מילון בלולאה:

```python
for name, age in ages.items():
    print(name, age)
```

`ages.keys()` נותנת רק את המפתחות, `ages.values()` רק את הערכים, ו-`ages.get("Zed", 0)` מחפשת מפתח בבטחה ונותנת `0` כשהוא חסר.

## משלבים עם פונקציות

הפונקציות המובנות האלה עובדות על אוספים של מספרים:

```python
scores = [70, 85, 90]
print(sum(scores))   # prints: 245
print(max(scores))   # prints: 90
print(min(scores))   # prints: 70
```

עבור מילון השתמשו ב-`sum(prices.values())`, כי רוצים לחבר את הערכים ולא את המפתחות.

> **שימו לב:**
> - אינדקס מחוץ לטווח: כשיש 3 פריטים, `items[3]` מניב `IndexError: list index out of range`. האינדקס התקף האחרון הוא 2.
> - קריאת מפתח שלא קיים מניבה `KeyError: 'cherry'`. השתמשו ב-`.get()` או בדקו קודם עם `in`.
> - `append` מקבלת ארגומנט אחד בדיוק. `items.append(1, 2)` מניבה `TypeError`.
> - `items.sort()` מחזירה `None` (היא ממיינת במקום). הכתיבה `items = items.sort()` מוחקת את הרשימה שלכם.

> **תורכם:** פעלו לפי ההערות הממוספרות בעורך: הוסיפו את `"cherry"` לרשימה ולמילון, ואז הדפיסו את מספר הפירות ואת סך המחירים.
