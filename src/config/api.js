const configuredBaseUrl = (
  import.meta.env.VITE_API_BASE_URL
  || import.meta.env.VITE_API_URL
  || ''
).trim()

const apiUrl = configuredBaseUrl || (import.meta.env.DEV ? 'http://localhost:5000' : '')

export const API_BASE_URL = apiUrl
  .replace(/\/+$/, '')
  .replace(/\/api$/i, '')

export const API_ORIGIN = API_BASE_URL
  ? new URL(API_BASE_URL, globalThis.location?.origin || 'http://localhost').origin
  : ''
