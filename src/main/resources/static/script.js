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

      data.forEach(student => {

  const option = document.createElement("option");

          option.value = JSON.stringify({
            netID: student.netID,
            firstName: student.firstName,
            lastName: student.lastName
          });

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

function addSetNetID(docElementId) {

      const firstNameField = document.getElementById("firstName");
      const lastNameField = document.getElementById("lastName");
      const netIDField = document.getElementById("netIDInput");

      if (docElementId === "netIDInput" && data.length === 1) {
        firstNameField.value = data[0].firstName;
        lastNameField.value = data[0].lastName;
      }

  const selectedOption = document.getElementById("student-select").value;
  input.value = selectedOption;
}


