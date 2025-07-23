import express from 'express'
import { getTodosByUser, getAuthByUser } from '../controllers/getTodosByUser.js'
import { deleteTodoById, addTodo, updateTodo } from '../controllers/todosById.js'


export const router = express.Router()

router.get('/todos', getTodosByUser)

router.get('/user', getAuthByUser)

router.post('/todos', addTodo)

router.patch('/todos', updateTodo)

router.delete('/todos', deleteTodoById)