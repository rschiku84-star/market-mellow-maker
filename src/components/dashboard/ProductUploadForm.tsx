
import { useState } from "react";
import { generateScript } from "../../ai/generateScript";
import { generateCaption } from "../../ai/generateCaption";
import { generateHashtags } from "../../ai/generateHashtags";
import { generateReel } from "../../ai/generateReel";

export default function ProductUploadForm() {

const [name,setName] = useState("");
const [offer,setOffer] = useState("");

const generateContent = () => {

const script = generateScript(name,offer);
const caption = generateCaption(name,offer);
const hashtags = generateHashtags(name);
const reel = generateReel(name,offer,"product-image");

alert(

"SCRIPT:\n"+script+

"\n\nCAPTION:\n"+caption+

"\n\nHASHTAGS:\n"+hashtags.join(" ") +

"\n\nREEL:\n"+JSON.stringify(reel,null,2)

);

};

return (

<div style={{padding:"20px"}}>

<h2>AI Reel Generator</h2>

<input
placeholder="Product Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<br/><br/>

<input
placeholder="Offer"
value={offer}
onChange={(e)=>setOffer(e.target.value)}
/>

<br/><br/>

<button onClick={generateContent}>
Generate Reel Content
</button>

</div>

);

}
