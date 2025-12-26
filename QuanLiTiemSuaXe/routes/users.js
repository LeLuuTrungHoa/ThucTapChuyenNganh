const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}
function isAdmin(req, res, next) {
    if (req.isAuthenticated()) {
        if (req.user.role === 'admin') {
            return next(); // Cho phép đi tiếp
        }
        req.flash('error_message', 'Bạn không có quyền truy cập vào khu vực này!');
        return res.redirect('/');
    }
    req.flash('error_message', 'Vui lòng đăng nhập để tiếp tục!');
    res.redirect('/login');
}
// 1. Hiển thị danh sách User
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).lean();
        // Giả sử file hbs của bạn nằm tại views/admin/users/user-list.hbs
        res.render('admin/users/user', { users, layout: 'admin' });
    } catch (err) {
        res.status(500).send("Lỗi tải danh sách người dùng");
    }
});

// 2. Xóa User
router.delete('/delete/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash('success_message', 'Đã xóa người dùng thành công');
    res.redirect('/admin/users');
});

// 3. Sửa User (GET trang edit)
router.get('/edit/:id', async (req, res) => {
    const userEdit = await User.findById(req.params.id).lean();
    res.render('admin/users/user-edit', { userEdit, layout: 'admin' });
});

// 4. Cập nhật User
router.post('/edit/:id', async (req, res) => {
    const { firstName, lastName, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { firstName, lastName, role });
    req.flash('success_message', 'Cập nhật thành công!');
    res.redirect('/admin/users');
});
// 5. GET trang tạo User mới
router.get('/create', isAdmin, (req, res) => {
    res.render('admin/users/user-create', { layout: 'admin' });
});

// 6. POST lưu User mới
router.post('/create', isAdmin, async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ email });
        if (userExists) {
            req.flash('error_message', 'Email này đã được sử dụng!');
            return res.redirect('/admin/users/create');
        }

        // Mã hóa mật khẩu
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            avatarUrl: '/images/faces/hoa.jpg' // Ảnh mặc định
        });

        const salt = await bcrypt.genSalt(10);
        newUser.password = await bcrypt.hash(password, salt);

        await newUser.save();
        req.flash('success_message', 'Thêm người dùng mới thành công!');
        res.redirect('/admin/users');
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Có lỗi xảy ra khi tạo người dùng.');
        res.redirect('/admin/users/create');
    }
});
module.exports = router;