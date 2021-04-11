var express = require('express');
var router = express.Router();
var Seller = require('../model/seller');
var Buyer = require('../model/buyer');
let auth = require('../authentication/authenticateSeller');
var passport = require('passport');
var joi = require('joi');
var status = require('../statusCode');
const nodemailer = require('nodemailer');
const rand_token = require('rand-token');
const Address = require('../model/addresses/addressSeller');
const SellerAddress = require('../model/addresses/addressSeller');
const BuyerAddress = require('../model/addresses/addressBuyer');
const multer = require('multer');
const SellerIdInfo = require('../model/sellerIdInfo');
const SellerBankDetail = require('../model/sellerBankDetails');
let upload = multer({ storage: multer.memoryStorage() });
const PendingSellers = require('../model/pendings/pendingSellers');
const RejectedProduct = require('../model/rejected/rejectedProducts');
const Product = require('../model/product');
const PendingProduct = require('../model/pendings/pendingProducts');
const Order = require('../model/order');
const SellerReview = require('../model/review/sellerReview');
const ProductReview = require('../model/review/productReview');
const DeliveredProduct = require('../model/products/deliveredProducts');
const log = require('../log');
const Log = require('../model/Logs');
const uuid = require('uuid');
const Voucher = require('../model/voucher');
const mongoose = require('mongoose');

var token = '';
var emailSubject = '';
var emailHtml = '';

router.post('/signup', (req, res) => {
  var email = req.body.email;
  var ownerName = req.body.ownerName;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  var phoneNo = req.body.phoneNo;
  var accountType = req.body.accountType;
  var shopName = req.body.shopName;
  var shopLocation = req.body.shopLocation;
  var hostname = req.headers.host;
  var refKey = req.body.refKey;

  const schema = joi.object().keys({
    //ownerName: joi.string().min(3).required().label('FistMessage'),
    ownerName: joi
      .string()
      .min(3)
      .label('Name Minimum Length Should be 3'),
    shopName: joi
      .string()
      .min(3)
      .required()
      .label('Shop Name Minimum Length Should be 3'),
    shopLocation: joi
      .string()
      .min(7)
      .required()
      .label('Shop Location Minimum Length Should be 7'),
    phoneNo: joi
      .string()
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required()
      .label('Phone no Length Should be between 7 and 10, Only Digit is allowed.'),
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required()
      .label('Email is Required'),
    password: joi
      .string()
      .regex(/^[a-zA-Z0-9]{6,30}$/)
      .required()
      .label('Password Lenght should be betwwen 6 and 30'),
    confirmPassword: joi
      .any()
      .valid(joi.ref('password'))
      .required()
      .label('Confirm password is required and must match with the password field'),
    accountType: joi
      .string()
      .min(3)
      .required(),
  });
  var errors = joi.validate(req.body, schema, { stripUnknown: true });
  if (errors.error) {
    console.log('***** Error Testing **** ');
    console.log(errors.error.details[0]);
    console.log(errors.error.details[0].path);
    return res
      .status(400)
      .json(Object.assign(status.SIGNUP_FAIL, { data: errors.error.details[0].context.label }));
  } else {
    token = rand_token.generate(30);
    emailSubject = 'Email Verification';
    emailHtml =
      '<h1>Lashcart Email Verification</h1><br/><a href="http://' +
      hostname +
      '/api/seller/verify?token=' +
      token +
      '">Verify</a>';
    var newSeller = new Seller({
      ownerName: ownerName,
      email: email,
      phoneNo: phoneNo,
      password: password,
      accountType: accountType,
      shopName: shopName,
      shopLocation: shopLocation,
      role: 'Seller',
      emailVerified: false,
      verified: false,
      status: 'unverified',
      stepsToDo: 0,
      token: token,
      priority: 3,
      referralKey: uuid(),
      referralBy: refKey,
      abnNumber: req.body.abnNumber,
    });
    Seller.createSeller(newSeller, (err, user) => {
      if (err) return res.status(400).json(Object.assign(status.SIGNUP_FAIL, { data: err }));
      verifyEmail(email, emailSubject, emailHtml);
      return res.status(200).json(status.SIGNUP_SUCCESS);
    });
  }
});
//seller email verification
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

function ensureAuthentication(req, res, next) {
  //console.log(req);
  //console.log(req.user + ' ******  USER OBJECT ******');

  if ((req.isAuthenticated() && req.user.role === 'Seller') || 1 == 1) {
    return next();
  } else {
    return res.status(400).send(status.LOGIN_FAILED_2);
  }
}

auth.authenticate();

console.log(token);
router.get('/verify', (req, res) => {
  Seller.verifySellerEmail(req.query.token, (err, verify) => {
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
    Seller.getAdminByEmail(email, (err, seller) => {
      if (seller === null) {
        return res
          .status(400)
          .json(Object.assign(status.EMAIL_FAILED_2, { data: 'Invalid email' }));
      } else token = rand_token.generate(30);
      Seller.updateToken(email, token, (err, seller) => {
        if (err) return res.status(400).json(Object.assign(status.EMAIL_FAILED_2, { data: err }));
        emailSubject = 'Change Password';
        emailHtml =
          '<h1>Lashcart Change Password</h1><br/><a href="http://' +
          hostname +
          '/api/seller/resetpassword?token=' +
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
    Seller.updatePassword(token, newPassword, (err, seller) => {
      if (err) return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
      if (seller === null)
        return res
          .status(400)
          .json(Object.assign(status.PASSWORD_FAILED_2, { data: 'invalid token' }));
      return res.status(200).json(status.PASSWORD_SUCCESS_2);
    });
  }
});

//change password
router.post('/changepassword', ensureAuthentication, (req, res) => {
  var prevPassword = req.body.prevPassword;
  var newPassword = req.body.newPassword;
  const schema = {
    prevPassword: joi
      .string()
      .regex(/^[a-zA-Z0-9]{6,30}$/)
      .required(),
    newPassword: joi
      .string()
      .regex(/^[a-zA-Z0-9]{6,30}$/)
      .required(),
    confirmPassword: joi
      .any()
      .valid(joi.ref('newPassword'))
      .required(),
  };

  errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: errors.error }));
  } else {
    Seller.comparePassword(prevPassword, req.user.password, (err, isMatch) => {
      if (err) return res.status(400).json(err);
      if (isMatch) {
        Seller.changePassword(req.user.id, newPassword, (err, user) => {
          if (err)
            return res.status(400).json(Object.assign(status.PASSWORD_FAILED_2, { data: err }));
          return res.status(200).json(status.PASSWORD_SUCCESS_2);
        });
      } else {
        return res
          .status(400)
          .json(
            Object.assign(status.PASSWORD_FAILED_2, { data: 'you have enter invalid password' }),
          );
      }
    });
  }
});

//sharing
router.post('/share', ensureAuthentication, (req, res) => {
  var schema = {
    email: joi
      .string()
      .email({ minDomainAtoms: 2 })
      .required(),
  };
  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res.status(400).json(Object.assign(status.SHARE_EMAIL_FAILED, { data: errors.error }));
  } else {
    emailSubject = 'Seller Request';
    emailHtml =
      '<h1>Lashcart Seller Request</h1><br/><a href="http://' +
      req.headers.host +
      '/api/seller/signup?refkey=' +
      req.user.referralKey +
      '">Accept</a>';
    verifyEmail(req.body.email, emailSubject, emailHtml);
    return res.status(200).json(status.SHARE_EMAIL_SUCCESS);
  }
});

