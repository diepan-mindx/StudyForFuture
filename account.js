firebase.auth().onAuthStateChanged(user => {
    // Lấy các phần tử DOM cho trang tài khoản
    const userEmailSpan = document.getElementById('user-email');
    const userDisplayName = document.getElementById('user-display-name');
    const userAvatarImg = document.getElementById('user-avatar');
    const logoutBtn = document.getElementById('logout-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const saveChangesBtn = document.getElementById('save-changes-btn');

    if (user) {
        // Nếu người dùng đã đăng nhập
        if (userEmailSpan) {
            userEmailSpan.textContent = user.email;
        }
        if (userDisplayName) {
            userDisplayName.textContent = user.displayName || 'Người dùng';
        }
        if (userAvatarImg && user.photoURL) {
            userAvatarImg.src = user.photoURL;
        }

        // Xử lý đăng xuất
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                try {
                    await firebase.auth().signOut();
                    // Chuyển hướng đến trang đăng nhập sau khi đăng xuất thành công
                    window.location.href = 'login.html';
                } catch (error) {
                    console.error("Lỗi khi đăng xuất:", error.message);
                }
            });
        }
        
        // Xử lý thay đổi mật khẩu
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', async () => {
                const newPassword = prompt("Vui lòng nhập mật khẩu mới:");
                if (newPassword && newPassword.length >= 6) {
                    try {
                        await user.updatePassword(newPassword);
                        alert("Mật khẩu đã được thay đổi thành công!");
                    } catch (error) {
                        alert(`Lỗi: ${error.message}`);
                    }
                } else if (newPassword !== null) {
                    alert("Mật khẩu phải có ít nhất 6 ký tự.");
                }
            });
        }

        // Xử lý cập nhật hồ sơ (tên hiển thị và ảnh)
        if (saveChangesBtn) {
            saveChangesBtn.addEventListener('click', async () => {
                const newDisplayName = prompt("Nhập tên hiển thị mới:");
                const newPhotoURL = prompt("Nhập URL ảnh đại diện mới:");

                try {
                    await user.updateProfile({
                        displayName: newDisplayName || user.displayName,
                        photoURL: newPhotoURL || user.photoURL
                    });
                    alert("Thông tin đã được cập nhật thành công!");
                    // Tải lại trang để hiển thị thay đổi
                    window.location.reload();
                } catch (error) {
                    alert(`Lỗi: ${error.message}`);
                }
            });
        }

    } else {
        // Nếu người dùng chưa đăng nhập, chuyển hướng họ đến trang đăng nhập
        window.location.href = 'login.html';
    }
});
