var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/*',function(req,res    ,next){
    res.app.locals.layout='admin';
    next();
});
router.get('/',function(req,res    ,next){
    res.render('admin/index',{title: 'Admin'});
});
router.get('/category',function(req,res    ,next){
    res.render('admin/category/category-list',{title: 'Category'});
});
router.get('/product',function(req,res    ,next){
    res.render('admin/product/product-list',{title: 'Product'});
});
router.get('/qlkhachhang',function(req,res    ,next){
    res.render('admin/datamanagement/qlkhachhang',{title: 'qlKhachHang'});
});
router.get('/qlsanpham',function(req,res    ,next){
    res.render('admin/datamanagement/qlsanpham',{title: 'qlSanPham'});
});
router.get('/qldichvu',function(req,res    ,next){
    res.render('admin/datamanagement/qldichvu',{title: 'qlDichVu'});
});
router.get('/baocao',function(req,res    ,next){
    res.render('admin/baocao/baocaothongke',{title: 'BaoCao'});
});
router.get('/caidat',function(req,res    ,next){
    res.render('admin/caidat/caidat',{title: 'CaiDat'});
});
router.get('/lichhen',function(req,res    ,next){
    res.render('admin/lichhen/lichhen',{title: 'LichHen'});
});
router.get('/hoadon',function(req,res    ,next){
    res.render('admin/hoadon/hoadon',{title: 'HoaDon'});
});
// cac trang them
router.post('/profile/update', function(req, res, next) {
    console.log("Đã nhận dữ liệu cập nhật profile:", req.body);
    res.redirect('/admin/caidat');
});
router.post('/password/update', function(req, res, next) {
    console.log("Đã nhận yêu cầu đổi mật khẩu:", req.body);
    res.redirect('/admin/caidat');
});
router.get('/logout', function(req, res, next) {
    console.log("Người dùng đã đăng xuất!");
    res.redirect('/admin/caidat');
});

module.exports = router;