import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userDetails: {
        name: String,
        email: String,
        age: Number,
        gender: String,
        education: String,
        occupation: String
    },
    userDetailsAnswers: [{
        questionId: Number,
        answer: String
    }],
    progress: {
        userDetailsCompleted: { type: Boolean, default: false },
        pretestCompleted: { type: Boolean, default: false },
        interventionCompleted: { type: Boolean, default: false },
        posttestCompleted: { type: Boolean, default: false }
    },
    pretestAnswers: [{
        questionId: Number,
        answer: String
    }],
    posttestAnswers: [{
        questionId: Number,
        answer: String
    }],
    pretestScore: {
        type: Number,
        default: 0
    },
    posttestScore: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre('save', function(next) {
    this.updatedAt = Date.now()
    next()
})

const User = mongoose.model('User', userSchema)

export default User