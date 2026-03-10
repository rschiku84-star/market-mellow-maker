import React from "react";

function App() {
  return (
    <div style={{fontFamily:"Arial",padding:"20px",textAlign:"center"}}>
      
      <h1>🚀 Market Mellow Maker</h1>
      <p>Create marketing videos in one click</p>

      <div style={{marginTop:"40px"}}>

        <button style={btn}>Upload Product</button>

        <button style={btn}>Create Reel Video</button>

        <button style={btn}>AI Script Generator</button>

        <button style={btn}>Auto Post Social Media</button>

      </div>

    </div>
  );
}

const btn = {
  display:"block",
  width:"250px",
  margin:"10px auto",
  padding:"15px",
  fontSize:"16px",
  borderRadius:"10px",
  border:"none",
  background:"#4CAF50",
  color:"white",
  cursor:"pointer"
};

export default App;
