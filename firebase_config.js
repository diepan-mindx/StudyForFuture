// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASEoE6TQkvWK1EtYfcAAdfOD3Guo874Ko",
  authDomain: "jsi35-d177d.firebaseapp.com",
  databaseURL: "https://jsi35-d177d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jsi35-d177d",
  storageBucket: "jsi35-d177d.firebasestorage.app",
  messagingSenderId: "73414069100",
  appId: "1:73414069100:web:b80dbc1756a4dd46c74149",
  measurementId: "G-30EVLV5LC2"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const studentsCol = collection(db, "students");

let currentStudent = null;

// Đăng ký học sinh
async function registerStudent() {
  const name = document.getElementById("studentName").value;
  const id = document.getElementById("studentId").value;
  console.log(name, id)
  if (name && id) {
    await setDoc(doc(studentsCol, id), {
      name: name,
      studentId: id,
      progress: 0
    });
    alert("Đăng ký thành công!");
    loadStudents();
  }
}

// Đăng nhập học sinh
async function loginStudent() {
  const id = document.getElementById("studentId").value;
  if (!id) return alert("Vui lòng nhập mã số!");

  const studentDoc = await getDoc(doc(studentsCol, id));
  if (studentDoc.exists()) {
    currentStudent = studentDoc.data();
    alert(`Xin chào ${currentStudent.name}!`);
    showLesson();
  } else {
    alert("Không tìm thấy học sinh!");
  }
}

// Xóa học sinh
async function deleteStudent(docId) {
  await deleteDoc(doc(studentsCol, docId));
  loadStudents();
}

// Load danh sách học sinh
async function loadStudents() {
  const querySnapshot = await getDocs(studentsCol);
  const tableBody = document.querySelector("#studentsTable tbody");
 
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    tableBody.innerHTML += `
      <tr>
        <td>${data.name}</td>
        <td>${data.studentId}</td>
        <td><button onclick="deleteStudent('${docSnap.id}')">❌ Xóa</button></td>
      </tr>`;
  });
}

// Hiển thị Lesson
function showLesson() {
  if (!currentStudent) return;
  document.getElementById("lessonStudentName").textContent = currentStudent.name;
  document.getElementById("lessonStudentId").textContent = currentStudent.studentId;
  document.getElementById("lessonProgress").textContent = currentStudent.progress + "%";
  document.getElementById("lessonSection").style.display = "block";
}

// Cập nhật tiến độ
async function updateProgress() {
  if (!currentStudent) return;
  let newProgress = Math.min(currentStudent.progress + 10, 100);
  await updateDoc(doc(studentsCol, currentStudent.studentId), { progress: newProgress });
  currentStudent.progress = newProgress;
  showLesson();
}

// Load ban đầu
loadStudents();

// Cho phép gọi từ HTML
window.registerStudent = registerStudent;
window.loginStudent = loginStudent;
window.deleteStudent = deleteStudent;
window.updateProgress = updateProgress;