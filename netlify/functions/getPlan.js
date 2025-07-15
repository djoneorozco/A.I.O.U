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

    // ✅ Use .md not .mb
    const planPath = path.join(process.cwd(), 'plans', `${mbti}.md`);

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
