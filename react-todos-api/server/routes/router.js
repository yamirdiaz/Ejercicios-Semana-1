import express from 'express'
import { getTodosByUser, getAuthByUser, registerUser } from '../controllers/getTodosByUser.js'
import { deleteTodoById, addTodo, updateTodo } from '../controllers/todosById.js'
import authenticateToken from '../midllewares/authenticateToken.js'


export const router = express.Router()

router.get('/todos', authenticateToken, getTodosByUser)

router.get('/user', getAuthByUser)

router.post('/register', registerUser )

router.post('/todos', addTodo)

router.patch('/todos', updateTodo)

router.delete('/todos', deleteTodoById)