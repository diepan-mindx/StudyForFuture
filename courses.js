// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";


    // Cấu hình Firebase của bạn
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

    // Hàm khi bấm "Học ngay"
    async function startLesson(lessonName, progress) {
      try {
        await addDoc(collection(db, "lessons"), {
          name: lessonName,
          progress: progress,
          created_at: serverTimestamp(), // Tự động lưu giờ hiện tại
          created_by: "abc" // ví dụ fix cứng, có thể lấy user đang đăng nhập
        });
        alert("Đã ghi dữ liệu cho bài: " + lessonName);
      } catch (e) {
        console.error("Lỗi khi ghi dữ liệu: ", e);
      }
    }

    // Gắn sự kiện click cho các nút
    {
      document.getElementById("grammarBtn").addEventListener("click", () => startLesson("Ngữ Pháp Cơ Bản", 75));
      document.getElementById("pronBtn").addEventListener("click", () => startLesson("Phát Âm Chuẩn", 30));
      document.getElementById("vocabBtn").addEventListener("click", () => startLesson("1000 Từ Vựng Thông Dụng", 10));
    };
