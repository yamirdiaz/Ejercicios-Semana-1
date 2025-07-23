import { MongoClient } from "mongodb"
import { uriDb } from "../db/db.js"

export const getTodosByUser = async (req, res) => {
    const { username } = req.query
    
    const clientDb = new MongoClient(uriDb)
    try{
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('todos')
        const todos = await db.find({username: username}).toArray()
        
        res.json({todos})

    } catch(err) {
        res.json({response: "Unable to connect to Database", message: `Erro: ${err}`})
    } finally{
        await clientDb.close()
    }
}

export const getAuthByUser = async (req, res) => {
    let {username, password} = req.query

    const clientDb = new MongoClient(uriDb)
    try{
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('users')
        const user = await db.find({username: username, password: password}).toArray()
        const isVerify = user.length ? true : false 
        
        res.json({isVerify})

    } catch(err) {
        res.json({response: "Unable to connect to Database", message: `Erro: ${err}`})
    } finally{
        await clientDb.close()
    }
}