// router.post('/pendingrequest', ensureAuthentication, (req, res) => {
//   var newPendingRequest = new PendingSellers({
//     email: 'johndoe@gmail.com',
//     ownerName: 'John Doe',
//     sellerId: '5e5b9fe53597de47e063a23c',
//     phoneNo: '123456789',
//     accountType: 'Individual',
//     shopName: 'John Doe Shop',
//     shopLocation: 'ABC street, XYZ city',
//     role: 'Seller',
//     verified: true,
//     emailVerified: false,
//     token: 'sSxNsM2OyCAtV9g8UWAdjYw58HsOoE',
//     status: 'pending',
//     stepsToDo: 0,
//     // email: req.user.email,
//     // ownerName: req.body.ownerName,
//     // sellerId: req.user.id,
//     // phoneNo: req.user.phoneNo,
//     // accountType: req.user.accountType,
//     // shopName: req.user.shopName,
//     // shopLocation: req.user.shopLocation,
//     // role: req.user.role,
//     // verified: req.user.verified,
//     // emailVerified: req.user.emailVerified,
//     // token: req.user.token,
//     // status: 'pending',
//     // stepsToDo: req.user.stepsToDo,
//   });
//   var newLog = new Log({
//     status: status.REQUEST_FAIL.status,
//     message: status.REQUEST_FAIL.message,
//     data: 'Error to be placed here', //err,//TODO:issue
//     // userId: req.user.id,
//     userId: '5e5b9fe53597de47e063a23c',
//   });
//   PendingSellers.addSeller(newPendingRequest, (err, details) => {
//     if (err) {
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
//     }
//   });

//   // Seller.updateStatus(req.user.email, 'pending', false, (err, status) => {
//   Seller.updateStatus('johndoe@gmail.com', 'pending', false, (err, status) => {
//     if (err) {
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
//     }
//   });

//   // Seller.updateStepsToDo(req.user._id, 4, (err, status) => {
//   Seller.updateStepsToDo('5e5b9fe53597de47e063a23c', 4, (err, status) => {
//     if (err) {
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
//     }
//   });
//   // newLog = new Log({
//   //     status: status.REQUEST_SUCCESS.status,
//   //     message: status.REQUEST_SUCCESS.message,
//   //     data: "",
//   //     userId: req.user.id
//   // });
//   // log.addLog(newLog);
//   return res.status(200).json(status.REQUEST_SUCCESS);
// });

router.post('/testing', ensureAuthentication, (req, res) => {
  console.log('Testing Calle + ' + req);
  console.log('Testing Calle + ' + req.user);
});
// router.post('/bankdetails', ensureAuthentication, (req, res) => {
//   //router.post('/bankdetails', ensureAuthentication, upload.single('chequeCopy'),(req, res) => {
//   if (
//     req.user.stepsToDo < 2
//     //&& req.user.stepsToDo == 4
//   ) {
//     return res.status(400).json(status.REQUEST_FAIL_1);
//   } else {
//     // if (req.file === undefined) {
//     //     return res.status(400).json(Object.assign(status.FORM_FAIL, { data: "copyCheque not found" }));
//     // }
//     var acctTitle = req.body.acctTitle;
//     var acctNum = req.body.acctNum;
//     var bankName = req.body.bankName;
//     var branchCode = req.body.branchCode;
//     console.log('***** Bank Details.*****');
//     console.log(req.body);

//     //var chequeCopy = req.file;
//     var schema = {
//       bankName: joi
//         .string()
//         .min(3)
//         .required()
//         .label('Bank name minimum length should be 3'),
//       acctTitle: joi
//         .string()
//         .min(3)
//         .required()
//         .label('Account name minimum length should be 3'),
//       branchCode: joi
//         .string()
//         .min(3)
//         .required()
//         .label('BSB minimum length should be 3'),
//       acctNum: joi
//         .string()
//         .min(3)
//         .required()
//         .label('Account number length should be 3'),
//     };
//     var errors = joi.validate(req.body, schema);
//     if (errors.error) {
//       return res
//         .status(400)
//         .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
//     } else {
//       var newBankDetails = {
//         accountTitle: acctTitle,
//         accountNumber: acctNum,
//         bankName: bankName,
//         branchCode: branchCode,
//         chequeCopy: {
//           //data: chequeCopy.buffer,
//           //contentType: chequeCopy.mimetype
//           data: '',
//           contentType: '',
//         },
//         sellerId: req.user.id,
//       };

//       var newLog = new Log({
//         status: status.FORM_FAIL.status,
//         message: status.FORM_FAIL.message,
//         data: 'Error to be placed here', //err,//TODO:issue
//         userId: req.user.id,
//       });
//       SellerBankDetail.addData(req.user.id, newBankDetails, (err, details) => {
//         if (err) {
//           log.addLog(newLog);
//           return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
//         }
//       });

//       Seller.updateStepsToDo(req.user.id, 3, function(err, step) {
//         if (err) {
//           log.addLog(newLog);
//           return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
//         }
//       });
//       newLog = new Log({
//         status: status.FORM_SUCCESS.status,
//         message: status.FORM_SUCCESS.message,
//         data: '',
//         userId: req.user.id,
//       });
//       return res.status(200).json(status.FORM_SUCCESS);
//     }
//   }
// });

