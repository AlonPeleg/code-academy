---
title: "שלב 5: הנדסת מאפיינים וצינורות"
summary: "מוסיפים מאפיין יחס, מקודדים את השכונה ב-one-hot, מכווננים את קנה המידה של המספרים ועוטפים הכול ב-Pipeline של scikit-learn."
hints:
  - "מודלים צריכים רק מספרים, והם עובדים הכי טוב על קני מידה דומים. ColumnTransformer מפעיל טרנספורמר אחד על עמודות המספרים ואחר על עמודת הטקסט. Pipeline מדביק עיבוד מקדים ומודל לאובייקט אחד עם fit ו-predict."
  - "prep = ColumnTransformer([(\"num\", StandardScaler(), numeric_cols), (\"hood\", OneHotEncoder(handle_unknown=\"ignore\"), [\"neighbourhood\"])]). אחר כך pipe = Pipeline([(\"prep\", prep), (\"model\", LinearRegression())]). cross_val_score מחזירה שגיאות שליליות עם scoring=\"neg_mean_absolute_error\"."
  - "frame = frame.copy(); frame[\"area_per_bedroom\"] = frame[\"area_m2\"] / frame[\"bedrooms\"]; return frame   cv_full = -cross_val_score(pipe, X_train, y_train, cv=5, scoring=\"neg_mean_absolute_error\").mean()   names = pipe.named_steps[\"prep\"].get_feature_names_out().tolist()"
quiz:
  - q: "למה מקודדים את השכונה ב-one-hot ולא ממספרים אותה 0, 1, 2?"
    options: ["מספור היה אומר בטעות ש-Hilltop הוא חצי מ-Riverside, ו-one-hot נותן לכל מקום עמודת כן/לא משלו", "קידוד one-hot מהיר יותר", "אי אפשר לשמור טקסט ב-DataFrame"]
    explain: "מספרים רומזים על סדר ועל מרחקים שאין לקטגוריות."
  - q: "מה היתרון העיקרי בלשים עיבוד מקדים ומודל בתוך Pipeline אחד?"
    options: ["זה הופך את המודל למדויק יותר בעצמו", "אותם שלבים מופעלים באופן זהה באימון, ב-cross-validation ובחיזוי, בלי דליפה", "זה מבטל את הצורך במאפיינים"]
  - q: "cross_val_score(..., scoring=\"neg_mean_absolute_error\") מחזירה את הערך מינוס 18.6. מה ה-MAE?"
    options: ["-18.6", "0.186", "18.6"]
    explain: "scikit-learn מגדילה ציונים, ולכן שגיאות מדווחות כשליליות. שימו מינוס לפניהן."
messages:
  - "כתבו פונקציה def add_features(frame)."
  - "שלבו את העיבוד המקדים עם ColumnTransformer([...])."
  - "קודדו את השכונה עם OneHotEncoder(...)."
  - "כווננו את קנה המידה של המספרים עם StandardScaler()."
  - "שרשרו עיבוד מקדים ומודל עם Pipeline([...])."
  - "תנו ציון עם cross_val_score(...)."
---
מודלים כמעט אף פעם לא משתפרים כי בחרתם אלגוריתם מתוחכם יותר; הם משתפרים כי נתתם להם קלט טוב יותר. השלב הזה מראה את הדרך הסטנדרטית להכין קלט למודל, ואיך לשמור את כל המתכון באובייקט אחד.

## איפה אנחנו עומדים

בפרויקט יש עכשיו טבלה נקייה, פיצול לאימון ולבדיקה וקו בסיס: ניחוש הממוצע תמיד עולה כ-66 אלף בטעות, וקו על השטח בלבד כ-34. קוד ההתחלה שומר את הקוד עד כאן ויש בו את הייבואים של השלב הזה.

## מה נוסיף

* **מאפיין חדש** שנוצר ממאפיינים ישנים (**הנדסת מאפיינים**, feature engineering): השטח לחדר שינה, שמבדיל דירה צפופה מבית מרווח.
* **קידוד one-hot** עבור `neighbourhood`, כי מודלים יכולים לעשות חשבון רק על מספרים.
* **קנה מידה** (scaling) לעמודות המספריות.
* **Pipeline** שמחזיק יחד את העיבוד המקדים ואת המודל.

## מדריך צעד אחר צעד

**1. פונקציית מאפיינים לשימוש חוזר.** שימו את המתכון בפונקציה, כי בהמשך תצטרכו לבנות בדיוק את אותו מאפיין לבתים חדשים לגמרי (שלב 8):

