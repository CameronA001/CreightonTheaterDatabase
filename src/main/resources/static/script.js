//this function processes the filter request and updates the table accordingly
function processFilter(page) {
    const filterBy = document.getElementById("filter-column").value;
    const filterValue = document.getElementById("filter-input").value;

    fetch(`/${page}/filterBy?column=${filterBy}&value=${filterValue}`)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById(`${page}-table-body`);
            tableBody.innerHTML = "";

            data.forEach(item => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${item.netID}</td>
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

function clearInput(elementId,page){
    document.getElementById(elementId).value = "";
}