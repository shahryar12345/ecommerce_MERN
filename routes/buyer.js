var express = require('express');
var router = express.Router();
var joi = require('joi');
joi.objectId = require('joi-objectid')(joi);
var passport = require('passport');
let auth = require('../authentication/authenticateBuyer');
var status = require('../statusCode');
const nodemailer = require('nodemailer');
const rand_token = require('rand-token');
const Product = require('../model/product');
const Category = require('../model/category');
const TrendingProduct = require('../model/products/trendingProducts');
//SS-Changed
const RecentlyViwedProduct = require('../model/products/recentlyViewedProducts');
const Cart = require('../model/cart');
const mongoose = require('mongoose');
const Buyer = require('../model/buyer');
const Seller = require('../model/seller');
const BuyerAddress = require('../model/addresses/addressBuyer');
const Order = require('../model/order');
const ProductReview = require('../model/review/productReview');
const SellerReview = require('../model/review/sellerReview');
const log = require('../log');
const Log = require('../model/Logs');

var token = '';
var emailSubject = '';
var emailHtml = '';

router.post('/signup', (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var phoneNo = req.body.phoneNo;
  var fullName = req.body.fullName;
  var DoB = req.body.DoB;
  var gender = req.body.gender;
  var hostname = req.headers.host;
  const schema = {
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required(),
    fullName: joi
      .string()
      .min(3)
      .required(),
    DoB: joi.string(),
    //DoB: joi.string().required(),
    gender: joi.string().required(),
    phoneNo: joi
      .string()
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required(),
    password: joi
      .string()
      .regex(/^[a-zA-Z0-9]{6,30}$/)
      .required(),
    confirmPassword: joi
      .any()
      .valid(joi.ref('password'))
      .required(),
  };
  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res
      .status(400)
      .json(Object.assign(status.SIGNUP_FAIL, { data: errors.error.details[0].message }));
  } else {
    //console.log(user);
    token = rand_token.generate(30);
    emailSubject = 'Email Verification';
    emailHtml =
      '<h1>Lashcart Email Verification</h1><br/><a href="http://' +
      hostname +
      '/api/buyer/verify?token=' +
      token +
      '">Verify</a>';
    var newBuyer = new Buyer({
      email: email,
      fullName: fullName,
      DoB: DoB,
      gender: gender,
      phoneNo: phoneNo,
      role: 'Buyer',
      password: password,
      token: token,
      emailVerified: false,
    });
    Buyer.createBuyer(newBuyer, (err, user) => {
      if (err) return res.status(400).json(Object.assign(status.SIGNUP_FAIL, { data: err }));
      verifyEmail(email, token, emailSubject, emailHtml);
      return res.status(200).json(status.SIGNUP_SUCCESS);
    });
    //res.redirect("/api/Buyer/dashboard");
  }
});

function ensureAuthentication(req, res, next) {
  console.log(req.user);
  if (req.isAuthenticated() && req.user.role === 'Buyer') return next();
  else return res.status(400).send(status.LOGIN_FAILED_2);
}

function verifyEmail(email, emailSubject, emailHtml) {
  var transporter = nodemailer.createTransport({
    host: 'roundcubelabs.com',
    port: 587,
    secure: false,
    auth: {
      user: 'mailer@roundcubelabs.com',
      pass: '_IAsokx@0(K5',
    },
    tls: { rejectUnauthorized: false },
  });

  var mailOptions = {
    from: 'mailer@roundcubelabs.com',
    to: email,
    subject: emailSubject,
    html: emailHtml,
  };
  console.log(mailOptions.html);
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

router.get('/verify', (req, res) => {
  Buyer.verifyBuyerEmail(req.query.token, (err, verify) => {
    if (err) return res.status(400).json(Object.assign(status.VERIFY_EMAIL_FAILED, { data: err }));
    if (verify === null)
      return res
        .status(400)
        .json(Object.assign(status.VERIFY_EMAIL_FAILED, { data: 'incorrect token' }));
    return res.status(200).json(status.VERIFY_EMAIL_SUCCESS);
  });
});

//forget password
router.post('/forgetpassword', (req, res) => {
  var email = req.body.email;
  var hostname = req.headers.host;
  schema = {
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required(),
  };
  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: errors.error }));
  } else {
    Buyer.getBuyerByEmail(email, (err, buyer) => {
      if (buyer === null) {
        return res
          .status(400)
          .json(Object.assign(status.EMAIL_FAILED_2, { data: 'Invalid email' }));
      } else token = rand_token.generate(30);
      Buyer.updateToken(email, token, (err, buyer) => {
        if (err) return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: err }));
        emailSubject = 'Change Password';
        emailHtml =
          '<h1>Lashcart Change Password</h1><br/><a href="http://' +
          hostname +
          '/api/buyer/resetpassword?token=' +
          token +
          '">Reset Password</a>';
        verifyEmail(email, emailSubject, emailHtml);
        return res.status(200).json(status.EMAIL_SUCCESS_2);
      });
    });
  }
});

