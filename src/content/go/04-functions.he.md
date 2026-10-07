---
title: "פונקציות וערכי החזרה מרובים"
summary: "כותבים פונקציות עם פרמטרים, מחזירים כמה ערכים בבת אחת, ומשתמשים בפרמטרים וריאדיים, ב-closures וב-defer."
hints:
  - "כותרת של פונקציה ב-Go היא: func name(parameters) resultType. פונקציה יכולה להחזיר כמה ערכים אם רושמים את הטיפוסים בסוגריים, למשל (int, int), ולכתוב return a, b."
  - "divmod מחזירה a / b, a % b. פרמטר וריאדי nums ...int מתנהג כמו slice, ולכן אפשר לעבור עליו עם for _, n := range nums. closure היא ערך של פונקציה שזוכר משתנים מהמקום שבו נוצר: return func() int { count++; return count }."
  - "func square(n int) int { return n * n }  func divmod(a, b int) (int, int) { return a / b, a % b }  func minMax(nums ...int) (min, max int) { min, max = nums[0], nums[0]; for _, n := range nums { if n < min { min = n }; if n > max { max = n } }; return }  func makeCounter() func() int { count := 0; return func() int { count++; return count } }"
messages:
  - "כתבו func square(n int) int."
  - "כתבו func divmod(a, b int) (int, int)."
  - "הפכו את minMax לוריאדית: nums ...int."
  - "כתבו func makeCounter() func() int."
quiz:
  - q: "ב-func add(a int, b int) int, איפה נמצא טיפוס ההחזרה?"
    options: ["לפני השם", "אחרי רשימת הפרמטרים", "בתוך הסוגריים המסולסלים", "זה לא מותר"]
  - q: "מה עושה q, r := divmod(17, 5)?"
    options: ["קוראת ל-divmod פעמיים", "מקבלת את שני הערכים המוחזרים לתוך q ו-r", "שומרת רק את הערך הראשון", "זו שגיאת תחביר"]
  - q: "מה עושה הפקודה defer?"
    options: ["מדלגת על שורה", "מריצה את הקריאה כשהפונקציה העוטפת עומדת לחזור", "מריצה את הקריאה ברקע", "מעכבת את התוכנית בשנייה אחת"]
  - q: "מהי closure?"
    options: ["פונקציה שמסיימת את התוכנית", "ערך של פונקציה שזוכר את המשתנים שסביבו", "קובץ סגור", "פונקציה פרטית"]
---

פונקציות (functions) מאפשרות לתת שם לחתיכת עבודה ולהשתמש בה שוב. לפונקציות ב-Go יש כמה תכונות לא שגרתיות ושימושיות מאוד: **ערכי החזרה מרובים**, **פרמטרים וריאדיים**, **פונקציות כערכים** ו-**defer**.

## הצהרה על פונקציה

```go
func square(n int) int {
    return n * n
}
```

* `func` פותחת את ההצהרה.
* `square` הוא השם.
* `(n int)` רושם את הפרמטרים. זכרו: ב-Go **קודם בא השם ואחריו הטיפוס**.
* ה-`int` שאחרי הסוגריים הוא **טיפוס ההחזרה**. לפונקציה שלא מחזירה כלום פשוט אין טיפוס החזרה.
* `return n * n` שולחת את התוצאה בחזרה.

כשפרמטרים שכנים חולקים טיפוס, אפשר לכתוב את הטיפוס פעם אחת: `func add(a, b int) int`.

```go
fmt.Println(square(5))   // prints: 25
```

## ערכי החזרה מרובים

פונקציה יכולה להחזיר **כמה** ערכים. רושמים את הטיפוסים בסוגריים:

```go
func divmod(a, b int) (int, int) {
    return a / b, a % b
}

q, r := divmod(17, 5)
fmt.Println(q, r)   // prints: 3 2
```

זו אחת התכונות השימושיות ביותר ב-Go, והסיבה היא שהערך האחרון הוא לעתים קרובות מאוד `error`. תראו את התבנית `result, err := doSomething()` כל הזמן (שיעור השגיאות מכסה אותה). אם אינכם צריכים אחד מהערכים, זרקו אותו עם המזהה הריק `_`:

```go
q, _ := divmod(17, 5)
```

### תוצאות עם שם

