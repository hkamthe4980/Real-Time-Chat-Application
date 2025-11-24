'use client';

import { useState } from 'react';
import GetDataApi from './GetDataApi';

export default function ToDoApp() {
    const [todos, setTodos] = useState([]);
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            const newTodo = {
                id: Date.now(),
                text: text.trim(),
                completed: false
            };
            setTodos([...todos, newTodo]);
            setText('');
        }
    };

    const handleDelete = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const totalTasks = todos.length;
    const completedTasks = todos.filter(todo => todo.completed).length;

    return (

        <div className="w-full mx-auto bg-white rounded-lg shadow-md p-6 flex  h-100">
            <div className="h-20 w-full mb-20">   <GetDataApi  />
            </div>
            <div className="h-20 w-full mb-20">
                <h1 className="text-2xl font-bold text-center mb-2 text-gray-800 h-20 mb-2">Todo App</h1>
                <p className="text-center text-gray-500 mb-6">
                    {totalTasks} {totalTasks === 1 ? 'task' : 'tasks'} total
                </p>

                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Add a new todo..."
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-md  cursor-pointer whitespace-nowrap"
                        >
                            Add Task
                        </button>
                    </div>
                </form>

                {totalTasks > 0 ? (
                    <ul className="space-y-2 overflow-y-auto max-h-40">
                        {todos.map((todo) => (

                            <li key={todo.id} className="group flex items-center justify-between ml-2 mr-9 mt-5 p-1">
                                <span>{todo.text}</span>
                                <button className='bg-red-600 text-white p-1 cursor-pointer rounded-lg pl-4 pr-4' onClick={()=>handleDelete(todo.id)}>Delete</button>
                            </li>



                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
                )}
            </div>

        </div>

    );
}