// //seller identification information
// router.post(
//   '/idinfo',
//   ensureAuthentication,
//   upload.fields([
//     { name: 'idFrntImg', maxCount: 1 },
//     { name: 'idBckImg', maxCount: 1 },
//   ]),
//   (req, res) => {
//     if (
//       req.user.stepsToDo < 1
//       // req.user.stepsToDo == 4
//     ) {
//       return res.status(400).json(status.REQUEST_FAIL_1);
//     } else {
//       var idType = req.body.idType;
//       var nameOnId = req.body.nameOnId;
//       var cnicNum = req.body.cnicNum;
//       // res.send(req.files);
//       var schema = {
//         idType: joi
//           .string()
//           .required()
//           .label('Please Select ID Type'),
//         nameOnId: joi
//           .string()
//           .min(3)
//           .required()
//           .label('Name on ID minimum length is 3'),
//         cnicNum: joi
//           .string()
//           .min(6)
//           .required()
//           .label("ID's minimum length is 6"),
//         idFrntImg: joi.array().label('Select Picture One'),
//         idBckImg: joi.array().label('Select Picture Two'),
//       };
//       // var schemaFiles1 = {
//       //     idFrntImg: joi.array().required().label("Select Picture One"),
//       //     //idBckImg: joi.array().required().label("Select Picture Two"),
//       // }
//       // var schemaFiles2 = {
//       //     //idFrntImg: joi.array().required().label("Select Picture One"),
//       //     idBckImg: joi.array().required().label("Select Picture Two"),
//       // }

//       var errors = joi.validate(req.body, schema);
//       if (errors.error) {
//         return res
//           .status(400)
//           .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
//       }
//       // errors = joi.validate(req.files, schemaFiles1);
//       // if (errors.error) {
//       //     return res.status(500).json(Object.assign(status.FORM_FAIL, { data: "Select Picture One" }));
//       // }
//       // errors = joi.validate(req.files, schemaFiles2);
//       // if (errors.error) {
//       //     return res.status(400).json(Object.assign(status.FORM_FAIL, { data: "Select Picture Two" }));
//       // }
//       else {
//         var idFrntImg = req.files['idFrntImg'][0];
//         var idBckImg = req.files['idBckImg'][0];
//         var newInfo = {
//           idType: idType,
//           nameOnId: nameOnId,
//           CNICNum: cnicNum,
//           idFrntImg: {
//             data: idFrntImg.buffer,
//             contentType: idFrntImg.mimetype,
//           },
//           idBckImg: {
//             data: idBckImg.buffer,
//             contentType: idBckImg.mimetype,
//           },
//           sellerId: req.user.id,
//         };

//         var newLog = new Log({
//           status: status.FORM_FAIL.status,
//           message: status.FORM_FAIL.message,
//           data: 'Error to be placed here', //err,//TODO:issue
//           userId: req.user.id,
//         });
//         sellerIdInfo.addData(req.user.id, newInfo, (err, info) => {
//           if (err) {
//             log.addLog(newLog);
//             return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
//           }
//         });
//         Seller.updateStepsToDo(req.user.id, 2, function(err, step) {
//           if (err) {
//             log.addLog(newLog);
//             return res.status(400).json(Object.assign(status.REQUEST_FAIL, { data: err }));
//           }
//         });
//         newLog = new Log({
//           status: status.FORM_SUCCESS.status,
//           message: status.FORM_SUCCESS.message,
//           data: '',
//           userId: req.user.id,
//         });
//         return res.status(200).json(status.FORM_SUCCESS);
//       } // else
//     }
//   },
// );

//Seller addresses
// router.post('/address', ensureAuthentication, (req, res) => {
//   //Business address
//   var bus_address = req.body.bus_address;
//   var bus_country = req.body.bus_country;
//   var bus_state = req.body.bus_state;
//   var bus_area = req.body.bus_area;

//   //Warehouse address
//   var war_address = req.body.war_address;
//   var war_country = req.body.war_country;
//   var war_state = req.body.war_state;
//   var war_area = req.body.war_area;

//   var schema = {
//     war_address: joi
//       .string()
//       .min(7)
//       .required()
//       .label('Warehosue Street Address Mininum 7 length is required'),
//     war_country: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Warehosue Suburb Mininum 3 length is required'),
//     war_state: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Please Select State'),
//     war_area: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Warehosue Post code Mininum 3 length is required'),
//     bus_address: joi
//       .string()
//       .min(7)
//       .required()
//       .label('Business Street Address Mininum 7 length is required'),
//     bus_country: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Business Suburb Mininum 3 length is required'),
//     bus_state: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Please Select Business State '),
//     bus_area: joi
//       .string()
//       .min(3)
//       .required()
//       .label('Business Post code Mininum 3 length is required'),
//   };

//   var errors = joi.validate(req.body, schema);
//   if (errors.error) {
//     return res
//       .status(400)
//       .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
//   } else {
//     var newBusinessAddress = {
//       address: bus_address,
//       country: bus_country,
//       state: bus_state,
//       area: bus_area,
//       seller_id: req.user.id,
//     };

//     var newWarehouseAddress = {
//       address: war_address,
//       country: war_country,
//       state: war_state,
//       area: war_area,
//       seller_id: req.user.id,
//     };

//     var newLog = new Log({
//       status: status.FORM_FAIL.status,
//       message: status.FORM_FAIL.message,
//       data: 'Error to be placed here', //err,//TODO:issue
//       userId: req.user.id,
//     });

//     Address.addAddress(req.user.id, newBusinessAddress, newWarehouseAddress, (err, user) => {
//       if (err) {
//         log.addLog(newLog);
//         return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
//       }

//       console.log('Error: ' + err, 'User: ' + user);
//     });

//     Seller.updateStepsToDo(req.user.id, 1, function(err, step) {
//       if (err) {
//         log.addLog(newLog);
//         return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
//       }
//       newLog = new Log({
//         status: status.FORM_SUCCESS.status,
//         message: status.FORM_SUCCESS.message,
//         data: '',
//         userId: req.user.id,
//       });
//       log.addLog(newLog);
//       return res.status(200).json(status.FORM_SUCCESS);
//     });
//   }
// });

