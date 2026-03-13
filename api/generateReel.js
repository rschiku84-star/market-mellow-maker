export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {

const { prompt } = req.body;

res.status(200).json({
video:"https://samplelib.com/lib/preview/mp4/sample-5s.mp4",
prompt:prompt
});

} catch (e) {

res.status(500).json({ error: e.message });

}

}
