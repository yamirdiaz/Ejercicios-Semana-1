import mongoose from "mongoose";

const recoverySchema = new mongoose.Schema({
            token: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: true,
                unique: true
            },
            
})

export default mongoose.model('recoveryTokens', recoverySchema)