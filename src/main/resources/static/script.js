//this function processes the filter request and updates the table accordingly

function clearInput(elementId) {
  document.getElementById(elementId).value = "";
}

function updatePlaceholder() {
  const select = document.getElementById("filter-column");
  const input = document.getElementById("filter-input");

  const selectedLabel = select.options[select.selectedIndex].text;

  // Update placeholder
  input.placeholder = `Search by ${selectedLabel}`;
}

function findNetIDFromName(value, firstLastNet, page) {
  return fetch(`/student/filterBy?column=${firstLastNet}&value=${value}`)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("student-select");

      select.innerHTML = "";

      const noneFound = document.createElement("option");
      noneFound.innerHTML = "No students found";

      data.forEach((student) => {
        const option = document.createElement("option");

        option.value = JSON.stringify({
          netID: student.netID,
          firstName: student.firstName,
          lastName: student.lastName,
        });

        option.textContent = `${student.firstName} ${student.lastName} (${student.netID})`;
        select.appendChild(option);
      });

      if (data.length > 0) {
        document.getElementById(`add${page}Button`).disabled = false;
        if (data.length > 4) {
          select.size = 4; // limit size to 4 if more than 4 entries
        } else {
          select.size = data.length;
        }
      } else {
        select.size = 0;
        document.getElementById(`add${page}Button`).disabled = true;
        select.appendChild(noneFound);
      }

      // Return number of matching entries
      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);

      return 0; // return 0 on error
    });
}

function addSetNetID(selectElement, page) {
  if (!selectElement.value) return;

  const data = JSON.parse(selectElement.value);
  findNetIDFromName(data.netID, "netID", page);

  document.getElementById("firstName").value = data.firstName;
  document.getElementById("lastName").value = data.lastName;
  document.getElementById("netIDInput").value = data.netID;
}

function addEventListeners(page) {
  document.getElementById("netIDInput").addEventListener("input", function () {
    const netID = this.value.trim();
    if (netID !== "") {
      findNetIDFromName(netID, "netID", page);
      document.getElementById("student-select").hidden = false;
    }
    else{
      findNetIDFromName('', 'netID', 'Crew');
    }
  });
  document.getElementById("firstName").addEventListener("input", function () {
    const firstName = this.value.trim();
    if (firstName !== "") {
      findNetIDFromName(firstName, "firstName", page);
      document.getElementById("student-select").hidden = false;
    }
    else{
      findNetIDFromName('', 'netID', 'Crew');
    }
  });

  document.getElementById("lastName").addEventListener("input", function () {
    const lastName = this.value.trim();
    if (lastName !== "") {
      findNetIDFromName(lastName, "lastName", page);
      document.getElementById("student-select").hidden = false;
    }
    else{
      findNetIDFromName('', 'netID', 'Crew');
    }
  });
}

function searchByShowAtt(searchBy, searchValue, page) {
  return fetch(`/shows/getShowIDName?searchBy=${searchBy}&searchValue=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("show-select");
      select.innerHTML = "";

      const noneFound = document.createElement("option");
      noneFound.innerHTML = "No shows found";

      data.forEach((show) => {
        const option = document.createElement("option");

        option.value = JSON.stringify({
          showID: show.showID,
          showName: show.showName,
          yearSemester: show.yearSemester,
        });

        document.getElementById("showID").value=show.showID;
        option.textContent = `${show.showName} (${show.yearSemester})`;
        select.appendChild(option);
      });

      if (data.length > 0) {
        document.getElementById(`add${page}Button`).disabled = false;

        if (data.length > 4) {
          select.size = 4;
        } else {
          select.size = data.length;
        }
      } else {
        console.log("penisballs");
        select.size = 0;
        document.getElementById(`add${page}Button`).disabled = true;
        select.appendChild(noneFound);
      }

      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching show data:", error);
      return 0;
    });
}


function addShowEventListeners(page) {
  document.getElementById("showName").addEventListener("input", function () {
    const selectedOption = this.value.trim();
    if (selectedOption !== "") {
      searchByShowAtt("showName", selectedOption, page);
      document.getElementById("show-select").hidden = false;
    }
  });

  document.getElementById("yearSemester").addEventListener("input", function () {
    const selectedOption = this.value.trim();
    if (selectedOption !== "") {
      searchByShowAtt("yearSemester", selectedOption, page);
      document.getElementById("show-select").hidden = false;
    }
  });
}

function addSetShow(selectElement, page){
  if (!selectElement.value) return;

  const data = JSON.parse(selectElement.value);

  searchByShowAtt("showName", data.showName, page)
  document.getElementById("showName").value = data.showName;
  document.getElementById("yearSemester").value= data.yearSemester;
}
