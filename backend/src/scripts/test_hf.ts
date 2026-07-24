import dotenv from "dotenv";
dotenv.config();

const promptText = "Delicious authentic French croissant on a marble table, professional food photography 4k";

async function testPollinations() {
  console.log("Testing Pollinations AI Image Engine with custom User-Agent...");
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(promptText)}?width=600&height=400&nologo=true&seed=12345`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
      }
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    const contentType = res.headers.get("content-type");
    console.log(`Content-Type: ${contentType}`);

    if (res.ok) {
      const buf = await res.arrayBuffer();
      console.log(`✓ SUCCESS! Received ${buf.byteLength} bytes image buffer!`);
      return true;
    } else {
      const text = await res.text();
      console.log(`Error Response: ${text.substring(0, 200)}`);
    }
  } catch (err: any) {
    console.error(`Error:`, err.message);
  }
  return false;
}

testPollinations();
