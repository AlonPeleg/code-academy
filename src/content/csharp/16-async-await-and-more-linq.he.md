---
title: "Async/await ועוד LINQ"
summary: "מריצים עבודה בעזרת Task ו-await, ואז מקבצים, ממיינים ומחברים נתונים עם LINQ."
hints:
  - "async מסמנת מתודה שיכולה להשתמש ב-await. await משהה את המתודה עד ש-Task מסתיים, בלי לחסום thread; המתודה חייבת אז להחזיר Task או Task<T>. ב-Main רגילה ממתינים ל-task בעזרת .GetAwaiter().GetResult()."
  - "static async Task<int> SquareAsync(int n) { await Task.Delay(10); return n * n; }   tasks = new[] { SquareAsync(1), SquareAsync(2), ... }; int[] results = Task.WhenAll(tasks).GetAwaiter().GetResult();   students.OrderByDescending(s => s.Score).Select(s => s.Name);   students.GroupBy(s => s.CourseId).OrderBy(g => g.Key)"
  - "students.Join(courses, s => s.CourseId, c => c.Id, (s, c) => s.Name + \" -> \" + c.Title)   foreach (var g in students.GroupBy(s => s.CourseId).OrderBy(g => g.Key)) { Console.WriteLine(\"course \" + g.Key + \": \" + g.Count()); }   string.Join(\", \", ...) הופכת סדרה לטקסט."
messages:
  - "הגדירו static async Task<int> SquareAsync(int n)."
  - "השתמשו ב-await Task.Delay(10) בתוך SquareAsync."
  - "השתמשו ב-Task.WhenAll כדי להמתין לכל ה-tasks."
  - "השתמשו ב-OrderByDescending."
  - "השתמשו ב-GroupBy."
  - "השתמשו במתודת LINQ בשם Join."
quiz:
  - q: "מה מילת המפתח await עושה?"
    options: ["חוסמת את כל התוכנית עד שה-task מסתיים", "מתחילה thread חדש לכל קריאה", "משהה את מתודת ה-async הנוכחית עד שה-task מסתיים, ומאפשרת לעבודה אחרת להמשיך בינתיים"]
  - q: "מה חייב להיות טיפוס ההחזרה של מתודת async (חוץ מ-void עבור מטפלי אירועים)?"
    options: ["Task או Task<T>", "int", "Thread"]
  - q: "מה students.GroupBy(s => s.CourseId) מייצרת?"
    options: ["רשימה אחת ממוינת", "סדרה של קבוצות, שלכל אחת יש Key (מזהה הקורס) והסטודנטים שבה", "מילון של מחרוזות"]
  - q: "מה Join עושה ב-LINQ?"
    options: ["מדביקה מחרוזות", "ממתינה ל-thread", "מתאימה פריטים משני אוספים שהמפתחות שלהם שווים ומשלבת כל זוג"]
---

שני רעיונות בשיעור אחד: **async/await**, לעבודה שלוקחת זמן (המתנה לתשובה מהרשת, לקובץ או לטיימר) בלי להקפיא את התוכנית, וסבב שני של **LINQ**, לקיבוץ, מיון וחיבור של נתונים.

## Tasks ומתודות async

`Task` מייצג עבודה שתסתיים מאוחר יותר. `Task<int>` הוא עבודה שתפיק `int`. יוצרים אותם בקריאה ל**מתודת async**:

```csharp
static async Task<int> SquareAsync(int n)
{
    await Task.Delay(10);     // pretend to wait 10 milliseconds
    return n * n;
}
```

- `async` על המתודה מאפשר להשתמש בתוכה במילת המפתח `await`.
- טיפוס ההחזרה הוא `Task<int>`, אבל הקוד פשוט עושה `return n * n;`. C# עוטפת את הערך ב-task בשבילכם. למתודת async שאין לה מה להחזיר יש הטיפוס `Task`.
- `await Task.Delay(10)` משהה את **המתודה הזאת** עד שההשהיה נגמרת. בניגוד ל-`Thread.Sleep`, זה לא חוסם את ה-thread; ממשק משתמש ממשיך להגיב ושרת אינטרנט משרת בקשות אחרות בינתיים.
- לפי המוסכמה, שמות של מתודות async מסתיימים ב-`Async`.

## המתנה ל-task

ב-C# מודרנית אפשר לכתוב `static async Task Main()`. הקומפיילר Mono שבו משתמשים בשיעורים האלה תומך רק ב-`static void Main()` רגילה, ולכן ממתינים לתוצאה ביד:

```csharp
int result = SquareAsync(7).GetAwaiter().GetResult();
Console.WriteLine(result);      // prints: 49
```

`GetAwaiter().GetResult()` חוסמת עד שה-task מסתיים ומחזירה את הערך שלו (או זורקת את החריגה המקורית). בתוך מתודת async אחרת פשוט כותבים `int result = await SquareAsync(7);`.

## הרצת כמה tasks יחד

קריאה למתודת async מתחילה את העבודה מיד ונותנת לכם את ה-task. מתחילים כמה, ואז ממתינים לכולם:

```csharp
Task<int>[] tasks = { SquareAsync(1), SquareAsync(2), SquareAsync(3) };
int[] results = Task.WhenAll(tasks).GetAwaiter().GetResult();
Console.WriteLine(string.Join(" ", results));   // prints: 1 4 9
```

שלוש ההשהיות רצות באותו זמן, ולכן ההמתנה הכוללת היא בערך 10 מילישניות ולא 30. `WhenAll` מחזירה את התוצאות **באותו סדר של ה-tasks**, לא משנה מי הסתיים ראשון, ולכן הפלט נשאר צפוי.

## עוד LINQ

אתם מכירים את `Where`, `Select` ו-`Sum`. עוד שלושה אבני בניין (זכרו `using System.Linq;`):

**OrderBy / OrderByDescending** ממיינות לפי מפתח; `ThenBy` מוסיפה קריטריון לשובר שוויון:

```csharp
var sorted = people.OrderBy(p => p.Age).ThenBy(p => p.Name);
```

**GroupBy** מפצלת סדרה לקבוצות. לכל קבוצה יש `Key` והיא עצמה סדרה:

```csharp
foreach (var g in students.GroupBy(s => s.CourseId))
{
    Console.WriteLine(g.Key + ": " + g.Count());    // course id and how many students
}
```

**Join** מתאימה שני אוספים לפי מפתח, כמו join ב-SQL:

```csharp
var pairs = students.Join(courses,
                          s => s.CourseId,           // key from a student
                          c => c.Id,                 // key from a course
                          (s, c) => s.Name + " -> " + c.Title);   // what to produce per match
```

סטודנטים בלי קורס תואם נשמטים (inner join). רוב מתודות LINQ הן **עצלות** (lazy): שום דבר לא מחושב עד שעוברים בלולאה על התוצאה או קוראים ל-`ToList()`, ל-`Count()` או ל-`string.Join`. `OrderBy` היא יציבה, ולכן מפתחות שווים שומרים על הסדר המקורי שלהם.

> **שימו לב:**
> - שוכחים `using System.Threading.Tasks;`: `error CS0246: The type or namespace name 'Task' could not be found`.
> - שימוש ב-`await` במתודה שאינה `async`: `error CS4033: The 'await' operator can only be used within an async method`.
> - קריאה ל-`.Result` או ל-`.GetResult()` בתוך קוד של ממשק משתמש או של ווב עלולה להקפיא את האפליקציה (deadlock). תוכניות מסוף כמו אלה בטוחות, ואפליקציות אמיתיות צריכות לעשות `await` כל הדרך למעלה.
> - שוכחים שמתודת async רצה מיד עד ל-`await` הראשון: התחלת tasks לא ממתינה להם. תמיד עשו await או המתינו ל-tasks שהתחלתם.
> - `GroupBy` לא ממיינת. הוסיפו `OrderBy(g => g.Key)` אם אתם צריכים את הקבוצות בסדר מסוים.
> - סדר הפלט של tasks שבאמת רצים במקביל ומדפיסים אינו צפוי. אספו תוצאות והדפיסו אותן אחר כך.

## להמשך

הוסיפו `Average` לכל קבוצה: `g.Average(s => s.Score)`, או מיינו קבוצות לפי מספר הסטודנטים. נסו את `Task.WhenAny` כדי להגיב ל-task שמסתיים ראשון.

> **תורכם:** כתבו את `SquareAsync`, המתינו לארבעה מהם בעזרת `Task.WhenAll`, ואז הדפיסו את הדירוג (`OrderByDescending`), את מספר הסטודנטים בכל קורס (`GroupBy`) ואת ה-`Join` של סטודנטים עם שמות הקורסים שלהם, בדיוק כפי שההערות מתארות.