//add product api
router.post('/product', ensureAuthentication, upload.array('productImage', 8), async (req, res) => {
  Seller.getSellerById(req.user.id, async (err, seller) => {
    if (req.user.status != 'approved') {
      return res.status(400).json(
        Object.assign(status.PRODUCT_FAILED_3, {
          data: 'Your status is ' + req.user.status + '. Need to Approved your Account First.',
        }),
      );
    } else {
      var productName = req.body.productName;
      var brand = req.body.brand;
      var model = req.body.model;
      var highlights = req.body.highlights;
      var description = req.body.description;
      var warrantyType = req.body.warrantyType;
      var battery = req.body.battery;
      var flamable = req.body.flammable;
      var liquid = req.body.liquid;
      var whatsInTheBox = req.body.whatsInTheBox;
      var packageWeight = req.body.packageWeight;
      var length = req.body.length;
      var width = req.body.width;
      var height = req.body.height;
      var level1 = req.body.level1;
      var level2 = req.body.level2;
      var level3 = req.body.level3;
      var sku = JSON.parse(req.body.sku);
      var creationDate = req.body.creationDate; //SS-CHANGED
      console.log('In seller.js');
      console.log(req.body);
      //console.log(sku);
      //console.log(req.files)
      //console.log("^file")
      var schema = {
        productName: joi.string().required(),
        brand: joi.string().required(),
        model: joi.string(),
        highlights: joi.string().required(),
        description: joi.string().required(),
        warrantyType: joi.string().required(),
        battery: joi.boolean(),
        flammable: joi.boolean(),
        liquid: joi.boolean(),
        //whatsInTheBox: joi.string().required(),
        //packageWeight: joi.number().required(),
        //length: joi.number().required(),
        //width: joi.number().required(),
        //height: joi.number().required(),
        level1: joi.string().required(),
        level2: joi.string().allow(['', null]),
        level3: joi.string().allow(['', null]),
        sku: joi.array(),
        creationDate: joi.number().required(),
      };
      var errors = joi.validate(req.body, schema, { stripUnknown: true });
      if (errors.error) {
        return res.status(400).json(Object.assign(status.FORM_FAIL, { data: errors.error }));
      } else {
        if (level2 === '') level2 = undefined;
        if (level3 === '') level3 = undefined;
        var newProduct = new PendingProduct({
          name: productName,
          brand: brand,
          model: model,
          highlights: highlights,
          description: description,
          warrantyType: warrantyType,
          dangerousGoods: {
            battery: battery,
            flamable: flamable,
            liquid: liquid,
          },
          whatsInTheBox: whatsInTheBox,
          packageWeight: packageWeight,
          packageDimensions: {
            length: length,
            width: width,
            height: height,
          },
          categoryLevels: {
            level1: level1,
            level2: level2,
            level3: level3,
          },
          status: 'pending',
          sellerId: req.user.id,
          SKU: sku,
          productImage: req.files,
          creationDate: creationDate,
        });

        console.log(req.body);

        await Seller.incrementTotalProduct(req.user.id);
        PendingProduct.addPendingProduct(newProduct, (err, product) => {
          if (err) {
            var newLog = new Log({
              status: status.FORM_FAIL.status,
              message: status.FORM_FAIL.message,
              data: '' + err,
              userId: req.user.id,
            });
            log.addLog(newLog);
            return res.status(400).json(Object.assign(status.FORM_FAIL, { data: err }));
          }
          var newLog = new Log({
            status: status.PRODUCT_APPROVAL.status,
            message: status.PRODUCT_APPROVAL.message,
            data: product,
            userId: req.user.id,
          });
          console.log(JSON.stringify(product));
          log.addLog(newLog);
          return res.status(200).json(status.PRODUCT_APPROVAL);
        });
      }
    }
  });
});

// Login
router.post(
  '/',
  passport.authenticate('local-seller', { failWithError: true }),
  function(req, res, next) {
    console.log('In Login Method : ' + req.user);
    return res.status(200).json(Object.assign(status.LOGIN_SUCCESS, { data: req.user }));
  },
  function(err, req, res, next) {
    return res.status(400).send(status.LOGIN_FAILED_1);
  },
);

//get seller address
// router.get('/address', ensureAuthentication, (req, res) => {
//   Seller.getSellerAddress(req.user.email, (err, address) => {
//     if (err) {
//       var newLog = new Log({
//         status: status.ADDRESS_FAILED.status,
//         message: status.ADDRESS_FAILED.message,
//         data: err,
//         userId: req.user.id,
//       });
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.ADDRESS_FAILED, { data: err }));
//     }
//     var newLog = new Log({
//       status: 'success',
//       message: 'Get address success',
//       data: address,
//       userId: req.user.id,
//     });
//     log.addLog(newLog);
//     return res.status(200).json(address);
//   });
// });

//get seller identity information
// router.get('/idinfo', ensureAuthentication, (req, res) => {
//   sellerIdInfo.getIdInfo(req.user.id, (err, idinfo) => {
//     if (err) {
//       var newLog = new Log({
//         status: status.IDINFO_FAILED.status,
//         message: status.IDINFO_FAILED.message,
//         data: err,
//         userId: req.user.id,
//       });
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.IDINFO_FAILED, { data: err }));
//     }
//     var newLog = new Log({
//       status: 'success',
//       message: 'Get Id-info success',
//       data: idinfo,
//       userId: req.user.id,
//     });
//     log.addLog(newLog);
//     return res.status(200).json(idinfo);
//   });
// });

router.get('/pendingrequest', ensureAuthentication, (req, res) => {
  return res.status(200).json({});
});

//get seller bank details
// router.get('/bankdetails', ensureAuthentication, (req, res) => {
//   SellerBankDetail.getBankDetails(req.user.id, (err, bankDet) => {
//     if (err) {
//       var newLog = new Log({
//         status: status.BANK_DETAILS_FAILED.status,
//         message: status.BANK_DETAILS_FAILED.message,
//         data: err,
//         userId: req.user.id,
//       });
//       log.addLog(newLog);
//       return res.status(400).json(Object.assign(status.BANK_DETAILS_FAILED, { data: err }));
//     }
//     var newLog = new Log({
//       status: 'success',
//       message: 'Get bank details success',
//       data: bankDet,
//       userId: req.user.id,
//     });
//     log.addLog(newLog);
//     return res.status(200).json(bankDet);
//   });
// });

