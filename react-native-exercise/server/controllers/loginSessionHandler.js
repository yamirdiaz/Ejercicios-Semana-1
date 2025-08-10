import mongoose, { connect } from "mongoose"
import dotenv from 'dotenv'
import UserModel from "../Db/userModel.js"
import sessionModel from "../Db/sessionModel.js"
import recoverTokenModel from "../Db/recoverTokenModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import getUserByEmail from "../utils/getUserByEmail.js"
import { generateRefreshToken, generateToken } from "../utils/handleTokenJwt.js"
import nodemailer from 'nodemailer'
import { response } from "express"
dotenv.config()

export async function registerUser(req, res) {    
    const { username, email, password } = req.body
    

    try{           
        const User = UserModel

        await mongoose.connect(process.env.MONGODB_URI)

        const user = await getUserByEmail(req, res, User)
        
        if(!user) {
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = new User({
                username,
                email,
                password: hashedPassword
            })
            const result = await newUser.save()
            res.status(202).json({response: `User ${username} registered succesfully!`})
            return
        }
        
        res.status(400).json({response: `User ${email} already exist!`,
            data: user.email})

    } catch(error) {
        console.error("Error trying to add User to the Db: ", error)
        res.status(500).json({response:"Something went wrong adding user to the DB."})
    } finally {
        await mongoose.disconnect()  
    }

    console.log("Trying to get regisration complete")
    
    // res.json({response: "User registered succesfully!"})

}

export async function loginUser(req, res) {    
    const { email, password } = req.body
    

    try{           
        const User = UserModel
        const Session = sessionModel

        await mongoose.connect(process.env.MONGODB_URI)

        const user = await getUserByEmail(req, res, User)
        
        if(user) {
            const isPasswordValid = await bcrypt.compare(password, user.password)
            
            if(isPasswordValid){
                const userAuthJwt = { email: user.email}
                const accessToken = generateToken(userAuthJwt)
                const refreshToken = generateRefreshToken(userAuthJwt)
                const session = new Session({
                    email: user.email,
                    token: accessToken,
                    refreshToken: refreshToken
                })

                await session.save(session)

                res.status(202).json({response: `User ${email} has logged in succesfully!`, data:{
                    user,
                    session:{
                        token: accessToken, 
                        refreshToken
                    }
                }})
                return
            } else {
                res.status(400).json({response: `User ${email} types the password wrong!`,
            data: user.email})
                return
            }
        }
        
        res.status(400).json({response: `User ${email} types the email wrong!`,
            data: user})

    } catch(error) {
        console.error("Error trying to add User to the Db: ", error)
        res.status(500).json({response:"Something went wrong adding user to the DB."})
    } finally {
        await mongoose.disconnect()  
    }

    console.log("Trying to get regisration complete")
    
    

}

export const sendRecoveryPass = async( req, res ) => {
    const { email } = req.body
    try{
        const RecoveryToken = recoverTokenModel
        const User = UserModel
        await mongoose.connect(process.env.MONGODB_URI)

        const user = await getUserByEmail( req, res, User )
        
        if(user) {
            const userAuth = { email: user.email }
            const recoveryToken = generateToken(userAuth)
            
            const hasUserToken = await RecoveryToken.find({email: user.email}).then(async(userWithToken) => {
                if(userWithToken.length) {
                    console.log("Updating RecoveryToken document")
                    return await RecoveryToken.findOneAndUpdate(userAuth, { token: recoveryToken},
                    { new: true } 
                    )
                    
                } else {
                    console.log("Creating a new RecoveryToken document")
                    const recoveryDocument = new RecoveryToken({
                    email: user.email,
                    token: recoveryToken
                    })
                    return await RecoveryToken.create(recoveryDocument)
                    
                }
            })
            console.log(hasUserToken)
            let transporter = nodemailer.createTransport({
                service: 'gmail', // Use 'gmail' for a common provider
                auth: {
                    user: 'yamir7diaz@gmail.com', // Your Gmail address
                    pass: 'ocnz gpya zsjd ogdg'     // Your generated app password
                }
            });

            // 2. Define the email options
            let mailOptions = {
                from: 'yamir7diaz@gmail.com',      // Sender address
                to: '15-03-0098@ipl.edu.do', // Recipient address
                subject: 'Recovery Password code',
                text: 'This is a test email sent from a Node.js server using Nodemailer!',
                html: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Forgot it</title>
        </head>
        <body style="background-color: #f8fafc; font-family: 'Inter', sans-serif; margin: 0; padding: 1rem;">
            <!-- Main container with max-width for readability on larger screens -->
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); overflow: hidden;">
                <!-- Header Section -->
                <div style="background-color: #2563eb; padding: 2rem; text-align: center;">
                    <h1 style="font-size: 1.875rem; font-weight: 700; color: #ffffff; margin: 0;">Password Forgot it</h1>
                </div>

                <!-- Email Body Content -->
                <div style="padding: 1.5rem;">
                    <p style="color: #4b5563; font-size: 1.125rem; margin-bottom: 1rem;">
                        Hello there,
                    </p>
                    <p style="color: #4b5563; line-height: 1.625; margin-bottom: 1.5rem;">
                        We received a request to send you a verification code because you forgot your password, please use the verification code below in your app to continue:.
                    </p>

                    
                    <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;">
                        <p  style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-weight: 700; padding: 0.75rem 1.5rem; border-radius: 8px; font-size: 1.125rem; text-decoration: none; transition-property: background-color; transition-duration: 200ms; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);">
                            ${recoveryToken}
                        </p>
                    </div>

                    <p style="color: #6b7280; line-height: 1.625; margin-bottom: 1.5rem;">
                        This verification code is only valid for the next <b style="font-weight: 700;">5 minutes</b>. If the code expires, you will need to make a new password reset request.
                    </p>

                    <p style="color: #6b7280; line-height: 1.625; margin: 0;">
                        If you did not request a password reset, you can safely ignore this email. Your password will not be changed.
                    </p>
                </div>

                <!-- Footer Section -->
                <div style="background-color: #f3f4f6; padding: 1.5rem; text-align: center; font-size: 0.875rem; color: #6b7280;">
                    <p style="margin: 0;">&copy; 2025 Shellcatch, Inc. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`
            };

            // 3. Send the email
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error);
                    res.json({response:"Email was not send!"})
                    return
                }
                console.log('Message sent: %s', info.messageId);
                // Preview URL for a test email (if you used a service like Ethereal)
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });

            res.json({ response:"Email send it succesfully!",
                    isRecoverySend: true
            })
            return 
                } else{
                    res.json({ response:"Email was not send: User is not register in database!",
                    isRecoverySend: false
                    })
                    return
                }



    } catch(error){
        console.error("Error on verification of the email to send recovery token", error)
        res.status(404).json({response: "Email was not found on the database"})
    } finally {
        await mongoose.disconnect()
    }
    
}