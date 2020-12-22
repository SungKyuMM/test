// 로그인 인증 된 사용자인지 확인

module.exports = {
  user: (req, res, next) => {     // 회원 권한 인증
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');       // 인증 불과 시 url
  }, 

  admin: (req, res, next) => {    // 관리자 권한 인증
    if (req.isAuthenticated() && req.user.authority == 'ADMIN')
      return next();
    res.redirect('/login');
  }
};