//get seller products
router.get('/product', ensureAuthentication, (req, res) => {
  var offset;
  var size;
  if (req.query.offset != undefined) offset = parseInt(req.query.offset);
  if (req.query.size != undefined) size = parseInt(req.query.size);
  console.log('offset' + offset + ' size' + size);
  if (size >= 100) size = 100;
  if (size < 10) size = 10;
  var errLog = new Log({
    status: status.PENDING_PRODUCT_FAILED.status,
    message: status.PENDING_PRODUCT_FAILED.message,
    data: 'Error to be placed here', //err,//TODO:issue
    userId: req.user.id,
  });
  var newLog = new Log({
    status: 'success',
    message: 'Get product success',
    data: '',
    userId: req.user.id,
  });
  if (req.query.status === 'pending') {
    PendingProduct.getSellerProducts(req.user.id, offset, size, (err, products) => {
      if (err) {
        log.addLog(errLog);
        return res.status(400).json(Object.assign(status.PENDING_PRODUCT_FAILED, { data: err }));
      }
      log.addLog(newLog);
      res.status(200).json(products);
    });
  } else if (req.query.status === 'appoved') {
    Product.getSellerProduct(req.user.id, offset, size, (err, products) => {
      if (err) {
        errLog.status = status.PRODUCT_FAILED.status;
        errLog.status = status.PRODUCT_FAILED.status;
        log.addLog(errLog);
        return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
      }
      log.addLog(newLog);
      res.status(200).json(products);
    });
  } else if (req.query.status === 'rejected') {
    RejectedProduct.getSellerProducts(req.user.id, offset, size, (err, products) => {
      if (err) {
        log.addLog(errLog);
        return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
      }
      log.addLog(newLog);
      res.status(200).json(products);
    });
  } else {
    Seller.getSellerProduct(req.user.email, offset, size, (err, products) => {
      if (err) {
        log.addLog(errLog);
        return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: err }));
      }
      log.addLog(newLog);
      res.status(200).json(products);
    });
  }
});

//get seller review
router.get('/sellerreview', ensureAuthentication, (req, res) => {
  SellerReview.getReview(req.user.id, (err, review) => {
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
      message: 'Get seller review success',
      data: review,
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(review);
  });
});

//get product by id
router.get('/product/search', ensureAuthentication, async (req, res) => {
  try {
    var product = await Product.findProductById(req.query._id, req.user._id);
    if (product === null) {
      product = await PendingProduct.findProductById(req.query._id, req.user._id);
      if (product === null)
        product = await RejectedProduct.findProductById(req.query._id, req.user._id);
    }
    console.log('product', product);
    if (product === null)
      return res
        .status(404)
        .json(Object.assign(status.PRODUCT_FAILED, { data: 'No product found' }));
    return res.status(200).json(product);
  } catch (err) {
    return res.status(400).json(Object.assign(status.PRODUCT_FAILED, { data: '' + err }));
  }
});

