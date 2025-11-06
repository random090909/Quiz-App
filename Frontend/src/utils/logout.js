import { removeToken } from './auth'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getUserFriendlyError } from './errorHandler'
import { server } from '../config/server'

/**
 * Logout utility function that handles logout logic
 * @param {Function} navigate - React Router navigate function
 * @param {Function} onSuccess - Optional callback on successful logout
 */
export const handleLogout = async (navigate, onSuccess) => {
  try {
    const { data } = await axios.post(`${server}/api/users/logout`, {}, {
      withCredentials: true,
    })
    
    // Clear user state
    removeToken()
    
    // Trigger custom event to notify App component about logout
    window.dispatchEvent(new CustomEvent('authChange'))
    
    toast.success(data.message || "Logged out successfully")
    
    // Navigate to login page and replace current history entry
    navigate('/', { replace: true })
    
    if (onSuccess) {
      onSuccess()
    }
  } catch (error) {
    // Even if API call fails, remove token and redirect
    removeToken()
    
    // Trigger custom event to notify App component about logout
    window.dispatchEvent(new CustomEvent('authChange'))
    
    // Get user-friendly error message
    const friendlyError = getUserFriendlyError(error)
    toast.error(friendlyError)
    
    // Navigate to login page and replace current history entry
    navigate('/', { replace: true })
    
    if (onSuccess) {
      onSuccess()
    }
  }
}

