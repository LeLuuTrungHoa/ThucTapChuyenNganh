var express = require('express');
var router = express.Router();
const Hoadon = require('../models/Hoadon');
const Sanpham = require('../models/Sanpham');
const Lichhen = require('../models/Lichhen');
const moment = require('moment');

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
router.all('/*',isAdmin, (req, res, next) => {
    res.app.locals.layout = 'admin'; // Set layout for admin pages
    next();
});

router.get('/logout', function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) { return next(err); }
        console.log("Người dùng đã đăng xuất!");
        res.redirect('/login');
    });
});


router.use(function(req, res, next) {
    res.app.locals.layout = 'admin';
    next();
});
router.get('/', async (req, res) => { // Đảm bảo đúng route admin của bạn
    try {
        const todayStart = moment().startOf('day').toDate();
        const todayEnd = moment().endOf('day').toDate();
        const startOfWeek = moment().subtract(6, 'days').startOf('day').toDate();

        const [hoadonsToday, lichHenMoiCount, lichHenHomNay, hoadonTuan, sanPhamSapHet] = await Promise.all([
            Hoadon.find({ trangthaihd: 'Đã thanh toán', ngaytaohd: { $gte: todayStart, $lte: todayEnd } }),
            Lichhen.countDocuments({ status: 'Chờ xác nhận' }),
            Lichhen.find({ ngayden: moment().format('YYYY-MM-DD'), status: { $ne: 'Đã hủy' } }).sort({ gioden: 1 }),
            Hoadon.find({ trangthaihd: 'Đã thanh toán', ngaytaohd: { $gte: startOfWeek } }),
            Sanpham.find({ soluongsp: { $lt: 15 } }).sort({ soluongsp: 1 }).limit(5)
        ]);

        // KHẮC PHỤC NaN: Đảm bảo doanhThu luôn có giá trị số
        const doanhThuHomNay = hoadonsToday.length > 0
            ? hoadonsToday.reduce((sum, hd) => sum + (hd.tienhd || 0), 0)
            : 0;

        // Xử lý dữ liệu biểu đồ
        let stats = {};
        for (let i = 0; i < 7; i++) {
            const date = moment().subtract(i, 'days').format('DD/MM');
            stats[date] = 0;
        }
        hoadonTuan.forEach(hd => {
            const day = moment(hd.ngaytaohd).format('DD/MM');
            if (stats.hasOwnProperty(day)) stats[day] += (hd.tienhd || 0);
        });

        res.render('admin/index', { // Hoặc 'admin/dashboard' tùy file hbs của bạn
            layout: 'admin',
            doanhThuHomNay: doanhThuHomNay,
            tongDonHang: hoadonsToday.length,
            lichHenMoi: lichHenMoiCount,
            lichHenHomNay: lichHenHomNay.map(l => l.toObject()),
            sanPhamSapHet: sanPhamSapHet.map(s => s.toObject()),
            chartLabels: JSON.stringify(Object.keys(stats).reverse()),
            chartData: JSON.stringify(Object.values(stats).reverse())
        });
    } catch (err) {
        console.error("Lỗi Dashboard:", err);
        res.status(500).send("Lỗi tải bảng điều khiển");
    }
});

router.get('/baocao', async (req, res) => {
    try {
        let { filterType, startDate, endDate } = req.query;
        let start = moment().startOf('day');
        let end = moment().endOf('day');

        // Logic chọn nhanh theo chế độ lọc
        if (filterType === 'today') {
            start = moment().startOf('day');
        } else if (filterType === 'week') {
            start = moment().subtract(6, 'days').startOf('day'); // 7 ngày qua
        } else if (filterType === 'month') {
            start = moment().startOf('month');
        } else if (startDate && endDate) {
            start = moment(startDate).startOf('day');
            end = moment(endDate).endOf('day');
        } else {
            // Mặc định hiển thị tuần này nếu không chọn gì
            start = moment().subtract(6, 'days').startOf('day');
            filterType = 'week';
        }

        const hoadons = await Hoadon.find({
            trangthaihd: 'Đã thanh toán',
            ngaytaohd: { $gte: start.toDate(), $lte: end.toDate() }
        });

        // Tạo danh sách tất cả các ngày trong khoảng lọc để tránh mất ngày doanh thu = 0
        let stats = {};
        let current = moment(start);
        while (current <= end) {
            stats[current.format('DD/MM')] = 0;
            current.add(1, 'days');
        }

        let tongDoanhThu = 0;
        const soHoaDon = hoadons.length;
        hoadons.forEach(hd => {
            tongDoanhThu += hd.tienhd;
            const day = moment(hd.ngaytaohd).format('DD/MM');
            if (stats.hasOwnProperty(day)) stats[day] += hd.tienhd;
        });
        let trungBinh = soHoaDon > 0 ? Math.round(tongDoanhThu / soHoaDon) : 0;

        res.render('admin/baocao/baocao', {
            layout: 'admin',
            tongDoanhThu,
            soHoaDon: hoadons.length,
            trungBinh,
            chartLabels: JSON.stringify(Object.keys(stats)),
            chartData: JSON.stringify(Object.values(stats)),
            startDate: start.format('YYYY-MM-DD'),
            endDate: end.format('YYYY-MM-DD'),
            filterType
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});
module.exports = router;