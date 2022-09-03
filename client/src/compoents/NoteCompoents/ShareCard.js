import React from 'react'

export default function ShareCard({v, cardIndex, handleShareDelete, isCondense}) {
  return (
    <div className='share-card'>
    {isCondense? "" : <h3 className='share-card-del' onClick={() => handleShareDelete(cardIndex)}>X</h3>}
    <h3 className='share-id' style={{color: "white"}}> {v.Name? v.Name.length <= 25? v.Name : v.Name.substring(0,24)+"..." : "Unknown User"}</h3>
    <p className='share-id' style={{color: "white"}}>ID: {v.UID}</p>
    </div>
  )
}
