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

function findNameAndNetID(column, netID, page) {

  return fetch(`/student/filterBy?column=${column}&value=${netID}`)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("student-select");

      // Clear old results
      select.innerHTML = "";

      // Populate all matches
      data.forEach(student => {
        const option = document.createElement("option");
        option.value = student.netID;
        option.textContent = `${student.firstName} ${student.lastName} (${student.netID})`;
        select.appendChild(option);
      });

      if (data.length > 0) {
        document.getElementById(`add${page}Button`).disabled = false;
        if (data.length > 4) {
          select.size = 4; // limit size to 4 if more than 4 entries
        } 
        else {
        select.size = data.length;
        }
      } else {
        select.size = 0; 
        document.getElementById(`add${page}Button`).disabled = true;
      }

      // Return number of matching entries
      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);

      return 0;  // return 0 on error
    });


}


function findNetIDFromName(name, firstLast, docElementId, page) {


  return fetch(`/student/filterBy?column=${firstLast}&value=${name}`)
    .then((res) => res.json())
    .then((data) => {
      const select = document.getElementById("student-select");

      // Clear old results
      select.innerHTML = "";

              const option = document.createElement("option");
      // Populate all matches
      data.forEach(student => {
        option.value = JSON.stringify({
    netID: student.netID,
    firstName: student.firstName,
    lastName: student.lastName
  });

        );
        option.textContent = `${student.firstName} ${student.lastName} (${student.netID})`;
        select.appendChild(option);
      });

      if (data.length > 0) {
        document.getElementById(`add${page}Button`).disabled = false;
        if (data.length > 3) {
          select.size = 3; // limit size to 3 if more than 3 entries
        } 
        else {
        select.size = data.length;
        }
      } else {
        select.size = 0; 
        document.getElementById(`add${page}Button`).disabled = true;
      }

      // Return number of matching entries
      return data.length;
    })
    .catch((error) => {
      console.error("Error fetching student data:", error);

      return 0;  // return 0 on error
    });

}

function addSetNetID() {
  const input = document.getElementById("netIDInput");
  const selectedOption = document.getElementById("student-select").value;
  input.value = selectedOption;
}


