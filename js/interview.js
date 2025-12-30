/* ======================================
   INTERVIEW PRO – CLEAN & FIXED
   ====================================== */

/* ---------- Persistent History ---------- */
let interviewHistory =
  JSON.parse(localStorage.getItem("interviewHistory")) || [];

/* ---------- Question Tracking ---------- */
let usedQuestions = new Set();

/* ---------- Question Bank ---------- */
const QUESTION_BANK = {
  data: {
    junior: [
      "Tell me about a dataset you worked with and how you cleaned it.",
      "Describe how you used data to answer a business question."
    ],
    mid: [
      "Explain a project where your analysis influenced a decision.",
      "How did you ensure data quality and reliability?"
    ],
    senior: [
      "Tell me about a time you challenged stakeholders using data.",
      "How have you designed analytics systems at scale?"
    ]
  },

  ml: {
    junior: [
      "Describe a machine learning model you built.",
      "How did you evaluate your model?"
    ],
    mid: [
      "Explain how you handled overfitting.",
      "Describe an ML pipeline you deployed."
    ],
    senior: [
      "Tell me about managing model drift.",
      "Describe a trade-off you made in model design."
    ]
  },

  devops: {
    junior: [
      "Describe your experience with CI/CD pipelines.",
      "How have you handled deployment failures?"
    ],
    mid: [
      "Explain how you improved system reliability.",
      "Describe an incident you helped resolve."
    ],
    senior: [
      "How do you design fault-tolerant systems?",
      "How do you balance speed vs stability?"
    ]
  },

  swe: {
    junior: [
      "Describe a feature you implemented end-to-end.",
      "How do you debug production issues?"
    ],
    mid: [
      "Tell me about a refactor you led.",
      "Describe a system design decision you made."
    ],
    senior: [
      "How have you led technical direction?",
      "Describe managing performance vs complexity trade-offs."
    ]
  }
};

/* ---------- Event Listeners ---------- */
document.getElementById("questionBtn").addEventListener("click", generateQuestion);
document.getElementById("feedbackBtn").addEventListener("click", analyzeAnswer);
document.getElementById("exportBtn")?.addEventListener("click", exportReport);

document.getElementById("feedbackBtn").disabled = true;

/* ======================================
   GENERATE QUESTION (NO REPEAT)
   ====================================== */
function generateQuestion() {
  const role = document.getElementById("roleSelect").value;
  const level = document.getElementById("levelSelect").value;
  const box = document.getElementById("questionBox");

  const pool = QUESTION_BANK[role][level].filter(
    q => !usedQuestions.has(q)
  );

  if (pool.length === 0) {
    box.textContent =
      "No more questions left for this role and level.";
    box.classList.remove("hidden");
    return;
  }

  const question = pool[Math.floor(Math.random() * pool.length)];
  usedQuestions.add(question);

  box.textContent = question;
  box.classList.remove("hidden");
  document.getElementById("feedbackBtn").disabled = false;
}

/* ======================================
   ANALYZE ANSWER (STAR)
   ====================================== */
function analyzeAnswer() {
  const answer = document.getElementById("answerInput").value.trim();
  const feedback = document.getElementById("feedbackBox");

  if (!answer) {
    feedback.textContent = "Please write an answer first.";
    feedback.classList.remove("hidden");
    return;
  }

  const star = evaluateSTAR(answer);

  document.getElementById("confidenceFill").style.width =
    (star.score / 4) * 100 + "%";

  feedback.innerHTML = `
    <h3>STAR Feedback</h3>
    <ul>
      <li>${star.S ? "✓ Situation" : "✗ Situation missing"}</li>
      <li>${star.T ? "✓ Task" : "✗ Task unclear"}</li>
      <li>${star.A ? "✓ Action" : "✗ Action weak"}</li>
      <li>${star.R ? "✓ Result" : "✗ Result not quantified"}</li>
    </ul>
    <p><strong>Score:</strong> ${star.score}/4</p>
    ${star.tips}
    ${followUpQuestion(star)}
  `;

  feedback.classList.remove("hidden");
  saveHistory(star.score);
}

/* ======================================
   STAR EVALUATION
   ====================================== */
function evaluateSTAR(text) {
  const S = /situation|context|background/i.test(text);
  const T = /task|responsibility|goal/i.test(text);
  const A = /action|implemented|built|led|executed/i.test(text);
  const R = /result|impact|improved|increased|reduced|\d+%|\d+/i.test(text);

  const score = [S, T, A, R].filter(Boolean).length;

  let tips = "<h4>Improve by adding:</h4><ul>";
  if (!S) tips += "<li>Context of the situation</li>";
  if (!T) tips += "<li>Your specific responsibility</li>";
  if (!A) tips += "<li>Concrete actions you took</li>";
  if (!R) tips += "<li>Measurable results</li>";
  tips += "</ul>";

  return { S, T, A, R, score, tips };
}

/* ======================================
   FOLLOW-UP QUESTION
   ====================================== */
function followUpQuestion(star) {
  if (!star.R)
    return "<p><strong>Follow-up:</strong> What measurable impact did this have?</p>";
  if (!star.A)
    return "<p><strong>Follow-up:</strong> What exact steps did you take?</p>";
  if (!star.T)
    return "<p><strong>Follow-up:</strong> What was your responsibility?</p>";
  if (!star.S)
    return "<p><strong>Follow-up:</strong> What was the broader context?</p>";
  return "";
}

/* ======================================
   HISTORY + EXPORT
   ====================================== */
function saveHistory(score) {
  interviewHistory.unshift({
    question: document.getElementById("questionBox").textContent,
    score,
    date: new Date().toLocaleString()
  });

  interviewHistory = interviewHistory.slice(0, 5);
  localStorage.setItem("interviewHistory", JSON.stringify(interviewHistory));
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("historyList");
  if (!container) return;

  container.innerHTML = interviewHistory.length
    ? interviewHistory
        .map(
          h => `
          <div class="history-item">
            <p><strong>Score:</strong> ${h.score}/4</p>
            <p class="meta">${h.date}</p>
          </div>`
        )
        .join("")
    : "<p class='hint'>No attempts yet.</p>";
}

function exportReport() {
  if (!interviewHistory.length) {
    alert("No interview history to export.");
    return;
  }

  let report = "INTERVIEW PRACTICE REPORT\n\n";
  interviewHistory.forEach((h, i) => {
    report += `Attempt ${i + 1}: ${h.score}/4 (${h.date})\n`;
  });

  const blob = new Blob([report], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "interview-report.txt";
  a.click();
}

/* ---------- Load History ---------- */
renderHistory();
  