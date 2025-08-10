import express, { response } from 'express'
import { loginUser, registerUser, sendRecoveryPass } from '../controllers/loginSessionHandler.js'

const authRouter = express.Router()

authRouter.post('/registration', registerUser )

authRouter.post( '/login', loginUser )

authRouter.get('/recovery', sendRecoveryPass )

// authRouter.get('/recoveryPage', )


export default authRouter