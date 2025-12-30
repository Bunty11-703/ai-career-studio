/* ======================================================
   Resume Tools – AI Career Studio
   ====================================================== */

/* -------------------------------
   Action Verb Rewriter
-------------------------------- */

const rewriteBtn = document.getElementById("rewriteBtn");
const bulletInput = document.getElementById("bulletInput");
const rewriteOutput = document.getElementById("rewriteOutput");
const clearRewriteBtn = document.getElementById("clearRewriteBtn");

const VERB_MAP = {
  "responsible for": "led",
  "worked on": "developed",
  "helped": "assisted",
  "did": "executed",
  "handled": "managed",
  "was involved in": "contributed to"
};

rewriteBtn.addEventListener("click", () => {
  const input = bulletInput.value.trim();

  if (!input) {
    rewriteOutput.classList.remove("hidden");
    rewriteOutput.innerHTML = `<span class="error">Please enter a bullet point.</span>`;
    return;
  }

  let improved = input;

  Object.entries(VERB_MAP).forEach(([weak, strong]) => {
    const regex = new RegExp(`\\b${weak}\\b`, "gi");
    improved = improved.replace(regex, strong);
  });

  rewriteOutput.classList.remove("hidden");
  rewriteOutput.innerHTML = `
    <strong>Suggested Rewrite:</strong><br>
    ${improved}
  `;
});

if (clearRewriteBtn) {
  clearRewriteBtn.addEventListener("click", () => {
    bulletInput.value = "";
    rewriteOutput.classList.add("hidden");
    rewriteOutput.innerHTML = "";
  });
}

/* -------------------------------
   Keyword & Metrics Analyzer
-------------------------------- */

const analyzeBtn = document.getElementById("analyzeBtn");
const resetBtn = document.getElementById("resetBtn");
const resumeTextArea = document.getElementById("resumeText");
const analysisOutput = document.getElementById("analysisOutput");

const skillStat = document.getElementById("skillStat");
const metricStat = document.getElementById("metricStat");
const scoreStat = document.getElementById("scoreStat");

const SKILLS = [
  "Python",
  "JavaScript",
  "AWS",
  "React",
  "SQL",
  "Docker",
  "Kubernetes",
  "Machine Learning",
  "Data Analysis"
];

analyzeBtn.addEventListener("click", () => {
  const text = resumeTextArea.value.trim();

  if (!text) {
    analysisOutput.classList.remove("hidden");
    analysisOutput.innerHTML = `<span class="error">Paste resume text to analyze.</span>`;
    return;
  }

  let highlighted = text;
  let skillCount = 0;
  let metricCount = 0;

  /* ---- Highlight Skills ---- */
  SKILLS.forEach(skill => {
    const regex = new RegExp(`\\b${skill}\\b`, "gi");
    const matches = highlighted.match(regex);
    if (matches) skillCount += matches.length;
    highlighted = highlighted.replace(regex, `<mark>${skill}</mark>`);
  });

  /* ---- Highlight Metrics ---- */
  const metricRegex = /(\d+%|\$\d+(?:\.\d+)?|\d+\+?)/g;
  const metricMatches = highlighted.match(metricRegex);
  metricCount = metricMatches ? metricMatches.length : 0;
  highlighted = highlighted.replace(
    metricRegex,
    `<span class="metric">$1</span>`
  );

  /* ---- Resume Quality Score (simple + explainable) ---- */
  const score = Math.min(100, skillCount * 10 + metricCount * 15);

  /* ---- Update Stats ---- */
  skillStat.textContent = `Skills: ${skillCount}`;
  metricStat.textContent = `Metrics: ${metricCount}`;
  scoreStat.textContent = `Quality Score: ${score}/100`;

  analysisOutput.classList.remove("hidden");
  analysisOutput.innerHTML = highlighted;
});

/* -------------------------------
   Reset Analyzer
-------------------------------- */

resetBtn.addEventListener("click", () => {
  resumeTextArea.value = "";
  analysisOutput.innerHTML = "";
  analysisOutput.classList.add("hidden");

  skillStat.textContent = "Skills: 0";
  metricStat.textContent = "Metrics: 0";
  scoreStat.textContent = "Quality Score: —";
});
/* ===============================
   STRUCTURE-FIRST Bullet Rewriter
   =============================== */

const inputEl = document.getElementById("bulletInput");
const outputEl = document.getElementById("rewriteOutput");

rewriteBtn.addEventListener("click", () => {
  const text = inputEl.value.trim();

  if (!text) {
    outputEl.innerHTML = `<span class="error">Enter a resume bullet.</span>`;
    return;
  }

  let cleaned = text
    .replace(/^i\s+/i, "")
    .replace(/responsible for|worked on|helped with|involved in|assisted with/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  // Split sentence heuristically
  const parts = cleaned.split(/ using | with | by | through /i);

  let main = parts[0];
  let method = parts[1] ? ` using ${parts[1]}` : "";

  // Check if impact already exists
  const hasImpact = /(improv|increase|reduce|optimi|result|impact|growth|revenue|efficien)/i.test(text);

  const impact = hasImpact
    ? ""
    : " to deliver measurable outcomes";

  const rewritten = `${capitalize(main)}${method}${impact}.`;

  outputEl.innerHTML = `
    <strong>Rewritten Bullet:</strong>
    <div class="status-box" style="margin-top:0.6rem">
      ${rewritten}
    </div>
    <p class="meta">
      💡 Add numbers to strengthen impact (%, scale, revenue, users)
    </p>
  `;
});

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
