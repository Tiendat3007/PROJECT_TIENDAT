function loginUser() {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    // Lấy danh sách user đã đăng ký từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user có email & password khớp
    const matchedUser = users.find(u => u.email === email && u.password === password);
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        alert('Email không được để trống!');
        return;
    }

    if (!emailCheck.test(email)) {
        alert('Email không hợp lệ! Vui lòng nhập đúng định dạng.');
        return;
    }

    if (password.trim() === '') {
        alert('Mật khẩu không được để trống!');
        return;
    }

    if (matchedUser) {
        // Lưu trạng thái đã đăng nhập
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        alert("Đăng nhập thành công!");

        // Chuyển trang dựa trên role
        redirectAfterLogin(matchedUser.role);

    } else {
        alert("Email hoặc mật khẩu không đúng!");
    }
}

function redirectAfterLogin(role) {
    if (role === "admin") {
        window.location.href = "../authau/index.html";// trang admin
    } else if (role === "user") {
        window.location.href = 'home.html';// trang user
    } else {
        alert("Role không hợp lệ!");
    }
}
