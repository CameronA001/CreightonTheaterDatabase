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
      <option value="viewCharacters">View Details</option>
      <option value="viewScenes">View Scenes</option>
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

function buildSceneRow(scene) {
  return `
    <td><select class="netid-select" onchange="handleSceneDropdown(event, this.value, '${scene.scenename}', '${scene.showid}')">
        <option value="">${scene.scenename}</option>
        <option value="viewCharacters">View Characters</option>
        <option value="edit">Edit Scene</option>
        <option value="delete">Delete Scene</option>
      </select>
    </td>
    <td>${scene.act}</td>
    <td>${scene.locationset}</td>
    <td>${scene.song || ""}</td>
    <td>${scene.bookscriptpages || ""}</td>  
    <td>${scene.crewinshow || ""}</td>
      `;
}

function buildSceneDetailsRow(sceneDetail) {
  return `
    <td><select class="netid-select" onchange="handleSceneDetailDropdown(event, this.value, '${sceneDetail.charactername}', '${sceneDetail.scenename}', '${sceneDetail.netid}', '${sceneDetail.showid}')">
        <option value="">${sceneDetail.charactername}</option>
        <option value="edit">Edit Details</option>
        <option value="delete">Delete from Scene</option>
      </select>
    </td>
    <td>${sceneDetail.actorname}</td>
    <td>${sceneDetail.costumechange || ""}</td>
    <td>${sceneDetail.costumeworn || ""}</td>
    <td>${sceneDetail.characterlocation || ""}</td>
    <td>${sceneDetail.changelocation || ""}</td>
    <td>${sceneDetail.changetime || ""}</td>
    <td>${sceneDetail.notes || ""}</td>
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

function loadScenesInShow(showID) {
  fetch(`/shows/getScenesInShow?showID=${encodeURIComponent(showID)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load scenes");
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const showName = data[0].showname;
        const yearSemester = data[0].yearsemester;

        document.getElementById("show-title").textContent =
          `${showName} (${yearSemester}) Scenes`;
      }

      populateTable("scenes-table-body", data, buildSceneRow);
    })
    .catch((error) => {
      console.error("Error loading scenes:", error);
    });
}

