/**
 * actorScript.js - Actor-specific functionality
 * Handles actor listing, adding, editing, and filtering
 * Requires: common.js
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// List of all actor measurement fields for form processing
const ACTOR_FIELDS = [
  "netIDInput",
  "skinTone",
  "piercings",
  "hairColor",
  "previousInjuries",
  "specialNotes",
  "height",
  "ringSize",
  "shoeSize",
  "headCirc",
  "neckBase",
  "chest",
  "waist",
  "highHip",
  "lowHip",
  "armseyeToArmseyeFront",
  "neckToWaistFront",
  "armseyeToArmseyeBack",
  "neckToWaistBack",
  "centerBackToWrist",
  "outsleeveToWrist",
  "outseamBelowKnee",
  "outseamToAnkle",
  "outseamToFloor",
  "otherNotes",
];

const ACTOR_FILTER_OPTIONS = [
  { value: "netid", label: "NetID" },
  { value: "firstname", label: "First Name" },
  { value: "lastname", label: "Last Name" },
  { value: "shows", label: "Previous Shows" },
];

// ============================================================================
// TABLE RENDERING
// ============================================================================

/**
 * Builds HTML for a single actor table row
 * @param {Object} actor - Actor data object
 * @returns {string} HTML string for the table row
 */
function buildActorRow(actor) {
  // Helper function to safely display values (handles null/undefined)
  const display = (value) => value || "";

  return `
    <td>
      <select class="netid-select" onchange="handleActorDropdown(this.value, '${
        actor.netid
      }')">
        <option value="" selected>${actor.netid}</option>
        <option value="edit">Edit Actor</option>
        <option value="viewShows">View Previous Shows</option>
      </select>
    </td>
    <td class="sticky">${actor.firstname} ${actor.lastname}</td>
    <td>${display(actor.yearsactingexperience)}</td>
    <td>${display(actor.skintone)}</td>
    <td>${display(actor.piercings)}</td>
    <td>${display(actor.haircolor)}</td>
    <td>${display(actor.previousinjuries)}</td>
    <td>${display(actor.specialnotes)}</td>
    <td>${display(actor.height)}</td>
    <td>${display(actor.ringsize)}</td>
    <td>${display(actor.shoesize)}</td>
    <td>${display(actor.headcirc)}</td>
    <td>${display(actor.neckbase)}</td>
    <td>${display(actor.chest)}</td>
    <td>${display(actor.waist)}</td>
    <td>${display(actor.highhip)}</td>
    <td>${display(actor.lowhip)}</td>
    <td>${display(actor.armseyetoarmseyefront)}</td>
    <td>${display(actor.necktowaistfront)}</td>
    <td>${display(actor.armseyetoarmseyeback)}</td>
    <td>${display(actor.necktowaistback)}</td>
    <td>${display(actor.centerbacktowrist)}</td>
    <td>${display(actor.outsleevetowrist)}</td>
    <td>${display(actor.outseambelowknee)}</td>
    <td>${display(actor.outseamtoankle)}</td>
    <td>${display(actor.outseamtofloor)}</td>
    <td>${display(actor.othernotes)}</td>
  `;
}

/**
 * Builds HTML for filtered actor table row (slightly different format)
 * @param {Object} actor - Actor data object
 * @returns {string} HTML string for the table row
 */
function buildFilteredActorRow(actor) {
  const display = (value) => value || "";

  return `
    <td>
      <select class="netid-select" onchange="handleActorDropdown(this.value, '${
        actor.netid
      }')">
        <option value="" selected>${actor.netid}</option>
        <option value="edit">Edit Actor</option>
        <option value="viewShows">View Previous Shows</option>
      </select>
    </td>
    <td class="sticky">${actor.firstname} ${actor.lastname}</td>
    <td>${display(actor.yearsactingexperience)}</td>
    <td>${display(actor.skintone)}</td>
    <td>${display(actor.piercings)}</td>
    <td>${display(actor.haircolor)}</td>
    <td>${display(actor.previousinjuries)}</td>
    <td>${display(actor.specialnotes)}</td>
    <td>${display(actor.height)}</td>
    <td>${display(actor.ringsize)}</td>
    <td>${display(actor.shoesize)}</td>
    <td>${display(actor.headcirc)}</td>
    <td>${display(actor.neckbase)}</td>
    <td>${display(actor.chest)}</td>
    <td>${display(actor.waist)}</td>
    <td>${display(actor.highhip)}</td>
    <td>${display(actor.lowhip)}</td>
    <td>${display(actor.armseyetoarmseyefront)}</td>
    <td>${display(actor.necktowaistfront)}</td>
    <td>${display(actor.armseyetoarmseyeback)}</td>
    <td>${display(actor.necktowaistback)}</td>
    <td>${display(actor.centerbacktowrist)}</td>
    <td>${display(actor.outsleevetowrist)}</td>
    <td>${display(actor.outseambelowknee)}</td>
    <td>${display(actor.outseamtoankle)}</td>
    <td>${display(actor.outseamtofloor)}</td>
    <td>${display(actor.othernotes)}</td>
  `;
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Loads all actors or filters by netID or showID from URL parameter
 */
function loadActors() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");
  const showID = urlParams.get("showID");
  const filterInput = document.getElementById("filter-input");
  const filterBy = document.getElementById("filter-column");

  if (netID) {
    // If netID parameter exists, filter immediately
    if (filterInput && filterBy) {
      filterBy.value = "netid";
      filterInput.value = netID;
    }
    processFilter();
  } else if (showID) {
    // If showID parameter exists, filter by show
    if (filterInput && filterBy) {
      filterBy.value = "shows";
      filterInput.value = showID;
    }
    processFilter();
  } else {
    // Load all actors
    loadTableData("/actors/getAll", "actor-table-body", buildActorRow);
  }
}

