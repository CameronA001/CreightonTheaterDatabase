function loadCrew(){
    const urlParams = new URLSearchParams(window.location.search);
    const netID = urlParams.get("netID");

    if(netID){
        document.getElementById("filter-input").value = netID;
        processFilter();
    } else{
            fetch("/crew/getAll")
        .then((response) => response.json())
        .then((data) => {
            const tableBody = document.getElementById("crew-table-body");
            tableBody.innerHTML = "";

            data.forEach((crew) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>
                    <a href="/student/loadpage?netID=${crew.crewID}">
                    ${crew.crewID}
                    </a>
                    </td>
                    <td class = "sticky">${crew.firstName} ${crew.lastName}</td>
                    <td>${crew.wigTrained}</td>
                    <td>${crew.makeupTrained}</td>
                    <td>${crew.musicReading}</td>
                    <td>${crew.lighting}</td>
                    <td>${crew.sound}</td>
                    <td>${crew.specialty}</td>
                    <td>${crew.notes}</td>
                `;

                tableBody.appendChild(row);
            });
        })
        .catch((error) => console.error("Error fetching crew data:", error));s
    }

    }


function processFilter() {
  const filterValue = document.getElementById("filter-input").value;

  fetch(`/crew/filterBy?value=${filterValue}`)
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.getElementById(`crew-table-body`);
      tableBody.innerHTML = "";

      data.forEach((crew) => {
        const row = document.createElement("tr");
                row.innerHTML = `
                    <td>
                    <a href="/student/loadpage?netID=${crew.crewID}">
                    ${crew.crewID}
                    </a>
                    </td>
                    <td class = "sticky">${crew.firstName} ${crew.lastName}</td>
                    <td>${crew.wigTrained}</td>
                    <td>${crew.makeupTrained}</td>
                    <td>${crew.musicReading}</td>
                    <td>${crew.lighting}</td>
                    <td>${crew.sound}</td>
                    <td>${crew.specialty}</td>
                    <td>${crew.notes}</td>
                `;
        tableBody.appendChild(row);
      });
    });
}

function appendIfNotEmpty(formData, key, elementId) {
    const val = document.getElementById(elementId).value;
    if (val !== "") formData.append(key, val);
}

async function addCrew(){
    const formData = new URLSearchParams();
    
    appendIfNotEmpty(formData, "crewID", "netIDInput");
    appendIfNotEmpty(formData, "firstName", "firstName");
    appendIfNotEmpty(formData, "lastName", "lastName");
    appendIfNotEmpty(formData, "wigTrained", "wigTrained");
    appendIfNotEmpty(formData, "makeupTrained", "makeupTrained");
    appendIfNotEmpty(formData, "musicReading", "musicReading");
    appendIfNotEmpty(formData, "lighting", "lighting");
    appendIfNotEmpty(formData, "sound", "sound");
    appendIfNotEmpty(formData, "specialty", "specialty");
    appendIfNotEmpty(formData, "notes", "notes");

      const response = await fetch("/crew/addCrew", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
      });

    const text = await response.text();

    if (response.ok) {
    alert(text);
    document.getElementById("add-crew-form").reset();
    window.location.href = "/crew/loadpage";
} else {
    alert("Error adding crew: " + text); 
}


  if (response.ok) {
    alert("Crew added successfully!");
    document.getElementById("add-crew-form").reset();
    window.location.href = "/crew/loadpage";
  } else {
    alert("Error adding crew.");
  }
}
