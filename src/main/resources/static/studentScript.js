/**
 * studentScript.js - Student-specific functionality
 * Handles student listing, adding, editing, and filtering
 * Requires: common.js
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Filter dropdown options for student page
const STUDENT_FILTER_OPTIONS = [
  { value: "netid", label: "NetID" },
  { value: "firstname", label: "First Name" },
  { value: "lastname", label: "Last Name" },
  { value: "gradelevel", label: "Grade Level" },
  { value: "allergies_sensitivities", label: "Allergies/Sensitivities" },
];

// Route map for student dropdown actions
const STUDENT_DROPDOWN_ROUTES = {
  roles: "/characters/loadpage?netID={id}",
  shows: "/student/{id}/shows",
  crew: "/crew/loadpage?netID={id}",
  actor: "/actors/loadpage?netID={id}",
  edit: "/student/{id}/editPage",
  delete: null, // Special handling required
};

// ============================================================================
// TABLE RENDERING
// ============================================================================

/**
 * Builds HTML for a single student table row
 * @param {Object} student - Student data object
 * @returns {string} HTML string for the table row
 */
function buildStudentRow(student) {
  return `
    <td>
      <select class="netid-select" onchange="handleStudentDropdown(this.value, '${
        student.netid
      }')">
        <option value="" selected>${student.netid}</option>
        <option value="roles">Previous Roles</option>
        <option value="shows">Previous Shows</option>
        <option value="crew">Crew Page</option>
        <option value="actor">Actor Page</option>
        <option value="delete">Delete Student</option>
        <option value="edit">Edit Student</option>
      </select>
    </td>
    <td>${student.firstname} ${student.lastname}</td>
    <td>${student.gradelevel}</td>
    <td>${student.pronouns || ""}</td>
    <td>${student.specialnotes || ""}</td>
    <td>${student.email || ""}</td>
    <td>${student.allergies_sensitivities || ""}</td>
  `;
}

/**
 * Builds HTML for a single student show table row
 * @param {Object} show - Show data object
 * @returns {string} HTML string for the table row
 */
function buildStudentShowRow(show) {
  return `
    <td>${show.showid || ""}</td>
    <td>${show.showname || ""}</td>
    <td>${show.yearsemester || ""}</td>
    <td>${show.characters || ""}</td>
    <td>${show.director || ""}</td>
    <td>${show.genre || ""}</td>
    <td>${show.playwright || ""}</td>
  `;
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Loads all students or filters by netID from URL parameter
 */
function loadStudents() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  // Load all students, then filter client-side if needed
  loadTableData("/student/getAll", "student-table-body", (student) => {
    // If netID parameter exists, only show matching students
    if (netID && student.netid !== netID) {
      return null; // Skip this student
    }
    return buildStudentRow(student);
  });

  // Set filter inputs if netID exists
  if (netID) {
    const filterColumn = document.getElementById("filter-column");
    const filterInput = document.getElementById("filter-input");
    if (filterColumn) filterColumn.value = "netid";
    if (filterInput) filterInput.value = netID;
  }
}

/**
 * Loads all shows that a student has been in
 * @param {string} netID - The student's netID
 */
