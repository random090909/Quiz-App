// Utility functions for authentication
export const getToken = () => {
  // Check localStorage first
  const token = localStorage.getItem('token')
  if (token) return token
  
  // Check cookies
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=')
    if (name === 'token') {
      return value
    }
  }
  
  return null
}

export const setToken = (token) => {
  // Store in localStorage
  localStorage.setItem('token', token)
  
  // Also set in cookie (expires in 7 days)
  const expires = new Date()
  expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000))
  document.cookie = `token=${token}; expires=${expires.toUTCString()}; path=/`
}

export const removeToken = () => {
  // Remove from localStorage
  localStorage.removeItem('token')
  
  // Remove from cookie
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}

export const isAuthenticated = () => {
  return getToken() !== null
}

