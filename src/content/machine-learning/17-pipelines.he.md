---
title: "Pipelines"
summary: "משרשרים עיבוד מקדים ומודל לאובייקט אחד, כך שהצעדים תמיד רצים בסדר הנכון ושום דבר לא דולף מנתוני הבדיקה."
hints:
  - "משתמשים ב-pipeline בדיוק כמו במודל: fit, predict, score ו-cross_val_score כולם עובדים עליו. בפנים, ה-scaler מאומן על חלק האימון בלבד, ואז המודל מאומן על המספרים המסוקלים."
  - "pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5)); cross_val_score(pipe, X, y, cv=cv).mean(). שמות הצעדים הם שמות המחלקות באותיות קטנות: 'standardscaler' ו-'kneighborsclassifier'."
  - "pipe.named_steps['standardscaler'].mean_[0]   pipe.set_params(kneighborsclassifier__n_neighbors=k)   scores = cross_val_score(pipe, X, y, cv=cv)   print(f'k={k} {scores.mean():.2f}')"
messages:
  - "בנו pipeline עם make_pipeline(StandardScaler(), KNeighborsClassifier(...))."
  - "שימו StandardScaler() בתוך ה-pipeline."
  - "השתמשו ב-pipe.named_steps כדי להציץ לתוך ה-pipeline."
  - "השתמשו ב-pipe.set_params(kneighborsclassifier__n_neighbors=k)."
quiz:
  - q: "מה היתרון העיקרי בלשים את ה-scaler ואת המודל באותו pipeline?"
    options: ["הקוד רץ פי עשרה מהר יותר", "ה-scaler מאומן מחדש על חלק האימון בלבד, בתוך כל קפל, ולכן נתוני בדיקה לא יכולים לדלוף פנימה", "pipelines הופכים את המודל למדויק יותר בעצמם"]
  - q: "אתם קוראים ל-pipe.fit(X_train, y_train). מה קורה לצעד ה-scaler?"
    options: ["הוא לומד ממוצעים וסטיות תקן מ-X_train, משנה את X_train ומעביר אותו למודל", "מדלגים עליו", "הוא לומד גם מ-X_test"]
  - q: "מה שם הפרמטר שקובע את n_neighbors של צעד ה-KNN ב-pipeline של make_pipeline?"
    options: ["n_neighbors", "kneighborsclassifier__n_neighbors", "pipe.n_neighbors"]
    explain: "השם הוא שם הצעד, שני קווים תחתונים, ואז שם הפרמטר."
  - q: "כשקוראים ל-pipe.predict(X_new), ה-scaler"
    options: ["מאומן מחדש על X_new", "מתעלמים ממנו", "רק משנה את X_new, בעזרת המספרים שלמד בזמן ה-fit"]
---

עד עכשיו סקלתם את הנתונים, אחר כך אימנתם מודל, ואחר כך זכרתם לסקל את נתוני הבדיקה באותו אופן. כל צעד נוסף הוא עוד הזדמנות לשכוח. **Pipeline** אורז את הצעדים לאובייקט אחד כך שאי אפשר לטעות בסדר, וולידציה צולבת נשארת ישרה.

## מהו pipeline?

pipeline הוא רשימה של צעדים שבה כל צעד חוץ מהאחרון הוא *טרנספורמר* (משהו עם `fit` ו-`transform`, כמו `StandardScaler`) והצעד האחרון הוא ה*מודל* (משהו עם `fit` ו-`predict`). `make_pipeline` בונה אחד ונותנת לכל צעד שם אוטומטית, שהוא שם המחלקה באותיות קטנות:

```python
from sklearn.pipeline import make_pipeline
pipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
print(list(pipe.named_steps))   # prints: ['standardscaler', 'kneighborsclassifier']
```

ה-pipeline מתנהג אז כמו מודל אחד:

* `pipe.fit(X_train, y_train)` מאמן את ה-scaler על `X_train`, משנה את `X_train`, ואז מאמן את ה-KNN על המספרים המשונים.
* `pipe.predict(X_new)` ו-`pipe.score(X_test, y_test)` משנים את השורות החדשות עם המספרים ש-ה-scaler *כבר למד* ואז שואלים את המודל. ה-scaler אף פעם לא לומד מחדש מהן.
* אפשר להעביר את `pipe` ל-`cross_val_score` ובהמשך לחיפושי grid, בדיוק כמו כל מודל.

## למה זה מונע דליפה

