import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { server } from '../config/server'
import { isAuthenticated } from '../utils/auth'

const PosttestResult = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [score, setScore] = useState(location.state?.score ?? null)

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }
    if (score === null) {
      axios.get(`${server}/api/progress/results/me`, { withCredentials: true })
        .then(({ data }) => setScore(data.posttestScore ?? 0))
        .catch(() => setScore(0))
    }
  }, [navigate, score])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Posttest Result</h1>
        <p className="text-lg text-gray-600 mb-6">Your Score</p>
        <div className="text-5xl font-extrabold text-indigo-600 mb-8">{score ?? '—'}/20</div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => navigate('/home', { replace: true })} className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold">Finish</button>
          <button onClick={() => navigate('/results-all')} className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800 font-semibold">View All Results</button>
        </div>
      </div>
    </div>
  )
}

export default PosttestResult


