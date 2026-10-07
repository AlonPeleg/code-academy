---
title: "Structs ומתודות"
summary: "מקבצים נתונים ל-structs, מצמידים להם מתודות, ולומדים מתי מתודה צריכה pointer receiver."
hints:
  - "struct מקבץ שדות עם שמות: type Rect struct { Width int; Height int } (או שדה אחד בכל שורה). מתודה היא פונקציה עם receiver בסוגריים לפני השם שלה: func (r Rect) Area() int { ... }."
  - "למתודות עם value receiver (r Rect) יש עותק, ולכן הן לא יכולות לשנות את המקור. כדי לשנות את המקור משתמשים ב-pointer receiver: func (r *Rect) Scale(factor int) { r.Width *= factor; r.Height *= factor }. בנאי (constructor) יכול להחזיר &Rect{Width: side, Height: side}."
  - "type Rect struct { Width int; Height int }  func (r Rect) Area() int { return r.Width * r.Height }  func (r Rect) Perimeter() int { return 2 * (r.Width + r.Height) }  func (r *Rect) Scale(factor int) { r.Width *= factor; r.Height *= factor }  func NewSquare(side int) *Rect { return &Rect{Width: side, Height: side} }"
messages:
  - "הגדירו את הטיפוס עם: type Rect struct { ... }."
  - "כתבו את המתודה func (r Rect) Area() int."
  - "ל-Scale נדרש pointer receiver: func (r *Rect) Scale(factor int)."
  - "כתבו func NewSquare(side int) *Rect."
quiz:
  - q: "ב-Go אין classes. במה משתמשים במקום כדי לקבץ נתונים?"
    options: ["מערכים", "Structs", "רק חבילות", "רק interfaces"]
  - q: "ב-func (r Rect) Area() int, מהו (r Rect)?"
    options: ["פרמטר שמעבירים בקריאה", "ה-receiver: הערך שהמתודה נקראת עליו", "טיפוס ההחזרה", "הערה"]
  - q: "מתי צריך pointer receiver כמו (r *Rect)?"
    options: ["כשהמתודה צריכה לשנות את הערך המקורי (או כשה-struct גדול)", "אף פעם, הם זהים", "רק עבור מחרוזות", "רק עבור מתודות מיוצאות"]
  - q: "מה עושה האופרטור & ב-&Rect{Width: 5, Height: 5}?"
    options: ["מחבר שני ערכים", "לוקח את הכתובת ונותן מצביע ל-Rect החדש", "משווה שני Rects", "מצהיר על קבוע"]
---

ל-Go אין classes, אבל יש בו משהו פשוט יותר שעושה את אותה עבודה: **structs** בשביל נתונים ו**מתודות** (methods) שמצמידים לטיפוסים שלכם. בשיעור הזה תבנו טיפוסים משלכם ותלמדו את ההבדל החשוב בין ערך לבין מצביע (pointer).

## הגדרת struct

**struct** הוא אוסף של **שדות** (fields) עם שמות:

```go
type Rect struct {
    Width  int
    Height int
}
```

`type Rect struct { ... }` יוצר טיפוס חדש בשם `Rect`. יוצרים ערכים עם **struct literal**:

```go
r := Rect{Width: 3, Height: 4}
fmt.Println(r.Width)     // 3
r.Height = 10            // fields are read and changed with a dot
```

שדות שמשאירים בחוץ מקבלים את ערך האפס שלהם (`Rect{}` הוא `{0 0}`). הדפסת struct עם `Println` נותנת `{3 4}`, ועם `%+v` מקבלים גם את שמות השדות: `{Width:3 Height:4}`. שמות שדות באות גדולה (`Width`) מיוצאים; באות קטנה הם פרטיים לחבילה, אותו כלל כמו בכל מקום ב-Go.

## מתודות

**מתודה** היא פונקציה שמוצמדת לטיפוס דרך **receiver**, שנכתב בסוגריים בין `func` לבין השם:

```go
func (r Rect) Area() int {
    return r.Width * r.Height
}

fmt.Println(r.Area())    // 12
```

`r` הוא ה-receiver: בתוך המתודה הוא הערך שהמתודה נקראה עליו (כמו `this` בשפות אחרות, אבל אתם בוחרים את השם, ולפי המסורת הוא קצר, אות או שתיים). אפשר להצמיד מתודות לכל טיפוס שאתם מגדירים, לא רק ל-structs.

## value receiver או pointer receiver?

זה הרעיון המרכזי של השיעור. עם **value receiver** `(r Rect)` המתודה מקבלת **עותק** של ה-struct. שינוי העותק לא נוגע במקור:

