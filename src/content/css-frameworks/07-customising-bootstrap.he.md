---
title: "התאמה אישית של Bootstrap - הופכים אותה לשלכם"
summary: "משנים צבעים ופונטים ב-Bootstrap בעזרת משתני CSS, מעבירים חלק מהדף למצב כהה ומוסיפים גיליון סגנונות משלכם בצורה בטוחה."
hints:
  - "Bootstrap בנויה על משתני CSS, ולכן רוב שינויי הצבע הם כמה שורות בגיליון הסגנונות שלכם. זכרו את הסדר: גיליון הסגנונות שלכם בא אחרי של Bootstrap."
  - "שימו את --bs-primary, --bs-primary-rgb, --bs-body-bg, --bs-body-bg-rgb ו---bs-body-font-family בתוך כלל :root. לכפתורים יש צורך בכלל .btn-primary משלהם עם משתני --bs-btn-*. ל-footer צריך מאפיין אחד."
  - ':root { --bs-primary: #7c3aed; --bs-primary-rgb: 124, 58, 237; --bs-body-bg: #faf5ff; --bs-body-bg-rgb: 250, 245, 255; }  .btn-primary { --bs-btn-bg: #7c3aed; --bs-btn-border-color: #7c3aed; --bs-btn-hover-bg: #6d28d9; --bs-btn-hover-border-color: #6d28d9; }  .feature-card { border-top: 4px solid var(--bs-primary); }  ו-<footer data-bs-theme="dark" ...>'
messages:
  - "קשרו את style.css אחרי הקישור ל-Bootstrap בתוך ה-head."
  - "הגדירו --bs-primary-rgb: 124, 58, 237 בתוך כלל :root."
  - "הגדירו את --bs-body-font-family ל-Georgia, ואחריו גיבויים."
  - "הגדירו גם את --bs-btn-hover-bg בכלל .btn-primary."
quiz:
  - q: "איפה צריך לשים את גיליון הסגנונות שלכם ב-head?"
    options: ["לפני הקישור ל-Bootstrap", "אחרי הקישור ל-Bootstrap, כדי שהכללים שלכם בעלי העוצמה השווה ינצחו", "רק ב-body"]
  - q: "למה שינוי של --bs-primary לא צובע מחדש כל .btn-primary בעצמו?"
    options: ["לכפתורים יש משתני --bs-btn-* משלהם", "משתנים עובדים רק במצב כהה", "Bootstrap מתעלמת מ-CSS מותאם אישית"]
  - q: "מה data-bs-theme=\"dark\" עושה על אלמנט?"
    options: ["מסתיר את האלמנט", "מוריד גיליון סגנונות אחר", "מעביר את האלמנט ואת כל מה שבתוכו למשתני הצבע הכהים"]
  - q: "מתי כדאי להשתמש בהתאמה אישית עם Sass?"
    options: ["בכל פעם שרוצים לשנות צבע של כפתור", "כדי לשנות הגדרות עמוקות יותר כמו נקודות שבירה (breakpoints) או סולם הריווחים, או כדי להשאיר בחוץ חלקים שלא בשימוש, בעזרת שלב build", "אף פעם; Bootstrap אוסרת על זה"]
---

כמו שהיא יוצאת מהקופסה, לכל אתר Bootstrap יש אותו כחול. החדשות הטובות: Bootstrap 5.3 בנויה על **משתני CSS** (CSS variables), ולכן להפוך אותה לשלכם לוקח כמה שורות. תצבעו מחדש דף נחיתה, תשנו לו פונט, תהפכו את ה-footer לכהה ותוסיפו רכיב משלכם, והכול בלי לגעת בקבצים של Bootstrap.

## המשתנים של Bootstrap

פתחו את כלי המפתחים של הדפדפן בכל דף Bootstrap והסתכלו על `:root` (אלמנט `html`). תמצאו עשרות custom properties שמתחילים ב-`--bs-`:

```css
:root {
  --bs-primary: #0d6efd;
  --bs-primary-rgb: 13, 110, 253;
  --bs-body-bg: #fff;
  --bs-body-font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
}
```

המחלקות של Bootstrap קוראות אותם עם `var(...)`. למשל `.text-primary` משתמשת בתאום ה-`rgb`, ו-`body` משתמש ב-`var(--bs-body-bg)`. אם משנים את המשתנה, כל מה שקורא אותו משתנה. אפשר להגדיר מחדש custom property על `:root` (כל הדף) או על כל אלמנט או מחלקה (רק אותו חלק).

שימו לב ל**תאומים**: `--bs-primary` הוא צבע רגיל ו-`--bs-primary-rgb` הוא אותו צבע כשלושה מספרים חשופים. הכלים `text-primary` ו-`bg-primary` צריכים את המספרים כדי שיוכלו להוסיף שקיפות. שנו את שניהם כשאתם משנים צבע, אחרת חצי מהמחלקות ישמרו את הצבע הישן.

