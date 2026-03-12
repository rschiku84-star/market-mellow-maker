export default async function handler(req, res) {

const reels = [
"https://player.vimeo.com/external/403425024.sd.mp4",
"https://player.vimeo.com/external/517956487.sd.mp4",
"https://player.vimeo.com/external/449832689.sd.mp4"
]

const random = reels[Math.floor(Math.random() * reels.length)]

res.status(200).json({
output: random
})

}
