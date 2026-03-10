import React, { useState } from "react";

function App() {

  const [name,setName] = useState("");
  const [price,setPrice] = useState("");
  const [offer,setOffer] = useState("");
  const [image,setImage] = useState(null);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    alert("Product Saved 🚀");
  };

  return (
    <div style={{fontFamily:"Arial",padding:"20px",textAlign:"center"}}>

      <h1>🚀 Market Mellow Maker</h1>
      <p>Create marketing reels for your shop</p>

      <h2 style={{marginTop:"40px"}}>Upload Product</h2>

      <form onSubmit={handleSubmit} style={{maxWidth:"300px",margin:"auto"}}>

        <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e)=>setName(e.target.value)}
        style={input}
        />

        <input
        type="text"
        placeholder="Price"
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
        style={input}
        />

        <input
        type="text"
        placeholder="Offer"
        value={offer}
        onChange={(e)=>setOffer(e.target.value)}
        style={input}
        />

        <input
        type="file"
        onChange={(e)=>setImage(e.target.files?.[0] || null)}
        style={input}
        />

        <button style={btn}>
          Generate Video
        </button>

      </form>

    </div>
  );
}

const input = {
  width:"100%",
  padding:"10px",
  margin:"10px 0",
  borderRadius:"6px",
  border:"1px solid #ccc"
};

const btn = {
  width:"100%",
  padding:"12px",
  background:"#4CAF50",
  color:"white",
  border:"none",
  borderRadius:"8px",
  cursor:"pointer"
};

export default App;
