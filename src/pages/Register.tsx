import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (firstName.trim().length < 2) return setError('First name must be at least 2 characters.');
    if (lastName.trim().length  < 2) return setError('Last name must be at least 2 characters.');
    if (password.length < 8)        return setError('Password should be at least 8 characters.');

    setLoading(true);
    try {
      await register({ firstName, lastName, email, password });
      navigate('/login', { replace: true, state: { justRegistered: true } });
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Registration failed');
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
              Sign in
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

          <h1 className="text-xl md:text-2xl font-semibold text-slate-900 mb-1">Create account</h1>
          <p className="text-slate-600 mb-5 md:mb-6 text-sm md:text-base">Join and start tracking your mood</p>

          <form onSubmit={submit} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs md:text-sm text-slate-700 mb-1">First name</label>
                <input
                  className="w-full border rounded-xl p-3 text-sm md:text-base"
                  placeholder="Your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  autoComplete="given-name"
                  required
                  minLength={2}
                  maxLength={30}
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm text-slate-700 mb-1">Last name</label>
                <input
                  className="w-full border rounded-xl p-3 text-sm md:text-base"
                  placeholder="Your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  autoComplete="family-name"
                  required
                  minLength={2}
                  maxLength={30}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs md:text-sm text-slate-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border rounded-xl p-3 text-sm md:text-base"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                maxLength={60}
              />
            </div>

            <div>
              <label className="block text-xs md:text-sm text-slate-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border rounded-xl p-3 text-sm md:text-base"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                minLength={8}
                maxLength={30}
              />
              <div className="text-[11px] text-slate-500 mt-1">8–30 characters.</div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 text-white py-3 hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Creating…' : 'Sign up'}
            </button>
          </form>

          <div className="text-sm text-slate-600 mt-4 text-center">
            Have an account?{' '}
            <Link to="/login" className="text-emerald-700 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
