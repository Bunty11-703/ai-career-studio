document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("auditBtn").addEventListener("click", runAudit);
});

async function runAudit() {
  const resumeFile = document.getElementById("resumeFile").files[0];
  const jdText = document.getElementById("jdInput").value.trim();

  const loading = document.getElementById("loadingText");
  const errorText = document.getElementById("errorText");
  const results = document.getElementById("results");

  errorText.classList.add("hidden");
  results.classList.add("hidden");

  if (!resumeFile || !jdText) {
    errorText.textContent = "Please upload a resume and paste a job description.";
    errorText.classList.remove("hidden");
    return;
  }

  loading.classList.remove("hidden");

  try {
    const resumeText = await extractTextFromPDF(resumeFile);
    const audit = analyzeATS(resumeText, jdText);

    loading.classList.add("hidden");
    renderResults(audit);
    results.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    errorText.textContent = "Failed to analyze resume.";
    errorText.classList.remove("hidden");
    console.error(err);
  }
}

/* =============================
   PDF TEXT EXTRACTION (REAL)
   ============================= */

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str);
    fullText += strings.join(" ") + " ";
  }

  return fullText;
}

/* =============================
   ATS ANALYSIS (FIXED)
   ============================= */

function analyzeATS(resumeText, jdText) {
  const resumeTokens = tokenize(resumeText);
  const jdTokens = tokenize(jdText);

  const jdKeywords = extractKeywords(jdText, 30);
  const resumeSet = new Set(resumeTokens);

  const matched = jdKeywords.filter(k => resumeSet.has(k));
  const missing = jdKeywords.filter(k => !resumeSet.has(k));

  const keywordScore = matched.length / jdKeywords.length;
  const similarity = cosineSimilarity(
    termFrequency(resumeTokens),
    termFrequency(jdTokens)
  );

  const atsScore = Math.round(
    (keywordScore * 0.65 + similarity * 0.35) * 100
  );

  return {
    matchScore: Math.round(keywordScore * 100),
    atsScore: Math.min(100, atsScore),
    missingKeywords: missing.slice(0, 8),
    summary: buildSummary(atsScore, missing)
  };
}

/* =============================
   NLP HELPERS
   ============================= */

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOPWORDS.has(w));
}

function termFrequency(tokens) {
  const tf = {};
  tokens.forEach(t => (tf[t] = (tf[t] || 0) + 1));
  return tf;
}

function cosineSimilarity(tf1, tf2) {
  const terms = new Set([...Object.keys(tf1), ...Object.keys(tf2)]);
  let dot = 0, mag1 = 0, mag2 = 0;

  terms.forEach(t => {
    const a = tf1[t] || 0;
    const b = tf2[t] || 0;
    dot += a * b;
    mag1 += a * a;
    mag2 += b * b;
  });

  return mag1 && mag2 ? dot / Math.sqrt(mag1 * mag2) : 0;
}

function extractKeywords(text, limit) {
  const tokens = tokenize(text);
  const freq = termFrequency(tokens);

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function buildSummary(score, missing) {
  if (score >= 80)
    return "Strong ATS alignment. Resume is highly relevant.";
  if (score >= 60)
    return `Moderate match. Add keywords like ${missing.slice(0, 3).join(", ")}.`;
  return "Low ATS match. Resume needs optimization.";
}

const STOPWORDS = new Set([
  "the","and","for","with","this","that","from","are","was","were",
  "have","has","job","role","experience","years","skills","work"
]);

/* =============================
   UI
   ============================= */

function renderResults(data) {
  document.getElementById("results").innerHTML = `
    <div class="result-block">
      <h3>Match Score</h3>
      <p class="metric">${data.matchScore}%</p>
    </div>

    <div class="result-block">
      <h3>ATS Compatibility</h3>
      <p class="metric">${data.atsScore}%</p>
    </div>

    <div class="result-block">
      <h3>Missing Keywords</h3>
      <ul>${data.missingKeywords.map(k => `<li>${k}</li>`).join("")}</ul>
    </div>

    <div class="result-block">
      <h3>Summary</h3>
      <p>${data.summary}</p>
    </div>
  `;
}
