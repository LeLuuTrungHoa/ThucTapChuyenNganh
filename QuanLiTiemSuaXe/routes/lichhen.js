const express = require('express');
const router = express.Router();
const Lichhen = require('../models/Lichhen');

// Trang danh sách lịch hẹn
router.get('/lichhen', (req, res) => {
    Lichhen.find({})
        .sort({ ngaydat: -1 }) // Mới nhất hiện lên đầu
        .then(appointments => {
            res.render('admin/lichhen/lichhen', {
                layout: 'admin', // Sử dụng layout của admin
                appointments: appointments.map(a => a.toObject())
            });
        });
});
router.post('/lichhen', async (req, res) => {
    try {
        const newLichen = new Lichhen({
            name: req.body.name,
            number: req.body.number,
            ngayden: req.body.ngayden,
            gioden: req.body.gioden,
            subject: req.body.subject,
            message: req.body.message,
            status: 'Đã xác nhận',
            ngaydat: new Date()
        });

        await newLichen.save();
        req.flash('success_message', 'Đã thêm lịch hẹn mới cho khách!');
        res.redirect('/admin/lichhen/lichhen');
    } catch (err) {
        console.error(err);
        req.flash('error_message', 'Lỗi khi thêm lịch hẹn');
        res.redirect('/admin/lichhen/lichhen');
    }
});
// Route thay đổi trạng thái lịch hẹn
router.post('/lichhenEdit/:id', async (req, res) => {
    try {
        const status = req.body.status;
        if (!status) {
            req.flash('error_message', 'Dữ liệu trạng thái bị trống');
            return res.redirect('/admin/lichhen/lichhen');
        }
        let updateData = { status: status };

        // 1. Xử lý logic TTL (Tự động xóa)
        if (status === 'Đã hủy') {
            // Gán thời gian hiện tại. MongoDB sẽ tự xóa sau 7 ngày dựa trên Index expireAt
            updateData.expireAt = new Date();
        } else {
           //khong dem nua
            updateData.$unset = { expireAt: 1 };
        }

        // 2. Cập nhật vào Database
        const updatedLichen = await Lichhen.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedLichen) {
            req.flash('error_message', 'Không tìm thấy lịch hẹn');
            return res.redirect('/admin/lichhen/lichhen');
        }

        // 3. Logic gửi Email khi xác nhận
        if (status === 'Đã xác nhận' && updatedLichen.email) {
            try {
                const { sendConfirmationEmail } = require('../helpers/mailer');
                await sendConfirmationEmail(updatedLichen.email, updatedLichen);
            } catch (mailErr) {
                console.error('Lỗi gửi mail nhưng vẫn cập nhật trạng thái:', mailErr);
                // Không chặn res.redirect nếu chỉ lỗi gửi mail
            }
        }

        req.flash('success_message', `Trạng thái đã chuyển sang: ${status}`);
        res.redirect('/admin/lichhen/lichhen');

    } catch (err) {
        console.error('Lỗi cập nhật lịch hẹn:', err);
        req.flash('error_message', 'Không thể cập nhật trạng thái');
        res.redirect('/admin/lichhen/lichhen');
    }
});
module.exports = router;