const API_URL = "/api/grades";

const gradeForm = document.getElementById("grade-form");
const gradeIdInput = document.getElementById("grade-id");
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
};

const renderGrades = (grades) => {
  if (!grades.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">No grade records found. Add your first subject.</td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = grades
    .map(
      (grade) => `
        <tr>
          <td>${grade.subject}</td>
          <td>${grade.marks}</td>
          <td>
            <div class="action-buttons">
              <button class="action-btn secondary edit-btn" data-id="${grade._id}" data-subject="${grade.subject}" data-marks="${grade.marks}">
                Edit
              </button>
              <button class="action-btn danger delete-btn" data-id="${grade._id}">
                Delete
              </button>
            </div>
          </td>
        </tr>
      `
    )
    .join("");
};

const fetchGrades = async () => {
  try {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="empty-state">Loading data...</td>
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
        <td colspan="3" class="empty-state">Failed to load data.</td>
      </tr>
    `;
    showMessage(error.message, "error");
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const id = gradeIdInput.value;
  const subject = subjectInput.value.trim();
  const marks = Number(marksInput.value);

  if (!subject || Number.isNaN(marks)) {
    showMessage("Please enter valid subject and marks.", "error");
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
      body: JSON.stringify({ subject, marks })
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