## גיליון הסגנונות שלכם, נטען אחרון

שימו את המשתנים שלכם ב-`style.css` וקשרו אותו **אחרי** Bootstrap:

```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="stylesheet" href="style.css">
```

כששני כללים בעלי אותה ספציפיות (specificity, אותו מספר של מחלקות ו-ids), הכלל המאוחר ינצח. בגלל זה הסדר חשוב, ובגלל זה כמעט אף פעם לא תצטרכו `!important`. אל תערכו את הקובץ של Bootstrap ואל תדביקו את הקוד שלה בתוך שלכם; קובץ ה-CDN צריך להישאר בלתי נגוע כדי שתוכלו לשדרג אותו אחר כך.

## לרכיבים יש משתנים משלהם

`.btn-primary` לא קוראת את `--bs-primary`. כל רכיב מגדיר משתנים פרטיים, כמו `--bs-btn-bg`, `--bs-btn-hover-bg` ו-`--bs-btn-border-color`, ואז משתמש בהם. לכן כדי לצבוע מחדש כפתורים דורסים אותם על המחלקה:

```css
.btn-primary {
  --bs-btn-bg: #7c3aed;
  --bs-btn-border-color: #7c3aed;
  --bs-btn-hover-bg: #6d28d9;
  --bs-btn-hover-border-color: #6d28d9;
}
```

אותו רעיון עובד עבור `--bs-card-*`, `--bs-navbar-*`, `--bs-alert-*` ועוד. בדיקת אלמנט בכלי המפתחים מראה לכם באילו משתנים הוא משתמש.

## מצב כהה ומצבי צבע

הוסיפו `data-bs-theme="dark"` לתג `<html>` וכל הדף עובר למשתנים הכהים של Bootstrap: רקע כהה, טקסט בהיר, רכיבים מותאמים. אפשר גם לשים אותו על אלמנט בודד, כמו footer, כרטיס או navbar, ורק האלמנט הזה והילדים שלו נהיים כהים. הגדרה שלו בעזרת סקריפט קטן מכפתור מחליף נותנת לכם מתג בין בהיר לכהה.

## רכיבים משלכם

לא הכול צריך כלי עזר (utility). כשחוזרים על אותו עיצוב, תנו לו שם וכתבו כלל שמשתמש במשתנים של Bootstrap, כמו `.feature-card { border-top: 4px solid var(--bs-primary); }`. הרכיב שלכם ימשיך אז אוטומטית אחרי ערכת הנושא.

## מתי Sass נכנס לתמונה

משתנים מכסים צבעים, פונטים והרבה גדלים. המקור של Bootstrap כתוב ב-**Sass**, מעבד מקדים (preprocessor) של CSS, ושלב build מאפשר לשנות דברים שמשתנים לא מגיעים אליהם: רוחבי נקודות השבירה, סולם הריווחים, רשימת צבעי הנושא, ואילו חלקים של Bootstrap לכלול (כך שה-CSS הסופי קטן יותר). מתקינים את Bootstrap עם npm, מגדירים משתני Sass כמו `$primary: #7c3aed;` לפני ייבוא ה-Sass של Bootstrap, ומקמפלים. בקורס הזה לא מריצים Sass; הגישה של משתני CSS מספיקה לרוב האתרים.

> **שימו לב:**
> - קושרים את גיליון הסגנונות לפני Bootstrap. הכללים שלכם מפסידים אז בכל תיקו.
> - משנים את `--bs-primary` אבל לא את `--bs-primary-rgb`. כפתורים או רקעים שומרים את הצבע הישן במקומות מסוימים.
> - דורסים את `--bs-primary` ומצפים ש-`.btn-primary` תלך אחריו. הגדירו את משתני `--bs-btn-*` על `.btn-primary`.
> - נלחמים במחלקת utility בעזרת כלל רגיל. ל-utilities יש `!important`, ולכן הסירו את ה-utility או ערכו את המשתנה במקום.
> - כותבים על `:root` צבעים שנכשלים בבדיקת ניגודיות. טקסט חיוור על רקע צבעוני חייב להישאר קריא.

> **תורכם:** קשרו את `style.css` אחרי Bootstrap. בתוכו, הגדירו את `--bs-primary`, `--bs-primary-rgb`, `--bs-body-bg`, `--bs-body-bg-rgb` ו-`--bs-body-font-family` על `:root`, דרסו את משתני הכפתור על `.btn-primary`, והוסיפו כלל `.feature-card` עם גבול עליון מלא של 4px בצבע `var(--bs-primary)`. לבסוף הוסיפו `data-bs-theme="dark"` ל-footer.
