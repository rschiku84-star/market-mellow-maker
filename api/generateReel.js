export default async function handler(req, res) {

const reels = [
"https://player.vimeo.com/external/403425024.sd.mp4",
"https://player.vimeo.com/external/517956487.sd.mp4",
"https://player.vimeo.com/external/449832689.sd.mp4"
];

const hashtags = [
"#viralreels","#instareels","#trending","#shopnow","#dealoftheday"
];

const thumbnail = "https://picsum.photos/600/400";

const music = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a73467.mp3?filename=future-bass-117997.mp3";

const randomVideo = reels[Math.floor(Math.random() * reels.length)];

res.status(200).json({
video: randomVideo,
hashtags: hashtags.join(" "),
thumbnail: thumbnail,
music: music
});

}
