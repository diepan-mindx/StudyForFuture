import { db } from "./firebase_config.js";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// -----------------------------
// Lấy courseId từ URL
function getCourseIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("courseId");
}

// -----------------------------
// Tải dữ liệu khóa học
async function loadCourseData(courseId) {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);

    if (!courseSnap.exists()) {
      alert("⚠️ Không tìm thấy khóa học!");
      window.location.href = "courses.html";
      return;
    }

    const course = courseSnap.data();
    document.getElementById("title").value = course.title || "";
    document.getElementById("desc").value = course.desc || "";
    document.getElementById("img").value = course.img || "";

    renderLessons(courseId, course.lessons || []);
    renderStudents(courseId, course.students || []);
  } catch (err) {
    console.error("Lỗi khi tải khóa học:", err);
    alert("Không thể tải dữ liệu khóa học!");
  }
}

// -----------------------------
// Cập nhật thông tin khóa học
async function updateCourse(courseId) {
  const title = document.getElementById("title").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const img = document.getElementById("img").value.trim();

  if (!title || !desc) {
    alert("⚠️ Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    const courseRef = doc(db, "courses", courseId);
    await updateDoc(courseRef, {
      title,
      desc,
      img,
      updatedAt: serverTimestamp(),
    });

    alert("✅ Đã lưu thay đổi khóa học!");
  } catch (error) {
    console.error("Lỗi cập nhật:", error);
    alert("❌ Không thể cập nhật khóa học!");
  }
}

// -----------------------------
// Thêm bài giảng mới
async function addLesson(courseId, title, content) {
  if (!title || !content) {
    alert("⚠️ Vui lòng nhập đủ thông tin bài giảng!");
    return;
  }

  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    const course = courseSnap.data();

    const newLesson = { title, content };
    const newLessons = [...(course.lessons || []), newLesson];

    await updateDoc(courseRef, {
      lessons: newLessons,
      updatedAt: serverTimestamp(),
    });
    renderLessons(courseId, newLessons);
  } catch (error) {
    console.error("Lỗi thêm bài giảng:", error);
    alert("❌ Không thể thêm bài giảng!");
  }
}

// -----------------------------
// Thêm học viên mới
async function addStudent(courseId, name, email) {
  if (!name || !email) {
    alert("⚠️ Vui lòng nhập đủ thông tin học viên!");
    return;
  }

  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    const course = courseSnap.data();

    const newStudent = { name, email, progress: 0 };
    const newStudents = [...(course.students || []), newStudent];

    await updateDoc(courseRef, {
      students: newStudents,
      updatedAt: serverTimestamp(),
    });
    renderStudents(courseId, newStudents);
  } catch (error) {
    console.error("Lỗi thêm học viên:", error);
    alert("❌ Không thể thêm học viên!");
  }
}

// -----------------------------
// Xóa bài giảng
async function deleteLesson(courseId, index) {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    const course = courseSnap.data();

    const newLessons = course.lessons.filter((_, i) => i !== index);
    await updateDoc(courseRef, { lessons: newLessons });

    alert("🗑️ Đã xóa bài giảng!");
    renderLessons(courseId, newLessons);
  } catch (error) {
    console.error("Lỗi khi xóa bài giảng:", error);
    alert("❌ Không thể xóa bài giảng!");
  }
}

// -----------------------------
// Xóa học viên
async function deleteStudent(courseId, index) {
  try {
    const courseRef = doc(db, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    const course = courseSnap.data();

    const newStudents = course.students.filter((_, i) => i !== index);
    await updateDoc(courseRef, { students: newStudents });

    alert("🗑️ Đã xóa học viên!");
    renderStudents(courseId, newStudents);
  } catch (error) {
    console.error("Lỗi khi xóa học viên:", error);
    alert("❌ Không thể xóa học viên!");
  }
}

// -----------------------------
// Render bảng bài giảng
function renderLessons(courseId, lessons) {
  const container = document.getElementById("lessonTableContainer");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "min-w-full border text-left text-gray-700";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr class="bg-blue-100">
      <th class="py-3 px-4">#</th>
      <th class="py-3 px-4">Tên bài học</th>
      <th class="py-3 px-4">Nội dung</th>
      <th class="py-3 px-4 text-center">Hành động</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  lessons.forEach((lesson, index) => {
    const row = document.createElement("tr");
    row.className = "border-b hover:bg-gray-50 transition";
    row.innerHTML = `
      <td class="py-3 px-4">${index + 1}</td>
      <td class="py-3 px-4">${lesson.title}</td>
      <td class="py-3 px-4">${lesson.content}</td>
      <td class="py-3 px-4 text-center space-x-2">
        <button class="edit-btn px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Sửa</button>
        <button class="delete-btn px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Xóa</button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => {
      alert("✏️ Tính năng chỉnh sửa bài giảng đang được phát triển!");
    });

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa bài giảng này?")) {
        deleteLesson(courseId, index);
      }
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

// -----------------------------
// Render bảng học viên
function renderStudents(courseId, students) {
  const container = document.getElementById("studentTableContainer");
  container.innerHTML = "";

  const table = document.createElement("table");
  table.className = "min-w-full border text-left text-gray-700";

  const thead = document.createElement("thead");
  thead.innerHTML = `
    <tr class="bg-blue-100">
      <th class="py-3 px-4">#</th>
      <th class="py-3 px-4">Họ tên</th>
      <th class="py-3 px-4">Email</th>
      <th class="py-3 px-4">Tiến độ</th>
      <th class="py-3 px-4 text-center">Hành động</th>
    </tr>
  `;

  const tbody = document.createElement("tbody");

  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.className = "border-b hover:bg-gray-50 transition";
    row.innerHTML = `
      <td class="py-3 px-4">${index + 1}</td>
      <td class="py-3 px-4">${student.name}</td>
      <td class="py-3 px-4">${student.email}</td>
      <td class="py-3 px-4">${student.progress || 0}%</td>
      <td class="py-3 px-4 text-center space-x-2">
        <button class="edit-btn px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Sửa</button>
        <button class="delete-btn px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Xóa</button>
      </td>
    `;

    row.querySelector(".edit-btn").addEventListener("click", () => {
      alert("✏️ Tính năng chỉnh sửa học viên đang được phát triển!");
    });

    row.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa học viên này?")) {
        deleteStudent(courseId, index);
      }
    });

    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  container.appendChild(table);
}

// -----------------------------
// Khởi chạy
document.addEventListener("DOMContentLoaded", async () => {
  const courseId = getCourseIdFromURL();
  if (!courseId) {
    // quay về trang courses
    location.href = "courses.html";
  }

  await loadCourseData(courseId);

  // Lưu khóa học
  document
    .getElementById("editCourseForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      await updateCourse(courseId);
    });

  // Thêm bài giảng
  document
    .getElementById("addLessonForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const title = document.getElementById("lessonTitle").value.trim();
      const content = document.getElementById("lessonContent").value.trim();
      await addLesson(courseId, title, content);
      e.target.reset();
    });

  // Thêm học viên
  document
    .getElementById("addStudentForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("studentName").value.trim();
      const email = document.getElementById("studentEmail").value.trim();
      await addStudent(courseId, name, email);
      e.target.reset();
    });
});