//get sellers product review
router.get('/productreview', ensureAuthentication, (req, res) => {
  Product.getSellerProducts(req.user.id, (err, reviews) => {
    if (err) {
      var newLog = new Log({
        status: status.REVIEW_FAILED.status,
        message: status.REVIEW_FAILED.message,
        data: err,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(400).json(Object.assign(status.REVIEW_FAILED, { data: err }));
    }
    var newLog = new Log({
      status: 'success',
      message: 'Get products review success',
      data: reviews,
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(reviews);
  });
});

//update product
router.post(
  '/product/update',
  ensureAuthentication,
  upload.array('productImage', 8),
  async (req, res) => {
    var product = {
      ...req.body,
    };
    if (req.files != undefined) {
      product = {
        ...req.body,
        productImage: req.files,
      };
    }
    var sku = JSON.parse(req.body.sku);
    console.log(req.body._id);
    product.sku = sku;

    try {
      var updatedProduct = await PendingProduct.updateProduct(req.body._id, product);
      if (updatedProduct === null)
        updatedProduct = await Product.updateProduct(req.body._id, product);
      if (updatedProduct === null)
        return res
          .status(400)
          .json(Object.assign(status.UPDATE_PRODUCT_FAILED, { data: 'Product not found' }));

      return res.status(200).json(status.UPDATE_PRODUCT_SUCCESS);
    } catch (err) {
      return res.status(400).json(Object.assign(status.UPDATE_PRODUCT_FAILED, { data: '' + err }));
    }
  },
);

//order delivered
router.post('/orderdelivered', ensureAuthentication, (req, res) => {
  var productId = req.body.productId;
  var orderId = req.body.orderId;
  Order.getOrderedProduct(orderId, productId, (err, order) => {
    if (err) return res.status(400).json(Object.assign(status.DELIVERED_FAILED, { data: err }));
    if (order === null) {
    } else {
      console.log(order);
      var newDeliveredProduct = new DeliveredProduct({
        orderId: order.id,
        buyerId: order.buyerId,
        addressId: order.addressId,
        product: order.product,
      });
      //Order.deleteOrder(orderId,(err,del)=>{});
      DeliveredProduct.addDeliveredProduct(newDeliveredProduct, (err, product) => {
        if (err) {
          var newLog = new Log({
            status: status.DELIVERED_FAILED.status,
            message: status.DELIVERED_FAILED.message,
            data: err,
            userId: req.user.id,
          });
          log.addLog(newLog);
          return res.status(400).json(Object.assign(status.DELIVERED_FAILED, { data: err }));
        }
        var newLog = new Log({
          status: status.DELIVERED_SUCCESS.status,
          message: status.DELIVERED_SUCCESS.message,
          data: product,
          userId: req.user.id,
        });
        log.addLog(newLog);
        return res.status(200).json(status.DELIVERED_SUCCESS);
      });
    }
  });
});

//get seller orders
router.get('/orders', ensureAuthentication, (req, res) => {
  Order.getSellerOrders(req.user.id, (err, order) => {
    if (err) {
      var newLog = new Log({
        status: status.ORDER_FAILED_2.status,
        message: status.ORDER_FAILED_2.message,
        data: err,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(400).json(Object.assign(status.ORDER_FAILED_2, { data: err }));
    }
    var newLog = new Log({
      status: 'success',
      message: 'Get orders success',
      data: '',
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(order);
  });
});

//get order details
router.get('/orderdetails', ensureAuthentication, (req, res) => {
  Order.getSellerOrderDetails(req.user.id, (err, order) => {
    if (err) {
      var newLog = new Log({
        status: status.ORDER_FAILED_2.status,
        message: status.ORDER_FAILED_2.message,
        data: err,
        userId: req.user.id,
      });
      log.addLog(newLog);
      return res.status(400).json(Object.assign(status.ORDER_FAILED_2, { data: err }));
    }
    var newLog = new Log({
      status: 'success',
      message: 'Get order details success',
      data: '',
      userId: req.user.id,
    });
    log.addLog(newLog);
    return res.status(200).json(order);
  });
});

//add voucher
router.post('/voucher/add', ensureAuthentication, (req, res) => {
  var schema = {
    name: joi.string().required(),
    code: joi.string().required(),
    discountType: joi.string().required(),
    minimumValue: joi.number().required(),
    totalVouchers: joi.number().required(),
    discountValue: joi.number().required(),
    usagePerCustomer: joi.number().required(),
    applyTo: joi.string().required(),
    maximumDiscount: joi.number().required(),
  };
  var errors = joi.validate(req.body, schema, { stripUnknown: true });
  if (errors.error) {
    return res.status(400).json(Object.assign(status.ADD_VOUCHER_FAILED, { data: errors.error }));
  } else {
    var newVoucher = new Voucher({
      ...req.body,
      sellerId: req.user.id,
    });
    Voucher.addVoucher(newVoucher, (err, vaouher) => {
      if (err)
        return res.status(400).json(Object.assign(status.ADD_VOUCHER_FAILED, { data: '' + err }));
      return res.status(200).json(status.ADD_VOUCHER_SUCCESS);
    });
  }
});

//edit voucher
router.post('/voucher/edit', ensureAuthentication, (req, res) => {
  var voucher = {
    ...req.body,
  };
  delete voucher.code;
  delete voucher.applyTo;
  Voucher.updateVoucher(req.body._id, voucher, (err, voucher) => {
    if (err)
      return res.status(400).json(Object.assign(status.UPDATE_VOUCHER_FAILED, { data: '' + err }));
    if (voucher === {})
      return res
        .status(400)
        .json(Object.assign(status.UPDATE_VOUCHER_FAILED, { data: 'Voucher not found' }));
    return res.status(200).json(status.UPDATE_VOUCHER_SUCCESS);
  });
});

//get vouchers
router.get('/voucher', ensureAuthentication, (req, res) => {
  Voucher.getVouchers(req.user.id, (err, vouchers) => {
    if (err)
      return res.status(400).json(Object.assign(status.GET_VOUCHER_FAILED, { data: '' + err }));
    return res.status(200).json(vouchers);
  });
});

//share voucher api
router.post('/voucher/share', ensureAuthentication, (req, res) => {
  if (req.body.email === undefined || req.body.email === '')
    return res
      .status(400)
      .json(Object.assign(status.GET_VOUCHER_FAILED, { data: 'Please enter email' }));
  if (req.body.code === undefined || req.body.code === '')
    return res.status(400).json(Object.assign(status.GET_VOUCHER_FAILED, { data: 'Invalid code' }));
  emailSubject = 'Lashcart Discount Voucher';
  emailHtml =
    '<html><h1>Voucher (' +
    req.body.code +
    ')</h1></br>Get an ultimate discount from our new voucher XD</html>';
  email = req.body.email;
  verifyEmail(email, emailSubject, emailHtml);
  return res.status(200).json(status.SHARE_VOUCHER_SUCCESS);
});

//change voucher status
router.post('/voucher/status', ensureAuthentication, (req, res) => {
  if (req.body.status != 'Active' && req.body.status != 'Inactive')
    return res
      .status(400)
      .json(Object.assign(status.UPDATE_VOUCHER_STATUS_FAILED, { data: 'Invalid status' }));
  else
    Voucher.updateStatus(req.body.voucherId, req.body.status, (err, voucher) => {
      if (err)
        return res
          .status(400)
          .json(Object.assign(status.UPDATE_VOUCHER_STATUS_FAILED, { data: '' + err }));
      if (voucher === null)
        return res
          .status(400)
          .json(Object.assign(status.UPDATE_VOUCHER_STATUS_FAILED, { data: 'Invalid voucher id' }));
      return res.status(200).json(status.UPDATE_VOUCHER_STATUS_SUCCESS);
    });
});

router.get('/dashboard', ensureAuthentication, (req, res) => {
  return res.status(200).json({ message: 'DASHBOARD' });
});

// Get Seller From DB
// router.get('/', ensureAuthentication, (req, res) => {
//   //SS-CHANGED
//   //console.log(req.user + 'sacasc');
//   console.log('*********** This One Called ************');
//   return res.send(req.user);
// });

router.get('/logout', (req, res) => {
  req.logOut();
  return res.status(200).json(status.LOGOUT_SUCCESS);
});

// @Route Get Seller Information by ID
router.get('/', (req, res) => {
  // Seller.findOne({ _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') })
  Seller.findOne({ _id: req.user.id })
    .populate('sellerAddresses')
    .populate('idInformation')
    .populate('bankDetails')
    .then(seller => res.json(seller));
});

// @Route Add Seller Address
router.post('/add-address', ensureAuthentication, (req, res) => {
  //Business address
  let bus_address = req.body.bus_address;
  let bus_country = req.body.bus_country;
  let bus_state = req.body.bus_state;
  let bus_area = req.body.bus_area;

  //Warehouse address
  let war_address = req.body.war_address;
  let war_country = req.body.war_country;
  let war_state = req.body.war_state;
  let war_area = req.body.war_area;

  let sellerStatus = req.body.sellerStatus;

  let schema = {
    war_address: joi
      .string()
      .min(7)
      .required()
      .label('Warehosue Street Address Mininum 7 length is required'),
    war_country: joi
      .string()
      .min(3)
      .required()
      .label('Warehosue Suburb Mininum 3 length is required'),
    war_state: joi
      .string()
      .valid('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')
      .required()
      .label('Please Select State'),
    war_area: joi
      .string()
      .min(3)
      .required()
      .label('Warehosue Post code Mininum 3 length is required'),
    bus_address: joi
      .string()
      .min(7)
      .required()
      .label('Business Street Address Mininum 7 length is required'),
    bus_country: joi
      .string()
      .min(3)
      .required()
      .label('Business Suburb Mininum 3 length is required'),
    bus_state: joi
      .string()
      .valid('ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA')
      .required()
      .label('Please Select Business State '),
    bus_area: joi
      .string()
      .min(3)
      .required()
      .label('Business Post code Mininum 3 length is required'),
    sellerStatus: joi.string().required(),
  };

  var errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res
      .status(400)
      .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
  } else {
    var newBusinessAddress = {
      address: bus_address,
      country: bus_country,
      state: bus_state,
      area: bus_area,
    };

    var newWarehouseAddress = {
      address: war_address,
      country: war_country,
      state: war_state,
      area: war_area,
    };

    const newAddress = {
      // seller_id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c'),
      seller_id: mongoose.Types.ObjectId(req.user.id),
      business_address: newBusinessAddress,
      warehouse_address: newWarehouseAddress,
    };

    new SellerAddress(newAddress)
      .save()
      .then(address => {
        Seller.findOneAndUpdate(
          // { _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') },
          { _id: mongoose.Types.ObjectId(req.user.id) },
          { $push: { sellerAddresses: address._id }, status: sellerStatus },
          { new: true },
        )
          .then(updatedSeller => {
            return res
              .status(200)
              .json(Object.assign(status.FORM_SUCCESS, { data: updatedSeller }));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
});

// @Route Add Seller ID Information
router.post(
  '/add-idInfo',
  ensureAuthentication,
  upload.fields([
    { name: 'idFrntImg', maxCount: 1 },
    { name: 'idBckImg', maxCount: 1 },
  ]),
  (req, res) => {
    let idType = req.body.idType;
    let nameOnId = req.body.nameOnId;
    let idNumber = req.body.idNumber;
    let sellerStatus = req.body.sellerStatus;

    let schema = {
      idType: joi
        .string()
        .valid('Birth Certificate', 'Driver Licence', 'Medicare', 'Passport', 'Photo Card', 'Other')
        .required()
        .label('Please Select ID Type'),
      nameOnId: joi
        .string()
        .min(3)
        .required()
        .label('Name on ID minimum length is 3'),
      idNumber: joi
        .string()
        .min(6)
        .required()
        .label("ID's minimum length is 6"),
      idFrntImg: joi.array().label('Select Picture One'),
      idBckImg: joi.array().label('Select Picture Two'),
      sellerStatus: joi.string().required(),
    };

    let errors = joi.validate(req.body, schema);
    if (errors.error) {
      return res
        .status(400)
        .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
    } else {
      let idFrntImg = req.files['idFrntImg'][0];
      let idBckImg = req.files['idBckImg'][0];

      const newIdInfo = {
        idType,
        nameOnId,
        idNumber,
        idFrntImg: {
          data: idFrntImg.buffer,
          contentType: idFrntImg.mimetype,
        },
        idBckImg: {
          data: idBckImg.buffer,
          contentType: idBckImg.mimetype,
        },
        sellerId: req.user.id,
        // sellerId: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c'),
      };

      new SellerIdInfo(newIdInfo)
        .save()
        .then(idInfo => {
          Seller.findOneAndUpdate(
            // { _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') },
            { _id: mongoose.Types.ObjectId(req.user.id) },
            { $push: { idInformation: idInfo._id }, status: sellerStatus },
            { new: true },
          )
            .then(updatedSeller => {
              return res
                .status(200)
                .json(Object.assign(status.FORM_SUCCESS, { data: updatedSeller }));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  },
);

// @Route Add Seller Bank Information
router.post('/add-bankDetails', ensureAuthentication, (req, res) => {
  //router.post('/add-bankDetails', ensureAuthentication, upload.single('chequeCopy'),(req, res) => {

  let accountName = req.body.accountName;
  let accountNumber = req.body.accountNumber;
  let bankName = req.body.bankName;
  let branchCode = req.body.branchCode;
  let sellerStatus = req.body.sellerStatus;

  let schema = {
    bankName: joi
      .string()
      .min(3)
      .required()
      .label('Bank name minimum length should be 3'),
    accountName: joi
      .string()
      .min(3)
      .required()
      .label('Account name minimum length should be 3'),
    branchCode: joi
      .string()
      .min(3)
      .required()
      .label('BSB minimum length should be 3'),
    accountNumber: joi
      .string()
      .min(3)
      .required()
      .label('Account number length should be 3'),
    sellerStatus: joi.string().required(),
  };

  let errors = joi.validate(req.body, schema);
  if (errors.error) {
    return res
      .status(400)
      .json(Object.assign(status.FORM_FAIL, { data: errors.error.details[0].context.label }));
  } else {
    var newBankDetails = {
      accountName,
      accountNumber,
      bankName,
      branchCode,
      chequeCopy: {
        //data: chequeCopy.buffer,
        //contentType: chequeCopy.mimetype
        data: '',
        contentType: '',
      },
      sellerId: req.user.id,
      // sellerId: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c'),
    };

    new SellerBankDetail(newBankDetails)
      .save()
      .then(bankInfo => {
        Seller.findOneAndUpdate(
          // { _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') },
          { _id: mongoose.Types.ObjectId(req.user.id) },
          { $push: { bankDetails: bankInfo._id }, status: sellerStatus },
          { new: true },
        )
          .then(updatedSeller => {
            return res
              .status(200)
              .json(Object.assign(status.FORM_SUCCESS, { data: updatedSeller }));
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }
});

// @Route Seller send request for account Approval
router.post('/approval-request', ensureAuthentication, (req, res) => {
  var newPendingRequest = new PendingSellers({
    // email: 'johndoe@gmail.com',
    // ownerName: 'John Doe',
    // sellerId: '5e5b9fe53597de47e063a23c',
    // phoneNo: '123456789',
    // accountType: 'Individual',
    // shopName: 'John Doe Shop',
    // shopLocation: 'ABC street, XYZ city',
    // role: 'Seller',
    // verified: true,
    // emailVerified: false,
    // token: 'sSxNsM2OyCAtV9g8UWAdjYw58HsOoE',
    // status: 'pending',
    // stepsToDo: 0,
    email: req.user.email,
    ownerName: req.body.ownerName,
    sellerId: req.user.id,
    phoneNo: req.user.phoneNo,
    accountType: req.user.accountType,
    shopName: req.user.shopName,
    shopLocation: req.user.shopLocation,
    role: req.user.role,
    verified: req.user.verified,
    emailVerified: req.user.emailVerified,
    token: req.user.token,
    status: 'pending',
    stepsToDo: req.user.stepsToDo,
  });

  new PendingSellers(newPendingRequest)
    .save()
    .then(approval => {
      Seller.findOneAndUpdate(
        // { _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') },
        { _id: mongoose.Types.ObjectId(req.user.id) },
        { status: 'pending' },
        { new: true },
      )
        .then(updatedSeller => {
          return res.status(200).json(Object.assign(status.FORM_SUCCESS, { data: updatedSeller }));
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
});

// @Route Get Seller Recent Address
router.get('/recent-address', ensureAuthentication, (req, res) => {
  // Seller.findOne({ _id: mongoose.Types.ObjectId('5e5b9fe53597de47e063a23c') })
  Seller.findOne({ _id: req.user.id })
    .populate('sellerAddresses')
    .then(seller => res.json(seller));
});

// @Route Get Orders of particular Seller
router.get('/seller-orders', (req, res) => {
  const sellerId = req.query.sellerId;

  const schema = {
    sellerId: joi.string().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.SELLER_ORDERS_FAILED, { data: errors.error }));
  } else {
    Order.aggregate([
      { $match: { 'product.sellerId': mongoose.Types.ObjectId(sellerId) } },
      {
        $lookup: {
          from: Buyer.collection.name,
          localField: 'buyerId',
          foreignField: '_id',
          as: 'buyer',
        },
      },
      { $unwind: '$buyer' },
      {
        $lookup: {
          from: BuyerAddress.collection.name,
          localField: 'addressId',
          foreignField: '_id',
          as: 'address',
        },
      },
      { $unwind: '$address' },
    ])
      .then(orders => {
        if (orders.length < 1) return res.json(status.SELLER_ORDERS_FAILED_1);

        for (let i in orders) {
          for (let j in orders[i].product) {
            if (orders[i].product[j].sellerId.toString() !== req.query.sellerId.toString()) {
              orders[i].product.splice(j, 1);
            }
          }
        }
        res.status(200).json(orders);
      })
      .catch(err => res.json(err));
  }
});

// @Route Get Buyer/Customer Information
router.get('/buyer-info', (req, res) => {
  const buyerId = req.query.buyerId;

  const schema = {
    buyerId: joi.string().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.CUSTOMER_FAILED, { data: errors.error }));
  } else {
    Buyer.findOne({ _id: buyerId })
      .then(customer => {
        if (!customer) return res.json(status.CUSTOMER_INFO_FAILED_1);
        res.json(customer);
      })
      .catch(err => res.json(err));
  }
});

// @Route Get Buyer/Customer Address
router.get('/buyer-address', (req, res) => {
  const buyerId = req.query.buyerId;

  const schema = {
    buyerId: joi.string().required(),
  };

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.CUSTOMER_FAILED, { data: errors.error }));
  } else {
    BuyerAddress.findOne({ buyerId })
      .then(customer => {
        if (!customer) return res.json(status.CUSTOMER_ADDRESS_FAILED);
        res.json(customer);
      })
      .catch(err => res.json(err));
  }
});

// @Route Get Seller Product
router.get('/seller-product', (req, res) => {
  const productId = req.query.productId;
  const productArray = req.query.productArray;

  const schema = joi.alternatives().try(
    {
      productId: joi.string(),
      productArray: joi.array().required(),
    },
    {
      productId: joi.string().required(),
      productArray: joi.array(),
    },
  );

  let errors = joi.validate(req.query, schema);
  if (errors.error) {
    return res.json(Object.assign(status.SELLER_PRODUCT_FAILED, { data: errors.error }));
  } else {
    if (productArray) {
      if (productArray.length > 0) {
        Product.find({ _id: { $in: [...productArray] } })
          .then(products => {
            res.json(products);
          })
          .catch(err => res.json(err));
      }
    } else {
      Product.findOne({ _id: productId })
        .then(product => {
          if (!product) return res.json(status.SELLER_PRODUCT_FAILED_1);
          res.json([product]);
        })
        .catch(err => res.json(err));
    }
  }
});

// @Route Get All Seller
router.get('/all-sellers', (req, res) => {
  Seller.find({})
    .then(seller => res.json(seller))
    .catch(err => console.log(err));
});

// @Route Get All Orders
router.get('/all-orders', (req, res) => {
  Order.find({})
    .then(orders => res.json(orders))
    .catch(err => console.log(err));
});

// @Route Get Seller Rank
router.get('/seller-rank', (req, res) => {
  const id = req.query.sellerId;

  Promise.all([Seller.find({ _id: id }), SellerReview.find({})])
    .then(([seller, sellerReviews]) => {
      let sellerRank,
        allSellerRatings = [];
      for (let i in sellerReviews) {
        if (
          allSellerRatings.some(item => item.id.toString() === sellerReviews[i].sellerId.toString())
        ) {
          for (let k in allSellerRatings) {
            if (allSellerRatings[k].id.toString() === sellerReviews[i].sellerId.toString()) {
              allSellerRatings[k].ratings += sellerReviews[i].ratings;
              allSellerRatings[k].instance++;
            }
          }
        } else {
          allSellerRatings.push({
            id: sellerReviews[i].sellerId,
            ratings: sellerReviews[i].ratings,
            instance: 1,
            avgRatings: 0,
            rank: null,
          });
        }
      }

      for (let i in allSellerRatings) {
        let ratings = +allSellerRatings[i].ratings;
        let instance = +allSellerRatings[i].instance;
        allSellerRatings[i].avgRatings = ratings / instance;
      }

      allSellerRatings.sort((a, b) => parseFloat(b.avgRatings) - parseFloat(a.avgRatings));

      for (let i in allSellerRatings) {
        allSellerRatings[i].rank = ++i;
      }

      for (let i in allSellerRatings) {
        if (allSellerRatings[i].id.toString() === id.toString()) {
          sellerRank = allSellerRatings[i].rank;
        }
      }

      if (sellerRank) {
        seller[0].rank = sellerRank;
      } else {
        seller[0].rank = 0;
      }

      return res.json(seller[0]);
    })
    .catch(err => res.json(err));
});

module.exports = router;
