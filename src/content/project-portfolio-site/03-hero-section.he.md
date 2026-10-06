---
title: "שלב 3: אזור ה-Hero"
summary: "בונים את הדבר הראשון שהמבקרים רואים: אזור hero בשתי עמודות, עם כותרת, שני כפתורים ואווטאר שמצויר בעזרת CSS בלבד."
hints:
  - "אזור hero הוא section אחד עם container, שורה (row) ושתי עמודות. העמודה השמאלית (col-lg-7) מכילה את הטקסט, והעמודה הימנית (col-lg-5) מכילה את האווטאר. החליפו בו את בלוק ה-container הפשוט משלב 1."
  - "בעמודה השמאלית: p.eyebrow, אחריו h1#hero-title עם המחלקות display-4 ו-fw-bold, אחריו p.lead, ואז div.d-flex.flex-wrap.gap-2 עם שני קישורים בעיצוב btn btn-lg (אחד btn-primary אל projects.html ואחד btn-outline-secondary אל contact.html). בעמודה הימנית: div.avatar עם role=\"img\", עם aria-label ועם הטקסט AR. לאחר מכן עצבו את .hero, את .hero .eyebrow ואת .avatar בקובץ css/style.css."
  - "<section class=\"hero py-5\" aria-labelledby=\"hero-title\"><div class=\"container\"><div class=\"row align-items-center gy-5 gx-lg-5\"><div class=\"col-lg-7\"><p class=\"eyebrow mb-2\">Junior web developer</p><h1 id=\"hero-title\" class=\"display-4 fw-bold mb-3\">Hi, I'm Alex Rivers. I build friendly, fast websites.</h1><p class=\"lead mb-4\">...</p><div class=\"d-flex flex-wrap gap-2\"><a class=\"btn btn-primary btn-lg\" href=\"projects.html\">See my projects</a><a class=\"btn btn-outline-secondary btn-lg\" href=\"contact.html\">Get in touch</a></div></div><div class=\"col-lg-5 text-center\"><div class=\"avatar\" role=\"img\" aria-label=\"Alex Rivers, shown as the initials AR on a gradient circle\">AR</div></div></div></div></section>   CSS: .hero { background: linear-gradient(135deg, var(--brand-soft) 0%, var(--bs-body-bg) 55%, var(--accent-soft) 100%); }   .avatar { display: inline-flex; align-items: center; justify-content: center; width: 180px; height: 180px; border-radius: 50%; background: linear-gradient(135deg, var(--brand), var(--accent)); color: #ffffff; font-size: 3.5rem; font-weight: 700; }"
quiz:
  - q: "ברשת (grid) של Bootstrap, מה משמעות col-lg-7?"
    options:
      - "העמודה רחבה 7 פיקסלים"
      - "העמודה תופסת 7 מתוך 12 עמודות הרשת החל מנקודת השבירה lg ומעלה, ומתחתיה היא נערמת ברוחב מלא"
      - "העמודה מופיעה רק במסכים גדולים ומוסתרת במסכים קטנים"
    explain: "ברשת יש 12 עמודות. מתחת לנקודת השבירה lg (992px) כל עמודה תופסת את הרוחב המלא, ולכן בטלפון האווטאר יורד מתחת לטקסט."
  - q: "מדוע לאווטאר יש role=\"img\" וגם aria-label?"
    options:
      - "הוא דקורטיבי בלבד, ולכן קוראי מסך צריכים לדלג עליו"
      - "דפדפנים מסרבים להציג div בלי role"
      - "קורא מסך צריך להכריז על עיגול ה-CSS כתמונה, עם תיאור מועיל"
    explain: "בלי role ובלי תווית, קורא מסך פשוט יקריא את האותיות \"AR\", וזה לא אומר דבר למי שמאזין."
  - q: "איזה זוג מחלקות מציב את שתי עמודות ה-hero זו לצד זו וממרכז אותן אנכית?"
    options:
      - "row ו-align-items-center"
      - "container ו-text-center"
      - "d-block ו-mx-auto"
messages:
  - "תנו ל-.hero רקע עם linear-gradient(...)."
  - "תנו גם ל-.avatar רקע בגרדיאנט."
---
ה-hero הוא ראש דף הבית שלכם, והחלק שמגייס או מגייסת קוראים בחמש השניות הראשונות. הוא צריך לומר מי אתם ומה אתם עושים, ולהציע את הלחיצה הברורה הבאה.

## איפה אנחנו עומדים

באתר יש סרגל ניווט, כותרת תחתונה וכותרת פשוטה באמצע. הקישור Home מודגש, והשנה מתמלאת בעזרת JavaScript.

## מה נוסיף, ולמה זה חשוב

