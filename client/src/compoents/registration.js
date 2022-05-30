import React, { useState } from 'react'
import { UserAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Registration() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const { createUser } = UserAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      
      await createUser(email, password).then((res)=>{
        if (res.user) {
        axios.post('/userTest', {
          UID: res.user.uid,
          Email: res.user.email
        })
        .then(function (response) {
          console.log(response);
        })
      }
      }).then(()=>{
        navigate('/profile')
      })

      
    }catch (e) {
      console.log("Reg Failed", e.message)
    }

  }


  return (
    <div>
            <form id="form" onSubmit={handleSubmit}>
                <h1>Registration Page</h1>

                <label for="username_field"> Username: </label>
                <input onChange={(e)=>setEmail(e.target.value)} type="text" id="username_field" name ="username"/>

                <label for="password_field"> Password: </label>
                <input onChange={(e)=>setPassword(e.target.value)} type="text" id="password_field" name ="password"/>

                <input type="submit" value="Login"/>

            </form>
            <button>Logout</button>



        </div>
  )
}
