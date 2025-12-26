const express = require("express");
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Cấu hình Multer lưu ảnh
const storage = multer.diskStorage({
    destination: './public/uploads/avatars/',
    filename: function (req, file, cb) {
        cb(null, 'avatar-' + req.user.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb('Error: Chỉ chấp nhận file ảnh!');
    }
}).single('avatar');


// 1. Trang hiển thị (domain.com/admin/caidat/caidat)
router.get('/caidat', (req, res) => {
    res.render('admin/caidat/caidat', { layout: 'admin' });
});

// 2. Xử lý Cập nhật Profile (domain.com/admin/caidat/profile)
router.post('/profile', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            req.flash('error_message', err);
            return res.redirect('/admin/caidat/caidat');
        }
        try {
            const { firstName, lastName } = req.body;
            let updateData = { firstName, lastName };

            if (req.file) {
                // Lưu đường dẫn file vào object cập nhật
                updateData.avatarUrl = '/uploads/avatars/' + req.file.filename;
            }

            // 1. Cập nhật vào MongoDB và lấy về dữ liệu mới nhất ({new: true})
            const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, { new: true });

            // 2. LÀM MỚI PASSPORT SESSION
            req.login(updatedUser, (err) => {
                if (err) {
                    req.flash('error_message', 'Lỗi cập nhật phiên đăng nhập.');
                    return res.redirect('/admin/caidat/caidat');
                }
                req.flash('success_message', 'Cập nhật thông tin thành công!');
                res.redirect('/admin/caidat/caidat');
            });

        } catch (error) {
            req.flash('error_message', 'Lỗi hệ thống khi cập nhật.');
            res.redirect('/admin/caidat/caidat');
        }
    });
});
// 3. Xử lý Đổi mật khẩu (domain.com/admin/caidat/password)
router.post('/password', async (req, res) => { // Bỏ chữ /caidat ở đây
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const user = await User.findById(req.user.id);

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            req.flash('error_message', 'Mật khẩu hiện tại không đúng.');
            return res.redirect('/admin/caidat/caidat');
        }

        if (newPassword !== confirmPassword) {
            req.flash('error_message', 'Xác nhận mật khẩu mới không khớp.');
            return res.redirect('/admin/caidat/caidat');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        req.flash('success_message', 'Đổi mật khẩu thành công!');
        res.redirect('/admin/caidat/caidat');
    } catch (error) {
        req.flash('error_message', 'Lỗi cập nhật mật khẩu.');
        res.redirect('/admin/caidat/caidat');
    }
});

module.exports = router;