import React, { useContext, useEffect, useState, useRef } from 'react'
import { createContext } from 'react';
import axios from 'axios';


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

const [save, setSave] = useState(false)
const [isCondense, setCondense] = useState(false)




useEffect(() => {
    currentState.current = state
}, [state])




useEffect(() => {
    let interval = setInterval(()=>{
    if (save) {

            setSave(false)
            handleSave()
            //document.getElementsByClassName("save-btn")[0].click();
        }
    }, 5000)

  return () => {
    clearInterval(interval);
  }
}, [save])



const handleSave = () => {
    console.log("saved...")
    console.log(currentState.current)
    
    let date = new Date().toLocaleString()
    

    axios.post('/api/nooto/save', {
        id: currentState.current.Id,
        title: currentState.current.title,
        values: currentState.current.values,
        lastModified: date,
        share: currentState.current.share
     })


}


const handleBlockDelete = (vIndex,index) => {

    /* 
function handleDelete(index) {
    console.log("index: " + index)
    const value = [...state.values]
    console.log(value)
    value.splice(index,1)
    setstate({...state, values: value})
    console.log(state)
    console.log(state.Id)
} */

    let value = [...state.values]
    value[index]["value"].splice(vIndex,1)
    setstate({...state, values: value})

    setSave(true)

}


function handleDelete(index) {
    console.log("index: " + index)
    const value = [...state.values]
    console.log(value)
    value.splice(index,1)
    setstate({...state, values: value})
    console.log(state)
    console.log(state.Id)

    setSave(true)
}


const handleScroll = (index) => {
    // Right now it will only scroll to the first element

     let boxes = document.getElementsByClassName("section-containers");
     console.log(boxes[index].getBoundingClientRect().top)
     //boxes[0].scrollIntoView({ behavior: 'smooth' })
    const y = boxes[index].getBoundingClientRect().top + window.pageYOffset - 30
     window.scrollTo({top:y, left:0, behavior: 'smooth'})
 }


function swapSection(from, to) {
    let tempStateValues = state.values
    let temp = tempStateValues[from]
    tempStateValues[from] = tempStateValues[to]
    tempStateValues[to] = temp
    setstate({...state, values:tempStateValues})

    handleScroll(to)

    setSave(true)
}






  return (
    <BoardContext.Provider value={{isCondense, setCondense ,state, setstate, handleSave, setSave, handleBlockDelete, handleDelete, swapSection, handleScroll}}>
        {children}
    </BoardContext.Provider>
  )
}

export const BoardEditingContext = () => {
    return useContext(BoardContext)
}
