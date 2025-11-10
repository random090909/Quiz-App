import jwt from 'jsonwebtoken'
import User from '../schema/user.js'

// Save user details (personal info + MCQ answers)
const saveUserDetails = async(req, res) => {
    try {
        const token = req.cookies?.['val-token'] || req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const { answers } = req.body
        
        // Convert answers object to array if needed
        let answersArray = []
        if (Array.isArray(answers)) {
            answersArray = answers
        } else if (typeof answers === 'object') {
            answersArray = Object.entries(answers).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                answer: String(answer)
            }))
        }

        if (answersArray.length !== 10) {
            return res.status(400).json({ error: 'Expected 10 answers' })
        }

        const user = await User.findByIdAndUpdate(
            payload.userId,
            {
                userDetailsAnswers: answersArray,
                'progress.userDetailsCompleted': true
            },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({
            message: 'User details saved successfully',
            userDetails: user.userDetails,
            progress: user.progress
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Save pretest answers
const savePretest = async(req, res) => {
    try {
        const token = req.cookies?.['val-token'] || req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const { answers } = req.body
        
        // Convert object to array if needed
        let answersArray = []
        if (Array.isArray(answers)) {
            answersArray = answers
        } else if (typeof answers === 'object') {
            answersArray = Object.entries(answers).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                answer: String(answer)
            }))
        }

        if (answersArray.length !== 20) {
            return res.status(400).json({ error: 'Expected 20 answers' })
        }

        // Answer key for pretest (by questionId: correct option string)
        const pretestKey = {
            1: 'Intra-Aortic Balloon Pump',
            2: 'To provide temporary mechanical support in cardiogenic shock',
            3: 'Polyurethane',
            4: 'Two',
            5: 'In the descending thoracic aorta, below the left subclavian artery',
            6: 'Helium',
            7: 'Femoral artery',
            8:'Arterial pressure waveform and ECG',
            9: 'Two',
            10: 'At the onset of diastole',
            11: 'Late balloon inflation',
            12: 'To increase cardiac output and coronary perfusion',
            13: 'Aortic dissection',
            14: 'Cardiogenic shock',
            15: 'Limb ischemia',
            16: 'Peripheral pulses',
            17: 'Peripheral circulation',
            18: '30 ml/hr',
            19: 'Check pedal pulses',
            20: 'Option A'
        }

        const pretestScore = answersArray.reduce((score, { questionId, answer }) => {
            return score + (pretestKey[questionId] === answer ? 1 : 0)
        }, 0)

        const user = await User.findByIdAndUpdate(
            payload.userId,
            {
                pretestAnswers: answersArray,
                pretestScore,
                'progress.pretestCompleted': true
            },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({
            message: 'Pretest saved successfully',
            progress: user.progress,
            pretestScore
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Mark intervention as completed
const completeIntervention = async(req, res) => {
    try {
        const token = req.cookies?.['val-token'] || req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const user = await User.findByIdAndUpdate(
            payload.userId,
            {
                'progress.interventionCompleted': true
            },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({
            message: 'Intervention completed',
            progress: user.progress
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Save posttest answers
const savePosttest = async(req, res) => {
    try {
        const token = req.cookies?.['val-token'] || req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const { answers } = req.body
        
        // Convert object to array if needed
        let answersArray = []
        if (Array.isArray(answers)) {
            answersArray = answers
        } else if (typeof answers === 'object') {
            answersArray = Object.entries(answers).map(([questionId, answer]) => ({
                questionId: Number(questionId),
                answer: String(answer)
            }))
        }

        if (answersArray.length !== 20) {
            return res.status(400).json({ error: 'Expected 20 answers' })
        }

        // Answer key for posttest (same as pretest)
        const posttestKey = {
            1: 'Intra-Aortic Balloon Pump',
            2: 'To provide temporary mechanical support in cardiogenic shock',
            3: 'Polyurethane',
            4: 'Two',
            5: 'In the descending thoracic aorta, below the left subclavian artery',
            6: 'Helium',
            7: 'Femoral artery',
            8:'Arterial pressure waveform and ECG',
            9: 'Two',
            10: 'At the onset of diastole',
            11: 'Late balloon inflation',
            12: 'To increase cardiac output and coronary perfusion',
            13: 'Aortic dissection',
            14: 'Cardiogenic shock',
            15: 'Limb ischemia',
            16: 'Peripheral pulses',
            17: 'Peripheral circulation',
            18: '30 ml/hr',
            19: 'Check pedal pulses',
            20: 'Option A'
        }


        const posttestScore = answersArray.reduce((score, { questionId, answer }) => {
            return score + (posttestKey[questionId] === answer ? 1 : 0)
        }, 0)

        const user = await User.findByIdAndUpdate(
            payload.userId,
            {
                posttestAnswers: answersArray,
                posttestScore,
                'progress.posttestCompleted': true
            },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({
            message: 'Posttest saved successfully',
            progress: user.progress,
            posttestScore
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Get current user results
const getMyResults = async (req, res) => {
    try {
        const token = req.cookies?.['val-token'] || req.headers?.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        let payload
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET)
        } catch (err) {
            return res.status(401).json({ error: 'Invalid token' })
        }

        const user = await User.findById(payload.userId).select('-password')
        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        return res.status(200).json({
            username: user.username,
            progress: user.progress,
            pretestScore: user.pretestScore || 0,
            posttestScore: user.posttestScore || 0
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

// Get all users results
const getAllResults = async (req, res) => {
    try {
        const users = await User.find({}).select('username pretestScore posttestScore progress createdAt')
        return res.status(200).json({ users })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export { saveUserDetails, savePretest, completeIntervention, savePosttest, getMyResults, getAllResults }

