function registerUser() {
    const fullName = document.getElementById('full_name').value.trim();
    const firstName = document.getElementById('first_name').value.trim();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirm_password').value.trim();
   /* check thong tin nguoi dung nhap vao*/

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (fullName === '') {
        alert('Họ và tên đệm không được để trống!');
        return;
    }

    if (firstName === '') {
        alert('Tên không được để trống!');
        return;
    }

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
   
    if (password.length < 8) {
        alert('Mật khẩu phải có ít nhất 8 ký tự!');
        return;
    }

    if (confirmPassword.trim() === '') {
        alert('xác nhận mật khẩu không được để trống!');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu không khớp!');
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
