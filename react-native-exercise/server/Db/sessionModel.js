import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
            token: {
                type: String,
                require: true
            },
            email: {
                type: String,
                require: true,
                unique: true
            },
            refreshToken:{
                type: String,
                required: true
            }
})

export default mongoose.model('sessions', sessionSchema)