function loadCharacters() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  if (netID) {
    document.getElementById("filter-column").value = "netID,c";
    document.getElementById("filter-input").value = netID;
    processFilter();
  } else {
    fetch(`/characters/getAll`)
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("character-table-body");
        tableBody.innerHTML = "";

        data.forEach((character) => {
          const row = document.createElement("tr");
          row.innerHTML = `<td>
                            <select class="netid-select"
                            onchange="handleCharacterDropdown(this.value, '${character.characterName}')" id = "dropdown">
                                <option value="" selected>
                                    ${character.characterName}
                                </option>
                                <option value="delete">Delete Character</option>
                            </select>
                        </td>
                        <td>${character.showName}</td>
                        <td>${character.showSemester}</td>
                        <td>${character.firstName} ${character.lastName}</td>
                        <td>${character.netID}</td>
                        <td>${character.showID}</td>`;
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error fetching character data:", error));
  }
}

function handleCharacterDropdown(selectedValue, characterName) {
  if (selectedValue === "") {
    return;
  }
  if (selectedValue === "delete") {
    window.location.href = `/characters/delete?characterName=${characterName}`;
  }
}

//this function processes the filter request and updates the table accordingly
function processFilter() {
  const filterBy = document.getElementById("filter-input").value;
  const valueAndPage = splitValue(
    document.getElementById("filter-column").value
  );
  const filterValue = valueAndPage[0];
  const pageSearch = valueAndPage[1];
  fetch(
    `/characters/filterBy?column=${filterValue}&value=${filterBy}&page=${pageSearch}`
  )
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.getElementById(`character-table-body`);
      tableBody.innerHTML = "";
      data.forEach((character) => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>
                            <select class="netid-select"
                            onchange="handleCharacterDropdown(this.value, '${character.characterName}')" id = "dropdown">
                                <option value="">
                                    ${character.characterName}
                                </option>
                                <option value="delete">Delete Character</option>
                            </select>
                        </td>
                        <td>${character.showName}</td>
                        <td>${character.showSemester}</td>
                        <td>${character.firstName} ${character.lastName}</td>
                        <td>${character.netID}</td>
                        <td>${character.showID}</td>`;
        tableBody.appendChild(row);
      });
    });
}

const FILTER_DROPDOWN_MAP = {
  character: [
    { value: "netID,c", label: "NetID" },
    { value: "firstName,s", label: "First Name" },
    { value: "lastName,s", label: "Last Name" },
    { value: "showID,sh", label: "Show ID" },
    { value: "characterName,c", label: "Character Name" },
    { value: "showName,sh", label: "Show Name" },
    { value: "yearSemester,sh", label: "Show Semester" },
  ],
};

//splits value so that the correct table is referenced in the backend
function splitValue(stringToSplit) {
  const splitValues = stringToSplit.split(",");
  return splitValues;
}

function populateFilterDropdown() {
  const select = document.getElementById("filter-column");
  select.innerHTML = "";

  const options = FILTER_DROPDOWN_MAP["character"];

  if (!options) return;

  options.forEach((opt) => {
    const optionElement = document.createElement("option");
    optionElement.value = opt.value; // this is sent to the backend
    optionElement.textContent = opt.label; // this is displayed to the user
    select.appendChild(optionElement);
  });
}

function getShowIDFromName(showName) {
  return fetch(`/shows/getShowID?showName=${encodeURIComponent(showName)}`)
    .then((response) => response.json())
    .then((data) => {
      return data.showID;
    });
}

function clearInput(elementId) {
  document.getElementById(elementId).value = "";
}

async function addCharacter() {
  // console.log(document.getElementById("showName").value);
  // console.log(document.getElementById("netIDInput").value);
  // console.log(document.getElementById("characterName").value);
  const formData = new URLSearchParams();
  formData.append("characterName",document.getElementById("characterName").value);
  formData.append("showID", document.getElementById("showID").value);
  formData.append("netID", document.getElementById("netIDInput").value);

  const response = await fetch("/characters/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (response.ok) {
    alert("Character added successfully!");
    document.getElementById("add-character-form").reset();
    window.location.href = "/characters/loadpage";
  } else {
    alert("Error adding character.");
  }
}


