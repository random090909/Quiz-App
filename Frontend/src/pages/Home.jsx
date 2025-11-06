import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { isAuthenticated } from '../utils/auth'
import { handleLogout as performLogout } from '../utils/logout'
import { server } from '../config/server'

const Home = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [progress, setProgress] = useState(null)

  // Check authentication and progress on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }

    // Check user progress and redirect to appropriate page
    const checkProgress = async () => {
      try {
        const { data } = await axios.get(`${server}/api/users/progress`, {
          withCredentials: true
        })

        setProgress(data.progress)

        // Redirect based on progress
        if (!data.progress?.userDetailsCompleted) {
          navigate('/user-details', { replace: true })
          return
        }
        if (!data.progress?.pretestCompleted) {
          navigate('/pretest', { replace: true })
          return
        }
        if (!data.progress?.interventionCompleted) {
          navigate('/intervention', { replace: true })
          return
        }
        if (!data.progress?.posttestCompleted) {
          navigate('/posttest', { replace: true })
          return
        }

        // All steps completed, show home page
        setLoading(false)
      } catch (error) {
        console.error('Error checking progress:', error)
        // If error, redirect to user details
        navigate('/user-details', { replace: true })
      }
    }

    checkProgress()
  }, [navigate])

  const handleStartTest = () => {
    // Check progress and redirect to first incomplete step
    if (!progress?.userDetailsCompleted) {
      navigate('/user-details')
    } else if (!progress?.pretestCompleted) {
      navigate('/pretest')
    } else if (!progress?.interventionCompleted) {
      navigate('/intervention')
    } else if (!progress?.posttestCompleted) {
      navigate('/posttest')
    } else {
      // All completed, start from beginning or show completion message
      navigate('/user-details')
    }
  }

  const handleLogout = () => {
    performLogout(navigate)
  }

  const steps = [
    {
      number: 1,
      title: 'Pretest',
      description: 'Complete the initial assessment to establish your baseline knowledge and understanding of the subject matter.',
      color: 'bg-blue-500',
      bulletColor: 'bullet-blue',
    },
    {
      number: 2,
      title: 'Intervention',
      description: 'Engage with the learning materials, activities, and resources designed to enhance your understanding and skills.',
      color: 'bg-purple-500',
      bulletColor: 'bullet-purple',
    },
    {
      number: 3,
      title: 'Posttest',
      description: 'Take the final assessment to measure your progress and see how much you have learned after the intervention.',
      color: 'bg-pink-500',
      bulletColor: 'bullet-pink',
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
      {/* Logout Button - Fixed at top right, responsive positioning */}
      <button
        onClick={handleLogout}
        className="fixed top-2 xs:top-3 sm:top-4 md:top-6 right-2 xs:right-3 sm:right-4 md:right-6 z-10 px-2 xs:px-3 sm:px-4 md:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 text-xs xs:text-sm sm:text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-md xs:rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-50 active:bg-gray-100 hover:border-gray-400 active:border-gray-500 hover:-translate-y-0.5 active:translate-y-0 transform shadow-md hover:shadow-lg touch-manipulation min-h-[36px] xs:min-h-[40px] sm:min-h-[44px]"
      >
        <span className="hidden xs:inline">Logout</span>
        <span className="xs:hidden">Logout</span>
      </button>

      <div className="flex items-center justify-center min-h-[85vh] h-[85vh] max-h-[90vh] px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-3 xs:py-4 sm:py-5 md:py-6 lg:py-8 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto w-full bg-gradient-to-br from-gray-50 to-indigo-50 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl overflow-y-auto">
      {/* Content Section - Full Width */}
      <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 w-full">
        <div className="text-center px-1 xs:px-2">
          <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-1 xs:mb-2 leading-tight">
            Welcome to the <span className="text-gradient">Test!</span>
          </h1>
          <p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-600 mb-3 xs:mb-4 sm:mb-5 md:mb-6 px-1 xs:px-2">
            {progress?.posttestCompleted 
              ? 'You have completed all sections! Thank you for participating.' 
              : 'The test contains 3 sections. Pretest, Intervention, and Posttest.'}
          </p>
        </div>

        <div className="flex flex-col gap-3 xs:gap-4 sm:gap-5 md:gap-6 mb-4 xs:mb-5 sm:mb-6 md:mb-8">
          {steps.map((step) => {
            let isCompleted = false
            if (step.number === 1) isCompleted = progress?.pretestCompleted || false
            if (step.number === 2) isCompleted = progress?.interventionCompleted || false
            if (step.number === 3) isCompleted = progress?.posttestCompleted || false

            return (
              <div 
                key={step.number}
                className={`flex items-start gap-2 xs:gap-3 sm:gap-4 p-2.5 xs:p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg active:shadow-md transition-all duration-300 hover:-translate-y-1 active:translate-y-0 ${
                  isCompleted ? 'opacity-75' : ''
                }`}
              >
                {/* Colored Number Circle */}
                <div className={`flex-shrink-0 w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full ${step.color} text-white flex items-center justify-center font-bold text-base xs:text-lg sm:text-xl md:text-2xl shadow-lg transform transition-transform duration-300 hover:scale-110 active:scale-95`}>
                  {isCompleted ? '✓' : step.number}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 mb-0.5 xs:mb-1 sm:mb-2 flex-wrap">
                    {/* Colored Bullet Point */}
                    <span className={`bullet-point ${step.bulletColor} mt-0.5 xs:mt-1`}></span>
                    <h3 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">
                      {step.title}
                      {isCompleted && <span className="ml-2 text-green-600 text-sm">(Completed)</span>}
                    </h3>
                  </div>
                  <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed ml-4 xs:ml-5 sm:ml-6 md:ml-7">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 items-center justify-center px-1 xs:px-2">
          <button 
            className="w-full sm:w-auto px-5 xs:px-6 sm:px-8 md:px-10 py-2.5 xs:py-3 sm:py-4 md:py-5 text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 border-none rounded-lg cursor-pointer transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 hover:-translate-y-1 hover:shadow-xl active:translate-y-0 transform shadow-lg touch-manipulation min-h-[44px] xs:min-h-[48px] sm:min-h-[52px]" 
            onClick={handleStartTest}
          >
            {progress?.posttestCompleted ? 'Restart Test' : 'Continue Test'}
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}

export default Home