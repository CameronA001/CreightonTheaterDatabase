function loadStudents() {
  fetch("/student/getAll")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("student-table-body");
      tableBody.innerHTML = "";

      data.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                        <td>
                            <select class="netid-select"
                                    onchange="handleNetIdDropdown(this.value, '${student.netID}')">
                                <option value="">
                                    ${student.netID}
                                </option>
                                <option value="roles">Previous Roles</option>
                                <option value="shows">Previous Shows</option>
                                <option value="crewActor">Crew/Actor Page</option>
                                <option value="delete")">Delete Student</option>
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
    })
    .catch((error) => console.error("Error fetching student data:", error));

}

function handleNetIdDropdown(selectedValue, netID) {
  if (!selectedValue) {
    return;
  }
  if (selectedValue === "roles") {
    window.location.href = `/student/${netID}/roles`;
  }
  if (selectedValue === "shows") {
    window.location.href = `/student/${netID}/shows`;
  }
  if (selectedValue === "crewActor") {
    window.location.href = `/student/${netID}/crewActor`;
  }
  if( selectedValue === "delete") {
    deleteStudent(netID);
  }
  if (selectedValue === "edit") {
    window.location.href = `/student/${netID}/editPage`;
  }
}

function populateEditStudentPage(student) {
    document.getElementById("netID").value = student.netID;
    document.getElementById("firstName").value = student.firstName;
    document.getElementById("lastName").value = student.lastName;
    document.getElementById("gradeLevel").value = student.gradeLevel;
    document.getElementById("pronouns").value = student.pronouns;
    document.getElementById("specialNotes").value = student.specialNotes;
    document.getElementById("email").value = student.email;
    document.getElementById("allergies").value = student.allergies_sensitivities;
}

async function editStudent(netID) {
    const formData = new URLSearchParams();
    formData.append("netID", document.getElementById("netID").value);
    formData.append("firstName", document.getElementById("firstName").value);
    formData.append("lastName", document.getElementById("lastName").value);
    formData.append("gradeLevel", document.getElementById("gradeLevel").value);
    formData.append("pronouns", document.getElementById("pronouns").value);
    formData.append("specialNotes", document.getElementById("specialNotes").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("allergies", document.getElementById("allergies").value);

    const response = await fetch(`/student/${netID}/edit`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
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
    ]
};

function populateFilterDropdown() {
    const select = document.getElementById("filter-column");
    select.innerHTML = ""; 

    const options = FILTER_DROPDOWN_MAP['student'];

    if (!options) return;

    options.forEach(opt => {
        const optionElement = document.createElement("option");
        optionElement.value = opt.value;   // this is sent to the backend
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
    formData.append("specialNotes", document.getElementById("specialNotes").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("allergies", document.getElementById("allergies").value);

    const response = await fetch("/student/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
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
    if (!confirm(`Are you sure you want to delete student with NetID: ${netID}?`)) {
        return;
    }
    const formData = new URLSearchParams();
    formData.append("netID", netID);

    fetch("/student/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    })
    .then(response => {
        if (response.ok) {
            alert("Student deleted successfully!");
            loadStudents();
        } else {
            alert("Error deleting student.");
        }
    })
    .catch(error => console.error("Error deleting student:", error));
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
        value = value.substring(0,3) + value.substring(3).replace(/[^0-9]/g, "");
    }

    // Enforce max length 8
    value = value.substring(0, 8);

    e.target.value = value;
}); 
}