import mongoose from "mongoose"
import UserModel from "../Db/userModel.js"
import bcrypt from 'bcrypt'


export default async function getUserByEmail(req, res, User) {    
    const { username, email, password } = req.body
    

    try{            

        const user = await User.find({email: email})
            .then(user => {
                if(!user.length) {                    
                    return null
                }
                
                return user[0]
            })
        
        return user

    } catch(error) {
        console.error("Error trying to find User to the Db: ", error)
    } 

}