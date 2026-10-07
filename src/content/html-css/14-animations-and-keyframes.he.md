---
title: "אנימציות, keyframes ו-transitions לעומק"
summary: "מזיזים דברים עם transitions, עקומות האטה ואנימציות @keyframes מרובות שלבים."
hints:
  - "ל-transition צריך רשימה של המאפיינים שמנפישים, משך זמן ועקומת האטה. לאנימציה יש שני חלקים: בלוק @keyframes שמתאר את השלבים, והמאפיין animation שמפעיל אותו."
  - "transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;   @keyframes bounce { 0% { ... } 100% { ... } }   animation: bounce 1s ease-in-out infinite alternate;"
  - ".tile { transition: transform 0.25s ease-out, box-shadow 0.25s ease-out; }   @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-30px); } }   .dot { animation: bounce 1s ease-in-out infinite alternate; }   .dot:nth-child(2) { animation-delay: 0.2s; }   .dot:nth-child(3) { animation-delay: 0.4s; }"
messages:
  - "כתבו @keyframes bounce { ... } שמזיז את הנקודה ל-translateY(-30px)."
  - "השתמשו בפונקציית התזמון ease-out למעבר של ה-tile."
quiz:
  - q: "מה ההבדל בין transition לבין animation?"
    options: ["transition מנפיש בין שני מצבים כשמשהו משתנה, ואנימציה יכולה לרוץ מעצמה דרך שלבי keyframe רבים", "הם אותו דבר עם שמות שונים", "אנימציות עובדות רק על טקסט"]
  - q: "איזה זוג מאפיינים הכי זול לדפדפן להנפיש בצורה חלקה?"
    options: ["width ו-height", "transform ו-opacity", "margin ו-padding"]
    explain: "את transform ואת opacity כרטיס המסך יכול לטפל בלי לחשב מחדש את פריסת העמוד."
  - q: "מה עושה animation-direction alternate?"
    options: ["מריצה את האנימציה פי שניים מהר", "מנגנת קדימה, ואז אחורה, ואז שוב קדימה", "מנגנת את האנימציה פעם אחת בלבד"]
  - q: "למה לשים את ה-transition על .tile ולא על .tile:hover?"
    options: ["כי :hover לא יכול להחזיק מאפיינים", "זה לא משנה", "כדי שיונפש גם כשהעכבר נכנס וגם כשהוא יוצא"]
---

מעט תנועה אומרת לאנשים מה קורה: כפתור מתרומם כשמצביעים עליו, מחוון טעינה מראה שהעמוד עסוק. בשיעור הזה תעברו את ההיעלמות ההדרגתית הבסיסית ותלמדו את שני כלי ה-CSS לתנועה: **transitions** ו**אנימציות keyframe**.

## Transitions, כמו שצריך

transition מנפיש את השינוי בין שני מצבים, למשל רגיל ו-hover. כותבים אותו על המצב **הרגיל**, וחלקיו הם:

```css
.tile {
  transition: transform 0.25s ease-out;
  /*          property  duration timing */
}
```

אפשר להוסיף ערך רביעי, השהיה (`0.1s`). כדי להנפיש כמה מאפיינים, מפרידים בין הקבוצות בפסיקים:

```css
.tile {
  transition: transform 0.25s ease-out, box-shadow 0.25s ease-out;
}
```

הימנעו מ-`transition: all`. הוא מנפיש כל מאפיין שמשתנה, כולל כאלה שלא חשבתם עליהם, וקשה יותר לשמור עליו חלק.

## פונקציות תזמון (easing)

חפצים אמיתיים לא נעים במהירות קבועה. פונקציית התזמון מתארת איך המהירות משתנה:

