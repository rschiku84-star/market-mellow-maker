import { useState } from "react";

export default function App() {

const [videoUrl,setVideoUrl]=useState("");

function generateReel(e:any){

const file=e.target.files[0];
if(!file){alert("Upload image");return;}

const img=new Image();
img.src=URL.createObjectURL(file);

img.onload=()=>{

const canvas=document.createElement("canvas");
canvas.width=720;
canvas.height=1280;

const ctx=canvas.getContext("2d")!;

const stream=canvas.captureStream(30);
const recorder=new MediaRecorder(stream);

let chunks:any[]=[];

recorder.ondataavailable=e=>chunks.push(e.data);

recorder.onstop=()=>{

const blob=new Blob(chunks,{type:"video/webm"});
const url=URL.createObjectURL(blob);

setVideoUrl(url);

};

recorder.start();

let frame=0;

function draw(){

ctx.fillStyle="black";
ctx.fillRect(0,0,720,1280);

const zoom=1+(frame*0.0005);

const w=720*zoom;
const h=900*zoom;

ctx.drawImage(img,(720-w)/2,(900-h)/2,w,h);

frame++;

if(frame<900){

requestAnimationFrame(draw);

}else{

recorder.stop();

}

}

draw();

};

}

function download(){

if(!videoUrl){
alert("Generate reel first");
return;
}

const a=document.createElement("a");
a.href=videoUrl;
a.download="ai-reel.webm";
a.click();

}

function pay(){

window.location.href="https://rzp.io/l/YOURPAYLINK";

}

return (

<div style={{fontFamily:"Arial",background:"#0d2b45",height:"100vh",padding:"20px",color:"white"}}>

<h2 style={{textAlign:"center"}}>AI Reel Maker PRO</h2>

<div style={{maxWidth:"400px",margin:"auto",background:"#163a5f",padding:"20px",borderRadius:"10px"}}>

<input type="file" onChange={generateReel} style={{width:"100%",marginBottom:"10px"}}/>

<video src={videoUrl} controls style={{width:"100%",marginTop:"10px"}}></video>

<button onClick={download} style={{width:"100%",padding:"12px",marginTop:"10px",background:"#22c55e",border:"none",borderRadius:"6px",color:"white"}}>

Download Reel

</button>

<button onClick={pay} style={{width:"100%",padding:"12px",marginTop:"10px",background:"#f59e0b",border:"none",borderRadius:"6px",color:"white"}}>

Pay ₹199 Unlock

</button>

</div>

</div>

);

}
