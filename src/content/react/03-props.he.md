---
title: "Props"
summary: "מעבירים נתונים לתוך קומפוננטה."
hints:
  - "Props הם הקלטים של קומפוננטה. בתוך הפונקציה אפשר לפרק בסוגריים את אלה שצריך, ואפשר לתת ערך ברירת מחדל עם סימן שווה."
  - "שנו את הפרמטר ל-{ name, greeting = \"Hello\" } כדי שלפרמטר greeting יהיה ערך חלופי, ואז הדפיסו את שני הערכים בתוך הפסקה עם סוגריים מסולסלים."
  - "function Greeting({ name, greeting = \"Hello\" }) { return <p>{greeting}, {name}!</p>; }"
quiz:
  - q: "איך מעבירים ערך לקומפוננטה?"
    options: ["רק עם משתנה גלובלי", "על ידי עריכת שם הפונקציה", "כמאפיין: <Greeting name=\"Ava\" />"]
  - q: "בתוך function Greeting(props), איך קוראים את ה-prop בשם name?"
    options: ["props.name", "this.name()", "name.props"]
  - q: "איך מעבירים מספר (ולא טקסט) כ-prop?"
    options: ["<Box size=\"5\" />", "<Box size={5} />", "<Box size=5 />"]
    explain: "מרכאות תמיד יוצרות מחרוזת. סוגריים מסולסלים מעבירים ערך של JavaScript: מספר, ערך בוליאני, מערך, משתנה."
  - q: "האם קומפוננטה יכולה לשנות את ה-props שהיא מקבלת?"
    options: ["כן, עם props.name = \"x\"", "כן, אבל רק מספרים", "לא, props הם קלטים לקריאה בלבד"]
---

קומפוננטה שמציגה תמיד את אותו דבר היא לא שימושית במיוחד. **Props** (קיצור של "properties", תכונות) הם הקלטים של קומפוננטה, כמו שארגומנטים הם הקלטים של פונקציה. הם מאפשרים להשתמש באותה קומפוננטה בהרבה מקומות עם נתונים שונים.

## מעבירים וקוראים props

מעבירים props כמאפיינים בתגית, והקומפוננטה מקבלת אותם כאובייקט:

```jsx
function Greeting(props) {
  return <p>Hello, {props.name}!</p>;
}

<Greeting name="Ava" />
<Greeting name="Noam" />
```

זה מציג `Hello, Ava!` ו-`Hello, Noam!` עם אותה קומפוננטה פעמיים. כל מאפיין הופך לתכונה (property) של `props`.

## Destructuring

לכתוב `props.` כל הזמן זה מרעיש. **פירוק** (destructuring) שולף את התכונות שרוצים ישר ברשימת הפרמטרים:

```jsx
function Greeting({ name }) {
  return <p>Hello, {name}!</p>;
}
```

הסוגריים המסולסלים בפרמטר הם פירוק של JavaScript, ואלה שב-JSX הם ה"חלון אל JavaScript" שראיתם בשיעור הקודם. אותו סימן, בשני מקומות שונים.

## מעבירים דברים שאינם טקסט

ערך במרכאות הוא תמיד מחרוזת. כדי להעביר כל דבר אחר, משתמשים בסוגריים מסולסלים:

```jsx
<Product name="Mug" price={12} inStock={true} tags={["new", "sale"]} />
```

prop שנכתב בלי ערך, כמו `<Product inStock />`, פירושו `true`.

## ערכי ברירת מחדל

אם מי שקורא לקומפוננטה עשוי להשמיט prop, תנו לו ערך ברירת מחדל בפירוק:

```jsx
function Greeting({ name, greeting = "Hello" }) {
  return <p>{greeting}, {name}!</p>;
}

<Greeting name="Ava" />                    // Hello, Ava!
<Greeting name="Noam" greeting="Hi" />     // Hi, Noam!
```

## Props הם לקריאה בלבד

קומפוננטה לעולם לא צריכה לשנות את ה-props של עצמה. אם אתם צריכים משהו שמשתנה, זו העבודה של **state** (מצב), שנמצא במרחק שני שיעורים. חשבו על props כעל "מה שההורה שלי אומר לי" ועל state כעל "מה שאני זוכר בעצמי".

> **שימו לב:**
> - `Cannot read properties of undefined (reading 'name')`: כתבתם `props.name` אבל ההורה לא העביר `name`, או ששכחתם את הפרמטר `props`.
> - אם אתם רואים `Hello, !` עם שם ריק: ה-prop נקרא אחרת אצל ההורה (`<Greeting nme="Ava" />`) או שלא הדפסתם אותו עם סוגריים מסולסלים.
> - אם מעבירים `age="21"` ואז עושים חשבון: זה הטקסט `"21"`. כתבו `age={21}`.
> - שמות ה-props בסוגריים הלא נכונים: `function Greeting(name)` מקבלת את כל אובייקט ה-props. השתמשו ב-`{ name }`.

> **תורכם:** גרמו ל-`Greeting` להדפיס `{greeting}, {name}!` ותנו ל-`greeting` את ערך ברירת המחדל `"Hello"`, כך שהדף יציג `Hello, Ava!` ו-`Hi, Noam!`.
