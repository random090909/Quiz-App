import mongoose from 'mongoose'

const Schema = mongoose.Schema

const answerSchema = new Schema({
  questionId: { type: Number, required: true },
  answer: { type: String, required: true },
}, { _id: false })

const testSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: { type: [answerSchema], required: true },
  createdAt: { type: Date, default: Date.now },
})

const Test = mongoose.model('Test', testSchema)

export default Test
