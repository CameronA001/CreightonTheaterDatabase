/**
 * showScript.js - Show-specific functionality
 * Handles show listing and filtering
 * Requires: common.js
 */

// ============================================================================
// CONFIGURATION - SHOWS
// ============================================================================

// Filter dropdown options for show page
const SHOW_FILTER_OPTIONS = [
  { value: "showID", label: "Show ID" },
  { value: "showName", label: "Show Name" },
  { value: "yearSemester", label: "Year/Semester" },
];

// ============================================================================
// TABLE RENDERING - SHOWS
// ============================================================================

/**
 * Builds HTML for a single show table row
 * @param {Object} show - Show data object
 * @returns {string} HTML string for the table row
 */
function buildShowRow(show) {
  return `
    <td>
      <select class="netid-select" onchange="handleShowDropdown(this.value, '${
        show.showID
      }')">
        <option value="" selected>${show.showID}</option>
        <option value="viewCrew">View Crew</option>
      </select>
    </td>
    <td>${show.showName || ""}</td>
    <td>${show.yearSemester || ""}</td>
    <td>${show.director || ""}</td>
    <td>${show.genre || ""}</td>
    <td>${show.playWright || ""}</td>
  `;
}

// ============================================================================
// DATA LOADING - SHOWS
// ============================================================================

/**
 * Loads all shows
 */
function loadShows() {
  loadTableData("/shows/getAll", "show-table-body", buildShowRow);
}

// ============================================================================
// FILTERING - SHOWS
// ============================================================================

/**
 * Processes the filter based on selected column and input value
 * This function is called dynamically when the user types
 */
function processShowFilter() {
  const filterColumn = document.getElementById("filter-column");
  const filterInput = document.getElementById("filter-input");

  if (!filterColumn || !filterInput) {
    console.error("Filter elements not found");
    return;
  }

  const searchBy = filterColumn.value;
  const searchValue = filterInput.value;

  // If search value is empty, load all shows
  if (!searchValue.trim()) {
    loadShows();
    return;
  }

  // Otherwise, filter shows
  fetch(
    `/shows/getShowIDName?searchBy=${searchBy}&searchValue=${encodeURIComponent(
      searchValue
    )}`
  )
    .then((response) => response.json())
    .then((data) => {
      populateTable("show-table-body", data, buildShowRow);
    })
    .catch((error) => {
      console.error("Error filtering shows:", error);
      populateTable("show-table-body", [], buildShowRow);
    });
}

/**
 * Initializes the filter dropdown with show-specific options
 */
function initializeShowFilters() {
  populateFilterDropdown("filter-column", SHOW_FILTER_OPTIONS);
  setupFilterListener(processShowFilter);
  updatePlaceholder();
}

// ============================================================================
// DROPDOWN ACTIONS - SHOWS
// ============================================================================

/**
 * Handles show dropdown menu selections
 * @param {string} selectedValue - The selected option value
 * @param {string} showID - The show's ID
 */
function handleShowDropdown(selectedValue, showID) {
  if (!selectedValue) return;

  if (selectedValue === "viewCrew") {
    window.location.href = `/shows/${encodeURIComponent(showID)}/crew`;
  }
}
