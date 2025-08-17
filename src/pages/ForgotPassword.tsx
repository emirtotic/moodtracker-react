import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword } from '../services/auth';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Success modal
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!showSuccess) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') navigate('/login');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showSuccess, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) return setError('Email is required.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Please enter a valid email address.');
    if (newPassword.length < 8 || newPassword.length > 30) {
      return setError('Password must be 8–30 characters long.');
    }

    setLoading(true);
    try {
      await changePassword({ email, newPassword });
      setShowSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (e: any) {
      setError(e?.message ?? 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Top bar */}
      <div className="w-full">
        <div className="max-w-5xl mx-auto w-full px-4">
          <div className="flex justify-center md:justify-end py-4 md:py-5 text-sm">
            <Link to="/login" className="text-emerald-700 hover:underline">
              Back to sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 grid place-items-center px-4 pb-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-5 md:p-8 border border-[#EEE7DC]">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-full bg-emerald-200 grid place-items-center">🌿</div>
            <div className="text-emerald-700 font-semibold">MoodTracker</div>
          </div>

          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">Reset your password</h1>
          <p className="text-slate-600 mb-5 md:mb-6 text-sm md:text-base">
            Enter your email and a new password to continue.
          </p>

          <form onSubmit={submit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm text-slate-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border rounded-xl p-3 text-sm md:text-base"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm text-slate-700 mb-1">New password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full border rounded-xl p-3 text-sm md:text-base pr-12"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={8}
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute inset-y-0 right-2 my-auto text-slate-500 text-sm hover:text-slate-700"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">8–30 characters.</p>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 text-white py-3 hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>

          <div className="text-sm text-slate-600 mt-4 text-center">
            Remembered it?{' '}
            <Link to="/login" className="text-emerald-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pw-changed-title"
        >
          <div className="bg-white rounded-xl shadow-lg border border-[#EEE7DC] max-w-sm w-full p-6 text-center">
            <h2 id="pw-changed-title" className="text-lg font-semibold text-emerald-700 mb-2">
              Password changed
            </h2>
            <p className="text-slate-600 mb-4">
              Your password has been successfully updated. Please log in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-lg bg-emerald-600 text-white py-2.5 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
              autoFocus
            >
              Go to Login
            </button>

            {/* Optional: „close” ikonica u uglu, vodi na login */}
            <button
              onClick={() => navigate('/login')}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
              aria-label="Close"
              title="Close"
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