// ============================================================================
// FILTERING
// ============================================================================

/**
 * Processes the filter based on column and input value
 */
function processFilter() {
  const filterInput = document.getElementById("filter-input");
  const filterColumn = document.getElementById("filter-column");

  if (!filterInput || !filterColumn) {
    console.error("Filter input or column not found");
    return;
  }

  const filterValue = filterInput.value;
  const column = filterColumn.value;

  fetch(
    `/actors/filterBy?column=${encodeURIComponent(
      column,
    )}&value=${encodeURIComponent(filterValue)}`,
  )
    .then((response) => response.json())
    .then((data) => {
      populateTable("actor-table-body", data, buildFilteredActorRow);
    })
    .catch((error) => {
      console.error("Error filtering actors:", error);
    });
}

/**
 * Sets up the filter listener for actor search
 */
function initializeActorFilters() {
  setupFilterListener(processFilter);
  populateFilterDropdown("filter-column", ACTOR_FILTER_OPTIONS);
  updatePlaceholder();
}

// ============================================================================
// DROPDOWN ACTIONS
// ============================================================================

/**
 * Handles actor dropdown menu selections
 * @param {string} selectedValue - The selected option value
 * @param {string} netID - The actor's netID
 */
function handleActorDropdown(selectedValue, netID) {
  if (!selectedValue) return;

  if (selectedValue === "edit") {
    window.location.href = `/actor/editPage?netID=${encodeURIComponent(netID)}`;
  } else if (selectedValue === "viewShows") {
    window.location.href = `/characters/loadpage?netID=${encodeURIComponent(
      netID,
    )}`;
  }

  // Reset dropdown to selected state after navigation decision
  event.target.value = "";
}

// ============================================================================
// ADD ACTOR
// ============================================================================

/**
 * Adds a new actor to the database
 */
async function addActor() {
  const formData = new URLSearchParams();

  // Add all fields that have values
  ACTOR_FIELDS.forEach((fieldId) => {
    appendIfNotEmpty(
      formData,
      fieldId === "netIDInput" ? "netID" : fieldId,
      fieldId,
    );
  });

  // Special handling for yearsActingExperience (should be integer)
  const yearsInput = document.getElementById("yearsActingExperience");
  if (yearsInput && yearsInput.value.trim() !== "") {
    formData.append("yearsActingExperience", yearsInput.value);
  }

  await submitForm(
    "/actors/add",
    formData,
    "Actor added successfully!",
    "/actors/loadpage",
    "add-actor-form",
  );
}

// ============================================================================
// EDIT ACTOR
// ============================================================================

/**
 * Edits an existing actor's information
 * @param {string} netID - The actor's netID
 */
async function editActor(netID) {
  const formData = new URLSearchParams();

  // Handle yearsActingExperience (integer field)
  const yearsInput = document.getElementById("yearsActingExperience");
  const years = yearsInput ? yearsInput.value.trim() : "";
  formData.append("yearsActingExperience", years === "" ? "" : parseInt(years));

  // Add all measurement fields (they're exposed as variables in the edit page via Thymeleaf)
  const measurementFields = [
    "skinTone",
    "piercings",
    "hairColor",
    "previousInjuries",
    "specialNotes",
    "height",
    "ringSize",
    "shoeSize",
    "headCirc",
    "neckBase",
    "chest",
    "waist",
    "highHip",
    "lowHip",
    "armseyeToArmseyeFront",
    "neckToWaistFront",
    "armseyeToArmseyeBack",
    "neckToWaistBack",
    "centerBackToWrist",
    "outsleeveToWrist",
    "outseamBelowKnee",
    "outseamToAnkle",
    "outseamToFloor",
    "otherNotes",
  ];

  measurementFields.forEach((field) => {
    const element = document.getElementById(field);
    if (element) {
      formData.append(field, element.value);
    }
  });

  await submitForm(
    `/actors/edit?netID=${encodeURIComponent(netID)}`,
    formData,
    "Actor edited successfully!",
    "/actors/loadpage",
    "edit-actor-form",
  );
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initializes the add actor page with student autocomplete
 */
function initializeAddActorPage() {
  // Initialize student autocomplete
  findStudents("", "netid", "student-select", "addActorButton");
  setupStudentAutocomplete("student-select", "addActorButton");
}
