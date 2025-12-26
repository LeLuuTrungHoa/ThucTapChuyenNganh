var express = require('express');
var router = express.Router();
const Dichvu = require('../models/Dichvu');
const Sanpham = require('../models/Sanpham');
const Hoadon = require('../models/Hoadon');

router.all('/*', (req, res, next) => {
    res.app.locals.layout = 'admin';
    next();
});

// Xem danh sách hóa đơn
router.get('/hoadon', function(req, res, next) {
    Hoadon.find({}).sort({ ngaytaohd: -1 }).then((dbHoadon) => {
        const hoadons = dbHoadon.map(item => item.toObject());
        res.render('admin/hoadon/hoadon', { hoadons: hoadons });
    }).catch(next);
});

// Trang tạo hóa đơn
router.get('/hoadonCreate', async (req, res, next) => {
    try {
        const [dbDichvu, dbSanpham] = await Promise.all([
            Dichvu.find({}),
            Sanpham.find({})
        ]);
        res.render('admin/hoadon/hoadonCreate', {
            title: 'Tạo Hóa Đơn',
            dichvus: dbDichvu.map(d => d.toObject()),
            sanphams: dbSanpham.map(s => s.toObject())
        });
    } catch (err) {
        next(err);
    }
});

// Xử lý tạo mới
router.post('/hoadonCreate', function(req, res, next) {
    const newHoadon = new Hoadon({
        namekh: req.body.namekh,
        sdtkh: req.body.sdtkh,
        loaixe: req.body.loaixe,
        ngaytaohd: req.body.ngaytaohd,
        // Đảm bảo là mảng, nếu không có mục nào chọn thì gán mảng rỗng
        dichvus: req.body.selectedServices || [],
        sanphams: req.body.selectedProducts || [],
        tienhd: Number(req.body.tienhd), // Ép kiểu số
        trangthaihd: req.body.trangthaihd,
        phuongthuc: req.body.phuongthuc
    });

    newHoadon.save()
        .then(() => res.redirect('/admin/hoadon/hoadon'))
        .catch(next);
});

// Trang chỉnh sửa hóa đơn
router.get('/hoadonEdit/:id', async (req, res, next) => {
    try {
        const hoadon = await Hoadon.findById(req.params.id);
        const [dbDichvu, dbSanpham] = await Promise.all([
            Dichvu.find({}),
            Sanpham.find({})
        ]);

        res.render('admin/hoadon/hoadonEdit', {
            hoadon: hoadon.toObject(),
            dichvus: dbDichvu.map(d => d.toObject()),
            sanphams: dbSanpham.map(s => s.toObject())
        });
    } catch (err) {
        next(err);
    }
});

// Xử lý cập nhật (PUT)
router.put('/hoadonEdit/:id', function(req, res, next) {
    Hoadon.findById(req.params.id).then((hoadon) => {
        if (!hoadon) return res.status(404).send("Không tìm thấy hóa đơn");

        // Cập nhật thông tin khách hàng
        hoadon.namekh = req.body.namekh;
        hoadon.sdtkh = req.body.sdtkh;
        hoadon.loaixe = req.body.loaixe;
        hoadon.ngaytaohd = req.body.ngaytaohd;

        // Cập nhật danh sách dịch vụ và sản phẩm (Cần xử lý mảng rỗng)
        hoadon.dichvus = req.body.selectedServices || [];
        hoadon.sanphams = req.body.selectedProducts || [];

        // Cập nhật tiền và trạng thái
        hoadon.tienhd = Number(req.body.tienhd); // Ép kiểu số để tính toán đúng
        hoadon.trangthaihd = req.body.trangthaihd;
        hoadon.phuongthuc = req.body.phuongthuc;

        return hoadon.save();
    }).then((updatedHoadon) => {
        res.redirect(`/admin/hoadon/hoadonView/${updatedHoadon._id}?print=true`);
    }).catch(next);
});

// Xóa hóa đơn
router.delete('/hoadonDelete/:id', function(req, res, next) {
    Hoadon.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect('/admin/hoadon/hoadon');
    }).catch(next);
});

// Xem chế độ in và chi tiết (Populate đầy đủ thông tin)
router.get('/hoadonView/:id', function(req, res, next) {
    Hoadon.findById(req.params.id)
        .populate('dichvus')
        .populate('sanphams')
        .then((hoadon) => {
            if (!hoadon) return res.status(404).send("Không tìm thấy hóa đơn");
            res.render('admin/hoadon/hoadonView', {
                title: 'Chi tiết hóa đơn',
                hoadon: hoadon.toObject()
            });
        })
        .catch(next);
});

module.exports = router;