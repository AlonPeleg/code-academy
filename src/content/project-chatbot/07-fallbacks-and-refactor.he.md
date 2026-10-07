---
title: "שלב 7: תשובות ברירת מחדל, דוח ביטחון ומחלקת Chatbot"
summary: "מטפלים בהודעות שהבוט לא מבין, מדווחים על רמת הביטחון שלו בסוף ומסדרים הכול במחלקה."
hints:
  - "העבירו את המצב (name, facts, history, rng, מונה ההחמצות, log) ל-__init__ בתור self.name, self.facts... והפכו את הפונקציות שמשתמשות בו למתודות עם self בתור פרמטר ראשון. השאירו עוזרים שלא צריכים זיכרון (clean_words, similarity, classify) כפונקציות רגילות."
  - "fallback(): self.misses += 1; if self.misses >= 2: return LOST; return self.rng.choice(FALLBACKS). ב-find_reply הוסיפו (intent, score) ל-self.log, או (\"unknown\", score) עבור החמצה. report() מחשבת ממוצע של הציונים וסופרת את הכוונות במילון."
  - "class Chatbot:   def __init__(self, seed=SEED):   self.name = None   self.facts = []   self.history = []   self.rng = random.Random(seed)   self.misses = 0   self.log = []   self.commands = {\"/help\": self.show_help, \"/history\": self.show_history, \"/reset\": self.reset}   def main():   bot = Chatbot()   ...   if __name__ == \"__main__\":   main() (השורות שבתוך def, while, if ו-class מוזחות ב-4 רווחים לכל רמה)"
messages:
  - "כתבו class Chatbot."
  - "תנו למחלקה מתודת __init__."
  - "הוסיפו מתודת report()."
  - "תפסו EOFError כדי שהבוט יפרוש בנימוס כשהקלט נגמר."
  - "כתבו פונקציית main()."
quiz:
  - q: "מהו הפרמטר הראשון של מתודה כמו def reset(self)?"
    options: ["האובייקט שהמתודה נקראת עליו", "המחלקה עצמה", "הארגומנט הראשון של הקריאה"]
  - q: "למה שומרים מונה החמצות באובייקט?"
    options: ["כדי להדפיס אותו", "כדי להאיץ את התשובות", "כדי שהבוט יוכל להגיב אחרת כשהוא נכשל כמה פעמים ברצף"]
  - q: "מה עושה השורה if __name__ == \"__main__\": main()?"
    options: ["מריצה את main() פעמיים", "מריצה את main() רק כשהקובץ מורץ ישירות, לא כשהוא מיובא", "מגדירה את main"]
---
הבוט עובד, אבל יש לו שתי חולשות: הוא מטפל גרוע באי-הבנות, והקוד שלו הוא ערימה של משתנים גלובליים ופונקציות מפוזרות. בשלב האחרון הזה תוסיפו **תשובות ברירת מחדל** (fallbacks) חכמות, **דוח ביטחון**, ו**תבצעו ארגון מחדש** (refactor) של הכול למחלקה `Chatbot` עם `main()` נקייה. ארגון מחדש פירושו שינוי המבנה של קוד עובד בלי לשנות מה שהוא עושה, וזה מה ששומר על תוכניות אמיתיות קלות לתחזוקה.

## איפה אנחנו

לבוט יש זיכרון, כוונות עם ציונים, פקודות, היסטוריה ושיחת חולין עם seed. המצב חי במשתנים ברמת המודול (`state`, `history`, `rng`), והודעה שהבוט לא מבין מקבלת תמיד את אותו משפט ברירת מחדל.

## מה נוסיף, ולמה

1. **תשובות ברירת מחדל חכמות יותר.** ההחמצה הראשונה מקבלת אחת מכמה שורות מנומסות של "לא הבנתי" (`FALLBACKS`, נבחרת עם המחולל שיש לו seed). כשהבוט מחמיץ **פעמיים ברצף**, הוא מפסיק לנחש ומפנה אתכם ל-`/help` (`LOST`). מונה, `misses`, עוקב אחרי זה ומתאפס בכל תשובה מוצלחת.
2. **יומן ביטחון.** כל הודעה מוסיפה `(intent, score)` לרשימה. משפטי זיכרון נספרים כ-`("memory", 1.0)`, כוונות שהובנו שומרות את הציון שלהן, והחמצות נשמרות כ-`("unknown", score)`. בסוף הבוט מדווח על עצמו.
3. **מחלקה.** הנתונים והפונקציות שעובדות עליהם שייכים יחד. מחלקה (class) אורזת אותם, כך שאפשר אפילו להריץ שני בוטים עצמאיים (`Chatbot(seed=1)` ו-`Chatbot(seed=2)`).

## הדרכה צעד אחר צעד