//reset password after forget password
router.post('/resetpassword', (req, res) => {
  var newPassword = req.body.newPassword;
  var token = req.query.token;
  var schema = {
    newPassword: joi
      .string()
      .regex(/^[a-zA-Z0-9]{6,30}$/)
      .required(),
    confirmPassword: joi
      .any()
      .valid(joi.ref('newPassword'))
      .required(),
  };
  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: errors.error }));
  } else {
    Buyer.updatePassword(token, newPassword, (err, buyer) => {
      if (err) return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
      if (buyer === null)
        return res
          .status(400)
          .json(Object.assign(status.PASSWORD_FAILED_2, { data: 'invalid token' }));
      return res.status(200).json(status.PASSWORD_SUCCESS_2);
    });
  }
});

//add address
router.post('/address', ensureAuthentication, (req, res) => {
  var province = req.body.province;
  var city = req.body.city;
  var area = req.body.area;
  var address = req.body.address;
  console.log(city);
  var schema = {
    province: joi
      .string()
      .min(3)
      .required(),
    city: joi
      .string()
      .min(3)
      .required(),
    area: joi
      .string()
      .min(3)
      .required(),
    address: joi
      .string()
      .min(7)
      .required(),
  };

  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.ADDRESS_FAILED_2, { data: errors.error }));
  } else {
    var newAddress = new BuyerAddress({
      buyerId: req.user.id,
      province: province,
      city: city,
      area: area,
      address: address,
    });
    console.log(newAddress);
    BuyerAddress.addAddress(newAddress, (err, add) => {
      if (err) {
        var newLog = new Log({
          status: status.ADDRESS_FAILED_2.status,
          message: status.ADDRESS_FAILED_2.message,
          data: err,
          userId: req.user.id,
        });
        log.addLog(newLog);
        return res.status(400).json(Object.assign(status.ADDRESS_FAILED_2, { data: errors.error }));
      }
      console.log(add);
      var newLog = new Log({
        status: status.ADDRESS_SUCCESS.status,
        message: status.ADDRESS_SUCCESS.message,
        data: add,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(200).json(status.ADDRESS_SUCCESS);
    });
  }
});

//place order
router.post('/placeorder', ensureAuthentication, (req, res) => {
  var product = req.body.product;
  var addressId = req.body.addressId;
  schema = {
    product: joi.array().required(),
    addressId: joi.string().required(),
  };
  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.ORDER_FAILED, { data: errors.error }));
  } else {
    var newOrder = new Order({
      buyerId: req.user.id,
      addressId: addressId,
      product: product,
    });
    Order.addOrder(newOrder, (err, order) => {
      if (err) {
        var newLog = new Log({
          status: status.ORDER_FAILED.status,
          message: status.ORDER_FAILED.message,
          data: err,
          userId: req.user.id,
        });
        log.addLog(newLog);
        return res.status(400).json(Object.assign(status.ORDER_FAILED, { data: err }));
      }
      var newLog = new Log({
        status: status.ORDER_SUCCESS.status,
        message: status.ORDER_SUCCESS.message,
        data: order,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(200).json(status.ORDER_SUCCESS);
    });
  }
});

// add product review
router.post('/productreview', ensureAuthentication, (req, res) => {
  var productId = req.body.productId;
  var review = req.body.review;

  var schema = {
    productId: joi.string().required(),
    review: joi.string().required(),
  };

  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.REVIEW_FAILED, { data: errors.error }));
  } else {
    Order.findOrder(req.user.id, productId, (err, order) => {
      if (err) return res.status(400).json(Object.assign(status.REVIEW_FAILED, { data: err }));
      if (order === null) {
        return res
          .status(400)
          .json(Object.assign(status.REVIEW_FAILED, { data: 'You cant review the product' }));
      } else {
        var newReview = new ProductReview({
          buyerId: req.user.id,
          productId: productId,
          review: review,
        });
        ProductReview.addReview(newReview, (err, review) => {
          if (err) {
            var newLog = new Log({
              status: status.REVIEW_FAILED.status,
              message: status.REVIEW_FAILED.message,
              data: err,
              userId: req.user.id,
            });
            log.addLog(newLog);
            return rs.status(400).json(Object.assign(status.REVIEW_FAILED, { data: err }));
          }
          var newLog = new Log({
            status: status.REVIEW_SUCCESS.status,
            message: status.REVIEW_SUCCESS.message,
            data: review,
            userId: req.user.id,
          });
          log.addLog(newLog);
          return res.status(200).json(status.REVIEW_SUCCESS);
        });
      }
    });
  }
});

