---
title: "שלב 4: כוונות (Intents) ורמת ביטחון"
summary: "מדרגים עד כמה הודעה מתאימה לכל כוונה לפי חפיפת מילים, ומודים כשהציון נמוך מדי."
hints:
  - "הפכו את ההודעה ואת כל משפט דוגמה לקבוצות (sets) של מילים. ציון החפיפה הוא: מילים שנמצאות בשתי הקבוצות חלקי מילים שנמצאות באחת מהן. שמרו את הכוונה עם הציון הגבוה ביותר, וחזרו לתשובת ברירת המחדל כשהציון הטוב ביותר נמוך מהסף."
  - "a & b הוא החיתוך (intersection), a | b האיחוד (union): len(a & b) / len(a | b). classify עוברת בלולאה על INTENTS.items() ועל כל תבנית, וזוכרת את הזוג הטוב ביותר (name, score) עם if score > best_score."
  - "def similarity(words_a, words_b):   if not words_a or not words_b:   return 0.0   return len(words_a & words_b) / len(words_a | words_b)   ב-find_reply: intent, score = classify(text); if score < THRESHOLD: return FALLBACK; return INTENTS[intent][\"reply\"].format(name=state[\"name\"] or \"friend\") (השורות שבתוך def, while, if ו-class מוזחות ב-4 רווחים לכל רמה)"
messages:
  - "כתבו את similarity(words_a, words_b)."
  - "כתבו את classify(text)."
  - "הפכו את המילים לקבוצות עם set(...)."
  - "השתמשו ב-& כדי למצוא את המילים המשותפות של שתי קבוצות."
  - "השתמשו בקבוע THRESHOLD כדי להחליט מתי הבוט לא מבין."
quiz:
  - q: "עבור קבוצות המילים {\"how\",\"are\",\"you\"} ו-{\"how\",\"are\",\"you\",\"today\"}, מהו ציון החפיפה (משותף / כל המילים השונות)?"
    options: ["0.75", "0.5", "1.0"]
  - q: "למה צריך סף ביטחון (confidence threshold)?"
    options: ["כדי למיין את הכוונות", "כדי להאריך תשובות", "כדי שהבוט יוכל להודות שלא הבין, במקום לתת תשובה שגויה"]
  - q: "מה מכילה set(\"a b a\".split())?"
    options: ["[\"a\", \"b\", \"a\"]", "{\"a\", \"b\"}", "{\"a\", \"b\", \"a\"}"]
    explain: "קבוצה שומרת כל ערך שונה פעם אחת בלבד."
---
כללי מילות מפתח נשברים בקלות: `hey bot!` לא מתאים לשום דבר, ו-`how are you today?` עלולה להתאים לכלל שלא התכוונתם אליו. בשלב הזה הבוט לומד **להשוות** את המשפט שלכם למשפטי דוגמה, לבחור את ה**כוונה** (intent) הקרובה ביותר, ולמדוד את **רמת הביטחון** (confidence) של עצמו. זה אותו רעיון (בקטן) שעומד מאחורי מערכות אמיתיות להבנת שפה.

## איפה אנחנו

הבוט זוכר את השם שלכם ועובדות (`learn`) ועונה לפי כללי מילות מפתח. הכללים נבדקים לפי הסדר והראשון מנצח, בלי שום מושג עד כמה ההתאמה הייתה טובה.

## מה נוסיף, ולמה

**כוונה** היא מה שהמשתמש רוצה להשיג: לברך, לשאול מה שלום הבוט, לבקש עזרה. במקום מילת מפתח אחת לכל כלל, לכל כוונה יש עכשיו כמה משפטי דוגמה (**תבניות**, patterns). לכל תבנית נחשב ציון דמיון בין 0.0 (אין שום דבר משותף) ל-1.0 (אותן מילים), נשמור את הטוב ביותר, ו:

* אם הציון הטוב ביותר הוא לפחות ה**סף** (threshold) (0.4), נענה עם התשובה של הכוונה הזו;
* אחרת נודה "אני לא בטוח שהבנתי", במקום לנחש.

הנתונים (`INTENTS`, `THRESHOLD`, `DEBUG`) כבר כתובים בשבילכם בקוד ההתחלתי.

