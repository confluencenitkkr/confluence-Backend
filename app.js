var createError = require('http-errors');
var express = require('express');
var path = require('path');
const ejs = require('ejs')

var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cookieSession = require("cookie-session");
const passportSetup = require("./controller/passport");
const passport = require("passport");
const authRoute = require("./routes/google");
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var cors=require("cors")

// Allow cors
app.use(cors());
// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );
app.use(
  cookieSession({ name: "sessionm", keys: ["ayush"], maxAge: 24 * 60 * 60 * 100 })
);
// app.use(function(req, res, next) {
//    res.header("Access-Control-Allow-Credentials", true);
//    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-HTTP-Method-Override");
//    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
//    next();
// });


app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRoute);
app.use(function(req, res, next) {
  next(createError(404));
});


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 4044;
app.listen(PORT, (err) => {
  if (err) return console.log("PORT ISSUE", err);
  console.log(`Server running on PORT ${PORT}`);
});

module.exports = app;
