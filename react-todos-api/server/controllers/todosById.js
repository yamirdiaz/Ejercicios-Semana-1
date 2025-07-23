import { MongoClient, ObjectId } from "mongodb"
import { uriDb } from "../db/db.js"

export const deleteTodoById = async(req, res) => {
    const { id } = req.query
    
    const clientDb = new MongoClient(uriDb)

    try {
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('todos')
        const response = await db.deleteOne({ _id: new ObjectId(id) })
        
        res.status(200).json({response})
    } catch(err) {
        res.status(400).json({ 
            response: "Error on Deleting todo by Id",
            message: `Error: ${err}`,
            isSuccessful: false})
    } finally {
        await clientDb.close()
    }
}

export const addTodo = async(req, res) => {
    const { username, todo, priority } = req.query

    const clientDb = new MongoClient(uriDb)
    try {
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('todos')
        const response = await db.insertOne({
            username: username,
            priority: priority,
            todo: todo,
            is_pending: true
        })
        
        res.status(200).json({response: response})

    } catch(err) {
        res.status(400).json({
            response: "Database failed to Add the new Todo.",
            message: `Error: ${err}`,
            isSuccessful: false} )
    } finally{
        await clientDb.close()
    }
}

export const updateTodo = async (req, res) => {
    const { id, todo } = req.query
    
    let response = ''
    const clientDb = new MongoClient(uriDb)

    try {
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('todos')
        if(todo) {
            response += await db.updateOne({ _id: new ObjectId(id) }, {$set: {todo: todo}})
        }

        
        console.log(response)
        res.status(200).json({response})
    } catch(err) {
        res.status(400).json({ 
            response: "Error on Deleting todo by Id",
            message: `Error: ${err}`,
            isSuccessful: false})
    } finally {
        await clientDb.close()
    }
}