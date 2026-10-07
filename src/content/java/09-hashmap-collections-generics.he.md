---
title: "HashMap, אוספים וגנריות"
summary: "ספרו דברים עם HashMap, הסירו כפילויות עם HashSet, וכתבו מחלקה גנרית משלכם."
hints:
  - "מחלקה גנרית נותנת שמות למקומות השמורים לטיפוסים בסוגריים משולשים: class Pair<A, B> { private A first; private B second; ... }. HashMap שומרת זוגות של מפתח וערך: put(key, value) ו-get(key)."
  - "ספירה: for (String w : words) { counts.put(w, counts.getOrDefault(w, 0) + 1); }. קבוצה (set) ממערך: new HashSet<>(Arrays.asList(words)) דורשת java.util.Arrays, או פשוט לעבור בלולאה ולקרוא ל-add. כדי למצוא את המקסימום, עברו בלולאה על counts.entrySet() וזכרו את הערך הגדול ביותר."
  - "Map<String, Integer> counts = new HashMap<>(); for (String w : words) { counts.put(w, counts.getOrDefault(w, 0) + 1); } for (Map.Entry<String, Integer> e : new TreeMap<>(counts).entrySet()) { System.out.println(e.getKey() + \"=\" + e.getValue()); } HashSet<String> unique = new HashSet<>(); for (String w : words) { unique.add(w); } System.out.println(\"Unique words: \" + unique.size());  אחר כך עברו בלולאה על counts.entrySet() ושמרו את הרשומה הטובה ביותר, ובנו  new Pair<String, Integer>(bestWord, bestCount)."
quiz:
  - q: "מה HashMap שומרת?"
    options: ["רשימה ממוינת של מספרים", "זוגות של מפתח וערך עם חיפוש מהיר לפי מפתח", "רק מחרוזות", "ערכים כפולים לפי הסדר"]
  - q: "מה HashSet עושה כשמוסיפים לה ערך שכבר נמצא בה?"
    options: ["זורקת חריגה", "שומרת עותק שני", "מתעלמת מזה, הקבוצה שומרת כל ערך פעם אחת", "מחליפה את כל הקבוצה"]
  - q: "למה אסור להסתמך על סדר המעבר על HashMap?"
    options: ["הוא אקראי בכל הרצה, וזה באג", "הסדר אינו מובטח, ולכן משתמשים ב-TreeMap או ב-LinkedHashMap כשהסדר חשוב", "היא תמיד ממיינת לפי ערך", "אי אפשר לעבור על HashMap בלולאה"]
  - q: "מה משמעות ה-<T> ב-  class Box<T>  ?"
    options: ["T הוא מקום שמור לכל טיפוס שנבחר כשמשתמשים ב-Box", "T הוא שם של מתודה", "Box יכולה להחזיק רק מחרוזות", "זו הערה"]
messages:
  - "הצהירו על המחלקה הגנרית: class Pair<A, B>."
  - "צרו HashMap<String, Integer>."
  - "צרו HashSet<String>."
  - "השתמשו ב-Pair<String, Integer> עבור המילה השכיחה ביותר."
---

מערכים ו-`ArrayList` שומרים דברים לפי סדר, אבל לפעמים רוצים **לחפש משהו לפי שם**, או לשמור רק ערכים **ייחודיים**. ל-**framework האוספים** (collections framework) של Java יש כלים מוכנים לזה, ו-**גנריות** (generics) היא היכולת שהופכת אותם לבטוחים מבחינת טיפוסים.

## Map: חיפוש לפי מפתח

`Map` שומרת זוגות של **מפתח וערך**, כמו מילון או ספר טלפונים. המימוש הנפוץ הוא `HashMap`:

```java
import java.util.HashMap;

HashMap<String, Integer> ages = new HashMap<>();
ages.put("Ada", 36);
ages.put("Linus", 28);
System.out.println(ages.get("Ada"));          // 36
System.out.println(ages.get("Zoe"));          // null  (no such key)
System.out.println(ages.getOrDefault("Zoe", 0)); // 0
System.out.println(ages.containsKey("Linus")); // true
ages.remove("Linus");
System.out.println(ages.size());              // 1
```

הוספת מפתח שכבר קיים **מחליפה** את הערך שלו. ב-`HashMap<String, Integer>` הטיפוס הראשון הוא המפתח והשני הוא הערך. מפתחות חייבים להיות ייחודיים, וערכים יכולים לחזור.

### תבנית הספירה

אחד הטריקים השימושיים ביותר בתכנות הוא ספירה של כמה פעמים דברים מופיעים:

```java
for (String w : words) {
    counts.put(w, counts.getOrDefault(w, 0) + 1);
}
```

