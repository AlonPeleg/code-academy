---
title: "Slices ו-maps"
summary: "עובדים עם slices שגדלים ועם maps של מפתח וערך, כולל range, append, delete ותבנית comma-ok."
hints:
  - "slice גדל עם append, והיא מחזירה את ה-slice החדש, ולכן חייבים להשים אותו בחזרה: fruits = append(fruits, \"cherry\"). תת-slice נכתב nums[1:3]. ערך ב-map נקבע עם m[key] = value ומפתח מוסר עם delete(m, key)."
  - "חיפוש מפתח שלא קיים נותן את ערך האפס, ולכן משתמשים ב-v, ok := ages[\"Zed\"] כש-ok אומר אם המפתח היה קיים. כדי לאסוף מפתחות: keys := []string{} ואז for k := range ages { keys = append(keys, k) }, ואז sort.Strings(keys)."
  - "fruits = append(fruits, \"cherry\")  fmt.Println(\"Fruits:\", fruits, len(fruits))  fmt.Println(\"Slice:\", nums[1:3])  sum := 0; for _, n := range nums { if n%2 == 0 { sum += n } }  ages[\"Grace\"] = 45; delete(ages, \"Linus\")  fmt.Println(\"Ada is\", ages[\"Ada\"])  _, ok := ages[\"Zed\"]  fmt.Println(\"Zed found:\", ok)"
messages:
  - "השתמשו ב-append(fruits, \"cherry\") כדי להגדיל slice."
  - "עברו בלולאה עם range על nums."
  - "השתמשו ב-delete(ages, \"Linus\") כדי להסיר מפתח."
  - "השתמשו בצורת comma-ok: v, ok := ages[\"Zed\"]."
  - "מיינו את המפתחות עם sort.Strings."
quiz:
  - q: "בשביל מה צריך את ההשמה ב-fruits = append(fruits, \"x\")?"
    options: ["היא קישוט אופציונלי", "append מחזירה את ה-slice החדש, שעשוי להיות מערך בסיס אחר", "כדי למיין את ה-slice", "כדי להפוך את ה-slice ל-map"]
  - q: "מהו ביטוי ה-slice nums[1:3]?"
    options: ["האיברים באינדקסים 1, 2 ו-3", "האיברים באינדקסים 1 ו-2", "האיבר באינדקס 3 בלבד", "שלושת האיברים הראשונים"]
    explain: "ההתחלה נכללת והסוף אינו נכלל, ולכן ב-nums[1:3] יש שני איברים."
  - q: "מה נותן v, ok := m[key] כשהמפתח חסר?"
    options: ["panic בזמן ריצה", "v הוא ערך האפס ו-ok הוא false", "v הוא nil ו-ok הוא true", "שגיאת קומפילציה"]
  - q: "האם סדר המעבר ב-for k, v := range myMap מובטח?"
    options: ["כן, סדר ההוספה", "כן, סדר ממוין", "לא, הוא בכוונה לא מוגדר ומשתנה", "כן, סדר הפוך"]
---

תוכניות אמיתיות עובדות עם אוספים: רשימות של ציונים, טבלאות של שמות וגילאים. ב-Go יש שני טיפוסי אוספים מובנים שתשתמשו בהם כל הזמן: **slices** (רשימות מסודרות שיכולות לגדול) ו-**maps** (חיפושים ממפתח לערך).

## מערכים מול slices

ב-Go אכן יש **מערכים** (arrays) באורך קבוע, כמו `[3]int`, אבל כמעט לא תשתמשו בהם ישירות. הכלי העיקרי הוא ה-**slice**, מבט גמיש על מערך שאורכו יכול להשתנות:

```go
nums := []int{3, 1, 4, 1, 5}   // a slice literal: note the empty []
fmt.Println(nums[0])           // 3 (indexes start at 0)
nums[1] = 10                   // change an element
fmt.Println(len(nums))         // 5
```

אפשר גם ליצור slice ריק עם `var s []int` (ערכו `nil`, ועדיין בטוח להשתמש בו עם `len` ו-`append`) או עם `make([]int, 3)` שנותן `[0 0 0]`.

### append

slice גדל עם הפונקציה המובנית `append`. היא **מחזירה** את ה-slice, ולכן משימים את התוצאה בחזרה:

```go
fruits := []string{"apple", "banana"}
fruits = append(fruits, "cherry")
fruits = append(fruits, "date", "elder")
fmt.Println(fruits, len(fruits))  // [apple banana cherry date elder] 5
```

