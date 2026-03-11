function generateReel(){

let file=document.getElementById("image").files[0]

if(!file){
alert("Upload image first")
return
}

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

}

recorder.start()

let frame=0

let anim=setInterval(()=>{

ctx.fillStyle="#000"
ctx.fillRect(0,0,720,1280)

ctx.drawImage(img,60,200,600,600)

ctx.fillStyle="white"
ctx.font="40px Arial"

let name=document.getElementById("name").value
let price=document.getElementById("price").value

ctx.fillText(name,100,950)
ctx.fillText("Price "+price,100,1000)

frame++

if(frame>900){
clearInterval(anim)
recorder.stop()
}

},33)

}

img.src=e.target.result

}

reader.readAsDataURL(file)

}