function loadSceneDetails(sceneName) {
  fetch(`/shows/getSceneDetails?sceneName=${encodeURIComponent(sceneName)}`)
    .then((response) => {
      if (!response.ok) throw new Error("Failed to load scene details");
      return response.json();
    })
    .then((data) => {
      if (data.length > 0) {
        const scene = data[0];
        document.getElementById("scene-title").textContent =
          `Scene: ${scene.scenename}`;
      } else {
        document.getElementById("scene-title").textContent = "No Scene Details";
      }

      populateTable("scenes-table-body", data, buildSceneDetailsRow);
    })
    .catch((error) => {
      console.error("Error loading scene details:", error);
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
  } else if (selectedValue === "viewScenes") {
    window.location.href = `/show/scenesInShow?showID=${encodeURIComponent(showID)}`;
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

function handleSceneDropdown(event, selectedValue, sceneName, showID) {
  if (!selectedValue) return;

  if (selectedValue === "viewCharacters") {
    const urlParams = new URLSearchParams(window.location.search);
    const showID = urlParams.get("showID");
    window.location.href = `/show/sceneDetails?sceneName=${encodeURIComponent(sceneName)}&showID=${encodeURIComponent(showID)}`;
  } else if (selectedValue === "edit") {
    window.location.href = `/show/editScene?sceneName=${encodeURIComponent(sceneName)}&showID=${encodeURIComponent(showID)}`;
  } else if (selectedValue === "delete") {
    if (confirm("Are you sure you want to delete this scene?")) {
      // Call the delete endpoint via fetch instead of redirect
      fetch(
        `/shows/deleteScene?sceneName=${encodeURIComponent(
          sceneName,
        )}&showID=${encodeURIComponent(showID)}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            alert("Scene deleted successfully.");
            window.location.reload(); // refresh the page
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          alert("Error deleting scene: " + error.message);
        });
    }
  }
}

function handleSceneDetailDropdown(
  event,
  selectedValue,
  characterName,
  sceneName,
  netID,
  showID,
) {
  if (!selectedValue) return;

  if (selectedValue === "edit") {
    window.location.href = `/show/editSceneDetails?characterName=${encodeURIComponent(characterName)}&sceneName=${encodeURIComponent(sceneName)}&netID=${encodeURIComponent(netID)}&showID=${encodeURIComponent(showID)}`;
  } else if (selectedValue === "delete") {
    if (
      confirm("Are you sure you want to remove this character from this scene?")
    ) {
      console.log(characterName + "character");
      console.log(sceneName + "scene");
      console.log(netID + "netid");
      console.log(showID + "showid");
      fetch(
        `/shows/deleteSceneDetails?charactername=${encodeURIComponent(
          characterName,
        )}&scenename=${encodeURIComponent(sceneName)}&netid=${encodeURIComponent(netID)}&showID=${encodeURIComponent(showID)}`,
        {
          method: "DELETE",
        },
      )
        .then((response) => {
          if (response.ok) {
            alert("Scene details deleted successfully.");
            window.location.reload(); // refresh the page
          } else {
            return response.text().then((text) => {
              throw new Error(text);
            });
          }
        })
        .catch((error) => {
          alert("Error deleting scene details: " + error.message);
        });
    }
  }
}

// ============================================================================
// ADDING
// ============================================================================
async function addShow() {
  const formData = new URLSearchParams();

  formData.append("showname", document.getElementById("showname").value);
  formData.append(
    "yearsemester",
    document.getElementById("yearsemester").value,
  );
  formData.append("director", document.getElementById("director").value);
  formData.append("genre", document.getElementById("genre").value);
  formData.append("playwright", document.getElementById("playwright").value);

  await submitForm(
    "/shows/add",
    formData,
    "Show added successfully!",
    "/show/loadpage",
    "add-show-form",
  );
}

async function addScene() {
  const formData = new URLSearchParams();

  formData.append("scenename", document.getElementById("scenename").value);
  formData.append("act", document.getElementById("act").value);
  formData.append("locationset", document.getElementById("locationset").value);
  formData.append("song", document.getElementById("song").value);
  formData.append(
    "bookscriptpages",
    document.getElementById("bookscriptpages").value,
  );
  formData.append("crewinshow", document.getElementById("crewinshow").value);
  formData.append("showID", document.getElementById("showID").value);

  await submitForm(
    "/shows/addScene",
    formData,
    "Scene added successfully!",
    `/show/scenesInShow?showID=${encodeURIComponent(
      document.getElementById("showID").value,
    )}`,
    "add-scene-form",
  );
}

async function addSceneDetails() {
  const formData = new URLSearchParams();

  formData.append("scenename", document.getElementById("scenename").value);
  formData.append(
    "charactername",
    document.getElementById("charactername").value,
  );
  formData.append("netid", document.getElementById("netid").value);
  formData.append("showID", document.getElementById("showID").value);
  formData.append(
    "costumechange",
    document.getElementById("costumechange").value,
  );
  formData.append("costumeworn", document.getElementById("costumeworn").value);
  formData.append(
    "characterlocation",
    document.getElementById("characterlocation").value,
  );
  formData.append(
    "changelocation",
    document.getElementById("changelocation").value,
  );
  formData.append("changetime", document.getElementById("changetime").value);
  formData.append("notes", document.getElementById("notes").value);

  await submitForm(
    "/shows/addSceneDetails",
    formData,
    "Scene details added successfully!",
    `/show/sceneDetails?sceneName=${encodeURIComponent(
      document.getElementById("scenename").value,
    )}&showID=${encodeURIComponent(document.getElementById("showID").value)}`,
    "add-scene-details-form",
  );
}

// ============================================================================
// EDITING
// ============================================================================

async function editScene() {
  const formData = new URLSearchParams();

  const urlParams = new URLSearchParams(window.location.search);
  const originalSceneName = urlParams.get("sceneName");

  formData.append("scenename", originalSceneName);
  formData.append(
    "newScenename",
    document.getElementById("newScenename").value,
  );
  formData.append("act", document.getElementById("act").value);
  formData.append("locationset", document.getElementById("locationset").value);
  formData.append("song", document.getElementById("song").value);
  formData.append(
    "bookscriptpages",
    document.getElementById("bookscriptpages").value,
  );
  formData.append("crewinshow", document.getElementById("crewinshow").value);
  formData.append("showID", document.getElementById("showID").value);

  await submitForm(
    "/shows/editScene",
    formData,
    "Scene updated successfully!",
    `/show/scenesInShow?showID=${encodeURIComponent(
      document.getElementById("showID").value,
    )}`,
    "edit-scene-form",
  );
}

async function editSceneDetails() {
  const formData = new URLSearchParams();

  formData.append("scenename", document.getElementById("scenename").value);
  formData.append(
    "charactername",
    document.getElementById("charactername").value,
  );
  formData.append("netid", document.getElementById("netid").value);
  formData.append("showID", document.getElementById("showID").value);
  formData.append(
    "costumechange",
    document.getElementById("costumechange").value,
  );
  formData.append("costumeworn", document.getElementById("costumeworn").value);
  formData.append(
    "characterlocation",
    document.getElementById("characterlocation").value,
  );
  formData.append(
    "changelocation",
    document.getElementById("changelocation").value,
  );
  formData.append("changetime", document.getElementById("changetime").value);
  formData.append("notes", document.getElementById("notes").value);

  await submitForm(
    "/shows/editSceneDetails",
    formData,
    "Scene details updated successfully!",
    `/show/sceneDetails?sceneName=${encodeURIComponent(
      document.getElementById("scenename").value,
    )}`,
    "edit-scene-details-form",
  );
}

// ============================================================================
// INITIALIZATION
// ============================================================================

function initializeAddScenePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const showID = urlParams.get("showID");

  if (showID) {
    document.getElementById("showID").value = showID;
  }
}

function initializeEditScenePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const sceneName = urlParams.get("sceneName");
  const showID = urlParams.get("showID");

  if (sceneName && showID) {
    // Fetch scene data and populate form
    fetch(`/shows/getScenesInShow?showID=${encodeURIComponent(showID)}`)
      .then((response) => response.json())
      .then((data) => {
        const scene = data.find((s) => s.scenename === sceneName);
        if (scene) {
          document.getElementById("newScenename").value = scene.scenename;
          document.getElementById("act").value = scene.act;
          document.getElementById("locationset").value = scene.locationset;
          document.getElementById("song").value = scene.song || "";
          document.getElementById("bookscriptpages").value =
            scene.bookscriptpages || "";
          document.getElementById("crewinshow").value = scene.crewinshow || "";
          document.getElementById("showID").value = scene.showid;
        }
      })
      .catch((error) => {
        console.error("Error loading scene data:", error);
      });
  }
}

function initializeAddSceneDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const sceneName = urlParams.get("sceneName");
  const showID = urlParams.get("showID");

  if (sceneName) {
    document.getElementById("scenename").value = sceneName;
  }
  if (showID) {
    document.getElementById("showID").value = showID;
  }
}

function initializeEditSceneDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const characterName = urlParams.get("characterName");
  const sceneName = urlParams.get("sceneName");
  const netID = urlParams.get("netID");
  const showID = urlParams.get("showID");

  if (sceneName && characterName && netID && showID) {
    // Fetch scene details and populate form
    fetch(`/shows/getSceneDetails?sceneName=${encodeURIComponent(sceneName)}`)
      .then((response) => response.json())
      .then((data) => {
        const detail = data.find(
          (d) => d.charactername === characterName && d.netid === netID,
        );
        if (detail) {
          document.getElementById("scenename").value = detail.scenename;
          document.getElementById("charactername").value = detail.charactername;
          document.getElementById("netid").value = detail.netid;
          document.getElementById("showID").value = showID;
          document.getElementById("costumechange").value =
            detail.costumechange || "";
          document.getElementById("costumeworn").value =
            detail.costumeworn || "";
          document.getElementById("characterlocation").value =
            detail.characterlocation || "";
          document.getElementById("changelocation").value =
            detail.changelocation || "";
          document.getElementById("changetime").value = detail.changetime || "";
          document.getElementById("notes").value = detail.notes || "";
        }
      })
      .catch((error) => {
        console.error("Error loading scene details:", error);
      });
  }
}

function addCharacterToSceneRedirect() {
  const params = new URLSearchParams(window.location.search);
  const sceneName = params.get("sceneName");
  const showID = params.get("showID"); // get showID directly from URL

  if (!sceneName || !showID) {
    alert("Missing scene name or show ID in the URL.");
    return;
  }

  // Redirect directly to the add character page
  window.location.href = `/show/addSceneDetails?sceneName=${encodeURIComponent(sceneName)}&showID=${encodeURIComponent(showID)}`;
}