function loadStudentShows(netID) {
  fetch(`/student/getShows?netID=${encodeURIComponent(netID)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load student shows");
      return response.json();
    })
    .then((data) => {
      // Update the title with student info if available
      const titleElement = document.getElementById("student-title");
      if (titleElement && data.length > 0) {
        titleElement.textContent = `Previous Shows for ${netID}`;
      } else if (titleElement) {
        titleElement.textContent = `No Previous Shows Found for ${netID}`;
      }

      populateTable("student-shows-table-body", data, buildStudentShowRow);
    })
    .catch((error) => {
      console.error("Error loading student shows:", error);
    });
}

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Processes the filter based on selected column and input value
 */
function processFilter() {
  const filterColumn = document.getElementById("filter-column");
  const filterInput = document.getElementById("filter-input");

  if (!filterColumn || !filterInput) {
    console.error("Filter elements not found");
    return;
  }

  const column = filterColumn.value;
  const value = filterInput.value;

  filterTable("student", column, value, "student-table-body", buildStudentRow);
}

/**
 * Initializes the filter dropdown with student-specific options
 */
function initializeStudentFilters() {
  populateFilterDropdown("filter-column", STUDENT_FILTER_OPTIONS);
  setupFilterListener(processFilter);
  updatePlaceholder();
}

// ============================================================================
// DROPDOWN ACTIONS
// ============================================================================

/**
 * Handles student dropdown menu selections
 * @param {string} selectedValue - The selected option value
 * @param {string} netID - The student's netID
 */
function handleStudentDropdown(selectedValue, netID) {
  if (!selectedValue) return;

  // Special handling for delete action
  if (selectedValue === "delete") {
    deleteStudent(netID);
    return;
  }

  // Handle navigation to other pages
  handleDropdownNavigation(selectedValue, STUDENT_DROPDOWN_ROUTES, netID);

  // Reset dropdown to selected state after navigation decision
  event.target.value = "";
}

// ============================================================================
// ADD STUDENT
// ============================================================================

/**
 * Adds a new student to the database
 */
async function addStudent() {
  const formData = new URLSearchParams();

  // Required fields
  formData.append("netID", document.getElementById("netID").value);
  formData.append("firstName", document.getElementById("firstName").value);
  formData.append("lastName", document.getElementById("lastName").value);
  formData.append("gradeLevel", document.getElementById("gradeLevel").value);

  // Optional fields
  formData.append("pronouns", document.getElementById("pronouns").value);
  formData.append(
    "specialNotes",
    document.getElementById("specialNotes").value,
  );
  formData.append("email", document.getElementById("email").value);
  formData.append("allergies", document.getElementById("allergies").value);

  await submitForm(
    "/student/add",
    formData,
    "Student added successfully!",
    "/student/loadpage",
    "add-student-form",
  );
}

// ============================================================================
// EDIT STUDENT
// ============================================================================

/**
 * Edits an existing student's information
 * @param {string} oldNetID - The student's current netID (from the URL path)
 */
async function editStudent(oldNetID) {
  const formData = new URLSearchParams();

  // New netID (might be same as old)
  const newNetID = document.getElementById("netID").value;
  formData.append("newNetID", newNetID);

  // All other fields
  formData.append("firstName", document.getElementById("firstName").value);
  formData.append("lastName", document.getElementById("lastName").value);
  formData.append("gradeLevel", document.getElementById("gradeLevel").value);
  formData.append("pronouns", document.getElementById("pronouns").value);
  formData.append(
    "specialNotes",
    document.getElementById("specialNotes").value,
  );
  formData.append("email", document.getElementById("email").value);
  formData.append(
    "allergies_sensitivities",
    document.getElementById("allergies").value,
  );

  await submitForm(
    `/student/${encodeURIComponent(oldNetID)}/edit`,
    formData,
    "Student edited successfully!",
    "/student/loadpage",
    "edit-student-form",
  );
}

// ============================================================================
// DELETE STUDENT
// ============================================================================

/**
 * Deletes a student from the database
 * @param {string} netID - The student's netID to delete
 */
function deleteStudent(netID) {
  if (
    !confirm(`Are you sure you want to delete student with NetID: ${netID}?`)
  ) {
    return;
  }

  const formData = new URLSearchParams();
  formData.append("netID", netID);

  fetch("/student/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then((response) => {
      if (response.ok) {
        showMessage("Student deleted successfully!");
        loadStudents(); // Reload the table
      } else {
        showMessage("Error deleting student.", true);
      }
    })
    .catch((error) => {
      console.error("Error deleting student:", error);
      showMessage("Error deleting student.", true);
    });
}

// ============================================================================
// FORM VALIDATION
// ============================================================================

/**
 * Validates and formats the netID input field
 * NetID format: 3 letters followed by up to 5 digits (e.g., ABC12345)
 */
function validateNetID() {
  const netIDInput = document.getElementById("netID");
  if (!netIDInput) return;

  netIDInput.addEventListener("input", function (e) {
    let value = e.target.value;

    // Only allow letters for first 3 characters
    if (value.length <= 3) {
      value = value.replace(/[^A-Za-z]/g, "").toUpperCase();
    } else {
      // After 3 chars, only allow digits
      value =
        value.substring(0, 3).toUpperCase() +
        value.substring(3).replace(/[^0-9]/g, "");
    }

    // Enforce max length of 8
    value = value.substring(0, 8);

    e.target.value = value;
  });
}
