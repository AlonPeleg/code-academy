---
title: "שגיאות"
summary: "מטפלים בכשלים בדרך של Go עם ערכי error, עטיפה (wrapping), errors.Is, errors.As וטיפוסי שגיאה מותאמים."
hints:
  - "ב-Go פונקציה שיכולה להיכשל מחזירה ערך error נוסף בתור התוצאה האחרונה שלה: (int, error). בהצלחה מחזירים את הערך ו-nil, בכישלון מחזירים ערך אפס ו-error שאינו nil, כמו errors.New(\"...\")."
  - "fmt.Errorf עם ה-verb ‏%w עוטף שגיאה אחרת כך ש-errors.Is עדיין יכולה למצוא אותה. שגיאה מותאמת היא כל טיפוס עם המתודה Error() string: type ValidationError struct { Field, Reason string }, func (e *ValidationError) Error() string { return ... }."
  - "func safeDivide(a, b int) (int, error) { if b == 0 { return 0, errors.New(\"division by zero\") }; return a / b, nil }  var ErrNotFound = errors.New(\"not found\")  func find(m map[string]int, key string) (int, error) { v, ok := m[key]; if !ok { return 0, fmt.Errorf(\"find %q: %w\", key, ErrNotFound) }; return v, nil }  type ValidationError struct { Field, Reason string }  func (e *ValidationError) Error() string { return \"field \" + e.Field + \": \" + e.Reason }  func validateAge(age int) error { if age < 0 { return &ValidationError{\"age\", \"must not be negative\"} }; return nil }"
messages:
  - "כתבו func safeDivide(a, b int) (int, error)."
  - "עטפו את ErrNotFound עם fmt.Errorf ועם ה-verb ‏%w."
  - "תנו ל-ValidationError מתודה Error() string (עם pointer receiver)."
quiz:
  - q: "איך Go בדרך כלל מדווח שפונקציה נכשלה?"
    options: ["על ידי זריקת exception", "על ידי החזרת ערך error בתור התוצאה האחרונה", "על ידי הדפסה למסך", "על ידי עצירת התוכנית"]
  - q: "מה עושה ה-verb ‏%w ב-fmt.Errorf?"
    options: ["מדפיס את האות w", "עוטף שגיאה כך ש-errors.Is ו-errors.As עדיין יכולות למצוא אותה", "כותב לקובץ", "מעצב רוחב"]
  - q: "מה ההבדל בין errors.Is לבין errors.As?"
    options: ["Is בודקת אם בשרשרת יש ערך שגיאה מסוים, ו-As מוצאת שגיאה מטיפוס נתון", "הן זהות", "As משווה מחרוזות ו-Is משווה מספרים", "Is עובדת רק על panics"]
  - q: "מתי panic מתאים ב-Go?"
    options: ["בכל כישלון רגיל, כמו קובץ חסר", "בטעויות מתכנת שאי אפשר להתאושש מהן, לא בשגיאות רגילות", "במקום return", "בכל פעם שלולאה מסתיימת"]
---

כל תוכנית אמיתית צריכה להתמודד עם דברים שמשתבשים: קובץ חסר, משתמש שהקליד משהו מוזר, קריאת רשת שנכשלת. שפות רבות משתמשות ב-**exceptions** שעפים במעלה מחסנית הקריאות. Go בוחר בגישה אחרת, פשוטה בכוונה: כשלים הם פשוט **ערכים** שהפונקציות מחזירות, ומטפלים בהם עם משפטי `if` רגילים.

## הטיפוס error

`error` הוא interface מובנה וקטן:

```go
type error interface {
    Error() string
}
```

כל דבר שיש לו מתודה `Error() string` הוא שגיאה. לפי המסורת, פונקציה שיכולה להיכשל מחזירה את ה-`error` שלה בתור התוצאה **האחרונה**. `nil` פירושו "אין שגיאה":

```go
func safeDivide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
```

הקורא בודק את השגיאה מיד:

```go
result, err := safeDivide(10, 0)
if err != nil {
    fmt.Println("error:", err)   // prints: error: division by zero
    return
}
fmt.Println(result)
```

התבנית `if err != nil` מופיעה בכל מקום ב-Go. היא יכולה להרגיש חוזרת על עצמה, אבל היא משאירה את נתיב השגיאה גלוי בקוד, כך שאי אפשר לשכוח שקריאה יכולה להיכשל. לעולם אל תתעלמו משגיאה עם `_` אלא אם אתם בטוחים שזה לא משנה.

`errors.New("text")` יוצר שגיאה פשוטה. `fmt.Errorf("could not open %s: %d", name, code)` בונה שגיאה עם עיצוב. מסורת: הודעות שגיאה מתחילות באות קטנה ואין בהן נקודה בסוף, כי לעתים קרובות מחברים אותן להודעות ארוכות יותר.

