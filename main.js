// ================================
// #1 — Variables & Setup
// ================================
let currentQuestion = 0;

let scores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

const mbtiMap = {
  "ENTJ": { name: "The Commander Agent", strength: "Leadership, bold deal-making", market: "Luxury investors, big developers", priceRange: "High-end, 7-figure +", area: "Urban luxury", vibe: "Bold, high-contrast, status" },
  "INTJ": { name: "The Visionary Agent", strength: "Strategy, long-term planning", market: "Commercial & mixed-use buyers", priceRange: "Large portfolios", area: "Growth corridors", vibe: "Sleek, minimal, sophisticated" },
  "ENTP": { name: "The Disruptor Agent", strength: "Innovative, challenger mindset", market: "First-time investors, flips", priceRange: "Mid-high, value deals", area: "Up-and-coming", vibe: "Trendy, punchy, modern" },
  "INTP": { name: "The Strategist Agent", strength: "Analytical, problem-solving", market: "Data-driven buyers, remote buyers", priceRange: "Any, but value-driven", area: "Suburban, niche", vibe: "Neutral, clean, data-focused" },
  "ENFJ": { name: "The Advocate Agent", strength: "Inspiring, relationship-driven", market: "Young families, relocators", priceRange: "Middle to high", area: "Family suburbs", vibe: "Warm, inviting, community" },
  "INFJ": { name: "The Advisor Agent", strength: "Empathy, trusted confidante", market: "Seniors, downsizers", priceRange: "Middle range", area: "Established neighborhoods", vibe: "Soft, timeless, trust-rich" },
  "ENFP": { name: "The Connector Agent", strength: "Outgoing, social, big sphere", market: "Lifestyle buyers, relocators", priceRange: "Mid-high, unique homes", area: "Artsy districts", vibe: "Playful, colorful, casual" },
  "INFP": { name: "The Heartfelt Agent", strength: "Authentic, story-driven", market: "First-time buyers, life transitions", priceRange: "Entry to middle", area: "Historic or cozy", vibe: "Whimsical, vintage, soulful" },
  "ESTJ": { name: "The Rainmaker Agent", strength: "Organized, process-driven", market: "Investors, rental portfolios", priceRange: "Mid-high, multi-units", area: "Urban core", vibe: "Strong, structured, bold" },
  "ISTJ": { name: "The Analyst Agent", strength: "Diligent, detail-focused", market: "Repeat buyers, military moves", priceRange: "Any, steady volume", area: "Anywhere stable", vibe: "Conservative, clean, reliable" },
  "ESTP": { name: "The Closer Agent", strength: "Bold, action-oriented", market: "Fix/Flip investors, time-sensitive", priceRange: "Bargain to mid", area: "Flips, distressed", vibe: "Flashy, direct, energetic" },
  "ISTP": { name: "The Fixer Agent", strength: "Hands-on, practical", market: "Contractors, DIY investors", priceRange: "Bargain to mid", area: "Older homes, fixers", vibe: "Rugged, industrial, DIY" },
  "ESFJ": { name: "The Community Agent", strength: "Connector, well-known locally", market: "Neighborhood families, repeat clients", priceRange: "Middle range", area: "Tight-knit suburbs", vibe: "Friendly, approachable, local" },
  "ISFJ": { name: "The Nurturer Agent", strength: "Patient, caring, word-of-mouth", market: "Seniors, single parents, VA buyers", priceRange: "Entry to mid", area: "Suburban or rural", vibe: "Soft, trust-based, pastel" },
  "ESFP": { name: "The Networker Agent", strength: "Social butterfly, event-driven", market: "Lifestyle buyers, relocators", priceRange: "Any, flashy homes", area: "Trendy neighborhoods", vibe: "Bold colors, big photos, fun" },
  "ISFP": { name: "The Lifestyle Agent", strength: "Creative, design-oriented", market: "Boutique buyers, second homes", priceRange: "Mid-high, unique properties", area: "Arts districts, retreats", vibe: "Artsy, elegant, curated" }
};

// ================================
// #2 — Load Questions
// ================================
let questions = [];
fetch('questions.json')
  .then(res => res.json())
  .then(data => { questions = data; showQuestion(); })
  .catch(err => console.error('Error loading questions:', err));

// ================================
// #3 — Show Question
// ================================
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').innerText = q.question;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';
  q.answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.innerText = ans.text;
    btn.classList.add('likert-btn');
    btn.onclick = () => selectAnswer(ans);
    answersDiv.appendChild(btn);
  });

  const progressDiv = document.getElementById('progress');
  if (progressDiv) progressDiv.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

// ================================
// #4 — Handle Answer
// ================================
function selectAnswer(answer) {
  if (answer.value > 0) scores[answer.axis] += answer.value;
  else scores[getOppositeAxis(answer.axis)] += Math.abs(answer.value);

  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else calculateResult();
}

// ================================
// #5 — Calculate MBTI
// ================================
function calculateResult() {
  let mbti = '';
  mbti += scores.E >= scores.I ? 'E' : 'I';
  mbti += scores.S >= scores.N ? 'S' : 'N';
  mbti += scores.T >= scores.F ? 'T' : 'F';
  mbti += scores.J >= scores.P ? 'J' : 'P';

  console.log('MBTI Result:', mbti);
  localStorage.setItem('mbtiResult', mbti);
  window.location.href = 'results.html';
}

// ================================
// #6 — Opposite Axis
// ================================
function getOppositeAxis(axis) {
  switch (axis) {
    case 'E': return 'I'; case 'I': return 'E';
    case 'S': return 'N'; case 'N': return 'S';
    case 'T': return 'F'; case 'F': return 'T';
    case 'J': return 'P'; case 'P': return 'J';
    default: return axis;
  }
}

// ================================
// #7 — Results: GPT Fetch to Netlify Function
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const mbtiTypeEl = document.getElementById('mbtiType');
  const archetypeNameEl = document.getElementById('mbtiName');
  const archetypeDetailsEl = document.getElementById('mbtiDetails');
  const gptOutputEl = document.getElementById('gptOutput');
  const flyerEl = document.getElementById('archetypeFlyer');

  const mbtiResult = localStorage.getItem('mbtiResult') || 'Unknown';
  if (mbtiTypeEl) mbtiTypeEl.innerText = mbtiResult;

  const details = mbtiMap[mbtiResult] || { name: "Unknown", strength: "—", market: "—", priceRange: "—", area: "—", vibe: "—" };
  if (archetypeNameEl) archetypeNameEl.innerText = details.name;
  if (archetypeDetailsEl) {
    archetypeDetailsEl.innerHTML = `
      <strong>Strength:</strong> ${details.strength}<br>
      <strong>Market:</strong> ${details.market}<br>
      <strong>Price Range:</strong> ${details.priceRange}<br>
      <strong>Area:</strong> ${details.area}<br>
      <strong>Vibe:</strong> ${details.vibe}
    `;
  }
  if (flyerEl) {
    flyerEl.src = `images/${mbtiResult}.png`;
    flyerEl.alt = `${mbtiResult} Realtor Flyer`;
  }

  if (gptOutputEl) {
    fetch('/.netlify/functions/gptHandler', {
      method: "POST",
      body: JSON.stringify({
        mbti: mbtiResult,
        details
      })
    })
      .then(res => res.json())
      .then(data => {
        gptOutputEl.innerText = data.message || "No plan generated.";
      })
      .catch(err => {
        console.error("Serverless Function Error:", err);
        gptOutputEl.innerText = "Oops! Couldn’t get your plan. Try again.";
      });
  }
});
