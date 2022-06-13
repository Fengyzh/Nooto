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
    <div>
        
        <h1>
            Reset Password
        </h1>
        <form id="form" onSubmit={(e) => handleResetPassword(e)}>
            <p>- Enter the new password -</p>
            <label for="rp-password"> New Password: </label>
            <input onChange={(e)=>setNewPassword(e.target.value)} type="text" id="rp-password" name ="password"/>

            <input type="submit" value="Confirm"/>

        </form>
        
        </div>
  )
}
