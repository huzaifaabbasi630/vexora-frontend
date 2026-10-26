const rawBaseUrl = (
  import.meta.env.VITE_API_BASE_URL
  || import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://localhost:5000' : '')
).trim()

// Backend origin without a trailing slash or `/api` suffix, e.g. https://vexora-backend.vercel.app
export const API_ORIGIN = rawBaseUrl.replace(/\/+$/, '').replace(/\/api$/, '')

// Base for all REST calls, e.g. https://vexora-backend.vercel.app/api
export const API_BASE_URL = API_ORIGIN ? `${API_ORIGIN}/api` : ''

if (!API_ORIGIN) {
  console.error('VEXORA: VITE_API_BASE_URL is not set. Configure it in your Vercel project and redeploy.')
}
