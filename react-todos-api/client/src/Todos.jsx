import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { useFetchTodos } from '../hooks/useFetchTodos';

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState('')
  const [priority, setPriority] = useState(10)
  const username = useLocation().state?.username || null

  useEffect( () => {
    const getTodos = async() =>{
      if(username) {
        try {
          const response = await axios(`http://localhost:4000/api/todos?username=${username}`)
          setTodos([...response.data.todos])
  
        } catch(err) {
          console.error("Error Fetching Todos: " + err)
        }
      }      
    }
    getTodos()
  }, [])

  const addTodo = async(e) => {
    const { todoInput, priorityInput} = Object.fromEntries(e)
    
    try {
      const response = await axios.post(`http://localhost:4000/api/todos?username=${username}&todo=${todoInput}&priority=${priorityInput}`)
      const data = response.data.response.insertedId
      console.log(data)
      console.log(todos)
      setTodos(prev => [...prev, {
            _id: data,
            username: username,
            priority: priorityInput,
            todo: todoInput,
            is_pending: true
        }])
      
    } catch(err) {
      console.error("Error adding new Todo" + err )
    }
  }

  const deleteTodo = async(id) => {
    
    setTodos(todos.filter(todo => todo._id !== id));
    const response = await axios.delete(`http://localhost:4000/api/todos?id=${id}`)
  };

  const updateTodo = async(e) => {
    const form = Object.fromEntries(e)
    console.log(todoUpdate)
    // console.log(todoModify)
  }

  if( username ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-gray-800 text-center mb-8">
        <div className="max-w-3xl mx-auto ">
          <h1 className="text-4xl font-bold mb-2 text-blue-800">Welcome back {username}!</h1>
          <h2 className="text-xl mb-6 text-blue-700">Here is your To Do List</h2>

          <form action={addTodo} className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap justify-center gap-4 items-center ">
            <input
              type="text"
              placeholder="Todo name..."
              value={todoName}
              name='todoInput'
              onChange={(e) => setTodoName(e.target.value)}
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <input
              type="number"
              min="1"
              max="10"
              value={priority}
              name='priorityInput'
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-20 px-2 py-2 border rounded-lg"
            />
            <button            
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex-grow sm:flex-none"
            >
              Add
            </button>
          </form>


          <ul className="space-y-4">
            {todos.map(({_id:id, username, priority, is_pending:isPending, todo}) => (
              <li
                key={id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
              >
                <form action={updateTodo} className='text-left'>
                  <input 
                    className="text-lg font-semibold"
                    type='text'
                    name='todoUpdate'
                    defaultValue={todo}
                    disabled={true}
                    />
                  {/* <p className="text-sm text-gray-600">Priority: {priority}/10</p> */}
                  <button                  
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    Update
                  </button>
                </form>
                <button
                  onClick={() => deleteTodo(id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        
      </div>

  );
  } else {
    return (<div className="h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 flex flex-col justify-center items-center">
      <h1 className="font-bolder text-3xl text-red-700 m-0 text-center">Your are not an Authorized User</h1>
      <Link className='font-bold text-md text-blue-500 my-4 hover:text-blue-200' to='/'>Please visit our login page.</Link>
    </div>)
  }

  
};

export default Todos;