import jwt from 'jsonwebtoken'
import Test from '../schema/test.js'

const submitTest = async (req, res) => {
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

    const userId = payload.userId
    const answers = req.body?.answers

    if (!Array.isArray(answers) && typeof answers === 'object') {
      // convert { qid: value } to [{questionId, answer}]
      const arr = Object.entries(answers).map(([k, v]) => ({ questionId: Number(k), answer: v }))
      req.body.answers = arr
    }

    if (!Array.isArray(req.body.answers) || req.body.answers.length === 0) {
      return res.status(400).json({ error: 'No answers provided' })
    }

    // Optional: validate exactly 10 answers
    if (req.body.answers.length !== 10) {
      return res.status(400).json({ error: 'Expected 10 answers' })
    }

    const testDoc = await Test.create({
      user: userId,
      answers: req.body.answers
    })

    return res.status(201).json({ message: 'Test submitted', testId: testDoc._id })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

const hasSubmittedUserDetails = async (req, res) => {
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

    const userId = payload.userId
    const existing = await Test.findOne({ user: userId }).lean()
    if (existing) {
      return res.status(200).json({ submitted: true, testId: existing._id, createdAt: existing.createdAt })
    }

    return res.status(200).json({ submitted: false })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

export { submitTest, hasSubmittedUserDetails }
