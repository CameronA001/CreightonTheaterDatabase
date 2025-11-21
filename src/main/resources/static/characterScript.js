function loadCharacters() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

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
                                <option value="">
                                    ${character.characterName}
                                </option>
                                <option value="delete">Delete Character</option>
                                <option value="edit">Edit Character</option>
                            </select>
                        </td>
                        <td>${character.showName}</td>
                        <td>${character.firstName} ${character.lastName}</td>
                        <td>${character.netID}</td>
                        <td>${character.showID}</td>`;
        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching character data:", error));
  if (netID != null) {
    document.getElementById("filter-column").value = "netID,characters";
    document.getElementById("filter-input").value = netID;
    processFilter("characters");
  }
}

function handleCharacterDropdown(selectedValue, characterName) {
  if (selectedValue === "") {
    return;
  }
  if (selectedValue === "edit") {
    window.location.href = `/characters/edit?characterName=${characterName}`;
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
                                <option value="edit">Edit Character</option>
                            </select>
                        </td>
                        <td>${character.showName}</td>
                        <td>${character.firstName} ${character.lastName}</td>
                        <td>${character.netID}</td>
                        <td>${character.showID}</td>`;
        tableBody.appendChild(row);
      });
    });
}

const FILTER_DROPDOWN_MAP = {
  character: [
    { value: "netID,characters", label: "NetID" },
    { value: "firstName,characters", label: "First Name" },
    { value: "lastName,characters", label: "Last Name" },
    { value: "showID,shows", label: "Show ID" },
    { value: "characterName,characters", label: "Character Name" },
    { value: "showName,shows", label: "Show Name" },
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
