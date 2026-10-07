---
title: "Vec, String ו-HashMap"
summary: "שומרים הרבה ערכים ב-Vec, בונים וקוראים טקסט עם String, ומחפשים לפי מפתח ב-HashMap."
hints:
  - "חיפוש-או-יצירה ב-HashMap נעשה בעזרת ה-entry API: map.entry(key).or_insert(0) נותן הפניה mutable למונה, ויוצר אותו עם 0 אם המפתח חסר."
  - "בתוך הלולאה: words.push(w); *counts.entry(w.to_string()).or_insert(0) += 1; (ה-* עוקב אחרי ההפניה אל המספר). עבור המפתחות: let mut keys: Vec<&String> = counts.keys().collect(); keys.sort();"
  - "for w in text.split_whitespace() { words.push(w); *counts.entry(w.to_string()).or_insert(0) += 1; }   let mut keys: Vec<&String> = counts.keys().collect();   keys.sort();"
messages:
  - "השתמשו ב-counts.entry(...) כדי למצוא או ליצור את המונה."
  - "מילה חדשה צריכה להתחיל עם or_insert(0)."
  - "מיינו את המפתחות לפני ההדפסה."
quiz:
  - q: "מה ההבדל בין מערך (array) ל-Vec?"
    options: ["Vec יכול לגדול ולהתכווץ, למערך יש גודל קבוע", "Vec יכול להחזיק רק מספרים", "אין הבדל"]
  - q: "מה v.get(10) מחזירה כש-v מכיל שלושה פריטים?"
    options: ["panic", "None (Option), בלי קריסה", "0"]
    explain: "אינדוקס עם v[10] גורם ל-panic, אבל get מחזירה Option כדי שאפשר יהיה לטפל במקרה החסר."
  - q: "למה ממיינים את המפתחות של HashMap לפני ההדפסה?"
    options: ["אחרת HashMap לא יודפס", "סדר האיטרציה שלו לא מוגדר ויכול להשתנות בין הרצות", "מיון מאיץ חיפושים"]
  - q: "מה עושה *map.entry(key).or_insert(0) += 1 ?"
    options: ["תמיד קובעת את הערך ל-1", "יוצרת את המפתח עם 0 אם הוא חסר, ואז מוסיפה 1 לערך שלו", "מוחקת את המפתח"]
---

עד עכשיו שמרתם ערכים בודדים. תוכניות אמיתיות מחזיקות **אוספים** (collections): רשימת ציונים, פיסת טקסט, טבלה של שמות ומספרי טלפון. בספרייה הסטנדרטית של Rust יש שלושה שתשתמשו בהם כל הזמן: `Vec` לרשימות, `String` לטקסט ו-`HashMap` לחיפוש לפי מפתח.

## Vec: רשימה שיכולה לגדול

```rust
let mut v: Vec<i32> = Vec::new();
v.push(10);
v.push(20);
let w = vec![1, 2, 3];          // the vec! macro builds one with values

println!("{}", v.len());        // prints: 2
println!("{}", w[0]);           // prints: 1
for n in &w {                   // borrow the vector to loop over it
    println!("{}", n);
}
```

`Vec<i32>` נקרא "Vec של i32"; החלק שבסוגריים המשולשים הוא **סוג הפריטים**. לכל הפריטים אותו סוג. `push` מוסיפה בסוף (המשתנה חייב להיות `mut`), `len` סופרת, ו-`v[i]` קוראת לפי מיקום, החל מ-0.

קריאה מחוץ לרשימה עם `v[10]` גורמת לתוכנית **לקרוס** (panic, עצירה עם שגיאה). אם ייתכן שהמיקום לא קיים, השתמשו ב-`get`, שמחזירה `Option` (ערך שהוא או `Some(item)` או `None`, נלמד בשיעור מאוחר יותר):

```rust
println!("{:?}", w.get(1));    // prints: Some(2)
println!("{:?}", w.get(9));    // prints: None
```

