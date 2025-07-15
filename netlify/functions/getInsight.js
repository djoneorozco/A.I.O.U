import fs from 'fs';
import path from 'path';

export async function handler(event) {
  try {
    const { mbti, details, customFields } = JSON.parse(event.body);

    // 📁 Read static plan (.md)
    const planPath = path.join(process.cwd(), 'plans', `${mbti}.md`);
    let staticPlan = "Not found.";
    if (fs.existsSync(planPath)) {
      staticPlan = fs.readFileSync(planPath, 'utf-8');
    }

    // 🧠 Build dynamic insight prompt
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

Craft a short, real-world **Summary** and **Action Plan** describing how these custom fields affect the agent's path, and give real advice to help them reach their 2-year goal. Be concise, punchy, direct.
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
        max_tokens: 700
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI API error:", errText);
      return {
        statusCode: openaiRes.status,
        body: JSON.stringify({ message: "OpenAI API error.", detail: errText })
      };
    }

    const data = await openaiRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        insight: data.choices[0].message.content,
        plan: staticPlan
      })
    };

  } catch (err) {
    console.error("Insight Handler Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error.", detail: err.toString() })
    };
  }
}