מאחורי הקלעים ל-slice יש שלושה חלקים: מצביע למערך, **אורך** (`len`) ו**קיבולת** (`cap`, כמה מקום יש לפני ש-Go צריך להקצות מערך גדול יותר). כש-`append` נגמר לה המקום, היא יוצרת מערך גדול יותר ומעתיקה אליו את הדברים, ולכן התוצאה יכולה להיות slice אחר.

### חיתוך של slice

`s[low:high]` נותן את האיברים מ-`low` ועד **אבל לא כולל** `high`:

```go
nums := []int{3, 1, 4, 1, 5, 9}
fmt.Println(nums[1:3])  // [1 4]
fmt.Println(nums[:2])   // [3 1]
fmt.Println(nums[4:])   // [5 9]
```

תת-slice **חולק** את אותו זיכרון עם המקור. שינוי של איבר דרך אחד מופיע גם בשני. השתמשו ב-`copy` או ב-`append([]int{}, s...)` כדי ליצור עותק בלתי תלוי.

## range

`for ... range` עובר על slice ונותן לכם את **האינדקס** ו**עותק של הערך**:

```go
for i, n := range nums {
    fmt.Println(i, n)
}
for _, n := range nums {   // _ throws away the index
    fmt.Println(n)
}
```

## Maps

map שומר זוגות של **מפתח וערך** עם חיפוש מהיר:

```go
ages := map[string]int{"Ada": 36, "Linus": 28}
ages["Grace"] = 45          // add or update
fmt.Println(ages["Ada"])    // 36
delete(ages, "Linus")       // remove
fmt.Println(len(ages))      // 2
```

הטיפוס `map[string]int` נקרא "map מ-string ל-int". יוצרים map ריק עם `make(map[string]int)`. כתיבה ל-map שהוא `nil` קורסת, ולכן תמיד צרו את ה-map לפני שמשתמשים בו.

### תבנית comma-ok

חיפוש מפתח שלא קיים נותן את **ערך האפס** (0 עבור int), אז איך מבדילים בין "חסר" לבין "באמת 0"? מבקשים ערך שני:

```go
age, ok := ages["Zed"]
if !ok {
    fmt.Println("no such person")
}
```

`ok` הוא `true` כשהמפתח קיים. תראו את התבנית הזאת בכל מקום ב-Go.

### הסדר אינו מובטח

מעבר על map מבקר במפתחות ב**סדר אקראי**, בכוונה, כדי שאף אחד לא יסתמך עליו. אם רוצים פלט ממוין, אוספים את המפתחות ל-slice וממיינים אותו עם החבילה `sort`:

```go
keys := []string{}
for k := range ages {
    keys = append(keys, k)
}
sort.Strings(keys)
```

(הדפסת ה-map כולו עם `fmt.Println(ages)` היא מקרה מיוחד: `fmt` ממיין בשבילכם את המפתחות.)

> **שימו לב:**
> - אם שוכחים את ההשמה, `append(fruits, "x")` לבדה נותנת `append(fruits, "x") (value of type []string) is not used`.
> - חריגה מהסוף קורסת: `panic: runtime error: index out of range [5] with length 3`.
> - כתיבה ל-map שרק הצהרתם עליו (`var m map[string]int; m["a"] = 1`) נותנת `panic: assignment to entry in nil map`. השתמשו ב-`make` או בליטרל.
> - מפתחות של map חייבים להיות ניתנים להשוואה. slice לא יכול להיות מפתח (`invalid map key type []int`).
> - מכיוון שתתי-slices חולקים זיכרון, שינוי של אחד יכול לשנות אחר. זה מפתיע מתחילים רבים.
> - `for _, n := range nums { n = n * 2 }` לא משנה את ה-slice, כי `n` הוא עותק. כתבו `nums[i] = ...` עם האינדקס.

## להמשך

ספרו תדירויות של מילים במשפט עם `strings.Fields` ו-`map[string]int`. בנו slice דו-ממדי (`[][]int`). הדפיסו את `len` ואת `cap` של slice אחרי כל `append` כדי לראות את הקיבולת מוכפלת.

> **תורכם:** הוסיפו `"cherry"` ל-`fruits` והדפיסו `Fruits: [apple banana cherry] 3`; הדפיסו את `nums[1:3]`; סכמו את המספרים הזוגיים עם `range`; הוסיפו את `Grace` (45) ומחקו את `Linus` מה-map, הדפיסו את הגיל של Ada, בדקו את `"Zed"` עם comma-ok, הדפיסו את ה-map כולו, והדפיסו את המפתחות הממוינים עם `sort.Strings`.
