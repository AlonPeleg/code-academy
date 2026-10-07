---
title: "שלב 3: זוכרים את המשתמש"
summary: "שומרים מילון state ומנתחים משפטים כמו \"my name is ...\" בעזרת מתודות של מחרוזות."
hints:
  - "הזיכרון הוא מילון שחי יותר מהודעה אחת: state = {\"name\": None, \"facts\": []}. פונקציית למידה בודקת את תחילת המשפט ושומרת את השאר."
  - "sentence = \" \".join(clean_words(text)); if sentence.startswith(\"my name is \"): state[\"name\"] = sentence[len(\"my name is \"):].title(). החיתוך שאחרי התחילית הוא השם. החזירו None בסוף כשלא נלמד שום דבר, ואז השתמשו ב-learn(text) or find_reply(text)."
  - "def learn(text):   sentence = \" \".join(clean_words(text))   if sentence.startswith(\"my name is \"):   state[\"name\"] = sentence[len(\"my name is \"):].title()   return \"Nice to meet you, \" + state[\"name\"] + \"!\"   ...   return None   def respond(text):   return learn(text) or find_reply(text) (השורות שבתוך def, while, if ו-class מוזחות ב-4 רווחים לכל רמה)"
messages:
  - "שמרו את הזיכרון במילון בשם state."
  - "השתמשו ב-.startswith() כדי לזהות \"my name is\" ו-\"i like\"."
  - "הוסיפו עובדות לרשימה עם .append()."
  - "מלאו את {name} בתשובות עם .format(name=...)."
quiz:
  - q: "מה מחזירה \"my name is ada\".startswith(\"my name is \")?"
    options: ["False", "\"ada\"", "True"]
  - q: "מה נותן sentence[len(\"my name is \"):] עבור \"my name is ada\"?"
    options: ["\"my name\"", "\"ada\"", "\"is ada\""]
    explain: "החיתוך מתחיל אחרי התחילית, ולכן נשאר רק השם."
  - q: "מה עושה learn(text) or find_reply(text)?"
    options: ["משתמשת בתשובה של learn אם היא לא ריקה/None, ואחרת ב-find_reply", "תמיד קוראת לשתיהן", "קוראת קודם ל-find_reply"]
---
בוט ששוכח מי אתם אחרי כל משפט מרגיש קר. בשלב הזה הוא מקבל **זיכרון**: הוא לומד את השם שלכם ואת הדברים שאתם אוהבים, ומשתמש בהם מאוחר יותר. תתרגלו מילונים (dictionaries) בתור מצב (state), וניתוח משפטים בעזרת מתודות של מחרוזות.

## איפה אנחנו

הבוט מברך אתכם, מנקה את ההודעה שלכם למילים ועונה ממילון של כללי מילות מפתח. כל הודעה מטופלת לגמרי בפני עצמה, ושום דבר לא נזכר בין שתי שורות.

## מה נוסיף, ולמה

עוזרים אמיתיים שומרים **מצב** (state): עובדות ששורדות מהודעה אחת להודעה הבאה. ב-Python המכל הפשוט ביותר למצב הוא מילון:

```python
state = {"name": None, "facts": []}
```

`None` אומר "אין עדיין ערך" (אנחנו לא יודעים את השם), ו-`facts` היא רשימה ריקה שתאסוף דברים כמו `"chess"`. מכיוון ש-`state` נוצר **פעם אחת, מחוץ ללולאה**, הוא חי כל עוד התוכנית חיה. אם תכניסו אותו לתוך הלולאה, הוא יימחק בכל הודעה.

אנחנו צריכים גם **לנתח** (parse) משפטים. ניתוח פירושו להוציא את החלק השימושי מתוך טקסט. עבור `my name is ada lovelace`, החלק השימושי הוא כל מה שאחרי ההתחלה הקבועה.

## הדרכה צעד אחר צעד

