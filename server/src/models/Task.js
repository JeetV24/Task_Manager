const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Task', TaskSchema)
