<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>AI Reel Maker v2</title>

<style>

body{
font-family:Arial;
background:#0b2545;
color:white;
text-align:center;
padding:20px;
margin:0;
}

.container{
background:#132f4c;
padding:20px;
border-radius:12px;
max-width:420px;
margin:auto;
box-shadow:0 0 20px rgba(0,0,0,0.4);
}

input{
width:92%;
padding:10px;
margin:10px;
border-radius:6px;
border:none;
}

button{
padding:12px;
margin:10px;
border:none;
border-radius:6px;
background:#22c55e;
color:white;
font-size:16px;
cursor:pointer;
width:92%;
}

video{
width:100%;
margin-top:12px;
border-radius:10px;
}

</style>

</head>

<body>

<h2>AI Reel Maker v2</h2>

<div class="container">

<input type="file" id="image">

<input type="text" id="name" placeholder="Product Name">

<input type="text" id="price" placeholder="Price">

<button onclick="generateReel()">Generate Reel</button>

<video id="video" controls></video>

<a id="downloadVideo" download="reel.webm">
<button>Download Reel</button>
</a>

<p id="loading" style="display:none">Generating AI Reel...</p>

</div>

<script>

function generateReel(){

let file=document.getElementById("image").files[0]

if(!file){
alert("Upload product image")
return
}

document.getElementById("loading").style.display="block"

let reader=new FileReader()

reader.onload=function(e){

let canvas=document.createElement("canvas")
let ctx=canvas.getContext("2d")

canvas.width=720
canvas.height=1280

let img=new Image()

img.onload=function(){

let stream=canvas.captureStream(30)

let recorder=new MediaRecorder(stream)

let chunks=[]

recorder.ondataavailable=e=>chunks.push(e.data)

recorder.onstop=function(){

let blob=new Blob(chunks,{type:"video/webm"})
let url=URL.createObjectURL(blob)

document.getElementById("video").src=url
document.getElementById("downloadVideo").href=url

document.getElementById("loading").style.display="none"

}

recorder.start()

let frame=0

let animation=setInterval(()=>{

ctx.fillStyle="#000"
ctx.fillRect(0,0,720,1280)

let zoom=1+frame*0.003

ctx.drawImage(img,60,200,600*zoom,600*zoom)

ctx.fillStyle="white"
ctx.font="bold 44px Arial"

let name=document.getElementById("name").value
let price=document.getElementById("price").value

ctx.fillText(name,80,950)
ctx.fillText("Price: "+price,80,1010)

frame++

if(frame>900){
clearInterval(animation)
recorder.stop()
}

},33)

}

img.src=e.target.result

}

reader.readAsDataURL(file)

}

</script>

</body>
</html>
