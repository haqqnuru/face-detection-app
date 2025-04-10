import React from 'react';



const ImageLinkForm = ({onInputChange, onButtonSubmit}) => {
    return ( 
    <div>
        
        <p className='f3 white'>{'This Magic Brain will detect faces'}</p>
        <div>
            <input type='text' className='f4 pa2 w-50 center'
            onChange={onInputChange}/>
        <button className='w-20 grow f4 link ph3 pv2 dib white bg-dark-green'
        onClick={onButtonSubmit}>Detect </button>
        </div>
        </div>
     );
}
 
export default ImageLinkForm;