import { useState } from 'react'
import { ArrowRight, Check, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { Footer, Header } from './Home'
import { API_BASE_URL } from '../config/api.js'

export default function Account() {
  const [darkMode, setDarkMode] = useState(false)
  const [message, setMessage] = useState(() => (
    window.location.pathname === '/login' && new URLSearchParams(window.location.search).has('registered')
      ? 'Account created. Please log in with your new account.'
      : ''
  ))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isSignup = window.location.pathname === '/signup'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')

    if (isSignup && password !== formData.get('confirmPassword')) {
      setMessage('Passwords do not match.')
      return
    }

    if (!API_BASE_URL) {
      setMessage('The backend API URL is not configured for this site.')
      return
    }

    const apiBase = `${API_BASE_URL}/api`
    const endpoint = `${apiBase}/auth/${isSignup ? 'signup' : 'login'}`
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email'),
      password,
      address: formData.get('address') || ''
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage(data.msg || data.message || 'Unable to process your account. Please try again.')
        return
      }

      if (isSignup) {
        window.location.assign('/login?registered=1')
        return
      }

      if (data.token) localStorage.setItem('token', data.token)
      window.location.assign('/')
    } catch {
      setMessage('Could not reach the backend. Check the API URL and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={darkMode ? 'dark min-h-screen bg-[#1a1512] text-white' : 'min-h-screen bg-[#f3efe9] text-coffee-900'}>
      <Header
        cartCount={0}
        wishlistCount={0}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenCart={() => { }}
        onSearchSelect={() => { }}
      />

      <main className="mx-auto grid min-h-[650px] max-w-[1380px] items-center gap-10 px-4 py-12 lg:grid-cols-2 lg:px-8 lg:py-20">
        <section className="relative hidden min-h-[520px] overflow-hidden rounded-3xl bg-[#5c4a3a] p-10 text-[#f3efe9] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(31,21,17,0.25),rgba(31,21,17,0.9)),url('/assets/heroimg/shopheroimg.png')] bg-cover bg-center" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#e9dccf]">Vexora account</p>
            <h1 className="mt-5 max-w-lg font-display text-6xl font-medium leading-[0.95]">
              Good to have you here.
            </h1>
          </div>
          <div className="relative z-10 max-w-md">
            <p className="text-sm leading-7 text-[#ece3dc]">
              Sign in or create an account to make your next Vexora visit feel a little more personal.
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
              <Check size={16} /> Thoughtful style, made for every day
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-lg">
          <div className="mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8c6d53] dark:text-[#d1c2b5]">
              {isSignup ? 'Join Vexora' : 'Welcome back'}
            </p>
            <h2 className="mt-3 font-display text-4xl font-medium sm:text-5xl">
              {isSignup ? 'Create your account' : 'Login to your account'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-coffee-600 dark:text-gray-300">
              {isSignup
                ? 'Create an account to get started with Vexora.'
                : 'Enter your details below to continue.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <label className="block text-xs font-semibold">
                Full name
                <span className="relative mt-2 block">
                  <UserRound size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                  <input
                    autoComplete="name"
                    className="w-full rounded-xl border border-[#e2d7cf] bg-white/60 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8c6d53] dark:border-[#3d2a1f] dark:bg-[#241a15]"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </span>
              </label>
            )}

            <label className="block text-xs font-semibold">
              Email address
              <span className="relative mt-2 block">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                <input
                  autoComplete="email"
                  className="w-full rounded-xl border border-[#e2d7cf] bg-white/60 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8c6d53] dark:border-[#3d2a1f] dark:bg-[#241a15]"
                  name="email"
                  placeholder="you@example.com"
                  required
                  type="email"
                />
              </span>
            </label>

            <label className="block text-xs font-semibold">
              Password
              <span className="relative mt-2 block">
                <LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                <input
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                  className="w-full rounded-xl border border-[#e2d7cf] bg-white/60 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8c6d53] dark:border-[#3d2a1f] dark:bg-[#241a15]"
                  minLength={8}
                  name="password"
                  placeholder="At least 8 characters"
                  required
                  type="password"
                />
              </span>
            </label>

            {isSignup && (
              <label className="block text-xs font-semibold">
                Confirm password
                <span className="relative mt-2 block">
                  <LockKeyhole size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-500" />
                  <input
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#e2d7cf] bg-white/60 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#8c6d53] dark:border-[#3d2a1f] dark:bg-[#241a15]"
                    minLength={8}
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    required
                    type="password"
                  />
                </span>
              </label>
            )}

            {message && (
              <p aria-live="polite" className="rounded-xl bg-[#8c6d53]/10 px-4 py-3 text-sm text-coffee-800 dark:text-[#e9dccf]">
                {message}
              </p>
            )}

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-coffee-900 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#5c4a3a] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-coffee-900 dark:hover:bg-[#e9dccf]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Please wait...' : isSignup ? 'Create account' : 'Login'} <ArrowRight size={15} />
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-coffee-600 dark:text-gray-300">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <a
              className="font-semibold text-coffee-900 underline underline-offset-4 dark:text-white"
              href={isSignup ? '/login' : '/signup'}
            >
              {isSignup ? 'Login' : 'Sign up'}
            </a>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  )
}
