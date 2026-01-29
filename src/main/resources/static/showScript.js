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
  { value: "showid", label: "Show ID" },
  { value: "showname", label: "Show Name" },
  { value: "yearsemester", label: "Year/Semester" },
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
    <select class="netid-select" onchange="handleShowDropdown(event, this.value, '${show.showid}')">
      <option value="">${show.showid}</option>
      <option value="viewCharacters">View Characters</option>
      <option value="delete">Delete Show</option>
    </select>
  </td>
    <td>${show.showname || ""}</td>
    <td>${show.yearsemester || ""}</td>
    <td>${show.director || ""}</td>
    <td>${show.genre || ""}</td>
    <td>${show.playwright || ""}</td>
  `;
}

/**
 * Builds HTML for a single show crew table row
 * @param {Object} showCrew - Show crew data object
 * @returns {string} HTML string for the table row
 */
function buildShowCrewRow(showCrew) {
  return `
    <td>${showCrew.firstname}</td>
    <td>${showCrew.lastname}</td>
    <td>${showCrew.roles}</td>
    <td>${showCrew.crewid}</td> 
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
        const showName = data[0].showname;
        const yearSemester = data[0].yearsemester;

        document.getElementById("show-title").textContent =
          `${showName} (${yearSemester}) Crew`;
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
      searchValue,
    )}`,
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
function handleShowDropdown(event, selectedValue, showID) {
  if (!selectedValue) return;

  if (selectedValue === "viewCharacters") {
    window.location.href = `/characters/loadpage?showID=${encodeURIComponent(showID)}`;
  } else if (selectedValue === "delete") {
    if (confirm("Are you sure you want to delete this show?")) {
      // Call the delete endpoint via fetch instead of redirect
      fetch(`/shows/delete?showID=${encodeURIComponent(showID)}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("Show deleted successfully.");
            window.location.reload(); // refresh the page
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          alert("Error deleting show: " + error.message);
        });
    }
  }
}
