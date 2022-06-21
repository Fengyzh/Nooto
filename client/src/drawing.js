import './drawing.css';
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import React from 'react'
import { UserAuth } from './AuthContext';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'


/*
 TODO:
    - Make a loading page compoent for when the user is trying to access an non-existent
    Nooto, it should bring the user to a page saying "Nooto doesn't exist" instead
    of just redirecting the user back to the profile page

*/


export default function Drawing() {
    let navigate = useNavigate();

/*
    What I did last time:
        Created a "EditThis" function so the user can click this to open the edit panel
        instead of having to toggle.
            - Do this because we don't want users to edit multiple blocks at the same time

    Debug:
        Appearently the "Auto re-size for textarea" in useEffect affect the textarea in the
        right text panel, even thought the textarea class doesn't follow the format of the old
        textarea


*/




    let {id} = useParams();
    const {currentUser, logout} = UserAuth();


    const [panel, setPanel] = useState(false)
    const [right, setRight] = useState(false)
    const [rightContent, setRightContent] = useState()
    const [load, setLoad] = useState(true)
    const [settingPanel, setSettingPanel] = useState(false)

    const [state, setstate] = useState({
        Id: "",
        title:"Test Document 2" ,
        values: [{
            title: "New Section",
            value: [{
                text: "good",
                editable: false
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
            editable: false
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
        let targetTitle = document.getElementsByClassName("titles")[index];

        if (e.target.value.length < 35) {
            targetTitle.style.height = "5rem";
            targetTitle.style.overflow = "hidden";
                }

        /*
        e.target.style.height = "auto";
        e.target.style.height = e.target.scrollHeight + "px";
        */
    }

    function handleEdit(index, vIndex) {
        let value = [...state.values]    
        //value[index]["edit"] = !value[index]["edit"]
        value[index]["value"][vIndex]["editable"] = !value[index]["value"][vIndex]["editable"]
        setstate({...state, values:value})
        setRightContent({index:index, vIndex:vIndex})

        /*
        for (let i = 0; i < state.values[index]["value"].length; i++) {
            if (state.values[index]["value"]["editable"] && i != vIndex) {
                value[index]["value"][i]["editable"] = !value[index]["value"][i]["editable"]
                setstate({...state, values:value})
            }
        }
        */

        /*
        if (!right) {
            handleRight()
        }
        */


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
            title: state.title,
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
        //boxes[0].scrollIntoView({ behavior: 'smooth' })
       const y = boxes[index].getBoundingClientRect().top + window.pageYOffset - 30
        window.scrollTo({top:y, left:0, behavior: 'smooth'})
    }


    const handleAdditionalBlock = (index) => {
        let value = state.values
        value[index]["value"].push({
            text: "New Block",
            editable: false
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



    const handleTitleExpand = (index, e) => {
        let targetTitle = document.getElementsByClassName("titles")[index];
        let titleHeight = targetTitle.style.height;

        console.log(titleHeight)
        if (titleHeight == "max-content") {
            targetTitle.style.height = "5rem";
            targetTitle.style.overflow = "hidden";
            targetTitle.scrollTop = 0
        } else {
            targetTitle.style.height = "max-content";
            targetTitle.style.overflow = "scroll";
        }
        //targetTitle.style.height = "auto";
        //targetTitle.style.height = targetTitle.scrollHeight + "px";
    }


    const handleRight = () => {
        let rightPanel = document.getElementsByClassName("right")[0];
        let board = document.getElementsByClassName("board")[0];
        let leftArrow = document.getElementsByClassName("arrow-btn")[0];
        let rightArrow = document.getElementsByClassName("arrow-btn")[1];

        //let backBtn = document.getElementsByClassName("right-back-btn")[0];


        setRight(!right)

        if (!right) {
            if (panel) {
              retractPanel()
            }
            rightPanel.style.width="40vw"
            board.style.width="60%"
            board.style.marginRight="0rem"
            leftArrow.style.transform="rotateY(180deg)"
            rightArrow.style.transform="rotateY(180deg)"
        } else {
            rightPanel.style.width="0"
            board.style.width="100%"
            board.style.marginRight="0"
            leftArrow.style.transform="rotateY(0deg)"
            rightArrow.style.transform="rotateY(0deg)"
        }
        
       // window.scrollTo({left:100, behavior: 'smooth'})


    }

    
    const EditThis = (index, vIndex) => {
        //let value = [...state.values]
        //value[index]["value"][vIndex]["editable"] = !value[index]["value"][vIndex]["editable"]
    
        //setstate({...state, values:value})
        setRightContent({index:index, vIndex:vIndex})

        if (!right) {
            handleRight()
        }
    }

    const handleDocumentTitle = (e) => {
        console.log(e.target.value)

        setstate({title:e.target.value, Id:state.Id, values:state.values} )
    }



    const handleDeleteNooto = () => {
        if (currentUser) {
            axios.post('/deleteNooto', {
                id: state.Id,
                UID: currentUser.uid
            }).then(res=>{
                navigate("/")
            })
        }
    }


    // ------ Util function
    function swapSection(from, to) {
        let tempStateValues = state.values
        let temp = tempStateValues[from]
        tempStateValues[from] = tempStateValues[to]
        tempStateValues[to] = temp
        setstate({title:state.title, Id:state.Id, values:tempStateValues})

        handleScroll(to)

    }


    const handleMoveUp = (index) => {
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
        /*
        document.addEventListener('scroll', function(e) {
            if (window.pageXOffset >= 4) {
                window.scrollTo({left:0, behavior: 'smooth'})
            }
        })
        */

        let markdownFields = document.getElementsByClassName("results");
        let textFields = document.getElementsByClassName("textarea");

    


        axios.get(`/posts/${id}`).then((res) => {

            if (res.data != 'Cannot find note') {
                setstate({Id:res.data._id, title:res.data.title, values:res.data.values})
                setLoad(!load)
                console.log(res.data)
            } else {
                navigate("/")
            }
        })
        /*
        .then(()=>{
            
            for (let i = 0; i < state.values.length; i++) {
                for (let j = 0; j < state.values[i]["value"].length; j++) {
                    
                    if (state.values[i]["value"][j].editable) {
                        console.log(999)
                        textFields[i+j].style.height = "auto";
                        textFields[i+j].style.height = textFields[i+j].scrollHeight + "px"
                    }
                }
            }
            

            
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
                
            }
        })*/

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

    <div className="full">
        {console.log(state)}
        {/* TEMP FIX, Need a "Loading" indicator when fetching from server
        for now, if the first section is empty, it will say "loading" */}
        {/*state.values[0].value? */}
        {!load?
        <div>
            <div className='nav-bar'>
                <div className='nav-title-container'>
                <h1 className='title' style={{cursor: "pointer"}} onClick={()=>navigate("/")}>Nooto</h1>
                <h1 className='panel-btn' onClick={()=>retractPanel()}> {`>`} </h1>
                </div>
                <input className="doc-title" onChange={(e)=>handleDocumentTitle(e)} value={state.title}/>
                
                <div className='nav-title-container'>
                <div className='title'>
                    <h1 style={{cursor: "pointer"}} onClick={()=>setSettingPanel(!settingPanel)}> O </h1>
                    {settingPanel?
                    <div className="setting-panel-container"> 
                        <div className='setting-panel-title-container'>
                            <h1 className='setting-panel-title'> Settings </h1>
                            <h2 className='close-setting-btn' style={{cursor: "pointer"}} onClick={()=>setSettingPanel(!settingPanel)}> X </h2>
                        </div>
                        
                        <div className='state-id-filed'>
                        {state.Id?  <h3 className='id-text'>ID: {state.Id}</h3> : <h3>New Document</h3>}

                        </div>

                        <div>
                            <h3 className='setting-titles'> Title:  </h3>
                            <textarea value={state.title} className="setting-title-field" onChange={(e) => handleDocumentTitle(e)}/>

                        </div>
                        
                        <div>
                            <div className="setting-delete-nooto">
                                <button onClick={handleDeleteNooto} className="setting-delete-btn">Delete This Nooto</button>
                            </div>
                        </div>

                    </div>
                    : ""}

                </div>

                <div className='panel-btn edit-btn' onClick={()=>handleRight()}>
                    <h1 className='arrow-btn'> {`<`}</h1>
                    <h1 className='arrow-btn'> {`>`}</h1>
                </div>
                </div>

            </div>


        <div className='container'>

        
        <div className='tool-bar'>
            <div className="open-panel">
                {/*<button className='right-btn' onClick={handleRight}>Open Right</button> */}
                
            </div>
        </div>


        <div className='nav-panel'>
         {panel?
            state.values.map((value, index)=>{
            return <div className='section-text' onClick={()=>{handleScroll(index)}}>
                {value.title.length <= 20? value.title : value.title.substring(0,20)+"..."}

                </div>
        })
        :""}
        <h1 className='back-btn' onClick={()=>retractPanel()}> {`<`} </h1>
        </div>

        

        <div class="board">
       
       {/*<input onChange={(e)=>handleDocumentTitle(e)}/>*/}
        

            {state.values.map((st, index) => (
            <div key={index} className="section-containers">
                {index > 0? <h1 onClick={() => swapSection(index, index-1)} className='up-btn move-btn'>^</h1> : ""}
                {index < state.values.length-1? <h1 onClick={()=> swapSection(index, index+1)} className='down-btn move-btn'>v</h1> : ""}

                {/* Title textareas*/}
                <div className='title-section'>
                <textarea value={st.title} className="titles" onChange={(e) => handleTitleChange(index, e)}>
                </textarea>
                
                {st.title.length >= 40? 
                
                <button className='title-expand-btn' onClick={(e)=>{handleTitleExpand(index,e)}}>
                    Expand Title
                </button>
                
                :""}
                </div>
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

                {/*
                <textarea style={{display: v.editable? "block" : "none"}} className={`textarea textarea${index}${vIndex}`} placeholder='Enter text here' value={v.text} onChange={(e) => handleChange(index, e, vIndex)}>


                </textarea>
                */}
                {/*<h1>{index}</h1>*/}
                </div>
              
              
                    {/*<h1 className='markdown-title'>Markdown</h1>*/}
                <div>
                        <ReactMarkdown components={{
                            pre: ({node, ...props}) => 
                            <div>
                                <pre {...props}> {props.children}{console.log(props.children[0].props.className)} </pre>
                            </div>,

                            h1: ({node, ...props}) =>
                                <h1 style={{lineHeight:"2rem"}}> {props.children} </h1>
                                ,
                            code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                        <div style={{position:"relative"}}>
                                      <SyntaxHighlighter
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1].toLowerCase()}
                                        style={materialOceanic}
                                        className="code-highlighter"
                                        //useInlineStyles={false}
                                        customStyle={{borderRadius:"15px", margin:"0"}}
                                        PreTag="div"
                                        wrapLines={true}
                                        wrapLongLines={true}
                                        {...props}
                                      />
                                      <p className='language-tag'>{match[1]}</p>
                                      </div>
                                    ) : (
                                      <code className={className} {...props}>
                                        {children}
                                      </code>
                                    )
                                  }
                            
                        }} 
                        children={v.text} className="results"/>
                </div>

                
               
                {/* TODO: Move the "Add Additional Block" out of the loop*/}

                
                {/*<button class="toggle-btn btn" onClick={() => handleEdit(index, vIndex)}> Toggle Edit </button>*/}
                <button class="delete-btn btn" onClick={() => handleBlockDelete(vIndex, index)}> Delete Block </button>
                <button class="toggle-btn btn" onClick={() => EditThis(index, vIndex)}>Edit This </button>



                </div>))}

                {/*<input type="text" value={st.value} onChange={(e) => handleChange(index, e)}/>*/}
                <button onClick={()=>handleAdditionalBlock(index)} className='btn'> Add Additional Block</button>
                <button class="delete-btn btn" onClick={() => handleDelete(index)}> Delete Section </button>

            </div>)) }
            
            <div className='footer'>
                <button className='util-btn add-btn' onClick={handleAdd}> + Add Section</button>
                {/*<button onClick={handleCloseAll}>Close All Edit</button>*/}
                <button className='util-btn save-btn' onClick={handleSave}> v Save Nooto</button>
            </div>

           
            {/*<button onClick={handleScroll(0)}> scroll </button>*/}
            

            </div>
            
            {/* Board ends here */}
        
          <div className="right">

                    <div className='right-title-container'>
                    <button className='right-back-btn' onClick={()=> handleRight()}>
                        {">"}
                    </button>
                    <div className='edit-panel-title'>
                        <h1>Edit Panel</h1>
                    </div>
                    </div>



                    {rightContent 
                    
                    ? 
                    <textarea className='textareaRight' value={state.values[rightContent.index]? state.values[rightContent.index]["value"][rightContent.vIndex]["text"] : ""} onChange={(e) => handleChange(rightContent.index, e, rightContent.vIndex)}>
                    </textarea>

                    : "Not editing any block"}

          </div>

            
            </div>
            </div>
            : "Loading"}
        </div>
    )
}