// add seller review
router.post('/sellerreview', ensureAuthentication, (req, res) => {
  var sellerId = req.body.sellerId;
  var review = req.body.review;

  var schema = {
    sellerId: joi.string().required(),
    review: joi.string().required(),
  };

  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.REVIEW_FAILED, { data: errors.error }));
  } else {
    Order.findSellerInOrder(req.user.id, sellerId, (err, order) => {
      if (err) return res.status(400).json(err);
      if (order === null) {
        return res
          .status(400)
          .json(Object.assign(status.REVIEW_FAILED, { data: 'You cant review the seller' }));
      } else {
        var newReview = new SellerReview({
          buyerId: req.user.id,
          sellerId: sellerId,
          review: review,
        });
        SellerReview.addReview(newReview, (err, review) => {
          if (err) {
            var newLog = new Log({
              status: status.REVIEW_FAILED.status,
              message: status.REVIEW_FAILED.message,
              data: err,
              userId: req.user.id,
            });
            log.addLog(newLog);
            return rs.status(400).json(Object.assign(status.REVIEW_FAILED, { data: err }));
          }
          var newLog = new Log({
            status: status.REVIEW_SUCCESS.status,
            message: status.REVIEW_SUCCESS.message,
            data: review,
            userId: req.user.id,
          });
          log.addLog(newLog);
          return res.status(200).json(status.REVIEW_SUCCESS);
        });
      }
    });
  }
});

