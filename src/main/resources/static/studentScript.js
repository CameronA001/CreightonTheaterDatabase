function loadStudents() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  fetch("/student/getAll")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("student-table-body");
      tableBody.innerHTML = "";

      // If netID exists, filter data in JS; otherwise show all
      const filteredData = netID ? data.filter((s) => s.netID === netID) : data;

      filteredData.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>
                        <select class="netid-select"
                                onchange="handleNetIdDropdown(this.value, '${student.netID}')">
                            <option value="" selected>${student.netID}</option>
                            <option value="roles">Previous Roles</option>
                            <option value="shows">Previous Shows</option>
                            <option value="crew">CrewPage</option>
                            <option value="actor">ActorPage</option>
                            <option value="delete">Delete Student</option>
                            <option value="edit">Edit Student</option>
                        </select>
                    </td>
                    <td>${student.firstName} ${student.lastName}</td>
                    <td>${student.gradeLevel}</td>
                    <td>${student.pronouns}</td>
                    <td>${student.specialNotes}</td>
                    <td>${student.email}</td>
                    <td>${student.allergies_sensitivities}</td>
                `;
        tableBody.appendChild(row);
      });

      // Only set filter input if netID exists
      if (netID) {
        document.getElementById("filter-column").value = "netID";
        document.getElementById("filter-input").value = netID;
      }
    })
    .catch((error) => console.error("Error fetching student data:", error));
}

//this function processes the filter request and updates the table accordingly
function processFilter(page) {
  const filterBy = document.getElementById("filter-column").value;
  const filterValue = document.getElementById("filter-input").value;

  fetch(`/${page}/filterBy?column=${filterBy}&value=${filterValue}`)
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.getElementById(`${page}-table-body`);
      tableBody.innerHTML = "";

      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                    <td>
                        <select class="netid-select" onchange="handleNetIdDropdown(this.value, '${item.netID}')">
                            <option value="" selected>${item.netID}</option>
                            <option value="roles">Previous Roles</option>
                            <option value="shows">Previous Shows</option>
                            <option value="crew">CrewPage</option>
                            <option value="actor">ActorPage</option>
                            <option value="delete">Delete Student</option>
                            <option value="edit">Edit Student</option>
                        </select>
                    </td>
                    <td>${item.firstName} ${item.lastName}</td>
                    <td>${item.gradeLevel}</td>
                    <td>${item.pronouns}</td>
                    <td>${item.specialNotes}</td>
                    <td>${item.email}</td>
                    <td>${item.allergies_sensitivities}</td>
                `;
        tableBody.appendChild(row);
      });
    });
}

function clearInput(elementId) {
  document.getElementById(elementId).value = "";
}

function handleNetIdDropdown(selectedValue, netID) {
  if (!selectedValue) {
    return;
  }
  if (selectedValue === "roles") {
    window.location.href = `/characters/loadpage?netID=${netID}`;
  }
  if (selectedValue === "shows") {
    window.location.href = `/student/${netID}/shows`;
  }
  if (selectedValue === "crew") {
    window.location.href = `/crew/loadpage?netID=${netID}`;
  }
  if (selectedValue === "delete") {
    deleteStudent(netID);
  }
  if (selectedValue === "edit") {
    window.location.href = `/student/${netID}/editPage`;
  }
  if (selectedValue === "actor") {
    window.location.href = `/actors/loadpage?netID=${netID}`;
  }
}

async function editStudent(netID) {
  const formData = new URLSearchParams();
  formData.append("netID", document.getElementById("netID").value);
  formData.append("firstName", document.getElementById("firstName").value);
  formData.append("lastName", document.getElementById("lastName").value);
  formData.append("gradeLevel", document.getElementById("gradeLevel").value);
  formData.append("pronouns", document.getElementById("pronouns").value);
  formData.append(
    "specialNotes",
    document.getElementById("specialNotes").value
  );
  formData.append("email", document.getElementById("email").value);
  formData.append(
    "allergies_sensitivities",
    document.getElementById("allergies").value
  );

  const response = await fetch(`/student/${netID}/edit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (response.ok) {
    alert("Student edited successfully!");
    document.getElementById("edit-student-form").reset();
    window.location.href = "/student/loadpage";
  } else {
    alert("Error editing student.");
  }
}

const FILTER_DROPDOWN_MAP = {
  student: [
    { value: "netID", label: "NetID" },
    { value: "firstName", label: "First Name" },
    { value: "lastName", label: "Last Name" },
    { value: "gradeLevel", label: "Grade Level" },
    { value: "allergies_sensitivities", label: "Allergies/Sensitivities" },
  ],
};

function populateFilterDropdown() {
  const select = document.getElementById("filter-column");
  select.innerHTML = "";

  const options = FILTER_DROPDOWN_MAP["student"];

  if (!options) return;

  options.forEach((opt) => {
    const optionElement = document.createElement("option");
    optionElement.value = opt.value; // this is sent to the backend
    optionElement.textContent = opt.label; // this is displayed to the user
    select.appendChild(optionElement);
  });
}
async function addStudent() {
  const formData = new URLSearchParams();
  formData.append("netID", document.getElementById("netID").value);
  formData.append("firstName", document.getElementById("firstName").value);
  formData.append("lastName", document.getElementById("lastName").value);
  formData.append("gradeLevel", document.getElementById("gradeLevel").value);
  formData.append("pronouns", document.getElementById("pronouns").value);
  formData.append(
    "specialNotes",
    document.getElementById("specialNotes").value
  );
  formData.append("email", document.getElementById("email").value);
  formData.append("allergies", document.getElementById("allergies").value);

  const response = await fetch("/student/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (response.ok) {
    alert("Student added successfully!");
    document.getElementById("add-student-form").reset();
    window.location.href = "/student/loadpage";
  } else {
    alert("Error adding student.");
  }
}

function deleteStudent(netID) {
  if (
    !confirm(`Are you sure you want to delete student with NetID: ${netID}?`)
  ) {
    return;
  }
  const formData = new URLSearchParams();
  formData.append("netID", netID);

  fetch("/student/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  })
    .then((response) => {
      if (response.ok) {
        alert("Student deleted successfully!");
        loadStudents();
      } else {
        alert("Error deleting student.");
      }
    })
    .catch((error) => console.error("Error deleting student:", error));
}

function validateNetID() {
  document.getElementById("netID").addEventListener("input", function (e) {
    let value = e.target.value;

    // Only allow letters for first 3 chars
    if (value.length <= 3) {
      value = value.replace(/[^A-Za-z]/g, "");
    }

    // After 3 chars, allow only digits
    if (value.length > 3) {
      value = value.substring(0, 3) + value.substring(3).replace(/[^0-9]/g, "");
    }

    // Enforce max length 8
    value = value.substring(0, 8);

    e.target.value = value;
  });
}
