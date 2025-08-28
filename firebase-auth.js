import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
  
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
// Initialize Firebase
  export const app = initializeApp(firebaseConfig);

// Khởi tạo Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

// Lấy các phần tử DOM từ trang đăng nhập/đăng ký
const loginContainer = document.getElementById('login-container');
const signupContainer = document.getElementById('signup-container');
const userInfoContainer = document.getElementById('user-info-container');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const googleLoginBtn = document.getElementById('google-login-btn');
const googleSignupBtn = document.getElementById('google-signup-btn');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');
const emailError = document.getElementById('email-error');
const passwordError = document.getElementById('password-error');
const confirmPasswordError = document.getElementById('confirm-password-error');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const showSignupLink = document.getElementById('show-signup-link');
const showLoginLink = document.getElementById('show-login-link');

// Hàm kiểm tra mật khẩu
function validatePassword(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const isLongEnough = password.length >= 6;
    return hasUpperCase && hasLowerCase && hasNumber && isLongEnough;
}

// Hàm chuyển đổi giữa các form đăng nhập và đăng ký
function showLogin() {
    if (loginContainer) {
        loginContainer.classList.remove('hidden');
        if (signupContainer) signupContainer.classList.add('hidden');
        clearErrors();
    }
}
function showSignup() {
    if (signupContainer) {
        signupContainer.classList.remove('hidden');
        if (loginContainer) loginContainer.classList.add('hidden');
        clearErrors();
    }
}
function clearErrors() {
    if(emailError) emailError.textContent = '';
    if(passwordError) passwordError.textContent = '';
    if(confirmPasswordError) confirmPasswordError.textContent = '';
if(loginErrorMessage) loginErrorMessage.textContent = '';
    if(signupErrorMessage) signupErrorMessage.textContent = '';
}

// Thêm trình lắng nghe sự kiện cho việc chuyển đổi form
if (showSignupLink) {
    showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        showSignup();
    });
}
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        showLogin();
    });
}

// Xử lý đặt lại mật khẩu
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        const email = loginForm['login-email'].value;
        if (email) {
            try {
                await auth.sendPasswordResetEmail(email);
                loginErrorMessage.textContent = 'Email đặt lại mật khẩu đã được gửi đi. Vui lòng kiểm tra hộp thư đến của bạn.';
                loginErrorMessage.style.color = '#10b981';
            } catch (error) {
                loginErrorMessage.textContent = `Lỗi: ${error.message}`;
                loginErrorMessage.style.color = '#ef4444';
            }
        } else {
            loginErrorMessage.textContent = 'Vui lòng nhập email của bạn để đặt lại mật khẩu.';
            loginErrorMessage.style.color = '#ef4444';
        }
    });
}

// Xử lý đăng ký người dùng
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        const email = signupForm['signup-email'].value;
        const password = signupForm['signup-password'].value;
        const confirmPassword = signupForm['signup-confirm-password'].value;
    
        if (!email.includes('@')) {
            emailError.textContent = 'Email phải chứa ký tự @';
            return;
        }
        if (!validatePassword(password)) {
            passwordError.textContent = 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.';
            return;
        }
        if (password !== confirmPassword) {
            confirmPasswordError.textContent = 'Mật khẩu xác nhận không khớp.';
            return;
        }
    
        try {
            await auth.createUserWithEmailAndPassword(email, password);
            signupErrorMessage.textContent = 'Đăng ký thành công!';
            signupErrorMessage.style.color = '#10b981';
        } catch (error) {
            signupErrorMessage.textContent = `Lỗi: ${error.message}`;
            signupErrorMessage.style.color = '#ef4444';
        }
    });
}

// Xử lý đăng nhập người dùng
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();
        const email = loginForm['login-email'].value;
        const password = loginForm['login-password'].value;
    
        try {
await auth.signInWithEmailAndPassword(email, password);
            loginErrorMessage.textContent = 'Đăng nhập thành công!';
            loginErrorMessage.style.color = '#10b981';
        } catch (error) {
            loginErrorMessage.textContent = `Lỗi: ${error.message}`;
            loginErrorMessage.style.color = '#ef4444';
        }
    });
}

// Xử lý đăng nhập bằng Google
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async () => {
        clearErrors();
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            loginErrorMessage.textContent = `Lỗi: ${error.message}`;
            loginErrorMessage.style.color = '#ef4444';
        }
    });
}

// Xử lý đăng ký bằng Google
if (googleSignupBtn) {
    googleSignupBtn.addEventListener('click', async () => {
        clearErrors();
        try {
            await auth.signInWithPopup(provider);
        } catch (error) {
            signupErrorMessage.textContent = `Lỗi: ${error.message}`;
            signupErrorMessage.style.color = '#ef4444';
        }
    });
}

// Xử lý đăng xuất người dùng
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await auth.signOut();
        } catch (error) {
            console.error("Lỗi khi đăng xuất:", error.message);
        }
    });
}

// Lắng nghe trạng thái xác thực và chuyển hướng
auth.onAuthStateChanged(user => {
    // Kiểm tra xem trang hiện tại có phải là trang đăng nhập không
    const isLoginPage = window.location.pathname.includes('login.html');
    const isAccountPage = window.location.pathname.includes('account.html');
    
    // Lấy các liên kết điều hướng
    const loginLink = document.getElementById('login-link');
    const accountLink = document.getElementById('account-link');

    if (user) {
        // Người dùng đã đăng nhập
        if (isLoginPage) {
            // Chuyển hướng từ trang đăng nhập đến trang khóa học
            window.location.href = 'courses.html';
        }

        // Hiển thị liên kết tài khoản và ẩn liên kết đăng nhập trên tất cả các trang
        if (loginLink) {
            loginLink.classList.add('hidden');
        }
        if (accountLink) {
            accountLink.classList.remove('hidden');
        }
    } else {
        // Người dùng đã đăng xuất
        if (isAccountPage) {
            // Chuyển hướng từ trang tài khoản đến trang đăng nhập
            window.location.href = 'login.html';
        }
        
        // Hiển thị liên kết đăng nhập và ẩn liên kết tài khoản trên tất cả các trang
        if (loginLink) {
            loginLink.classList.remove('hidden');
        }
        if (accountLink) {
            accountLink.classList.add('hidden');
        }
    }
});