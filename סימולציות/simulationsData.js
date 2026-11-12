/* ==========================================================================
   simulationsData.js — רשימת הסימולציות שמוצגות בגלריה
   ==========================================================================

   ➕ איך מוסיפים סימולציה חדשה:
   1. שמרו את קובץ ה-HTML של הסימולציה בתיקייה "סימולציות" (או באחת מתיקיות הנושא שבה).
   2. (לא חובה) שמרו תמונה לכרטיסייה בתיקייה "gallery/thumbs" (‏svg / png / jpg / webp, יחס 16:9).
      אם אין תמונה, השאירו thumbnailUrl ריק ("") והגלריה תצייר רקע צבעוני אוטומטי.
   3. העתיקו את אחד האובייקטים למטה, הדביקו אותו בסוף המערך (אחרי פסיק!), ועדכנו את השדות.
   4. שמרו את הקובץ ורעננו את index.html. זהו, אין צורך לגעת בשום קובץ אחר.

   📋 השדות:
   id            מזהה ייחודי באנגלית, בלי רווחים (משמש גם בכתובת: index.html#sim=<id>)
   title         שם הסימולציה
   description   תיאור קצר (משפט או שניים)
   category      נושא ראשי. כדאי שיתאים לשם תיקיית הנושא, כי לפיו עובד הסינון
   tags          תגיות חופשיות (מערך של מחרוזות)
   thumbnailUrl  נתיב לתמונה, יחסית ל-index.html (או "" לרקע אוטומטי)
   simulationUrl נתיב לקובץ הסימולציה, יחסית ל-index.html. אפשר גם כתובת אינטרנט מלאה (https://...)
   accent        צבע הדגשה לכרטיסייה (לא חובה)
   added         תאריך הוספה בפורמט YYYY-MM-DD (לא חובה; משמש למיון "החדשות ביותר")
   ========================================================================== */

