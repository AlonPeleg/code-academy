---
title: "שלב 5: היסטוריה ופקודות"
summary: "מתעדים את השיחה ברשימה ומוסיפים /history, /reset ו-/help בעזרת מילון של פונקציות."
hints:
  - "פקודה היא הודעה שמתחילה ב-\"/\". בדקו אותה קודם, לפני learn() והכוונות (intents). פקודות הן פונקציות, ואפשר לשמור פונקציות בתור ערכים של מילון."
  - "COMMANDS = {\"/help\": show_help, \"/history\": show_history, \"/reset\": reset}. run_command: if not text.startswith(\"/\"): return None; command = COMMANDS.get(text.lower()); if command is None: החזירו תשובה של פקודה לא מוכרת; return command()."
  - "history = []   for number, (speaker, text) in enumerate(history, start=1): lines.append(str(number) + \". \" + speaker + \": \" + text)   def respond(text): reply = run_command(text); if reply is not None: return reply; reply = learn(text) or find_reply(text); history.append((\"You\", text)); history.append((\"Bot\", reply)); return reply"
messages:
  - "שמרו את השיחה ברשימה בשם history."
  - "מספרו את שורות ההיסטוריה עם enumerate()."
  - "בנו מילון COMMANDS של שם פקודה -> פונקציה."
  - "זהו פקודות עם text.startswith(\"/\")."
quiz:
  - q: "מה מחזירה COMMANDS.get(\"/dance\") כש-\"/dance\" אינו מפתח?"
    options: ["שגיאה (KeyError)", "None", "\"\""]
    explain: "dict.get מחזירה None עבור מפתח חסר, ואילו COMMANDS[\"/dance\"] הייתה זורקת KeyError."
  - q: "למה קוראים ל-command() עם סוגריים בסוף?"
    options: ["המילון שומר את הפונקציה עצמה, והסוגריים מריצים אותה", "כדי להדפיס אותה", "כדי להעתיק אותה"]
  - q: "מה נותנת enumerate(history, start=1) בכל סיבוב?"
    options: ["רק את המספר", "את הפריט פעמיים", "זוג: מספר השורה (מ-1) והפריט"]
---
באפליקציות צ'אט אפשר לגלול אחורה ולהריץ פקודות מיוחדות כמו `/help`. בשלב הזה הבוט מתעד את כל השיחה ב**רשימת היסטוריה** (history) ולומד **פקודות סלאש** (slash commands) ששולטות בבוט עצמו במקום לדבר איתו.

## איפה אנחנו

הבוט זוכר את השם שלכם ועובדות, מדרג את המשפט שלכם מול כוונות, ומודה כשרמת הביטחון שלו נמוכה מהסף. פלט ה-`DEBUG` עזר לנו לראות את הציונים, אבל עכשיו הוא מבלגן את התמלול.

## מה נוסיף, ולמה

שני דברים שכל בוט אמיתי צריך:

* **היסטוריה.** רשימה של זוגות `(speaker, text)`, כדי שהבוט (ואתם) יוכלו להסתכל אחורה. תכונות מאוחרות יותר, כמו הדוח בשלב האחרון, נשענות על הידיעה מה נאמר.
* **פקודות.** הודעות שמתחילות ב-`/` הן הוראות: `/history` מדפיסה את השיחה, `/reset` שוכחת הכול, `/help` מפרטת את הפקודות. הפרדה שלהן משיחה רגילה מונעת באג מעצבן: הבוט שלכם לא צריך לנסות "להבין" את `/reset` בתור שיחת חולין.

## הדרכה צעד אחר צעד

**1. מכבים את ה-debug.** קבעו `DEBUG = False`. קבוע אחד שולט בפלט הנוסף, ובגלל זה הפכנו אותו לקבוע.

**2. רשימת ההיסטוריה.** צרו `history = []` לצד `state`. ב-`respond`, אחרי שהתשובה ידועה, הוסיפו שני פריטים. כל פריט הוא **tuple**, זוג קבוע שנכתב בסוגריים:

