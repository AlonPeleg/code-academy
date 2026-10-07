---
title: "Option, Result וטיפול בשגיאות"
summary: "מחליפים null וחריגות ב-Option וב-Result, ומשתמשים ב-match, ב-unwrap_or ובאופרטור ? כדי לטפל בכשלון."
hints:
  - "s.parse::<u32>() מחזירה Result שהוא Ok(number) או Err(...). המירו את השגיאה שלה להודעה משלכם בעזרת map_err, או השתמשו ב-match על התוצאה."
  - "let n = s.parse::<u32>().map_err(|_| format!(\"not a number: {}\", s))?;  אחר כך בדקו אם n > 150 והחזירו Err(format!(\"too old: {}\", n)); סיימו עם Ok(n). עבור first_even עברו בלולאה והחזירו Some(x) כש-x % 2 == 0."
  - "fn total_age(a: &str, b: &str) -> Result<u32, String> { let x = parse_age(a)?; let y = parse_age(b)?; Ok(x + y) }"
messages:
  - "השתמשו ב-s.parse::<u32>() כדי להפוך טקסט למספר."
  - "השתמשו באופרטור ? בתוך total_age."
quiz:
  - q: "ב-Rust אין null. במה היא משתמשת במקום, כדי לומר 'אולי אין ערך'?"
    options: ["Option<T> עם Some ו-None", "המספר 0", "חריגות (exceptions)"]
  - q: "מה עושה האופרטור ? על Result?"
    options: ["מתעלם מהשגיאה", "מחזיר את ערך ה-Ok, או מחזיר את ה-Err מהפונקציה הנוכחית מיד", "מדפיס את השגיאה"]
  - q: "מה קורה כשקוראים ל-unwrap() על None או על Err?"
    options: ["הוא מחזיר ערך ברירת מחדל", "התוכנית קורסת (panic)", "הוא מחזיר 0"]
    explain: "unwrap מתאים לניסויים מהירים, אבל בקוד אמיתי צריך לטפל בכשלון עם match, unwrap_or או ?."
  - q: "באילו פונקציות אפשר להשתמש באופרטור ?"
    options: ["בכל פונקציה", "רק בפונקציות שמחזירות Result או Option (בהתאמה לסוג השגיאה)", "רק ב-main"]
---

כל תוכנית צריכה להתמודד עם דברים שמשתבשים: קובץ חסר, משתמש שמקליד אותיות איפה שציפו למספר, רשימה ריקה. שפות רבות עונות עם `null` ("טעות במיליארד דולר") או עם חריגות שיכולות לעוף מכל שורה. Rust הופכת כשלון ל**חלק מהסוג**. פונקציה שאולי לא תיתן ערך מחזירה `Option`; פונקציה שאולי תיכשל מחזירה `Result`. הקומפיילר **מחייב** אתכם לטפל במקרה הכשלון לפני שתוכלו להשתמש בערך, וזה מבטל קבוצה עצומה של קריסות.

## Option: משהו או כלום

```rust
enum Option<T> {
    Some(T),
    None,
}
```

`Option` הוא enum רגיל (כמו אלה מהשיעורים הקודמים) שמובנה ב-Rust. ה-`T` הוא מציין מקום לסוג **גנרי** (generic): `Option<i32>` הוא או `Some(5)` או `None`.

```rust
fn first_even(v: &[i32]) -> Option<i32> {
    for &x in v {
        if x % 2 == 0 { return Some(x); }
    }
    None
}

match first_even(&[1, 4]) {
    Some(n) => println!("found {}", n),   // prints: found 4
    None => println!("no even number"),
}
```

(`&[i32]` הוא slice של מספרים שלמים: מבט מושאל על Vec או על מערך. ה-`&x` בתבנית של `for` מעתיק כל מספר מתוך ההפניה.)

אי אפשר להשתמש ב-`Option<i32>` כאילו הוא `i32`: קודם צריך לבדוק מה הוא. זו התרופה לקריסות של מצביע null. קיצורי דרך שימושיים:

| מתודה | משמעות |
| --- | --- |
| `opt.unwrap_or(0)` | הערך, או 0 כשהוא `None` |
| `opt.is_some()` / `is_none()` | בדיקה בלי לפרק |
| `opt.unwrap()` | הערך, או **panic** כשהוא `None` |
| `if let Some(n) = opt { ... }` | להריץ קוד רק כשהוא `Some` |

## Result: הצלחה או שגיאה

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`Result` נושא או את ערך ההצלחה `T` או ערך שגיאה `E`. המרת טקסט למספר יכולה להיכשל, ולכן היא מחזירה `Result`:

```rust
let a = "42".parse::<u32>();   // Ok(42)
let b = "abc".parse::<u32>();  // Err(ParseIntError { kind: InvalidDigit })
```

ה-`::<u32>` ("turbofish") אומר ל-`parse` איזה סוג להפיק. אפשר לטפל ב-Result עם `match` כמו קודם. כשרוצים הודעת שגיאה משלכם במקום זו של הספרייה, ממירים אותה בעזרת `map_err`:

```rust
let n = s.parse::<u32>().map_err(|_| format!("not a number: {}", s))?;
```

ה-`|_| ...` הוא **closure**, פונקציה אנונימית קטנטנה; `_` אומר "אני מתעלם מהקלט". `format!` בונה את ההודעה.

## האופרטור ?

כתיבת `match` אחרי כל קריאה נעשית רועשת. האופרטור `?` אומר: "אם זה `Ok`, תן לי את הערך שבפנים; אם זה `Err`, **החזר את השגיאה הזאת מהפונקציה שלי עכשיו**."

```rust
fn total_age(a: &str, b: &str) -> Result<u32, String> {
    let x = parse_age(a)?;    // on Err, total_age returns the Err immediately
    let y = parse_age(b)?;
    Ok(x + y)
}
```

כדי שזה יעבוד, הפונקציה עצמה חייבת להחזיר `Result` (או `Option`) עם סוג שגיאה תואם. המסלול הרגיל נשאר קל לקריאה, והשגיאות זורמות כלפי מעלה אל הקוד שיודע מה לעשות איתן.

## panic, unwrap ו-expect

`unwrap()` ו-`expect("message")` שולפות את הערך ו**קורסות** (panic: מפילות את ה-thread עם הודעה) בכשלון. הן בסדר בניסויים מהירים ובמקרים שבאמת אי אפשר שייכשלו, אבל ספרייה או תוכנית אמיתית צריכות להחזיר `Result` במקום, כדי שהקורא יחליט.

> **שימו לב:** `error[E0277]: the `?` operator can only be used in a function that returns `Result` or `Option`` happens when you use `?` in `main` without a return type (or in a function returning `()`). כלומר, השתמשתם באופרטור בפונקציה שלא מחזירה Result או Option.
>
> **שימו לב:** `error[E0308]: mismatched types ... expected `u32`, found `Result<u32, ...>`` means you forgot to unpack: add `?`, `unwrap_or` or a `match`. כלומר, שכחתם לפרק את התוצאה.
>
> **שימו לב:** ל-`?` צריך שסוגי השגיאות יהיו ניתנים להמרה. `ParseIntError` לא יכול להפוך ל-`String` אוטומטית, ולכן אנחנו משתמשים ב-`map_err`.
>
> **שימו לב:** `called `Option::unwrap()` on a `None` value` הוא panic שנגרם מ-`unwrap` רשלני.

> **תורכם:** ממשו את `parse_age` (המירו, ודווחו `not a number: ...` ו-`too old: ...`), את `first_even` (החזירו `Some` או `None`) ואת `total_age` עם האופרטור `?`.
