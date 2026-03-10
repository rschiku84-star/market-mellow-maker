import React, { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [offer, setOffer] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Reel will be generated soon 🚀");
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "30px", textAlign: "center" }}>
      <h1>🚀 Market Mellow Maker</h1>
      <p>Create marketing reels for your shop</p>

      <div style={{ marginTop: "40px" }}>
        <h2>Upload Product</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "320px",
            margin: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            style={input}
          />

          <input
            placeholder="Offer"
            value={offer}
            onChange={(e) => setOffer(e.target.value)}
            style={input}
          />

          <input
            type="file"
            onChange={(e) =>
              setImage(e.target.files ? e.target.files[0] : null)
            }
            style={input}
          />

          <button style={btn}>Generate Reel</button>
        </form>
      </div>
    </div>
  );
}

const input = {
  padding: "10px",
  margin: "8px 0",
  borderRadius: "6px",
  border: "1px solid #ccc",
};

const btn = {
  padding: "12px",
  marginTop: "10px",
  border: "none",
  borderRadius: "8px",
  background: "#4CAF50",
  color: "white",
  cursor: "pointer",
};

export default App;
