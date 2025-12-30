/* ===============================
   Salary Predictor (Combo Box)
   =============================== */

let salaryData = [];
let salaryChart;
let jobTitles = [];

const USD_TO_INR = 83;

// Experience → seniority bucket
function getSeniority(exp) {
  if (exp <= 2) return "junior";
  if (exp <= 5) return "mid";
  return "senior";
}

/* ===============================
   Load Dataset
   =============================== */
fetch("data/glassdoor-salaries.json")
  .then(res => res.json())
  .then(data => {
    salaryData = data;

    // Unique job titles
    jobTitles = [...new Set(
      salaryData.map(j => j["Job Title"]).filter(Boolean)
    )].sort();

    initComboBox();
  })
  .catch(err => {
    console.error("Dataset load failed:", err);
  });

/* ===============================
   Combo Box Logic
   =============================== */
function initComboBox() {
  const input = document.getElementById("jobRole");
  const dropdown = document.getElementById("jobList");

  function renderList(filter = "") {
    dropdown.innerHTML = "";

    const matches = jobTitles
      .filter(j => j.toLowerCase().includes(filter.toLowerCase()))
      .slice(0, 10);

    if (matches.length === 0) {
      dropdown.innerHTML =
        `<div class="empty">No matching roles</div>`;
      return;
    }

    matches.forEach(job => {
      const item = document.createElement("div");
      item.textContent = job;
      item.onclick = () => {
        input.value = job;
        dropdown.classList.add("hidden");
      };
      dropdown.appendChild(item);
    });
  }

  // Open on focus
  input.addEventListener("focus", () => {
    renderList(input.value);
    dropdown.classList.remove("hidden");
  });

  // Filter on typing
  input.addEventListener("input", () => {
    renderList(input.value);
    dropdown.classList.remove("hidden");
  });

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (!e.target.closest(".combo-box")) {
      dropdown.classList.add("hidden");
    }
  });
}

/* ===============================
   Predict Salary
   =============================== */
document.getElementById("predictBtn").addEventListener("click", predictSalary);

function predictSalary() {
  const exp = Number(document.getElementById("expInput").value);
  const role = document.getElementById("jobRole").value.trim();

  if (!exp || !role) {
    alert("Please enter experience and select a job role.");
    return;
  }

  const seniority = getSeniority(exp);

  const matches = salaryData.filter(item =>
    item["Job Title"] === role &&
    item.avg_salary
  );

  if (matches.length === 0) {
    document.getElementById("salaryOutput").textContent =
      "No data available for this role";
    return;
  }

  const avgUSD =
    matches.reduce((sum, j) => sum + j.avg_salary, 0) / matches.length;

  const finalINR = Math.round(avgUSD * 1000 * USD_TO_INR);
  const variance = Math.round(finalINR * 0.12);

  const min = finalINR - variance;
  const max = finalINR + variance;

  document.getElementById("salaryOutput").textContent =
    `₹ ${min.toLocaleString("en-IN")} – ₹ ${max.toLocaleString("en-IN")}`;

  renderSalaryChart(finalINR);
}

/* ===============================
   Salary Growth Chart
   =============================== */
function renderSalaryChart(base) {
  const ctx = document.getElementById("salaryChart");

  const growth = [
    base,
    base * 1.1,
    base * 1.22,
    base * 1.35,
    base * 1.5
  ];

  if (salaryChart) salaryChart.destroy();

  salaryChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Now", "1 Yr", "2 Yrs", "3 Yrs", "5 Yrs"],
      datasets: [{
        label: "Projected Salary Growth",
        data: growth,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } }
    }
  });
}
