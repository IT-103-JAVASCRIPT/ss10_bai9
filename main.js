
let studentId = document.getElementById("studentId");
let studentName = document.getElementById("studentName");
let studentScore = document.getElementById("studentScore");
let submitBtn = document.getElementById("submitBtn");
let resetBtn = document.getElementById("resetBtn");
let studentList = document.getElementById("studentList");
let editIndexInput = document.getElementById("editIndex");
let pagination = document.getElementById("pagination");

let students = JSON.parse(localStorage.getItem("students")) || [];
let currentPage = 1;
let studentsPerPage = 5;

function saveToLocalStorage() {
    localStorage.setItem("students", JSON.stringify(students));
}

function renderStudents() {

    studentList.innerHTML = "";

    let start = (currentPage - 1) * studentsPerPage;
    let end = start + studentsPerPage;

    let paginatedStudents = students.slice(start, end);

    paginatedStudents.forEach((student, index) => {
        let realIndex = start + index;

        let row = `
            <tr>
                <td>${realIndex + 1}</td>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>${student.score}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editStudent(${realIndex})">Sửa</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteStudent(${realIndex})">Xóa</button>
                </td>
            </tr>
        `;

        studentList.innerHTML += row;
    });

    renderPagination();
}

function renderPagination() {

    pagination.innerHTML = "";

    let totalPages = Math.ceil(students.length / studentsPerPage);

    for (let i = 1; i <= totalPages; i++) {
        let btn = document.createElement("button");
        btn.innerText = i;
        btn.className = "btn btn-sm";

        if (i === currentPage) {
            btn.classList.add("active");
        }

        btn.onclick = function () {
            currentPage = i;
            renderStudents();
        };

        pagination.appendChild(btn);
    }
}

function validateForm(isEdit) {

    let id = studentId.value.trim();
    let name = studentName.value.trim();
    let score = studentScore.value.trim();

    if (id === "") {
        alert("Mã sinh viên không được để trống!");
        return false;
    }
    let idLowerCase = id.toLowerCase();

    if (!isEdit) {
        let isDuplicate = students.some(s => s.id.toLowerCase() === idLowerCase);
        if (isDuplicate) {
            alert("Mã sinh viên đã tồn tại!");
            return false;
        }
    }


    if (name === "") {
        alert("Tên sinh viên không được để trống!");
        return false;
    }

    if (name.length < 5) {
        alert("Tên sinh viên phải có ít nhất 5 ký tự!");
        return false;
    }

    let nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

    if (!nameRegex.test(name)) {
        alert("Tên sinh viên không được chứa số hoặc ký tự đặc biệt!");
        return false;
    }

    if (score === "") {
        alert("Điểm TB không được để trống!");
        return false;
    }

    if (isNaN(score) || score < 0 || score > 10) {
        alert("Điểm TB phải là số trong khoảng từ 0 đến 10!");
        return false;
    }

    return true;
}

function resetForm() {
    studentId.value = "";
    studentName.value = "";
    studentScore.value = "";
    editIndexInput.value = "";
    submitBtn.innerText = "Thêm sinh viên";
}

submitBtn.onclick = function () {

    let editIndex = editIndexInput.value;

    if (editIndex !== "") {

        if (validateForm(true)) {

            students[editIndex].id = studentId.value.trim();
            students[editIndex].name = studentName.value.trim();
            students[editIndex].score = parseFloat(studentScore.value);

            alert("Cập nhật sinh viên thành công!");

            saveToLocalStorage();
            renderStudents();
            resetForm();
        }

    } else {

        if (validateForm(false)) {

            let student = {
                id: studentId.value.trim(),
                name: studentName.value.trim(),
                score: parseFloat(studentScore.value)
            };

            students.push(student);

            saveToLocalStorage();
            renderStudents();
            resetForm();
        }
    }
};

// =======================
// SỬA
// =======================
function editStudent(index) {

    let student = students[index];

    studentId.value = student.id;
    studentName.value = student.name;
    studentScore.value = student.score;

    editIndexInput.value = index;
    submitBtn.innerText = "Cập nhật";
}

// =======================
// XÓA
// =======================
function deleteStudent(index) {

    let confirmDelete = confirm(
        "Bạn có chắc chắn muốn xóa sinh viên " + students[index].name + "?"
    );

    if (confirmDelete) {

        students.splice(index, 1);

        alert("Xóa sinh viên thành công!");

        saveToLocalStorage();
        renderStudents();
    }
}

resetBtn.onclick = function () {
    resetForm();
};

renderStudents();