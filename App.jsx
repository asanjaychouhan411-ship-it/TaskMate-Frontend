import { useState } from 'react'
import './App.css'

const initialTasks = [
  { id: 1, title: 'Complete OS Assignment', subject: 'Operating Systems', due: '2026-10-18', status: 'Pending', description: 'Complete the operating system security questions and revise the notes.' },
  { id: 2, title: 'Statistics Practice', subject: 'Statistics', due: '2026-10-20', status: 'Pending', description: 'Solve important statistics questions and practice examples.' },
  { id: 3, title: 'React Learning', subject: 'Web Development', due: '2026-10-16', status: 'Completed', description: 'Learn React components, props, and state.' },
]

function App() {
  const [page, setPage] = useState('home')
  const [tasks, setTasks] = useState(initialTasks)
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', subject: '', due: '', description: '' })

  const pending = tasks.filter(task => task.status === 'Pending').length
  const completed = tasks.filter(task => task.status === 'Completed').length

  function openTask(task) {
    setSelected(task)
    setPage('details')
  }

  function saveTask(e) {
    e.preventDefault()
    const newTask = {
      ...form,
      id: Date.now(),
      status: 'Pending',
      subject: form.subject || 'General',
      description: form.description || 'No description added.'
    }
    setTasks([newTask, ...tasks])
    setForm({ title: '', subject: '', due: '', description: '' })
    setShowForm(false)
    setPage('dashboard')
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status: task.status === 'Pending' ? 'Completed' : 'Pending' }
        : task
    ))
    if (selected?.id === id) {
      setSelected({
        ...selected,
        status: selected.status === 'Pending' ? 'Completed' : 'Pending'
      })
    }
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
    setSelected(null)
    setPage('dashboard')
  }

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand" onClick={() => setPage('home')}>
          <span className="brand-icon">T</span> TaskMate
        </button>
        <nav>
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('home')}>Home</button>
          <button className={page === 'dashboard' || page === 'details' ? 'nav-link active' : 'nav-link'} onClick={() => setPage('dashboard')}>Dashboard</button>
          <button className="nav-cta" onClick={() => { setPage('dashboard'); setShowForm(true) }}>+ Add Task</button>
        </nav>
      </header>

      <main>
        {page === 'home' && (
          <section className="hero">
            <div className="hero-content">
              <span className="eyebrow">YOUR STUDY LIFE, ORGANIZED</span>
              <h1>Make time for what <span>matters.</span></h1>
              <p>Manage assignments, keep track of deadlines, and make every study session count with TaskMate.</p>
              <button className="primary-btn" onClick={() => setPage('dashboard')}>Explore Dashboard →</button>
              <div className="hero-note">✓ Simple planning &nbsp; ✓ Track your progress</div>
            </div>
            <div className="hero-card">
              <div className="card-top"><span>YOUR PROGRESS</span><span className="live-dot">● Today</span></div>
              <h2>{completed} of {tasks.length} tasks completed</h2>
              <div className="progress-track"><div className="progress-fill" style={{ width: `${tasks.length ? completed / tasks.length * 100 : 0}%` }} /></div>
              <div className="mini-stats">
                <div><strong>{pending}</strong><span>Pending</span></div>
                <div><strong>{completed}</strong><span>Completed</span></div>
              </div>
              <div className="today-task"><span className="task-check">✓</span><div><strong>Keep moving forward</strong><small>Small steps make progress.</small></div></div>
            </div>
          </section>
        )}

        {page === 'dashboard' && (
          <section className="dashboard">
            <div className="page-heading">
              <div><span className="eyebrow">YOUR WORKSPACE</span><h1>My Dashboard</h1><p>One step at a time. You've got this!</p></div>
              <button className="primary-btn" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ New Task'}</button>
            </div>

            <div className="stats-grid">
              <div className="stat-card"><span className="stat-icon purple">▤</span><p>Total tasks</p><h2>{tasks.length}</h2></div>
              <div className="stat-card"><span className="stat-icon orange">◷</span><p>Pending</p><h2>{pending}</h2></div>
              <div className="stat-card"><span className="stat-icon green">✓</span><p>Completed</p><h2>{completed}</h2></div>
            </div>

            {showForm && (
              <form className="task-form" onSubmit={saveTask}>
                <h2>Create a new task</h2>
                <label>Task title<input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Complete assignment" /></label>
                <label>Subject<input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Computer Science" /></label>
                <label>Due date<input required type="date" value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} /></label>
                <label>Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="What do you need to do?" /></label>
                <button className="primary-btn" type="submit">Save Task</button>
              </form>
            )}

            <div className="section-heading"><div><h2>My assignments</h2><p>Click a task to see its details.</p></div><span className="task-count">{tasks.length} tasks</span></div>
            <div className="task-list">
              {tasks.map(task => (
                <div className="task-row" key={task.id}>
                  <button className={task.status === 'Completed' ? 'round-check checked' : 'round-check'} onClick={() => toggleTask(task.id)} aria-label="Toggle task status">{task.status === 'Completed' ? '✓' : ''}</button>
                  <button className="task-info" onClick={() => openTask(task)}><strong>{task.title}</strong><span>{task.subject} · Due {task.due || 'Not set'}</span></button>
                  <span className={task.status === 'Completed' ? 'status completed' : 'status pending'}>{task.status}</span>
                  <button className="detail-arrow" onClick={() => openTask(task)} aria-label="View details">→</button>
                </div>
              ))}
              {tasks.length === 0 && <p className="empty-state">No tasks yet. Create your first task!</p>}
            </div>
          </section>
        )}

        {page === 'details' && selected && (
          <section className="details-page">
            <button className="back-btn" onClick={() => setPage('dashboard')}>← Back to Dashboard</button>
            <div className="detail-card">
              <span className="eyebrow">TASK DETAILS</span>
              <h1>{selected.title}</h1>
              <span className={selected.status === 'Completed' ? 'status completed' : 'status pending'}>{selected.status}</span>
              <div className="detail-meta"><div><span>SUBJECT</span><strong>{selected.subject}</strong></div><div><span>DUE DATE</span><strong>{selected.due || 'Not set'}</strong></div></div>
              <h3>Description</h3><p>{selected.description}</p>
              <div className="detail-actions">
                <button className="primary-btn" onClick={() => toggleTask(selected.id)}>{selected.status === 'Pending' ? '✓ Mark Completed' : '↺ Mark Pending'}</button>
                <button className="delete-btn" onClick={() => deleteTask(selected.id)}>Delete Task</button>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer>© 2026 TaskMate · Plan better, learn better.</footer>
    </div>
  )
}

export default App