//get product reviews
router.get('/productreview', (req, res) => {
  ProductReview.getReview(req.query.productId, (err, reviews) => {
    if (err) {
      var newLog = new Log({
        status: status.REVIEW_FAILED_2.status,
        message: status.REVIEW_FAILED_2.message,
        data: err,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(400).json(Object.assign(status.REVIEW_FAILED_2, { data: err }));
    }
    var newLog = new Log({
      status: 'success',
      message: 'Get product reviews success',
      data: reviews,
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(reviews);
  });
});

//get seller reviews
router.get('/sellerreview', (req, res) => {
  SellerReview.getReview(req.query.sellerId, (err, reviews) => {
    if (err) {
      var newLog = new Log({
        status: status.REVIEW_FAILED_2.status,
        message: status.REVIEW_FAILED_2.message,
        data: err,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(400).json(Object.assign(status.REVIEW_FAILED_2, { data: err }));
    }
    var newLog = new Log({
      status: 'success',
      message: 'Get seller reviews success',
      data: reviews,
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(reviews);
  });
});

// Get Product/seller to be reviewed
router.get('/getProductsToRreview', (req, res) => {
  console.log('Router Hit');
  Order.getProductsToReviwed(req.query.buyerID, (err, reviews) => {
    console.log('Review : ' + reviews);
    console.log('Res : ' + res);
    if (err) {
      return res.status(400).json(Object.assign(status.REVIEW_FAILED_2, { data: err }));
    }
    return res.status(200).json(reviews);
  });
});

// search product by name
// router.get('/search', (req, res) => {
//     var productName = req.query.productName;
//     var categoryName = req.query.categoryName;
//     var subCatName = req.query.subCatName;
//     var subSCatName = req.query.subSCatName;
//     var offset = req.query.offset;
//     var size = req.query.size;
//     if (offset != undefined) offset = parseInt(offset);
//     if (size != undefined) size = parseInt(size);
//     console.log("offset" + offset + " size" + size);
//     if (size >= 100) size = 100;
//     if (size < 10) size = 10;
//     if (productName != undefined) {
//         Product.searchProductByName(productName, offset, size, (err, products) => {
//             if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//             if (productName.length === 0)
//                 return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: "Product not found" }));
//             return res.status(200).json(products);
//         });
//     } else {
//         if (subCatName != undefined) {
//             if (subSCatName != undefined) {
//                 Category.getSubCategoryId(categoryName, subCatName, (err, category) => {
//                     if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));

//                     var arr = category.subCategories[0].toJSON();
//                     console.log(arr.subCategories);
//                     for (i = 0; i < arr.subCategories.length; i++) {
//                         console.log(i);
//                         if (subSCatName === arr.subCategories[i].name) {
//                             Product.getLevel3Products(i._id, offset, size, (err, products) => {
//                                 if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//                                 return res.status(200).json(products);
//                             });
//                         }
//                     }
//                 })
//             } else {
//                 Category.getSubCategoryId(categoryName, subCatName, (err, category) => {
//                     if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//                     Product.getLevel2Products(category.subCategories[0]._id, offset, size, (err, products) => {
//                         if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//                         return res.status(200).json(products);
//                     });
//                 })
//             }
//         } else {
//             Category.getCategoryId(categoryName, (err, category) => {
//                 if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//                 Product.getLevel1Products(category._id, offset, size, (err, products) => {
//                     if (err) return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
//                     return res.status(200).json(products);
//                 });
//             });
//         }
//     }
// });

// SS-Changed
//get trending product days
router.get('/trendingproduct', (req, res) => {
  TrendingProduct.getProduct((err, product) => {
    return res.status(200).json(product);
  });
});

// SS-Changed
//get RecentlyViwed product
router.get('/recentlyViwedproduct', (req, res) => {
  var buyerID = req.query.buyerId;
  RecentlyViwedProduct.getProduct(buyerID, (err, product) => {
    return res.status(200).json(product);
  });
});

//get trending product by month
router.get('/trending', (req, res) => {
  Product.getTrendingProducts((err, trend) => {
    return res.status(200).json(trend);
  });
});

// Get New Products // SS-CHANGED
router.get('/newproducts', (req, res) => {
  Product.getNewProducts((err, newproductsDetail) => {
    return res.status(200).json(newproductsDetail);
  });
});

// @Route Get All Products
router.get('/all-products', (req, res) => {
  const limit = 5;
  const result = {};
  const page = parseInt(req.query.page);
  const offset = (page - 1) * limit;

  if (page === undefined) return res.status(400).json({ msg: 'Page value is required!' });

  Product.find()
    .limit(limit)
    .skip(offset)
    .then(products => {
      if (!products) return res.status(404).json({ msg: 'No product found!' });

      Product.countDocuments({}, (err, totalProducts) => {
        if (err) console.log(`Count error: ${err}`);
        result.page = page;
        result.per_page = limit;
        result.total = totalProducts;
        result.total_pages = Math.ceil(totalProducts / limit);
        result.products = products;

        res.json(result);
      });
    })
    .catch(err => console.log('All product API error ' + err));
});

// @Route Search Product or Cateogry by Name
router.get('/search-name', (req, res) => {
  var searchQuery = req.query.searchQuery;

  var result = { product: [], category: [] };

  if (searchQuery != undefined) {
    Product.find({ name: { $regex: searchQuery, $options: 'i' } })
      .limit(4)
      .then(product => {
        for (let i in product) result.product.push(product[i].name);

        Category.find({ name: { $regex: searchQuery, $options: 'i' } })
          .limit(4)
          .then(category => {
            for (let i in category) result.category.push(category[i].name);

            res.json(result);
          });
      })
      .catch(err => console.log(`Search by name API error ${err}`));
  }
});

// @Route Search all Products and Category
// router.get('/search', (req, res) => {
//   let searchQuery = req.query.searchQuery;
//   const page = parseInt(req.query.page);

router.get('/search', (req, res) => {
  let searchQuery = req.query.searchQuery;
  const page = parseInt(req.query.page);

  const limit = 5;
  const offset = (page - 1) * limit;

  let categoryId = [];
  let result = {};

  if (page === undefined) return res.status(400).json({ msg: 'Page value is required!' });

  if (searchQuery != undefined) {
    Category.find({ name: { $regex: searchQuery, $options: 'i' } })
      .then(category => {
        for (let i in category) categoryId.push(category[i]._id);

        Product.find({
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { 'categoryLevels.level1': { $in: categoryId } },
          ],
        })
          .limit(limit)
          .skip(offset)
          .then(products => {
            Product.count(
              {
                $or: [
                  { name: { $regex: searchQuery, $options: 'i' } },
                  { 'categoryLevels.level1': { $in: categoryId } },
                ],
              },
              (err, totalCounts) => {
                if (err) console.log(`Count error: ${err}`);

                result.page = page;
                result.per_page = limit;
                result.total = totalCounts;
                result.total_pages = Math.ceil(totalCounts / limit);
                result.products = products;

                res.json(result);
              },
            );
          })
          .catch(err => console.log(`Search products error ${err}`));
      })
      .catch(err => console.log(`Search category id error ${err}`));
  }
});

// Get All Products
router.get('/all-products', (req, res) => {
  const limit = 15;
  const page = parseInt(req.query.page);
  const offset = (page - 1) * limit;

  let categoryId = [];
  let result = {};

  if (page === undefined) return res.status(400).json({ msg: 'Page value is required!' });

  if (searchQuery != undefined) {
    Category.find({ name: { $regex: searchQuery, $options: 'i' } })
      .then(category => {
        for (let i in category) categoryId.push(category[i]._id);

        Product.find({
          $or: [
            { name: { $regex: searchQuery, $options: 'i' } },
            { 'categoryLevels.level1': { $in: categoryId } },
          ],
        })
          .limit(limit)
          .skip(offset)
          .then(products => {
            Product.count(
              {
                $or: [
                  { name: { $regex: searchQuery, $options: 'i' } },
                  { 'categoryLevels.level1': { $in: categoryId } },
                ],
              },
              (err, totalCounts) => {
                if (err) console.log(`Count error: ${err}`);

                result.page = page;
                result.per_page = limit;
                result.total = totalCounts;
                result.total_pages = Math.ceil(totalCounts / limit);
                result.products = products;

                res.json(result);
              },
            );
          })
          .catch(err => console.log(`Search products error ${err}`));
      })
      .catch(err => console.log(`Search category id error ${err}`));
  }
});

//get product details
router.get('/product', (req, res) => {
  var productId = req.query.productId;
  var buyerID = req.query.buyerID;
  var LastViwedDateTime = req.query.LastViwedDateTime;
  var product_Id = mongoose.Types.ObjectId(productId);
  var buyer_ID = mongoose.Types.ObjectId(buyerID);

  var trendingProduct = {
    productId: productId,
  };
  // var RecentlyViwedProducts = {
  //     productId: productId,
  //     buyerID: buyerID
  //     LastViwedDateTime :
  // }

  console.log('IN router.get => product ');
  console.log(productId);
  console.log(buyerID);
  console.log(LastViwedDateTime);
  if (buyerID === null || buyerID == undefined || buyerID == '') {
    TrendingProduct.addProduct(product_Id, trendingProduct, (err, trend) => {
      if (err) return res.status(400).json({ message: err });
      Product.findProductByIdForBuyer(product_Id, (errs, product) => {
        if (errs) {
          console.log(errs);
          return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: errs }));
        }
        console.log('findProductByIdForBuyer');
        console.log(product);
        return res.status(200).json(product);
      });
    });
  } else {
    TrendingProduct.addProduct(product_Id, trendingProduct, (err, trend) => {
      if (err) return res.status(400).json({ message: err });
      RecentlyViwedProduct.addProduct(
        product_Id,
        buyerID,
        LastViwedDateTime,
        (err, recentlyViwedProduct) => {
          if (err) return res.status(400).json({ message: err });
          Product.findProductByIdForBuyer(product_Id, (errs, product) => {
            if (errs) {
              console.log(errs);
              return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: errs }));
            }
            console.log('findProductByIdForBuyer');
            console.log(product);
            return res.status(200).json(product);
          });
        },
      );
    });
  }
});

//get category
router.get('/category', (req, res) => {
  var offset;
  var size;
  if (req.query.offset != undefined) offset = parseInt(req.query.offset);
  if (req.query.size != undefined) size = parseInt(req.query.size);
  console.log('offset' + offset + ' size' + size);
  if (size >= 100) size = 100;
  if (size < 10) size = 10;
  Category.findCategory(offset, size, (err, category) => {
    if (err) return res.status(400).json(Object.assign(status.CATEGORY_FAILED_2, { data: err }));
    return res.status(200).json(category);
  });
});

router.get('/GetCategoryDetail', (req, res) => {
  var level1 = req.query.level1;
  var level2 = req.query.level2;
  var level3 = req.query.level3;

  console.log('GetCategoryDetail()');

  console.log(level1);
  Category.getCategories(level1, level2, level3, (err, category) => {
    if (err) {
      // var newLog = new Log({
      //     status: status.GET_CATEGORY_FAILED.status,
      //     message: status.GET_CATEGORY_FAILED.message,
      //     data: err,
      //     userId: req.user.id
      // });
      // log.addLog(newLog);
      return res.status(400).json(Object.assign(status.GET_CATEGORY_FAILED, { data: err }));
    }
    // var newLog = new Log({
    //     status: status.GET_CATEGORY_FAILED.status,
    //     message: status.GET_CATEGORY_FAILED.message,
    //     data: err,
    //     userId: req.user.id
    // });
    // log.addLog(newLog);
    return res.status(200).json(category);
  });
  //console.log("console.log(req.quary.level1)")
  //console.log(req.query.level1)
});

// SS-CHANGED
router.get('/getSimilarProducts', (req, res) => {
  var similarLevel1CatID = req.query.similarcatID;
  console.log('similarLevel1CatID : ' + similarLevel1CatID);
  Product.getLevel1Products(similarLevel1CatID, 0, 10, (err, similarProduct) => {
    if (err) {
      console.log(similarProduct);
      return res.status(400).json(Object.assign(status.SIMILAR_PRODUCT_FAILED, { data: err }));
    }
    console.log(similarProduct);
    return res.status(200).json(similarProduct);
  });
});

auth.authenticate();

// SS_CHANGED (LOGIN)

router.post(
  '/',
  passport.authenticate('local-buyer', { failWithError: true }),
  function(req, res, next) {
    console.log('' + req.user);
    return res.status(200).json(Object.assign(status.LOGIN_SUCCESS, { data: req.user }));
  },
  function(err, req, res, next) {
    return res.status(400).send(status.LOGIN_FAILED_1);
  },
);

router.get('/dashboard', ensureAuthentication, (req, res) => {
  return res.status(200).json({ message: 'DASHBOARD' });
});

// Get Logged IN Buyer Detail

router.get('/', (req, res) => {
  return res.send('buyer');
});

router.get('/logout', (req, res) => {
  req.logOut();
  return res.status(200).json(status.LOGOUT_SUCCESS);
});

//Cart Methods
// SS-CHANGED
router.get('/addCartItem', (req, res) => {
  console.log('addCartItem => ');
  var buyerID = req.query.buyerID;
  var productID = req.query.productID;
  var quantity = req.query.quantity;

  Cart.addItem(productID, buyerID, quantity, (err, cartItem) => {
    //console.log('addCartItem => ' + cartItem)
    return res.status(200).json(cartItem);
  });
});

router.get('/getUserCart', async (req, res) => {
  var buyerID = req.query.buyerID;
  try {
    const cart = await Cart.findOne({ buyerId: buyerID }).populate({
      path: 'products.productId',
      model: 'Product',
    });
    if (cart) {
      return res.send({ success: true, cart });
    }
    return res.send({ sccces: false, message: 'No cart found' });
  } catch (err) {
    return res.send({ sccces: false, message: err.message });
  }
});

// @Route Remove Item From Cart
router.get('/removeItemFromCart', (req, res) => {
  const buyerId = req.query.buyerId;
  const productId = req.query.productId;

  const schema = {
    buyerId: joi.string().required(),
    productId: joi.string().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.CART_ITEM_FAILED, { data: errors.error }));
  } else {
    Cart.updateOne({ buyerId }, { $pull: { products: { _id: productId } } }, { safe: true })
      .then(items => {
        if (!items) {
          res.status(404).json({ message: 'No item found!' });
        } else {
          res.status(200).json(status.CART_ITEM_REMOVE_SUCCESS);
        }
      })
      .catch(err => console.log('Cart Id removal error ' + err));
  }
});

