        function loadStudents(){
            fetch('/student/getAll')
            .then(response => response.json())
            .then(data => {
                const tableBody = document.getElementById('student-table-body');
                tableBody.innerHTML = '';

                data.forEach(student => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${student.netID}</td>
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
            .catch(error => console.error('Error fetching student data:', error));
        }
    
        window.onload = loadStudents;