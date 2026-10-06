---
title: "זרימת בקרה עם for, if ו-switch"
summary: "קבלו החלטות עם if ו-switch, וחזרו על פעולות עם מילת הלולאה היחידה של Go, for."
hints:
  - "ב-Go יש רק מילת לולאה אחת: for. הצורה הקלאסית היא  for i := 1; i <= 15; i++ { ... }  (בלי סוגריים סביב החלקים). כשלא כותבים ערך אחרי המילה switch, כל case הופך לתנאי של אמת/שקר."
  - "בתוך הלולאה:  switch { case i%15 == 0: fmt.Println(\"FizzBuzz\") case i%3 == 0: ... default: fmt.Println(i) }  אין צורך ב-break, Go עוצר אחרי ה-case המתאים. הספירה לאחור היא  n := 3; for n > 0 { fmt.Println(n); n-- }."
  - "for i := 1; i <= 15; i++ { switch { case i%15 == 0: fmt.Println(\"FizzBuzz\") case i%3 == 0: fmt.Println(\"Fizz\") case i%5 == 0: fmt.Println(\"Buzz\") default: fmt.Println(i) } }  n := 3; for n > 0 { fmt.Println(n); n-- }; fmt.Println(\"Liftoff!\")  day := 3; switch day { case 1: ... case 3: fmt.Println(\"Day 3 is Wednesday\") }  if sq := 6 * 6; sq > 30 { fmt.Println(sq, \"is big\") }"
quiz:
  - q: "כמה מילות לולאה יש ב-Go?"
    options: ["שלוש: for, while ו-do", "שתיים: for ו-while", "אחת: for", "אף אחת, היא משתמשת ברקורסיה"]
  - q: "האם צריך לכתוב break בסוף כל case של switch ב-Go?"
    options: ["כן, תמיד", "לא, Go עוצר אוטומטית אחרי ה-case המתאים", "רק עבור מחרוזות", "רק ב-case של default"]
  - q: "מה עושה for { ... } כשאין שום דבר אחרי ה-for?"
    options: ["שגיאת קומפילציה", "רץ פעם אחת", "חוזר לנצח עד ל-break או ל-return", "לא רץ אף פעם"]
  - q: "האם צריך סוגריים סביב התנאי של if ב-Go?"
    options: ["כן, תמיד", "לא, אבל הסוגריים המסולסלים תמיד חובה", "לא, וגם הסוגריים המסולסלים אופציונליים", "רק עבור מחרוזות"]
messages:
  - "השתמשו בלולאת for בת שלושה חלקים: for i := 1; i <= 15; i++."
  - "השתמשו ב-switch בלי ביטוי: switch { case i%15 == 0: ... }."
  - "השתמשו בלולאה עם תנאי בלבד: for n > 0 { ... }."
  - "השתמשו ב-if עם פקודת אתחול: if sq := 6 * 6; sq > 30 { ... }."
---

תוכניות צריכות לקבל החלטות ולחזור על פעולות. זרימת הבקרה (control flow) של Go קטנה ומסודרת: `if`, `switch` ומילת לולאה **אחת** בלבד, `for`.

## if ו-else

```go
temperature := 28
if temperature > 25 {
    fmt.Println("hot")
} else if temperature > 15 {
    fmt.Println("nice")
} else {
    fmt.Println("cold")
}
```

ההבדלים משפות רבות אחרות: בתנאי **אין סוגריים**, הסוגריים המסולסלים **תמיד חובה**, וה-`else` חייב להופיע באותה שורה עם הסוגר הסוגר `}`.

אופרטורי ההשוואה הם `== != < <= > >=`, ומחברים תנאים עם `&&` (וגם), `||` (או) ו-`!` (לא).

### if עם פקודת אתחול

אפשר להתחיל `if` בפקודה קצרה, אחריה נקודה-פסיק, ורק אז התנאי. המשתנה (variable) קיים רק בתוך שרשרת ה-`if/else`, וכך הקוד נשאר מסודר:

```go
if sq := 6 * 6; sq > 30 {
    fmt.Println(sq, "is big")
}
// sq does not exist here
```

תראו את זה כל הזמן בקוד Go לטיפול בשגיאות, כמו ב-`if err := doThing(); err != nil { ... }`.

