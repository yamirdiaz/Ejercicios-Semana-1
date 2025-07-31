import { MongoClient } from "mongodb"
import { uriDb } from "../db/db.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()


export const getAuthByUser = async (req, res) => {
    let {username, password} = req.query

    const clientDb = new MongoClient(uriDb)
    try{
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('users')
        const [ user ] = await db.find({username: username}).toArray()
        
        const isVerify = user && await bcrypt.compare(password ,user.password) ? true : false 
        
        if(isVerify) {
            const userAuthJwt = { name: user.username }
            const accessToken = generateAccessToken(userAuthJwt)
            const refreshToken = jwt.sign(userAuthJwt, process.env.VITE_REFRESH_TOKEN_SECRET)
            await clientDb.db('yamirdiazNew').collection('tokens').insertOne({refreshToken})
            res.status(202).send({isVerify, accessToken, refreshToken})
        } else {

            res.status(403).send({isVerify})
        }

    } catch(err) {
        res.json({response: "Unable to connect to Database", message: `Erro: ${err}`})
    } finally{
        await clientDb.close()
    }
}

export const getRefreshToken = async (req, res) => {
    const refreshToken = req.body.token
    
    if(!refreshToken) return res.sendStatus(401)
    
    const clientDb = new MongoClient(uriDb)
    try {
        await clientDb.connect()
        const db = clientDb.db('yamirdiazNew').collection('tokens')
        const [ token ] = await db.find({refreshToken}).toArray()
        if(token) {
            jwt.verify(refreshToken, process.env.VITE_REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.sendStatus(403)
                const accessToken = generateAccessToken({name: user.name})
                res.json({accessToken})
            })
        }

    }catch(error) {
        res.status(403).send({error})
    }finally {
        await clientDb.close()
    }
    
}

function generateAccessToken(user) {
    return jwt.sign(user, process.env.VITE_ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
}