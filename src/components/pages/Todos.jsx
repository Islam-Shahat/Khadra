import { useState } from 'react'
import './Todos.css'

export default function Todos() {
    const [todos, setTodos] = useState([
        { id: 1, title: 'Study React', done: false },
        { id: 2, title: 'Practice JSX', done: false },
        { id: 3, title: 'Learn CSS', done: false },
        { id: 4, title: 'Build a small project', done: false },
        { id: 5, title: 'Review the lesson', done: false },
        { id: 6, title: 'Take a break', done: false },
    ])
    const [newTodo, setNewTodo] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editText, setEditText] = useState('')

    function addTodo(event) {
        event.preventDefault()

        if (newTodo.trim() === '') return

        setTodos([...todos, {
            id: Date.now(),
            title: newTodo.trim(),
            done: false,
        }])
        setNewTodo('')
    }

    function toggleTodo(id) {
        setTodos(todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, done: !todo.done }
            }
            return todo
        }))
    }

    function deleteTodo(id) {
        setTodos(todos.filter((todo) => todo.id !== id))
        setEditingId(null)
    }

    function startEditing(todo) {
        setEditingId(todo.id)
        setEditText(todo.title)
    }

    function saveTodo(id, event) {
        event.preventDefault()

        if (editText.trim() === '') return

        setTodos(todos.map((todo) => {
            if (todo.id === id) {
                return { ...todo, title: editText.trim() }
            }
            return todo
        }))
        setEditingId(null)
        setEditText('')
    }

    return (
        <main className="todo-page">
            <h1>My Todo List</h1>

            <form className="todo-add-form" onSubmit={addTodo}>
                <input
                    type="text"
                    placeholder="Write a new task"
                    value={newTodo}
                    onChange={(event) => setNewTodo(event.target.value)}
                />
                <button type="submit">Add</button>
            </form>

            <div className="todo-cards">
                {todos.map((todo) => (
                    <div className={`todo-card ${todo.done ? 'todo-done' : ''}`} key={todo.id}>
                        {editingId === todo.id ? (
                            <form className="todo-edit-form" onSubmit={(event) => saveTodo(todo.id, event)}>
                                <input
                                    type="text"
                                    value={editText}
                                    onChange={(event) => setEditText(event.target.value)}
                                    autoFocus
                                />
                                <button type="submit">Save</button>
                                <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
                            </form>
                        ) : (
                            <>
                                <input
                                    type="checkbox"
                                    checked={todo.done}
                                    onChange={() => toggleTodo(todo.id)}
                                />
                                <span className="todo-title">{todo.title}</span>
                                <button type="button" onClick={() => startEditing(todo)}>Edit</button>
                                <button type="button" onClick={() => deleteTodo(todo.id)}>Delete</button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </main>
    )
}
