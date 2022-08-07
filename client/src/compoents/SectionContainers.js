import React from 'react'
import { BoardEditingContext } from '../EditorContext';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import BlockContainers from './BlockContainers';


export default function SectionContainers({swapSection, index, handleAdditionalBlock, handleBlockDelete, handleDelete, handleTitleChange, handleTitleExpand, EditThis}) {

    let {state, setstate} = BoardEditingContext()
    let st = state.values[index]



    
  return (

<div key={index} className="section-containers">

        {console.log(st)}
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



                {st.value.map((v,vIndex) => (
                    <BlockContainers value = {v} vIndex={vIndex} index={index} handleBlockDelete={handleBlockDelete} EditThis={EditThis}/>
                ))}

                {/*<input type="text" value={st.value} onChange={(e) => handleChange(index, e)}/>*/}
                <button onClick={()=>handleAdditionalBlock(index)} className='btn'> Add Additional Block</button>
                <button class="delete-btn btn" onClick={() => handleDelete(index)}> Delete Section </button>

            </div>


  )
}
