function loadActors() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  if (netID) {
    console.log("true");
    document.getElementById("filter-input").value = netID;
    processFilter();
  } else {
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
  }
}

function processFilter() {
  const filterValue = document.getElementById("filter-input").value;

  fetch(`/actors/filterBy?value=${filterValue}`)
    .then((res) => res.json())
    .then((data) => {
      const tableBody = document.getElementById(`actor-table-body`);
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
    });
}

function appendIfNotEmpty(formData, key, elementId) {
    const val = document.getElementById(elementId).value;
    if (val !== "") formData.append(key, val);
}

async function addActor() {
    const formData = new URLSearchParams();

    appendIfNotEmpty(formData, "netID", "netIDInput");
    appendIfNotEmpty(formData, "skinTone", "skinTone");
    appendIfNotEmpty(formData, "piercings", "piercings");
    appendIfNotEmpty(formData, "hairColor", "hairColor");
    appendIfNotEmpty(formData, "previousInjuries", "previousInjuries");
    appendIfNotEmpty(formData, "specialNotes", "specialNotes");
    appendIfNotEmpty(formData, "height", "height");
    appendIfNotEmpty(formData, "ringSize", "ringSize");
    appendIfNotEmpty(formData, "shoeSize", "shoeSize");
    appendIfNotEmpty(formData, "headCirc", "headCirc");
    appendIfNotEmpty(formData, "neckBase", "neckBase");
    appendIfNotEmpty(formData, "chest", "chest");
    appendIfNotEmpty(formData, "waist", "waist");
    appendIfNotEmpty(formData, "highHip", "highHip");
    appendIfNotEmpty(formData, "lowHip", "lowHip");
    appendIfNotEmpty(formData, "armseyeToArmseyeFront", "armseyeToArmseyeFront");
    appendIfNotEmpty(formData, "neckToWaistFront", "neckToWaistFront");
    appendIfNotEmpty(formData, "armseyeToArmseyeBack", "armseyeToArmseyeBack");
    appendIfNotEmpty(formData, "neckToWaistBack", "neckToWaistBack");
    appendIfNotEmpty(formData, "centerBackToWrist", "centerBackToWrist");
    appendIfNotEmpty(formData, "outsleeveToWrist", "outsleeveToWrist");
    appendIfNotEmpty(formData, "outseamBelowKnee", "outseamBelowKnee");
    appendIfNotEmpty(formData, "outseamToAnkle", "outseamToAnkle");
    appendIfNotEmpty(formData, "outseamToFloor", "outseamToFloor");
    appendIfNotEmpty(formData, "otherNotes", "otherNotes");

  const response = await fetch("/actors/add", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
});

const text = await response.text();

if (response.ok) {
    alert(text); // "Actor added successfully"
    document.getElementById("add-actor-form").reset();
    window.location.href = "/actors/loadpage";
} else {
    alert("Error adding actor: " + text); // now you’ll see the actual error
}


  if (response.ok) {
    alert("Actor added successfully!");
    document.getElementById("add-actor-form").reset();
    window.location.href = "/actors/loadpage";
  } else {
    alert("Error adding actor.");
  }
}


