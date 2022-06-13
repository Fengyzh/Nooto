import React, { useState } from 'react'
import { UserAuth } from '../AuthContext';

export default function () {

    const [email, setEmail] = useState("");
    const { forgetPassword } = UserAuth()

    const handleForgetPasswordSubmit = async (e) => {
        e.preventDefault()
        forgetPassword(email).then((res)=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }


  return (
    <div>
         <form id="form" onSubmit={(e) => handleForgetPasswordSubmit(e)}>
            <p>- Please enter the email associated with this account -</p>
            <label for="fp-email"> Email: </label>
            <input onChange={(e)=>setEmail(e.target.value)} type="text" id="fp-email" name ="email"/>

            <input type="submit" value="Confirm"/>

        </form>



    </div>
  )
}
