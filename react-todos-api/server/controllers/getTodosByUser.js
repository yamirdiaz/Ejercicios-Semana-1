import { MongoClient } from "mongodb"
import { uriDb } from "../db/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()

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
        const[ user] = await db.find({username: username}).toArray()
        console.log(user)
        const isVerify = user && await bcrypt.compare(password ,user.password) ? true : false 
        
        if(isVerify) {
            const userAuthJwt = { name: user.username }
            const accessToken = jwt.sign(userAuthJwt, process.env.VITE_ACCESS_TOKEN_SECRET)
            res.status(202).send({isVerify, accessToken})
        } else {

            res.status(403).send({isVerify})
        }

    } catch(err) {
        res.json({response: "Unable to connect to Database", message: `Erro: ${err}`})
    } finally{
        await clientDb.close()
    }
}

export const registerUser = async (req, res) => {
    
    const { username, password } = req.query
    const clientDb = new MongoClient(uriDb)
    try{
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('users')
        const user = await db.find({username: username}).toArray()
        
        if(!user.length) {
            // const salt = await bcrypt.genSalt()
            const hashedPassword = await bcrypt.hash(password , 10)
            
            const response = await db.insertOne({
                                username,
                                password: hashedPassword
                            })
            res.status(201).send({isVerify: false})
            return

        }
        res.status(400).send({isVerify: true})

    } catch(error) {
        console.error("Something went wrong with the register user: " + error)
        res.status(500).send({message: "Registation was not succeesful"})
    } finally {
        await clientDb.close()
    }
}
