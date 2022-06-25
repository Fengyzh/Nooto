import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UserAuth } from '../AuthContext'
import { useNavigate } from 'react-router';


function useQuery() {
    const location = useLocation()
    return new URLSearchParams(location.search)
}



export default function ResetPassword() {

    const [newPassword, setNewPassword] = useState("")
    const { resetPassword } = UserAuth()


    const query = useQuery()
    let navigate = useNavigate();


    const handleResetPassword = (e) => {
        e.preventDefault()
        let oobcode = query.get("oobCode")
        resetPassword(oobcode, newPassword).then((res)=>{
            console.log(res)
            navigate("/login")
        })
        .catch((err)=>{
            console.log(err)
        })

    }




  return (
    <div className='form-container'>
        

        <form className='reg-form' id="form" onSubmit={(e) => handleResetPassword(e)}>
        <h1 className='login-title'>
            Reset Password
        </h1>
            
            <label className='form-label' for="rp-password"> New Password: </label>
            <input className='input-fields' onChange={(e)=>setNewPassword(e.target.value)} type="password" id="rp-password" name ="password"/>

            <input className='login-btn' type="submit" value="Confirm"/>

        </form>
        
        </div>
  )
}
