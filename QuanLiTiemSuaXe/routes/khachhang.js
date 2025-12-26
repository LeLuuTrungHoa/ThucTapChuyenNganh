var express = require('express');
var router = express.Router();
const Khachhang = require( '../models/Khachhang');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');

function useAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Proceed if authenticated
    } else {
        res.redirect('/login'); // Redirect to login if authentication fails
    }
}
router.all('/*', (req, res, next) => {
    res.app.locals.layout = 'admin'; // Set layout for admin pages
    next();
});
router.get('/qlkhachhang', function(req, res, next) {
    Khachhang.find({}).then((dbkhachhang) => {
        const khachhangs = dbkhachhang.map(cat=>cat.toObject());
        res.render('admin/datamanagement/qlkhachhang', { khachhangs: khachhangs });
    })
});
router.get('/qlkhachhangEdit/:id', function(req, res, next) {
    Khachhang.findById({_id: req.params.id}).then((khachhang) => {
        res.render('admin/datamanagement/qlkhachhangEdit', { title: 'Edit Khachhang',khachhang: khachhang.toObject() });
    })
});
router.put('/qlkhachhangEdit/:id', function(req, res, next) {
    Khachhang.findById({_id: req.params.id}).then((khachhang) => {
        khachhang.namekh = req.body.namekh;
        khachhang.sdtkh = req.body.sdtkh;
        khachhang.email = req.body.email;
        khachhang.save().then(savedKhachhang=>{
            console.log("Cập nhật thành công:", savedKhachhang);
            res.redirect('/admin/datamanagement/qlkhachhang');
        }).catch(err => {
            console.error("Lỗi lưu dữ liệu:", err);
            next(err);
        });
    });
})

router.get('/qlkhachhangCreate', function(req, res, next) {
    res.render('admin/datamanagement/qlkhachhangCreate', { title: 'Add KhachHang' });
});
router.post('/qlkhachhangCreate', function(req, res, next) {
    const newKhachhang = new Khachhang({
        namekh : req.body.namekh,
        sdtkh : req.body.sdtkh,
        email : req.body.email,
    });
    newKhachhang.save().then(savedKhachhang=>{
        res.redirect('/admin/datamanagement/qlkhachhang');
    });
});
router.delete('/qlkhachhangDelete/:id', function(req, res, next) {
    Khachhang.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/admin/datamanagement/qlkhachhang');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;