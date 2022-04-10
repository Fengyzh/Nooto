import './drawing.css';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import axios from 'axios';

export default function Drawing() {

    let {id} = useParams();

    const [panel, setPanel] = useState(false)
    const [right, setRight] = useState(false)

    const [state, setstate] = useState({
        Id: "",
        values: [{
        title: "New Section",
        value: [{
            text: "good",
            editable: true
        },
        {
            text: "bye",
            editable: false
        }
                ],

    }, 

    // Next Section

    {
        title: "New Section",
        value: [{
            text: "good2",
            editable: true
        },
        {
            text: "bye2",
            editable: false
        }
                ],

    }

]})

    function handleAdd() {
        setstate({...state,values:[...state.values, {title: "New Section", value:[{
            text: "good2",
            editable: true
        },
        {
            text: "bye2",
            editable: false
        }
            ], edit: true}]})


    }

    function handleChange(index, e, vIndex) {
        const value = [...state.values]    //Spread the state into individual array elements
        value[index]["value"][vIndex]["text"] = e.target.value  //Set the key named "value" in that index to the input
        setstate({...state,values:value}) //Update the state with the new state
        //console.log(state["values"][index])
        //console.log(state)

        
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";



    }

    function handleTitleChange(index, e) {
        const title = [...state.values]    
        title[index]["title"] = e.target.value  
        setstate({...state, values:title}) 
        //console.log(state[index])
        console.log(state)

        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";

    }

    function handleEdit(index, vIndex) {
        const value = [...state.values]    
        //value[index]["edit"] = !value[index]["edit"]
        value[index]["value"][vIndex]["editable"] = !value[index]["value"][vIndex]["editable"]
        setstate({...state, values:value})



        /*
        let textField = document.getElementsByClassName("textarea")[index];
        let markdownField = document.getElementsByClassName("results")[index];
        console.log("text: ", markdownField)

        if (state.values[index].edit == false){
            textField.style.opacity = 0
            textField.style.display = "none"
            markdownField.style.display = "block"
        } else {
            textField.style.opacity = 1
            textField.style.display = "block"
            markdownField.style.display = "none"
        }
*/
    }

    function handleCloseAll() {
        const value = [...state.values]
        for (var i = 0; i < state.values.length; i++) {
            value[i]["edit"] = false
            setstate({values:value})
        }
    }


    function handleDelete(index) {
        console.log("index: " + index)
        const value = [...state.values]
        console.log(value)
        value.splice(index,1)
        setstate({...state, values: value})
        console.log(state)
        console.log(state.Id)
    }



    const handleSave = () => {
        console.log("saved...")
        console.log(state.Id)
        
        axios.post('/save', {
            id: state.Id,
            values: state.values,
         })
    }


    const retractPanel = () => {
        
        setPanel(!panel)
        let navPanel = document.getElementsByClassName("nav-panel")[0];
        let item = document.getElementsByClassName("section-text");
        let arrow = document.getElementsByClassName("panel-btn")[0];
        let board = document.getElementsByClassName("board")[0];

        if (right) {
            handleRight()
        }

        let boolean = panel

        for (let i of item) {
            boolean? 
            i.style.display = "none" :
            i.style.display = "block"
        }

        if (boolean) {
            arrow.style.transform = "rotateY(0deg)"
            navPanel.style.padding = 0;
            navPanel.style.width = 0;
            navPanel.style.opacity = 0;
            navPanel.style.minWidth = "0"
            navPanel.style.transform = "translateX(-100px)"
            board.style.marginLeft="0"
        } else {
            arrow.style.transform = "rotateY(180deg)"
            navPanel.style.padding = "1rem";
            navPanel.style.width = "15%";
            navPanel.style.opacity = 100;
            navPanel.style.minWidth = "15%"
            navPanel.style.transform = "translateX(0)"
            board.style.marginLeft="-1rem"

        }
        
    }


    const handleScroll = (index) => {
       // Right now it will only scroll to the first element

        let boxes = document.getElementsByClassName("section-containers");
        console.log(boxes[index].getBoundingClientRect().top)
        console.log(boxes[1].getBoundingClientRect().top)
        //boxes[0].scrollIntoView({ behavior: 'smooth' })
       const y = boxes[index].getBoundingClientRect().top + window.pageYOffset - 30
        window.scrollTo({top:y, behavior: 'smooth'})
    }


    const handleAdditionalBlock = (index) => {
        let value = state.values
        value[index]["value"].push({
            text: "New Block",
            editable: true
        })
        
        setstate({...state, values: value})

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


    }



    const handleTitleExpand = (index) => {
        let targetTitle = document.getElementsByClassName("titles")[index];

        targetTitle.style.height = "auto";
        targetTitle.style.height = targetTitle.scrollHeight + "px";
    }


    const handleRight = () => {
        let rightPanel = document.getElementsByClassName("right")[0];
        let board = document.getElementsByClassName("board")[0];

        setRight(!right)

        if (!right) {
            if (panel) {
              retractPanel()
            }

            rightPanel.style.width="40vw"
            board.style.width="60vw"
            board.style.marginRight="-4rem"
        } else {
            rightPanel.style.width="0"
            board.style.width="100vw"
            board.style.marginRight="0"
        }
        
       // window.scrollTo({left:100, behavior: 'smooth'})

        

    }



    useEffect(() => {
        /*
        const text = document.querySelectorAll(".textarea");
        for (var i = 0; i < text.length; i++) {
        text[i].addEventListener("input", function (e) {
            this.style.height = "auto";
            this.style.height = this.scrollHeight + "px";
          });
        }*/
        let markdownFields = document.getElementsByClassName("results");
        let textFields = document.getElementsByClassName("textarea");

    


        axios.get(`/posts/${id}`).then((res) => {

            if (res.data != 'Cannot find note') {
                setstate({Id:res.data._id,values:res.data.values})
                
                console.log(res.data)
            } 
        }).then(()=>{
            for (let i = 0; i < state.values.length; i++) {
                for (let j = 0; j < state.values[i]["value"].length; j++) {
                    
                    if (state.values[i]["value"][j].editable) {
                        console.log(999)
                        textFields[i+j].style.height = "auto";
                        textFields[i+j].style.height = textFields[i+j].scrollHeight + "px"
                    }
                }
            }


            /*
            for (let i = 0; i < state.values.length; i++) {
                if (state.values[i].edit == false){
                    textFields[i].style.opacity = 0
                    textFields[i].style.display = "none"
                    markdownFields[i].style.display = "block"
                } else {
                    textFields[i].style.opacity = 1
                    textFields[i].style.display = "block"
                    markdownFields[i].style.display = "none"
                }

               
                textFields[i].style.height = "auto";
                textFields[i].style.height = textFields[i].scrollHeight + "px"
                
            }*/
        })

    }, [])
    
    useEffect(() => {
        
  
        for (let i = 0; i < state.values.length; i++) {
            for (let j = 0; j < state.values[i]["value"].length; j++){
                //if (state.values[i].edit) {
                if (state.values[i]["value"][j].editable) {
                    let textField = document.getElementsByClassName("textarea"+i.toString()+j.toString())[0];
                    if (textField != undefined){
                        textField.style.height = "auto";
                        textField.style.height = textField.scrollHeight + "px"
                    }
                   
                }
        }
            
    }

    /*
    let text = document.getElementsByClassName("textarea")
    console.log(text)
    */
    }, [])
    



    return (

    <div>
        {console.log(state)}
        {/* TEMP FIX, Need a "Loading" indicator when fetching from server
        for now, if the first section is empty, it will say "loading" */}
        {state.values[0].value?
        
        <div className='container'>
        
        
        <div className='tool-bar'>
        

            <div className="open-panel">
                <button className='right-btn' onClick={handleRight}>Open Right</button>
                <h1 className='panel-btn' onClick={()=>retractPanel()}> {`>`} </h1>
            </div>
        </div>
        <div className='nav-panel'>
         {panel?
            state.values.map((value, index)=>{
            return <div className='section-text' onClick={()=>{handleScroll(index)}}>
                {value.title.length <= 30? value.title : value.title.substring(0,30)+"..."}

                </div>
        })
        :""}
        <h1 className='back-btn' onClick={()=>retractPanel()}> {`<`} </h1>
        </div>

        

        <div class="board">
       {state.Id?  <h3>ID is: {state.Id}</h3> : <h3>New Document</h3>}
       
        

            {state.values.map((st, index) => (
            <div key={index} className="section-containers">

                {/* Title textareas*/}
                <textarea value={st.title} className="titles" onChange={(e) => handleTitleChange(index, e)}>
                </textarea>
                {/*
                <button onClick={()=>handleTitleExpand(index)} className="expand-btn">Expand</button>*/}


                {console.log(st.edit)}

                {st.value.map((v,vIndex) => (
                    
                

                <div className='block-container'>
                <h2 className='mode-title'> {v.editable?"Edit Mode":"Markdown Mode"} </h2>
                {/*v.editable?*/}

                
                <div>
                  {/* style={{display: fieldState? "inline-block" : "none"}} */}
                  {/* Package it into an react comp so it can take values */}   
                <textarea style={{display: v.editable? "block" : "none"}} className={`textarea textarea${index}${vIndex}`} placeholder='Enter text here' value={v.text} onChange={(e) => handleChange(index, e, vIndex)}>


                </textarea>
                {/*<h1>{index}</h1>*/}
                </div>
              
              
                    {/*<h1 className='markdown-title'>Markdown</h1>*/}
                <div>
                        <ReactMarkdown children={v.text} className="results"/>
                </div>

                
               
                {/* TODO: Move the "Add Additional Block" out of the loop*/}

                
                <button class="toggle-btn btn" onClick={() => handleEdit(index, vIndex)}> Toggle Edit </button>
                <button class="delete-btn btn" onClick={() => handleBlockDelete(vIndex, index)}> Delete Block </button>

                </div>))}

                {/*<input type="text" value={st.value} onChange={(e) => handleChange(index, e)}/>*/}
                <button onClick={()=>handleAdditionalBlock(index)} className='btn'> Add Additional Block</button>
                <button class="delete-btn btn" onClick={() => handleDelete(index)}> Delete Section </button>

            </div>)) }
            
            <button onClick={handleAdd}>Add</button>
            <button onClick={handleCloseAll}>Close All Edit</button>
            <button onClick={handleSave}> Save </button>
            
           
            {/*<button onClick={handleScroll(0)}> scroll </button>*/}
            

            </div>
            
            {/* Board ends here */}
        

          <div className="right">
                    <h1>Edit Panel</h1>


          </div>

            
            </div>
            : "Loading"}
        </div>
    )
}
