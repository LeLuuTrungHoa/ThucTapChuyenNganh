var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Dichvu = require('../models/Dichvu');
const Sanpham = require('../models/Sanpham');
const Hoadon = require('../models/Hoadon');
const Lichhen = require('../models/Lichhen');
const bcryptjs = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

function userAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_message', 'Vui lòng đăng nhập để đặt lịch hẹn!');
    res.redirect('/login');
}

/* GET home page. */
router.all('/*',
    function(
        req,
        res,
        next) {
     res.app.locals.layout='home';
     next();
});
router.get('/', async (req, res) => {
    try {
        // Truy vấn dữ liệu đồng thời để tối ưu hiệu suất
        const [dbSanphams, dbDichvus] = await Promise.all([
            Sanpham.find({}).sort({ _id: -1 }).limit(6).lean(), // Lấy 6 sản phẩm mới nhất
            Dichvu.find({}).limit(6).lean() // Lấy dịch vụ
        ]);

        // Gửi dữ liệu sang view 'home/index'
        res.render('home/index', {
            title: 'Trang Chủ - Tiệm Sửa Xe Trung Hòa',
            sanphams: dbSanphams, // Truyền mảng sản phẩm
            dichvus: dbDichvus,   // Truyền mảng dịch vụ
            today: new Date().toISOString().split('T')[0] // Dành cho form đặt lịch
        });
    } catch (err) {
        console.error("Lỗi tải trang chủ:", err);
        res.render('home/index', { sanphams: [], dichvus: [] });
    }
});

router.get('/login', function (req, res, next) {
    // Lấy thông báo lỗi từ Passport (nếu thất bại)
    const error = req.flash('error')[0];
    const error_message = req.flash('error_message')[0];

    // Lấy thông báo thành công (thường từ Register)
    const success_message = req.flash('success_message')[0];

    res.render('home/login', {
        title: 'Đăng Nhập',
        error: error || error_message, // Hiển thị lỗi chung
        success_message: success_message
    });
});

router.get('/register', function (req, res, next) {
    // Lấy thông báo lỗi và thành công từ Flash
    const error_message = req.flash('error_message')[0];
    const success_message = req.flash('success_message')[0];

    res.render('home/register', {
        title: 'Đăng Ký',
        error_message: error_message,
        success_message: success_message
    });
});


//APP LOGIN
passport.use(new LocalStrategy({usernameField: 'email'}, function (email, password, done) {
    User.findOne({email: email}).then(user => {
        if (!user)
            return done(null, false, {message: 'User not found'});

        bcryptjs.compare(password, user.password, (err, matched) => {
            if (err) return err;
            if (matched) {
                return done(null, user);
            } else {
                return done(null, false, {message: 'Wrong email or password'});
            }
        });

    });
}));
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            // Xác thực thất bại
            req.flash('error_message', info.message || 'Sai tên đăng nhập hoặc mật khẩu.');
            return res.redirect('/login');
        }

        // Xác thực thành công, đăng nhập user vào session
        req.logIn(user, (err) => {
            if (err) {
                return next(err);
            }


            if (user) {
                return res.redirect('/');
            }

        });
    })(req, res, next);
});

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec();
        done(null, user); // Pass the user to the done callback
    } catch (err) {
        done(err); // Pass the error to the done callback if an error occurred
    }
});
router.get('/logout', (req, res) => {
    req.logOut((err) => {
        if (err) {
            return res.status(500).send(err); // Handle the error appropriately
        }
        res.redirect('/'); // Redirect after logout
    });

})
router.get('/register', function (req, res, next) {
    res.render('home/register', {title: 'Register'});
})
router.post('/register', (req, res, next) => {

    let errors = [];
    if (!req.body.firstName) {
        errors.push({message: 'First name is required 1'});
    }
    if (!req.body.lastName) {
        errors.push({message: 'Last name is required'});
    }
    if (!req.body.email) {
        errors.push({message: 'E-mail is required'});
    }

    if (errors.length > 0) {
        res.render('home/register', {
            title: 'Register',
            errors: errors,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        });
    } else {
        User.findOne({email: req.body.email}).then((user) => {
            if (!user) {
                const newUser = new User({
                    email: req.body.email,
                    password: req.body.password,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                });
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(newUser.password, salt, (err, hash) => {
                        newUser.password = hash;
                        newUser.save().then(saveUser => {
                            req.flash('success_message', 'Successfully registered!');
                            res.redirect('/login');//or /login
                        });
                    })
                })
            } else {
                req.flash('error_message', 'E-mail is exist!');
                res.redirect('/login');
            }

        });

    }
});
// router.post('/register',  (req,res) => {
//         const newUser = new User();
//         newUser.email = req.body.email;
//         newUser.password = req.body.password;
//         bcryptjs.genSalt(10, function (err, salt) {
//             bcryptjs.hash(newUser.password, salt, function (err, hash) {
//                 if (err) {return  err}
//                 newUser.password = hash;
//
//                 newUser.save().then(userSave=>
//                 {
//                     res.send('USER SAVED');
//                 }).catch(err => {
//                     res.send('USER ERROR'+err);
//                 });
//             });
//         });
//     }
// );


router.get('/', function(req, res) {
    res.render('home/index');
})
router.get('/about', function(req, res, next) {
    res.render('home/about', { title: 'Express' });
});

router.get('/customer', function(req, res, next) {
    res.render('home/customer', { title: 'Express' });
});
//san pham
router.get('/pricing', async (req, res) => {
    try {
        const dbSanpham = await Sanpham.find({}).sort({ _id: -1 });
        res.render('home/pricing', {
            title: 'Sản Phẩm & Phụ Tùng',
            sanphams: dbSanpham.map(s => s.toObject())
        });
    } catch (err) {
        res.render('home/pricing', { title: 'Pricing', sanphams: [] });
    }
});
//dich vu
router.get('/feature', async (req, res) => {
    try {
        const dbDichvu = await Dichvu.find({});
        res.render('home/feature', {
            title: 'Dịch vụ cửa hàng',
            dichvus: dbDichvu.map(d => d.toObject())
        });
    } catch (err) {
        console.log(err);
    }
});
// dat lich router.post('/book-appointment', userAuthenticated,
router.post('/book-appointment',userAuthenticated, (req, res) => {
    const newLichhen = new Lichhen({
        user: req.user.id,
        name: req.body.name,
        email: req.body.email,
        number: req.body.number,
        ngayden: req.body.ngayden,
        gioden: req.body.gioden,
        subject: req.body.subject,
        message: req.body.message,
        ngaydat: new Date(),
        status: 'Chờ xác nhận'
    });

    newLichhen.save()
        .then(saved => {
            req.flash('success_message', `Đặt lịch thành công cho ngày ${req.body.ngayden} lúc ${req.body.gioden}!`);
            res.redirect('/contact'); // Hoặc trang chủ tùy bạn
        })
        .catch(err => {
            console.log(err);
            req.flash('error_message', 'Có lỗi xảy ra khi lưu lịch hẹn.');
            res.redirect('/contact');
        });
});
router.get('/contact', function (req, res, next) {
    // Tạo chuỗi ngày hôm nay định dạng YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    res.render('home/contact', {
        title: 'Đặt Lịch Hẹn',
        today: today, // Gửi biến này sang file .hbs
        user: req.user ? req.user.toObject() : null
    });
});

module.exports = router;
