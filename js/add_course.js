// Import Firebase cấu hình đã có sẵn
import { db, auth } from "./firebase_config.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// Chờ DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addCourseForm");

  // Lắng nghe sự kiện submit form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Lấy dữ liệu từ các ô input
    const title = document.getElementById("title").value.trim();
    const desc = document.getElementById("desc").value.trim();
    const img = document.getElementById("img").value.trim();

    // Kiểm tra dữ liệu hợp lệ
    if (!title || !desc) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      // Tạo tham chiếu đến collection "courses"
      const coursesRef = collection(db, "courses");

      // Thêm document mới
      await addDoc(coursesRef, {
        title,
        desc,
        img: img || "https://placehold.co/400x250", // fallback ảnh
        lessons: [], // mặc định chưa có bài học
        students: [], // chưa có học viên
        createdAt: serverTimestamp(),
        ownerId: auth.currentUser ? auth.currentUser.uid : null,
      });

      // Hiển thị thông báo
      alert("🎉 Đã thêm khóa học thành công!");
      // chuyen trang ve courses
      window.location.href = "courses.html";
    } catch (error) {
      console.error("❌ Lỗi khi thêm khóa học:", error);
      alert("Không thể lưu khóa học. Vui lòng thử lại!");
    }
  });
});
