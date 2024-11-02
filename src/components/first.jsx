import React, { useState, useEffect } from 'react';

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');

  // Fetch todos from the JSON server
  useEffect(() => {
    const fetchTodos = async () => {
      const response = await fetch('http://localhost:3000/posts');
      const data = await response.json();
      setTodos(data);
    };

    fetchTodos();
  }, []);

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo) return;

    const response = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: newTodo }),
    });

    const addedTodo = await response.json();
    setTodos([...todos, addedTodo]);
    setNewTodo('');
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/posts/${id}`, {
      method: 'DELETE',
    });

    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditingTodo(todo);
    setEditingText(todo.title);
  };

  // Save the edited todo
  const saveEdit = async () => {
    if (!editingText) return;

    const response = await fetch(`http://localhost:3000/posts/${editingTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...editingTodo, title: editingText }),
    });

    const updatedTodo = await response.json();
    setTodos(todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo)));
    setEditingTodo(null);
    setEditingText('');
  };

  return (
    <div>
      <h1>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>

      {editingTodo && (
        <div>
          <input
            type="text"
            value={editingText}
            onChange={(e) => setEditingText(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditingTodo(null)}>Cancel</button>
        </div>
      )}

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            {todo.title}
            <button onClick={() => startEditing(todo)}>Edit</button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
