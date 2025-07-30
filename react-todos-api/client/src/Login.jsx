import { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import axios from 'axios'
import './App.css'

function Login() {
  const { username, setUsername, setIsUserAuth, setToken } = useContext(UserContext)
  const [usernameLogin, setUsernameLogin] = useState(username ? username : '');
  const [password, setPassword] = useState('');
  const [ isUserValidLogin, setIsUserValidLogin ] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {    
    const { usernameInput, passwordInput } = Object.fromEntries(e)
    try{
      const response = await axios(`http://localhost:4000/api/user?username=${usernameInput}&password=${passwordInput}`)
      const {isVerify, accessToken} = response.data
      if(isVerify && accessToken) {
        setIsUserValidLogin(true)
        setUsername(usernameInput)
        setIsUserAuth(true)
        setToken(`${accessToken} 150`)
        navigate('/todos')
      } 
    }catch(err) {
      setIsUserValidLogin(false)
      console.error('Fetch for user did not went well, here is why: ' + err )
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <form action={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign In</h2>
        {!isUserValidLogin && <p className='text-red-500 text-sm mb-8 text-center'>Your username or password is incorrect, please try again.</p>}
        {username && isUserValidLogin && <p className='text-green-500 text-sm mb-8 text-center'>Your registration was successful, please login into your account</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600">Username</label>
          <input
            type="text"
            id="username"
            name='usernameInput'
            value={usernameLogin}
            onChange={(e) => setUsernameLogin(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="johnDoe 465"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            name='passwordInput'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="************"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Sign In
        </button>
      </form>
      <p className='mt-8'>Not Register yet?, please visit our <Link className='text-blue-600 underline font-bold' to='/register'>Register page.</Link></p>
    </div>
  )
}


export default Login
