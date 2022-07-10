import React, { useState } from 'react'
import { UserAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { updateProfile } from 'firebase/auth'
import { Navigate } from 'react-router-dom'
import "../compoentStyles/Registration.css"


export default function Registration() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [alart, setAlert] = useState("")
  const [valid, setValid] = useState(false)

  const { createUser, state } = UserAuth()
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!valid) {
      return
    }

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
      setAlert("Something went wrong, please try again")
    }

  }

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const handleEmail = (e) =>{
      setEmail(e.target.value)
      if (validateEmail(e.target.value)) {
        setAlert("")
        setValid(true)
      } else{
        setAlert("Invalid Email")
        setValid(false)
      }
  }

  const handlePassword = (e) => {
    setPassword(e.target.value)
    if (e.target.value.length < 8) {
      setAlert("Password must be 8 or more digits long")
      setValid(false)
    } else{
      setAlert("")
      setValid(true)
    }

  }

  const regPage = (
    
    <div className='form-container'>
          <h1 className="reg-background-title">Registration</h1>

            <form className="reg-form" onSubmit={handleSubmit}>
                <h1 className="reg-title">Create An Account</h1>
                <h5 className='alert-text'>{alart}</h5>

                <label className='form-label' for="name_field"> Account Name: </label>
                <input className='input-fields' required onChange={(e)=>setName(e.target.value)}  type="text" id="name_field" name="name"/>

                <label className='form-label' for="username_field"> Email: </label>
                <input className='input-fields' required onChange={(e)=>handleEmail(e)} type="text" id="username_field" name ="username"/>

                <label className='form-label' for="password_field"> Password: </label>
                <input className='input-fields' required onChange={(e)=>handlePassword(e)} type="password" id="password_field" name ="password"/>

                <input className='reg-btn' type="submit" value="Registra Account"/>

            </form>
            <a className="login-btn" href='/login'> Go to Login</a>



        </div>
  )


  if (state.userDataPresent) {
    if (state.curuser != null) {

        return <Navigate to='/'/>
    } else {
        return regPage
    }
}




 return <h1> Loading </h1>



}
