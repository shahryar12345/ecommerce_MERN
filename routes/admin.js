var express = require('express');
var router = express.Router();
var Admin = require('../model/admin');
var joi = require('joi');
var passport = require('passport');
let auth = require('../authentication/authenticateAdmin');
var status = require('../statusCode');
const Seller = require('../model/seller');
const PendingSellers = require('../model/pendings/pendingSellers');
const Category = require('../model/category');
const PendingProduct = require('../model/pendings/pendingProducts');
const RejectedProduct = require('../model/rejected/rejectedProducts');
const mongoose = require('mongoose');
const Product = require('../model/product');
const rand_token = require('rand-token');
const nodemailer = require('nodemailer');
const log = require('../log');
const Log = require('../model/Logs');


var token = '';
var emailSubject = '';
var emailHtml = '';

// update Log status
router.post('/log/status', ensureAuthentication, (req, res) => {
    log.setEnable(req.body.status);
    res.status(200).json({ status: "success", message: "Log status has been updated" });
});


//admin signup ensureAuthentication
router.post("/signup", checkAdminCrudPrivilege, async (req, res) => {
    
    var email = req.body.email;
    var adminName = req.body.adminName;
    var phoneNo = req.body.phoneNo;
    var adminViewPrivilege = req.body.adminViewPrivilege;
    var adminCrudPrivilege = req.body.adminCrudPrivilege;
    var sellerViewPrivilege = req.body.adminViewPrivilege;
    var sellerCrudPrivilege = req.body.adminCrudPrivilege;
    var productViewPrivilege = req.body.adminViewPrivilege;
    var productCrudPrivilege = req.body.adminCrudPrivilege;
    var hostname = req.headers.host;
    
    const schema = {
    
        email: joi.string().email({ minDomainAtoms: 2 }).required(),
        adminName: joi.string().min(3).required(),
        phoneNo: joi.string().trim().regex(/^[0-9]{7,10}$/).required(),
        adminViewPrivilege: joi.boolean().required(),
        adminCrudPrivilege: joi.boolean().required(),
        sellerViewPrivilege: joi.boolean().required(),
        sellerCrudPrivilege: joi.boolean().required(),
        productViewPrivilege: joi.boolean().required(),
        productCrudPrivilege: joi.boolean().required()
    
    };
    
    var errors = joi.validate(req.body, schema);
    
    if (errors.error) {
        return res.status(400).json(Object.assign(status.SIGNUP_FAIL, { data: errors.error.details[0].message }));
    } else {
        //console.log(user);
        token = rand_token.generate(30);
        emailSubject = 'Email Verification';
        emailHtml = '<h1>Lashcart Email Verification</h1><br/><a href="http://' + hostname + '/api/admin/verify?token=' + token + '">Verify</a>';
        var pass = rand_token.generate(8);
        var newAdmin = new Admin({
            email: email,
            adminName: adminName,
            phoneNo: phoneNo,
            role: 'Admin',
            adminViewPrivilege: adminViewPrivilege,
            adminCrudPrivilege: adminCrudPrivilege,
            sellerViewPrivilege: sellerViewPrivilege,
            sellerCrudPrivilege: sellerCrudPrivilege,
            productViewPrivilege: productViewPrivilege,
            productCrudPrivilege: productCrudPrivilege,
            password: pass,
            token: token,
            emailVerified: false
        });
        Admin.createAdmin(newAdmin, (err, user) => {
            if (err) {
                var newLog = new Log({
                    status: status.SIGNUP_FAIL.status,
                    message: status.SIGNUP_FAIL.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.SIGNUP_FAIL, { data: err }));
            }
            verifyEmail(email, emailSubject, emailHtml);
            var newLog = new Log({
                status: status.SIGNUP_SUCCESS.status,
                message: status.SIGNUP_SUCCESS.message,
                data: user,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(200).json(status.SIGNUP_SUCCESS);
        });
        //res.redirect("/api/admin/dashboard");
    }
});

//admin email verification
function verifyEmail(email, emailSubject, emailHtml) {
    var transporter = nodemailer.createTransport({
        host: 'roundcubelabs.com',
        port: 587,
        secure: false,
        auth: {
            user: 'mailer@roundcubelabs.com',
            pass: '_IAsokx@0(K5'
        },
        tls: { rejectUnauthorized: false },
    });

    var mailOptions = {
        from: 'mailer@roundcubelabs.com',
        to: email,
        subject: emailSubject,
        html: emailHtml
    }
    console.log(mailOptions.html);
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

router.get('/getadminemail', ensureAuthentication, async (req, res) => {
    Admin.getAdminEmail(req.query.token, (err, admin) => {
        if (err) {
            var newLog = new Log({
                status: status.EMAIL_FAILED.status,
                message: status.EMAIL_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.EMAIL_FAILED, { data: err }));
        }
        if (admin == null) {
            var newLog = new Log({
                status: status.EMAIL_FAILED.status,
                message: status.EMAIL_FAILED.message,
                data: "Admin not found",
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.EMAIL_FAILED, { data: "Admin not found" }));
        }

        var newLog = new Log({
            status: "success",
            message: "Get email successful",
            data: admin.email,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json({ email: admin.email });
    });
});


//get category levels
router.post('/getcategory', ensureAuthentication, async (req, res) => {
    var level1 = req.body.level1;
    var level2 = req.body.level2;
    var level3 = req.body.level3;
    Category.getCategories(level1, level2, level3, (err, category) => {
        if (err) {
            var newLog = new Log({
                status: status.GET_CATEGORY_FAILED.status,
                message: status.GET_CATEGORY_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.GET_CATEGORY_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: status.GET_CATEGORY_FAILED.status,
            message: status.GET_CATEGORY_FAILED.message,
            data: err,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(category);
    });
});

//forget password
router.post('/forgetpassword', async (req, res) => {
    var email = req.body.email;
    var hostname = req.headers.host;
    schema = {
        email: joi.string().email({ minDomainAtoms: 2 }).required()
    }
    var errors = joi.validate(req.body, schema);
    if (errors.error) {
        return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: errors.error }));
    } else {
        Admin.getAdminByEmail(email, (err, admin) => {
            if (admin === null) {
                return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: 'Invalid email' }));
            } else
                token = rand_token.generate(30);
            Admin.updateToken(email, token, (err, admin) => {
                if (err) {
                    return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: err }));
                }
                emailSubject = 'Change Password';
                emailHtml = '<h1>Lashcart Change Password</h1><br/><a href="http://' + hostname + '/api/admin/resetpassword?token=' + token + '">Reset Password</a>';
                verifyEmail(email, emailSubject, emailHtml);
                return res.status(200).json(status.EMAIL_SUCCESS_2);
            });
        });
    }
});

