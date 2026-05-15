const API_URL = "/api/grades";

const gradeForm = document.getElementById("grade-form");
const gradeIdInput = document.getElementById("grade-id");
const studentNameInput = document.getElementById("student-name");
const subjectInput = document.getElementById("subject");
const marksInput = document.getElementById("marks");
const formTitle = document.getElementById("form-title");
const submitBtn = document.getElementById("submit-btn");
const cancelBtn = document.getElementById("cancel-btn");
const refreshBtn = document.getElementById("refresh-btn");
const messageBox = document.getElementById("message-box");
const tableBody = document.getElementById("grade-table-body");
const totalSubjectsEl = document.getElementById("total-subjects");
const averageMarksEl = document.getElementById("average-marks");
const gpaEl = document.getElementById("gpa");
const heroAverageEl = document.getElementById("hero-average");
const heroSubjectsEl = document.getElementById("hero-subjects");
const heroGpaEl = document.getElementById("hero-gpa");

const showMessage = (message, type = "success") => {
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;

  setTimeout(() => {
    messageBox.textContent = "";
    messageBox.className = "message-box";
  }, 3000);
};

const resetForm = () => {
  gradeForm.reset();
  gradeIdInput.value = "";
  formTitle.textContent = "Add New Subject";
  submitBtn.textContent = "Add Grade";
  cancelBtn.classList.add("hidden");
};

const updateSummary = (summary) => {
  totalSubjectsEl.textContent = summary.totalSubjects;
  averageMarksEl.textContent = summary.averageMarks.toFixed(2);
  gpaEl.textContent = summary.gpa.toFixed(2);
  heroAverageEl.textContent = `${summary.averageMarks.toFixed(2)}%`;
  heroSubjectsEl.textContent = summary.totalSubjects;
  heroGpaEl.textContent = summary.gpa.toFixed(2);
};

const getInitials = (name) => {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
};

const getPerformance = (marks) => {
  if (marks >= 85) {
    return { label: "Excellent", className: "status-excellent" };
  }

  if (marks >= 70) {
    return { label: "Good", className: "status-good" };
  }

  if (marks >= 50) {
    return { label: "Average", className: "status-average" };
  }

  return { label: "Needs Work", className: "status-needs-improvement" };
};

const renderGrades = (grades) => {
  if (!grades.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">No grade records found. Add your first subject.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = grades
    .map((grade) => {
      const studentName = grade.studentName || "-";
      const performance = getPerformance(grade.marks);

      return `
        <tr>
          <td class="student-cell" data-label="Student">
            <div class="student-inline">
              <div class="student-avatar">${getInitials(studentName)}</div>
              <div>
                <span class="student-name-text">${studentName}</span>
                <span class="student-meta">Grade record</span>
              </div>
            </div>
          </td>
          <td data-label="Subject">
            <span class="subject-pill">${grade.subject}</span>
          </td>
          <td class="marks-cell" data-label="Marks">
            <div class="marks-block">
              <span class="marks-value">${grade.marks}</span>
              <span class="status-badge ${performance.className}">${performance.label}</span>
            </div>
          </td>
          <td class="actions-cell" data-label="Actions">
            <div class="action-buttons">
              <button class="action-btn secondary edit-btn" data-id="${grade._id}" data-name="${studentName}" data-subject="${grade.subject}" data-marks="${grade.marks}">
                Edit
              </button>
              <button class="action-btn danger delete-btn" data-id="${grade._id}">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");
};

const fetchGrades = async () => {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">Loading data...</td>
      </tr>
    `;

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to fetch grades");
    }

    renderGrades(data.grades);
    updateSummary(data.summary);
  } catch (error) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">Failed to load data.</td>
      </tr>
    `;
    showMessage(error.message, "error");
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const id = gradeIdInput.value;
  const studentName = studentNameInput.value.trim();
  const subject = subjectInput.value.trim();
  const marks = Number(marksInput.value);

  if (!studentName || !subject || Number.isNaN(marks)) {
    showMessage("Please enter valid student name, subject, and marks.", "error");
    return;
  }

  const method = id ? "PUT" : "POST";
  const url = id ? `${API_URL}/${id}` : API_URL;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentName, subject, marks })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    showMessage(data.message, "success");
    resetForm();
    fetchGrades();
  } catch (error) {
    showMessage(error.message, "error");
  }
};

const handleTableClick = async (event) => {
  if (event.target.classList.contains("edit-btn")) {
    gradeIdInput.value = event.target.dataset.id;
    studentNameInput.value = event.target.dataset.name;
    subjectInput.value = event.target.dataset.subject;
    marksInput.value = event.target.dataset.marks;
    formTitle.textContent = "Edit Subject Grade";
    submitBtn.textContent = "Update Grade";
    cancelBtn.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (event.target.classList.contains("delete-btn")) {
    const id = event.target.dataset.id;
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this grade record?"
    );

    if (!isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Delete failed");
      }

      showMessage(data.message, "success");
      fetchGrades();
    } catch (error) {
      showMessage(error.message, "error");
    }
  }
};

gradeForm.addEventListener("submit", handleSubmit);
cancelBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", fetchGrades);
tableBody.addEventListener("click", handleTableClick);

fetchGrades();
