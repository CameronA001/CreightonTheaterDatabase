/**
 * characterScript.js - Character-specific functionality
 * Handles character listing, adding, editing, and filtering
 * Requires: common.js
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Filter dropdown options for character page
// Format: "columnName,tableAlias" (c=characters, s=student, sh=shows)
const CHARACTER_FILTER_OPTIONS = [
  { value: "netid,c", label: "NetID" },
  { value: "firstname,s", label: "First Name" },
  { value: "lastname,s", label: "Last Name" },
  { value: "showid,sh", label: "Show ID" },
  { value: "charactername,c", label: "Character Name" },
  { value: "showname,sh", label: "Show Name" },
  { value: "yearsemester,sh", label: "Show Semester" },
];

// ============================================================================
// TABLE RENDERING
// ============================================================================

/**
 * Builds HTML for a single character table row
 * @param {Object} character - Character data object
 * @returns {string} HTML string for the table row
 */
function buildCharacterRow(character) {
  return `
    <td>
      <select class="netid-select" onchange="handleCharacterDropdown(this.value, '${
        character.charactername
      }')">
        <option value="" selected>${character.charactername}</option>
        <option value="delete">Delete Character</option>
      </select>
    </td>
    <td>${character.showname || ""}</td>
    <td>${character.showsemester || ""}</td>
    <td>${character.firstname} ${character.lastname}</td>
    <td>${character.netid}</td>
    <td>${character.showid}</td>
  `;
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Loads all characters or filters by netID or showID from URL parameter
 */
function loadCharacters() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");
  const showID = urlParams.get("showID");

  if (netID) {
    // If netID parameter exists, set up filter and process
    const filterColumn = document.getElementById("filter-column");
    const filterInput = document.getElementById("filter-input");

    if (filterColumn) filterColumn.value = "netid,c";
    if (filterInput) filterInput.value = netID;

    processFilter();
  } else if (showID) {
    // If showID parameter exists, filter by show
    const filterColumn = document.getElementById("filter-column");
    const filterInput = document.getElementById("filter-input");

    if (filterColumn) filterColumn.value = "showid,sh";
    if (filterInput) filterInput.value = showID;

    processFilter();
  } else {
    // Load all characters
    loadTableData(
      "/characters/getAll",
      "character-table-body",
      buildCharacterRow,
    );
  }
}

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Splits the filter column value into column name and table alias
 * @param {string} filterValue - The filter value in format "column,table"
 * @returns {Array} [columnName, tableAlias]
 */
function splitFilterValue(filterValue) {
  return filterValue.split(",");
}

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

  const [column, table] = splitFilterValue(filterColumn.value);
  const value = filterInput.value;

  // Build query with column and table parameters
  const params = new URLSearchParams();
  params.append("column", column);
  params.append("value", value);
  params.append("page", table);

  fetch(`/characters/filterBy?${params.toString()}`)
    .then((response) => response.json())
    .then((data) => {
      populateTable("character-table-body", data, buildCharacterRow);
    })
    .catch((error) => {
      console.error("Error filtering characters:", error);
      populateTable("character-table-body", [], buildCharacterRow);
    });
}

/**
 * Initializes the filter dropdown with character-specific options
 */
function initializeCharacterFilters() {
  populateFilterDropdown("filter-column", CHARACTER_FILTER_OPTIONS);
  setupFilterListener(processFilter);
  updatePlaceholder();
}

// ============================================================================
// DROPDOWN ACTIONS
// ============================================================================

/**
 * Handles character dropdown menu selections
 * @param {string} selectedValue - The selected option value
 * @param {string} characterName - The character's name
 */
function handleCharacterDropdown(selectedValue, characterName) {
  if (!selectedValue) return;

  if (selectedValue === "delete") {
    // Navigate to delete endpoint
    window.location.href = `/characters/delete?characterName=${encodeURIComponent(
      characterName,
    )}`;
  }

  // Reset dropdown to selected state after navigation decision
  event.target.value = "";
}

// ============================================================================
// ADD CHARACTER
// ============================================================================

/**
 * Adds a new character to the database
 */
async function addCharacter() {
  const formData = new URLSearchParams();

  // Get form values
  const characterName = document.getElementById("characterName");
  const showID = document.getElementById("showID");
  const netIDInput = document.getElementById("netIDInput");

  if (!characterName || !showID || !netIDInput) {
    showMessage("Please fill in all required fields.", true);
    return;
  }

  formData.append("characterName", characterName.value);
  formData.append("netID", netIDInput.value);
  formData.append("showID", showID.value);

  await submitForm(
    "/characters/add",
    formData,
    "Character added successfully!",
    "/characters/loadpage",
    "add-character-form",
  );
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes the add character page with autocomplete functionality
 */
function initializeAddCharacterPage() {
  // Initialize student autocomplete
  findStudents("", "netid", "student-select", "addCharacterButton");
  setupStudentAutocomplete("student-select", "addCharacterButton");

  // Initialize show autocomplete
  findShows("showname", "", "show-select", "addCharacterButton");
  setupShowAutocomplete("show-select", "addCharacterButton");

  const netInput = document.getElementById("netIDInput");

  netInput.addEventListener("input", function () {
    findStudents(this.value, "netid", "student-select", "addCharacterButton");
  });

  const showInput = document.getElementById("showID");

  showInput.addEventListener("input", function () {
    findShows(this.value, "showname", "show-select", "addCharacterButton");
  });
}
