---
title: "Traits וגנריקה (Traits and generics)"
summary: "חולקים התנהגות בין סוגים בעזרת traits, כותבים קוד שעובד על סוגים רבים בעזרת generics, ומשתמשים ב-trait objects."
hints:
  - "trait הוא רשימה של חתימות מתודות. סוג מתחייב לעמוד בו בעזרת impl TraitName for TypeName { ... } ומגדיר כל מתודה. פונקציה גנרית נותנת שם לפרמטר הסוג בסוגריים משולשים אחרי שם הפונקציה."
  - "ל-largest הגנרית צריך bounds כדי ש-> והעתקה יעבדו: fn largest<T: PartialOrd + Copy>(items: &[T]) -> T, כאשר T מחליף כל i32 שבפנים. print_area יכולה לקרוא ל-s.name() ול-s.area() ולעצב עם {:.2}."
  - "impl Shape for Rect { fn area(&self) -> f64 { self.w * self.h } fn name(&self) -> String { String::from(\"rect\") } }   fn print_area(s: &dyn Shape) { println!(\"{} area {:.2}\", s.name(), s.area()); }"
messages:
  - "כתבו impl Shape for Rect { ... }."
  - "כתבו impl Shape for Circle { ... }."
  - "הפכו את largest לגנרית: fn largest<T: ...>(items: &[T]) -> T."
quiz:
  - q: "מהו trait?"
    options: ["סוג של struct", "קבוצת מתודות שסוג יכול להתחייב לממש", "דרך להקצות זיכרון"]
  - q: "מה משמעות T: PartialOrd + Copy בפונקציה גנרית?"
    options: ["T חייב להיות מספר", "T חייב לתמוך בהשוואה עם > ו-< ולהיות ניתן להעתקה", "T הוא הפניה"]
  - q: "למה צריך Box<dyn Shape> כדי להחזיק Rect ו-Circle ב-Vec אחד?"
    options: ["יש להם גדלים וסוגים שונים, ולכן שומרים מצביעים ל-trait objects", "Box מאיץ את הצורות", "Vec יכול להחזיק רק boxes"]
  - q: "איך Rust הופכת קוד גנרי למהיר?"
    options: ["היא בודקת סוגים בזמן ריצה", "Monomorphization: היא מייצרת עותק מיוחד של הפונקציה לכל סוג קונקרטי שבשימוש", "היא משתמשת באספן זבל"]
    explain: "לקוד גנרי אין עלות בזמן ריצה: largest::<i32> ו-largest::<char> מקומפלות כפונקציות נפרדות ומותאמות."
---

דמיינו תוכנת ציור עם מלבנים, עיגולים ומשולשים. לכל אחד יש שטח, שם ודרך לצייר את עצמו. אתם רוצים רשימה אחת של צורות ופונקציה אחת שעובדת עם כל אחת מהן. ואתם רוצים פונקציה `largest` שעובדת על מספרים, אותיות וכל דבר אחר שאפשר לסדר, בלי לכתוב אותה עשר פעמים. הכלים של Rust לזה הם **traits** ו-**generics** (גנריקה), ויחד הם לב ההפשטה בשפה.

## Traits: התנהגות משותפת

trait הוא רשימה בעלת שם של מתודות שסוג יכול להתחייב לספק. זה דומה ל-*interface* ב-Java או ב-C#.

```rust
trait Shape {
    fn area(&self) -> f64;           // required: just the signature
    fn name(&self) -> String;
}

struct Rect { w: f64, h: f64 }

impl Shape for Rect {
    fn area(&self) -> f64 { self.w * self.h }
    fn name(&self) -> String { String::from("rect") }
}
```

`impl Shape for Rect` נקרא "Rect מממש את Shape". הקומפיילר בודק שהגדרתם כל מתודה נדרשת, עם החתימה הנכונה. ל-trait יכולות להיות גם **מתודות ברירת מחדל** עם גוף, שהמממשים יכולים להשאיר או לדרוס.

כבר השתמשתם ב-traits: `Debug` (בשביל `{:?}`), `Clone` (בשביל `.clone()`) ו-`Copy`. `#[derive(Debug)]` פשוט כותבת בשבילכם את המימוש.

## Generics: פונקציה אחת, הרבה סוגים