קראו את זה כך: קחו את הספירה הנוכחית של `w` (או 0 אם לא נראתה מעולם), הוסיפו אחד, ושמרו בחזרה. Java מציעה גם את `counts.merge(w, 1, Integer::sum)` לאותה משימה.

### מעבר בלולאה על מפה

```java
for (Map.Entry<String, Integer> e : counts.entrySet()) {
    System.out.println(e.getKey() + "=" + e.getValue());
}
```

כל **רשומה** (entry) היא זוג אחד של מפתח וערך. אפשר גם לעבור בלולאה על `counts.keySet()` או על `counts.values()`.

## באיזה סדר?

`HashMap` **לא מבטיחה** דבר לגבי סדר הרשומות שלה. היא עשויה להיראות ממוינת היום ושונה אחרי שינוי קטן. אם הסדר חשוב:

* `TreeMap` שומרת מפתחות **ממוינים** (לפי אלפבית או לפי מספרים).
* `LinkedHashMap` שומרת את **סדר ההוספה**.

טריק שימושי הוא לעטוף HashMap: `new TreeMap<>(counts)` נותן עותק ממוין.

## Set: כל ערך פעם אחת

ב-`Set` אין כפילויות. `HashSet` מהירה, ו-`TreeSet` ממוינת:

```java
HashSet<String> seen = new HashSet<>();
seen.add("cat");
seen.add("dog");
seen.add("cat");           // ignored
System.out.println(seen.size());       // 2
System.out.println(seen.contains("dog")); // true
```

קבוצות מושלמות לשאלה "האם כבר ראיתי את זה?" ולהסרת כפילויות מרשימה: `new HashSet<>(list)`.

## גנריות: טיפוסים כפרמטרים

כבר ראיתם `ArrayList<String>`. ה-`<String>` הוא **ארגומנט טיפוס** (type argument), והוא מה שמונע מכם להוסיף `Integer` לרשימה של מחרוזות (הקומפיילר דוחה את זה) ומבטל את הצורך בהמרה בעת הקריאה. אפשר לכתוב מחלקות גנריות משלכם, עם שם למקום שמור, ובדרך כלל זו אות גדולה אחת:

```java
class Box<T> {
    private T value;
    Box(T value) { this.value = value; }
    T get() { return value; }
}

Box<String> b = new Box<>("hello");
String s = b.get();          // no cast needed
Box<Integer> n = new Box<>(7);
```

`T` מייצג "טיפוס כלשהו שמי שמשתמש במחלקה יחליט עליו". `Pair<A, B>` משתמשת בשני מקומות שמורים. גם מתודות יכולות להיות גנריות: `static <T> T first(List<T> list)`.

גנריות עובדת רק עם טיפוסי אובייקטים, ולכן כותבים `Integer`, `Double`, `Boolean` במקום `int`, `double`, `boolean`. Java ממירה ביניהם אוטומטית (**autoboxing**).

> **שימו לב:**
> - שימוש ב-`int` כארגומנט טיפוס, `HashMap<String, int>`, גורם ל-`error: unexpected type; required: reference, found: int`. כתבו `Integer`.
> - `int n = map.get("missing");` קורסת עם `NullPointerException`, כי `get` מחזירה `null` ו-Java מנסה לפרק אותו (unbox). השתמשו ב-`getOrDefault` או בדקו עם `containsKey`.
> - השוואה של שני אובייקטי `Integer` עם `==` יכולה להיות false גם עבור מספרים שווים מעל 127. השתמשו ב-`.equals(...)`.
> - שינוי מפה בזמן מעבר עליה בלולאה זורק `ConcurrentModificationException`.
> - שכחת `import java.util.HashMap;` גורמת ל-`error: cannot find symbol`.
> - מפתחות שניתנים לשינוי מסוכנים: אם משנים אובייקט אחרי שהשתמשתם בו כמפתח, ייתכן שהמפה כבר לא תמצא אותו.

## להמשיך הלאה

הדפיסו קודם את המילים עם הספירות הגבוהות ביותר, על ידי הכנסת הרשומות ל-`ArrayList` ומיון עם comparator. השתמשו ב-`TreeMap` במקום ב-`HashMap` ובדקו מה משתנה. כתבו מתודה גנרית `static <T> void printAll(List<T> items)`.

> **תורכם:** כתבו `class Pair<A, B>` עם בנאי ועם ה-getters `getFirst` ו-`getSecond`. ספרו את המילים של `text` ב-`HashMap<String, Integer>`, הדפיסו את הספירות לפי סדר אלפביתי בעזרת `TreeMap`, הדפיסו את מספר המילים הייחודיות בעזרת `HashSet<String>`, ושמרו את המילה השכיחה ביותר ב-`Pair<String, Integer>` כדי להדפיס `Pair: the -> 3`.