```python
history.append(("You", text))
history.append(("Bot", reply))
```

**3. מספרים את השורות עם `enumerate`.** `enumerate(history, start=1)` נותנת `(1, first_item), (2, second_item)...`, והלולאה יכולה לפרוס את הזוג המקונן באותו זמן:

```python
for number, (speaker, text) in enumerate(history, start=1):
    lines.append(str(number) + ". " + speaker + ": " + text)
return "\n".join(lines)
```

`"\n".join(lines)` מדביקה שורות עם תו שורה חדשה ביניהן, כך שתשובה אחת יכולה להיות מודפסת כמה שורות.

**4. פקודות הן פונקציות במילון.** ב-Python פונקציה היא ערך שאפשר לשמור. שימו לב שאין סוגריים אחרי שמות הפונקציות:

```python
COMMANDS = {"/help": show_help, "/history": show_history, "/reset": reset}
```

כדי להריץ אחת, מחפשים אותה ו*אחר כך* קוראים לה:

```python
command = COMMANDS.get(text.lower())
if command is None:
    return "Unknown command " + text + ". Try /help."
return command()
```

`dict.get(key)` מחזירה `None` עבור מפתח חסר במקום לקרוס כמו `COMMANDS[key]`. הוספת פקודה חדשה בעתיד היא פונקציה חדשה אחת ופריט חדש אחד במילון, בלי סולם של `if/elif`.

**5. סדר הבדיקות.** כתבו את `run_command(text)` כך שתחזיר `None` כש-`text` לא מתחיל ב-`/` (`text.startswith("/")`). אז `respond` יכולה לעשות:

```python
reply = run_command(text)
if reply is not None:
    return reply        # a command: not saved in the history
reply = learn(text) or find_reply(text)
```

עונים לפקודות קודם והן **לא** נשמרות בהיסטוריה, כך ש-`/history` מציגה רק שיחה אמיתית.

**6. `/reset`.** היא חייבת לנקות הכול: `state["name"] = None`, `state["facts"].clear()` ו-`history.clear()`. השתמשו ב-`.clear()` על הרשימה הקיימת במקום לכתוב `history = []` בתוך הפונקציה, מה שרק יוצר משתנה מקומי חדש ומשאיר את ההיסטוריה האמיתית בלי שינוי.

> **שימו לב:**
> - `command` לעומת `command()`: בלי סוגריים שום דבר לא רץ, והתשובה מודפסת כ-`<function show_help at 0x...>`.
> - `TypeError: show_help() takes 0 positional arguments but 1 was given`: פונקציות הפקודה שלכם חייבות לא לקבל פרמטרים, כי `command()` לא מעבירה אף אחד.
> - `UnboundLocalError: cannot access local variable 'history' where it is not associated with a value` מופיעה כשמבצעים השמה `history = []` בתוך פונקציה. שנו את הרשימה במקום עם `.append` ו-`.clear`.
> - שמירת הודעות הפקודה בהיסטוריה גורמת ל-`/history` לרשום את עצמה.

> **תורכם:** כבו את `DEBUG`, הוסיפו `history`, כתבו את `show_help()`, את `show_history()` ואת `reset()` (כל אחת מחזירה את הטקסט שלה), בנו את `COMMANDS`, כתבו את `run_command(text)` וגרמו ל-`respond` להשתמש בה. הטקסטים המדויקים: העזרה היא `Commands: /history shows our conversation, /reset forgets everything, /help shows this list.`; ההיסטוריה היא `We have not talked yet.` כשהיא ריקה, ואחרת `Conversation so far:` ואחריה שורות ממוספרות כמו `1. You: hello`; reset מחזירה `Memory cleared. Nice to meet you again!`; פקודה לא מוכרת נותנת `Unknown command /dance. Try /help.`
