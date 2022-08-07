import React, { useContext, useEffect, useState, useRef } from 'react'
import { createContext } from 'react';

const BoardContext = createContext();



export const EditorContext = ({children}) => {

    let currentState = useRef(0);


    const [state, setstate] = useState({
        Id: "",
        title:"Test Document 2" ,
        lastModified: "Unavailable",
        createdDate: "Unavailable",
        values: [{
            title: "New Section",
            value: [{
                text: "good",
            },
            {
                text: "bye",
            }
                    ],

        }, 

    // Next Section

    {
        title: "New Section",
        value: [{
            text: "good2",
        },
        {
            text: "bye2",
        }
                ],

    }

]})



    useEffect(()=>{
        

    },[])



  return (
    <BoardContext.Provider value={{state, setstate}}>
        {children}
    </BoardContext.Provider>
  )
}

export const BoardEditingContext = () => {
    return useContext(BoardContext)
}
