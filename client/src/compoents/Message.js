import React, { useRef, useEffect } from 'react'
import '../compoentStyles/Message.css'

export default function Message({props}) {
    const {pos, margin, msg} = props

    const msgBox = useRef()

    useEffect(() => {
      msgBox.current.style.marginTop = margin + "rem"
    
    }, [])
    



  return (
    <div ref={msgBox} className={`msg-container ${pos}`}>{msg}</div>
  )
}
