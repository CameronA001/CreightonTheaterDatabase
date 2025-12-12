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
        actor.netID
      }')">
        <option value="" selected>${actor.netID}</option>
        <option value="edit">Edit Actor</option>
      </select>
    </td>
    <td class="sticky">${actor.firstName} ${actor.lastName}</td>
    <td>${display(actor.yearsActingExperience)}</td>
    <td>${display(actor.skinTone)}</td>
    <td>${display(actor.piercings)}</td>
    <td>${display(actor.hairColor)}</td>
    <td>${display(actor.previousInjuries)}</td>
    <td>${display(actor.specialNotes)}</td>
    <td>${display(actor.height)}</td>
    <td>${display(actor.ringSize)}</td>
    <td>${display(actor.shoeSize)}</td>
    <td>${display(actor.headCirc)}</td>
    <td>${display(actor.neckBase)}</td>
    <td>${display(actor.chest)}</td>
    <td>${display(actor.waist)}</td>
    <td>${display(actor.highHip)}</td>
    <td>${display(actor.lowHip)}</td>
    <td>${display(actor.armseyeToArmseyeFront)}</td>
    <td>${display(actor.neckToWaistFront)}</td>
    <td>${display(actor.armseyeToArmseyeBack)}</td>
    <td>${display(actor.neckToWaistBack)}</td>
    <td>${display(actor.centerBackToWrist)}</td>
    <td>${display(actor.outsleeveToWrist)}</td>
    <td>${display(actor.outseamBelowKnee)}</td>
    <td>${display(actor.outseamToAnkle)}</td>
    <td>${display(actor.outseamToFloor)}</td>
    <td>${display(actor.otherNotes)}</td>
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
    <td class="sticky">
      <a href="/student/loadpage?netID=${actor.netID}">
        ${actor.netID}
      </a>
    </td>
    <td>${display(actor.yearsActingExperience)}</td>
    <td>${display(actor.skinTone)}</td>
    <td>${display(actor.piercings)}</td>
    <td>${display(actor.hairColor)}</td>
    <td>${display(actor.previousInjuries)}</td>
    <td>${display(actor.specialNotes)}</td>
    <td>${display(actor.height)}</td>
    <td>${display(actor.ringSize)}</td>
    <td>${display(actor.shoeSize)}</td>
    <td>${display(actor.headCirc)}</td>
    <td>${display(actor.neckBase)}</td>
    <td>${display(actor.chest)}</td>
    <td>${display(actor.waist)}</td>
    <td>${display(actor.highHip)}</td>
    <td>${display(actor.lowHip)}</td>
    <td>${display(actor.armseyeToArmseyeFront)}</td>
    <td>${display(actor.neckToWaistFront)}</td>
    <td>${display(actor.armseyeToArmseyeBack)}</td>
    <td>${display(actor.neckToWaistBack)}</td>
    <td>${display(actor.centerBackToWrist)}</td>
    <td>${display(actor.outsleeveToWrist)}</td>
    <td>${display(actor.outseamBelowKnee)}</td>
    <td>${display(actor.outseamToAnkle)}</td>
    <td>${display(actor.outseamToFloor)}</td>
    <td>${display(actor.otherNotes)}</td>
  `;
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Loads all actors or filters by netID from URL parameter
 */
function loadActors() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  if (netID) {
    // If netID parameter exists, filter immediately
    const filterInput = document.getElementById("filter-input");
    if (filterInput) {
      filterInput.value = netID;
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
 * Processes the filter based on netID input value
 */
function processFilter() {
  const filterInput = document.getElementById("filter-input");
  if (!filterInput) {
    console.error("Filter input not found");
    return;
  }

  const filterValue = filterInput.value;

  fetch(`/actors/filterBy?value=${encodeURIComponent(filterValue)}`)
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
  }
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
      fieldId
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
    "add-actor-form"
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
    "edit-actor-form"
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
  findStudents("", "netID", "student-select", "addActorButton");
  setupStudentAutocomplete("student-select", "addActorButton");
}
