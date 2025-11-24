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
                                <option value="" selected>
                                    ${character.characterName}
                                </option>
                                <option value="delete">Delete Character</option>
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
      console.log("penis");
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
    { value: "firstName,student", label: "First Name" },
    { value: "lastName,student", label: "Last Name" },
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

function getShowIDFromName(showName) {
  return fetch(`/shows/getShowID?showName=${encodeURIComponent(showName)}`)
    .then((response) => response.json())
    .then((data) => {
      return data.showID;
    });
}


async function addCharacter() {
    const characterName = document.getElementById("characterName").value;
    const netID = document.getElementById("netID").value;

    const showID = await getShowIDFromName(document.getElementById("showName").value);

    const params = new URLSearchParams();
    params.append("characterName", characterName);
    params.append("netID", netID);
    params.append("showID", showID);

    fetch("/characters/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    })
    .then(response => {
        return response.json().then(data => ({ status: response.status, body: data }));
    })
    .then(({ status, body }) => {
        if (status === 200) {
            alert(body.message); 
            window.location.href = "/characters/loadpage"; 
        } else {
            alert("Error adding character: " + body.message);
        }
    })
    .catch(error => {
        console.error("Network or JS error:", error);
        alert("Error adding character: " + error.message);
    });
}

function clearInput(elementId){
    document.getElementById(elementId).value = "";
}

