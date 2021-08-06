const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const expressValidator = require('express-validator');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const jwtStrategy = passportJWT.Strategy;
const session = require('express-session');
const extractJwt = passportJWT.ExtractJwt;
const mongoose = require('mongoose');

//const db = require('./keys').mongoURI;

//mongoose.connect('mongodb+srv://hassanqshi:hassan123@cluster0-xtw0h.mongodb.net/lashcart?retryWrites=true', { useNewUrlParser: true });

// SS-CHANGE
//mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.connect('mongodb://127.0.0.1:27017/lashcart', {
//   useNewUrlParser: true
// });

// mongoose.connect('mongodb://node-react-starter-db/node-react-starter-db', {
//   useNewUrlParser: true
// });

mongoose.connect('mongodb+srv://shahryar:ItsAll.007.AboutWork@cluster0.qfwgy.mongodb.net/lashcart?retryWrites=true&w=majority', {
  useNewUrlParser: true
});


//mongodb://node-react-starter-db/node-react-starter-db

const connection = mongoose.connection;
connection.once('open', function() {
  console.log('Connection Extablished with MongoDB');
});

// mongoose.connect('mongodb://127.0.0.1:27017/lashcart', {
//   useNewUrlParser: true
// });
/*
const opt={
    jwtFromRequest:extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.SECRET_OR_KEY
}
const strategy=new jwtStrategy(opt,(payload,next)=>{
    const user=User;
    next(null,user);
});
passport.use(strategy);*/
console.log('app.all');
app.all('*', function(req, res, next) {
  //SS-CHANGED
  //'http://localhost:3000';
  
  console.log('app.all : ORIGIN  ' + req.headers.origin);

  // res.header('Access-Control-Allow-Origin', '*');
  // res.header(
  //   'Access-Control-Allow-Origin',
  //   'http://seller.lashcart.com.au'
  // );

  //  res.header(
  //   'Access-Control-Allow-Origin',
  //   'http://ec2-3-6-36-149.ap-south-1.compute.amazonaws.com'
  // );

  //res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
  res.header('Access-Control-Allow-Origin', 'https://shrouded-gorge-98113.herokuapp.com/');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
console.log('app.use');
app.use(function(req, res, next) {
  //SS-CHANGED
  console.log('app.use : ORIGIN  ' + req.headers.origin);
  res.header('Access-Control-Allow-Origin', '*');
  
  // res.header(
  //   'Access-Control-Allow-Origin',
  //   'http://seller.lashcart.com.au'
  // );

  
  // res.header(
  //   'Access-Control-Allow-Origin',
  //   'http://ec2-3-6-36-149.ap-south-1.compute.amazonaws.com'
  // );

   //res.header('Access-Control-Allow-Origin', 'http://localhost:3002');
   res.header('Access-Control-Allow-Origin', '   https://shrouded-gorge-98113.herokuapp.com/');

  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

//routes
console.log('app.routes');
const admin = require('./routes/admin');
const seller = require('./routes/seller');
const buyer = require('./routes/buyer');
const preReg = require('./routes/preregistration');

console.log('app.use Again');
app.use(function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//bodyparser
console.log('app.use bodyparser');
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//express session
console.log('app.user express session');
app.use(
  session({
    secret: 'secret',
    // cookie: { _expires: 60000000 }, // SS_CHANGED
    cookie: { expires: new Date(Date.now() + 3600000), maxAge: 3600000 }, // SS_CHANGED
    saveUninitialized: true,
    resave: true,
  }),
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

//Express validator
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value,
      };
    },
  }),
);

/*app.get('/api/:id', (req, res) => {
    const id = req.params.id;
    res.json({
        message: id
    })
})*/

app.use('/api/admin', admin);
app.use('/api/seller', seller);
app.use('/api/buyer', buyer);
app.use('/api/preregistration', preReg);

app.use(express.static('client/build'));

app.get('*', function(req, res) {
  console.log(path.join(__dirname, 'clients/lashcart/build/', 'index.html'));
  res.sendFile(path.join(__dirname, 'client/build/', 'index.html'));
});
// app.post('/abc', function (req, res) {

//  //   console.log(path.join(__dirname, 'clients/lashcart/build/', 'index.html'));
//     console.log(req);
//     res.send("hello");
// });

//  //   console.log(path.join(__dirname, 'clients/lashcart/build/', 'index.html'));
//     console.log(req);
//     res.send("hello");
// });

const port = process.env.PORT || 8080;
//const port = 3002;
app.listen(port, () => {
  //SS-CHANGED
  //process.env.NODE_ENV = 'dev';
  // value of NODE_ENV fetch from .env File
  console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);

  console.log(`Listening on port ${port}`);
});
