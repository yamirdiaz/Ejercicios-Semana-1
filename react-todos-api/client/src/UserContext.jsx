import React, { Children, createContext, useState} from "react";

export const UserContext = createContext()

export const UserProvider = ({ children }) => {
    const [ username, setUsername ] = useState("")
    const [ isUserAuth, setIsUserAuth ] = useState(false)
    const [ token, setToken ] = useState('')

    return(
        <UserContext.Provider value={{username, setUsername, isUserAuth, setIsUserAuth, token, setToken}}>
            {children}
        </UserContext.Provider>
    )
}