const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.get('/signin', (req, res) => {
  res.render('signin');
});
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  console.log(res.locals);
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    return res.cookie("token", token).redirect('/',);
  } catch (err) {
    return res.render('signin', {
      error: 'Incorrect email or password'
    })
  }
});
router.post('/signup', async (req, res) => {
  const { fullName, email, password } = req.body;
  User.create({
    fullName,
    email,
    password
  });
  res.redirect('/user/signin');
});

router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/');
});

module.exports = router;