// @Route Remove Multiple Items From Cart
router.get('/removeMultipleItemFromCart', (req, res) => {
  const buyerId = req.query.buyerId;
  const productId = req.query.productId;

  const schema = {
    buyerId: joi.string().required(),
    productId: joi.array().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.CART_ITEM_FAILED, { data: errors.error }));
  } else {
    Cart.updateMany(
      { buyerId },
      { $pull: { products: { _id: { $in: [...productId] } } } },
      { safe: true },
    )
      .then(items => {
        if (!items) {
          res.status(404).json({ message: 'No item found!' });
        } else {
          res.status(200).json(status.CART_ITEM_REMOVE_SUCCESS);
        }
      })
      .catch(err => console.log('Cart Id removal error ' + err));
  }
});

// @Route Get Address of Buyer
router.get('/buyer-address', (req, res) => {
  BuyerAddress.find({ buyerId: req.query.buyerID })
    .then(address => {
      res.json(address);
    })
    .catch(err => console.log(err));
});

// @Route Place an Order / Edit Product Review / Edit Seller Review
router.post('/place-order', (req, res) => {
  let buyerId = req.body.buyerId;
  let addressId = req.body.addressId;
  let product = req.body.product;

  const schema = {
    _id: joi.objectId(),
    buyerId: joi.string().required(),
    addressId: joi.string(),
    date: joi.date(),
    product: joi
      .array()
      .min(1)
      .required()
      .items({
        _id: joi.objectId(),
        productId: joi.string().required(),
        productPrice: joi.string().required(),
        quantity: joi.number().required(),
        sellerId: joi.string().required(),
        deliveryStatus: joi.string(),
        deliveryDate: joi
          .date()
          .allow(null)
          .when('deliveryStatus', {
            is: 'delivered',
            then: joi
              .date()
              .raw({ convert: false })
              .required()
              .error(() => {
                return { message: 'Delivery date is required!' };
              }),
          }),
        productReviewed: joi.boolean(),
        productReviewId: joi
          .string()
          .allow(null)
          .when('productReviewed', {
            is: true,
            then: joi
              .string()
              .required()
              .error(() => {
                return { message: 'Product review id is required!' };
              }),
          }),
        productReviewDate: joi
          .string()
          .allow(null)
          .when('productReviewed', {
            is: true,
            then: joi
              .string()
              .required()
              .error(() => {
                return { message: 'Product review date id is required!' };
              }),
          }),
        sellerReviewed: joi.boolean(),
        sellerReviewId: joi
          .string()
          .allow(null)
          .when('sellerReviewed', {
            is: true,
            then: joi
              .string()
              .required()
              .error(() => {
                return { message: 'Seller review id is required!' };
              }),
          }),
        sellerReviewDate: joi
          .string()
          .allow(null)
          .when('sellerReviewed', {
            is: true,
            then: joi
              .string()
              .required()
              .error(() => {
                return { message: 'Seller review date id is required!' };
              }),
          }),
      }),
  };

  let errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.json(Object.assign(status.ORDER_FAILED, { data: errors.error }));
  } else {
    BuyerAddress.findOne({ _id: addressId, buyerId })
      .then(address => {
        if (!address) {
          return res.json(Object.assign(status.ADDRESS_FAILED_3, { data: errors.error }));
        } else {
          var newOrder = {
            buyerId,
            addressId,
            product,
          };

          if (req.body._id) {
            Order.updateOne({ _id: req.body._id }, { $set: newOrder })
              .then(order => res.status(200).json(status.ORDER_EDIT_SUCCESS))
              .catch(err => res.json(err));
          } else {
            new Order(newOrder)
              .save()
              .then(order => res.status(200).json(status.ORDER_PLACE_SUCCESS))
              .catch(err => res.json(err));
          }
        }
      })
      .catch(err => res.json(err));
  }
});

