import { readFileSync } from 'fs';
export async function handler(event) {
  const { mbti } = JSON.parse(event.body);
  const content = readFileSync(`plans/${mbti}.md`, 'utf-8');
  return {
    statusCode: 200,
    body: JSON.stringify({ plan: content })
  };
}
