require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const app = express();

const mongoose = require('mongoose');

mongoose.connect(
  'mongodb+srv://admin:Blogapi0897@cluster0.qtjnp4j.mongodb.net/blog_api?retryWrites=true&w=majority&appName=Cluster0'
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongo connection error'));

require('./config/passport')(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/', usersRouter);

module.exports = app;
