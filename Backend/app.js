import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import userRoutes from './routes/user.js'
import progressRoutes from './routes/progress.js'
import path from "path";
import { fileURLToPath } from "url";

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// CORS middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://quiz-app-hzwp.onrender.com"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Routes
app.use('/api/users', userRoutes)
app.use('/api/progress', progressRoutes)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const _dirname1 = path.resolve(__dirname, '..')

if(process.env.NODE_ENV=='production'){
    app.use(express.static(path.join(_dirname1, "Frontend", "dist")));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(_dirname1,"Frontend","dist","index.html"));
    });
}
else{
    app.get("/",(req,res)=>{
        res.send("Success");
    })
}

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