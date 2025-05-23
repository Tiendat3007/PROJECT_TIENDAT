window.onload = function() {
    const loggedInUserJSON = localStorage.getItem('loggedInUser');

    if (loggedInUserJSON) {
        const loggedInUser = JSON.parse(loggedInUserJSON);

        // ✅ Dùng backtick để chèn biến
        document.getElementById('welcome_message').innerText = `Xin chào, ${loggedInUser.email}! Chào mừng bạn đến với trang chủ.`;
    } else {
        alert('Vui lòng đăng nhập để truy cập trang chủ.');
        window.location.href = './login.html';
    }
};

function logout() {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('loggedInUser');
    
    // Hiển thị hộp thoại xác nhận đăng xuất
    if (confirm("Bạn có muốn đăng xuất tài khoản không?")) {
        window.location.href = './login.html';
    }
}
