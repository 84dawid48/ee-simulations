/* הגדרות Tailwind של הגלריה. ה-CSS נבנה מראש ל-gallery/tailwind.css (במקום ה-CDN, שמאט את הטעינה).
   אחרי שינוי מחלקות ב-index.html או ב-gallery/app.js בונים מחדש (מתיקיית "סימולציות"):
   npx tailwindcss@3.4.16 -c gallery/tailwind.config.js -i gallery/tailwind.src.css -o gallery/tailwind.css --minify */
module.exports = {
  content: ['./index.html', './course.html', './gallery/app.js', './simulationsData.js'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Rubik', 'Segoe UI', 'Arial', 'sans-serif'] },
      colors: { neon: { blue: '#38bdf8', violet: '#a855f7' } },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(24px)' }, '100%': { opacity: 1, transform: 'none' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } }
      },
      animation: { rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both', float: 'float 9s ease-in-out infinite' }
    }
  }
};
