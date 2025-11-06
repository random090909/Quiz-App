import express from 'express'
import { saveUserDetails, savePretest, completeIntervention, savePosttest, getMyResults, getAllResults } from '../controllers/progress.js'

const router = express.Router()

router.post('/user-details', saveUserDetails)
router.post('/pretest', savePretest)
router.post('/intervention', completeIntervention)
router.post('/posttest', savePosttest)
router.get('/results/me', getMyResults)
router.get('/results', getAllResults)

export default router

