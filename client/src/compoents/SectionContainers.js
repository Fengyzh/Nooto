import React, { useState, useEffect } from 'react'
import { BoardEditingContext } from '../EditorContext';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import { materialOceanic } from 'react-syntax-highlighter/dist/esm/styles/prism'
import BlockContainers from './BlockContainers';


export default React.memo(function SectionContainers({swapSection, index, handleAdditionalBlock, handleTitleChange, handleTitleExpand, EditThis}) {

    let {state, setstate, width, handleDelete, isCondense} = BoardEditingContext()
    let st = state.values[index]




    
  return (

<div key={index} className="section-containers">

        {/*console.log(st)*/}

                {!isCondense && index > 0? <h1 onClick={() => swapSection(index, index-1)} className='up-btn move-btn'>^</h1> : ""}
                {!isCondense && index < state.values.length-1? <h1 onClick={()=> swapSection(index, index+1)} className='down-btn move-btn'>v</h1> : ""}
 
                {/* Title textareas*/}
                <div className='title-section'>
                <textarea disabled={isCondense? true: false} value={st.title} className="titles" onChange={(e) => handleTitleChange(index, e)}>
                </textarea>
                
                {st.title.length >= 30? 
                
                <button className='title-expand-btn' onClick={(e)=>{handleTitleExpand(index,e)}}>
                    Expand Title
                </button>
                
                :""}
                </div>
                {/*
                <button onClick={()=>handleTitleExpand(index)} className="expand-btn">Expand</button>*/}



                {st.value.map((v,vIndex) => (
                    <BlockContainers value = {v} vIndex={vIndex} index={index} EditThis={EditThis}/>
                ))}

                {/*<input type="text" value={st.value} onChange={(e) => handleChange(index, e)}/>*/}
                
                {!isCondense? 
              <div className='section-footer'>
                <div className='section-control-container'>
                  <button onClick={()=>handleAdditionalBlock(index)} className='section-btn'> Add Additional Block</button>
                  <button class="delete-btn section-btn" onClick={() => handleDelete(index)}> Delete Section </button>
                </div>
              </div>
                  : "" }
              
                
            </div>


  )
})
