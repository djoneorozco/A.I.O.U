// ================================
// #1 — Variables & Setup
// ================================
let currentQuestion = 0;

// MBTI scoring axes
let scores = {
  I: 0,
  E: 0,
  S: 0,
  N: 0,
  T: 0,
  F: 0,
  J: 0,
  P: 0
};

// ================================
// #2 — Load Questions from JSON
// ================================
let questions = [];

fetch('questions.json')
  .then(response => response.json())
  .then(data => {
    questions = data;
    showQuestion();
  })
  .catch(error => console.error('Error loading questions:', error));

// ================================
// #3 — Show Current Question
// ================================
function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').innerText = q.question;

  const answersDiv = document.getElementById('answers');
  answersDiv.innerHTML = '';

  q.answers.forEach(ans => {
    const btn = document.createElement('button');
    btn.innerText = ans.text;
    btn.classList.add('likert-btn'); // for styling
    btn.onclick = () => selectAnswer(ans);
    answersDiv.appendChild(btn);
  });

  const progressDiv = document.getElementById('progress');
  if (progressDiv) {
    progressDiv.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
  }
}

// ================================
// #4 — Handle Answer Selection
// ================================
function selectAnswer(answer) {
  // If value is positive, it goes to axis, negative goes to the opposite
  if (answer.value > 0) {
    scores[answer.axis] += answer.value;
  } else if (answer.value < 0) {
    const opposite = getOppositeAxis(answer.axis);
    scores[opposite] += Math.abs(answer.value);
  }

  currentQuestion++;

  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    calculateResult();
  }
}

// ================================
// #5 — Calculate Final MBTI Type
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
// #6 — Opposite Axis Helper
// ================================
function getOppositeAxis(axis) {
  switch (axis) {
    case 'E': return 'I';
    case 'I': return 'E';
    case 'S': return 'N';
    case 'N': return 'S';
    case 'T': return 'F';
    case 'F': return 'T';
    case 'J': return 'P';
    case 'P': return 'J';
    default: return axis;
  }
}

// ================================
// #7 — GPT Fetch & Display on Results Page
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const mbtiTypeEl = document.getElementById('mbtiType');
  const gptOutputEl = document.getElementById('gptOutput');

  if (mbtiTypeEl) {
    const mbtiResult = localStorage.getItem('mbtiResult') || 'Unknown';
    mbtiTypeEl.innerText = mbtiResult;

    if (gptOutputEl) {
      const prompt = `
You are an Ivy League real estate coach.
The agent’s MBTI type is ${mbtiResult}.
Write a 200-word custom marketing plan for this agent.
Include:
- Best-fit target market
- Lead generation channels
- Social media style
- Brand colors & vibe.
Be punchy, motivating, Realtor-specific, and share-worthy.
`;

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_OPENAI_API_KEY"
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt }
          ],
          max_tokens: 300
        })
      })
        .then(response => response.json())
        .then(data => {
          const aiResponse = data.choices[0].message.content;
          gptOutputEl.innerText = aiResponse;
        })
        .catch(error => {
          console.error("OpenAI API Error:", error);
          gptOutputEl.innerText = "Oops! Couldn’t get your plan. Try again.";
        });
    }
  }
});
