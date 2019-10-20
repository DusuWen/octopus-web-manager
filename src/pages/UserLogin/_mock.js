function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}

export default {
  'POST  /user/login': (req, res) => {
    const { password, userName, type } = req.body;

    if (password === 'admin123.' && userName === 'admin') {
      res.send({
        code: 200,
        type,
        currentAuthority: 'admin',
      });
      return;
    }

    if (password === 'guest123.' && userName === 'guest') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }

    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
