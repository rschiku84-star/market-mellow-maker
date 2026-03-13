import Replicate from "replicate";

export default async function handler(req, res) {

if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {

const { prompt } = req.body;

const replicate = new Replicate({
auth: process.env.REPLICATE_API_TOKEN,
});

const output = await replicate.run(
"lucataco/animate-diff",
{
input: {
prompt: prompt
}
}
);

res.status(200).json({ video: output });

} catch (error) {

res.status(500).json({
error: error.message
});

}

}
