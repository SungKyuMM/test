// 로그인 인증 된 사용자인지 확인

module.exports = {
  user: (req, res, next) => {
    if (req.isAuthenticated())
      return next();
    res.redirect('/login');
  }, 

  admin: (req, res, next) => {
    if (req.isAuthenticated() && req.user.authority == 'ADMIN')
      return next();
    res.redirect('/login');
  }
};
