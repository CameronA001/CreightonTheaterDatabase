function loadActors() {
    const urlParams = new URLSearchParams(window.location.search);
    const netID = urlParams.get("netID");

  fetch("/actors/getAll")
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.getElementById("actor-table-body");
      tableBody.innerHTML = "";

      data.forEach((actor) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="sticky">
            <a href="/student/loadpage?netID=${actor.netID}">
            ${actor.netID}
            </a>
            </td>
            <td>${actor.yearsActingExperience}</td>
            <td>${actor.skinTone}</td>
            <td>${actor.piercings}</td>
            <td>${actor.hairColor}</td>
            <td>${actor.previousInjuries}</td>
            <td>${actor.specialNotes}</td>
            <td>${actor.height}</td>
            <td>${actor.ringSize}</td>
            <td>${actor.shoeSize}</td>
            <td>${actor.headCirc}</td>
            <td>${actor.neckBase}</td>
            <td>${actor.chest}</td>
            <td>${actor.waist}</td>
            <td>${actor.highHip}</td>
            <td>${actor.lowHip}</td>
            <td>${actor.armseyeToArmseyeFront}</td>
            <td>${actor.neckToWaistFront}</td>
            <td>${actor.armseyeToArmseyeBack}</td>
            <td>${actor.neckToWaistBack}</td>
            <td>${actor.centerBackToWrist}</td>
            <td>${actor.outsleeveToWrist}</td>
            <td>${actor.outseamBelowKnee}</td>
            <td>${actor.outseamToAnkle}</td>
            <td>${actor.outseamToFloor}</td>
            <td>${actor.otherNotes}</td>
            <td>${actor.photo}</td>
            `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => console.error("Error fetching actor data:", error));

        if (netID) {
      console.log("true");
      document.getElementById("filter-input").value = netID;
      processFilter();
    }
}

function processFilter() {



    const filterValue = document.getElementById("filter-input").value;

    fetch(`/actors/filterBy?value=${filterValue}`)
        .then(res => res.json())
        .then(data => {
            const tableBody = document.getElementById(`actor-table-body`);
            tableBody.innerHTML = "";


            data.forEach(actor => {
                const row = document.createElement("tr");
                row.innerHTML = `
            <td class="sticky">
            <a href="/student/loadpage?netID=${actor.netID}">
            ${actor.netID}
            </a>
            </td>
            <td>${actor.yearsActingExperience}</td>
            <td>${actor.skinTone}</td>
            <td>${actor.piercings}</td>
            <td>${actor.hairColor}</td>
            <td>${actor.previousInjuries}</td>
            <td>${actor.specialNotes}</td>
            <td>${actor.height}</td>
            <td>${actor.ringSize}</td>
            <td>${actor.shoeSize}</td>
            <td>${actor.headCirc}</td>
            <td>${actor.neckBase}</td>
            <td>${actor.chest}</td>
            <td>${actor.waist}</td>
            <td>${actor.highHip}</td>
            <td>${actor.lowHip}</td>
            <td>${actor.armseyeToArmseyeFront}</td>
            <td>${actor.neckToWaistFront}</td>
            <td>${actor.armseyeToArmseyeBack}</td>
            <td>${actor.neckToWaistBack}</td>
            <td>${actor.centerBackToWrist}</td>
            <td>${actor.outsleeveToWrist}</td>
            <td>${actor.outseamBelowKnee}</td>
            <td>${actor.outseamToAnkle}</td>
            <td>${actor.outseamToFloor}</td>
            <td>${actor.otherNotes}</td>
            <td>${actor.photo}</td>
            `;
                tableBody.appendChild(row);
            });
        });

}


