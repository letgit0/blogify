require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const { checkForAuthenticationCookie } = require('./middlewares/authentication');
const Blog = require('./models/Blog');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog'); 

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/blogify";

mongoose.connect(MONGODB_URL).then(() => {
  console.log('Connected to MongoDB');
}
).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

app.set('view engine', 'ejs');
app.set('views',path.resolve('./views'));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));
app.use(express.static(path.join(__dirname, "public")));

// app.use((req, res, next) => {
//   res.locals.token = req.cookies.token || null;
//   next();
// });

app.get('/', async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render('home',{
    user: req.user,
    blogs: allBlogs
  });
});

app.use('/user', userRoutes);
app.use('/blog', blogRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});