window.SIMULATIONS = [
  {
    id: "gaussian-pulse-dispersion",
    title: "פולס גאוסי בסיב דיספרסיבי",
    description: "למה פולס צר מתרחב מהר יותר? הפולס נע לאורך הסיב, מתרחב ונעשה מצויץ, והצבעים מראים איך התדרים מתמיינים. כולל T₀ אופטימלי, טווח מרבי לקצב נתון ונוף תלת-ממדי.",
    category: "תקשורת אופטית",
    tags: ["דיספרסיה כרומטית", "β₂", "L_D", "ציוץ", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/gaussian-pulse.svg",
    simulationUrl: "תקשורת אופטית/פולס גאוסי בסיב דיספרסיבי.html",
    accent: "#ff5a5a",
    added: "2026-11-12"
  },
  {
    id: "slab-waveguide-modes",
    title: "אופנים במוליך גלים מישורי",
    description: "הפתרון הגרפי בידיים: מעגל V חותך את עקומות ה-tan, וכל חיתוך הוא אופן. מקטינים את המוליך עד שנשאר אופן אחד, ורואים את פעימת האופנים בתלת-ממד.",
    category: "תקשורת אופטית",
    tags: ["אופנים", "מספר V", "חד-אופני", "TE/TM", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/slab-modes.svg",
    simulationUrl: "תקשורת אופטית/אופנים במוליך גלים מישורי.html",
    accent: "#6cb8ff",
    added: "2026-11-12"
  },
  {
    id: "modal-dispersion",
    title: "דיספרסיה מודאלית: step-index מול graded-index",
    description: "מרוץ קרניים בשני סיבים: ב-step-index התלולות מאחרות והפולס נמרח, ב-graded-index כולן מגיעות יחד. פי 300 ב-B·L, כולל רכבת ביטים ותלת-ממד.",
    category: "תקשורת אופטית",
    tags: ["דיספרסיה מודאלית", "graded-index", "B·L", "סיב רב-אופני", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/modal-dispersion.svg",
    simulationUrl: "תקשורת אופטית/דיספרסיה מודאלית.html",
    accent: "#9d8bff",
    added: "2026-11-12"
  },
  {
    id: "db-power-budget",
    title: "מאזן הספק בדציבלים",
    description: "אותו הספק בשתי סקאלות: ב-mW דעיכה מעריכית, ב-dBm קו ישר. גוררים גשש לאורך הקו, מוסיפים מגבר ומחברים, ומחשבים טווח מול רגישות המקלט.",
    category: "תקשורת אופטית",
    tags: ["dB", "dBm", "ניחות", "מאזן הספק"],
    thumbnailUrl: "gallery/thumbs/db-budget.svg",
    simulationUrl: "תקשורת אופטית/מאזן הספק בדציבלים.html",
    accent: "#ffd479",
    added: "2026-11-12"
  },
  {
    id: "tir-na",
    title: "החזרה פנימית ומפתח נומרי",
    description: "למה האור לא בורח מהסיב? מכוונים לייזר, רואים מתי הקרן נלכדת ומתי היא דולפת, ומגלים את חרוט הקבלה. כולל מבט תלת-ממדי.",
    category: "תקשורת אופטית",
    tags: ["החזרה פנימית גמורה", "NA", "חוק סנל", "סיב אופטי", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/tir-na.svg",
    simulationUrl: "תקשורת אופטית/החזרה פנימית ומפתח נומרי.html",
    accent: "#46e39a",
    added: "2026-11-12"
  },
  {
    id: "phase-group-velocity",
    title: "מהירות פאזה ומהירות חבורה",
    description: "בפולס של אור זזים הגלים והמעטפת, ולא באותה מהירות. מצלמה שעוקבת אחרי החבורה מראה את הפסגות מחליקות דרכה.",
    category: "תקשורת אופטית",
    tags: ["מהירות חבורה", "נפיצה", "n_g", "Δλ ו-Δf"],
    thumbnailUrl: "gallery/thumbs/phase-group.svg",
    simulationUrl: "תקשורת אופטית/מהירות פאזה ומהירות חבורה.html",
    accent: "#ff9f43",
    added: "2026-11-12"
  },
  {
    id: "gradient",
    title: "גרדיאנט: לאן הכי תלול?",
    description: "גוררים גשש על מפת גובה ורואים את ∇f: חץ שתמיד ניצב לקווי הגובה, ולא בהכרח מצביע אל הפסגה. כולל מטפס בעלייה בגרדיאנט.",
    category: "חשבון וקטורי",
    tags: ["גרדיאנט", "נגזרת כיוונית", "קווי גובה", "gradient ascent", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/gradient.svg",
    simulationUrl: "חשבון וקטורי/גרדיאנט.html",
    accent: "#ffd479",
    added: "2026-11-12"
  },
  {
    id: "divergence",
    title: "דיברגנץ: נכנס מול יוצא",
    description: "עיגול נגרר בתוך זרם מודד כמה יוצא פחות כמה שנכנס. חצים שמתפזרים בלי מקור, וחצים מקבילים עם מקור.",
    category: "חשבון וקטורי",
    tags: ["דיברגנץ", "שטף", "חוק גאוס", "שדה וקטורי", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/divergence.svg",
    simulationUrl: "חשבון וקטורי/דיברגנץ.html",
    accent: "#46e39a",
    added: "2026-11-12"
  },
  {
    id: "curl",
    title: "רוטור: האם הזרם מסובב?",
    description: "גלגל משוטים בזרם: במערבולת הוא עומד, ובזרימה ישרה עם גזירה הוא מסתובב. סירקולציה, רוטור ומשפט סטוקס.",
    category: "חשבון וקטורי",
    tags: ["רוטור", "curl", "סירקולציה", "משפט סטוקס", "תלת-ממד"],
    thumbnailUrl: "gallery/thumbs/curl.svg",
    simulationUrl: "חשבון וקטורי/רוטור.html",
    accent: "#9d8bff",
    added: "2026-11-12"
  },
  {
    id: "sampling-aliasing",
    title: "דגימה והתחזות",
    description: "כמה מהר צריך לדגום? מורידים את תדר הדגימה, רואים את הספקטרום מתשכפל, ומגלים מתי טון מהיר מתחפש לטון איטי.",
    category: "אותות ומערכות",
    tags: ["נייקוויסט", "התחזות", "שחזור", "DSP"],
    thumbnailUrl: "gallery/thumbs/sampling.svg",
    simulationUrl: "אותות ומערכות/דגימה והתחזות.html",
    accent: "#ffb347",
    added: "2026-11-12"
  },
  {
    id: "prism-rainbow",
    title: "פריזמה וקשת בענן",
    description: "עוקבים אחרי קרני אור דרך מנסרה וטיפת מים, ומגלים למה הקשת מופיעה תמיד בזווית של כ-42°.",
    category: "אלקטרואופטיקה",
    tags: ["חוק סנל", "נפיצה", "קשת", "Three.js"],
    thumbnailUrl: "gallery/thumbs/prism-rainbow.svg",
    simulationUrl: "אלקטרואופטיקה/פריזמה וקשת בענן.html",
    accent: "#a855f7",
    added: "2026-11-11"
  },
  {
    id: "linear-regression",
    title: "רגרסיה לינארית בתלת-ממד",
    description: "קו חיזוי עובר דרך ענן של מחירי דירות, ובמצב המורחב הופך למישור בתלת-ממד. חוטי שגיאה, רעש, נפח מדגם ורגולריזציה L2.",
    category: "למידת מכונה",
    tags: ["OLS", "MSE", "Ridge", "הטיה-שונות"],
    thumbnailUrl: "gallery/thumbs/linear-regression.svg",
    simulationUrl: "למידת מכונה/רגרסיה לינארית.html",
    accent: "#22c55e",
    added: "2026-11-11"
  },
  {
    id: "knn-cv",
    title: "שכנים קרובים ואימות מוצלב",
    description: "KNN במרחב רכבים תלת-ממדי: בועה אוקלידית מול לייזר קוסינוס, וקפלים שמתחלפים באימות מוצלב.",
    category: "למידת מכונה",
    tags: ["KNN", "Cross Validation", "היפר-פרמטרים"],
    thumbnailUrl: "gallery/thumbs/knn-cv.svg",
    simulationUrl: "למידת מכונה/KNN, Cross Validation.html",
    accent: "#38bdf8",
    added: "2026-11-11"
  },
  {
    id: "gmm-em",
    title: "תערובת גאוסיאנים",
    description: "\"יוצר ההרים\": פעמוני גאוס מתלבשים על ענן נקודות, ואלגוריתם EM מוצא את הקבוצות לבד.",
    category: "למידת מכונה",
    tags: ["GMM", "EM", "למידה לא מונחית"],
    thumbnailUrl: "gallery/thumbs/gmm-em.svg",
    simulationUrl: "למידת מכונה/תערובת גאוסיאנים.html",
    accent: "#f43f5e",
    added: "2026-11-10"
  },
  {
    id: "malus",
    title: "קיטוב וחוק מאלוס",
    description: "גל אלקטרומגנטי עובר דרך מקטבים. סובבו אותם וראו איך העוצמה יורדת לפי cos².",
    category: "אלקטרואופטיקה",
    tags: ["קיטוב", "חוק מאלוס", "וקטורי ג'ונס"],
    thumbnailUrl: "gallery/thumbs/malus.svg",
    simulationUrl: "אלקטרואופטיקה/קיטוב וחוק מאלוס.html",
    accent: "#facc15",
    added: "2026-11-10"
  },
  {
    id: "fabry-perot",
    title: "פברי-פרו עם מראה מסובבת קיטוב",
    description: "קרן נכנסת לגביש, ובכל פגיעה במראה הקיטוב שלה מתהפך. מה רואה גלאי שמסתכל רק על קיטוב אחד?",
    category: "אלקטרואופטיקה",
    tags: ["פברי-פרו", "מקדמי פרנל", "התאבכות"],
    thumbnailUrl: "gallery/thumbs/fabry-perot.svg",
    simulationUrl: "אלקטרואופטיקה/מעבדת פברי פרו.html",
    accent: "#60a5fa",
    added: "2026-11-09"
  }

  /* ---- דוגמה להעתקה: מחקו את שתי שורות המקפים (זו והאחרונה), והפסיק בתחילת הדוגמה כבר מחבר אותה לאובייקט שלפניה ----
  ,{
    id: "my-new-sim",
    title: "שם הסימולציה החדשה",
    description: "משפט אחד שמסביר מה רואים ומה לומדים.",
    category: "אותות אקראיים ורעש",
    tags: ["תגית 1", "תגית 2"],
    thumbnailUrl: "",
    simulationUrl: "אותות אקראיים ורעש/my_new_sim.html",
    accent: "#38bdf8",
    added: "2026-12-01"
  }
  ------------------------------------------------------------------------------ */
];
