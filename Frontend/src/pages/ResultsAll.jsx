import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { server } from '../config/server'
import { isAuthenticated } from '../utils/auth'
import { useNavigate } from 'react-router-dom'

const ResultsAll = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }
    axios.get(`${server}/api/progress/results`, { withCredentials: true })
      .then(({ data }) => setUsers(data.users || []))
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Users Results</h1>
          <button onClick={() => navigate('/home')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">Home</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2">Username</th>
                <th className="py-3 px-2">Pretest</th>
                <th className="py-3 px-2">Posttest</th>
                <th className="py-3 px-2">User Details</th>
                <th className="py-3 px-2">Pretest Done</th>
                <th className="py-3 px-2">Intervention</th>
                <th className="py-3 px-2">Posttest Done</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2">{u.username}</td>
                  <td className="py-2 px-2">{u.pretestScore ?? 0}/20</td>
                  <td className="py-2 px-2">{u.posttestScore ?? 0}/20</td>
                  <td className="py-2 px-2">{u.progress?.userDetailsCompleted ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-2">{u.progress?.pretestCompleted ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-2">{u.progress?.interventionCompleted ? 'Yes' : 'No'}</td>
                  <td className="py-2 px-2">{u.progress?.posttestCompleted ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ResultsAll


