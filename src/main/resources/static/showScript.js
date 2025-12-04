function loadShows() {
  const urlParams = new URLSearchParams(window.location.search);
  const netID = urlParams.get("netID");

  if (netID) {
    document.getElementById("filter-input").value = netID;
    processFilter();
  } else {
    fetch("/shows/getAll")
      .then((response) => response.json())
      .then((data) => {
        const tableBody = document.getElementById("show-table-body");
        tableBody.innerHTML = "";

        data.forEach((show) => {
          const row = document.createElement("tr");
          row.innerHTML = `
                    <td>
                        <select class="netid-select">
                    <option value="">${show.showID}</option>
                    <option value="viewCrew">View Crew</option>
                        </select>
                    </td>
                    <td>${show.showName}</td>
                    <td>${show.yearSemester}</td>
                    <td>${show.director}</td>
                    <td>${show.genre}</td>
                    <td>${show.playWright}</td>
                `;
          tableBody.appendChild(row);
        });
      })
      .catch((error) => console.error("Error loading shows:", error));
  }
}

// function processFilter(){
//     const filterValue = document.getElementById("filter-input").value;

//     fetch(`/crew/filterBy?value=${filterValue}`)
//         .then((res) => res.json())
//         .then((crew) => {
//             const tableBody = document.getElementById(`crew-table-body`);
//             tableBody.innerHTML = "";

//             data.forEach((item) => {
//                 const row = document.createElement("tr");
//                 row.innerHTML = `
//                     <td>
//                 `

//             })

//         })
// }
