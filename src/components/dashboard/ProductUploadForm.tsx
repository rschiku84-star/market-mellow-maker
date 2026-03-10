import { generateScript } from "../../ai/generateScript";
import { generateCaption } from "../../ai/generateCaption";
import { generateHashtags } from "../../ai/generateHashtags";

import { useState } from "react";

export default function ProductUploadForm() {

const [name, setName] = useState("");
const [offerAmount, setOfferAmount] = useState("");

const generateContent = () => {
  const script = generateScript(name, offerAmount);
  const caption = generateCaption(name, offerAmount);
  const hashtags = generateHashtags(name);

  alert(
    "SCRIPT:\n" +
      script +
      "\n\nCAPTION:\n" +
      caption +
      "\n\nHASHTAGS:\n" +
      hashtags
  );
};

return (
  <div style={{padding:"20px"}}>

  <h2>Product Reel Generator</h2>

  <input
  placeholder="Product Name"
  value={name}
  onChange={(e)=>setName(e.target.value)}
  />

  <br/><br/>

  <input
  placeholder="Offer Amount"
  value={offerAmount}
  onChange={(e)=>setOfferAmount(e.target.value)}
  />

  <br/><br/>

  <button onClick={generateContent}>
  Generate Reel Content
  </button>

  </div>
);
}
