import express from 'express'
import { login, register, logout, getUserProgress } from '../controllers/user.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/progress', getUserProgress)

export default router