//reset password after forget password
router.post('/resetpassword', async (req, res) => {
    var newPassword = req.body.newPassword;
    var token = req.query.token;
    var schema = {
        newPassword: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
        confirmPassword: joi.any().valid(joi.ref('newPassword')).required(),
    }
    var errors = joi.validate(req.body, schema);
    if (errors.error) {
        return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: errors.error }));
    } else {
        Admin.updatePassword(token, newPassword, (err, admin) => {
            if (err) {
                return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
            }
            if (admin === null) {
                return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: "invalid token" }));
            }
            return res.status(200).json(status.PASSWORD_SUCCESS_2)
        })
    }

});

router.post('/setpassword', async (req, res) => {
    var password = req.body.password;
    var token = req.body.token;
    const schema = {
        token: joi.string().required(),
        password: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
        confirmPassword: joi.any().valid(joi.ref('password')).required(),
    }
    var errors = joi.validate(req.body, schema);
    if (errors.error) {
        return res.status(400).json(Object.assign(status.PASSWORD_FAILED, { data: errors.error.details[0].message }));
    } else {
        Admin.setPassword(password, token, (err, admin) => {
            if (err) {
                return res.status(400).json(Object.assign(status.PASSWORD_FAILED, { data: err }));
            }
            return res.status(200).json(status.PASSWORD_SUCCESS);
        });
    }
});

