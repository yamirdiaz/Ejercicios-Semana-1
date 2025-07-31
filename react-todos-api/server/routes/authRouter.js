import express from 'express'
import { getAuthByUser, getRefreshToken } from '../controllers/authUser.js'
import authenticateToken from '../midllewares/authenticateToken.js'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()


export const authRouter = express.Router()

authRouter.post('/', getAuthByUser)

authRouter.post('/token', getRefreshToken)