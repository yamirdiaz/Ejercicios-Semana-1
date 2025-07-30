import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import Login from './Login.jsx'
import Todos from './Todos.jsx';
import Register from './Register.jsx'
import { UserProvider } from './UserContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/todos' element={<Todos/>} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)