//SS_CHANGED
function ensureAuthentication(req, res, next) {
    console.log(req.user);
    if ((req.isAuthenticated() && req.user.role === 'Admin') || 1 == 1 )
        return next();
    else
        //SS-CHANGED
        //console.log(req.sellerViewPrivilege);
        console.log("ensureAuthentication Failed");
        return res.status(400).json(status.LOGIN_FAILED_2);
}

// check admin privileges
function checkAdminViewPrivilege(req, res, next) {
    if (req.user.adminViewPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}

function checkAdminCrudPrivilege(req, res, next) {
    if (req.user.adminCrudPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}

// check product privileges
function checkProductViewPrivilege(req, res, next) {
    if (req.user.productViewPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}

function checkProductCrudPrivilege(req, res, next) {
    if (req.user.productCrudPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}

//check seller privileges
function checkSellerViewPrivilege(req, res, next) {
    if (req.user.sellerViewPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}

function checkSellerCrudPrivilege(req, res, next) {
    if (req.user.sellerCrudPrivilege)
        return next();
    else
        return res.status(400).json(status.PRIVILEGES);
}


//authentication
console.log("auth.authenticate(); Start");
auth.authenticate();
console.log("auth.authenticate(); End");



// Login
router.post('/', passport.authenticate('local-admin', { failWithError: true }),
    function (req, res, next) {
        console.log("Hello" + req.user);
        return res.status(200).json(Object.assign(status.LOGIN_SUCCESS, { data: req.user }));
    },
    function (err, req, res, next) {
        
        return res.status(400).send(status.LOGIN_FAILED_1);
    }
);

//change password
router.post('/changepassword', ensureAuthentication, async (req, res) => {
    var prevPassword = req.body.prevPassword;
    var newPassword = req.body.newPassword;
    const schema = {
        prevPassword: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
        newPassword: joi.string().regex(/^[a-zA-Z0-9]{6,30}$/).required(),
        confirmPassword: joi.any().valid(joi.ref('newPassword')).required(),
    }

    errors = joi.validate(req.body, schema);
    if (errors.error) {
        return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: errors.error }));
    } else {
        Admin.comparePassword(prevPassword, req.user.password, (err, isMatch) => {
            if (err) {
                var newLog = new Log({
                    status: status.PASSWORD_FAILED_2.status,
                    message: status.PASSWORD_FAILED_2.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
            }
            if (isMatch) {
                Admin.changePassword(req.user.id, newPassword, (err, user) => {
                    if (err) {
                        if (process.env.LOGGED_ENABLE) {
                            var newLog = new Log({
                                status: status.PASSWORD_FAILED_2.status,
                                message: status.PASSWORD_FAILED_2.message,
                                data: err,
                                userId: req.user.id
                            });
                            log.addLog(newLog);
                        }
                        return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
                    }
                    var newLog = new Log({
                        status: status.PASSWORD_SUCCESS_2.status,
                        message: status.PASSWORD_SUCCESS_2.message,
                        data: "password changed successfully",
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(200).json(status.PASSWORD_SUCCESS_2);
                });
            } else {
                return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: "you have enter invalid password" }));
            }
        });
    }


});

router.get("/dashboard", ensureAuthentication, (req, res) => {
    return res.status(200).json({ message: 'DASHBOARD' });
});

//Get Admin Record Data
router.get("/", ensureAuthentication, (req, res) => {
    return res.send(req.user);
});

//Logout
router.get("/logout", (req, res) => {
    req.logOut();
    return res.status(200).json(status.LOGOUT_SUCCESS);
});

//get pending sellers
router.get("/pendingsellers", ensureAuthentication, checkSellerViewPrivilege, async (req, res) => {
    var offset;
    var size;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.size != undefined) size = parseInt(req.query.size);
    console.log("offset" + offset + " size" + size);
    if (size >= 100) size = 100;
    if (size < 10) size = 10;
    PendingSellers.getSeller(offset, size, (err, seller) => {
        if (err) {
            var newLog = new Log({
                status: status.SELLERS_FAILED.status,
                message: status.SELLERS_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.SELLERS_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get seller successful",
            data: seller,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(seller);
    });
});


//approved pending seller
router.post("/pendingsellers/approved", ensureAuthentication, checkSellerCrudPrivilege, async (req, res) => {
    var email = req.body.email;
    // var sellerStatus = req.body.status; 
    var sellerStatus = 'approved';
    console.log(email);
    PendingSellers.deleteSeller(email, (err, seller) => {
    });
    Seller.updateStatus(email, sellerStatus, true, (err, seller) => {
        if (err) {
            var newLog = new Log({
                status: status.REQUEST_FAIL.status,
                message: status.REQUEST_FAIL.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
        }
        var newLog = new Log({
            status: status.REQUEST_APPROVED.status,
            message: status.REQUEST_APPROVED.message,
            data: email + " seller has been " + sellerStatus,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(Object.assign(status.REQUEST_APPROVED, { data: email + " seller has been " + sellerStatus }));
    });
});

//reject pending seller
router.post("/pendingsellers/rejected", ensureAuthentication, checkSellerCrudPrivilege, (req, res) => {
    var email = req.body.email;
    console.log(email);
    PendingSellers.deleteSeller(email, (err, seller) => {
    });
    Seller.updateStatus(email, 'rejected', false, (err, seller) => {
        if (err) {
            var newLog = new Log({
                status: status.REQUEST_FAIL.status,
                message: status.REQUEST_FAIL.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
        }
        var newLog = new Log({
            status: status.REQUEST_REJECTED.status,
            message: status.REQUEST_REJECTED.message,
            data: email + " seller has been rejected",
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(Object.assign(status.REQUEST_REJECTED, { data: email + " seller has been rejected" }));
    });
});

//add category of products
router.post('/addcategory', ensureAuthentication, (req, res) => {
    var catName = req.body.catName;
    var commission = req.body.commission;

    var schema = {
        catName: joi.string().min(3).required(),
        commission: joi.number().required()
    }

    var errors = joi.validate(req.body, schema);
    if (errors.error) {
        return res.status(400).json(Object.assign(status.CATEGORY_FAILED, { data: errors.error }));
    } else {
        var newCategory = new Category({
            name: catName,
            commission: commission
        });
        Category.addCategory(newCategory, (err, category) => {
            if (err) {
                var newLog = new Log({
                    status: status.CATEGORY_FAILED.status,
                    message: status.CATEGORY_FAILED.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(404).json(Object.assign(status.CATEGORY_FAILED, { data: err }));
            }
            var newLog = new Log({
                status: status.CATEGORY_SUCCESS.status,
                message: status.CATEGORY_SUCCESS.message,
                data: category,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(200).json(status.CATEGORY_SUCCESS);
        })
    }

});


//add sub category
router.post('/addsubcategory', ensureAuthentication, (req, res) => {
    var subSCatName = req.body.subSCatName;
    var catName = req.body.catName;
    var subCatName = req.body.subCatName;
    if (subSCatName === undefined) {
        var schema = {
            subCatName: joi.string().min(3).required(),
            catName: joi.string().min(3).required(),
        }

        var errors = joi.validate(req.body, schema);
        if (errors.error) {
            return res.status(400).json(Object.assign(status.CATEGORY_FAILED, { data: errors.error }));
        } else {
            var newCategory = new Category({
                name: subCatName
            });
            Category.addSubCategory(catName, subCatName, newCategory, (err, category) => {
                console.log(category);
                if (err) {
                    var newLog = new Log({
                        status: status.CATEGORY_FAILED.status,
                        message: status.CATEGORY_FAILED.message,
                        data: err,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(404).json(Object.assign(status.CATEGORY_FAILED, { data: err }));
                }
                if (category === null) {
                    var newLog = new Log({
                        status: status.CATEGORY_FAILED.status,
                        message: status.CATEGORY_FAILED.message,
                        data: 'You already have this category ' + subCatName,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(404).json(Object.assign(status.CATEGORY_FAILED, { data: 'You already have this category ' + subCatName }));
                }
                var newLog = new Log({
                    status: status.CATEGORY_SUCCESS.status,
                    message: status.CATEGORY_SUCCESS.message,
                    data: category,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(200).json(status.CATEGORY_SUCCESS);
            });
        }
    } else {
        var schema = {
            subCatName: joi.string().min(3).required(),
            catName: joi.string().min(3).required(),
            subSCatName: joi.string().min(3).required()
        }

        var errors = joi.validate(req.body, schema);
        if (errors.error) {
            return res.status(400).json(Object.assign(status.CATEGORY_FAILED, { data: errors.error }));
        } else {
            var newCategory = new Category({
                name: subSCatName
            });
            console.log('subsubcategory');
            Category.addSubSubCategory(subSCatName, newCategory, subCatName, (err, category) => {
                if (err) {
                    var newLog = new Log({
                        status: status.CATEGORY_FAILED.status,
                        message: status.CATEGORY_FAILED.message,
                        data: err,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(404).json(Object.assign(status.CATEGORY_FAILED, { data: err }));
                }
                if (category === null) {
                    var newLog = new Log({
                        status: status.CATEGORY_FAILED.status,
                        message: status.CATEGORY_FAILED.message,
                        data: 'You already have this category ' + subCatName,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(404).json(Object.assign(status.CATEGORY_FAILED, { data: 'You already have this category ' + subCatName }));
                }
                var newLog = new Log({
                    status: status.CATEGORY_SUCCESS.status,
                    message: status.CATEGORY_SUCCESS.message,
                    data: category,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(200).json(status.CATEGORY_SUCCESS);
            });

        }
    }

});

//get pending products
router.get('/pendingproducts', ensureAuthentication, checkProductViewPrivilege, (req, res) => {
    var offset;
    var size;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.size != undefined) size = parseInt(req.query.size);
    console.log("offset" + offset + " size" + size);
    if (size >= 100) size = 100;
    if (size < 10) size = 10;
    PendingProduct.getProduct(offset, size, (err, products) => {
        if (err) {
            var newLog = new Log({
                status: status.PENDING_PRODUCT_FAILED.status,
                message: status.PENDING_PRODUCT_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.PENDING_PRODUCT_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get pending product success",
            data: products,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(products);
    });
});

//pending product approved
router.post('/productapprove', ensureAuthentication, checkProductCrudPrivilege, async (req, res) => {
    var productId = req.body.productId;
    productId = mongoose.Types.ObjectId(productId);
    newProduct = {};
    PendingProduct.getProductById(productId, async (err, product) => {
        console.log(product);
        newProduct = new Product({
            name: product.name,
            brand: product.brand,
            model: product.model,
            highlights: product.highlights,
            description: product.description,
            warrantyType: product.warrantyType,
            dangerousGoods: {
                battery: product.dangerousGoods.battery,
                famable: product.dangerousGoods.famable,
                liquid: product.dangerousGoods.liquid
            },
            whatsInTheBox: product.whatsInTheBox,
            packageWeight: product.packageWeight,
            packageDimensions: {
                length: product.packageDimensions.length,
                width: product.packageDimensions.width,
                height: product.packageDimensions.height
            },
            categoryLevels: {
                level1: product.categoryLevels.level1,
                level2: product.categoryLevels.level2,
                level3: product.categoryLevels.level3
            },
            status: 'approved',
            sellerId: product.sellerId,
            SKU: product.SKU,
            totalHits: 0,
            productImage: product.productImage,
            creationDate: product.creationDate
        });
        PendingProduct.deleteProduct(productId, (err, det) => {
            if (err) {
                var newLog = new Log({
                    status: status.REQUEST_FAIL.status,
                    message: status.REQUEST_FAIL.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
            }
        });
        await Seller.incrementProductsAdded(product.sellerId);
        var seller = await Seller.checkProductCount(product.sellerId);
        if (seller != null) {
            await Seller.incrementPoints(seller.referralBy);
            let sellers = await Seller.getSellerForRank(product.sellerId);
            console.log("sellers", sellers);
            for (let i = 0; i < sellers.length; i++) {
                await Seller.updateRank(sellers[i]._id, i + 1);
            }
        }
        Product.addProduct(newProduct, (err, product) => {
            if (err) {
                var newLog = new Log({
                    status: status.REQUEST_FAIL.status,
                    message: status.REQUEST_FAIL.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
            }
            var newLog = new Log({
                status: status.REQUEST_APPROVED.status,
                message: status.REQUEST_APPROVED.message,
                data: product,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(200).json(status.REQUEST_APPROVED);
        });
    });
});


//pending product rejected
router.post('/productreject', ensureAuthentication, checkProductCrudPrivilege, (req, res) => {
    var productId = req.body.productId;
    productId = mongoose.Types.ObjectId(productId);
    PendingProduct.getProductById(productId, (err, product) => {
        console.log(product);
        newProduct = new RejectedProduct({
            name: product.name,
            brand: product.brand,
            model: product.model,
            highlights: product.highlights,
            description: product.description,
            warantyType: product.warantyType,
            dangerousGoods: {
                battery: product.dangerousGoods.battery,
                famable: product.dangerousGoods.famable,
                liquid: product.dangerousGoods.liquid
            },
            whatsInTheBox: product.whatsInTheBox,
            packageWeight: product.packageWeight,
            packageDimensions: {
                length: product.packageDimensions.length,
                width: product.packageDimensions.width,
                height: product.packageDimensions.height
            },
            categoryLevels: {
                level1: product.categoryLevels.level1,
                level2: product.categoryLevels.level2,
                level3: product.categoryLevels.level3
            },
            status: 'rejected',
            sellerId: product.sellerId,
            SKU: product.SKU
        });
        PendingProduct.deleteProduct(productId, (err, det) => {
            if (err) {
                var newLog = new Log({
                    status: status.REQUEST_FAIL.status,
                    message: status.REQUEST_FAIL.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
            }
            console.log(det);
        });

        RejectedProduct.addRejectedProduct(newProduct, (err, product) => {
            if (err) {
                var newLog = new Log({
                    status: status.REQUEST_FAIL.status,
                    message: status.REQUEST_FAIL.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
            }
            var newLog = new Log({
                status: status.REQUEST_REJECTED.status,
                message: status.REQUEST_REJECTED.message,
                data: product,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(200).json(status.REQUEST_REJECTED);
        });
    });
});

//get all categories
router.get('/category', (req, res) => {
    var offset = parseInt(req.query.offset);
    var size = parseInt(req.query.size);
    console.log(size);
    if (size >= 100) size = 100;
    Category.findCategory(offset, size, (err, cat) => {
        if (err) {
            var newLog = new Log({
                status: status.CATEGORY_FAILED_2.status,
                message: status.CATEGORY_FAILED_2.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.CATEGORY_FAILED_2, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get category success",
            data: Object.toString(cat),
            // userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(cat);
    });
});

//get all admin
router.get('/admins', ensureAuthentication, checkAdminViewPrivilege, (req, res) => {
    console.log('Getting All Admins');
    Admin.getAdmins(req.user.id, (err, admins) => {
        if (err) {
            var newLog = new Log({
                status: status.ADMIN_FAILED.status,
                message: status.ADMIN_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.ADMIN_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get admins success",
            data: admins,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(admins);
    });
});

//get all sellers
router.get('/sellers', ensureAuthentication, checkSellerViewPrivilege, (req, res) => {
    var offset;
    var size;
    if (req.query.offset != undefined) offset = parseInt(req.query.offset);
    if (req.query.size != undefined) size = parseInt(req.query.size);
    console.log("offset" + offset + " size" + size);
    if (size >= 100) size = 100;
    if (size < 10) size = 10;
    Seller.getSellers(offset, size, (err, sellers) => {
        if (err) {
            var newLog = new Log({
                status: status.SELLERS_FAILED.status,
                message: status.SELLERS_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.SELLERS_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get seller success",
            data: sellers,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(sellers);
    });
});

//get seller details
router.post("/sellers/detail", ensureAuthentication, checkSellerViewPrivilege, (req, res) => {
    var email = req.body.email;
    PendingSellers.getSellerDetails(email, (err, pSeller) => {
        if (err) return res.status(400).json(Object.assign(status.SELLERS_FAILED_2, { data: err }));
        console.log(pSeller);
        if (pSeller.length) {
            console.log(pSeller);
            return res.status(200).json(pSeller);
        }
        else {
            Seller.getSellerDetails(email, (err, seller) => {
                if (err) {
                    var newLog = new Log({
                        status: status.SELLERS_FAILED_2.status,
                        message: status.SELLERS_FAILED_2.message,
                        data: err,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(400).json(Object.assign(status.SELLERS_FAILED_2, { data: err }));
                }
                console.log(seller);
                if (seller.length) {
                    var newLog = new Log({
                        status: "success",
                        message: "Get seller details success",
                        data: seller,
                        userId: req.user.id
                    });
                    log.addLog(newLog);
                    return res.status(200).json(seller);
                }
                var newLog = new Log({
                    status: status.SELLERS_FAILED_2.status,
                    message: status.SELLERS_FAILED_2.message,
                    data: err,
                    userId: req.user.id
                });
                log.addLog(newLog);
                return res.status(400).json(Object.assign(status.SELLERS_FAILED_2, { data: "Seller not  found" }));
            });
        }
    });
});

//get all products
router.get('/products', ensureAuthentication, checkProductViewPrivilege, (req, res) => {
    var offset = parseInt(req.query.offset);
    var size = parseInt(req.query.size);
    console.log(size);
    if (size >= 100) size = 100;
    Product.getProducts(offset, size, (err, products) => {
        if (err) {
            var newLog = new Log({
                status: status.PRODUCT_FAILED.status,
                message: status.PRODUCT_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get products success",
            data: products,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(products);
    });
});

//get seller products
router.post('/seller/product', ensureAuthentication, checkProductViewPrivilege, (req, res) => {
    var sellerId = req.body.sellerId;
    var offset = parseInt(req.query.offset);
    var size = parseInt(req.query.size);
    console.log(size);
    if (size >= 100) size = 100;
    Product.getSellerProduct(sellerId, offset, size, (err, products) => {
        if (err) {
            var newLog = new Log({
                status: status.PRODUCT_FAILED.status,
                message: status.PRODUCT_FAILED.message,
                data: err,
                userId: req.user.id
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
        }
        var newLog = new Log({
            status: "success",
            message: "Get product of seller",
            data: products,
            userId: req.user.id
        });
        log.addLog(newLog);
        return res.status(200).json(products);
    })
});

router.get('/privileges', ensureAuthentication, (req, res) => {
    var privileges = {
        adminViewPrivilege: req.user.adminViewPrivilege,
        adminCrudPrivilege: req.user.adminCrudPrivilege,
        sellerViewPrivilege: req.user.sellerViewPrivilege,
        sellerCrudPrivilege: req.user.sellerCrudPrivilege,
        productViewPrivilege: req.user.productViewPrivilege,
        productCrudPrivilege: req.user.productCrudPrivilege
    }

    return res.status(200).json(privileges);
});

module.exports = router;