| ערך | תחושה |
| --- | --- |
| `linear` | מהירות קבועה, רובוטית |
| `ease` | ברירת המחדל: מתחיל לאט, מאיץ, מאט |
| `ease-in` | מתחיל לאט |
| `ease-out` | מתחיל מהר ומאט בסוף, טוב לדברים שמגיעים |
| `ease-in-out` | איטי בשני הקצוות |
| `cubic-bezier(0.2, 0.8, 0.2, 1)` | עקומה משלכם |

## אנימציות keyframe

ל-transition צריך טריגר, ויש לו רק התחלה וסוף. **אנימציה** (animation) יכולה להתחיל בעצמה, לעבור דרך שלבים רבים ולחזור על עצמה. מתארים את השלבים בבלוק `@keyframes`, ואז מצמידים אותו לאלמנט:

```css
@keyframes bounce {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-30px); }
}

.dot {
  animation: bounce 1s ease-in-out infinite alternate;
}
```

את שם ה-`@keyframes` (`bounce`) אתם בוחרים. אחוזים מסמנים רגעים באנימציה: `0%` הוא ההתחלה, `100%` הסוף, ואפשר להוסיף עוד כמו `50%`. `from` ו-`to` הם כינויים ל-`0%` ול-`100%`.

הקיצור `animation` מחזיק: את השם, את המשך, את פונקציית התזמון, את מספר החזרות (`infinite` או מספר) ואת הכיוון. `alternate` מנגן קדימה ואז אחורה, וזו דרך חלקה לקבל קפיצה בלי לכתוב בעצמכם את הדרך חזרה. מאפיינים מפורטים שימושיים נוספים:

- `animation-delay` ממתין לפני ההתחלה. מתן השהיה גדולה יותר לכל פריט יוצר גל.
- `animation-fill-mode: forwards` שומר את ה-keyframe האחרון אחרי שהאנימציה מסתיימת.
- `animation-play-state: paused` מקפיא אותה, שימושי עם `:hover`.

## מה זול להנפיש

דפדפנים יכולים להנפיש `transform` (הזזה, שינוי גודל, סיבוב) ו-`opacity` בכרטיס המסך בלי לחשב מחדש את פריסת העמוד. הנפשה של `width`, `height`, `top` או `margin` מאלצת את הדפדפן לחשב פריסה מחדש בכל פריים, ובטלפונים זה יכול לגרום לקפיצות. העדיפו `transform: translateX(...)` על פני `left`.

> **שימו לב:**
> - שמים `transition` רק על `:hover`. אז האנימציה קורית כשהעכבר נכנס אבל האלמנט קופץ חזרה כשהוא יוצא.
> - טעות בכתיב של שם האנימציה. אם `animation: bounce` ו-`@keyframes bouncee` שונים, שום דבר לא זז ואף אחד לא אומר לכם.
> - מנסים לעשות transition ל-`display` או ל-`height: auto`. אי אפשר להנפיש אותם; השתמשו ב-`opacity` או ב-`max-height` קבוע במקום.
> - שוכחים ש-`transform` על אלמנט מחליף ערכי `transform` קודמים. `transform: scale(2)` בכלל hover מסיר `translate` שנקבע בכלל הרגיל אלא אם חוזרים עליו.
> - אנימציות שלא נפסקות ואי אפשר לכבות. יש אנשים שחשים לא טוב מתנועה; השיעור הבא מראה איך לכבד את ההגדרות שלהם.

## להמשך

הוסיפו keyframe של `50%` עם `transform: translateY(-30px) scale(1.3)` לתחושה של כיווץ ומתיחה, ונסו `cubic-bezier(0.3, 1.8, 0.5, 1)` לחריגה מעבר ליעד (overshoot).

> **תורכם:** הוסיפו ל-`.tile` מעבר של `0.25s ease-out` עבור `transform` ו-`box-shadow`, כתבו `@keyframes bounce` (מ-`translateY(0)` עד `translateY(-30px)`), הפעילו אותו על כל `.dot` למשך `1s ease-in-out infinite alternate`, והשהו את הנקודה השנייה והשלישית ב-`0.2s` וב-`0.4s`.
