// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Cấu hình Firebase
const firebaseConfig = {
  apiKey: "AIzaSyASEoE6TQkvWK1EtYfcAAdfOD3Guo874Ko",
  authDomain: "jsi35-d177d.firebaseapp.com",
  databaseURL:
    "https://jsi35-d177d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "jsi35-d177d",
  storageBucket: "jsi35-d177d.firebasestorage.app",
  messagingSenderId: "73414069100",
  appId: "1:73414069100:web:b80dbc1756a4dd46c74149",
  measurementId: "G-30EVLV5LC2",
};

// Khởi tạo Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// kiem tra neu chua dang nhap thi bat ve index (ap dung cho tat ca trang)
onAuthStateChanged(auth, (user) => {
  if (
    !user &&
    window.location.href.includes("pages") &&
    !window.location.href.includes("login.html")
  ) {
    window.location.href = "../index.html"; // Chưa login thì bắt quay lại
  }
});
