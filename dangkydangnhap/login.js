function loginUser() {
    const email = document.getElementById("login_email").value;
    const password = document.getElementById("login_password").value;

    // Lấy danh sách user đã đăng ký từ localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user có email & password khớp
    const matchedUser = users.find(u => u.email === email && u.password === password);

    if (matchedUser) {
        // Lưu trạng thái đã đăng nhập
        localStorage.setItem("loggedInUser", JSON.stringify(matchedUser));
        alert("Đăng nhập thành công!");

        // Chuyển về trang chủ
        window.location.href = "./home.html";
    } else {
        alert("Email hoặc mật khẩu không đúng!");
    }
}