// @Route Order Status
router.get('/order-status', (req, res) => {
  let orderId = req.query.orderId;
  let buyerId = req.query.buyerId;

  const schema = {
    buyerId: joi.string().required(),
    orderId: joi.string().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.ORDER_FAILED_2, { data: errors.error }));
  } else {
    Order.findOne({ _id: orderId, buyerId: buyerId })
      .then(order => {
        if (!order) return res.json(status.ORDER_STATUS_FAILED);

        res.json(order);
      })
      .catch(err => res.json(err));
  }
});

// @Route Add Product & Seller Review
router.post('/add-review', (req, res) => {
  const buyerId = req.body.buyerId;
  const productId = req.body.productId;
  const sellerId = req.body.sellerId;
  const orderId = req.body.orderId;
  const productReview = req.body.productReview;
  const sellerReview = req.body.sellerReview;
  const productRatings = req.body.productRatings;
  const sellerRatings = req.body.sellerRatings;

  const schema = {
    buyerId: joi
      .string()
      .required()
      .error(() => {
        return {
          message: 'Buyer id is required!',
        };
      }),
    productId: joi
      .string()
      .required()
      .error(() => {
        return {
          message: 'Product id is required!',
        };
      }),
    sellerId: joi
      .string()
      .required()
      .error(() => {
        return {
          message: 'Seller id is required!',
        };
      }),
    orderId: joi
      .string()
      .required()
      .error(() => {
        return {
          message: 'Order id is required!',
        };
      }),
    productReview: joi
      .string()
      .min(3)
      .required()
      .error(() => {
        return {
          message: 'Product review length must be greater than 3!',
        };
      }),
    sellerReview: joi
      .string()
      .min(3)
      .required()
      .error(() => {
        return {
          message: 'Seller review length must be greater than 3!',
        };
      }),
    productRatings: joi
      .number()
      .min(1)
      .max(5)
      .required()
      .error(() => {
        return {
          message: 'Product ratings must be greater than 1 and less than 5!',
        };
      }),
    sellerRatings: joi
      .number()
      .min(1)
      .max(5)
      .required()
      .error(() => {
        return {
          message: 'Seller ratings must be greater than 1 and less than 5!',
        };
      }),
  };

  let errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.json(Object.assign(status.REVIEW_FAILED, { data: errors.error }));
  } else {
    const newProductReview = {
      buyerId,
      productId,
      sellerId,
      orderId,
      review: productReview,
      ratings: productRatings,
    };

    const newSellerReview = {
      buyerId,
      productId,
      sellerId,
      orderId,
      review: sellerReview,
      ratings: sellerRatings,
    };

    Promise.all([
      new ProductReview(newProductReview).save(),
      new SellerReview(newSellerReview).save(),
    ])
      .then(([prodReview, sellReview]) => {
        return res.status(200).json(
          Object.assign(status.REVIEW_SUCCESS, {
            productReview: prodReview,
            sellerReview: sellReview,
          }),
        );
      })
      .catch(err => res.json(err));
  }
});

