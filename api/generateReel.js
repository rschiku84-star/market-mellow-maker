export default async function handler(req, res) {

const video = "https://player.vimeo.com/external/403425024.sd.mp4"

res.status(200).json({
output: video
})

}
