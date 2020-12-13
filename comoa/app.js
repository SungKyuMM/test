var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// 선언 추가
const coronaKey = 'gS9%2Fg7TGU2ycNJmvCRBkL%2F%2FGW%2BO%2B2qLz64HxeAkRsfDkc7tddS8J7LufAm7qFTrlZl0D3cIPjHv2q7IASZHI3Q%3D%3D';
const cron = '* * * * *';   // 스케줄러 반복 시간 CRON (현재 1분마다 실행)
var mongodb = require('./mongoDB/mongo');
var schedule = require('./service/scheduleService');
var coronaInit = require('./service/coronaInitService');
var passport = require('passport');
var passportConfig = require('./service/passport');
var session = require('express-session');
var flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var testRouter = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 가상 경로
app.use('/css', express.static('public/stylesheets'));
app.use('/js', express.static('public/javascripts'));

// 실행 추가
mongodb();
app.use(
  session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
      // 하루 유지
      maxAge: 24000 * 60 * 60
    }
  }
));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passportConfig();
schedule(coronaKey, cron);
coronaInit(coronaKey);

// 로그인 정보 - 페이지 전환 시 마다 passport로 인증한 값을 locals에 저장하여 같이 데이터 전송
app.use((req, res, next) => {
  if(req.user) res.locals.loginUser = req.user;
  else res.locals.loginUser = undefined;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/test', testRouter);

// catch 404 and forward to error handler
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

module.exports = app;
