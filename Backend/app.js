import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.js'
import progressRoutes from './routes/progress.js'

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

// Routes
app.use('/api/users', userRoutes)
app.use('/api/progress', progressRoutes)

mongoose.connect(process.env.MONGO_URI,{dbName:"QuizProject"})  
    .then(() => {
        console.log('Connected to MongoDB')
        app.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    })
    .catch((err) => {
        console.log(err)
    })