**1. שלד המחלקה.** `__init__` רצה כשכותבים `Chatbot()` ומגדירה את המשתנים של האובייקט עצמו עם `self.`:

```python
class Chatbot:
    def __init__(self, seed=SEED):
        self.name = None
        self.facts = []
        self.history = []
        self.rng = random.Random(seed)
        self.misses = 0
        self.log = []
        self.commands = {"/help": self.show_help, "/history": self.show_history, "/reset": self.reset}
```

`self.show_help` (**מתודה קשורה**, bound method) היא פונקציה שכבר זוכרת את האובייקט שלה, ולכן `command()` לא צריכה ארגומנטים.

**2. הופכים פונקציות למתודות.** הזיזו אותן פנימה אל המחלקה והוסיפו `self` בתור פרמטר ראשון. בפנים, `state["name"]` הופך ל-`self.name`, `history` הופך ל-`self.history`, `rng` הופך ל-`self.rng`, וקריאות כמו `learn(text)` הופכות ל-`self.learn(text)`. פונקציות שלא צריכות זיכרון (`clean_words`, `similarity`, `classify`) נשארות בחוץ כפונקציות רגילות.

**3. תשובת ברירת מחדל ויומן.**

```python
def fallback(self):
    self.misses += 1
    if self.misses >= 2:
        return LOST
    return self.rng.choice(FALLBACKS)
```

ב-`find_reply`: מתחת לסף מוסיפים `("unknown", score)` ומחזירים `self.fallback()`; אחרת מאפסים `self.misses = 0`, מוסיפים `(intent, score)` ובוחרים תשובה כמו קודם. ב-`respond`, `learn` מוצלחת מאפסת את `misses` ומוסיפה `("memory", 1.0)`.

**4. הדוח.** חשבו את מספר ההודעות, כמה מהן היו `"unknown"`, את הציון הממוצע (`sum(...) / total`, מוצג עם `format(average, ".2f")`) ומילון של ספירות, ממוין כך שהנפוץ ביותר ראשון ואחר כך לפי סדר אלפביתי:

```python
ordered = sorted(counts.items(), key=lambda item: (-item[1], item[0]))
```

`key=` אומר ל-`sorted` במה להשוות; הזוג `(-count, name)` אומר "ספירות גדולות קודם, ובשוויון לפי שם". אל תשכחו יומן ריק: הימנעו מחלוקה באפס.

**5. `main()`.** צרו את הבוט, הריצו לולאה, וסיימו עם הפרידה והדוח. תפסו `EOFError` כדי שאם הקלט פשוט נגמר (המשתמש סוגר את הטרמינל) הבוט יפרוש בנימוס במקום לקרוס:

```python
try:
    text = listen()
except EOFError:
    break
```

סיימו את הקובץ עם `if __name__ == "__main__": main()`. זה מריץ את `main()` כשמתחילים את הקובץ ישירות אבל לא כשקובץ אחר מייבא אותו, כך שאפשר להשתמש בבוט שוב ולבדוק אותו.

> **שימו לב:**
> - אם שוכחים `self.` מקבלים `NameError: name 'history' is not defined` או שנוצר בשקט משתנה מקומי.
> - אם שוכחים `self` בתור פרמטר ראשון: `TypeError: Chatbot.reset() takes 0 positional arguments but 1 was given`.
> - איפוס `misses` במקום הלא נכון משנה מתי `LOST` מופיעה. אפסו בכל הודעה שהובנה, וספרו בכל החמצה.
> - דוח שמחלק ב-`len(self.log)` קורס עם `ZeroDivisionError` בשיחה ריקה.

## מה לבנות הלאה

* שמרו את ה-`Chatbot` לקובץ עם `json` כדי שהבוט יזכור אתכם בין הרצות.
* החליפו את ציון חפיפת המילים בציון חכם יותר (התעלמו ממילות עצירה, או תנו משקל גבוה יותר למילים נדירות).
* תנו לכוונות פעולות: להגיד את השעה האמיתית, לבצע חשבון, לחפש מילה.
* קראו מטרמינל אמיתי והחליפו את `listen()` בממשק אינטרנט או אפליקציית צ'אט; המחלקה `Chatbot` לא צריכה להשתנות.
* כתבו בדיקות שמזינות הודעות ל-`Chatbot(seed=42).respond(...)` ומשוות את התשובות: המחולל עם ה-seed שלכם מאפשר את זה.

> **תורכם:** בנו `class Chatbot` כמתואר (מצב ב-`__init__`, מתודות `learn`, `show_help`, `show_history`, `reset`, `run_command`, `fallback`, `find_reply`, `respond`, `report`), השאירו את `listen`, `clean_words`, `similarity` ו-`classify` כפונקציות, כתבו את `main()` וקראו לה תחת `if __name__ == "__main__":`. פורמט הדוח מופיע בהערות של הקוד ההתחלתי ובפלט הצפוי.
