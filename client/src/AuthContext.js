import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from 'firebase/auth';
import { auth } from './firebaseConfig';


const UserContext = createContext();



export const AuthContext = ({children}) => {

    const [currentUser, setCurrentUser] = useState();
    const [state, setState] = useState({
        userDataPresent: false,
        curuser : null
    });


    const createUser = (email, password, name) => {
        return createUserWithEmailAndPassword(auth, email, password)

    }

    const logout = () => {
        return signOut(auth)
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setState({userDataPresent:true, curuser:user})
            setCurrentUser(user)
            console.log(user)
        })
        return () =>{
            unsubscribe()
        }

    },[])



  return (
    <UserContext.Provider value={{createUser, currentUser, logout, login, state}}>
        {children}
    </UserContext.Provider>
  )
}

export const UserAuth = () => {
    return useContext(UserContext)
}
