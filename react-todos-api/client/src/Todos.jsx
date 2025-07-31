import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import './App.css';
import axios from 'axios';
import { useFetchTodos } from '../hooks/useFetchTodos';

const Todos = () => {
  const { isUserAuth, username, token, setToken, setIsUserAuth, setUsername } = useContext(UserContext)
  const [todos, setTodos] = useState([]);
  const [todoName, setTodoName] = useState('')
  const [priority, setPriority] = useState(10)
  const [localToken, setLocalToken ]= useState(localStorage.getItem('token') || null)
  const localUsername = localStorage.getItem('username') || null
  const localRefreshToken = localStorage.getItem('refreshToken')
  

  useEffect( () => {
    const getTodos = async() =>{
      
      if(localToken) {
        try {
          const response = await axios.get(`http://localhost:4000/api/todos?username=${localUsername}`, {
            headers: {authentication: `Bearer ${localToken}`}
          })
          setTodos([...response.data.todos])
          setTodos(prev => prev.map(el => ({
            ...el,
            isEditing: false,
            id: el._id
          })))
  
        } catch(err) {
          localStorage.setItem('token', "")
          setLocalToken(localStorage.getItem('token'))
          console.error("Error Fetching Todos: " + err)
        }

      
    }
    
  }
  getTodos()
}, [localToken] )

useEffect(() => {
  const getRefreshToken = async() => {
      if(!localToken) {
        try {
          const response = await axios.post(`http://localhost:3000/login/token`, {
            token: localRefreshToken
          })
          const { accessToken } = response.data
          if(accessToken) {
            localStorage.setItem('token', accessToken)
            setLocalToken(localStorage.getItem('token'))
          }
        }catch(err) {
          console.error("Error on requesting a new token: " , err)
        }
      }
    }
    getRefreshToken()
    }, [localToken])

  const addTodo = async(e) => {
    const { todoInput, priorityInput} = Object.fromEntries(e)
    
    try {
      const response = await axios.post(`http://localhost:4000/api/todos?username=${username}&todo=${todoInput}&priority=${priorityInput}`, null, {
            headers: {authentication: `Bearer ${localToken}`}
          })
      const data = response.data.response.insertedId
      
      setTodos(prev => [...prev, {
            id: data,
            username: username,
            priority: priorityInput,
            todo: todoInput,
            is_pending: true
        }])
      
    } catch(err) {
      localStorage.setItem('token', "")
      setLocalToken(localStorage.getItem('token'))
      console.error("Error adding new Todo" + err )
    }
  }

  const deleteTodo = async(id) => {
    
    setTodos(todos.filter(todo => todo.id !== id));
    try {
      const response = await axios.delete(`http://localhost:4000/api/todos?id=${id}`)
    } catch(error) {
      localStorage.setItem('token', "")
      setLocalToken(localStorage.getItem('token'))
      console.error("An error deleting a Todo has accurred" + err)
    }
  };

  const handleEnableEdit = (id) => {
    
    setTodos(prev => prev.map(todo => {
      return todo.id === id ? {...todo, isEditing: true} : todo
    }))
  }

  const handledisableEdit = (id) => {
    
    setTodos(prev => prev.map(todo => {
      return todo.id === id ? {...todo, isEditing: false} : todo
    }))
  }

  const handleEditChange = (id, value) => {
    setTodos(prev => prev.map(el => {
      return el.id === id ? {...el, todo: value} : el
    }))
  }

  const updateTodo = async(id) => {
    const { todo } = todos.filter(todo => todo.id === id)[0]
    try {
      const response = await axios.patch(`http://localhost:4000/api/todos?id=${id}&todo=${todo}`)
      

      if(response.ok) {
        handledisableEdit(id)
      }
    } catch(err) {
      localStorage.setItem('token', "")
      setLocalToken(localStorage.getItem('token'))
      console.error("An error updating the Todo has accurred" + err)
    }
  }

  if( localToken ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 text-gray-800 text-center mb-4">
        <div className="max-w-3xl mx-auto ">
          <h1 className="text-4xl font-bold my-8 text-blue-800">Welcome back {localUsername}!</h1>
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
            {todos.map(({id, username, priority, is_pending:isPending, todo, isEditing}) => (
              <li
                key={id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition"
                onDoubleClick={() => handleEnableEdit(id)}
              >
                <div  className='text-left'>
                  {isEditing ? <input 
                    className="text-lg font-semibold hover:cursor-pointer focus:cursor-text" 
                    type='text'
                    name='todoUpdate'
                    defaultValue={todo}
                    onChange={(e) => handleEditChange(id, e.target.value)}
                    /> : <h3 
                    className="text-lg font-semibold hover:cursor-pointer"                    
                    >{todo}</h3>}
                  <p className="text-sm text-gray-600 mb-2">Priority: {priority}/10</p>
                  <button                  
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition hover:cursor-pointer"
                  onClick={() => updateTodo(id)}
                  >
                    Update
                  </button>
                </div>
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