// @Route Get Products For Review
router.get('/productsForReview', (req, res) => {
  const buyerId = req.query.buyerId;

  Order.find({
    buyerId,
    product: { $elemMatch: { deliveryStatus: 'delivered', productReviewed: 'false' } },
  })
    .then(orders => {
      let sendingData = { orderReview: orders, sellerReview: [], productReview: [] };
      let productIds = [],
        sellerIds = [];

      for (let i in orders) {
        for (let j in orders[i].product) {
          if (
            orders[i].product[j].deliveryStatus === 'delivered' &&
            orders[i].product[j].productReviewed === false
          ) {
            productIds.push(orders[i].product[j].productId);

            if (!sellerIds.includes(orders[i].product[j].sellerId.toString())) {
              sellerIds.push(orders[i].product[j].sellerId.toString());
            }
          }
        }
      }
      sendingData.orderReview = orders;

      let prodQuery, sellQuery;

      if (productIds.length > 0) {
        if (productIds.length === 1) {
          prodQuery = { _id: productIds[0] };
        } else {
          prodQuery = { _id: { $in: productIds } };
        }

        if (sellerIds.length === 1) {
          sellQuery = { _id: sellerIds[0] };
        } else {
          sellQuery = { _id: { $in: sellerIds } };
        }

        Promise.all([Seller.find(sellQuery), Product.find(prodQuery)])
          .then(([sellers, products]) => {
            sendingData.sellerReview = sellers;
            sendingData.productReview = products;

            return res.json(sendingData);
          })
          .catch(err => console.log('Promise error'));
      } else {
        return res.json({ message: 'Product ids array is empty!' });
      }
    })
    .catch(err => res.json(err));
});

