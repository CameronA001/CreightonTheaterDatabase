/**
 * crewScript.js - Crew-specific functionality
 * Handles crew listing, adding, and filtering
 * Requires: common.js
 */

// ============================================================================
// TABLE RENDERING - CREW
// ============================================================================

/**
 * Builds HTML for a single crew table row
 * @param {Object} crew - Crew data object
 * @returns {string} HTML string for the table row
 */
function buildCrewRow(crew) {
  return `
    <td>
      <a href="/student/loadpage?netID=${crew.crewID}">
        ${crew.crewID}
      </a>
    </td>
    <td class="sticky">${crew.firstName} ${crew.lastName}</td>
    <td>${crew.wigTrained || "No"}</td>
    <td>${crew.makeupTrained || "No"}</td>
    <td>${crew.musicReading || "No"}</td>
    <td>${crew.lighting || ""}</td>
    <td>${crew.sound || ""}</td>
    <td>${crew.specialty || ""}</td>
    <td>${crew.notes || ""}</td>
  `;
}

// ============================================================================
// DATA LOADING - CREW
// ============================================================================

/**
 * Loads all crew members or filters by netID from URL parameter
 */
function loadCrew() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  if (netID) {
    // If netID parameter exists, filter immediately
    const filterInput = document.getElementById("filter-input");
    if (filterInput) {
      filterInput.value = netID;
    }
    processCrewFilter();
  } else {
    // Load all crew members
    loadTableData("/crew/getAll", "crew-table-body", buildCrewRow);
  }
}

// ============================================================================
// FILTERING - CREW
// ============================================================================

/**
 * Processes the filter based on crew ID input value
 */
function processCrewFilter() {
  const filterInput = document.getElementById("filter-input");
  if (!filterInput) {
    console.error("Filter input not found");
    return;
  }

  const filterValue = filterInput.value;

  fetch(`/crew/filterBy?value=${encodeURIComponent(filterValue)}`)
    .then((response) => response.json())
    .then((data) => {
      populateTable("crew-table-body", data, buildCrewRow);
    })
    .catch((error) => {
      console.error("Error filtering crew:", error);
    });
}

/**
 * Sets up the filter listener for crew search
 */
function initializeCrewFilters() {
  setupFilterListener(processCrewFilter);
}

// ============================================================================
// ADD CREW
// ============================================================================

/**
 * Adds a new crew member to the database
 */
async function addCrew() {
  const formData = new URLSearchParams();

  // Add all fields that have values
  const fields = [
    "netIDInput",
    "firstName",
    "lastName",
    "wigTrained",
    "makeupTrained",
    "musicReading",
    "lighting",
    "sound",
    "specialty",
    "notes",
  ];

  fields.forEach((fieldId) => {
    // Map netIDInput to crewID for the backend
    const key = fieldId === "netIDInput" ? "crewID" : fieldId;
    appendIfNotEmpty(formData, key, fieldId);
  });

  await submitForm(
    "/crew/addCrew",
    formData,
    "Crew member added successfully!",
    "/crew/loadpage",
    "add-crew-form"
  );
}

// ============================================================================
// INITIALIZATION - CREW
// ============================================================================

/**
 * Initializes the add crew page with student autocomplete
 */
function initializeAddCrewPage() {
  // Initialize student autocomplete
  findStudents("", "netID", "student-select", "addCrewButton");
  setupStudentAutocomplete("student-select", "addCrewButton");
}
