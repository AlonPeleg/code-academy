---
title: "בעלות והעברה (Ownership and moves)"
summary: "מבינים את הרעיון המרכזי של Rust, שלכל ערך יש בעלים אחד בדיוק, ומה המשמעות של העברה (move), שכפול (clone) והעתקה (copy)."
hints:
  - "כשכותבים let b = a; עם String, הבעלות עוברת ל-b וה-a כבר לא תקף. אם רוצים שני Strings נפרדים, צריך להעתיק את הנתונים במפורש."
  - "השתמשו ב-a.clone() כדי ליצור את ההעתק. עבור shout כתבו fn shout(mut text: String) -> String והשתמשו ב-text.push_str(\"!\"); לפני שמחזירים את text. ב-main: let d = shout(c);"
  - "let b = a.clone();   fn shout(mut text: String) -> String { text.push_str(\"!\"); text }   let d = shout(c);"
messages:
  - "צרו העתק עצמאי בעזרת .clone()."
  - "הוסיפו את סימן הקריאה לטקסט בתוך shout."
  - "קראו ל-shout(c) ושמרו את התוצאה."
quiz:
  - q: "מי משחרר את הזיכרון של String ב-Rust?"
    options: ["אספן זבל (garbage collector) באיזשהו שלב מאוחר יותר", "המתכנת, בקריאה ל-free", "הבעלים, באופן אוטומטי, כשהוא יוצא מהתחום (scope)"]
    explain: "כשהתחום של הבעלים מסתיים, Rust קוראת ל-drop והזיכרון משתחרר. אין צורך באספן זבל."
  - q: "מה קורה אחרי let b = a; כש-a הוא String?"
    options: ["גם a וגם b הם בעלי הטקסט", "הבעלות עוברת ל-b ואי אפשר עוד להשתמש ב-a", "הטקסט מועתק אוטומטית"]
  - q: "למה אחרי let y = x; אפשר להמשיך להשתמש ב-x כש-x הוא i32?"
    options: ["מספרים שלמים מממשים את Copy, ולכן הם משוכפלים בזול", "למספרים שלמים אין בעלים", "כי x הוא mutable"]
  - q: "מה קורה כשמעבירים String לפונקציה by value?"
    options: ["כלום, הפונקציה מקבלת מבט על הערך", "הבעלות עוברת אל הפונקציה", "המחרוזת תמיד מועתקת"]
---

בעלות (ownership) היא הרעיון שמייחד את Rust. שפות אחרות מחייבות לשחרר זיכרון ידנית (C, שבה קל לטעות), או מריצות אספן זבל (garbage collector) שמנקה בזמן שהתוכנית רצה (Java, Python, Go, וזה עולה במהירות). Rust משתמשת בדרך שלישית: קבוצה קטנה של כללים, שהקומפיילר בודק, שקובעים מתי הזיכרון משתחרר. הכללים לא עולים כלום בזמן ריצה. הלמידה שלהם היא הצעד הגדול ביותר ב-Rust, ולכן מקדישים לה שני שיעורים.

## שלושת הכללים

1. לכל ערך יש **בעלים** (owner) אחד בדיוק (משתנה).
2. בכל רגע יכול להיות רק בעלים אחד.
3. כשהבעלים יוצא מהתחום (מגיע ל-`}` הסוגר), הערך **נמחק** (dropped): הזיכרון שלו משתחרר.

```rust
{
    let s = String::from("hello");   // s owns the text
    println!("{}", s);
}                                    // s goes out of scope, the text is freed here
```

`String::from` יוצרת טקסט שיכול לגדול, ששמור ב-**heap**, החלק בזיכרון שמשמש לנתונים שגודלם לא ידוע מראש. מחרוזת קבועה רגילה כמו `"hello"` שונה: זה טקסט קבוע ששמור בתוך התוכנית עצמה.

## העברה (Moving)

```rust
let a = String::from("hi");
let b = a;                 // ownership MOVES from a to b
println!("{}", a);         // error[E0382]: borrow of moved value: `a`
```

למה? אילו גם `a` וגם `b` היו הבעלים של אותו טקסט, שניהם היו משחררים אותו בסוף התחום, וזה באג שנקרא *double free*. Rust מונעת אותו בכך שאחרי ההעברה רק `b` הוא הבעלים של הטקסט. `a` נעשה בלתי שמיש, והקומפיילר אומר לכם את זה.

## Clone: העתקה מפורשת

כשאתם באמת רוצים שני Strings עצמאיים, בקשו העתק:

```rust
let a = String::from("hi");
let b = a.clone();         // a deep copy: new memory, same text
println!("{} {}", a, b);   // prints: hi hi
```

`clone` יכולה להיות איטית עבור נתונים גדולים, ולכן Rust מחייבת אתכם לכתוב אותה. כשרואים `.clone()` יודעים שמשהו מועתק.

## טיפוסי Copy

ערכים פשוטים שחיים כולם על ה-stack, כמו מספרים שלמים, מספרים עשרוניים, `bool` ו-`char`, הם **Copy**: השמה שלהם פשוט משכפלת את הביטים, והמקור נשאר תקף.

```rust
let x = 5;
let y = x;       // x is copied, not moved
println!("{} {}", x, y);   // prints: 5 5
```

## בעלות ופונקציות

העברת ערך לפונקציה מעבירה אותו, בדיוק כמו `let`:

```rust
fn consume(s: String) {
    println!("{}", s);
}   // s is dropped here

let text = String::from("hello");
consume(text);
// println!("{}", text);   // error: value moved into consume
```

פונקציה יכולה להחזיר את הבעלות בעזרת **החזרת** הערך:

```rust
fn shout(mut text: String) -> String {
    text.push_str("!");    // add to the end of the String
    text                   // the last expression, without semicolon, is returned
}

let loud = shout(String::from("hey"));   // loud is "hey!"
```

שימו לב ל-`mut text` ברשימת הפרמטרים: הפונקציה היא הבעלים של ה-String ורוצה לשנות אותו, ולכן הפרמטר חייב להיות mutable. בשורה האחרונה אין נקודה-פסיק: ב-Rust הביטוי האחרון בגוף הפונקציה הוא ערך ההחזרה שלה.

המסירה וההחזרה האלה מסורבלות כשפונקציה רק רוצה *להסתכל* על משהו. השיעור הבא מראה דרך נוחה יותר: השאלה (borrowing).

> **שימו לב:** `error[E0382]: borrow of moved value` או `use of moved value` אומרת שהשתמשתם במשתנה אחרי שוויתרתם עליו. שכפלו אותו עם clone, או סדרו מחדש את הקוד.
>
> **שימו לב:** `String` אינו `Copy`. `let b = a;` על `String` מעביר, אבל על `i32` מעתיק.
>
> **שימו לב:** נקודה-פסיק אחרי הביטוי האחרון (`text;`) הופכת אותו להוראה שלא מחזירה כלום, וזה נותן `error[E0308]: mismatched types`.
>
> **שימו לב:** קריאה ל-`push_str` על משתנה שלא הוגדר עם `mut` נותנת `cannot borrow ... as mutable`.

> **תורכם:** תקנו את `main` כך ש-`b` יהיה `.clone()` של `a`, ואז השלימו את `shout` (פרמטר mutable, `push_str("!")`, החזרת הטקסט) והשתמשו בה עם `c`, ושמרו את התוצאה ב-`d`.
