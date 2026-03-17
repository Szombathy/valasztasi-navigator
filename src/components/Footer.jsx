export default function Footer({ onAboutClick }) {
  return (
    <footer className="mt-auto pt-8 pb-24 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
      <p>400 kérdés &middot; 8 témakör &middot; Utolsó frissítés: 2026. március</p>
      <p className="mt-1">
        Független, pártoktól mentes tájékoztató eszköz.
      </p>
      <p className="mt-1">
        Az adatbázis nyílt forráskódú. Hibát találtál?{' '}
        <a
          href="mailto:valasztasi.navigator@example.com"
          className="text-primary hover:underline"
        >
          Jelezd nekünk!
        </a>
      </p>
    </footer>
  )
}
