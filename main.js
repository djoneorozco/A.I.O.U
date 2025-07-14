// ================================
// #1 — Variables & Setup
// ================================
let currentQuestion = 0;
let answers = []; // Store user answers

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

  q.answers.forEach((ans, index) => {
    const btn = document.createElement('button');
    btn.innerText = ans.text;
    btn.onclick = () => selectAnswer(ans);
    answersDiv.appendChild(btn);
  });
}

// ================================
// #4 — Handle Answer Selection
// ================================
function selectAnswer(answer) {
  // Increment relevant MBTI axis
  scores[answer.axis] += answer.value;

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

  // E vs I
  mbti += scores.E >= scores.I ? 'E' : 'I';
  // S vs N
  mbti += scores.S >= scores.N ? 'S' : 'N';
  // T vs F
  mbti += scores.T >= scores.F ? 'T' : 'F';
  // J vs P
  mbti += scores.J >= scores.P ? 'J' : 'P';

  console.log('MBTI Result:', mbti);

  // Save MBTI to localStorage so results.html can read it
  localStorage.setItem('mbtiResult', mbti);

  // Redirect to results page
  window.location.href = 'results.html';
}

// ================================
// #6 — GPT Fetch (ONLY runs on results.html)
// ================================
document.addEventListener('DOMContentLoaded', () => {
  const resultEl = document.getElementById('gptOutput');
  if (resultEl) {
    const mbtiResult = localStorage.getItem('mbtiResult') || 'ENTJ';

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
        resultEl.innerText = aiResponse;
      })
      .catch(error => {
        console.error("OpenAI API Error:", error);
        resultEl.innerText = "Oops! Couldn’t get your plan. Try again.";
      });
  }
});