ל-hero יש ארבעה מרכיבים: תווית קצרה ("Junior web developer"), כותרת גדולה, משפט שתומך בה, וכפתור אחד או שניים. ה-hero הטובים ביותר בפורטפוליו הם ברורים, לא מתחכמים. נוסיף גם רכיב שנראה כמו תמונה בלי להשתמש בקובץ תמונה כלשהו: אווטאר שנעשה מ-CSS, עיגול בגרדיאנט עם ראשי התיבות שלכם. הוא נטען מיד, משתנה בגודלו בלי להיטשטש, ואין צורך לדאוג לגבי זכויות יוצרים.

## הדרכה שלב אחר שלב

**1. אלמנט סמנטי (section).** עטפו את ה-hero ב-`section` וקשרו אותו לכותרת שלו בעזרת `aria-labelledby`. כך משתמשי קורא מסך יכולים לקפוץ בין אזורים בעלי שם:

```html
<section class="hero py-5" aria-labelledby="hero-title">
  <div class="container">
    ...
  </div>
</section>
```

**2. שתי עמודות בעזרת הרשת.** ברשת של Bootstrap יש 12 עמודות בכל שורה. `row` חייב להיות בתוך `container`, ועמודות חייבות להיות בתוך שורה. `align-items-center` ממרכז את העמודות אנכית. `gy-5` מוסיף רווח אנכי בין העמודות כשהן נערמות, ו-`gx-lg-5` מוסיף רווח אופקי רחב רק מנקודת השבירה `lg`:

```html
<div class="row align-items-center gy-5 gx-lg-5">
  <div class="col-lg-7"> text </div>
  <div class="col-lg-5 text-center"> avatar </div>
</div>
```

`col-lg-7` ועוד `col-lg-5` מסתכמים ב-12. מתחת לנקודת השבירה `lg` (992px) שתי העמודות פשוט נערמות זו מעל זו, ולכן הפריסה רספונסיבית בלי media query אחד.

**3. עמודת הטקסט.** ל-Bootstrap יש כלי עזר לטיפוגרפיה בדיוק למשימה הזו. `display-4` הוא סגנון כותרת גדול ודק, `fw-bold` קובע `font-weight: 700`, ו-`lead` מגדיל מעט את הפסקה:

```html
<p class="eyebrow mb-2">Junior web developer</p>
<h1 id="hero-title" class="display-4 fw-bold mb-3">Hi, I'm Alex Rivers. I build friendly, fast websites.</h1>
<p class="lead mb-4">One or two honest sentences about you.</p>
```

השתמשו ב-`h1` אחד בלבד בכל דף. `mb-2` ו-`mb-4` הם כלי עזר למרווח תחתון (0.5rem ו-1.5rem).

**4. שני כפתורים.** הפעולה הראשית מלאה והמשנית היא מתאר בלבד. הם אלמנטים מסוג `a` כי הם מובילים לדף אחר. `d-flex flex-wrap gap-2` מסדר אותם בשורה ומאפשר להם לרדת שורה בטלפון צר:

```html
<div class="d-flex flex-wrap gap-2">
  <a class="btn btn-primary btn-lg" href="projects.html">See my projects</a>
  <a class="btn btn-outline-secondary btn-lg" href="contact.html">Get in touch</a>
</div>
```

**5. האווטאר והרקע ב-CSS.** עיגול הוא ריבוע עם `border-radius: 50%`. גרדיאנט הוא תמונת רקע שהדפדפן מייצר, ולכן הוא נחשב ל-`background` ולא ל-`background-color`:

```css
.avatar {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--brand), var(--accent));
}
```

`135deg` אומר שהצבע משתנה באלכסון. המשתנים מגיעים משלב 1, ולכן הגדרנו אותם מוקדם.

> **שימו לב:**
> - `col-*` מחוץ ל-`.row` מאבד את הרוחב והמרווחים שלו. הסדר תמיד הוא container, אחריו row ואחריו col.
> - מרווח אופקי רחב כמו `g-5` בטלפון גורם לשורה לבלוט מחוץ ל-container וליצור פס גלילה אופקי. לכן אנחנו משתמשים ב-`gx-lg-5` לחלק האופקי.
> - העמודות בשורה אחת צריכות להסתכם ב-12. אם תשתמשו ב-7 וב-7, השנייה תרד לשורה חדשה.
> - `role="img"` בלי `aria-label` גרוע מכלום: קוראי מסך יכריזו "image" ותו לא.
> - טקסט על גרדיאנט חייב להישאר קריא. בדקו שהניגודיות נשארת גבוהה בכל נקודה ברקע.

> **תורכם:** בקובץ `index.html`, החליפו את ה-container הזמני באזור ה-hero שתואר למעלה: `section.hero` עם `row.align-items-center`, עמודת `col-lg-7` שמכילה `p.eyebrow`, `h1#hero-title.display-4.fw-bold` ("Hi, I'm Alex Rivers. I build friendly, fast websites."), `p.lead` ושני הכפתורים (`See my projects`, `Get in touch`), ועמודת `col-lg-5` עם ה-`.avatar` (`role="img"`, `aria-label`). לאחר מכן עצבו את `.hero`, את `.hero .eyebrow` ואת `.avatar` בקובץ `css/style.css`.