**דליפת נתונים** (data leakage) פירושה שמידע מנתוני הבדיקה מתגנב לאימון. הצורה הקלאסית: סוקלים את *כל* מערך הנתונים קודם (`StandardScaler().fit_transform(X)`) ורק אחר כך מבצעים ולידציה צולבת. ה-scaler ראה את שורות הבדיקה כשחישב את הממוצעים, ולכן כל קפל בדיקה "נלמד מראש" מעט. עם סקיילינג ההשפעה בדרך כלל קטנה, אבל עם בחירת מאפיינים, השלמת ערכים חסרים או קידוד מבוסס מטרה היא יכולה לנפח ציונים בצורה חמורה, והמודל מאכזב אחר כך בשימוש אמיתי. בתוך pipeline, `cross_val_score` מאמנת מחדש את *כל* הצעדים על קפלי האימון בלבד, כך שקפל הבדיקה נשאר לא נגוע. זה כל העניין.

## רואים את ההבדל

בנתוני היין, KNN מחליט לפי מרחקים בין יינות. עמודת `proline` היא במאות, בעוד אחרות כמו `hue` הן בסביבות 1, ולכן בלי סקיילינג proline שולט בכל מרחק. הדיוק בוולידציה צולבת הוא בערך 0.71 בלי סקיילינג ובערך 0.97 עם ה-pipeline: אותו מודל ואותם נתונים, שיפור עצום רק מעיבוד מקדים.

## מציצים פנימה

* `pipe.named_steps["standardscaler"]` מחזיר את אובייקט ה-scaler, ולכן `.mean_[0]` מציג את הממוצע שנלמד של המאפיין הראשון (13.03 עבור alcohol).
* `pipe.set_params(kneighborsclassifier__n_neighbors=9)` משנה הגדרה של צעד. הפורמט הוא **שם הצעד, שני קווים תחתונים, שם הפרמטר**. כך גם חיפושי grid מגיעים לתוך pipelines.

עבור טבלאות עם עמודות מספריות ועמודות טקסט, `ColumnTransformer` מחיל עיבוד מקדים שונה על עמודות שונות ואז משמש כצעד הראשון של `Pipeline`:

```python
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
prep = ColumnTransformer([
    ("num", StandardScaler(), ["size", "age"]),
    ("cat", OneHotEncoder(handle_unknown="ignore"), ["city"]),
])
model = Pipeline([("prep", prep), ("clf", LogisticRegression())])
model.fit(df[["size", "age", "city"]], df["expensive"])   # raw table in, predictions out
```

עכשיו המודל מקבל את הטבלה הגולמית, אפילו עיר שהוא מעולם לא ראה, ומבצע בעצמו את הקידוד והסקיילינג.

## איך קוראים את הפלט

* `unscaled` לעומת `pipeline` הוא ההשפעה של העיבוד המקדים לבדו. אילו שניהם היו שווים, הסקיילינג לא היה משנה למודל הזה.
* `test` הוא בדיקה סופית על שורות שמעולם לא נגעו ב-scaler בזמן ה-fit.
* שורות `k=...` משוות מספרי שכנים בהוגנות כי כל קפל מסקל מחדש בנפרד. בחרו ערך אמצעי, לא את המספר הטוב ביותר היחיד.

> **שימו לב:**
> - `ValueError: Invalid parameter 'n_neighbors' for estimator Pipeline` אומרת ששכחתם את קידומת שם הצעד ואת הקו התחתון הכפול.
> - צעדים מועברים כרשימה של אובייקטים ב-`make_pipeline` אבל כצמדי `("name", object)` ב-`Pipeline`. לבלבל ביניהם נותן `TypeError`.
> - אל תקראו ל-`fit_transform` על ה-scaler ידנית ואז תשימו אותו גם ב-pipeline. זה מסקל פעמיים.
> - אל תבצעו עיבוד מקדים על כל מערך הנתונים "רק כדי להסתכל עליו" ואז תבצעו ולידציה צולבת על התוצאה.
> - עם `make_pipeline`, שני צעדים מאותה מחלקה מקבלים שמות ממוספרים כמו `standardscaler-1` ו-`standardscaler-2`; בדקו את `pipe.named_steps` אם אתם לא בטוחים.

> **תורכם:** השוו KNN על מאפייני היין הגולמיים עם pipeline של scaler ועוד KNN באותם 5 קפלים, אמנו את ה-pipeline על פיצול 70/30 והציצו בממוצע שה-scaler למד, ואז כווננו את מספר השכנים דרך ה-pipeline עם `set_params`.
