import React, { useState } from 'react'
import { UserAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { updateProfile } from 'firebase/auth'

export default function Registration() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const { createUser } = UserAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      
      await createUser(email, password, name).then((res)=>{
        if (res.user) {
          updateProfile(res.user, {
            displayName:name
          })
        
        axios.post('/userTest', {
          UID: res.user.uid,
          Email: res.user.email
        })
        .then(function (response) {
          console.log(response);
        })
      }
      }).then(()=>{
        navigate("/")
      })

      
    }catch (e) {
      console.log("Reg Failed", e.message)
    }

  }


  return (
    <div>
            <form id="form" onSubmit={handleSubmit}>
                <h1>Registration Page</h1>
                <label for="name_field"> Account Name: </label>
                <input required onChange={(e)=>setName(e.target.value)} type="text" id="name_field" name="name"/>

                <label for="username_field"> Email: </label>
                <input required onChange={(e)=>setEmail(e.target.value)} type="text" id="username_field" name ="username"/>

                <label for="password_field"> Password: </label>
                <input required onChange={(e)=>setPassword(e.target.value)} type="text" id="password_field" name ="password"/>

                <input type="submit" value="Registra Account"/>

            </form>
            <a href='/login'>Login</a>



        </div>
  )
}
