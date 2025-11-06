import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom' // added useLocation
import axios from 'axios'
import toast from 'react-hot-toast'
import { server } from '../config/server'
import { getUserFriendlyError } from '../utils/errorHandler'
import { isAuthenticated } from '../utils/auth'

const Intervention = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const fromPretest = location?.state?.from === 'pretest' || location?.state?.reattempt === true

  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [completed, setCompleted] = useState(false)

  // 10 slides for intervention
  const slides = [
    {
      id: 1,
      title: 'Introduction',
      content: 'Welcome to the intervention phase. This is where you will learn important concepts and skills that will help you succeed in the posttest.'
    },
    {
      id: 2,
      title: 'Introduction',
      content:[
      'Intra-Aortic Ballon Pump (IABP) is a mechanical  circulatory support device used in critically ill cardiac patients.',
      'It function on the principal of counter pulsation, inflating during diastole to increase coronary perfusion and deflating before systole to reduce after load.',
      'It is designed to enhance the myocardial oxygen supply and decrease oxygen demand by assisting the heart in pumping blood more effectively'
      ]
    },
    {
      id: 3,
      title: 'Why IABP ?',
      content: [
        'Cardiogenic shock (especially post-MI).',
        'Acute myocardial infarction with hemodynamic instability.',
        'Refractory unstable angina.',
        'Mechanical complications of MI (papillary muscle rupture, ventricular septal rupture).',
        'Low cardiac output after cardiac surgery.',
        'Support during high-risk PCI.'
      ]
    },
    {
      id: 4,
      title: 'Structure & Components',
      content: [
      { type: 'heading', text: 'The IABP system consists of three main parts :', afterSpace: true },
      { type: 'subheading', text: '1. Balloon Catheter: Inserted into descending thoracic aorta (just below left subclavian artery)' },
      { type: 'subheading', text: '2. Balloon material: Polyurethane (flexible, biocompatible)' },
      { type: 'subheading', text: '3. Catheter material: Polyethylene (durable)', afterSpace: true },
      { type: 'heading', text: 'The IABP system Contains two ports:', afterSpace: true },
      { type: 'subheading', text: '1. Helium port: For inflation/deflation' },
      { type: 'subheading', text: '2. Pressure monitoring port: For arterial pressure waveform', afterSpace: true },
      'Console (Pump System) Contains gas cylinder (helium). Synchronizes balloon movement with ECG/arterialwaveform must be positioned at phlebostatic axis (level of the heart) for accurate readings.',
      'Helium Gaslight → allows rapid inflation/deflation',
      'Safe → diffuses quickly if balloon ruptures']
    },
    {
      id: 5,
      title: 'Insertion And Monitoring',
      content: [
        'Common Site: Femoral artery: Subclavian or axillary artery (for longer-term support)',
        'Positioning  of the IABP tip is in the descending thoracic aorta, below the left subclavical artery.',
        { type: 'heading', text: 'Monitoring Parameters:', afterSpace: true },
        { type: 'subheading', text: '1. Hemodynamics: ECG, arterial waveform, MAP' },
        { type: 'subheading', text: '2. Renal Function: Hourly urine output' },
        { type: 'subheading', text: '3. Limb Perfusion: Color, pulses, temperature, cap refill' },
        { type: 'subheading', text: '4. Insertion Site: Signs of bleeding, hematoma, infection' },
      ]
    },
    {
      id: 6,
      title: 'Modes & Functions',
      content: [
        '1:1- Mode: Balloon inflates every heartbeat → full support (used initially).',
        '1:2 or 1:3 Mode: Balloon inflates every 2nd or 3rd beat → used for weaning before removal.',
        { type: 'heading', text: 'Timing of Action :', afterSpace: true },
        { type: 'subheading', text: '1. Inflation: At the start of diastole (after dicrotic notch) → increases coronary perfusion pressure' },
        { type: 'subheading', text: '2. Deflation: Just before systole → decreases afterload and eases LV ejection', afterSpace: true },
        { type: 'heading', text: 'Physiological Effects:', afterSpace: true },
        { type: 'subheading', text: '1. Increase in Coronary artery blood flow → improves oxygen supply' },
        { type: 'subheading', text: '2. Decrease in Left ventricular workload → reduces myocardial oxygen consumption', },
        { type: 'subheading', text: '3. Increase in Stroke volume & cardiac output → improves tissue perfusion', afterSpace: true },
      ]
    },
    {
      id: 7,
      title: 'Purpose',
      content: [
        { type: 'heading', text: 'Primary goal: Increase coronary perfusion and reduce LV afterload', afterSpace: true }, // heading example
        { type: 'heading', text: 'Other Purposes:', afterSpace:true },
        { type: 'subheading', text: 'To provide temporary circulatory support in cardiogenic shock', afterSpace: true },
        { type: 'subheading', text: 'To stabilize patients with acute myocardial infarction or severe ischemia', afterSpace: true },
        { type: 'subheading', text: 'To support circulation during high-risk cardiac procedures (e.g., angioplasty, CABG)', afterSpace: true },
        { type: 'subheading', text: 'To bridge patients awaiting surgery, revascularization, or heart transplantation', afterSpace: true },
        { type: 'subheading', text: 'To enhance overall cardiac output and tissue perfusion in critically ill patients', afterSpace: true },
      ]
    },
    {
      id: 8,
      title: 'Indications',
      content: [
        { type: 'heading', text: 'When to use', afterSpace: true },
        'Cardiogenic shock (commonly post-acute MI)',
        'Acute MI with complications (e.g., papillary muscle rupture, VSD)',
        'Refractory unstable angina not responding to medications',
        'Perioperative support during high-risk PCI or CABG',
        'Bridge therapy before more advanced devices (LVAD, transplant)',
      ]
    },
    {
      id: 9,
      title: 'Contraindications:',
      content: [
        { type: 'heading', text: 'When not to use', afterSpace: true },
        'Severe Aortic Regurgitation: Balloon worsens backflow into LV.',
        'Aortic Dissection: Risk of worsening tear.',
        'Severe Peripheral Arterial Disease (PAD): Difficult insertion, high ischemia risk.',
        'Coagulopathy: High bleeding risk.',
        'Sepsis: Increases risk of infection and worsens prognosis',
      ]
    },
    {
      id: 10,
      title: 'Timing Errors in IABP Waveform',
      content: [
        'The balloon inflates at the onset of diastole (right after the aortic valve closes, i.e., at the dicrotic notch of the arterial waveform, just after the T wave of the ECG).',
        'This provides diastolic augmentation, which increases coronary perfusion.',
        'If balloon inflates late (after the R wave)',
        'The augmentation peak shifts later than expected. Instead of supporting coronary perfusion at the start of diastole, the support comes too late, reducing the effectiveness. This is seen as diastolic augmentation appearing after the R wave on ECG.',
      ]
    },
    {
      id: 11,
      title: 'Technical Facts',
      content: [
        'Gas used: Helium (fast, safe)',
        'Most critical factor: Correct balloon timing with ECG/arterial waveform',
        'Console placement: Always at heart level (phlebostatic axis)',
        'Balloon size: Chosen according to patient’s height (smaller for shorter patients)',
      ]
    },
    {
      id: 12,
      title: 'Complications',
      content: [
        'Vascular: Limb ischemia (most common) and Bleeding/hematoma',
        'Rare: Aortic dissection',
        'Mechanical: Balloon rupture → blood in catheter tubing is a warning sign and Helium embolism (rare, but possible).',
        'Infectious: Local infection at insertion site and Sepsis with prolonged use',
        'Haematological: Thrombocytopenia (platelet damage from balloon surface)'
      ]
    },
    {
      id: 13,
      title: 'Nursing Responsibilities',
      content: [
        { type: 'heading', text: 'Before Insertion:', afterSpace: true },
        { type: 'subheading', text: 'Assess peripheral pulses (dorsalis pedis, posterior tibial, femoral)' },
        { type: 'subheading', text: 'Check coagulation profile (PT, aPTT, INR)' },
        { type: 'subheading', text: 'Assess renal function (urine output, serum creatinine)' },
        { type: 'subheading', text: 'Check allergies (heparin, latex, contrast dye)' },
        { type: 'subheading', text: 'Prepare sterile equipment, assist physician in insertion', afterSpace: true  },

        { type: 'heading', text: 'During Therapy:', afterSpace: true },
        { type: 'subheading', text: 'Peripheral circulation (Every Hour)' },
        { type: 'subheading', text: 'Monitor hemodynamics and prevent complication' },
        { type: 'subheading', text: 'Most important hourly check → Limb perfusion (pulses, skin color, temperature, capillary refill)' },
        { type: 'subheading', text: 'Monitor ECG and arterial pressure waveform' },
        { type: 'subheading', text: 'Record blood pressure (MAP) and urine output (≥30 mL/hr = adequate renal perfusion)' },
        { type: 'subheading', text: 'Maintain sterile insertion site → watch for infection/bleeding' },

      ]
    },
    {
      id: 14,
      title: 'Nursing Responsibilities',
      content: [
      { type: 'heading', text: 'Observe Waveform Timing:', afterSpace: true },
      { type: 'subheading', text: 'Early inflation = augmentation after R wave' },
      { type: 'subheading', text: 'Late deflation = Increases afterload (harmful).' },

      { type: 'heading', text: 'After Removal:', afterSpace: true },
      { type: 'subheading', text: 'Check Pedal Pulses' },
      { type: 'subheading', text: 'Apply firm pressure (20–30 minutes) or use closure device' },
      { type: 'subheading', text: 'Keep patient supine with leg straight (4–6 hrs)' },
      { type: 'subheading', text: 'Monitor for bleeding, hematoma, loss of distal pulses' },
      { type: 'subheading', text: 'Minimum urine output ≥ 30 mL/hour' },
      { type: 'subheading', text: 'Pain, pallor, and cold extremities are early signs of limb ischemia in IABP' },

      ]
    },
    {
      id: 15,
      title: 'Summary',
      content: [
      { type: 'subheading', text: 'The IABP is a lifesaving temporary support device in patients with cardiogenic shock or acute coronary syndromes.', afterSpace: true },

      { type: 'heading', text: 'Mechanism:', afterSpace: true },
      { type: 'subheading', text: 'Inflates in diastole → augments coronary perfusion' },
      { type: 'subheading', text: 'Deflates in systole → reduces afterload', afterSpace: true },

      { type: 'heading', text: 'Nursing Role:', afterSpace: true },
      { type: 'subheading', text: 'Central to patient safety' },
      { type: 'subheading', text: 'Includes: Hourly limb checks' },
      { type: 'subheading', text: 'Monitoring urine output & hemodynamic' },
      { type: 'subheading', text: 'Maintaining insertion site sterility' },
      { type: 'subheading', text: 'Ensuring correct timing of balloon inflation/deflation', afterSpace: true },

      { type: 'heading', text: 'Importance:', afterSpace: true },
      { type: 'subheading', text: 'Despite newer devices like ECMO or LVAD, IABP remains a vital bridge therapy in cardiac emergencies' },

      ]
    } 
  ]

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/', { replace: true })
      return
    }

    // Check progress
    const checkProgress = async () => {
      try {
        const { data } = await axios.get(`${server}/api/users/progress`, {
          withCredentials: true
        })

        // If user details not completed, redirect
        if (!data.progress?.userDetailsCompleted) {
          navigate('/user-details', { replace: true })
          return
        }

        // If pretest not completed, redirect
        if (!data.progress?.pretestCompleted) {
          navigate('/pretest', { replace: true })
          return
        }

        // If intervention already completed, redirect to posttest
        // When coming directly from pretest (reattempt), allow entering Intervention even if
        // interventionCompleted is true (we want to re-run intervention). Only redirect if
        // interventionCompleted AND NOT coming from pretest.
        if (data.progress?.interventionCompleted && !fromPretest) {
          navigate('/posttest', { replace: true })
          return
        }

        setLoading(false)
      } catch (error) {
        console.error('Error checking progress:', error)
        navigate('/pretest', { replace: true })
      }
    }

    checkProgress()
  }, [navigate])

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleComplete = async () => {
    try {
      await axios.post(
        `${server}/api/progress/intervention`,
        {},
        { withCredentials: true }
      )

      toast.success('Intervention completed!')
      setCompleted(true)
      setTimeout(() => {
        navigate('/posttest', { replace: true })
      }, 1000)
    } catch (error) {
      const friendlyError = getUserFriendlyError(error)
      toast.error(friendlyError)
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
          {/* Header */}
          <div className="flex items-center justify-between mb-4 xs:mb-6">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800">
              <span className="text-gradient">Intervention</span>
            </h1>
            <span className="text-sm xs:text-base text-gray-500">
              Slide {currentSlide + 1} of {slides.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4 xs:mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2 xs:h-3">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 xs:h-3 rounded-full transition-all duration-300"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="mb-6 xs:mb-8 min-h-[300px] xs:min-h-[400px] flex flex-col justify-center">
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mb-4 xs:mb-6">
              {slides[currentSlide].title}
            </h2>

            {Array.isArray(slides[currentSlide].content) ? (
              <ul className="list-disc pl-5">
                {slides[currentSlide].content.map((item, idx) => {
                  const isObj = typeof item === 'object'
                  const text = isObj ? item.text : item
                  const type = isObj ? item.type : undefined
                  const afterSpace = isObj && item.afterSpace

                  // Classes per type
                  const baseCls = 'text-base xs:text-lg sm:text-xl leading-relaxed'
                  const headingCls = 'font-semibold text-gray-800 ' + baseCls
                  const subheadingCls = 'text-sm text-gray-700 ml-4 ' + baseCls
                  const normalCls = 'text-base text-gray-600 ' + baseCls

                  return (
                    <React.Fragment key={idx}>
                      <li className={
                        type === 'heading' ? headingCls :
                        type === 'subheading' ? subheadingCls :
                        normalCls
                      }>
                        {text}
                      </li>
                      {afterSpace && <div aria-hidden className="h-3" />}
                    </React.Fragment>
                  )
                })}
              </ul>
            ) : (
              <p className="text-base xs:text-lg sm:text-xl text-gray-600 leading-relaxed">
                {slides[currentSlide].content}
              </p>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 items-center justify-between">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 text-sm xs:text-base font-semibold text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer transition-all duration-300 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation min-h-[44px] xs:min-h-[48px]"
            >
              Previous
            </button>

            {currentSlide === slides.length - 1 ? (
              <button
                type="button"
                onClick={handleComplete}
                disabled={completed}
                className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transform shadow-lg touch-manipulation min-h-[44px] xs:min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {completed ? 'Completing...' : 'Complete Intervention'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto px-4 xs:px-6 sm:px-8 py-2.5 xs:py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg cursor-pointer transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 active:from-indigo-800 active:to-purple-800 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transform shadow-lg touch-manipulation min-h-[44px] xs:min-h-[48px]"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Intervention