```rust
fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {
    let mut best = items[0];
    for &item in items {
        if item > best { best = item; }
    }
    best
}

largest(&[3, 9, 4]);        // 9
largest(&['a', 'z', 'm']);  // 'z'
```

- `<T>` אחרי השם מצהיר על **פרמטר סוג** (type parameter), מציין מקום שמוחלף בסוג אמיתי בכל קריאה.
- `T: PartialOrd + Copy` הוא **trait bound** (חסם): הוא אומר "T יכול להיות כל סוג שתומך בהשוואה (`>`) וניתן להעתקה". בלי החסמים הקומפיילר היה דוחה את `item > best` עם `error[E0369]: binary operation `>` cannot be applied to type `T``. חסמים הם הדרך של קוד גנרי לומר לקומפיילר מה מותר לו לעשות.

גם structs יכולים להיות גנריים, כמו `Vec<T>` ו-`Option<T>`. בקומפילציה Rust יוצרת גרסה מיוחדת לכל סוג שבאמת משתמשים בו (זה נקרא **monomorphization**), ולכן קוד גנרי רץ מהר כמו קוד שנכתב ביד.

## Traits כפרמטרים

```rust
fn print_area<S: Shape>(s: &S) { ... }     // generic with a bound
fn print_area(s: &impl Shape) { ... }      // same, shorter
fn print_area(s: &dyn Shape) { ... }       // a trait object: decided at run time
```

השניים הראשונים נפתרים בזמן קומפילציה: כל קריאה מקבלת עותק משלה של הפונקציה (**static dispatch**). `dyn Shape` הוא **trait object**: פונקציה אחת מקומפלת שמחפשת את המתודה הנכונה בזמן ריצה (**dynamic dispatch**). משלמים עלות חיפוש זעירה, ומקבלים את היכולת לערבב סוגים באוסף אחד:

```rust
let shapes: Vec<Box<dyn Shape>> = vec![
    Box::new(Rect { w: 3.0, h: 4.0 }),
    Box::new(Circle { r: 3.0 }),
];
```

`Box<T>` הוא מצביע חכם (smart pointer) ששם ערך ב-heap. צריך אותו כאן כי ל-`Rect` ול-`Circle` יש גדלים שונים, ואילו ל-`Vec` צריך פריטים בגודל שווה. לכל המצביעים אותו גודל. `s.as_ref()` הופכת `&Box<dyn Shape>` ל-`&dyn Shape`.

מתי להשתמש במה? Generics בשביל מהירות וכשהסוג ידוע בזמן קומפילציה; trait objects כשצריך אוסף מעורב או כשרוצים לשמור על קוד מקומפל קטן.

## עיצוב מספרים עשרוניים

`{:.2}` בתוך placeholder מדפיס מספר עשרוני עם שתי ספרות אחרי הנקודה: `println!("{:.2}", 3.14159)` מדפיס `3.14`.

> **שימו לב:** `error[E0046]: not all trait items implemented, missing: `name`` means an `impl` is missing a required method. כלומר, חסרה מתודה נדרשת במימוש.
>
> **שימו לב:** `error[E0277]: the trait bound `T: PartialOrd` is not satisfied` (או E0369) אומרת שפונקציה גנרית משתמשת בפעולה בלי להצהיר עליה ב-bounds.
>
> **שימו לב:** `error[E0038]: the trait cannot be made into an object` מופיעה כש-trait שמשתמשים בו עם `dyn` יש לו מתודות שמחזירות `Self` או שהן גנריות.
>
> **שימו לב:** `Vec<Shape>` בלי `Box<dyn ...>` נותן `the size for values of type `dyn Shape` cannot be known at compilation time`.

## להמשך

הוסיפו `Triangle`, תנו ל-`Shape` מתודת ברירת מחדל כמו `describe(&self) -> String`, או כתבו `fn sum<T: std::ops::Add<Output = T> + Copy>(a: T, b: T) -> T` גנרית.

> **תורכם:** ממשו את `Shape` עבור `Rect` (`w * h`, השם `rect`) ועבור `Circle` (`3.14159 * r * r`, השם `circle`), הפכו את `largest` לגנרית על `T: PartialOrd + Copy`, וגרמו ל-`print_area` להדפיס `<name> area <area with two decimals>`.
