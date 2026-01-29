/**
 * common.js - Shared utility functions for the Theater Database application
 * This file contains reusable functions used across multiple pages to reduce code duplication
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Clears the value of an input element
 * @param {string} elementId - The ID of the element to clear
 */
function clearInput(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.value = "";
  }
}

/**
 * Shows an alert message to the user
 * @param {string} message - The message to display
 * @param {boolean} isError - Whether this is an error message
 */
function showMessage(message, isError = false) {
  // In future, this could be replaced with a nicer toast notification
  alert(message);
}

/**
 * Updates the search bar placeholder text based on selected filter
 */
function updatePlaceholder() {
  const select = document.getElementById("filter-column");
  const input = document.getElementById("filter-input");

  if (!select || !input) return;

  const selectedLabel = select.options[select.selectedIndex].text;
  input.placeholder = `Search by ${selectedLabel}`;
}

/**
 * Appends a value to FormData only if the input element is not empty
 * @param {URLSearchParams} formData - The form data object
 * @param {string} key - The key to use in form data
 * @param {string} elementId - The ID of the input element
 */
function appendIfNotEmpty(formData, key, elementId) {
  const element = document.getElementById(elementId);
  if (element && element.value !== "") {
    formData.append(key, element.value);
  }
}

// ============================================================================
// TABLE MANAGEMENT
// ============================================================================

/**
 * Generic function to populate a table with data
 * @param {string} tableBodyId - The ID of the table body element
 * @param {Array} data - Array of data objects to populate
 * @param {Function} rowBuilder - Function that takes a data item and returns HTML string
 */
function populateTable(tableBodyId, data, rowBuilder) {
  const tableBody = document.getElementById(tableBodyId);
  if (!tableBody) {
    console.error(`Table body with ID "${tableBodyId}" not found`);
    return;
  }

  tableBody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = rowBuilder(item);
    tableBody.appendChild(row);
  });
}

/**
 * Generic function to load data from an endpoint and populate a table
 * @param {string} endpoint - The API endpoint to fetch from
 * @param {string} tableBodyId - The ID of the table body element
 * @param {Function} rowBuilder - Function that takes a data item and returns HTML string
 * @param {Function} errorCallback - Optional callback for error handling
 */
function loadTableData(
  endpoint,
  tableBodyId,
  rowBuilder,
  errorCallback = null,
) {
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      populateTable(tableBodyId, data, rowBuilder);
    })
    .catch((error) => {
      console.error(`Error fetching data from ${endpoint}:`, error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
}

// ============================================================================
// FILTER/SEARCH FUNCTIONALITY
// ============================================================================

/**
 * Generic filter function that works with any entity type
 * @param {string} entityType - The entity type (e.g., 'student', 'actor')
 * @param {string} filterColumn - The column to filter by
 * @param {string} filterValue - The value to search for
 * @param {string} tableBodyId - The ID of the table body to populate
 * @param {Function} rowBuilder - Function to build each row
 */
function filterTable(
  entityType,
  filterColumn,
  filterValue,
  tableBodyId,
  rowBuilder,
) {
  // Build query parameters
  const params = new URLSearchParams();
  params.append("column", filterColumn);
  params.append("value", filterValue);

  const endpoint = `/${entityType}/filterBy?${params.toString()}`;

  fetch(endpoint)
    .then((response) => response.json())
    .then((data) => {
      populateTable(tableBodyId, data, rowBuilder);
    })
    .catch((error) => {
      console.error(`Error filtering ${entityType}:`, error);
      populateTable(tableBodyId, [], rowBuilder); // Clear table on error
    });
}

/**
 * Sets up automatic filter updates when user types in the filter input
 * @param {Function} filterFunction - The function to call when filtering
 */
function setupFilterListener(filterFunction) {
  const filterInput = document.getElementById("filter-input");
  if (filterInput) {
    filterInput.addEventListener("input", () => {
      filterFunction();
    });
  }
}

/**
 * Populates a filter dropdown with options
 * @param {string} selectId - The ID of the select element
 * @param {Array} options - Array of {value, label} objects
 */
function populateFilterDropdown(selectId, options) {
  const select = document.getElementById(selectId);
  if (!select) {
    console.error(`Select element with ID "${selectId}" not found`);
    return;
  }

  select.innerHTML = "";

  options.forEach((opt) => {
    const optionElement = document.createElement("option");
    optionElement.value = opt.value;
    optionElement.textContent = opt.label;
    select.appendChild(optionElement);
  });
}

// ============================================================================
// FORM SUBMISSION
// ============================================================================

/**
 * Generic function to handle form submission
 * @param {string} endpoint - The API endpoint to submit to
 * @param {URLSearchParams} formData - The form data to submit
 * @param {string} successMessage - Message to show on success
 * @param {string} redirectUrl - URL to redirect to after success
 * @param {string} formId - ID of the form to reset (optional)
 */
async function submitForm(
  endpoint,
  formData,
  successMessage,
  redirectUrl,
  formId = null,
) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const contentType = response.headers.get("content-type");
    let result;

    // Handle both text and JSON responses
    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      result = await response.text();
    }

    if (response.ok) {
      showMessage(successMessage);
      if (formId) {
        const form = document.getElementById(formId);
        if (form) form.reset();
      }
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
      return true;
    } else {
      // Handle error responses
      const errorMessage = typeof result === "object" ? result.message : result;
      showMessage(`Error: ${errorMessage}`, true);
      return false;
    }
  } catch (error) {
    console.error("Error submitting form:", error);
    showMessage(`Error: ${error.message}`, true);
    return false;
  }
}

