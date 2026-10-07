---
title: "הפניות והשאלה (References and borrowing)"
summary: "נותנים לפונקציות להשתמש בערכים בלי לקחת בעלות, בעזרת השאלה עם & ו-&mut, ומכירים slices."
hints:
  - "הפניה (&) מאפשרת לפונקציה להסתכל על ערך בלי להיות הבעלים שלו. & משאילה לקריאה בלבד, ו-&mut משאילה כך שאפשר לשנות. גם בקריאה לפונקציה צריך את הסימן המתאים."
  - "ב-main כתבו calc_len(&text) ו-add_excl(&mut text). בתוך add_excl השתמשו ב-s.push('!'). עבור first_word עברו בלולאה על s.char_indices() והחזירו &s[..i] כשאתם רואים רווח."
  - "fn calc_len(s: &String) -> usize { s.len() }   fn add_excl(s: &mut String) { s.push('!'); }   for (i, c) in s.char_indices() { if c == ' ' { return &s[..i]; } }   s"
messages:
  - "השאילו את text עם calc_len(&text)."
  - "השאילו את text כ-mutable עם add_excl(&mut text)."
  - "calc_len צריכה להחזיר את s.len()."
quiz:
  - q: "מהי הפניה (reference)?"
    options: ["העתק של ערך", "דרך להשתמש בערך בלי להיות הבעלים שלו", "סוג של לולאה"]
  - q: "כמה הפניות mutable לאותו ערך יכולות להתקיים בו-זמנית?"
    options: ["כמה שרוצים", "בדיוק אחת (ואף הפניה משותפת באותו זמן)", "אפס, הן אסורות"]
    explain: "הכלל הזה מונע data races ושינויים מפתיעים בזמן שמישהו אחר קורא."
  - q: "מה נותן ה-slice  &s[0..5] ?"
    options: ["String חדש עם עותק של חמשת הבתים הראשונים", "מבט על חמשת הבתים הראשונים של s, בלי העתקה", "את חמש המילים הראשונות"]
  - q: "למה כדאי לקבל  &str  ולא  &String  כפרמטר?"
    options: ["זה מקבל גם Strings וגם מחרוזות קבועות (literals)", "זה מהיר יותר להקלדה", "זה מאפשר לפונקציה לשנות את הטקסט"]
---

בשיעור הקודם, העברת `String` לפונקציה לקחה אותו משם. זה מסורבל כשפונקציה רק רוצה *להסתכל* על הנתונים. התשובה של Rust היא **השאלה** (borrowing): נותנים **הפניה** (reference), מצביע שמאפשר למישהו להשתמש בערך בלי להיות הבעלים שלו. כשהמשאיל מסיים, הבעלים עדיין מחזיק בהכול.

## הפניות משותפות: &

```rust
fn calc_len(s: &String) -> usize {
    s.len()
}

fn main() {
    let text = String::from("hello");
    let n = calc_len(&text);        // lend text out
    println!("{} has {}", text, n); // text is still ours: prints: hello has 5
}
```

`&text` יוצרת הפניה, וסוג הפרמטר `&String` אומר "אני שואל String". הפונקציה יכולה לקרוא דרכה, אבל לא יכולה לשנות או לשחרר אותו. אפשר שיהיה **מספר כלשהו** של הפניות משותפות לערך באותו זמן, כי אף אחד לא משנה אותו.

## הפניות הניתנות לשינוי: &mut

כדי לאפשר לפונקציה לשנות את מה ששאלה, משתמשים ב-`&mut` בשני הצדדים, והופכים את המשתנה המקורי ל-`mut`:

```rust
fn add_excl(s: &mut String) {
    s.push('!');
}

let mut text = String::from("hi");
add_excl(&mut text);
println!("{}", text);    // prints: hi!
```

## כללי ההשאלה

הקומפיילר אוכף שני כללים, לכל ערך, בכל רגע:

1. מותרת **או** הפניה mutable אחת **או** מספר כלשהו של הפניות משותפות, אף פעם לא שניהם.
2. הפניה לעולם לא יכולה לחיות יותר מהערך שהיא מצביעה עליו.

```rust
let mut s = String::from("a");
let r1 = &s;
let r2 = &s;           // fine: two readers
let r3 = &mut s;       // error[E0502]: cannot borrow `s` as mutable because it is also borrowed as immutable
println!("{} {}", r1, r2);
```

למה כל כך מחמיר? תארו לעצמכם חלק אחד בתוכנית שקורא רשימה בזמן שחלק אחר מוסיף לה והרשימה זזה בזיכרון: הקורא היה מסתכל על זבל. Rust שוללת את זה כבר בזמן הקומפילציה, ולכן קבוצות שלמות של באגים (data races, מצביעים תלויים) לא יכולות להתקיים ב-Rust הבטוחה.

הפניה חיה רק עד **השימוש האחרון** בה, לא עד סוף הבלוק, ולכן זה עובד:

```rust
let mut s = String::from("a");
let r1 = &s;
println!("{}", r1);    // last use of r1
let r2 = &mut s;      // fine now
r2.push('b');
```

## Slices

**Slice** הוא הפניה ל*חלק* מאוסף. עבור טקסט כותבים אותו `&str`:

```rust
let s = String::from("hello world");
let hello = &s[0..5];    // "hello"
let world = &s[6..];     // "world"
let all   = &s[..];      // everything
```

טווחים עובדים כמו בלולאות `for`, ואפשר להשמיט את ההתחלה או את הסוף. מחרוזות קבועות כמו `"hi"` הן כבר `&str`. לכן פונקציות שרק קוראות טקסט צריכות לקבל `&str`: זה מקבל גם מחרוזות קבועות וגם Strings (מושאלים). Slices הם מבטים, ולכן שום דבר לא מועתק.

`first_word` מדגימה את הרעיון. היא עוברת על `char_indices()`, שנותנת לכל תו את המיקום `i` ואת התו `c`, ומחזירה slice עד הרווח הראשון:

```rust
fn first_word(s: &str) -> &str {
    for (i, c) in s.char_indices() {
        if c == ' ' { return &s[..i]; }
    }
    s
}
```

> **שימו לב:** `error[E0308]: mismatched types ... expected `&String`, found `String`` means you forgot the `&` at the call. כלומר, שכחתם את סימן ה-& בקריאה.
>
> **שימו לב:** `error[E0596]: cannot borrow `text` as mutable, as it is not declared as mutable` אומרת שהמשתנה צריך `let mut`.
>
> **שימו לב:** `error[E0499]: cannot borrow `s` as mutable more than once at a time` אומרת ששתי הפניות `&mut` חופפות. סיימו את העבודה עם הראשונה לפני שיוצרים את השנייה.
>
> **שימו לב:** מיקומים ב-slice נמדדים ב-**בתים**, ולכן חיתוך באמצע תו כמו `é` גורם ל-panic. הישארו עם `char_indices` ו-`find` עבור טקסט.

> **תורכם:** השלימו את `calc_len` (החזירו `s.len()`), את `add_excl` (`push('!')`) ואת `first_word`, ואז תקנו את `main` כך שישאיל: `calc_len(&text)` ו-`add_excl(&mut text)`.
