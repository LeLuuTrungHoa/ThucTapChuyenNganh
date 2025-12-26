var express = require('express');
var router = express.Router();
const Sanpham = require( '../models/sanpham');
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
router.get('/qlsanpham', function(req, res, next) {
    Sanpham.find({}).then((dbsanpham) => {
        const sanphams = dbsanpham.map(cat=>cat.toObject());
        res.render('admin/datamanagement/qlsanpham', { sanphams: sanphams });
    })
});
router.get('/qlsanphamEdit/:id', function(req, res, next) {
    Sanpham.findById({_id: req.params.id}).then((sanpham) => {
        res.render('admin/datamanagement/qlsanphamEdit', { title: 'Edit sanpham',sanpham: sanpham.toObject() });
    })
});
router.put('/qlsanphamEdit/:id', function(req, res, next) {
    Sanpham.findById({_id: req.params.id}).then((sanpham) => {
        sanpham.imagesp = req.body.imagesp;
        sanpham.namesp = req.body.namesp;
        sanpham.motasp = req.body.motasp;
        sanpham.giasp = req.body.giasp;
        sanpham.soluongsp = req.body.soluongsp;
        sanpham.save().then(savedSanpham=>{
            console.log("Cập nhật thành công:", savedSanpham);
            res.redirect('/admin/datamanagement/qlsanpham');
        }).catch(err => {
            console.error("Lỗi lưu dữ liệu:", err);
            next(err);
        });
    });
})

router.get('/qlsanphamCreate', function(req, res, next) {
    res.render('admin/datamanagement/qlsanphamCreate', { title: 'Add sanpham' });
});
router.post('/qlsanphamCreate', function(req, res, next) {
    const newSanpham = new Sanpham({
        imagesp : req.body.imagesp,
        namesp : req.body.namesp,
        motasp : req.body.motasp,
        giasp : req.body.giasp,
        soluongsp : req.body.soluongsp,
    });
    newSanpham.save().then(savedSanpham=>{
        res.redirect('/admin/datamanagement/qlsanpham');
    });
});
router.delete('/qlsanphamDelete/:id', function(req, res, next) {
    Sanpham.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/admin/datamanagement/qlsanpham');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;