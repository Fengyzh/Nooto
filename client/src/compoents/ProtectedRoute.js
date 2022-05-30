import React, { useState, useEffect } from 'react'
import { UserAuth } from '../AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({children}) => {
    const {currentUser, state} = UserAuth()
/*    const [loading, setLoading] = useState()

    useEffect(() => {
      if (currentUser) {
          setLoading(false)
      } else {
          setLoading(true)
      }
    }, [loading])
    */

    console.log(currentUser)

    if (state.userDataPresent) {
        if (state.curuser != null) {
        return children
        } else {
            return <Navigate to='/login'/>
        }
    }
    return <h1>Loading</h1>
    
  
}

export default ProtectedRoute
