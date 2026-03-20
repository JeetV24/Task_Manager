const express = require('express')
const router = express.Router()
const Task = require('../models/Task')

router.get('/', async (req, res) => {
  const tasks = await Task.find().sort({ created_at: -1 })
  res.json(tasks)
})

router.post('/', async (req, res) => {
  const { title, description } = req.body
  if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' })
  const task = await Task.create({ title: title.trim(), description: description || '' })
  res.status(201).json(task)
})

router.put('/:id', async (req, res) => {
  const { title, description, status } = req.body
  const update = {}
  if (title !== undefined) {
    if (!title || !title.trim()) return res.status(400).json({ error: 'Title is required' })
    update.title = title.trim()
  }
  if (description !== undefined) update.description = description
  if (status !== undefined) {
    if (!['pending', 'completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' })
    update.status = status
  }
  const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true })
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.json(task)
})

router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id)
  if (!task) return res.status(404).json({ error: 'Not found' })
  res.status(204).end()
})

router.patch('/:id/toggle', async (req, res) => {
  const task = await Task.findById(req.params.id)
  if (!task) return res.status(404).json({ error: 'Not found' })
  task.status = task.status === 'completed' ? 'pending' : 'completed'
  await task.save()
  res.json(task)
})

module.exports = router
