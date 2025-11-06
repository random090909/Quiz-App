import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { server } from '../config/server'
import { getUserFriendlyError } from '../utils/errorHandler'
import { isAuthenticated } from '../utils/auth'

const UserDetails = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState({})

  // 10 MCQ questions for user details (demographic questions)
  const questions = [
    { id: 1, text: 'Age', options: ['17-20 years', '21-24 Years', 'Above 24 years'] },
    { id: 2, text: 'Gender', options: ['Male', 'Female', 'Other'] },
    { id: 3, text: 'Current Level of Study', options: ['Intermediate', 'Graduate', 'Post graduate', 'Other [ Diploma, Certificate]'] },
    { id: 4, text: 'Learning Goals', options: ['Secure job', 'Serve Society'] },
    { id: 5, text: 'Previous Exposure of any workshop, seminar, or training on the Intra-Aortic Balloon Pump (IABP)?', options: ['Yes', 'No'] },
    { id: 6, text: 'Primary Source of Knowledge about IABP', options: ['Classroom lectures', 'Clinical practice / hospital exposure', 'Online resources (e.g., YouTube, medical websites)', 'Peer discussion or study groups'] },
    { id: 7, text: 'Type of Educational Institution', options: ['Public / Government institution', 'Private institution', 'Mission-based / NGO-based institution', 'Other (please specify)'] },
    { id: 8, text: 'Previous Exposure', options: ['International', 'Domestic'] },
    { id: 9, text: 'Location of Institution', options: ['Urban area', 'Semi-urban area', 'Rural area'] },
    { id: 10, text: 'Previous exposure to a critical care or cardiac unit during clinical rotation?', options: ['Yes', 'No'] },
  ]

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }

    // Load existing user details answers if available
    const loadUserDetails = async () => {
      try {
        const { data } = await axios.get(`${server}/api/users/progress`, {
          withCredentials: true
        })
        
        // If user details already completed, load existing MCQ answers
        if (data.progress?.userDetailsCompleted && data.userDetailsAnswers?.length > 0) {
          const existingAnswers = {}
          data.userDetailsAnswers.forEach(item => {
            existingAnswers[item.questionId] = item.answer
          })
          setAnswers(existingAnswers)
        }
      } catch (error) {
        console.error('Error loading user details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserDetails()
  }, [navigate])

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate MCQ answers
    if (Object.keys(answers).length !== questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`)
      return
    }

    setSubmitting(true)
    try {
      await axios.post(
        `${server}/api/progress/user-details`,
        { answers },
        { withCredentials: true }
      )

      toast.success('User details saved successfully!')
      navigate('/pretest', { replace: true })
    } catch (error) {
      const friendlyError = getUserFriendlyError(error)
      toast.error(friendlyError)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-4 xs:py-6 sm:py-8 px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg sm:shadow-xl p-4 xs:p-6 sm:p-8 md:p-10">
          <div className="mb-6 xs:mb-8">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800 mb-2 xs:mb-4 text-center">
              <span className="text-gradient">User Details</span>
            </h1>
            <p className="text-sm xs:text-base text-gray-600 text-center mb-4 xs:mb-6">
              Please answer all questions below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
            <div className="flex items-center justify-between mb-4 xs:mb-6">
              <h2 className="text-xl xs:text-2xl font-semibold text-gray-800">Questions</h2>
              <span className="text-sm xs:text-base text-gray-500">
                {Object.keys(answers).length}/{questions.length} answered
              </span>
            </div>

            {questions.map((q) => (
              <fieldset key={q.id} className="p-3 xs:p-4 sm:p-5 border border-gray-200 rounded-lg">
                <legend className="font-semibold text-sm xs:text-base sm:text-lg text-gray-800 mb-2 xs:mb-3">
                  {q.id}. {q.text}
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3">
                  {q.options.map((opt, idx) => (
                    <label
                      key={idx}
                      className={`flex items-center gap-2 xs:gap-3 px-3 xs:px-4 py-2 xs:py-2.5 rounded-md cursor-pointer transition-all duration-200 ${
                        answers[q.id] === opt
                          ? 'bg-indigo-50 border-2 border-indigo-500'
                          : 'border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q_${q.id}`}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => handleChange(q.id, opt)}
                        className="h-4 w-4 xs:h-5 xs:w-5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm xs:text-base text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}

            <button
              type="submit"
              disabled={submitting || Object.keys(answers).length !== questions.length}
              className="w-full px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transform shadow-lg touch-manipulation min-h-[44px] xs:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
