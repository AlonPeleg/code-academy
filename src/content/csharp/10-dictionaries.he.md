---
title: "מילונים (Dictionaries)"
summary: "מחפשים ערכים לפי מפתח בעזרת Dictionary<K,V>, וסופרים דברים."
hints:
  - "מילון שומר זוגות: מפתח -> ערך. כאן המפתח הוא המילה והערך הוא כמה פעמים ראיתם אותה. שאלו את counts אם הוא כבר מכיל מפתח לפני שאתם מוסיפים לו 1."
  - "foreach (string w in words) { if (counts.ContainsKey(w)) { counts[w] += 1; } else { counts[w] = 1; } }   בשביל הפלט הממוין, צרו  new List<string>(counts.Keys)  וקראו ל-Sort() עליה. counts.Count נותן את מספר המפתחות."
  - "List<string> keys = new List<string>(counts.Keys);  keys.Sort();  foreach (string k in keys) { Console.WriteLine($\"{k}: {counts[k]}\"); }  Console.WriteLine($\"Different words: {counts.Count}\");"
messages:
  - "בדקו אם המילה כבר קיימת כמפתח (ContainsKey או TryGetValue)."
  - "השתמשו ב-foreach כדי לעבור על המילים."
  - "מיינו את רשימת המפתחות בעזרת Sort()."
quiz:
  - q: "ב-Dictionary<string, int>, מהם שני הטיפוסים?"
    options: ["טיפוס המפתח וטיפוס הערך", "טיפוס הערך וטיפוס המפתח", "שניהם מפתחות", "האורך והקיבולת"]
  - q: "איך בודקים אם מפתח קיים?"
    options: ["dict.Has(key)", "dict.Exists(key)", "dict.ContainsKey(key)", "dict.Find(key)"]
  - q: "מה קורה כשקוראים מפתח שלא קיים בעזרת dict[key]?"
    options: ["מקבלים 0", "מקבלים null", "התוכנית ממתינה", "נזרקת KeyNotFoundException"]
  - q: "למה ממיינים את המפתחות לפני ההדפסה בשיעור הזה?"
    options: ["מילון לא מבטיח שום סדר מסוים של הפריטים שלו", "אי אפשר להדפיס מילון בדרך אחרת", "המיון מגדיל את הספירות", "foreach דורש Sort"]
---

**רשימה** (list) מוצאת דברים לפי מיקום: "פריט מספר 3". **מילון** (dictionary) מוצא דברים לפי **מפתח** (key) שאתם בוחרים: "מספר הטלפון של מאיה". הוא שומר **זוגות** של מפתח וערך, וחיפוש לפי מפתח הוא מהיר מאוד גם כשיש אלפי רשומות.

## יצירה ומילוי

`Dictionary<TKey, TValue>` נמצא ב-`System.Collections.Generic`. הטיפוס הראשון הוא המפתח, והשני הוא הערך:

```csharp
Dictionary<string, int> ages = new Dictionary<string, int>();
ages["Ava"] = 20;        // add (or replace) a pair
ages["Noam"] = 25;
ages.Add("Maya", 31);    // Add only works for a NEW key

Console.WriteLine(ages["Noam"]);   // 25
Console.WriteLine(ages.Count);     // 3
```

אפשר גם למלא מילון מיד בעזרת **אתחול** (initializer):

```csharp
var prices = new Dictionary<string, double>
{
    { "tea", 2.5 },
    { "coffee", 3.0 }
};
```

## חיפוש בטוח

קריאה של מפתח שלא קיים גורמת לקריסה, ולכן בודקים קודם:

```csharp
if (ages.ContainsKey("Ava"))
{
    Console.WriteLine(ages["Ava"]);
}

int age;
if (ages.TryGetValue("Dana", out age))
{
    Console.WriteLine(age);
}
else
{
    Console.WriteLine("Dana is not in the dictionary");
}
```

`TryGetValue` עושה את הבדיקה ואת הקריאה בצעד אחד. חברים שימושיים נוספים: `Remove(key)`, `Count`, `Keys` ו-`Values`.

## מעבר על כל הזוגות

כל פריט הוא `KeyValuePair` עם `.Key` ו-`.Value`:

```csharp
foreach (KeyValuePair<string, int> pair in ages)
{
    Console.WriteLine($"{pair.Key} is {pair.Value}");
}
```

**הסדר אינו מובטח.** מילון בנוי לחיפוש מהיר ולא לשמירה על סדר, ולכן אסור להסתמך על הסדר שבו `foreach` מחזיר את הזוגות. אם הפלט שלכם חייב להיות בסדר מסוים, העתיקו את המפתחות לרשימה ומיינו אותה, כמו בשיעור הזה:

```csharp
List<string> keys = new List<string>(ages.Keys);
keys.Sort();
```

## תבנית הספירה

ספירה של כמה פעמים דברים מופיעים היא העבודה הקלאסית של מילון. לכל פריט: אם המפתח קיים, מוסיפים אחד; אחרת מתחילים מאחד:

```csharp
foreach (string w in words)
{
    if (counts.ContainsKey(w)) { counts[w] += 1; }
    else { counts[w] = 1; }
}
```

> **שימו לב:**
> - קריאה של מפתח חסר עם `counts["pear"]` קורסת עם `System.Collections.Generic.KeyNotFoundException: The given key 'pear' was not present in the dictionary.`
> - `Add` עם מפתח שכבר קיים קורסת עם `ArgumentException: An item with the same key has already been added`. השתמשו ב-`dict[key] = value` כשרוצים להוסיף או להחליף.
> - מפתחות חייבים להיות ייחודיים. קביעה של אותו מפתח פעמיים מחליפה את הערך הראשון.
> - שינוי המילון (הוספה או הסרה של מפתחות) בזמן שעוברים עליו עם `foreach` זורק `InvalidOperationException`.

> **תורכם:** ספרו כמה פעמים כל מילה מופיעה ב-`words`. הדפיסו את המילים לפי הסדר האלפביתי בצורה `word: count`, ואז הדפיסו `Different words: 3` בעזרת `Count` של המילון.
