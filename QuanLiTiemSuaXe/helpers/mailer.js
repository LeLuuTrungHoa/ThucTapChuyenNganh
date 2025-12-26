const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dh52200695@student.stu.vn', // Email của tiệm
        pass: '123456Th'   // Mật khẩu
    }
});

module.exports = {
    sendConfirmationEmail: (customerEmail, customer) => {
        const mailOptions = {
            from: '"Tiệm Sửa Xe Trung Hòa" <dh52200695@student.stu.vn>',
            to: customerEmail,
            subject: 'Xác Nhận Lịch Hẹn Sửa Xe thành công!',
            html: `
                <h3>Chào ${customer.name},</h3>
                <p>Lịch hẹn của bạn đã được quản trị viên <b>Xác nhận</b>.</p>
                <p><b>Chi tiết lịch hẹn:</b></p>
                <ul>
                    <li>Ngày đến: ${customer.ngayden}</li>
                    <li>Giờ đến: ${customer.gioden}</li>
                    <li>Dịch vụ: ${customer.subject}</li>
                </ul>
                <p>Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
            `
        };

        return transporter.sendMail(mailOptions);
    }
};