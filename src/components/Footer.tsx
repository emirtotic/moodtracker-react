export default function Footer() {
  return (
    <footer className="mt-16 border-t border-[#EEE7DC] bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 py-10 text-slate-600 text-center md:text-left">
        
        {/* Logo & description */}
        <div className="flex flex-col items-center md:items-start gap-2 col-span-1 md:col-span-2">
          <div className="h-10 w-10 rounded-full bg-emerald-200 grid place-items-center text-lg">🌿</div>
          <div>
            <div className="font-semibold text-emerald-700 text-base">MoodTracker</div>
            <div className="text-sm max-w-xs">
              Your personal companion for mindful mood tracking and emotional wellness.
            </div>
          </div>
        </div>

        {/* Navigate */}
        <div>
          <div className="font-medium text-slate-800 mb-3">Navigate</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/dashboard" className="text-blue-600 hover:underline">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/statistics" className="text-blue-600 hover:underline">
                Statistics
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div className="font-medium text-slate-800 mb-3">Contact</div>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.linkedin.com/in/emirtotic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://emirtotic.github.io/portfolio-site"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Portfolio
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/mr.totic"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="text-center text-xs text-slate-500 pb-6 px-4">
        © 2025 MoodTracker. Made with care for your wellbeing by{" "}
        <a
          href="https://emirtotic.github.io/portfolio-site"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-500"
        >
          <b>Emir Totić</b>
        </a>
      </div>
    </footer>
  );
}
