var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const layouts = require('express-ejs-layouts');

// 선언 추가
const coronaKey = 'gS9%2Fg7TGU2ycNJmvCRBkL%2F%2FGW%2BO%2B2qLz64HxeAkRsfDkc7tddS8J7LufAm7qFTrlZl0D3cIPjHv2q7IASZHI3Q%3D%3D';
const cron = '*/10 * * * *'; // 스케줄러 반복 시간 CRON (현재 10분마다 실행)
const smsKey = 'TPBNqjiytIA27IhRh7i4vjv6ezbtaOBtKP%2Fbs3VHwL2%2FkgMkmuNDPY50qFbpHr3oSVWlxg3r9BUhXW2Xpyh1Ew%3D%3D';
const smsCron = '*/3 * * * *'; // 스케줄러 반복 시간 CRON (현재 4분마다 실행 API가3분이후)
var mongodb = require('./mongoDB/mongo');
var schedule = require('./service/scheduleService');
var scheduleSMS = require('./service/scheduleServiceSMS');
var coronaInit = require('./service/coronaInitService');
var passport = require('passport');
var passportConfig = require('./service/passport');
var session = require('express-session');
var flash = require('connect-flash');
var methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardsRouter = require('./routes/boards');
var navRouter = require('./routes/nav');
var replyRouter = require('./routes/replys');
var covidRouter = require('./routes/covid');
var fileRouter = require('./routes/file');
var mailRouter = require('./routes/mail');

var app = express();
app.use(layouts);

//socket
const chatDb = require('./mongoDB/chatMongo');
let a = 0; //익명카운트 
app.io = require('socket.io')();
//소켓 셋팅
app.io.on('connection', function(socket){
     socket.on('login', async (tempdata)=>{  // 최초 접속시 ejs에서 login 호출
        let userName = tempdata    // 로그인 되어있는지 확인
        chatDb.chatList().then(function(result){    // 몽고디비서 상위 100개 대화 호출
            result.forEach(item =>{   //결과 반복문으로 채팅창 삽입
                if(userName == item.name)    //나한테만 보이는 메세지 
                    app.io.to(socket.id).emit('Mmessage', item.msg);    // 내 메세지 표시   
                else 
                    app.io.to(socket.id).emit('Omessage', item.name, item.msg);   //다른사람 메세지 표시
              });
            if(userName=='')
                userName = "익명" + a++;     //로그인 안되있으명 익명으로 표시
            socket.name = userName;
            app.io.to(socket.id).emit('create name', userName);     // 이름 설정 emit
        });
    });       //socket.emit 하면 자신한테만 전송,  app.io.to().emit하면 특정인,  socket.broadcast는 자기빼고 전부 전송
    console.log("a user connected");
      
    socket.on('disconnect', function(){
        console.log('user disconnected');   //연결끊김
    });     
    socket.on('message', (name, msg) =>{   //메세지 전송 시 호출
        tempname = name;
        socket.emit('Mmessage', msg);   // 나한테만 보이는 메세지
        socket.broadcast.emit('Omessage', name, msg);  // 나말고 전체에게 보이는 메세지
        chatDb.chatInsert([{'name' : name, 'msg' : msg}]);   // 대화내역 DB삽입
    });
  });


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
app.use('/uploads', express.static('public/uploads'));
app.use('/node_modules', express.static(path.join(__dirname, '/node_modules')));

// 실행 추가
mongodb();
app.use(
    session({
        secret: 'secret_key',       // session 비밀키
        resave: false,
        saveUninitialized: true,
        cookie: {            
            maxAge: 24000 * 60 * 60 // 하루 유지
        }
    })
);
app.use(flash());                   // 에러 메시지 전달을 위해 사용
app.use(passport.initialize());
app.use(passport.session());
passportConfig();                   // passoport service 이용
schedule(coronaKey, cron);          // covid API 스케줄러
scheduleSMS(smsKey, smsCron);       // 
coronaInit(coronaKey);              // 서버 첫 구동 DB초기화
app.use(methodOverride('_method'))  // put, delete등 메소드 형식을 form으로 사용하기 위한 매핑

// 로그인 정보 - 페이지 전환 시 마다 passport로 인증한 값을 locals에 저장하여 같이 데이터 전송
app.use((req, res, next) => {
    if (req.user) res.locals.loginUser = req.user;
    else res.locals.loginUser = undefined;
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/boards', boardsRouter);
app.use('/nav', navRouter);
app.use('/reply', replyRouter);
app.use('/covid', covidRouter);
app.use('/file', fileRouter);
app.use('/mail', mailRouter);

//
//
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