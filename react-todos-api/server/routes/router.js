import express from 'express'
import { getTodosByUser } from '../controllers/getTodosByUser.js'


export const router = express.Router()

router.get('/yamir', getTodosByUser)