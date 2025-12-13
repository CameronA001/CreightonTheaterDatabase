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
        <option value="viewCharacters">View Characters</option>
      </select>
    </td>
    <td>${show.showName || ""}</td>
    <td>${show.yearSemester || ""}</td>
    <td>${show.director || ""}</td>
    <td>${show.genre || ""}</td>
    <td>${show.playWright || ""}</td>
  `;
}

/**
 * Builds HTML for a single show crew table row
 * @param {Object} showCrew - Show crew data object
 * @returns {string} HTML string for the table row
 */
function buildShowCrewRow(showCrew) {
  return `
    <td>${showCrew.firstName}</td>
    <td>${showCrew.lastName}</td>
    <td>${showCrew.roles}</td>
    <td>${showCrew.crewID}</td> 
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

/**
 * Loads crew members for a specific show
 * @param {string} showID - The show's ID
 */
function loadCrewShow(showID) {
  fetch(`/shows/getCrew?showID=${encodeURIComponent(showID)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load crew");
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const showName = data[0].showName;
        const yearSemester = data[0].yearSemester;

        document.getElementById(
          "show-title"
        ).textContent = `${showName} (${yearSemester}) Crew`;
      }

      populateTable("showCrew-table-body", data, buildShowCrewRow);
    })
    .catch((error) => {
      console.error("Error loading crew:", error);
    });
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
    window.location.href = `/show/crewInShow?showID=${encodeURIComponent(
      showID
    )}`;
  } else if (selectedValue === "viewCharacters") {
    window.location.href = `/characters/loadpage?showID=${encodeURIComponent(
      showID
    )}`;
  }

  // Reset dropdown to selected state after navigation decision
  event.target.value = "";
}
