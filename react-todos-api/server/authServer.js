import express from 'express'
import { authRouter } from './routes/authRouter.js'
import cors from 'cors'

const app = express()
const PORT = 3000

app.use(express.json())

app.use(cors())

app.use('/login', authRouter)

app.use('/', (req, res) => {
    res.status(404).json({response: "Not page was found"})
})

app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`))