router.get('/productReviewHistory', (req, res) => {
  const buyerId = req.query.buyerId;
  const query = { buyerId: mongoose.Types.ObjectId(buyerId) };

  ProductReview.aggregate([
    { $match: query },
    {
      $lookup: {
        from: Order.collection.name,
        localField: 'orderId',
        foreignField: '_id',
        as: 'order',
      },
    },
    { $unwind: '$order' },
    {
      $lookup: {
        from: Product.collection.name,
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
  ])
    .then(reviews => {
      if (!reviews) return res.status(404).json({ message: 'No reviews found!' });

      return res.status(200).json(reviews);
    })
    .catch(err => res.json(err));
});

router.get('/productReviewsByProductId', (req, res) => {
  const prodId = req.query.id;
  const query = { productId: mongoose.Types.ObjectId(prodId) };

  ProductReview.aggregate([
    { $match: query },
    {
      $lookup: {
        from: Buyer.collection.name,
        localField: 'buyerId',
        foreignField: '_id',
        as: 'buyer',
      },
    },
    { $unwind: '$buyer'}
  ])
    .limit(3)
    .sort('-date')
    .then(reviews => {
      if (!reviews) return res.json(Object.assign(status.REVIEW_FAILED));

      return res.json(reviews);
    })
    .catch(err => res.json(err));
});
module.exports = router;