אפשר לתת שמות לתוצאות. אז הן פועלות כמו משתנים שמתחילים בערך האפס שלהם, ו-`return` חשוף (בלי ערכים) מחזיר את הערכים הנוכחיים שלהם:

```go
func minMax(nums ...int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums {
        if n < min { min = n }
        if n > max { max = n }
    }
    return
}
```

תוצאות עם שם מתעדות מה כל ערך אומר. השתמשו בהן בפונקציות קצרות, כי `return` חשוף בפונקציה ארוכה קשה לעקוב אחריו.

## פונקציות וריאדיות

פרמטר אחרון שנכתב `name ...Type` מקבל כל מספר של ארגומנטים, והם מגיעים לתוך הפונקציה בתור **slice**:

```go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

sum()          // 0
sum(1, 2, 3)   // 6
```

כבר השתמשתם בפונקציה וריאדית: `fmt.Println` מקבלת כל מספר של ערכים. כדי להעביר slice קיים, הוסיפו `...` אחריו: `sum(mySlice...)`.

## פונקציות הן ערכים

אפשר לשמור פונקציות במשתנים, להעביר אותן לפונקציות אחרות ולהחזיר אותן מפונקציות:

```go
double := func(x int) int { return x * 2 }
fmt.Println(double(4))   // 8
```

פונקציה שנכתבת בתוך פונקציה אחרת ומשתמשת במשתנים של הפונקציה החיצונית היא **closure**. המשתנים נשארים חיים כל עוד ה-closure חיה:

```go
func makeCounter() func() int {
    count := 0
    return func() int {
        count++
        return count
    }
}

next := makeCounter()
fmt.Println(next(), next(), next())  // 1 2 3
```

כל קריאה ל-`makeCounter` יוצרת `count` פרטי משלה, ולכן שני מונים אף פעם לא מפריעים זה לזה.

## defer

`defer` מתזמנת קריאה לפונקציה שתרוץ **כשהפונקציה העוטפת חוזרת**, בכל דרך שזה קורה. זה מושלם לניקוי, כמו סגירת קובץ, כי הניקוי יושב ממש ליד הקוד שצריך אותו:

```go
func main() {
    defer fmt.Println("goodbye")
    fmt.Println("hello")
}
// prints: hello
//         goodbye
```

כשיש כמה קריאות defer, זו שנרשמה **אחרונה** רצה **ראשונה**.

## ארגומנטים הם עותקים

Go מעביר ארגומנטים **לפי ערך**: הפונקציה מקבלת עותק, ולכן שינוי של פרמטר רגיל לא משנה את המשתנה של הקורא. (מצביעים (pointers), שנלמד יחד עם structs, מאפשרים לפונקציה לשנות את המקור.)

> **שימו לב:**
> - אם שוכחים להחזיר ערך מתקבלת השגיאה `missing return`. כל מסלול בפונקציה עם תוצאה חייב להסתיים ב-`return`.
> - קבלת מספר שגוי של תוצאות, `x := divmod(17, 5)`, נותנת `assignment mismatch: 1 variable but divmod returns 2 values`.
> - הצהרה על משתנה מתוצאה ואי שימוש בו נותנת `declared and not used`. השתמשו ב-`_` בשביל ערכים שמתעלמים מהם.
> - קריאה ל-`square("5")` נותנת `cannot use "5" (untyped string constant) as int value in argument to square`.
> - ב-Go **אין העמסת פונקציות** (overloading): שתי פונקציות עם אותו שם באותה חבילה הן שגיאה (`square redeclared in this block`).
> - שם פונקציה שמתחיל באות קטנה פרטי לחבילה שלו, ושם שמתחיל באות גדולה מיוצא (exported).

## להמשך

כתבו `func apply(nums []int, f func(int) int) []int` שמפעילה פונקציה על כל איבר, וקראו לה עם `square`. צרו מונה שני ובדקו ששני המונים בלתי תלויים. הוסיפו שתי הדפסות עם defer ואשרו את הסדר ההפוך.

> **תורכם:** כתבו את `square`, את `divmod` (שמחזירה מנה ושארית), את `minMax(nums ...int) (min, max int)` הוריאדית עם תוצאות בעלות שם, ואת `makeCounter() func() int` שמחזירה closure שסופרת 1, 2, 3. הפונקציה `main` כבר כתובה. שימו לב ש-`defer` גורם ל-`done` להיות מודפס אחרון.
