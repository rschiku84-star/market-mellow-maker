export default async function handler(req, res) {

const r = await fetch(
"https://api.pexels.com/videos/search?query=reels&per_page=3",
{
headers:{
Authorization: process.env.PEXELS_KEY
}
})

const data = await r.json()

const video = data.videos[Math.floor(Math.random()*data.videos.length)]

res.status(200).json({
video: video.video_files[0].link,
thumbnail: video.image,
hashtags: "#reels #viral #shopnow #trending",
music: "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8cBa73467.mp3"
})

}