// ============================================================================
// AUTOCOMPLETE - STUDENTS
// ============================================================================

/**
 * Searches for students by a specific field and populates a select dropdown
 * @param {string} searchValue - The value to search for
 * @param {string} searchBy - The field to search by (netID, firstName, lastName)
 * @param {string} selectId - The ID of the select element to populate
 * @param {string} buttonId - The ID of the submit button to enable/disable
 * @returns {Promise<number>} - Number of results found
 */
async function findStudents(searchValue, searchBy, selectId, buttonId) {
  try {
    const response = await fetch(
      `/student/search?value=${encodeURIComponent(
        searchValue,
      )}&searchBy=${searchBy}`,
    );
    const data = await response.json();

    const select = document.getElementById(selectId);
    const button = document.getElementById(buttonId);

    if (!select) return 0;

    select.innerHTML = "";

    if (data.length === 0) {
      const noneFound = document.createElement("option");
      noneFound.textContent = "No students found";
      select.appendChild(noneFound);
      select.size = 0;
      if (button) button.disabled = true;
      return 0;
    }

    // Populate dropdown with results
    data.forEach((student) => {
      const option = document.createElement("option");
      option.value = JSON.stringify({
        netID: student.netid,
        firstName: student.firstname,
        lastName: student.lastname,
      });
      option.textContent = `${student.firstname} ${student.lastname} (${student.netid})`;
      select.appendChild(option);
    });

    // Set dropdown size (max 4 visible items)
    select.size = Math.min(data.length, 4);
    if (button) button.disabled = false;

    return data.length;
  } catch (error) {
    console.error("Error searching for students:", error);
    return 0;
  }
}

/**
 * Sets the form inputs based on selected student from autocomplete
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {string} selectId - ID for future searches
 * @param {string} buttonId - Button ID for future searches
 */
function selectStudent(selectElement, selectId, buttonId) {
  if (!selectElement.value) return;

  const data = JSON.parse(selectElement.value);

  // Set form fields
  const netIDInput = document.getElementById("netIDInput");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");

  if (netIDInput) netIDInput.value = data.netID;
  if (firstNameInput) firstNameInput.value = data.firstName;
  if (lastNameInput) lastNameInput.value = data.lastName;

  // Refresh the dropdown to show only this student
  findStudents(data.netID, "netID", selectId, buttonId);
}

/**
 * Sets up autocomplete for student search fields
 * @param {string} selectId - The ID of the select element
 * @param {string} buttonId - The ID of the submit button
 */
function setupStudentAutocomplete(selectId, buttonId) {
  const netIDInput = document.getElementById("netIDInput");
  const firstNameInput = document.getElementById("firstName");
  const lastNameInput = document.getElementById("lastName");

  // Add event listeners for each input field
  if (netIDInput) {
    netIDInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        findStudents(value, "netID", selectId, buttonId);
        const select = document.getElementById(selectId);
        if (select) select.hidden = false;
      } else {
        findStudents("", "netID", selectId, buttonId);
      }
    });
  }

  if (firstNameInput) {
    firstNameInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        findStudents(value, "firstName", selectId, buttonId);
        const select = document.getElementById(selectId);
        if (select) select.hidden = false;
      } else {
        findStudents("", "netID", selectId, buttonId);
      }
    });
  }

  if (lastNameInput) {
    lastNameInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        findStudents(value, "lastName", selectId, buttonId);
        const select = document.getElementById(selectId);
        if (select) select.hidden = false;
      } else {
        findStudents("", "netID", selectId, buttonId);
      }
    });
  }
}

