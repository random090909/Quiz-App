import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { server } from '../config/server'
import { getUserFriendlyError } from '../utils/errorHandler'
import { isAuthenticated } from '../utils/auth'
import imageA from '../images/imageA.png'
import imageB from '../images/imageB.png'
import imageC from '../images/imageC.png'
import imageD from '../images/imageD.png'

const Pretest = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [answers, setAnswers] = useState({})

  // 20 questions for pretest (IABP knowledge questions)
    const questions = [
    { id: 1, text: 'What is the full form of IABP', options: ['Intra-Aortic Balloon Pump', 'Intra-Arterial Blood Pressure', 'Internal Aortic Balloon Pressure', 'Inter-atric Balloon Pump'] },
    { id: 2, text: 'Why is the IABP machine used even when other alternatives such as PCI are available?', options: ['To provide temporary mechanical support in cardiogenic shock', 'To replace PCI completely', 'To prevent all arrhythmias', 'To cure coronary artery disease permanently'] },
    { id: 3, text: 'Which material is commonly used in the manufacturing of the IABP balloon?', options: ['Rubber', 'Polyurethane', 'Glass fiber', 'Plastic'] },
    { id: 4, text: 'How many primary lumens/ports are present in an IABP catheter?', options: ['One', 'Two', 'Three', 'Four'] },
    { id: 5, text: 'The correct positioning of the IABP tip is?', options: ['In the left ventricle', '2–3 cm below the aortic valve', 'At the level of the renal arteries', 'In the descending thoracic aorta, below the left subclavian artery'] },
    { id: 6, text: 'What gas is typically used to inflate the IABP balloon?', options: ['Nitrogen', 'Oxygen', 'Helium', 'Carbon dioxide'] },
    { id: 7, text: 'What is the most common access site for IABP insertion?', options: ['Brachial artery', 'Radial artery', 'Femoral artery', 'Carotid artery'] },
    { id: 8, text: 'What type of monitoring is essential during IABP therapy', options: ['ECG and central venous pressure', 'Arterial pressure waveform and ECG', 'Pulse oximetry and temperature', 'Urine output and respiratory rate'] },
    { id: 9, text: 'How many sub-modes of IABP are commonly used in clinical practice?', options: ['One', 'Two', 'Three', 'Four'] },
    { id: 10, text: 'When does the IABP balloon inflate during the cardiac cycle?', options: ['During systole', 'At the beginning of ventricular contraction', 'Immediately after the R-wave', 'At the onset of diastole'] },
    { id: 11, text: 'In an IABP waveform, diastolic augmentation appears after the R wave on ECG. What is the likely cause?', options: ['Early balloon deflation', 'Late balloon inflation', 'Proper synchronization', 'Catheter kinking'] },
    { id: 12, text: 'What is the main purpose of using the IABP machine', options: ['To increase cardiac output and coronary perfusion', 'To measure arterial pressure only', 'To replace the funciton of the heart', 'To monitor pulmonary artery pressure'] },
    { id: 13, text: 'Which of the following is a contraindication for the use of an intra-aortic balloon pump (IABP)?', options: ['Cardiogenic shock', 'Acute myocardial infarction', 'Cardiac tamponade', 'Aortic dissection'] },
    { id: 14, text: 'What is the most common indication of IABP machine:', options: ['Early Balloon Deflation', 'Cardiogenic shock', 'Proper synchronization', 'Catheter Kinking'] },
    { id: 15, text: 'Which of the following is a potential complication of IABP therapy?', options: ['Hyperkalemia', 'Hemorrhagic stroke', 'Limb ischemia', 'Pulmonary embolism'] },
    { id: 16, text: 'Before insertion of IABP, what should the nurse check first', options: ['Patient\'s diet chart', 'Peripheral pulses', 'Patient\'s urine output', 'Presence of infection'] },
    { id: 17, text: 'During IABP therapy, which is the most important hourly nursing assessment', options: ['Blood sugar level', 'Peripheral circulation', 'Respiratory rate', 'Weight monitoring'] },
    { id: 18, text: 'The minimum urine output that should be maintained in a patient with IABP is', options: ['10 ml/hr', '20 ml/hr', '30 ml/hr', '40 ml/hr'] },
    { id: 19, text: 'After removal of IABP catheter, what should the nurse do?', options: ['Start IV fluids immediately', 'Check pedal pulses', 'Begin chest physiotherapy', 'Insert urinary catheter'] },
    { id: 20, text: 'Identify IABP Machine from the Images below:', options: ['Option A', 'Option B', 'Option C', 'Option D'], hasImages: true },
  ]


  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }

    // Check progress and load existing answers
    const checkProgress = async () => {
      try {
        const { data } = await axios.get(`${server}/api/users/progress`, {
          withCredentials: true
        })

        // If user details not completed, redirect to user details
        if (!data.progress?.userDetailsCompleted) {
          navigate('/user-details', { replace: true })
          return
        }

        // If pretest already completed, redirect to intervention
        if (data.progress?.pretestCompleted && data.pretestAnswers?.length > 0) {
          // Load existing answers
          const existingAnswers = {}
          data.pretestAnswers.forEach(item => {
            existingAnswers[item.questionId] = item.answer
          })
          setAnswers(existingAnswers)
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking progress:', error)
        navigate('/user-details', { replace: true })
      }
    }

    checkProgress()
  }, [navigate])

  const handleChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (Object.keys(answers).length !== questions.length) {
      toast.error(`Please answer all ${questions.length} questions before submitting.`)
      return
    }

    setSubmitting(true)
    try {
      const { data } = await axios.post(
        `${server}/api/progress/pretest`,
        { answers },
        { withCredentials: true }
      )

      toast.success(`Pretest submitted! Score: ${data.pretestScore}/20`)
      navigate('/pretest-result', { replace: true, state: { score: data.pretestScore } })
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
          <div className="flex items-center justify-between mb-4 xs:mb-6">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800">
              <span className="text-gradient">Pretest</span>
            </h1>
            <span className="text-sm xs:text-base text-gray-500">
              {Object.keys(answers).length}/{questions.length} answered
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 xs:space-y-5 sm:space-y-6">
            {questions.map((q) => (
              <fieldset key={q.id} className="p-3 xs:p-4 sm:p-5 border border-gray-200 rounded-lg">
                <legend className="font-semibold text-sm xs:text-base sm:text-lg text-gray-800 mb-2 xs:mb-3">
                  {q.id}. {q.text}
                </legend>
                
                {/* Display images for question 19 */}
                {q.hasImages && q.id === 20 && (
                  <div className="mb-4 xs:mb-6">
                    <div className="grid grid-cols-2 gap-3 xs:gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-xs xs:text-sm font-semibold text-gray-700 mb-2">A</div>
                        <img 
                          src={imageA} 
                          alt="Medical Equipment Option A" 
                          className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.target.onerror = null
                            e.target.src = 'imgA'
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs xs:text-sm font-semibold text-gray-700 mb-2">B</div>
                        <img 
                          src={imageB} 
                          alt="Medical Equipment Option A" 
                          className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.target.onerror = null
                            e.target.src = 'imgB'
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs xs:text-sm font-semibold text-gray-700 mb-2">C</div>
                        <img 
                          src={imageC} 
                          alt="Medical Equipment Option A" 
                          className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.target.onerror = null
                            e.target.src = 'imgC'
                          }}
                        />
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="text-xs xs:text-sm font-semibold text-gray-700 mb-2">D</div>
                        <img 
                          src={imageD} 
                          alt="Medical Equipment Option A" 
                          className="w-full h-32 xs:h-40 sm:h-48 object-cover rounded-lg border-2 border-gray-300 shadow-md"
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.target.onerror = null
                            e.target.src = 'imgD'
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
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
              {submitting ? 'Submitting...' : 'Submit Pretest'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Pretest

