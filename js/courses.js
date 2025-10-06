import { db, auth } from "./firebase_config.js";
import {
  collection,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

async function loadCoursesFromFirestore() {
  const courses = [];

  try {
    // Tạo tham chiếu đến collection "courses"
    const coursesRef = collection(db, "courses");

    const querySnapshot = await getDocs(coursesRef);
    // Duyệt qua từng document
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      courses.push({
        id: doc.id, // lưu id để dùng khi xóa / chỉnh sửa
        ...data,
      });
      console.log(courses);
    });

    // Hiển thị ra giao diện
    renderCourseList(courses);
  } catch (error) {
    console.error("Lỗi khi tải khóa học:", error);
    alert("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
  }
}

// -------------------------
// hàm hỗ trợ cắt tên thành avatar (chỉ 2 chữ cái)
function getAvatarInitials(name) {
  const names = name.split(" ");
  const initials = names.map((n) => n.charAt(0).toUpperCase());
  return initials.slice(0, 2).join("");
}

// -------------------------
// render the list in firestore
function renderCourseList(courses) {
  const courseListContainer = document.getElementById("courseList");
  courseListContainer.innerHTML = ""; // Clear previous content
  // them khung them khoa hoc o dau
  renderAddCourseCard(courseListContainer);
  courses.forEach((course) => {
    // Create main container div
    const container = document.createElement("div");
    container.className =
      "flex items-center justify-between p-6 border rounded-xl bg-blue-50 hover:bg-blue-100 transition duration-300";

    // Left side wrapper
    const leftDiv = document.createElement("div");
    leftDiv.className = "flex items-center space-x-4";

    // Circle avatar
    const avatar = document.createElement("div");
    avatar.className =
      "w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-black text-lg font-bold";
    avatar.textContent = getAvatarInitials(course.title);

    // Title
    const title = document.createElement("p");
    title.className = "text-xl font-semibold";
    title.textContent = course.title;

    // Append avatar + title to left side
    leftDiv.appendChild(avatar);
    leftDiv.appendChild(title);

    // Right side wrapper (for multiple buttons)
    const rightDiv = document.createElement("div");
    rightDiv.className = "flex items-center space-x-3";

    // “Học ngay” button
    const learnBtn = document.createElement("button");
    learnBtn.className =
      "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition";
    learnBtn.textContent = "Chỉnh sửa";

    // “Xóa” (Delete) button — danger style
    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition";
    deleteBtn.textContent = "Xóa";

    // Append buttons to right side
    rightDiv.appendChild(learnBtn);
    rightDiv.appendChild(deleteBtn);

    // Assemble main container
    container.appendChild(leftDiv);
    container.appendChild(rightDiv);

    // Append to courseListContainer
    courseListContainer.appendChild(container);

    // nút thêm chức năng
    learnBtn.addEventListener("click", () => {
      location.href = "edit_course.html?courseId=" + course.id; // chuyển sang trang chỉnh sửa
    });

    // nút xóa chức năng
    deleteBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn xóa mục này?")) {
        // Xóa khỏi Firestore
        container.remove();
        deleteCourse(course.id);
      }
    });
  });
}

// -------------------------
// add course in firestore (change to page add_course.html)
// ham render khung them khoa hoc
function renderAddCourseCard(courseListContainer) {
  // Create main container div
  const container = document.createElement("div");
  container.className =
    "flex items-center justify-between p-6 border rounded-xl bg-blue-50 hover:bg-blue-100 transition duration-300";

  // Left section
  const leftDiv = document.createElement("div");
  leftDiv.className = "flex items-center space-x-4";

  // Circle avatar
  const avatar = document.createElement("div");
  avatar.className =
    "w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 text-black text-lg font-bold";
  avatar.textContent = "KH";

  // Title text
  const title = document.createElement("p");
  title.className = "text-xl font-semibold";
  title.textContent = "Khóa học phong phú";

  // Append avatar and title to left section
  leftDiv.appendChild(avatar);
  leftDiv.appendChild(title);

  // Right section (for buttons)
  const rightDiv = document.createElement("div");
  rightDiv.className = "flex items-center space-x-3";

  // “Thêm ngay” button
  const addBtn = document.createElement("button");
  addBtn.id = "addCourseBtn";
  addBtn.className =
    "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition";
  addBtn.textContent = "Thêm ngay";

  // Append buttons
  rightDiv.appendChild(addBtn);

  // Assemble main container
  container.appendChild(leftDiv);
  container.appendChild(rightDiv);

  // gan vao courseListContainer
  courseListContainer.appendChild(container);

  // chuyen sang trang add_course.html
  addBtn.addEventListener("click", () => {
    location.href = "add_course.html";
  });
}

// -------------------------
// delete course in firestore
async function deleteCourse(courseId) {
  if (!courseId) {
    console.error("❌ Không có ID khóa học để xóa!");
    return;
  }

  try {
    // Tạo tham chiếu tới document trong collection "courses"
    const courseRef = doc(db, "courses", courseId);

    // Xoá document
    await deleteDoc(courseRef);

    console.log(`✅ Đã xóa khóa học với ID: ${courseId}`);
    alert("Đã xóa khóa học thành công!");
  } catch (error) {
    console.error("⚠️ Lỗi khi xóa khóa học:", error);
    alert("Không thể xóa khóa học. Vui lòng thử lại!");
  }
}

// -------------------------
// thêm tất cả vào trang courses.html
document.addEventListener("DOMContentLoaded", () => {
  // them khoa hoc
  loadCoursesFromFirestore();
  // renderCourseList([
  //   {
  //     title: "Từ vựng",
  //     desc: "Học ngữ pháp tiếng Anh từ cơ bản đến nâng cao.",
  //     img: "https://placehold.co/400x250",
  //     lessons: [
  //       {
  //         title: "Thì Hiện Tại Đơn",
  //         content: "Nội dung bài học về thì hiện tại đơn.",
  //       },
  //       {
  //         title: "Thì Quá Khứ Đơn",
  //         content: "Nội dung bài học về thì quá khứ đơn.",
  //       },
  //       {
  //         title: "Thì Tương Lai Đơn",
  //         content: "Nội dung bài học về thì tương lai đơn.",
  //       },
  //     ],
  //     students: [
  //       { name: "Nguyễn Văn A", email: "abc@gmail.com", progress: 50 },
  //       { name: "Trần Thị B", email: "mno@gmail.com", progress: 80 },
  //     ],
  //   },
  // ]);
});
