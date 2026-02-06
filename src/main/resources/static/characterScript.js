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
      <select class="netid-select" onchange="handleCharacterDropdown(this.value, '${character.charactername}', '${character.showid}', '${character.netid}')">
        <option value="" selected>${character.charactername}</option>
        <option value="edit">Edit Character</option>
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
 * @param {string} showID - The show ID
 * @param {string} netID - The actor's netID
 */
function handleCharacterDropdown(selectedValue, characterName, showID, netID) {
  if (!selectedValue) return;

  if (selectedValue === "edit") {
    window.location.href = `/characters/editPage?characterName=${encodeURIComponent(characterName)}&showID=${encodeURIComponent(showID)}&netID=${encodeURIComponent(netID)}`;
  } else if (selectedValue === "delete") {
    if (confirm("Are you sure you want to delete this character?")) {
      fetch(
        `/characters/delete?characterName=${encodeURIComponent(
          characterName,
        )}&showID=${encodeURIComponent(showID)}&netID=${encodeURIComponent(
          netID,
        )}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            alert("Character deleted successfully.");
            window.location.reload();
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          alert("Error deleting character: " + error.message);
        });
    }
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
// EDIT CHARACTER
// ============================================================================

/**
 * Edits an existing character
 */
async function editCharacter() {
  const formData = new URLSearchParams();

  // Get URL parameters for old values
  const urlParams = new URLSearchParams(window.location.search);
  const oldCharacterName = urlParams.get("characterName");
  const oldShowID = urlParams.get("showID");
  const oldNetID = urlParams.get("netID");

  // Get form values for new values
  const newCharacterName = document.getElementById("characterName");
  const newShowID = document.getElementById("showID");
  const newNetID = document.getElementById("netIDInput");

  if (!newCharacterName || !newShowID || !newNetID) {
    showMessage("Please fill in all required fields.", true);
    return;
  }

  // Append old values
  formData.append("oldCharacterName", oldCharacterName);
  formData.append("oldShowID", oldShowID);
  formData.append("oldNetID", oldNetID);

  // Append new values
  formData.append("newCharacterName", newCharacterName.value);
  formData.append("newShowID", newShowID.value);
  formData.append("newNetID", newNetID.value);

  await submitForm(
    "/characters/edit",
    formData,
    "Character updated successfully!",
    "/characters/loadpage",
    "edit-character-form",
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

/**
 * Initializes the edit character page with autocomplete functionality and pre-filled data
 */
function initializeEditCharacterPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterName = urlParams.get("characterName");
  const showID = urlParams.get("showID");
  const netID = urlParams.get("netID");

  if (characterName && showID && netID) {
    // Fetch character data and populate form
    fetch(
      `/characters/getCharacter?characterName=${encodeURIComponent(
        characterName,
      )}&showID=${encodeURIComponent(showID)}&netID=${encodeURIComponent(
        netID,
      )}`,
    )
      .then((response) => response.json())
      .then((data) => {
        // Populate form fields
        document.getElementById("characterName").value = data.charactername;
        document.getElementById("showID").value = data.showid;
        document.getElementById("netIDInput").value = data.netid;
        document.getElementById("firstName").value = data.firstname;
        document.getElementById("lastName").value = data.lastname;

        // Initialize autocomplete with current values
        findStudents(
          data.netid,
          "netid",
          "student-select",
          "editCharacterButton",
        );
        findShows("showid", data.showid, "show-select", "editCharacterButton");
      })
      .catch((error) => {
        console.error("Error loading character data:", error);
        showMessage("Error loading character data", true);
      });
  }

  // Initialize autocomplete functionality
  setupStudentAutocomplete("student-select", "editCharacterButton");
  setupShowAutocomplete("show-select", "editCharacterButton");

  const netInput = document.getElementById("netIDInput");
  if (netInput) {
    netInput.addEventListener("input", function () {
      findStudents(
        this.value,
        "netid",
        "student-select",
        "editCharacterButton",
      );
    });
  }

  const showInput = document.getElementById("showID");
  if (showInput) {
    showInput.addEventListener("input", function () {
      findShows(this.value, "showname", "show-select", "editCharacterButton");
    });
  }
}