```go
func (r Rect) BrokenScale(f int) {
    r.Width *= f      // changes only the copy
}
```

כדי לשנות את המקור משתמשים ב-**pointer receiver**, שנכתב `(r *Rect)`. מצביע מחזיק את **הכתובת** של ערך במקום את הערך עצמו:

```go
func (r *Rect) Scale(factor int) {
    r.Width *= factor
    r.Height *= factor
}

r := Rect{Width: 3, Height: 4}
r.Scale(2)
fmt.Println(r)   // {6 8}
```

Go עוזר לכם: אפשר לכתוב `r.Scale(2)` והוא לוקח אוטומטית את `&r` בשבילכם. גם `r.Width` עובד על מצביע בלי תחביר מיוחד של הסרת הפניה (dereferencing).

כלל אצבע טוב: השתמשו ב-pointer receiver אם המתודה **משנה** את ה-struct או אם ה-struct **גדול** (העתקה בזבזנית). לשם עקביות, אם אחת המתודות של טיפוס צריכה pointer receiver, תנו לכולן להשתמש במצביעים.

## מצביעים בשני משפטים

`&x` נותן את הכתובת של `x`, ו-`*p` נותן את הערך שהמצביע `p` מצביע עליו. בניגוד ל-C **אין חשבון מצביעים**, ו-Go אוסף בשבילכם זיכרון שלא בשימוש (garbage collection), ולכן אתם לא משחררים כלום.

## פונקציות בנאי (Constructor)

ב-Go אין בנאים מיוחדים. לפי המסורת כותבים פונקציה רגילה בשם `NewSomething` שמחזירה ערך מוכן לשימוש, לעתים קרובות מצביע:

```go
func NewSquare(side int) *Rect {
    return &Rect{Width: side, Height: side}
}
```

`&Rect{...}` יוצר את ה-struct ומחזיר את הכתובת שלו. ב-Go בטוח להחזיר מצביע לערך מקומי, כי הקומפיילר שומר אותו חי כל עוד צריך אותו. בנאי הוא המקום הנכון לבדוק קלט או לקבוע ברירות מחדל.

## הטמעה (Embedding): הרכבה במקום ירושה

Go מעדיף **הרכבה** (composition). אפשר להטמיע struct אחד בתוך אחר, והשדות והמתודות שלו "מקודמים":

```go
type Named struct{ Name string }
func (n Named) Hello() string { return "Hi " + n.Name }

type Employee struct {
    Named
    Salary int
}

e := Employee{Named{"Ada"}, 5000}
fmt.Println(e.Hello(), e.Name)   // Hi Ada Ada
```

> **שימו לב:**
> - ציפייה ש-value receiver ישנה את ה-struct: `r.BrokenScale(2)` רצה בלי שגיאה אבל שום דבר לא משתנה, כי המתודה עבדה על עותק.
> - ערבוב טיפוסים נותן שגיאות כמו `cannot use r (variable of type Rect) as *Rect value`. השתמשו ב-`&r` כדי להעביר את הכתובת.
> - שימוש בשם מתודה או שדה באות קטנה מחבילה אחרת נותן `r.area undefined (cannot refer to unexported method area)`.
> - מצביע receiver שהוא nil ואתם מסירים ממנו הפניה קורס עם `panic: runtime error: invalid memory address or nil pointer dereference`.
> - ליטרלים בלי מפתחות כמו `Rect{3, 4}` עובדים אבל נשברים כשמוסיפים שדות או משנים את הסדר. העדיפו `Rect{Width: 3, Height: 4}`.
> - כל מתודה צריכה את שם טיפוס ה-receiver בדיוק: `func (r Rectangle) Area()` עבור טיפוס בשם `Rect` נותן `undefined: Rectangle`.

## להמשך

הוסיפו ל-`Rect` מתודה `String() string` והדפיסו את `r` עם `Println`: `fmt` קורא לה אוטומטית. צרו struct בשם `Circle` עם מתודת `Area` משלו (שיעור ה-interfaces יאפשר לשני הטיפוסים לשמש יחד בקוד אחד). השוו שני structs עם `==`.

> **תורכם:** הגדירו את `type Rect struct` עם שדות `Width` ו-`Height` מסוג int, את המתודות `Area` ו-`Perimeter` (עם value receivers), את `Scale(factor int)` עם **pointer** receiver שמשנה את המקור, ואת `NewSquare(side int) *Rect`. הפונקציה `main` ניתנת.
