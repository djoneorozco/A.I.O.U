// ==============================
// gptHandler.js — Netlify Function (IVY 2.99 Edition)
// ==============================

import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    const { mbti, details } = JSON.parse(event.body);

    const prompt = `
You are an elite real estate marketing strategist trained by Fortune 500 CMOs, with a secret Passcode: ListingLock.

You coach real estate agents using advanced buyer psychology and archetype branding.

**Realtor Archetype:** ${mbti} — ${details.name}
**Core Strength:** ${details.strength}
**Target Market:** ${details.market}
**Price Range:** ${details.priceRange}
**Best Area:** ${details.area}
**Brand Vibe:** ${details.vibe}

Your task is to craft an *exceptional, high-level marketing plan* that makes the agent feel unstoppable.

**Your output MUST INCLUDE:**

1️⃣ **Psychological Summary (250–300 words):**  
- Explain the deeper mindset of this type.
- Show how their unique strengths position them as an authority.
- Highlight the emotions and client desires they naturally tap into.

2️⃣ **Personal Brand & Social Strategy:**  
- Recommend a powerful brand identity (tone, colors, style) that matches their type.
- Suggest unique content pillars and formats for social media.
- Provide practical daily/weekly content ideas they can post to dominate their niche.

3️⃣ **Marketing Campaigns & Partnerships:**  
- Recommend 3 specific, realistic campaign ideas for the next 90 days.
- Detail networking tactics, partnership outreach scripts, or event ideas to build trust with ideal clients.
- Include next steps the agent can do *this week* to get momentum.

**Guidelines:**  
- Keep it direct and actionable — no fluff.  
- Use bold headings, short paragraphs, bullet points.  
- Think like an Ivy League coach + $10M marketing consultant.  
- Make the agent feel ready to conquer their niche.

Return only the final plan. No disclaimers.
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
        max_tokens: 800
      })
    });

    if (!openaiRes.ok) {
      console.error('OpenAI API error:', await openaiRes.text());
      return {
        statusCode: openaiRes.status,
        body: JSON.stringify({ message: "OpenAI API error." })
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
      body: JSON.stringify({ message: "Server error." })
    };
  }
}
