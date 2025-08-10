import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const generateToken = (user) => {
    return jwt.sign(user, process.env.VITE_ACCESS_TOKEN_SECRET)
}

export const generateRefreshToken = (user) => {
    return jwt.sign(user, process.env.VITE_REFRESH_TOKEN_SECRET)
}