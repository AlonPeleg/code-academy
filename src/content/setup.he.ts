import type { SetupGuide } from './setup';
import type { Lang } from '../lib/settings';

/**
 * Hebrew text for the setup guides. Code blocks, commands and extension ids are NOT translated:
 * only titles, summaries, the "you need" list, the text of each step (same order as English), notes and the extension reasons.
 */
export interface GuideHe {
  title?: string;
  summary?: string;
  needs?: string[];
  steps?: string[];
  note?: string;
  extensions?: string[];
}
export const SETUP_HE: Record<string, GuideHe> = {
  vscode: {
    title: "Visual Studio Code (העורך המומלץ)",
    summary: "עורך חינמי שרוב המפתחים משתמשים בו. מתקינים אותו ואז מוסיפים את התוספים לשפה שלכם.",
    needs: ["Visual Studio Code, בחינם מ-code.visualstudio.com (Windows, Mac, Linux)"],
    steps: [
      "הורידו והתקינו את VS Code. אחר כך פתחו את תיקיית הפרויקט עם File, Open Folder (או מטרמינל בתוך התיקייה: code .).",
      "פתחו את הטרמינל המובנה עם Ctrl + backtick (ב-Mac: Cmd + backtick). פקודות כמו npm, python או dotnet רצות שם, כבר בתוך תיקיית הפרויקט.",
      "להתקנת תוסף: לחצו Ctrl+Shift+X (ב-Mac: Cmd+Shift+X), חפשו את שמו ולחצו Install. אפשר גם דרך הטרמינל עם המזהה שמופיע מתחת לכל מדריך:",
      "הפעילו \"Format on Save\" (בהגדרות, חפשו \"format on save\") כדי שהקוד יסודר אוטומטית, ו-\"Auto Save\" כדי לא לאבד שינויים.",
    ],
    note: "התוספים אופציונליים. כל מדריך למטה מפרט את אלה ששווה להתקין לאותה שפה.",
    extensions: ["מציג הודעות שגיאה ממש ליד השורה, לכל שפה"],
  },
  html: {
    title: "HTML, CSS ו-JavaScript במחשב שלכם",
    summary: "צריך: עורך קוד ודפדפן. בלי התקנה ובלי שלב בנייה.",
    needs: ["דפדפן (Chrome, Firefox, Edge, Safari)", "עורך קוד, למשל Visual Studio Code (חינמי)"],
    steps: [
      "צרו תיקייה לאתר שלכם ושימו בה את הקבצים, למשל:",
      "פתחו את index.html בלחיצה כפולה. הדפדפן יציג את הדף שלכם. רעננו אחרי כל שינוי.",
      "לא חובה אבל נוח: ב-VS Code התקינו את התוסף \"Live Server\", לחצו קליק ימני על index.html ובחרו \"Open with Live Server\". הדף ייטען מחדש מעצמו בכל שמירה.",
      "השתמשו בכלי המפתחים של הדפדפן (F12) כדי לראות שגיאות בלשונית Console ולבדוק ולשנות CSS בזמן אמת.",
    ],
    note: "קישורים בין הדפים עובדים עם שמות קבצים פשוטים, כמו <a href=\"about.html\">. כמה יכולות (fetch לקבצים שלכם, מודולי ES) דורשות שרת מקומי: Live Server מספק אחד.",
    extensions: [
      "טוען מחדש את הדף בדפדפן בכל פעם שאתם שומרים",
      "מסדר HTML, CSS ו-JS בצורה נקייה בעת שמירה",
      "משנה את תג הסגירה כשאתם משנים את תג הפתיחה",
      "מציע את שמות מחלקות ה-CSS שלכם בתוך ה-HTML",
    ],
  },
  node: {
    title: "Node.js ו-npm",
    summary: "צריך: Node.js (כולל npm). מריץ JavaScript מחוץ לדפדפן ומתקין חבילות.",
    needs: ["Node.js בגרסת ה-LTS הנוכחית (כולל npm, מנהל החבילות)", "טרמינל (Terminal ב-Mac/Linux, PowerShell ב-Windows) ועורך קוד"],
    steps: [
      "התקינו את Node.js מ-nodejs.org (בחרו בהורדת ה-LTS), ואז בדקו שזה עבד:",
      "הריצו קובץ JavaScript:",
      "התחילו פרויקט שמשתמש בחבילות (זה יוצר את package.json), ואז התקינו חבילה:",
      "שלוש פקודות שתראו כל הזמן: node מריץ קובץ JavaScript; npm מתקין חבילות ומריץ את הסקריפטים שרשומים ב-package.json (npm run dev, npm run build, npm start); npx מריץ כלי מתוך חבילה בלי להתקין אותו לצמיתות (npx vite, npx tsc).",
      "חבילות נוחתות בתיקיית node_modules. לעולם אל תעלו את node_modules ל-Git; רשמו אותה ב-.gitignore. תמיד אפשר לבנות אותה מחדש עם:",
    ],
    note: "ב-Node 18 ומעלה fetch מובנה, ולכן שיעורי ה-API רצים כמו שהם. כדי להשתמש ב-import/export בקבצי JavaScript, הוסיפו \"type\": \"module\" ל-package.json.",
    extensions: [
      "מצביע על טעויות אפשריות ב-JavaScript תוך כדי הקלדה",
      "עיצוב אחיד בעת שמירה",
    ],
  },
  react: {
    title: "React עם Vite",
    summary: "צריך: Node.js ו-npm. יוצרים פרויקט עם Vite ואז npm run dev.",
    needs: [
      "Node.js LTS ו-npm (ראו את מדריך Node.js)",
      "עורך קוד (VS Code)",
      "חבילות: react, react-dom (תלויות) ו-vite, @vitejs/plugin-react (כלי פיתוח). הפקודה למטה מתקינה אותן בשבילכם",
    ],
    steps: [
      "צרו את הפרויקט (בחרו בתבנית React; JavaScript או TypeScript, כרצונכם):",
      "הפעילו את שרת הפיתוח ופתחו את הכתובת שהוא מדפיס (בדרך כלל http://localhost:5173):",
      "הקוד שלכם נמצא בתיקיית src/. App.jsx הוא הרכיב הראשי, ו-main.jsx מרכיב אותו בדף. שימו כל רכיב בקובץ משלו וייבאו אותו, כמו בפרויקטים מרובי הקבצים כאן.",
      "בנו את הקבצים לפרסום. הם יופיעו בתיקיית dist:",
    ],
    note: "באקדמיה מייבאים קבצים בלי סיומת (import Nav from \"./components/Nav\"). זה עובד גם ב-Vite. הורדת הפרויקט (Download project) בפרויקט React נותנת לכם בדיוק את ההגדרה הזו.",
    extensions: [
      "הקלידו rfce ולחצו Tab כדי לקבל שלד של רכיב",
      "תופס טעויות ב-hooks וב-JSX",
      "מסדר JSX בעת שמירה",
      "שומר על סנכרון בין תגי JSX",
    ],
  },
  tailwind: {
    title: "Tailwind CSS",
    summary: "צריך: כלום לניסיון מהיר (תג script אחד). לפרויקטים אמיתיים: Node.js ואז npm install tailwindcss.",
    needs: [
      "ניסיון מהיר: רק דפדפן ותג ה-script",
      "פרויקטים אמיתיים: Node.js + npm, והחבילות tailwindcss ו-@tailwindcss/cli (או @tailwindcss/vite כשעובדים עם Vite)",
    ],
    steps: [
      "ניסיון מהיר, כמו שעושים בשיעורים. שימו את זה ב-<head> של ה-HTML:",
      "פרויקט אמיתי עם כלי שורת הפקודה של Tailwind. התקנה:",
      "צרו את הקובץ src/input.css עם שורה אחת:",
      "בנו את קובץ ה-CSS (השאירו את זה רץ בזמן שאתם עובדים). הכלי סורק את ה-HTML שלכם אחרי שמות מחלקות וכותב רק את ה-CSS שבו אתם משתמשים:",
      "קשרו את התוצאה ב-HTML במקום תג ה-script:",
      "עובדים עם Vite (למשל באפליקציית React)? התקינו את התוסף והוסיפו אותו ל-vite.config.js:",
    ],
    note: "סקריפט ה-CDN מיועד ללמידה ולאבות טיפוס. אתר שמפורסם צריך להשתמש בשלב הבנייה, כדי שהמבקרים יורידו קובץ CSS קטן ולא את כל המחולל.",
    extensions: ["השלמה אוטומטית לשמות מחלקות, תצוגה מקדימה של צבעים ותיעוד בריחוף"],
  },
  bootstrap: {
    title: "Bootstrap",
    summary: "צריך: רק שני תגי CDN. או npm install bootstrap בפרויקט.",
    needs: [
      "שימוש מהיר: דפדפן ושני התגים שלמטה",
      "בפרויקט עם כלי בנייה: Node.js + npm, והחבילה bootstrap",
    ],
    steps: [
      "CDN, כמו שעושים בשיעורים. גיליון הסגנונות נכנס ל-<head>:",
      "הסקריפט נכנס ממש לפני </body>. הוא מפעיל את כפתור התפריט, חלונות מודאליים, תפריטים נפתחים ועוד:",
      "תמיד הוסיפו את תג ה-viewport ב-<head> כדי שהגריד יעבוד בטלפונים:",
      "עם npm ו-Vite או bundler אחר:",
    ],
    note: "קובץ ה-CSS שלכם חייב להיות מקושר אחרי גיליון הסגנונות של Bootstrap, אחרת Bootstrap מנצח בשוויון. התאמה אישית עם Sass דורשת את החבילה sass; השיעורים משתמשים במשתני CSS, שלא צריכים כלום.",
    extensions: [
      "השלמה אוטומטית למחלקות, כולל Bootstrap כשהוא מקושר",
      "טוען מחדש את הדפדפן בכל שמירה",
    ],
  },
  typescript: {
    title: "TypeScript",
    summary: "צריך: Node.js, ואז npm install -D typescript. מקמפלים עם tsc או מריצים עם tsx.",
    needs: [
      "Node.js LTS ו-npm",
      "חבילות: typescript (המהדר). אופציונלי: tsx להרצת קבצי TypeScript ישירות",
    ],
    steps: [
      "בתיקיית הפרויקט:",
      "קמפלו את הקבצים ל-JavaScript, ואז הריצו את התוצאה:",
      "או הריצו קובץ TypeScript בצעד אחד בזמן הלמידה:",
      "העורך (VS Code) מציג שגיאות טיפוסים תוך כדי הקלדה. האקדמיה רק ממירה את הקוד כשלוחצים Run, ולכן השתמשו בקווים המסולסלים בעורך וב-tsc כדי לראות את כל שגיאות הטיפוסים.",
    ],
    extensions: [
      "כללי lint גם ל-TypeScript",
      "עיצוב בעת שמירה",
    ],
  },
  python: {
    title: "Python",
    summary: "צריך: Python 3.10 ומעלה. ספריות מוסיפים עם pip.",
    needs: [
      "Python 3.10+ מ-python.org (Windows/Mac) או ממנהל החבילות שלכם (Linux)",
      "טרמינל ועורך קוד (VS Code עם התוסף של Python הוא התחלה טובה)",
    ],
    steps: [
      "בדקו את ההתקנה:",
      "הריצו תוכנית:",
      "תנו לכל פרויקט ארגז כלים משלו (סביבה וירטואלית) כדי שספריות לא יתנגשו:",
      "התקינו ספריות עם pip, ותעדו אותן כדי שאחרים יוכלו להתקין את אותן ספריות:",
    ],
    note: "input() עובד בטרמינל כרגיל. השיעורים שמשתמשים בלשונית Input פשוט מזינים את השורות האלה לתוכנית שלכם.",
    extensions: [
      "מריץ, מנפה באגים ובודק קוד Python, ומאפשר לבחור את הסביבה הווירטואלית",
      "השלמה אוטומטית מהירה ורמזי טיפוסים",
    ],
  },
  "python-data": {
    title: "ספריות למדעי הנתונים (NumPy, pandas, matplotlib, scikit-learn)",
    summary: "צריך: pip install numpy pandas matplotlib scikit-learn (בתוך סביבה וירטואלית).",
    needs: [
      "Python 3.10+ ו-pip",
      "חבילות: numpy, pandas, matplotlib, scikit-learn (scipy מגיעה עם scikit-learn)",
      "כ-500 MB של מקום בדיסק וחיבור לאינטרנט להתקנה",
    ],
    steps: [
      "צרו והפעילו סביבה וירטואלית (ראו את מדריך Python), ואז התקינו:",
      "הריצו את הסקריפט. plt.show() פותח חלון במחשב שלכם במקום להציג את התמונה בלוח הפלט:",
      "מעדיפים מחברת? Jupyter מאפשר להריץ קוד בתאים ולראות גרפים בתוך המחברת:",
      "שמרו גרף כקובץ תמונה בסקריפטים שלכם:",
    ],
    note: "באקדמיה הספריות יורדות לדפדפן בפעם הראשונה (צריך אינטרנט) ונשמרות במטמון. התוצאות משתמשות בזרע אקראי קבוע, ולכן ההרצה שלכם תדפיס את אותם מספרים.",
    extensions: [
      "מריץ קוד בתאי מחברת ומציג גרפים בתוך המחברת",
      "התמיכה הבסיסית ב-Python",
    ],
  },
  pygame: {
    title: "משחקי Python: מנוע האקדמיה ו-pygame האמיתית",
    summary: "באקדמיה: אין צורך בכלום. במחשב שלכם: pip install pygame (מודול game קיים רק באקדמיה).",
    needs: [
      "Python 3.10+ ו-pip",
      "חבילה: pygame (ספריית המשחקים הפופולרית)",
    ],
    steps: [
      "מנוע המיני \"import game\" קיים רק בתוך Code Academy. הוא מלמד את אותם רעיונות כמו ספריות משחקים אמיתיות: לולאה, עדכון, ציור וקלט.",
      "כדי ליצור משחקים במחשב שלכם, התקינו את pygame:",
      "לתוכנית pygame אמיתית מינימלית יש אותה צורה כמו בשיעורים:",
    ],
    extensions: ["מריץ ומנפה באגים במשחק שלכם"],
  },
  "games-js": {
    title: "משחקי JavaScript מחוץ לאקדמיה",
    summary: "צריך: רק דפדפן. האובייקט game קיים רק באקדמיה; משחקים אמיתיים משתמשים ב-<canvas>.",
    needs: ["דפדפן ועורך קוד"],
    steps: [
      "האובייקט \"game\" הוא עוזר קטן שקיים רק כאן. בדף אינטרנט רגיל מציירים עם אלמנט canvas:",
      "update(dt) ו-draw() בשיעורים מתאימות לגוף הפונקציה frame(). קלט מהמקלדת משתמש ב-window.addEventListener(\"keydown\", ...).",
    ],
    extensions: ["טוען מחדש את דף המשחק בכל שמירה"],
  },
  "games-native": {
    title: "משחקי C, C++ ו-C# במחשב שלכם",
    summary: "באקדמיה: אין צורך בכלום. משחקים אמיתיים משתמשים בספרייה כמו SDL2, raylib או Unity/MonoGame.",
    needs: [
      "מהדר לשפה שלכם (ראו את המדריך שלה)",
      "ספריית משחקים: raylib או SDL2 ל-C/C++; MonoGame או Unity ל-C#",
    ],
    steps: [
      "מנוע האקדמיה (engine.h / המחלקה Engine) הוא כלי הוראה: התוכנית שלכם מתקמפלת בשרת ההרצה והפריימים שלה מושמעים מחדש בדפדפן.",
      "לחלון אמיתי וקלט בזמן אמת ב-C או C++, ההתחלה הקלה ביותר היא raylib (ראו raylib.com למתקינים ולדוגמאות), או SDL2:",
      "ב-C#, התקינו את ה-.NET SDK ונסו את MonoGame (dotnet new install MonoGame.Templates.CSharp) או את העורך של Unity.",
    ],
    extensions: ["השלמה אוטומטית וניפוי באגים למשחקי C ו-C++"],
  },
  sql: {
    title: "SQL (SQLite)",
    summary: "צריך: הכלי sqlite3, או DB Browser for SQLite. השיעורים משתמשים ב-SQLite.",
    needs: ["כלי שורת הפקודה של SQLite (sqlite3) או האפליקציה החינמית \"DB Browser for SQLite\""],
    steps: [
      "התקינו את sqlite3: לעיתים קרובות הוא כבר קיים ב-Mac וב-Linux.",
      "צרו מסד נתונים מסקריפט והריצו שאילתות:",
      "או עבדו באופן אינטראקטיבי:",
    ],
    note: "מערכות גדולות יותר (PostgreSQL, MySQL) משתמשות כמעט באותם SELECT / INSERT / JOIN. ההבדלים הם בעיקר בהגדרה ובכמה פונקציות.",
    extensions: [
      "פותח קובץ מסד נתונים (db) ומאפשר לדפדף בטבלאות",
      "מריץ שאילתות על מסד נתונים מתוך העורך",
    ],
  },
  c: {
    title: "מהדר C (gcc)",
    summary: "צריך: מהדר C כמו gcc או clang. מקמפלים ואז מריצים.",
    needs: ["מהדר C: gcc או clang", "טרמינל"],
    steps: [
      "התקינו מהדר:",
      "קמפלו והריצו (-lm מקשר את ספריית המתמטיקה, -Wall מציג אזהרות):",
    ],
    note: "האקדמיה מקמפלת בשרת הרצה. שגיאות מהדר שם נראות אותו דבר כמו במחשב שלכם.",
    extensions: [
      "השלמה אוטומטית, עיצוב ודיבאגר",
      "רק כשהפרויקט גדל ומשתמש ב-CMake",
    ],
  },
  cpp: {
    title: "מהדר C++ (g++)",
    summary: "צריך: g++ או clang++. מקמפלים עם -std=c++17 ואז מריצים.",
    needs: ["מהדר C++: g++ או clang++", "טרמינל"],
    steps: [
      "התקינו אותו באותה דרך כמו מהדר C (build-essential, כלי שורת הפקודה של Xcode, או MSYS2 ב-Windows).",
      "קמפלו והריצו:",
      "פרויקטים גדולים יותר משתמשים ב-CMake כדי לבנות הרבה קבצים:",
    ],
    extensions: [
      "השלמה אוטומטית, עיצוב ודיבאגר",
      "בניית פרויקטים עם CMake",
    ],
  },
  csharp: {
    title: "C# ו-.NET",
    summary: "צריך: ה-.NET SDK (חינמי). dotnet new console, ואז dotnet run.",
    needs: [
      "ה-.NET SDK (גרסת LTS נוכחית) מ-dotnet.microsoft.com",
      "טרמינל ועורך (VS Code עם C# Dev Kit, או Visual Studio)",
    ],
    steps: [
      "בדקו את ההתקנה:",
      "צרו והריצו פרויקט קונסולה:",
      "החליפו את Program.cs בקוד שלכם. תבניות חדשות משתמשות ב-\"top-level statements\" (בלי class Program); הצורה הקלאסית class Program { static void Main() } מהשיעורים עובדת גם כן.",
      "הוסיפו ספרייה מ-NuGet:",
    ],
    extensions: ["סייר פרויקטים, השלמה אוטומטית, ניפוי באגים והרצת בדיקות (מתקין גם את התוסף של C#)"],
  },
  java: {
    title: "Java",
    summary: "צריך: JDK (גרסה 17 ומעלה). javac לקימפול, java להרצה.",
    needs: [
      "JDK 17+ (למשל Eclipse Temurin מ-adoptium.net)",
      "טרמינל ועורך (VS Code עם תוספי Java, או IntelliJ IDEA Community)",
    ],
    steps: [
      "בדקו את ההתקנה:",
      "שם הקובץ חייב להיות כשם המחלקה הציבורית (Main.java). קמפלו והריצו:",
      "מאז Java 11 אפשר להריץ קובץ בודד בצעד אחד:",
      "פרויקטים גדולים יותר משתמשים ב-Maven או Gradle לניהול ספריות ובנייה.",
    ],
    extensions: ["תמיכה בשפה, דיבאגר, Maven והרצת בדיקות בחבילה אחת"],
  },
  go: {
    title: "Go",
    summary: "צריך: ערכת הכלים של Go. go run main.go.",
    needs: [
      "Go מ-go.dev/dl (מתקין ל-Windows/Mac, tarball ל-Linux)",
      "טרמינל",
    ],
    steps: [
      "בדקו את ההתקנה:",
      "הריצו קובץ בודד:",
      "לפרויקט עם כמה קבצים או ספריות, צרו מודול:",
      "הוסיפו ספרייה:",
    ],
    extensions: ["תמיכה רשמית ב-Go: השלמה אוטומטית, עיצוב, בדיקות וניפוי באגים"],
  },
  rust: {
    title: "Rust",
    summary: "צריך: rustup (מתקין את rustc ואת cargo). cargo run.",
    needs: [
      "Rust דרך rustup (rustup.rs): מתקין את המהדר rustc ואת כלי הבנייה cargo",
      "ב-Linux/macOS: לינקר של C (build-essential / כלי Xcode)",
    ],
    steps: [
      "התקינו ובדקו:",
      "קובץ בודד:",
      "פרויקט אמיתי עם ספריות (crates):",
    ],
    extensions: [
      "שרת השפה של Rust: השלמה אוטומטית ושגיאות בתוך השורה",
      "ניפוי באגים בתוכניות Rust",
      "תמיכה בקובץ Cargo.toml",
    ],
  },
  api: {
    title: "עבודה עם API אמיתיים",
    summary: "צריך: Node.js 18+ (עם fetch מובנה) או כל דפדפן. שרת התרגול קיים רק באקדמיה.",
    needs: [
      "Node.js 18+ או דפדפן",
      "אופציונלי: curl, ו-Postman או Insomnia לניסוי בקשות ידנית; SoapUI ל-SOAP",
    ],
    steps: [
      "https://api.academy.test הוא שרת תרגול בתוך האקדמיה. כדי להשתמש ב-API אמיתי, שנו את הכתובת, למשל ל-API בדיקות חינמי:",
      "נסו בקשות מהטרמינל:",
      "ל-API אמיתיים בדרך כלל צריך מפתח. לעולם אל תשימו מפתחות סודיים בקוד שרץ בדפדפן או במאגר ציבורי; שמרו אותם במשתני סביבה בשרת.",
      "דפדפנים חוסמים בקשות לאתרים אחרים אלא אם השרת מתיר זאת (CORS). מ-Node.js אין חוק כזה.",
    ],
    note: "פרויקטים שהורדתם ומשתמשים בשרת התרגול כוללים את academy-mock.js, עותק מדומה שלו, כך שהם ממשיכים לרוץ.",
    extensions: [
      "כותבים בקשות בקובץ מסוג http ושולחים אותן מהעורך",
      "בודק בקשות בסגנון Postman בתוך VS Code",
    ],
  },
  "node-backend": {
    title: "שרתי Node.js עם Express (ובדיקות)",
    summary: "צריך: Node.js ו-npm. מתקינים את express, מריצים את השרת עם node, ובודקים עם Jest או node:test.",
    needs: [
      "Node.js LTS ו-npm (ראו את מדריך Node.js)",
      "חבילות: express (מסגרת האינטרנט), ולבדיקות jest (או להשתמש בכלי הבדיקות המובנה node:test)",
      "כלי לשליחת בקשות: הדפדפן, curl, או התוספים REST Client / Thunder Client",
    ],
    steps: [
      "צרו פרויקט והתקינו את Express:",
      "שימו את הקוד שלכם ב-server.js ואז הפעילו אותו. פתחו את http://localhost:3000 בדפדפן:",
      "הפעלה מחדש אוטומטית בכל שמירה (Node 18.11 ומעלה):",
      "שמרו סודות (סיסמאות, מפתחות API) בקובץ .env ולא בקוד, ורשמו את .env ב-.gitignore. Node 20.6 ומעלה יכול לקרוא אותו:",
      "התקינו את Jest, הוסיפו \"test\": \"jest\" תחת scripts ב-package.json, ואז הריצו את הבדיקות (קבצי בדיקות מסתיימים ב-.test.js):",
    ],
    note: "באקדמיה שרת התרגול נמצא בתוך הדף וקוראים לו עם fetch(\"http://localhost:3000/...\"). במחשב שלכם אותו קוד משרת בקשות אמיתיות, והקבצים שאתם כותבים עם fs נשמרים בדיסק האמיתי שלכם.",
    extensions: [
      "שולחים בקשות לשרת שלכם מקובץ מסוג http",
      "בודק בקשות בסגנון Postman בתוך VS Code",
      "מריצים או מנפים באגים בבדיקה אחת בלחיצה",
    ],
  },
  git: {
    title: "Git ו-GitHub: שומרים ומפרסמים",
    summary: "צריך: Git וחשבון GitHub חינמי. ואז מפרסמים אתר עם GitHub Pages.",
    needs: ["Git (git-scm.com)", "חשבון חינמי ב-github.com"],
    steps: [
      "העמידו את תיקיית הפרויקט תחת בקרת גרסאות וצרו את ה-commit הראשון:",
      "צרו מאגר ריק ב-github.com, ואז חברו והעלו:",
      "פרסום אתר סטטי (HTML/CSS/JS רגיל): ב-GitHub פתחו Settings, Pages, בחרו \"Deploy from a branch\", הענף main, התיקייה / (root). האתר שלכם יופיע בכתובת https://YOUR-NAME.github.io/my-project/",
      "פרויקט Vite/React: בתיקייה שהורדתם כבר יש workflow של GitHub Actions. ב-Settings, Pages, בחרו \"GitHub Actions\" כמקור, ואז בצעו push.",
      "חלופות קלות באותה מידה: גררו את התיקייה (או את תיקיית dist) אל netlify.com/drop, או חברו את המאגר ל-Netlify, Vercel או Cloudflare Pages.",
    ],
    note: "הוסיפו קובץ .gitignore שמפרט את node_modules ואת dist כדי שלא תעלו אותם.",
    extensions: [
      "רואים מי שינה כל שורה ומדפדפים בהיסטוריה",
      "בודקים pull requests בלי לצאת מהעורך",
    ],
  },
};

export function localizeGuide(g: SetupGuide, lang: Lang): SetupGuide {
  const he = lang === 'he' ? SETUP_HE[g.id] : undefined;
  if (!he) return g;
  return {
    ...g,
    title: he.title ?? g.title,
    summary: he.summary ?? g.summary,
    needs: he.needs && he.needs.length === g.needs.length ? he.needs : g.needs,
    steps: he.steps && he.steps.length === g.steps.length ? g.steps.map((s, i) => ({ ...s, text: he.steps![i] })) : g.steps,
    note: he.note ?? g.note,
    extensions: g.extensions && he.extensions && he.extensions.length === g.extensions.length ? g.extensions.map((x, i) => ({ ...x, why: he.extensions![i] })) : g.extensions,
  };
}
