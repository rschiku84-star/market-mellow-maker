export default async function handler(req, res) {

const response = await fetch("https://api.replicate.com/v1/predictions", {

method: "POST",

headers: {
"Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
"Content-Type": "application/json"
},

body: JSON.stringify({

version: "stability-ai/stable-video-diffusion",

input: {
prompt: "cinematic product reel advertisement"
}

})

});

const data = await response.json();

res.status(200).json(data);

}
