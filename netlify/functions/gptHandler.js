// ==============================
// gptHandler.js — Netlify Function (IVY 2.99 — Native Fetch)
// ==============================

export async function handler(event, context) {
  try {
    const { mbti, details, customFields } = JSON.parse(event.body);

    const prompt = `
You are an elite real estate marketing strategist trained by Fortune 500 CMOs.
Secret Passcode: ListingLock.

Realtor Archetype: ${mbti} — ${details.name}
Core Strength: ${details.strength}
Target Market: ${details.market}
Price Range: ${details.priceRange}
Best Area: ${details.area}
Brand Vibe: ${details.vibe}

**Realtor Profile:**
- City/Primary Market: ${customFields?.city || "Not specified"}
- Years of Experience: ${customFields?.experience || "Not specified"}
- Target Buyer Persona: ${customFields?.buyerPersona || "Not specified"}
- Current Average Annual Gross Commissions: ${customFields?.currentCommissions || "Not specified"}
- 2-Year Target Gross Commissions: ${customFields?.targetCommissions || "Not specified"}
- Biggest Current Business Challenge: ${customFields?.biggestChallenge || "Not specified"}
- Niche: ${customFields?.niche || "Not specified"}

Your task is to craft an exceptional, advanced marketing plan that makes the agent feel unstoppable.

Sections:
1. **Psychological Summary (250–300 words)** — Provide deep insight into how this Realtor’s unique profile + archetype will influence how they should market themselves.
2. **Personal Brand & Social Strategy** — Give real, actionable branding moves and specific social tactics they can deploy.
3. **Marketing Campaigns & Partnerships** — Lay out real-world steps they should take to generate quality leads and strategic partnerships.

Use clear headings, bullet points, and bold key ideas. Be direct, real-world, and plug-and-play.
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
        max_tokens: 1200
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
