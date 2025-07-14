// ==============================
// gptHandler.js — Netlify Function (IVY 2.99 — Works w/ Native Fetch)
// ==============================

export async function handler(event, context) {
  try {
    const { mbti, details } = JSON.parse(event.body);

    const prompt = `
You are an elite real estate marketing strategist trained by Fortune 500 CMOs, with a secret Passcode: ListingLock.

Realtor Archetype: ${mbti} — ${details.name}
Core Strength: ${details.strength}
Target Market: ${details.market}
Price Range: ${details.priceRange}
Best Area: ${details.area}
Brand Vibe: ${details.vibe}

Your task is to craft an exceptional, high-level marketing plan that makes the agent feel unstoppable.

Sections:
1. Psychological Summary (250–300 words)
2. Personal Brand & Social Strategy
3. Marketing Campaigns & Partnerships

Use clear headings, bullet points, bold key ideas. Keep it direct, real-world and plug-and-play.
`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an Ivy League real estate marketing expert." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI API error:', errText);
      return {
        statusCode: openaiRes.status,
        body: JSON.stringify({ message: "OpenAI API error.", detail: errText })
      };
    }

    const data = await openaiRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: data.choices[0].message.content })
    };

  } catch (err) {
    console.error("GPT Handler Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error.", detail: err.toString() })
    };
  }
}