```python
def add_features(frame):
    frame = frame.copy()          # never change the caller's table by accident
    frame["area_per_bedroom"] = frame["area_m2"] / frame["bedrooms"]
    return frame
```

הפעילו אותה על `X_train` ועל `X_test` בנפרד. חישוב שורה אחר שורה לא יכול לדלוף מידע ביניהם. אבל היו ישרים לגבי התוצאות: היחס הזה בעצמו עוזר רק מעט כאן. הנדסת מאפיין היא השערה, והציון אומר לכם אם צדקתם.

**2. קידוד one-hot.** השכונה הופכת לשלוש עמודות כן/לא:

| neighbourhood | is_Hilltop | is_Old Town | is_Riverside |
|---|---|---|---|
| Hilltop | 1 | 0 | 0 |
| Riverside | 0 | 0 | 1 |

מספור 0, 1, 2 היה אומר למודל בטעות ש-Riverside היא "פי שניים" מ-Old Town. `OneHotEncoder(handle_unknown="ignore")` גם ממשיך לעבוד כשמופיעה בהמשך שכונה חדשה, בכך שהוא כותב עבורה אפסים.

**3. קנה מידה.** `StandardScaler` מזיז כל עמודה מספרית לממוצע 0 ופיזור 1, כך ששטחים (35 עד 177) וחדרי שינה (1 עד 6) נמצאים בקני מידה דומים. ברגרסיה לינארית רגילה התחזיות לא משתנות, אבל מודלים רבים (מבוססי מרחק, מוסדרים) צריכים את זה, ולכן זה הרגל טוב.

**4. אמרו לכל טרנספורמר באילו עמודות להשתמש.** `ColumnTransformer` מקבל רשימה של `(name, transformer, columns)`:

```python
prep = ColumnTransformer([
    ("num", StandardScaler(), numeric_cols),
    ("hood", OneHotEncoder(handle_unknown="ignore"), ["neighbourhood"]),
])
pipe = Pipeline([("prep", prep), ("model", LinearRegression())])
```

`pipe.fit(X_train, y_train)` קודם מתאימה את העיבוד המקדים לשורות האימון, ואז מאמנת את המודל על השורות שעברו שינוי; `pipe.predict(new_rows)` חוזרת על אותו שינוי אוטומטית. אחרי האימון, `pipe.named_steps["prep"].get_feature_names_out()` מציגה את 8 העמודות שנוצרו (5 מספרים ועוד 3 עמודות שכונה).

**5. האם זה עזר?** שפטו רק על נתוני האימון, עם **cross-validation**: `cross_val_score(model, X, y, cv=5, scoring="neg_mean_absolute_error")` מאמנת חמש פעמים, בכל פעם נותנת ציון על חמישית אחרת משורות האימון, ומחזירה חמישה ציונים. הם שליליים (scikit-learn תמיד מגדילה), ולכן כתבו `-cross_val_score(...).mean()`. מכיוון שהמודל נמצא בתוך ה-pipeline, קנה המידה נלמד מחדש בתוך כל קיפול (fold), כך ששום דבר לא דולף. צפו שהשגיאה תרד מכ-30 (שטח בלבד) לכ-19.

> **שימו לב:**
> - התאמת scaler לכל הנתונים לפני הפיצול מדליפה מידע מקבוצת הבדיקה. כשהוא בתוך ה-pipeline זה נמנע.
> - ציון עמודה שלא קיימת זורק `ValueError: A given column is not a column of the dataframe`. עמודת היחס קיימת רק אחרי `add_features`.
> - בלי `handle_unknown="ignore"`, קטגוריה שלא נראתה בנתונים חדשים זורקת `ValueError: Found unknown categories`.
> - לעולם אל תבנו יחסים עם המטרה (מחיר למטר רבוע): העמודה הזו מכילה את התשובה, והיא **דליפת מטרה** (target leakage).

> **תורכם:** כתבו את `add_features`, הפעילו אותה על שני החלקים, הדפיסו `area per bedroom, mean:`; בנו את `prep` ו-`pipe`, אמנו את ה-pipe והדפיסו `columns after preprocessing:` ועוד את 3 שמות המאפיינים האחרונים; חשבו את `cv_area` (`LinearRegression` רגילה על השטח בלבד) ואת `cv_full` (כל ה-pipe) עם `cv=5` על נתוני האימון והדפיסו את שניהם מעוגלים לספרה עשרונית אחת, ואחריהם `more features helped:`.
