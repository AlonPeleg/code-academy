---
title: "שלב 2: Layout משותף עם header, ניווט ו-footer"
summary: "בונים קומפוננטת Layout שעוטפת כל דף, בעזרת ה-prop בשם children."
hints:
  - "Layout היא קומפוננטה שמציירת אותה מסגרת סביב כל דף. הדף עצמו מגיע כ-prop בשם children: function Layout({ children }) ואת {children} כותבים במקום שבו הדף צריך להופיע."
  - "Layout מחזירה שלושה אלמנטים אחים, ולכן עטפו אותם ב-fragment (<> ... </>): header עם nav, אלמנט main (עם id=\"main\" והמחלקות \"container content\") שמציג את {children}, ו-footer. ב-App, הסירו את ה-main הישן ועטפו את תוכן הדף ב-<Layout> ... </Layout>."
  - "בקובץ Layout.jsx: <header className=\"site-header\"><div className=\"container\"><a className=\"brand\" href=\"#/\">Dev Blog</a><nav className=\"site-nav\" aria-label=\"Main\"><a href=\"#/\">Home</a><a href=\"#/about\">About</a></nav></div></header><main className=\"container content\" id=\"main\">{children}</main><footer className=\"site-footer\"><div className=\"container\"><p>Dev Blog, built with React. The posts come from the practice API.</p></div></footer>"
quiz:
  - q: "מהו ה-prop המיוחד children?"
    options:
      - "רשימה של כל הקומפוננטות בפרויקט"
      - "הקומפוננטות הבנות של מחלקה בתכנות מונחה עצמים"
      - "כל מה שכותבים בין תגית הפתיחה לתגית הסגירה של קומפוננטה"
  - q: "מדוע Layout עוטפת את הפלט שלה ב-<> ... </>?"
    options:
      - "קומפוננטה חייבת להחזיר אלמנט שורש אחד, ו-fragment מקבץ אלמנטים אחים בלי להוסיף תגית HTML נוספת"
      - "הוא הופך את ה-JSX ל-HTML רגיל"
      - "הוא גורם לדף להיטען מהר יותר"
  - q: "מה היתרון העיקרי של קומפוננטת Layout משותפת?"
    options:
      - "כל דף צריך לחזור על ה-header ועל ה-footer, אבל זה מהיר יותר"
      - "ה-header, הניווט וה-footer נכתבים פעם אחת וכל דף מקבל אותם"
      - "הדפדפן דורש אותה כדי שהנתב יעבוד"
    explain: "משנים את הניווט בקובץ אחד וכל הדפים משתנים. זו המטרה של הרכבה (composition)."
messages:
  - "Layout צריכה לקבל את ה-prop בשם children ולהציג אותו בתוך האלמנט main."
  - "סיימו את components/Layout.jsx בשורה: export default Layout;"
  - "ב-App.jsx הוסיפו: import Layout from './components/Layout';"
  - "עטפו באלמנט Layout את התוכן ש-App מחזירה."
---
כמעט לכל אתר יש header, ניווט ו-footer שנראים אותו דבר בכל דף. בשלב הזה תכתבו אותם פעם אחת, בקומפוננטה בשם `Layout`, ותעטפו בה כל דף.

## איפה אנחנו עומדים

האפליקציה מציגה את ששת הפוסטים לדוגמה, שנבנו מ-`PostCard` ומ-`pluralize`. הכול נמצא בתוך `<main>` אחד בקובץ `App.jsx`. עדיין אין header, אין ניווט ואין footer.

## מה נוסיף, ולמה זה חשוב

אם תעתיקו header לכל קובץ דף, שינוי שם של פריט בתפריט יחייב עריכה של עשרה קבצים, ואחד מהם בטח יישכח. React פותרת את זה בעזרת **הרכבה (composition)**: קומפוננטות שמכילות קומפוננטות אחרות. `Layout` מציירת את המסגרת, והדף מועבר אליה כ-**prop המיוחד `children`**. כך מאורגנת כמעט כל אפליקציית React (כולל אלו שמשתמשות ב-react-router, ב-Next.js או ב-Remix).

```jsx
<Layout>
  <h1>Latest posts</h1>
</Layout>
```

כל מה שכתוב בין `<Layout>` ל-`</Layout>` מגיע לקומפוננטה בתור `children`.

## הדרכה שלב אחר שלב

**1. יצירת הקומפוננטה.** בקובץ `components/Layout.jsx` כתבו `function Layout({ children })`. היא צריכה שלושה חלקים שיושבים זה לצד זה, ולכן החזירו אותם בתוך fragment, התגית הריקה `<> ... </>`. fragment מקבץ אלמנטים בלי להוסיף `div` מיותר לדף.

**2. ה-header.** השתמשו ב-`<header className="site-header">` עם `div.container` בתוכו (ה-container שומר על התוכן ממורכז ברוחב של 880px לכל היותר). הוסיפו את שם האתר (קישור עם המחלקה `brand`) ואת `<nav className="site-nav" aria-label="Main">` עם שני קישורים. ה-`aria-label` מסביר למשתמשי קורא מסך למה הניווט הזה מיועד, וזה חשוב כי בדף יכולים להיות כמה ניווטים.

```jsx
<nav className="site-nav" aria-label="Main">
  <a href="#/">Home</a>
  <a href="#/about">About</a>
</nav>
```

הכתובות `href="#/about"` מתחילות ב-`#`. זה ה-**hash**: החלק בכתובת ה-URL שאחרי ה-`#` אף פעם לא גורם לדפדפן לטעון דף חדש, וזה מה שהנתב שלנו ינצל בשלב הבא. כרגע הקישורים משנים את הכתובת אבל עדיין אף אחד לא מאזין, ולכן הדף נשאר אותו דבר. זה צפוי.

**3. אזור התוכן הראשי וה-footer.** הדף נכנס ל-`<main className="container content" id="main">{children}</main>`. בכל דף חייב להיות בדיוק `main` אחד, והוא מכיל את התוכן הייחודי: זהו אזור ציון דרך (landmark), שמאפשר למשתמשי מקלדת לקפוץ ישר אליו. ה-footer הוא `footer.site-footer` עם `div.container` ומשפט קצר כמו *Dev Blog, built with React.*

**4. שימוש ב-App.** ייבאו את `Layout`, הסירו את `<main>` הישן (Layout מציירת משלה) והחזירו `<Layout> ... </Layout>` סביב הכותרת, הכמות ורשימת הפוסטים. שנו את ה-`h1` ל-`Latest posts`, כי השם "Dev Blog" יושב עכשיו ב-header.

> **שימו לב:**
> - לא מופיע דבר בין ה-header ל-footer: שכחתם את `{children}` ב-Layout. בלעדיו תוכן הדף נזרק בשקט.
> - `Adjacent JSX elements must be wrapped in an enclosing tag`: אתם מחזירים כמה אלמנטים אחים בלי fragment ובלי אלמנט אב.
> - שני אלמנטי `main` בדף אחד: הסירו את זה שנשאר ב-`App.jsx`.
> - שימוש ב-`class` במקום ב-`className` ב-JSX: React מזהירה על כך, והעיצוב עלול לא להיטען.

> **תורכם:** צרו את `components/Layout.jsx` עם header (`header.site-header` עם קישור שם האתר ועם `nav.site-nav` שמכיל את הקישורים Home ו-About), עם `main#main.container.content` שמציג את `children`, ועם footer (`footer.site-footer`) שהטקסט שלו כולל `built with React`. ב-`App.jsx` עטפו את הדף ב-`<Layout>` והשתמשו בכותרת `Latest posts`.
