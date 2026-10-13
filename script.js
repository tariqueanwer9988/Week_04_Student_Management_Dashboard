
const form = document.getElementById("studentForm");
const studentId = document.getElementById("studentId");
const nameInput = document.getElementById("name");
const rollInput = document.getElementById("roll");
const emailInput = document.getElementById("email");
const courseInput = document.getElementById("course");

const studentTable = document.getElementById("studentTable");
const totalStudents = document.getElementById("totalStudents");
const searchInput = document.getElementById("searchInput");
const courseFilter = document.getElementById("courseFilter");
const emptyMessage = document.getElementById("emptyMessage");

const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formTitle = document.getElementById("formTitle");

let students = JSON.parse(
  localStorage.getItem("students") || "[]"
);

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function renderStudents() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCourse = courseFilter.value;

  const filteredStudents = students.filter(function(student) {
    const matchesSearch =
      student.name.toLowerCase().includes(searchText) ||
      student.roll.toLowerCase().includes(searchText) ||
      student.email.toLowerCase().includes(searchText);

    const matchesCourse =
      selectedCourse === "" || student.course === selectedCourse;

    return matchesSearch && matchesCourse;
  });

  studentTable.replaceChildren();
  totalStudents.textContent = students.length;

  emptyMessage.classList.toggle(
    "hidden",
    filteredStudents.length !== 0
  );

  filteredStudents.forEach(function(student) {
    const row = document.createElement("tr");

    [student.name, student.roll, student.email, student.course]
      .forEach(function(value) {
        const cell = document.createElement("td");
        cell.textContent = value;
        row.appendChild(cell);
      });

    const actions = document.createElement("td");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", function() {
      editStudent(student.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.className = "delete-btn";
    deleteButton.addEventListener("click", function() {
      deleteStudent(student.id);
    });

    actions.append(editButton, deleteButton);
    row.appendChild(actions);
    studentTable.appendChild(row);
  });
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const student = {
    id: studentId.value || String(Date.now()),
    name: nameInput.value.trim(),
    roll: rollInput.value.trim(),
    email: emailInput.value.trim(),
    course: courseInput.value
  };

  const duplicateRoll = students.some(function(existing) {
    return existing.roll.toLowerCase() === student.roll.toLowerCase()
      && existing.id !== student.id;
  });

  if (duplicateRoll) {
    alert("This roll number already exists!");
    return;
  }

  if (studentId.value) {
    students = students.map(function(existing) {
      return existing.id === student.id ? student : existing;
    });
  } else {
    students.push(student);
  }

  saveStudents();
  renderStudents();
  resetForm();
});

function editStudent(id) {
  const student = students.find(function(item) {
    return item.id === id;
  });

  if (!student) return;

  studentId.value = student.id;
  nameInput.value = student.name;
  rollInput.value = student.roll;
  emailInput.value = student.email;
  courseInput.value = student.course;

  formTitle.textContent = "Edit Student";
  submitBtn.textContent = "Update Student";
  cancelBtn.classList.remove("hidden");

  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteStudent(id) {
  const confirmed = confirm("Are you sure you want to delete this student?");

  if (!confirmed) return;

  students = students.filter(function(student) {
    return student.id !== id;
  });

  saveStudents();
  renderStudents();

  if (studentId.value === id) {
    resetForm();
  }
}

function resetForm() {
  form.reset();
  studentId.value = "";
  formTitle.textContent = "Add New Student";
  submitBtn.textContent = "Add Student";
  cancelBtn.classList.add("hidden");
}

cancelBtn.addEventListener("click", resetForm);
searchInput.addEventListener("input", renderStudents);
courseFilter.addEventListener("change", renderStudents);

renderStudents();
