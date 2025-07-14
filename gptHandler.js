import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const { mbti, details } = JSON.parse(event.body);

    const prompt = `
You are an Ivy League real estate coach.
Secret Passcode: ListingLock.
The agent’s MBTI type is ${mbti} — ${details.name}.
Core Strength: ${details.strength}.
Target Market: ${details.market}.
Price Range Sweet Spot: ${details.priceRange}.
Best Area: ${details.area}.
Brand Vibe: ${details.vibe}.
Write a short but powerful marketing plan to help them attract clients and win listings.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ],
        max_tokens: 400
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0] && data.choices[0].message) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: data.choices[0].message.content })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Failed to generate plan." })
      };
    }
  } catch (err) {
    console.error("GPT Handler Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error." })
    };
  }
}