## הדרכה צעד אחר צעד

**1. קבוצות (sets).** `set` שומרת כל ערך ייחודי פעם אחת, ויש לה פעולות חפיפה מהירות:

```python
a = set("how are you today".split())   # {"how", "are", "you", "today"}
b = set("how are you".split())         # {"how", "are", "you"}
a & b    # shared words (intersection)  -> {"how", "are", "you"}
a | b    # all different words (union)  -> {"how", "are", "you", "today"}
```

**2. הציון.** מילים משותפות חלקי כל המילים השונות (המדד הזה נקרא דמיון ג'קארד, Jaccard):

```python
def similarity(words_a, words_b):
    if not words_a or not words_b:
        return 0.0
    return len(words_a & words_b) / len(words_a | words_b)
```

עבור הקבוצות שלמעלה: 3 / 4 = 0.75. שתי קבוצות זהות נותנות 1.0, וקבוצות בלי שום דבר משותף נותנות 0.0. השומר (guard) בראש הפונקציה מונע חלוקה באפס עבור הודעה ריקה (`ZeroDivisionError: division by zero`).

**3. מוצאים את הכוונה הטובה ביותר.** עוברים בלולאה על כל כוונה ועל כל תבנית, וזוכרים את הטובה ביותר:

```python
def classify(text):
    user_words = set(clean_words(text))
    best_intent = None
    best_score = 0.0
    for name, intent in INTENTS.items():
        for pattern in intent["patterns"]:
            score = similarity(user_words, set(pattern.split()))
            if score > best_score:
                best_intent = name
                best_score = score
    return best_intent, best_score
```

פונקציה יכולה להחזיר **שני ערכים** (tuple) והקוד שקורא פורס אותם: `intent, score = classify(text)`.

**4. מחליטים.** ב-`find_reply`: מסווגים, וכש-`DEBUG` דלוק מדפיסים שורה כמו `   [intent=greeting score=1.00]` (`format(score, ".2f")` מציגה שתי ספרות אחרי הנקודה). אם `score < THRESHOLD` מחזירים `FALLBACK`; אחרת לוקחים את `INTENTS[intent]["reply"]` ומשלבים בה את השם.

הריצו את השיחה המתוסרטת וקראו את שורות ה-debug. שימו לב ש-`what is the weather like today` מקבלת 0.83 עבור כוונת מזג האוויר, ואילו `tell me about dinosaurs` מקבלת רק 0.20 ונוחתת בתשובת ברירת המחדל. אפשר להקטין או להגדיל את `THRESHOLD` כדי לראות את הבוט נהיה נועז יותר או זהיר יותר.

> **שימו לב:**
> - `len(a & b) / len(a | b)` הוא מספר עשרוני (float) ב-Python 3 (`3 / 4` הוא `0.75`); השתמשו ב-`//` רק כשאתם רוצים מספרים שלמים.
> - אל תשכחו `set(...)` על ההודעה: `list & list` זורקת `TypeError: unsupported operand type(s) for &: 'list' and 'list'`.
> - אם `best_intent` נשאר `None` (ציון 0.0) ואתם ניגשים ל-`INTENTS[None]`, מקבלים `KeyError: None`. בדיקת הסף חייבת לבוא קודם.
> - מילות עצירה (stop words) כמו `the` ו-`is` מתאימות בקלות רבה מדי. זה בסדר עבור בוט צעצוע; מערכות אמיתיות מסירות אותן או נותנות להן משקל.
> - ציונים קרובים לסף שבריריים: מילה אחת נוספת משנה את התשובה. בגלל זה אנחנו מדפיסים את הציון.

> **תורכם:** כתבו את `similarity(words_a, words_b)` ואת `classify(text)`, ועדכנו את `find_reply` כך שתשתמש בהן: הדפיסו את שורת ה-debug `   [intent=<name> score=<0.00>]` (שלושה רווחים בהתחלה) כש-`DEBUG` אמת, החזירו `FALLBACK` מתחת ל-`THRESHOLD`, ואחרת את התשובה של הכוונה עם `{name}` מלא.
