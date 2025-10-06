import { auth } from "./firebase_config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// xu ly an/ hien menu cho trang index.html
if (!window.location.href.includes("pages")) {
  const coursesLink = document.getElementById("courses-link");
  const accountLink = document.getElementById("account-link");
  const loginLink = document.getElementById("login-link");
  // kiem tra dang nhap tu firebase auth
  onAuthStateChanged(auth, (user) => {
    if (user) {
      coursesLink.classList.remove("hidden");
      accountLink.classList.remove("hidden");
      loginLink.classList.add("hidden");
    } else {
      coursesLink.classList.add("hidden");
      accountLink.classList.add("hidden");
      loginLink.classList.remove("hidden");
    }
  });
}
