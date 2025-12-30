// Resume Audit snapshot
const audit = JSON.parse(localStorage.getItem("lastAudit"));
if (audit) {
  document.getElementById("auditStatus").textContent =
    `Match: ${audit.matchScore}% | ATS: ${audit.atsScore}%`;
}

// Salary snapshot
const salary = JSON.parse(localStorage.getItem("lastSalary"));
if (salary) {
  document.getElementById("salaryStatus").textContent =
    `₹ ${salary.toLocaleString("en-IN")}`;
}

// Interview snapshot
const history = JSON.parse(localStorage.getItem("interviewHistory")) || [];
document.getElementById("interviewStatus").textContent =
  `${history.length} sessions completed`;
