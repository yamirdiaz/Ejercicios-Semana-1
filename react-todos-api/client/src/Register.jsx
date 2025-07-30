import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';
import axios from 'axios'
import './App.css'

function Register() {
  const [usernameRegister, setUsernameRegister] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [ isUserValid, setIsUserValid ] = useState(true)
  const [ isPassValid, setIsPassValid ] = useState(true)
  const {  setUsername } = useContext(UserContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {    
    const { usernameInput, passwordInput1, passwordInput2 } = Object.fromEntries(e)
    if(passwordInput1 != passwordInput2) {
      console.log(passwordInput1, passwordInput2)
      setIsPassValid(false)
      return
    }
    try{
      const response = await axios.post(`http://localhost:4000/api/register?username=${usernameInput}&password=${passwordInput1}`)
      console.log(response)
      const isVerify = response.data?.isVerify
      if(!isVerify) {
        setIsUserValid(true)
        setUsername(usernameInput)
        navigate('/')
        
      }
    }catch(err) {
      
      if(err.response.data.isVerify) {
        setIsUserValid(false)
      } 
      
      console.error('Fetch for user did not went well, here is why: ' + err )
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-300">
      <form action={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
        {!isUserValid && <p className='text-red-500 text-sm mb-8 text-center'>There is already an account with this username, please login.</p>}
        
        {!isPassValid && <p className='text-red-500 text-sm mb-8 text-center'>The passwords do not match, please try again.</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-600"> Choose an Username</label>
          <input
            type="text"
            id="username"
            name='usernameInput'
            value={usernameRegister}
            onChange={(e) => setUsernameRegister(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="johnDoe 465"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-600">Create Password</label>
          <input
            type="password"
            id="password"
            name='passwordInput1'
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="************"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password2" className="block text-sm font-medium text-gray-600">Confirm Password</label>
          <input
            type="password"
            id="password2"
            name='passwordInput2'
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring focus:ring-indigo-300 focus:outline-none"
            placeholder="************"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition duration-200"
        >
          Register
        </button>
      </form>
      <p className='mt-8'>Are you Register?, please visit our <Link className='text-blue-600 underline font-bold' to='/'>Login page.</Link></p>
    </div>
  )
}


export default Register
