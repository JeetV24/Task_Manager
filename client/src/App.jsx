import { useEffect, useState } from 'react'
import './App.css'

const API_BASE = 'http://localhost:4000/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const loadTasks = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_BASE)
      const data = await res.json()
      setTasks(data)
    } catch (e) {
      setError('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTasks()
  }, [])

  const addTask = async (e) => {
    e.preventDefault()
    setError('')
    const t = title.trim()
    if (!t) {
      setError('Title is required')
      return
    }
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, description })
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Failed to add task')
        return
      }
      setTitle('')
      setDescription('')
      await loadTasks()
    } catch {
      setError('Failed to add task')
    }
  }

  const toggleTask = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_BASE}/${id}/toggle`, { method: 'PATCH' })
      if (!res.ok) {
        setError('Failed to toggle task')
        return
      }
      await loadTasks()
    } catch {
      setError('Failed to toggle task')
    }
  }

  const startEdit = (task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEdit = async () => {
    if (!editingId) return
    setError('')
    const t = editTitle.trim()
    if (!t) {
      setError('Title is required')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: t, description: editDescription })
      })
      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Failed to update task')
        return
      }
      cancelEdit()
      await loadTasks()
    } catch {
      setError('Failed to update task')
    }
  }

  const deleteTask = async (id) => {
    setError('')
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        setError('Failed to delete task')
        return
      }
      await loadTasks()
    } catch {
      setError('Failed to delete task')
    }
  }

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <form className="task-form" onSubmit={addTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      {error && <div className="error">{error}</div>}
      <div className="list">
        {loading && <div className="loading">Loading...</div>}
        {!loading && tasks.length === 0 && <div className="empty">No tasks</div>}
        {tasks.map((t) => (
          <div key={t._id} className={`item ${t.status === 'completed' ? 'done' : ''}`}>
            <div className="left">
              <input
                type="checkbox"
                checked={t.status === 'completed'}
                onChange={() => toggleTask(t._id)}
              />
              {editingId === t._id ? (
                <div className="edit-block">
                  <input
                    className="edit-input"
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Title"
                  />
                  <input
                    className="edit-input"
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Description"
                  />
                </div>
              ) : (
                <div>
                  <div className="title">{t.title}</div>
                  {t.description ? <div className="desc">{t.description}</div> : null}
                </div>
              )}
            </div>
            <div className="meta">
              <span className={`badge ${t.status}`}>{t.status}</span>
              <span className="date">{new Date(t.created_at).toLocaleString()}</span>
              {editingId === t._id ? (
                <div className="actions">
                  <button type="button" className="btn primary" onClick={saveEdit}>Save</button>
                  <button type="button" className="btn" onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div className="actions">
                  <button type="button" className="btn" onClick={() => startEdit(t)}>Edit</button>
                  <button type="button" className="btn danger" onClick={() => deleteTask(t._id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
