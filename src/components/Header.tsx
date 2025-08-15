import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { logout } from "../services/auth";

export default function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const NavLink = ({ to, label }: { to: string; label: string }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className={`block px-3 py-2 rounded-lg text-sm ${
        pathname === to
          ? "text-emerald-700 font-semibold bg-emerald-50"
          : "text-slate-700 hover:text-slate-900"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="w-full bg-[#FAF7F2] border-b border-[#EEE7DC]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-emerald-200 grid place-items-center">🌿</div>
          <span className="text-lg md:text-xl font-semibold text-emerald-700">MoodTracker</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/dashboard" label="Dashboard" />
          <NavLink to="/statistics" label="Statistics" />
          <button
            className="ml-2 text-sm text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg"
            onClick={async () => { await logout(); location.href = "/login"; }}
          >
            Log Out
          </button>
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 hover:bg-emerald-50"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Open main menu</span>
          {open ? "✖️" : "☰"}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden px-4 pb-3">
          <div className="rounded-xl border border-[#EEE7DC] bg-white shadow-sm">
            <NavLink to="/dashboard" label="Dashboard" />
            <NavLink to="/statistics" label="Statistics" />
            <button
              className="block w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700 hover:text-slate-900"
              onClick={async () => { await logout(); location.href = "/login"; }}
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