## שגיאות זקיף (Sentinel) ועטיפה

לעתים קרובות הקוראים צריכים לדעת **איזו** שגיאה קרתה. **שגיאת זקיף** (sentinel error) היא משתנה ברמת החבילה שכולם יכולים להשוות אליו:

```go
var ErrNotFound = errors.New("not found")
```

כשמוסיפים הקשר בדרך למעלה, **עוטפים** את המקור עם `%w`:

```go
return 0, fmt.Errorf("find %q: %w", key, ErrNotFound)
// message: find "zed": not found
```

השגיאה העטופה שומרת על השרשרת שלמה. בודקים אותה עם `errors.Is`, שמסתכלת דרך כל השכבות:

```go
if errors.Is(err, ErrNotFound) {
    // handle the missing case
}
```

**אל** תשוו עם `err == ErrNotFound` כשיש עטיפה, כי השגיאה העטופה היא ערך אחר.

## טיפוסי שגיאה מותאמים

כששגיאה צריכה לשאת נתונים, מגדירים טיפוס עם מתודה `Error()`:

```go
type ValidationError struct {
    Field  string
    Reason string
}

func (e *ValidationError) Error() string {
    return "field " + e.Field + ": " + e.Reason
}
```

אחר כך שולפים אותו משרשרת שגיאות עם `errors.As`, ומעבירים מצביע למשתנה מהטיפוס שמחפשים:

```go
var ve *ValidationError
if errors.As(err, &ve) {
    fmt.Println("bad field:", ve.Field)
}
```

`errors.Is` שואלת "האם זו **השגיאה הזאת**?", ו-`errors.As` שואלת "האם זו **שגיאה מהסוג הזה**, ותני לי אותה".

## מלכודת ה-interface שהוא nil

מלכודת מפורסמת: אם פונקציה מחזירה את ה-interface `error`, החזירו `nil` פשוט בהצלחה, **לא** מצביע nil מהטיפוס המותאם שלכם:

```go
func validate() error {
    var e *ValidationError = nil
    return e          // WRONG: this is a non-nil error holding a nil pointer
}
```

ל-interface המוחזר יש טיפוס בפנים, ולכן `err != nil` הוא `true`. תמיד כתבו `return nil` במפורש.

## panic ו-recover

ב-Go יש אכן `panic`, שעוצר את הריצה הרגילה ומפרק את המחסנית. הוא מיועד ל**טעויות מתכנת שאי אפשר להתאושש מהן** (מצב בלתי אפשרי, אינדקס מחוץ לתחום), ולא לכשלים צפויים כמו קובץ חסר. פונקציית `deferred` יכולה לתפוס panic עם `recover()`:

```go
func safe() {
    defer func() {
        if r := recover(); r != nil {
            fmt.Println("recovered:", r)
        }
    }()
    panic("something terrible")
}
```

ספריות משתמשות בזה בפנים, אבל קוד אפליקציה רגיל צריך להחזיר שגיאות במקום.

> **שימו לב:**
> - התעלמות מהשגיאה, `result, _ := safeDivide(1, 0)`, מסתירה כשלים. תקבלו `0` ותמשיכו עם נתונים שגויים.
> - שימוש בתוצאה לפני בדיקת השגיאה. בכישלון ערכי ההחזרה האחרים הם בדרך כלל סתם ערכי אפס.
> - עטיפה עם `%v` במקום `%w` שומרת את הטקסט אבל מאבדת את השרשרת, ולכן `errors.Is` מחזירה `false`.
> - `errors.As(err, ve)` עם ארגומנט שאינו מצביע גורמת להתראה של `go vet` ול-panic: הארגומנט השני חייב להיות מצביע למשתנה שלכם, `&ve`.
> - השוואת שגיאות עם `==` אחרי עטיפה נכשלת. השתמשו ב-`errors.Is`.
> - שוכחים ש-`Error()` נמצאת על טיפוס המצביע: `func (e *ValidationError) Error()` אומר שרק `*ValidationError` הוא שגיאה, ולכן החזירו `&ValidationError{...}`.

## להמשך

הוסיפו מתודה `Unwrap() error` לשגיאה מותאמת וראו איך `errors.Is` עוקבת אחריה. השתמשו ב-`errors.Join` כדי לשלב שתי שגיאות. כתבו פונקציה שפותחת קובץ עם `os.Open` ועוטפת את הכישלון עם הקשר.

> **תורכם:** כתבו את `safeDivide` שמחזירה `errors.New("division by zero")` כשהמחלק הוא אפס, את שגיאת הזקיף `ErrNotFound` עם פונקציה `find` שעוטפת אותה בעזרת `%w`, ואת טיפוס השגיאה המותאם `ValidationError` (מתודת `Error()` עם pointer receiver) ש-`validateAge` מחזירה עבור גילאים שליליים. הפונקציה `main` ניתנת.
