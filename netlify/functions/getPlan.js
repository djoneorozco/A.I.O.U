import { readFileSync } from 'fs';
export async function handler(event) {
  const { mbti } = JSON.parse(event.body);
  try {
    const plan = readFileSync(`plans/${mbti}.md`, 'utf-8');
    return { statusCode: 200, body: JSON.stringify({ plan }) };
  } catch (e) {
    return { statusCode: 404, body: JSON.stringify({ plan: "Not found" }) };
  }
}
