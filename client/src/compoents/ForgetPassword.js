import React, { useState } from 'react'
import { UserAuth } from '../AuthContext';
import "../compoentStyles/ForgetPassword.css"

export default function () {

    const [email, setEmail] = useState("");
    const { forgetPassword } = UserAuth()
    const [msg, setMsg] = useState("")

    const handleForgetPasswordSubmit = async (e) => {
        e.preventDefault()
        forgetPassword(email).then((res)=>{
            console.log(res)
            document.getElementsByClassName("forget-pass-msg")[0].style.color = "rgb(104, 227, 111)"
            setMsg("An Email has sent for password reset")
        }).catch(err=>{
            console.log(err)
            document.getElementsByClassName("forget-pass-msg")[0].style.color = "red"
            setMsg("Email Not Found")
        })
    }


  return (
    <div className='form-container'>
         <form className='reg-form' id="form" onSubmit={(e) => handleForgetPasswordSubmit(e)}>
            <h3 className='login-title'>- Please enter the email associated with this account -</h3>
            <label className='form-label' for="fp-email"> Email: </label>
            <input className='input-fields' onChange={(e)=>setEmail(e.target.value)} type="text" id="fp-email" name ="email"/>

            <input className='forget-pass-btn forget-pass-link' type="submit" value="Request Password Change"/>

        </form>
        <div className='forget-pass-links-container'>
            <a className='login-btn' href='/login'>Back to Login</a>
        </div>

        <div>
            <h3 className='forget-pass-msg'>{msg}</h3>
        </div>


    </div>
  )
}
