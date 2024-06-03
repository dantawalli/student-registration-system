const addButton = document.querySelector("#addButton");
const studentsTable = document.querySelector("#students");
let editingRow = null;
const students = [];

addButton.addEventListener("click", addOrEditStudent);
document.addEventListener("DOMContentLoaded", loadStudentsFromLocalStorage);

/*=============== ADD OR EDIT STUDENT RECORD===============*/
function addOrEditStudent(e) {
    e.preventDefault();
    const studentName = document.querySelector("#studentName").value;
    const studentId = document.querySelector("#studentId").value;
    const contactNo = document.querySelector("#contactNo").value;
    const email = document.querySelector("#email").value;

    const isValid = validateInput(studentName, studentId, contactNo, email);

    if (!isValid) {
        return;
    }

    if (editingRow) {
        editingRow.children[0].textContent = studentName;
        editingRow.children[1].textContent = studentId;
        editingRow.children[2].textContent = contactNo;
        editingRow.children[3].textContent = email;
        editingRow = null;
    } else {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `<td>${studentName}</td>
                              <td>${studentId}</td>
                              <td>${contactNo}</td>
                              <td>${email}</td>
                              <td>
                                <button type="button" class="editButton">Edit</button>
                              </td>
                              <td>
                                <button type="button" class="deleteButton">Delete</button>
                              </td>`;
        studentsTable.appendChild(tableRow);

        tableRow.querySelector(".editButton").addEventListener("click", () => editStudent(tableRow));
        tableRow.querySelector(".deleteButton").addEventListener("click", () => deleteStudent(tableRow));
    }

    resetForm();
    saveStudentsToLocalStorage();
}

/*=============== EDIT STUDENT RECORD===============*/
function editStudent(row) {
    editingRow = row;
    document.querySelector("#studentName").value = row.children[0].textContent;
    document.querySelector("#studentId").value = row.children[1].textContent;
    document.querySelector("#contactNo").value = row.children[2].textContent;
    document.querySelector("#email").value = row.children[3].textContent;
}

/*=============== DELETE STUDENT RECORD===============*/
function deleteStudent(row) {
    row.remove();
    saveStudentsToLocalStorage();
}

/*=============== RESET FROM AFTER SAVING STUDENT RECORD===============*/
function resetForm() {
    document.querySelector("#studentName").value = '';
    document.querySelector("#studentId").value = '';
    document.querySelector("#contactNo").value = '';
    document.querySelector("#email").value = '';
    editingRow = null;
}
/*=============== SAVE STUDENT RECORD TO LOCAL STORAGE===============*/
function saveStudentsToLocalStorage() {
    const students = [];
    studentsTable.querySelectorAll("tr").forEach(row => {
        if (row.children.length === 6) { // Adjust this to match the number of <td> elements
            const student = {
                name: row.children[0].textContent,
                id: row.children[1].textContent,
                contactNo: row.children[2].textContent,
                email: row.children[3].textContent
            };
            students.push(student);
        }
    });
    localStorage.setItem("students", JSON.stringify(students));
}

/*=============== LOAD STUDENT RECORD FROM LOCAL STORAGE===============*/
function loadStudentsFromLocalStorage() {
    const savedStudents = JSON.parse(localStorage.getItem("students") || "[]");
    savedStudents.forEach(student => {
        const tableRow = document.createElement("tr");
        tableRow.innerHTML = `<td>${student.name}</td>
                              <td>${student.id}</td>
                              <td>${student.contactNo}</td>
                              <td>${student.email}</td>
                              <td>
                                <button type="button" class="editButton">Edit</button>
                              </td>
                              <td>
                                <button type="button" class="deleteButton">Delete</button>
                              </td>`;
        studentsTable.appendChild(tableRow);

        tableRow.querySelector(".editButton").addEventListener("click", () => editStudent(tableRow));
        tableRow.querySelector(".deleteButton").addEventListener("click", () => deleteStudent(tableRow));
    });
}

/*=============== VALIDATE FORM INPUT===============*/
function validateInput(studentName, studentId, contactNo, email) {
    let isValid = true;

    // Validate Student ID
    const studentIdError = document.getElementById('studentIdError');
    const studentIdPattern = /^\d+$/;
    if (!studentIdPattern.test(studentId)) {
        studentIdError.style.display = 'block';
        isValid = false;
    } else {
        studentIdError.style.display = 'none';
    }

    // Validate Student Name
    const studentNameError = document.getElementById('studentNameError');
    const studentNamePattern = /^[A-Za-z\s]+$/;
    if (!studentNamePattern.test(studentName)) {
        studentNameError.style.display = 'block';
        isValid = false;
    } else {
        studentNameError.style.display = 'none';
    }

    // Validate Contact Number
    const contactNoError = document.getElementById('contactNoError');
    const contactNoPattern = /^\d+$/;
    if (!contactNoPattern.test(contactNo)) {
        contactNoError.style.display = 'block';
        isValid = false;
    } else {
        contactNoError.style.display = 'none';
    }

    // Validate Email
    const emailError = document.getElementById('emailError');
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailError.style.display = 'none';
    }

    return isValid;
}
