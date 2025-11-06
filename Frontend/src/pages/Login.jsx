import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setToken, isAuthenticated } from '../utils/auth'
import { server } from '../config/server'
import axios from 'axios'
import toast from 'react-hot-toast'
import { getUserFriendlyError } from '../utils/errorHandler'

const Login = () => {
  const navigate = useNavigate()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  })

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/home')
    }
  }, [navigate])

  // Reset form when toggling
  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      username: '',
      password: '',
      confirmPassword: ''
    })
    setErrors({
      username: '',
      password: '',
      confirmPassword: ''
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }
    
    // Registration validation
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      // Show toast for validation errors
      const firstError = Object.values(newErrors)[0]
      toast.error(firstError)
      return
    }

    try {
      const endpoint = isLogin ? 'login' : 'register'
      const { data } = await axios.post(
        `${server}/api/users/${endpoint}`,
        {
          username: formData.username,
          password: formData.password
        },
        {
          withCredentials: true
        }
      )

      // Store token
      setToken(data.token)
      
      // Show success toast
      toast.success(isLogin ? 'Login successful! Welcome back.' : 'Registration successful! Welcome to Quiz Project.')
      
      // Navigate to home (which will redirect based on progress)
      navigate('/home', { replace: true })
    } catch (error) {
      // Get user-friendly error message
      const friendlyError = getUserFriendlyError(error)
      
      // Show error toast
      toast.error(friendlyError)
      
      // Set form errors
      setErrors({
        username: friendlyError,
        password: friendlyError,
        confirmPassword: ''
      })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-indigo-50 py-2 xs:py-3 sm:py-4 md:py-6 lg:py-8">
      <div className="w-full max-w-[95%] xs:max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-md xl:max-w-lg">
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10">
          {/* Header */}
          <div className="text-center mb-3 xs:mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 xs:mb-2 leading-tight">
              <span className="text-gradient">{isLogin ? 'Login' : 'Register'}</span>
            </h1>
            <p className="text-xs xs:text-sm sm:text-base text-gray-600 mt-1 xs:mt-2">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={toggleMode}
                className="text-indigo-600 hover:text-indigo-700 active:text-indigo-800 font-semibold underline transition-colors touch-manipulation"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-2.5 xs:space-y-3 sm:space-y-4 md:space-y-5">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 rounded-lg border text-sm xs:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.username 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Enter your username"
                autoComplete="username"
              />
              {errors.username && (
                <p className="mt-1 text-xs xs:text-sm text-red-600 break-words">{errors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 rounded-lg border text-sm xs:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                  errors.password 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
                placeholder="Enter your password"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
              {errors.password && (
                <p className="mt-1 text-xs xs:text-sm text-red-600 break-words">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field - Only for Registration */}
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-xs xs:text-sm font-semibold text-gray-700 mb-1 xs:mb-1.5 sm:mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-3 xs:px-4 py-2.5 xs:py-3 sm:py-3.5 rounded-lg border text-sm xs:text-base transition-all duration-200 focus:outline-none focus:ring-2 ${
                    errors.confirmPassword 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                  }`}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs xs:text-sm text-red-600 break-words">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transform shadow-lg touch-manipulation min-h-[44px] xs:min-h-[48px]"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login