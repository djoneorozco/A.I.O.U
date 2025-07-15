// ==============================
// getInsight.js — Netlify Function (IVY 2.99)
// ==============================

import { readFileSync, existsSync } from 'fs';
import path from 'path';

export async function handler(event, context) {
  try {
    const { mbti, details, customFields } = JSON.parse(event.body || '{}');

    if (!mbti) {
      return {
        statusCode: 400,
        body: JSON.stringify({ insight: '', plan: '', message: "No MBTI provided." })
      };
    }

    // ============================
    // #1 — Load Static Plan (.md)
    // ============================
    const planPath = path.join(process.cwd(), 'plans', `${mbti}.md`);
    let plan = "Plan not found.";

    if (existsSync(planPath)) {
      plan = readFileSync(planPath, 'utf-8');
    }

    // ============================
    // #2 — Generate AI Insight
    // ============================
    const prompt = `
You are an elite Fortune 500 real estate strategist.

Secret Passcode: ListingLock.

**MBTI Realtor Archetype:** ${mbti} — ${details.name}
Core Strength: ${details.strength}
Target Market: ${details.market}
Price Range: ${details.priceRange}
Area: ${details.area}
Brand Vibe: ${details.vibe}

**Custom Realtor Profile:**
- City/Primary Market: ${customFields?.city || "Not specified"}
- Years of Experience: ${customFields?.experience || "Not specified"}
- Buyer Persona: ${customFields?.buyerPersona || "Not specified"}
- Current Gross Commissions: ${customFields?.currentCommissions || "Not specified"}
- 2-Year Target Commissions: ${customFields?.targetCommissions || "Not specified"}
- Current Business Challenge: ${customFields?.biggestChallenge || "Not specified"}
- Niche: ${customFields?.niche || "Not specified"}

👉 Your task:
- Provide a **1-paragraph summary** of how this custom business info aligns with the Realtor’s MBTI archetype.
- Then deliver a clear **Action Plan** that gives them 3-5 steps they can implement to overcome their biggest challenge and achieve their 2-year target.
- Be direct, realistic, and use bullet points.
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
          { role: "system", content: "You are an Ivy League real estate strategist." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI Error:", errText);
      return {
        statusCode: openaiRes.status,
        body: JSON.stringify({ insight: '', plan, message: "OpenAI API error.", detail: errText })
      };
    }

    const data = await openaiRes.json();
    const insight = data.choices[0].message.content || "No insight generated.";

    return {
      statusCode: 200,
      body: JSON.stringify({ insight, plan })
    };

  } catch (err) {
    console.error("getInsight Handler Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ insight: '', plan: '', message: "Server error.", detail: err.toString() })
    };
  }
}
