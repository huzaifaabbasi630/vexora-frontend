import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, CreditCard, LogOut, Mail, ShieldCheck, ShoppingCart, UserRound, LockKeyhole, CheckCircle2, CircleAlert } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import { API_BASE_URL } from '../config/api.js';

const ADMIN_API = API_BASE_URL;

const fieldClass = 'mt-2 w-full rounded-xl border border-[#e4d8d0] bg-[#fffdfb] px-4 py-3 text-sm text-[#1a1512] outline-none transition focus:border-[#6f4e37] focus:ring-2 focus:ring-[#d9c2af]';

export default function Rameez() {
  const [status, setStatus] = useState('checking');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [owner, setOwner] = useState(null);
  const [overview, setOverview] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: 'vexora055@gmail.com', password: '' });
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendSeconds, setResendSeconds] = useState(0);
  const inputRefs = useRef([]);

  const fetchJson = async (url, options = {}) => {
    if (!API_BASE_URL) {
      throw new Error('Backend API URL is not configured. Set VITE_API_BASE_URL or VITE_API_URL.');
    }
    const response = await fetch(url, {
      credentials: 'include',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || 'Request failed.');
    }
    return data;
  };

  const loadSession = async () => {
    try {
      const me = await fetchJson(`${ADMIN_API}/api/admin/me`);
      setOwner(me);
      setStatus('authenticated');
      const overviewData = await fetchJson(`${ADMIN_API}/api/admin/overview`);
      setOverview(overviewData);
    } catch (err) {
      setOwner(null);
      setStatus('login');
      setMessage('');
      setError('');
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (resendSeconds <= 0) return undefined;
    const timer = window.setTimeout(() => setResendSeconds((seconds) => seconds - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendSeconds]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const result = await fetchJson(`${ADMIN_API}/api/admin/login`, {
        method: 'POST',
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });
      setChallengeId(result.challengeId);
      setMaskedEmail(result.maskedEmail || loginForm.email);
      setStatus('otp');
      setResendSeconds(60);
      setMessage(result.message || 'Check your email for the verification code.');
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendSeconds > 0 || isSubmitting) return;
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const result = await fetchJson(`${ADMIN_API}/api/admin/resend-otp`, {
        method: 'POST',
        body: JSON.stringify({ challengeId }),
      });
      setChallengeId(result.challengeId);
      setMaskedEmail(result.maskedEmail || maskedEmail);
      setOtpDigits(['', '', '', '', '', '']);
      setResendSeconds(60);
      setMessage(result.message || 'A new verification code has been sent.');
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Unable to resend the code.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const nextDigits = [...otpDigits];
    const sanitized = value.replace(/\D/g, '').slice(0, 1);
    nextDigits[index] = sanitized;
    setOtpDigits(nextDigits);

    if (sanitized && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const updated = [...otpDigits];
    for (let i = 0; i < pasted.length; i += 1) {
      updated[i] = pasted[i];
    }
    setOtpDigits(updated);
    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleOtpSubmit = async (event) => {
    event.preventDefault();
    const otpCode = otpDigits.join('');
    if (otpCode.length !== 6) {
      setError('Enter the full six-digit code.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const result = await fetchJson(`${ADMIN_API}/api/admin/verify-otp`, {
        method: 'POST',
        body: JSON.stringify({ challengeId, otp: otpCode }),
      });
      if (result.owner) {
        setOwner(result.owner);
        setStatus('authenticated');
        const overviewData = await fetchJson(`${ADMIN_API}/api/admin/overview`);
        setOverview(overviewData);
        setMessage('Owner access verified.');
      }
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      await fetchJson(`${ADMIN_API}/api/admin/logout`, { method: 'POST' });
    } catch (_err) {
      // ignore
    } finally {
      setOwner(null);
      setOverview(null);
      setStatus('login');
      setOtpDigits(['', '', '', '', '', '']);
      setChallengeId('');
    }
  };

  const summaryCards = useMemo(() => {
    if (!overview?.summary) return [];
    const summary = overview.summary;
    return [
      { label: 'Total Customers', value: summary.totalCustomers ?? 0, icon: UserRound },
      { label: 'Total Orders', value: summary.totalOrders ?? 0, icon: ShoppingCart },
      { label: 'Pending Orders', value: summary.pendingOrders ?? 0, icon: CreditCard },
      { label: 'Revenue', value: `PKR ${Number(summary.revenue || 0).toLocaleString()}`, icon: ShieldCheck },
    ];
  }, [overview]);

  if (status === 'checking') {
    return <div className="flex min-h-screen items-center justify-center bg-[#f3efe9] text-[#1a1512]">Loading secure owner access…</div>;
  }

  if (status === 'login') {
    return (
      <div className="min-h-screen bg-[#f3efe9] px-4 py-12 text-[#1a1512] md:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-[#ddcfc2] bg-white shadow-[0_24px_80px_rgba(26,21,18,0.08)]">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            <section className="relative overflow-hidden bg-[#1a1512] px-8 py-10 text-[#f3efe9] md:px-12 md:py-14">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(111,78,55,0.28),transparent_38%),linear-gradient(140deg,rgba(26,21,18,0.95),rgba(47,33,25,0.98))]" />
              <div className="relative z-10">
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d9c2af]">VEXORA</div>
                <h1 className="mt-6 text-4xl font-semibold leading-none md:text-6xl">Owner Admin Access</h1>
                <p className="mt-5 max-w-md text-base leading-7 text-[#e8dbc9]">
                  Secure access for the VEXORA owner dashboard. Use the configured owner credentials and complete two-step verification.
                </p>
                <div className="mt-8 rounded-2xl border border-[#4a3529] bg-[#241b17] p-4 text-sm text-[#e9d9c8]">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-[#d9c2af]" />
                    <span>Trusted owner access only. Password alone does not grant dashboard privileges.</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[#f8f3ef] px-6 py-8 md:px-10 md:py-10">
              <div className="mb-8">
                <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8c6d53]">Authentication</div>
                <h2 className="mt-4 font-display text-4xl text-[#1a1512]">Sign in</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block text-sm font-semibold text-[#1a1512]">
                  Owner email
                  <input
                    className={fieldClass}
                    type="email"
                    value={loginForm.email}
                    onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label className="block text-sm font-semibold text-[#1a1512]">
                  Password
                  <input
                    className={fieldClass}
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </label>

                {error && <div className="flex items-center gap-2 rounded-xl border border-[#e1bfb3] bg-[#fff3f1] px-3 py-2 text-sm text-[#8d2b1d]"><CircleAlert className="h-4 w-4" /> {error}</div>}
                {message && <div className="flex items-center gap-2 rounded-xl border border-[#bfe0c8] bg-[#eefaf3] px-3 py-2 text-sm text-[#1d5a3d]"><CheckCircle2 className="h-4 w-4" /> {message}</div>}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1a1512] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f3efe9] transition hover:bg-[#2d231d] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? 'Checking credentials…' : 'Continue'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'otp') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3efe9] px-4 py-10 text-[#1a1512]">
        <div className="w-full max-w-xl rounded-[28px] border border-[#dccbc1] bg-white p-6 shadow-[0_20px_60px_rgba(26,21,18,0.08)] md:p-8">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8c6d53]">
            <Mail className="h-4 w-4" /> Security check
          </div>
          <h2 className="mt-4 text-3xl font-semibold text-[#1a1512]">Verify your owner code</h2>
          <p className="mt-2 text-sm leading-6 text-[#584b44]">
            A six-digit verification code was sent to {maskedEmail || 'your owner email'}.
          </p>

          <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
            <div className="flex gap-3" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => (inputRefs.current[index] = element)}
                  className="h-14 w-full rounded-xl border border-[#dccbc1] bg-[#fffdfa] text-center text-2xl font-semibold text-[#1a1512] outline-none transition focus:border-[#6f4e37] focus:ring-2 focus:ring-[#ddc7af]"
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  aria-label={`OTP digit ${index + 1}`}
                />
              ))}
            </div>

            {error && <div className="flex items-center gap-2 rounded-xl border border-[#e1bfb3] bg-[#fff3f1] px-3 py-2 text-sm text-[#8d2b1d]"><CircleAlert className="h-4 w-4" /> {error}</div>}
            {message && <div className="flex items-center gap-2 rounded-xl border border-[#bfe0c8] bg-[#eefaf3] px-3 py-2 text-sm text-[#1d5a3d]"><CheckCircle2 className="h-4 w-4" /> {message}</div>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#1a1512] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f3efe9] transition hover:bg-[#2d231d] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Verifying…' : 'Verify OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus('login');
                  setError('');
                  setMessage('');
                  setChallengeId('');
                  setOtpDigits(['', '', '', '', '', '']);
                }}
                className="inline-flex items-center justify-center rounded-full border border-[#d8c5b7] bg-[#f7f0ea] px-5 py-3 text-sm font-semibold text-[#1a1512] transition hover:bg-[#f2e6df]"
              >
                Back to login
              </button>
            </div>
            <div className="text-center text-sm text-[#625349]">
              Didn’t receive a code?{' '}
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting || resendSeconds > 0}
                className="font-semibold text-[#6f4e37] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {resendSeconds > 0 ? `Resend in ${resendSeconds}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard owner={owner} overview={overview} onLogout={logout} />;

  return (
    <div className="min-h-screen bg-[#f3efe9] text-[#1a1512]">
      <header className="border-b border-[#d9c9bc] bg-[#1a1512] text-[#f3efe9]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.26em] text-[#d7c0ad]">VEXORA</div>
            <div className="text-sm text-[#f2e6dc]">Owner dashboard</div>
          </div>

          <div className="flex items-center gap-4">
            <div className="rounded-full border border-[#4a3529] bg-[#241b17] px-3 py-1 text-sm text-[#f3efe9]">
              {owner?.email || 'owner@vexora.pk'}
            </div>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-[#4a3529] bg-[#241b17] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#f3efe9] transition hover:bg-[#31261f]"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8c6d53]">Overview</div>
            <h1 className="mt-2 font-display text-4xl text-[#1a1512]">Owner control center</h1>
          </div>
          <div className="rounded-full border border-[#d7cabd] bg-[#f8f1eb] px-4 py-2 text-sm text-[#1a1512]">
            Signed in as {owner?.name || 'Vexora Owner'}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#66584d]">{label}</span>
                <span className="rounded-xl bg-[#f3efe9] p-2 text-[#1a1512]"><Icon className="h-4 w-4" /></span>
              </div>
              <div className="mt-5 text-3xl font-semibold text-[#1a1512]">{value}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1a1512]">Recent customers</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-[#6f4e37]">Live</span>
            </div>
            <div className="space-y-3">
              {(overview?.recentCustomers || []).map((customer) => (
                <div key={customer._id} className="flex items-center justify-between gap-3 rounded-xl border border-[#efe4db] bg-[#fbf8f5] p-3">
                  <div>
                    <div className="font-medium text-[#1a1512]">{customer.name}</div>
                    <div className="text-sm text-[#625349]">{customer.email}</div>
                  </div>
                  <div className="text-right text-sm text-[#625349]">
                    <div>{new Date(customer.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs uppercase tracking-[0.14em]">New</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1a1512]">Recent orders</h2>
              <span className="text-xs uppercase tracking-[0.18em] text-[#6f4e37]">Live</span>
            </div>
            <div className="space-y-3">
              {(overview?.recentOrders || []).map((order) => (
                <div key={order._id} className="rounded-xl border border-[#efe4db] bg-[#fbf8f5] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-[#1a1512]">#{String(order._id).slice(-6)}</div>
                    <div className="text-xs uppercase tracking-[0.14em] text-[#6f4e37]">{order.status}</div>
                  </div>
                  <div className="mt-2 text-sm text-[#625349]">{order.customerInfo?.name}</div>
                  <div className="mt-1 text-sm text-[#625349]">PKR {Number(order.total || 0).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-[#dfd1c6] bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1a1512]">Secure working modules</h2>
            <span className="text-xs uppercase tracking-[0.18em] text-[#6f4e37]">Owner only</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-[#efe4db] bg-[#faf6f2] p-4">
              <div className="flex items-center gap-3 text-[#1a1512]">
                <UserRound className="h-5 w-5 text-[#6f4e37]" />
                <div className="font-medium">Customer access</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#655549]">Protected endpoints and owner-only authorization are active.</p>
            </div>
            <div className="rounded-xl border border-[#efe4db] bg-[#faf6f2] p-4">
              <div className="flex items-center gap-3 text-[#1a1512]">
                <LockKeyhole className="h-5 w-5 text-[#6f4e37]" />
                <div className="font-medium">OTP verification</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#655549]">The owner must complete the email OTP challenge before any session is created.</p>
            </div>
            <div className="rounded-xl border border-[#efe4db] bg-[#faf6f2] p-4">
              <div className="flex items-center gap-3 text-[#1a1512]">
                <ShieldCheck className="h-5 w-5 text-[#6f4e37]" />
                <div className="font-medium">Session security</div>
              </div>
              <p className="mt-2 text-sm leading-6 text-[#655549]">Admin auth uses a short-lived signed cookie with owner-role enforcement on every protected route.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
