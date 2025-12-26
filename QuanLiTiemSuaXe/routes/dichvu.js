var express = require('express');
var router = express.Router();
const Dichvu = require( '../models/Dichvu');
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
router.get('/qldichvu', function(req, res, next) {
    Dichvu.find({}).then((dbdichvu) => {
        const dichvus = dbdichvu.map(cat=>cat.toObject());
        res.render('admin/datamanagement/qldichvu', { dichvus: dichvus });
    })
});
router.get('/qldichvuEdit/:id', function(req, res, next) {
    Dichvu.findById({_id: req.params.id}).then((dichvu) => {
        res.render('admin/datamanagement/qldichvuEdit', { title: 'Edit Dichvu',dichvu: dichvu.toObject() });
    })
});
router.put('/qldichvuEdit/:id', function(req, res, next) {
    Dichvu.findById({_id: req.params.id}).then((dichvu) => {
        dichvu.imagedv = req.body.imagedv;
        dichvu.namedv = req.body.namedv;
        dichvu.motadv = req.body.motadv;
        dichvu.giadv = req.body.giadv;
        dichvu.save().then(savedDichvu=>{
            console.log("Cập nhật thành công:", savedDichvu);
            res.redirect('/admin/datamanagement/qldichvu');
        }).catch(err => {
            console.error("Lỗi lưu dữ liệu:", err);
            next(err);
        });
    });
})

router.get('/qldichvuCreate', function(req, res, next) {
    res.render('admin/datamanagement/qldichvuCreate', { title: 'Add Dich Vu' });
});
router.post('/qldichvuCreate', function(req, res, next) {
    const newDichvu = new Dichvu({
        imagedv : req.body.imagedv,
        namedv : req.body.namedv,
        motadv : req.body.motadv,
        giadv : req.body.giadv,
    });
    newDichvu.save().then(savedDichvu=>{
        res.redirect('/admin/datamanagement/qldichvu');
    });
});
router.delete('/qldichvuDelete/:id', function(req, res, next) {
    Dichvu.deleteOne({ _id: req.params.id })
        .then(() => {
            res.redirect('/admin/datamanagement/qldichvu');
        })
        .catch(err => {
            console.log(err);
            next(err);
        });
});

module.exports = router;