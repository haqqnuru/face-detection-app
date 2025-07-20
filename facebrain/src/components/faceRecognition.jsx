import React from 'react';


const FaceRecognition = ({ imageUrl, boxes }) => {
  return (
    <div className="center-container">
      <div className="image-container">
        {imageUrl && (
          <img id="inputimage" src={imageUrl} alt="" width="500px" height="auto"/>)}
        {boxes && boxes.map((box, index) => (
            <div key={index} className="bounding-box"
              style={{
                top: `${box.topRow}px`,
                left: `${box.leftCol}px`,
                width: `${box.width}px`,
                height: `${box.height}px`
              }}
            ></div>
          ))}
      </div>
    </div>
  );
};

export default FaceRecognition;