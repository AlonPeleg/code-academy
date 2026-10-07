---
title: "Interfaces"
summary: "מתארים התנהגות עם interfaces שטיפוסים ממלאים באופן מרומז, ומשתמשים בהם כדי לכתוב קוד גמיש."
hints:
  - "interface רושם חתימות של מתודות: type Shape interface { Area() float64; Name() string } (או אחת בכל שורה). כל טיפוס שיש לו את כל המתודות האלה ממלא אותו אוטומטית, בלי מילת המפתח implements."
  - "כתבו את המתודות עם receivers: func (r Rect) Area() float64 { return r.W * r.H } ו-func (c Circle) Area() float64 { return 3 * c.R * c.R }. describe משתמשת ב-interface: fmt.Println(s.Name(), \"with area\", s.Area())."
  - "type Shape interface { Area() float64; Name() string }  func (r Rect) Area() float64 { return r.W * r.H }  func (r Rect) Name() string { return \"Rect\" }  func (c Circle) Area() float64 { return 3 * c.R * c.R }  func (c Circle) Name() string { return \"Circle\" }  func describe(s Shape) { fmt.Println(s.Name(), \"with area\", s.Area()) }  func totalArea(shapes []Shape) float64 { total := 0.0; for _, s := range shapes { total += s.Area() }; return total }"
messages:
  - "הגדירו את ה-interface: type Shape interface { ... }."
  - "תנו ל-Circle מתודה Area() float64."
  - "כתבו func totalArea(shapes []Shape) float64."
quiz:
  - q: "איך טיפוס ב-Go אומר שהוא מממש interface?"
    options: ["עם מילת המפתח implements", "על ידי הרחבה שלו", "פשוט יש לו את המתודות הנדרשות (מילוי מרומז)", "על ידי רישום שלו בקובץ"]
  - q: "מה יכול להחזיק משתנה מטיפוס Shape (שהוא interface)?"
    options: ["רק ערכי Rect", "כל ערך שלטיפוס שלו יש את כל המתודות של Shape", "רק מצביעים", "כלום"]
  - q: "מה מקבל ה-interface הריק interface{} (או any)?"
    options: ["כלום", "רק מחרוזות", "ערך מכל טיפוס", "רק structs"]
  - q: "מה עושה c, ok := thing.(Circle)?"
    options: ["ממירה את המספר ל-Circle", "בודקת בבטחה אם ה-interface מחזיק Circle ומחזירה אותו", "מצהירה על טיפוס Circle חדש", "תמיד גורמת ל-panic"]
---

דמיינו פונקציה שצריכה להדפיס את השטח של "צורה כלשהי". מלבן ועיגול שומרים נתונים שונים, ובכל זאת שניהם יכולים לחשב שטח. Go מבטא את הרעיון הזה עם **interfaces**: תיאור של התנהגות שהרבה טיפוסים שונים יכולים לחלוק.

## מהו interface

**interface** הוא קבוצה של חתימות של מתודות:

```go
type Shape interface {
    Area() float64
    Name() string
}
```

הוא אומר: "כל דבר שיש לו מתודה `Area() float64` **וגם** מתודה `Name() string` הוא `Shape`". הוא לא מחזיק נתונים ולא קוד, רק את ההבטחה.

## מילוי מרומז (Implicit satisfaction)

ב-Java או ב-C# חייבים להצהיר "המחלקה הזאת מממשת את ה-interface הזה". ב-Go לא. אם לטיפוס פשוט יש את המתודות, הוא ממלא את ה-interface **אוטומטית**:

```go
type Rect struct{ W, H float64 }

func (r Rect) Area() float64 { return r.W * r.H }
func (r Rect) Name() string  { return "Rect" }
```

`Rect` אף פעם לא מזכיר את `Shape`, אבל הוא מתאים. לפעמים קוראים לזה "duck typing שנבדק בזמן קומפילציה": אם הוא הולך כמו ברווז ומקרקר כמו ברווז, הוא ברווז. זה אומר שאפשר להגדיר interface **אחרי** שהטיפוסים כבר קיימים, אפילו עבור טיפוסים מחבילות אחרות, ואף אחד לא צריך להשתנות.

## שימוש ב-interfaces

כתבו פונקציות מול ה-interface והן יעבדו עם כל טיפוס מתאים, קיים ועתידי:

```go
func describe(s Shape) {
    fmt.Println(s.Name(), "with area", s.Area())
}

describe(Rect{3, 4})    // prints: Rect with area 12
describe(Circle{2})     // prints: Circle with area 12
```

