import express, { response } from 'express'
import cors from 'cors'
import authRouter from './routes/authRouter.js'

const PORT = 3000

const app = express()

app.use(express.json())

app.use(cors())

app.use('/auth', authRouter)

app.use(express.static('static'))

app.use('/', (req, res) => {
    res.status(404).json({response: "Page was not found"})
})


app.listen(PORT, () => console.log(`Server Listening on port: ${PORT}`))