לולאה עם `for n in &w` שואלת את הוקטור, ולכן אפשר להמשיך להשתמש ב-`w` אחר כך. לולאה עם `for n in w` הייתה **מעבירה** אותו, כפי שלמדתם בשיעורי הבעלות.

## String: טקסט בבעלות

יש שני סוגי טקסט: `&str`, slice מושאל (כמו מחרוזת קבועה `"hi"`), ו-`String`, טקסט שבבעלות ויכול לגדול.

```rust
let mut s = String::from("Hello");
s.push_str(", world");         // append text
s.push('!');                   // append one char
println!("{}", s);             // prints: Hello, world!
let t = "abc".to_string();     // &str -> String
let u = format!("{}-{}", s, t);   // build a new String
println!("{}", s.len());       // prints: 13 (bytes)
for word in "a b c".split_whitespace() {
    println!("{}", word);      // prints a, b, c on separate lines
}
```

הטקסט נשמר ב-UTF-8, ולכן `len()` סופרת **בתים**, ותו עם סימן דיאקריטי יכול לתפוס יותר מבית אחד. אי אפשר לגשת למחרוזת עם `s[0]`. השתמשו ב-`s.chars()` כדי לעבור על התווים.

## HashMap: חיפוש לפי מפתח

`HashMap` שומר זוגות של `key -> value` (מפתח וערך). הוא נמצא בספרייה הסטנדרטית, ולכן מייבאים אותו קודם:

```rust
use std::collections::HashMap;

let mut ages: HashMap<String, u32> = HashMap::new();
ages.insert(String::from("Ada"), 36);
ages.insert(String::from("Alan"), 41);
println!("{:?}", ages.get("Ada"));    // prints: Some(36)
println!("{}", ages["Alan"]);         // prints: 41 (panics if the key is missing)
```

### ספירה עם ה-entry API

משימה נפוצה מאוד היא "לספור כמה פעמים כל דבר מופיע". המתודה `entry` מחפשת מפתח ומאפשרת ליצור אותו כשהוא חסר:

```rust
let mut counts: HashMap<String, u32> = HashMap::new();
for w in ["a", "b", "a"] {
    *counts.entry(w.to_string()).or_insert(0) += 1;
}
```

`or_insert(0)` מחזירה **הפניה mutable** לערך (אחרי שהוסיפה קודם את המפתח עם 0 אם צריך). ה-`*` שלפניה עוקב אחרי ההפניה כדי ש-`+= 1` ישנה את המספר עצמו.

### אין הבטחה לסדר

`HashMap` לא זוכר את סדר ההוספה, והסדר באיטרציה יכול אפילו להשתנות בין הרצות. כשצריך פלט יציב, אוספים את המפתחות וממיינים אותם:

```rust
let mut keys: Vec<&String> = counts.keys().collect();
keys.sort();
```

`collect()` אוספת את המפתחות ל-`Vec`; הצהרת הסוג אומרת ל-Rust איזה אוסף אתם רוצים.

> **שימו לב:** `error[E0599]: no method named `push` found` אומרת לרוב שהמשתנה שלכם אינו `Vec`, או ש-`mut` חסר: `cannot borrow `v` as mutable`.
>
> **שימו לב:** `thread 'main' panicked at 'index out of bounds: the len is 3 but the index is 10'` הוא ה-panic של `v[10]`. השתמשו ב-`get` כשאתם לא בטוחים.
>
> **שימו לב:** `error[E0277]: the type `str` cannot be indexed by `{integer}`` means you tried `s[0]` on text. כלומר, ניסיתם לגשת לטקסט לפי מיקום.
>
> **שימו לב:** לעולם אל תסתמכו על הדפסה ישירה של `HashMap` בבדיקה; מיינו קודם את המפתחות.

> **תורכם:** עברו בלולאה על `text.split_whitespace()`, דחפו כל מילה אל `words`, ספרו אותה עם `*counts.entry(...).or_insert(0) += 1`, ואז אספו את המפתחות, מיינו אותם עם `sort()` והדפיסו כל אחד כ-`word: count`.
