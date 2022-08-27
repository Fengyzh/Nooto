import React from 'react'

export default function ProfileCard({currentUser, value}) {
  return (
    <div className='profile-Nooto-container'> 
                        
    <h2>{currentUser && currentUser.uid === value.owner? 'Owner' : "Share" }</h2>

    <a className='profile-Nooto-block' href={`/doc/${value._id}`}>
        <div>
            <h3>{value.title}</h3>
        </div>
        
        </a> 


</div>
  )
}
