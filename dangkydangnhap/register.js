function registerUser() {
    const fullName = document.getElementById('full_name').value;
    const firstName = document.getElementById('first_name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const agreeTerms = document.getElementById('agree_terms').checked;

    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
        return;
    }

    if (!agreeTerms) {
        alert('Bạn phải đồng ý với chính sách và điều khoản!');
        return;
    }

    // Tạo user object
    const user = {
        fullName: `${fullName} ${firstName}`,
        email: email,
        password: password // chỉ demo, thực tế nên mã hóa!
    };

    // Lưu user vào localStorage (danh sách users)
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Kiểm tra trùng email
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
        alert('Email đã được đăng ký!');
        return;
    }

    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Đăng ký thành công!');

    // Chuyển về trang đăng nhập
    window.location.href = './login.html';
}
