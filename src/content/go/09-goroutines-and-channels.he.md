---
title: "Goroutines ו-channels"
summary: "מריצים עבודה במקביל עם goroutines, ממתינים עם sync.WaitGroup, מתקשרים דרך channels ומגנים על נתונים משותפים עם mutex."
hints:
  - "מתחילים goroutine על ידי הצבת go לפני קריאה לפונקציה: go func() { ... }(). WaitGroup סופר goroutines שרצות: wg.Add(1) לפני ההתחלה, defer wg.Done() בפנים, ו-wg.Wait() ב-main כדי לחסום עד שהמונה מגיע לאפס."
  - "העבירו את משתנה הלולאה ל-goroutine כארגומנט כדי שלכל אחת יהיה עותק משלה: go func(i int) { ... }(i). channel נושא ערכים בין goroutines: ch <- v שולח, v := <-ch מקבל, close(ch) מסיים לולאת for range. mutex: mu.Lock(); counter++; mu.Unlock()."
  - "var wg sync.WaitGroup; for i := 0; i < 5; i++ { wg.Add(1); go func(i int) { defer wg.Done(); results[i] = i * i }(i) }; wg.Wait()  ...  ch := make(chan int); go func() { for i := 1; i <= 5; i++ { ch <- i }; close(ch) }(); sum := 0; for n := range ch { sum += n }  ...  for i := 1; i <= 4; i++ { go func(i int) { out <- i * 2 }(i) }; for k := 0; k < 4; k++ { got = append(got, <-out) }; sort.Ints(got)"
messages:
  - "התחילו goroutines עם מילת המפתח go: go func() { ... }()."
  - "השתמשו ב-sync.WaitGroup כדי להמתין ל-goroutines."
  - "קראו ל-wg.Wait() כדי ש-main לא יסתיים מוקדם."
  - "צרו channel עם make(chan int)."
  - "סגרו את ה-channel כשהשולח סיים."
  - "הגנו על המונה המשותף עם sync.Mutex."
quiz:
  - q: "איך מתחילים פונקציה שרצה במקביל בתור goroutine?"
    options: ["שמים את מילת המפתח go לפני הקריאה", "קוראים לה עם async", "משתמשים בחבילת thread", "קוראים לה goroutine"]
  - q: "מה קורה אם main חוזרת בזמן שעדיין רצות goroutines?"
    options: ["Go ממתין להן אוטומטית", "התוכנית יוצאת וה-goroutines נהרגות", "הן ממשיכות לרוץ לנצח", "שגיאת קומפילציה"]
    explain: "בגלל זה צריך WaitGroup, קבלה מ-channel או דרך אחרת להמתין."
  - q: "מה עושה קבלה מ-channel בלי buffer כשעוד לא נשלח ערך?"
    options: ["מחזירה אפס מיד", "נחסמת (ממתינה) עד ששולח שולח ערך", "גורמת ל-panic", "מדלגת על השורה"]
  - q: "למה צריך sync.Mutex למונה משותף ש-100 goroutines מגדילות?"
    options: ["הוא מאיץ את התוכנית", "בלעדיו ה-goroutines מתחרות ועדכונים יכולים ללכת לאיבוד", "אחרת goroutines לא יכולות לקרוא משתנים", "זה רק קישוט"]
---

מחשבים מודרניים יכולים לעשות הרבה דברים בבת אחת, ו-Go תוכנן בשביל זה. הכלי שלו הוא ה-**goroutine**, תהליכון (thread) קל משקל וזול מאוד. בשיעור הזה תתחילו goroutines, תמתינו להן, תשלחו נתונים ביניהן עם **channels** ותגנו על נתונים משותפים עם **mutex**. נשמור על כל הדוגמאות דטרמיניסטיות, כך שהפלט זהה בכל הרצה.

## מקביליות במשפט אחד

**מקביליות** (concurrency) פירושה בניית תוכנית כמשימות עצמאיות שיכולות להתקדם בזמנים חופפים. Goroutines הן המשימות האלה, והתחלה של אחת היא זולה (אפשר להחזיק מאות אלפים).

## התחלת goroutine

שימו את מילת המפתח `go` לפני כל קריאה לפונקציה:

```go
go doWork()
go func() {
    fmt.Println("hello from a goroutine")
}()
```

הצורה השנייה היא פונקציה אנונימית שמוגדרת ונקראת מיד (שימו לב ל-`()` בסוף). הקריאה חוזרת **מיד**; ה-goroutine החדשה רצה בעצמה. הנה המלכוד: כש-`main` חוזרת, כל התוכנית מסתיימת, גם אם goroutines באמצע עבודה. צריך **להמתין** להן.

## sync.WaitGroup

`WaitGroup` הוא מונה של עבודה שלא הסתיימה:

```go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)               // one more task to wait for
    go func(i int) {
        defer wg.Done()     // this task is finished
        fmt.Println("worker", i)
    }(i)
}
wg.Wait()                   // block until the counter is 0
```

