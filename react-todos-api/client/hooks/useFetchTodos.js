import { useState, useEffect } from "react";
import axios from 'axios'

export function useFetchTodos(username) {
    const [ todos, setTodos ] = useState([])

    useEffect(() => {
        async function getTodosByUser() {

            if(username) {
                try {
                const response = await axios(`http://localhost:4000/api/todos?username=${username}`)
                setTodos(response.data.todos)
        
                } catch(err) {
                console.error("Error Fetching Todos: " + err)
                }
            }    
        }
        getTodosByUser()
        }, []) 
        return todos
}