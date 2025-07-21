import { MongoClient } from "mongodb"
import { uriDb } from "../db/db.js"

export const getTodosByUser = async (req, res) => {
    
    const clientDb = new MongoClient(uriDb)
    try{
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('todos')
        const todos = await db.find({userName: "yamirdiaz"}).toArray()
        res.json({todos})

    } catch(err) {
        res.json({response: "Unable to connect to Database", message: `Erro: ${err}`})
    } finally{
        await clientDb.close()
    }
}