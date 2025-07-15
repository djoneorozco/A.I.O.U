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

    // Ensure path is correct relative to serverless build output
    const planPath = path.join(process.cwd(), 'plans', `${mbti}.mb`);

    if (!fs.existsSync(planPath)) {
      return {
        statusCode: 404,
        body: "Plan not found."
      };
    }

    const plan = fs.readFileSync(planPath, 'utf-8');

    return {
      statusCode: 200,
      headers: { "Content-Type": "text/plain" },
      body: plan
    };

  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      body: "Server error."
    };
  }
}