/**
 * Searches for shows by a specific field and populates a select dropdown
 * @param {string} searchBy - The field to search by (showName, yearSemester, showID)
 * @param {string} searchValue - The value to search for
 * @param {string} selectId - The ID of the select element to populate
 * @param {string} buttonId - The ID of the submit button to enable/disable
 * @returns {Promise<number>} - Number of results found
 */
async function findShows(searchBy, searchValue, selectId, buttonId) {
  try {
    const response = await fetch(
      `/shows/getShowIDName?searchBy=${searchBy}&searchValue=${encodeURIComponent(
        searchValue,
      )}`,
    );
    const data = await response.json();

    const select = document.getElementById(selectId);
    const button = document.getElementById(buttonId);
    const showIDField = document.getElementById("showID");

    if (!select) return 0;

    select.innerHTML = "";

    if (data.length === 0) {
      const noneFound = document.createElement("option");
      noneFound.textContent = "No shows found";
      select.appendChild(noneFound);
      select.size = 0;
      if (button) button.disabled = true;
      return 0;
    }

    // Populate dropdown with results
    data.forEach((show) => {
      const option = document.createElement("option");
      option.value = JSON.stringify({
        showID: show.showid,
        showName: show.showname,
        yearSemester: show.yearsemester,
      });
      option.textContent = `${show.showname} (${show.yearsemester})`;
      select.appendChild(option);
    });

    // Set the first show's ID if there's only one result
    if (data.length === 1 && showIDField) {
      showIDField.value = data[0].showid;
    }

    // Set dropdown size (max 4 visible items)
    select.size = Math.min(data.length, 4);
    if (button) button.disabled = false;

    return data.length;
  } catch (error) {
    console.error("Error searching for shows:", error);
    return 0;
  }
}

/**
 * Sets the form inputs based on selected show from autocomplete
 * @param {HTMLSelectElement} selectElement - The select element
 * @param {string} selectId - ID for future searches
 * @param {string} buttonId - Button ID for future searches
 */
function selectShow(selectElement, selectId, buttonId) {
  if (!selectElement.value) return;

  const data = JSON.parse(selectElement.value);

  // Set form fields
  const showNameInput = document.getElementById("showName");
  const yearSemesterInput = document.getElementById("yearSemester");
  const showIDField = document.getElementById("showID");

  if (showNameInput) showNameInput.value = data.showName;
  if (yearSemesterInput) yearSemesterInput.value = data.yearSemester;
  if (showIDField) showIDField.value = data.showID;

  // Refresh the dropdown to show only this show
  findShows("showName", data.showName, selectId, buttonId);
}

/**
 * Sets up autocomplete for show search fields
 * @param {string} selectId - The ID of the select element
 * @param {string} buttonId - The ID of the submit button
 */
function setupShowAutocomplete(selectId, buttonId) {
  const showNameInput = document.getElementById("showName");
  const yearSemesterInput = document.getElementById("yearSemester");

  // Add event listeners for each input field
  if (showNameInput) {
    showNameInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        findShows("showname", value, selectId, buttonId);
        const select = document.getElementById(selectId);
        if (select) select.hidden = false;
      }
    });
  }

  if (yearSemesterInput) {
    yearSemesterInput.addEventListener("input", function () {
      const value = this.value.trim();
      if (value !== "") {
        findShows("yearsemester", value, selectId, buttonId);
        const select = document.getElementById(selectId);
        if (select) select.hidden = false;
      }
    });
  }
}

// ============================================================================
// DROPDOWN HANDLERS
// ============================================================================

/**
 * Generic handler for dropdown selections with navigation
 * @param {string} selectedValue - The selected option value
 * @param {Object} routeMap - Map of values to URL patterns (use {id} for dynamic values)
 * @param {string} idValue - The ID value to substitute in URLs
 */
function handleDropdownNavigation(selectedValue, routeMap, idValue) {
  if (!selectedValue) return;

  const route = routeMap[selectedValue];
  if (route) {
    const url = route.replace("{id}", encodeURIComponent(idValue));
    window.location.href = url;
  }
}
