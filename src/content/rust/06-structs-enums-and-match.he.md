---
title: "Structs, enums ו-match"
summary: "מקבצים נתונים ב-struct עם מתודות, מתארים בחירות בעזרת enum שנושא נתונים, ומטפלים בהם עם match."
hints:
  - "מתודה (method) היא פונקציה בתוך בלוק impl שהפרמטר הראשון שלה הוא &self. שדות נקראים עם self.width. ה-match חייב לכסות כל variant של ה-enum."
  - "area: self.width * self.height. can_hold: self.width >= other.width && self.height >= other.height. ב-match, variant שנושא נתונים נפרק בתוך התבנית: Message::Write(text) => ..."
  - "match m { Message::Quit => String::from(\"quit\"), Message::Move { x, y } => format!(\"move to {}, {}\", x, y), Message::Write(text) => format!(\"say {}\", text), }"
messages:
  - "השתמשו ב-match m { ... } כדי לטפל בכל סוג של הודעה."
  - "טפלו ב-variant בשם Move והשתמשו ב-x וב-y שלו."
quiz:
  - q: "מה משמעות &self כפרמטר הראשון של מתודה?"
    options: ["המתודה משנה את ה-struct", "המתודה שואלת (borrows) את ה-struct שעליו קראו לה", "המתודה יוצרת struct חדש"]
  - q: "מה קורה אם match לא מכסה כל variant של enum?"
    options: ["המקרים החסרים לא עושים כלום", "התוכנית קורסת בזמן ריצה (panic)", "התוכנית לא מתקמפלת"]
    explain: "כיסוי מלא הוא תכונת בטיחות: כשמוסיפים variant חדש, הקומפיילר מראה לכם כל match שצריך לעדכן."
  - q: "מה מיוחד ב-enums של Rust לעומת enums ב-C?"
    options: ["כל variant יכול לשאת נתונים משלו", "הם יכולים להחזיק רק מספרים", "אי אפשר להשתמש בהם ב-match"]
  - q: "מה מאפשר #[derive(Debug)]?"
    options: ["להדפיס את ה-struct עם {:?}", "להריץ את ה-debugger", "להפוך את השדות לפומביים (public)"]
---

תוכניות אמיתיות עובדות עם דברים אמיתיים: נקודה על המסך, מלבן, פקודה שהמשתמש הקליד. בשיעור הזה תלמדו לתאר דברים כאלה בעזרת **structs** (כמה ערכים שמקובצים תחת שם אחד) ו-**enums** (ערך שהוא בדיוק אחת ממספר אפשרויות), ולטפל בכל אפשרות בעזרת **match**.

## Structs

```rust
struct Point {
    x: i32,
    y: i32,
}

let p = Point { x: 3, y: 4 };
println!("{}", p.x);       // prints: 3
```

ב-struct מפרטים **שדות** (fields) בעלי שם, עם הסוגים שלהם. יוצרים struct על ידי מתן ערך לכל שדה, וקוראים שדה בעזרת נקודה. כדי לשנות שדה המשתנה חייב להיות `mut`.

### מתודות עם impl

פונקציות ששייכות ל-struct נכנסות לבלוק `impl` (מימוש, implementation):

```rust
impl Point {
    fn new(x: i32, y: i32) -> Point {      // an "associated function": no self
        Point { x, y }                     // shorthand: x: x, y: y
    }

    fn distance_from_origin(&self) -> f64 {   // a method: has self
        ((self.x * self.x + self.y * self.y) as f64).sqrt()
    }
}

let p = Point::new(3, 4);                  // :: for associated functions
println!("{}", p.distance_from_origin()); // prints: 5   (dot for methods)
```

הפרמטר הראשון `&self` אומר "שאל את ה-struct שעליו קראו למתודה" (השתמשו ב-`&mut self` כדי לשנות אותו, וב-`self` כדי לצרוך אותו). פונקציות בלי `self`, כמו `new`, נקראות בעזרת `::`.

### הדפסת struct

ל-structs אין יכולת להדפיס את עצמם. הוסיפו `#[derive(Debug)]` מעל ה-struct והדפיסו עם `{:?}`:

```rust
#[derive(Debug)]
struct Point { x: i32, y: i32 }
println!("{:?}", Point { x: 1, y: 2 });   // prints: Point { x: 1, y: 2 }
```

## Enums

Enum הוא סוג עם רשימה קבועה של **variants** (וריאנטים):

```rust
enum Direction {
    North,
    South,
}
let d = Direction::North;
```

ה-enums של Rust חזקים יותר מאלה שבהרבה שפות, כי כל variant יכול **לשאת נתונים**:

```rust
enum Message {
    Quit,                       // no data
    Move { x: i32, y: i32 },    // named fields
    Write(String),              // one unnamed value
}
```

`Message` הוא תמיד אחד משלושת האלה בדיוק, והוא יודע איזה. זה מתאר באופן טבעי מאוד "אחד ממספר צורות של דבר".

## match

`match` משווה ערך מול **תבניות** (patterns) ומריץ את הענף הראשון שמתאים:

```rust
fn describe(m: &Message) -> String {
    match m {
        Message::Quit => String::from("quit"),
        Message::Move { x, y } => format!("move to {}, {}", x, y),
        Message::Write(text) => format!("say {}", text),
    }
}
```

כל ענף הוא `pattern => result,`. תבניות יכולות **לפרק** את הנתונים שבתוך variant, וכך נוצרים משתנים (`x`, `y`, `text`) שאפשר להשתמש בהם בצד ימין. שני כללים גדולים: match הוא **ביטוי** (expression; הערך שלו מוחזר כאן), והוא חייב להיות **ממצה** (exhaustive): כל variant אפשרי חייב להיות מכוסה, אחרת התוכנית לא תתקמפל. השתמשו ב-`_ => ...` כענף שתופס את כל השאר. `format!` עובדת כמו `println!` אבל מחזירה `String` במקום להדפיס.

> **שימו לב:** `error[E0004]: non-exhaustive patterns: `Message::Quit` not covered` אומרת ששכחתם variant ב-`match`.
>
> **שימו לב:** `error[E0277]: `Rect` doesn't implement `Debug`` appears when you print with `{:?}` without `#[derive(Debug)]`. כלומר, הדפסתם struct בלי הוספת derive.
>
> **שימו לב:** אם שוכחים את `&self` (כותבים `fn area() -> u32`), זו הופכת לפונקציה משויכת (associated function), ו-`r.area()` נותנת `no method named `area` found`.
>
> **שימו לב:** כל הענפים של `match` חייבים להפיק אותו סוג, וכל ענף מסתיים בפסיק, לא בנקודה-פסיק.

> **תורכם:** כתבו את שתי המתודות של `Rect` (`area` ו-`can_hold`) ואת הפונקציה `describe` עם `match` על שלושת ה-variants של `Message`.
