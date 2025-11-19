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

window.onload = loadStudents;


function handleNetIdDropdown(selectedValue, netID) {
  if (!selectedValue){
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
}