## לולאת for

ב-Go אין `while` ואין `do-while`. מילה אחת, `for`, מכסה את כולם.

**לולאה בת שלושה חלקים** (כמו ב-C, בלי סוגריים):

```go
for i := 0; i < 3; i++ {
    fmt.Println(i)      // prints 0, 1, 2
}
```

החלקים הם: אתחול (`i := 0`, פעם אחת), תנאי (`i < 3`, לפני כל סיבוב) ופעולה אחרי הסיבוב (`i++`, בסוף כל סיבוב).

**לולאה עם תנאי בלבד** (ה-`while` של Go):

```go
n := 3
for n > 0 {
    fmt.Println(n)
    n--
}
```

**לולאה אינסופית**, שנעצרת עם `break` או `return`:

```go
for {
    // runs forever unless something breaks out
    break
}
```

`break` יוצא מהלולאה, ו-`continue` קופץ לסיבוב הבא. הצורה `range` למעבר על אוספים תופיע בשיעור על slices.

## switch

פקודת `switch` משווה ערך אחד מול כמה מקרים (cases):

```go
day := 3
switch day {
case 1:
    fmt.Println("Monday")
case 2, 3:
    fmt.Println("Tuesday or Wednesday")
default:
    fmt.Println("Other")
}
```

ה-switch של Go ידידותי יותר משל C: רק ה-case **המתאים** רץ (אין נפילה בטעות לשאר המקרים ואין צורך ב-`break`), אפשר לרשום ב-case כמה ערכים, והמקרים יכולים להיות מחרוזות (string) ולא רק מספרים. אם באמת רוצים להמשיך אל ה-case הבא, כותבים `fallthrough`.

### switch בלי ערך

אם משמיטים את הערך אחרי `switch`, כל case הופך ל**תנאי**. זו תחליף נקי לשרשראות ארוכות של `if / else if`:

```go
switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
default:
    fmt.Println("keep trying")
}
```

המקרים נבדקים מלמעלה למטה והראשון שמתקיים מנצח, ולכן שמים את הבדיקה הספציפית ביותר ראשונה. ב-FizzBuzz זה אומר לבדוק "מתחלק ב-15" לפני "מתחלק ב-3".

## אופרטור השארית

`i % 3 == 0` נכון כש-`i` מתחלק ב-3 ללא שארית. ב-Go האופרטור `%` עובד על מספרים שלמים בלבד.

> **שימו לב:**
> - כתיבת סוגריים מותרת אך לא נפוצה, והצבת ה-`{` בשורה הבאה היא שגיאת תחביר: `unexpected newline, expected { after if clause`.
> - כתיבת `else` בשורה נפרדת אחרי ה-`}` הסוגר גורמת לשגיאה `syntax error: unexpected else, expected }`. השאירו את `} else {` יחד בשורה אחת.
> - שימוש ב-`=` במקום ב-`==` בתנאי גורם לשגיאת תחביר כמו `cannot use x = 5 as value`.
> - חיפוש של `while` גורם לשגיאה `undefined: while`. השתמשו ב-`for condition { }`.
> - לולאה אינסופית (התנאי אף פעם לא נהיה שקר) תקפיא את התוכנית. ודאו שמשהו משתנה בתוכה, כמו `n--`.
> - `i++` הוא פקודה ולא ביטוי, ולכן `x := i++` או `fmt.Println(i++)` הן שגיאת תחביר.

## להמשך

השתמשו ב-`continue` כדי לדלג על מספרים זוגיים בלולאה. כתבו לולאה מקוננת שמדפיסה לוח כפל קטן. נסו `switch` על מחרוזת כמו `"go"` או `"rust"`, והשתמשו ב-`fallthrough` פעם אחת כדי לראות מה הוא עושה.

> **תורכם:** הדפיסו FizzBuzz מ-1 עד 15 עם לולאת `for` בת שלושה חלקים ו-`switch` בלי ערך; ספרו לאחור 3, 2, 1 עם לולאת `for n > 0` והדפיסו `Liftoff!`; השתמשו ב-`switch day` כדי להדפיס `Day 3 is Wednesday`; והשתמשו ב-`if sq := 6 * 6; sq > 30` כדי להדפיס `36 is big`.
