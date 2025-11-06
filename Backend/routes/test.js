import express from 'express'
import { submitTest, hasSubmittedUserDetails } from '../controllers/test.js'

const router = express.Router()

router.post('/submit', submitTest)
router.get('/has-submitted-userDetails', hasSubmittedUserDetails)

export default router
