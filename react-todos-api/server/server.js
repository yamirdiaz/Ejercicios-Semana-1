import express from 'express'
import { router } from './routes/router.js'
import cors from 'cors'

const app = express()
const PORT = 4000



app.use('/api', router)

app.use('/', (req, res) => {
    res.status(404).json({response: "Not page was found"})
})

app.listen(PORT, () => console.log(`Server listening on Port: ${PORT}`))