קראו ל-`Add(1)` **לפני** שמתחילים את ה-goroutine, ל-`Done()` כשהיא מסתיימת (`defer` מושלם לזה), ול-`Wait()` פעם אחת בסוף. הסדר שבו העובדים מדפיסים **אינו** קבוע, כי ה-scheduler מחליט. כדי לשמור על פלט דטרמיניסטי, תנו לכל goroutine לכתוב ל**תא משלה** (למשל `results[i] = ...`) והדפיסו אחרי `Wait()`.

שימו לב איך `i` מועבר כארגומנט `(i)`. זה נותן לכל goroutine עותק משלה של משתנה הלולאה, הרגל שמונע באגים קלאסיים (Go 1.22 ומעלה נותנים לכל סבב של לולאה משתנה משלו, אבל הארגומנט המפורש עובד בכל מקום).

## Channels

**channel** הוא צינור עם טיפוס ש-goroutines משתמשות בו כדי לשלוח ערכים זו לזו:

```go
ch := make(chan int)        // an unbuffered channel of ints

go func() {
    ch <- 42                // send
}()

v := <-ch                   // receive (waits until something arrives)
fmt.Println(v)              // 42
```

ב-channel **בלי buffer** שליחה ממתינה עד ש-goroutine אחרת מקבלת, ולהפך, ולכן שתי ה-goroutines **מסתנכרנות** ברגע הזה. זה הופך את ה-channel גם לצינור נתונים וגם לדרך תיאום. channel **עם buffer**, `make(chan int, 10)`, נותן לשולחים להמשיך עד שה-buffer מלא.

### close ו-range

השולח יכול להגיד "אין עוד ערכים" עם `close(ch)`. אז המקבל יכול לעבור בלולאה עם `range`, שמסתיימת מעצמה כשה-channel סגור וריק:

```go
go func() {
    for i := 1; i <= 5; i++ {
        ch <- i
    }
    close(ch)
}()
for n := range ch {
    fmt.Println(n)
}
```

רק **השולח** צריך לסגור channel, ואף פעם לא לסגור אותו פעמיים. אם שוכחים לסגור אותו בזמן שהמקבל משתמש ב-`range`, התוכנית ממתינה לנצח.

## Mutex: הגנה על נתונים משותפים

אם הרבה goroutines משנות את אותו משתנה, העדכונים יכולים להשתלב זה בזה ולהיעלם. הבאג הזה נקרא **data race**. `sync.Mutex` מכניס goroutine אחת בכל פעם לקטע קריטי:

```go
var mu sync.Mutex
counter := 0

mu.Lock()
counter++
mu.Unlock()
```

האמרה של Go היא "אל תתקשרו על ידי שיתוף זיכרון; שתפו זיכרון על ידי תקשורת". העדיפו channels איפה שהם מתאימים באופן טבעי, והשתמשו ב-mutex למצב משותף פשוט כמו מונה או cache.

## פלט דטרמיניסטי

התזמון של goroutines אינו צפוי, ולכן לעולם אל תדפיסו מכמה goroutines ותצפו לסדר מסוים. במקום זה: כתבו תוצאות לתאים נפרדים, או שלחו אותן על channel ו**אספו ומיינו** אותן ב-`main`, או המתינו עם `WaitGroup` ואז הדפיסו. התרגיל משתמש בכל הטריקים האלה.

> **שימו לב:**
> - שוכחים להמתין: אם `main` מסתיימת קודם, לא רואים שום דבר מה-goroutines וגם אין שגיאה.
> - Deadlock: כשכל ה-goroutines ממתינות, Go עוצר עם `fatal error: all goroutines are asleep - deadlock!`. שליחה על channel בלי buffer כשאף אחד לא מקבל גורמת לזה.
> - קבלה עם `range` מ-channel שאף אחד לא סוגר גם גורמת ל-deadlock.
> - שליחה על channel סגור גורמת ל-panic: `panic: send on closed channel`.
> - Data races על משתנים משותפים נותנים תוצאות שגויות אקראיות. הריצו תוכניות אמיתיות עם `go run -race` כדי לזהות אותם.
> - קריאה ל-`wg.Add(1)` **בתוך** ה-goroutine היא race, כי `Wait` עלולה לרוץ לפניה. הוסיפו לפני `go`.
> - העתקת `WaitGroup` או `Mutex` לפי ערך (העברה לפונקציה בלי מצביע) שוברת אותם. העבירו `&wg`.

## להמשך

בנו worker pool: שלוש goroutines שקוראות עבודות מ-channel אחד וכותבות תוצאות לאחר. השתמשו ב-`select` עם `time.After` כדי לתת לקבלה זמן קצוב. נסו את המונה בלי ה-mutex והריצו אותו עם `-race` במחשב שלכם.

> **תורכם:** חלק 1, מלאו את `results` בריבועים בעזרת `sync.WaitGroup` (`Squares: [0 1 4 9 16]`). חלק 2, שלחו 1 עד 5 על channel מ-goroutine שאחר כך סוגרת אותו, וסכמו אותם עם `range` (`Sum: 15`). חלק 3, הגדילו מונה משותף 100 פעמים מ-goroutines מוגנות עם `sync.Mutex` (`Counter: 100`). חלק 4, אספו ארבעה מספרים מוכפלים מ-goroutines, מיינו אותם והדפיסו `Doubled: [2 4 6 8]`.
