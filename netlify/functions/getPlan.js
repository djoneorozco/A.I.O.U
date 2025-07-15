import fs from 'fs';
import path from 'path';

export async function handler(event) {
  try {
    const mbti = event.queryStringParameters.mbti;

    if (!mbti) {
      return {
        statusCode: 400,
        body: "No MBTI provided."
      };
    }

    // 🔑 Uses .mb extension — adjust if needed
    const planPath = path.join(process.cwd(), 'plans', `${mbti}.mb`);
    console.log(`Looking for plan file at: ${planPath}`);

    if (!fs.existsSync(planPath)) {
      console.warn(`Plan for ${mbti} not found at ${planPath}`);
      return {
        statusCode: 404,
        body: "Plan not found."
      };
    }

    const planContent = fs.readFileSync(planPath, 'utf-8');
    console.log(`✅ Successfully loaded ${mbti}.mb, size: ${planContent.length} bytes`);

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      body: planContent
    };

  } catch (err) {
    console.error("🔥 getPlan.js Error:", err);
    return {
      statusCode: 500,
      body: "Server error."
    };
  }
}