**1. מנרמלים את המשפט.** השתמשו שוב ב-`clean_words` והדביקו את המילים בחזרה עם רווחים בודדים, כך שאותיות גדולות, רווחים מיותרים ופיסוק כבר לא משנים:

```python
sentence = " ".join(clean_words(text))     # "My name is Ada!" -> "my name is ada"
```

`" ".join(list)` הוא ההפך מ-`split`: הוא בונה מחרוזת אחת מתוך רשימה, והטקסט שלפני `.join` משמש כדבק.

**2. מזהים את התבנית.** `startswith` בודקת את תחילת המחרוזת:

```python
if sentence.startswith("my name is "):
    name = sentence[len("my name is "):]    # slice: everything after the prefix
```

`len("my name is ")` הוא 11, ו-`sentence[11:]` אומר "ממיקום 11 עד הסוף". אחר כך `.title()` הופכת לגדולה את האות הראשונה של כל מילה: `"ada lovelace".title()` היא `"Ada Lovelace"`.

**3. שומרים ועונים.**

```python
state["name"] = name.title()
return "Nice to meet you, " + state["name"] + "!"
```

עשו אותו דבר עבור `i like ...`: `state["facts"].append(thing)`. שימו לב שהעובדות באות מהמשפט הנקי באותיות קטנות, ולכן `Python programming.` נזכר בתור `python programming`.

**4. עונים על שאלות על הזיכרון.** `what is my name` מחזיר את השם, או `You have not told me your name yet.` כש-`state["name"]` עדיין `None`. ערך ריק כמו `None` או `""` נחשב שקר (false) ב-`if`, ולכן `if state["name"]:` אומר "אם אנחנו יודעים את השם". עבור `what do you know about me` בנו רשימה של משפטים וחברו אותם: `" ".join(parts)`.

**5. לא הכול הוא זיכרון.** `learn(text)` מחזירה תשובה כשלמדה או ענתה על משהו, ו-`None` אחרת. אז שורה אחת אלגנטית מחליטה מי עונה:

```python
def respond(text):
    return learn(text) or find_reply(text)
```

`a or b` נותן `a` כש-`a` אינו ריק/`None`, ואחרת `b`. הלולאה מדפיסה את `respond(text)`.

**6. משתמשים בשם.** חלק מתשובות הכללים מכילות עכשיו `{name}`. `reply.format(name=...)` מחליפה את מציין המקום: `"Hello, {name}!".format(name="Ada")`. השתמשו ב-`state["name"] or "friend"` כדי ששם לא ידוע יהפוך ל-`friend`.

> **שימו לב:**
> - רווח חסר בתחילית (`"my name is"` במקום `"my name is "`) משאיר רווח מוביל בשם.
> - `KeyError: 'name'` קורה כשטועים בהקלדת מפתח כמו `state["Name"]`; מפתחות הם תלויי רישיות.
> - `TypeError: can only concatenate str (not "NoneType") to str` אומר שחיברתם `None` לטקסט. בדקו קודם `if state["name"]:`.
> - `AttributeError: 'NoneType' object has no attribute 'title'` אומר שהשם מעולם לא נשמר.
> - כתיבת `state = {...}` בתוך פונקציה יוצרת מילון מקומי חדש במקום לשנות את המילון המשותף. שינוי `state["name"] = ...` בסדר גמור בלי `global`, כי אתם משנים את המילון ולא מחליפים אותו.

> **תורכם:** צרו את `state`, כתבו את `learn(text)` ואת `respond(text)`, ומלאו את `{name}` ב-`find_reply`. התשובות המדויקות: `Nice to meet you, X!`, `Noted: you like X.`, `Your name is X.`, `You have not told me your name yet.`, `Your name is X. You like a and b.` (השמיטו את החלק שאינכם יודעים), `Nothing yet. Tell me your name or what you like.`. בסוף הבוט אומר `Bot: Goodbye, <name or friend>!`.
