// ------------------------------
// Import Firebase
// ------------------------------
import { auth } from "../js/firebase_config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// ------------------------------
// Elements
// ------------------------------
const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");
const userInfoContainer = document.getElementById("user-info-container");

const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginError = document.getElementById("login-error-message");
const signupError = document.getElementById("signup-error-message");

const showSignupLink = document.getElementById("show-signup-link");
const showLoginLink = document.getElementById("show-login-link");

const forgotPasswordLink = document.getElementById("forgot-password-link");

const googleLoginBtn = document.getElementById("google-login-btn");
const googleSignupBtn = document.getElementById("google-signup-btn");

// ------------------------------
// Google login/signup disabled
// ------------------------------
googleLoginBtn.addEventListener("click", () => alert("Tính năng được phát triển sau"));
googleSignupBtn.addEventListener("click", () => alert("Tính năng được phát triển sau"));

// ------------------------------
// Toggle Forms
// ------------------------------
showSignupLink.addEventListener("click", (e) => {
  e.preventDefault();
  loginContainer.classList.add("hidden");
  signupContainer.classList.remove("hidden");
});

showLoginLink.addEventListener("click", (e) => {
  e.preventDefault();
  signupContainer.classList.add("hidden");
  loginContainer.classList.remove("hidden");
});

// ------------------------------
// Login
// ------------------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!email || !password) {
    loginError.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    // Chuyển về trang index sau khi đăng nhập thành công
    window.location.href = "../index.html";
  } catch (error) {
    if (error.code === "auth/invalid-credential") {
      loginError.textContent = "Sai email hoặc mật khẩu!";
    } else {
      loginError.textContent = "Lỗi: " + error.message;
    }
  }
});

// ------------------------------
// Signup
// ------------------------------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  signupError.textContent = "";

  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const confirmPassword = document
    .getElementById("signup-confirm-password")
    .value.trim();

  if (!email || !password || !confirmPassword) {
    signupError.textContent = "Vui lòng nhập đầy đủ thông tin.";
    return;
  }

  if (password.length < 6) {
    signupError.textContent = "Mật khẩu phải có ít nhất 6 ký tự.";
    return;
  }

  if (password !== confirmPassword) {
    signupError.textContent = "Mật khẩu xác nhận không khớp.";
    return;
  }

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    // chuyen sang dang nhap
    signupContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      signupError.textContent = "Email này đã được đăng ký.";
    } else {
      signupError.textContent = "Lỗi: " + error.message;
    }
  }
});

// ------------------------------
// Forgot Password
// ------------------------------
forgotPasswordLink.addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  if (!email) {
    alert("Vui lòng nhập email để đặt lại mật khẩu!");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Email đặt lại mật khẩu đã được gửi!");
  } catch (error) {
    alert("Không thể gửi email: " + error.message);
  }
});

// // ------------------------------
// // Auth State Change
// // ------------------------------
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // Logged in
//     userEmailDisplay.textContent = user.email;
//     loginContainer.classList.add("hidden");
//     signupContainer.classList.add("hidden");
//     userInfoContainer.classList.remove("hidden");
//   } else {
//     // Logged out
//     userInfoContainer.classList.add("hidden");
//     signupContainer.classList.add("hidden");
//     loginContainer.classList.remove("hidden");
//   }
// });
