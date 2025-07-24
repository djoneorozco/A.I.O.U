// ================================
// #1 — Variables & Setup
// ================================
let currentQuestion = 0;

let scores = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

// BrandVoice MBTI Business Matrix
const mbtiMap = {
  "ENTJ": { name: "The Commanding Strategist", strength: "Vision, structure, B2B dominance", industry: "Tech, consulting", branding: "Elite, bold, monochrome", tone: "Confident, assertive, crisp" },
  "INTJ": { name: "The Vision Architect", strength: "Systems thinking, long-game strategy", industry: "Fintech, SaaS", branding: "Minimal, future-forward", tone: "Precise, logical, measured" },
  "ENTP": { name: "The Challenger Voice", strength: "Disruptive creativity, energy", industry: "Startups, media", branding: "Colorful, dynamic, bold", tone: "Witty, energetic, quick" },
  "INTP": { name: "The Deep Diver", strength: "Frameworks, clarity, unique lens", industry: "AI, academia, open source", branding: "Clean, diagram-heavy", tone: "Analytical, thought-provoking" },
  "ENFJ": { name: "The Empathic Guide", strength: "Brand storytelling, emotional arcs", industry: "HR tech, lifestyle brands", branding: "Soft, cinematic", tone: "Warm, inspiring, hopeful" },
  "INFJ": { name: "The Quiet Influence", strength: "Purpose-driven messaging", industry: "Nonprofits, wellness", branding: "Whitespace, calm colors", tone: "Intentional, elevated" },
  "ENFP": { name: "The Magnetic Spark", strength: "Excitement, human connection", industry: "Events, lifestyle startups", branding: "Pastel-bold fusion", tone: "Playful, flowing, inviting" },
  "INFP": { name: "The Brand Soul", strength: "Authenticity, story-rich positioning", industry: "Artisan, ethical brands", branding: "Textured, heartfelt, indie", tone: "Soft, emotional, vivid" },
  "ESTJ": { name: "The Execution Voice", strength: "Process, clarity, delegation", industry: "Ops, B2B SaaS", branding: "Grids, checklists, blue-gray", tone: "Direct, sharp, reliable" },
  "ISTJ": { name: "The Framework Builder", strength: "Templates, systems, credibility", industry: "Compliance, law, defense", branding: "Orderly, timeless", tone: "Professional, grounded" },
  "ESTP": { name: "The Launch Machine", strength: "Rapid campaign rollouts", industry: "Sales-tech, launch startups", branding: "Pop color, performance-driven", tone: "Fast, bold, high-energy" },
  "ISTP": { name: "The Efficient Engineer", strength: "Simple design, UX flow", industry: "Product design, dev tools", branding: "Modular, raw code aesthetic", tone: "Clean, efficient" },
  "ESFP": { name: "The Social Firestarter", strength: "Visibility, experiential marketing", industry: "Influencer brands, fashion-tech", branding: "Shiny, fun, animated", tone: "Loud, sparkle energy" },
  "ISFP": { name: "The Brand Curator", strength: "Design sensibility, product taste", industry: "Boutique brands, interior tools", branding: "Muted luxe, visual first", tone: "Chic, thoughtful" },
  "ESFJ": { name: "The Community Voice", strength: "Group-focused messages", industry: "Edu-tech, platform apps", branding: "Cheerful palettes, safe vibe", tone: "Friendly, polished" },
  "ISFJ": { name: "The Trust Builder", strength: "Brand consistency, long-term messaging", industry: "Legacy firms, medical tech", branding: "Soft brandbook look", tone: "Steady, humble, loyal" }
};

// ================================
// #2 — Load Questions
// ================================
let questions = [];
fetch('questions.json')
  .then(res => res.json())
  .then(data => { questions = data; })
  .catch(err => console.error('Error loading questions:', err));

// ================================
// #3 — Start Quiz Button
// ================================
const startQuizBtn = document.getElementById('startQuizBtn');
if (startQuizBtn) {
  startQuizBtn.addEventListener('click', () => {
    const userData = {
      company: document.getElementById('company').value.trim(),
      founderTitle: document.getElementById('founderTitle').value.trim(),
      industry: document.getElementById('industry').value.trim(),
      currentStage: document.getElementById('currentStage').value.trim(),
      targetAudience: document.getElementById('targetAudience').value.trim(),
      brandChallenge: document.getElementById('brandChallenge').value.trim(),
      revenue: document.getElementById('revenue').value.trim()
    };
    localStorage.setItem('customFields', JSON.stringify(userData));
    document.getElementById('customFields').style.display = 'none';
    document.getElementById('quizSection').style.display = 'block';
    showQuestion();
  });
}

// ================================
// #4 — Show Question
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
// #5 — Handle Answer
// ================================
function selectAnswer(answer) {
  if (answer.value > 0) scores[answer.axis] += answer.value;
  else scores[getOppositeAxis(answer.axis)] += Math.abs(answer.value);
  currentQuestion++;
  if (currentQuestion < questions.length) showQuestion();
  else calculateResult();
}

// ================================
// #6 — Calculate MBTI
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
// #7 — Opposite Axis
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
// #8 — Load Results Page
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const mbtiTypeEl = document.getElementById('mbtiType');
  const mbtiNameEl = document.getElementById('mbtiName');
  const mbtiDetailsEl = document.getElementById('mbtiDetails');
  const insightOutputEl = document.getElementById('insightOutput');
  const planOutputEl = document.getElementById('planOutput');
  const flyerEl = document.getElementById('archetypeFlyer');

  const mbtiResult = localStorage.getItem('mbtiResult') || 'Unknown';
  if (mbtiTypeEl) mbtiTypeEl.innerText = mbtiResult;

  const details = mbtiMap[mbtiResult] || {
    name: "Unknown", strength: "—", industry: "—", branding: "—", tone: "—"
  };
  if (mbtiNameEl) mbtiNameEl.innerText = details.name;
  if (mbtiDetailsEl) {
    mbtiDetailsEl.innerHTML = `
      <strong>Strength:</strong> ${details.strength}<br>
      <strong>Industry:</strong> ${details.industry}<br>
      <strong>Branding:</strong> ${details.branding}<br>
      <strong>Tone:</strong> ${details.tone}
    `;
  }

  if (flyerEl) {
    flyerEl.src = `images/${mbtiResult}.png`;
    flyerEl.alt = `${mbtiResult} BrandVoice Flyer`;
    flyerEl.classList.add('revealDown');
  }

  const customFields = JSON.parse(localStorage.getItem('customFields') || '{}');

  fetch('/.netlify/functions/getInsight', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mbti: mbtiResult, details, customFields })
  })
    .then(res => res.json())
    .then(data => {
      insightOutputEl.innerText = data.insight || "No insight generated.";
    })
    .catch(err => {
      console.error("Insight Load Error:", err);
      insightOutputEl.innerText = "Oops! Couldn’t load your insight.";
    });

  fetch(`/.netlify/functions/getPlan?mbti=${mbtiResult}`)
    .then(res => res.text())
    .then(plan => {
      planOutputEl.innerText = plan || "No plan found.";
    })
    .catch(err => {
      console.error("Plan Load Error:", err);
      planOutputEl.innerText = "Oops! Couldn’t load your plan.";
    });
});