אפשר גם לשמור טיפוסים שונים ב-slice אחד, כל עוד טיפוס האיבר של ה-slice הוא ה-interface:

```go
shapes := []Shape{Rect{3, 4}, Circle{2}}
for _, s := range shapes {
    fmt.Println(s.Area())
}
```

כשקוראים ל-`s.Area()`, Go מריץ את המתודה של הערך **האמיתי** שבפנים, תכונה שנקראת **פולימורפיזם** (polymorphism). הוספת טיפוס `Triangle` בהמשך לא דורשת שום שינוי ב-`describe` או בלולאה.

## interfaces קטנים ומפורסמים

ספריית התקן מלאה ב-interfaces זעירים, לעתים קרובות עם מתודה אחת:

```go
type Stringer interface { String() string }  // package fmt
type error interface   { Error() string }    // built in
type Reader interface  { Read(p []byte) (n int, err error) } // package io
```

אם לטיפוס שלכם יש מתודה `String() string`, הפונקציה `fmt.Println` משתמשת בה כדי להדפיס את הערכים שלכם. ה-interface `error` הוא הסיבה שאפשר ליצור טיפוסי שגיאה משלכם, ובכך משתמש השיעור הבא. הנחיה בקהילת Go: **שמרו על interfaces קטנים**, וקבלו interfaces אבל החזירו טיפוסים קונקרטיים.

## ה-interface הריק והצהרות טיפוס (type assertions)

ל-`interface{}` (נכתב `any` ב-Go חדש יותר) אין מתודות, ולכן **כל** טיפוס ממלא אותו. הוא יכול להחזיק כל דבר, אבל אז אתם לא יודעים כלום על הערך. כדי לקבל בחזרה ערך קונקרטי משתמשים ב-**type assertion**:

```go
var thing interface{} = Circle{1}

c, ok := thing.(Circle)       // safe form: ok says whether it worked
if ok {
    fmt.Println(c.R)
}
```

בלי ה-`ok`, ניחוש שגוי גורם ל-panic. **type switch** בודק כמה טיפוסים בבת אחת:

```go
switch v := thing.(type) {
case Circle:
    fmt.Println("circle", v.R)
case Rect:
    fmt.Println("rect", v.W)
default:
    fmt.Println("something else")
}
```

השתמשו בהם במשורה. אם אתם מוצאים את עצמכם עושים switch על טיפוסים הרבה, בדרך כלל קיים interface טוב יותר.

## Pointer receivers ו-interfaces

אם למתודה יש **pointer receiver** (`func (r *Rect) Area()`), רק `*Rect` ממלא את ה-interface, ולא `Rect`. אז תכתבו `Shape(&Rect{3, 4})`. הפרט הזה גורם לשגיאת קומפילציה מפורסמת (ראו למטה).

> **שימו לב:**
> - חוסר במתודה נותן `cannot use Rect{...} (value of type Rect) as Shape value in array or slice literal: Rect does not implement Shape (missing method Name)`.
> - אי התאמה של pointer receiver: `Rect does not implement Shape (method Area has pointer receiver)`. העבירו `&Rect{...}`.
> - שמות וחתימות של מתודות חייבים להתאים בדיוק, כולל טיפוסי החזרה: `Area() int` לא ממלא את `Area() float64`.
> - assertion שנכשל בלי `ok` גורם ל-panic: `interface conversion: interface {} is Circle, not Rect`.
> - משתנה interface שהוא `nil` לא קורא לשום מתודה: קריאה כזאת גורמת ל-panic עם `nil pointer dereference`.
> - אל תיצרו interfaces ענקיים עם עשר מתודות. קטנים קל יותר למלא, לבדוק ולהשתמש בהם שוב.

## להמשך

הוסיפו ל-`Rect` מתודה `String() string` והדפיסו `Rect` עם `fmt.Println`. הוסיפו `Triangle` וכללו אותו ב-slice בלי לשנות את `describe`. כתבו type switch שמתייחס ל-`Circle` באופן מיוחד.

> **תורכם:** הגדירו את `type Shape interface` עם `Area() float64` ו-`Name() string`; תנו ל-`Rect` ול-`Circle` את שתי המתודות (שטח העיגול הוא `3 * R * R`); כתבו את `describe(s Shape)` שמדפיסה `<name> with area <area>` ואת `totalArea(shapes []Shape) float64`. אין צורך במילת המפתח `implements`.
