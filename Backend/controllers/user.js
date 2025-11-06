import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../schema/user.js'

// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
}

const register = async(req, res) => {
    try {
        const { username, password } = req.body
        
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        
        const user = await User.create({ 
            username, 
            password: hashedPassword 
        })
        
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        res.status(201).cookie("val-token", token, cookieOptions).json({ 
            message: 'User registered successfully',
            token,
            user: { id: user._id, username: user.username }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const login = async(req, res) => {
    try {
        const { username, password } = req.body
        
        // Find user by username
        const user = await User.findOne({ username })
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        
        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )
        
        res.status(200).cookie("val-token", token, cookieOptions).json({ 
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username }
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const logout = async(req, res) => {
    return res.status(200).cookie("val-token", "", {
        ...cookieOptions,
        maxAge: 0
    }).json({
        success: true,
        message: "Logout Successful"
    })
}

const getUserProgress = async(req, res) => {
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
            userDetails: user.userDetails || null,
            userDetailsAnswers: user.userDetailsAnswers || [],
            progress: user.progress,
            pretestAnswers: user.pretestAnswers || [],
            posttestAnswers: user.posttestAnswers || []
        })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

export { register, login, logout, getUserProgress }
