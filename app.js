require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');

const cors = require('cors');

const app = express();

app.use(cors());

// const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGO_DB);
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'mongo connection error'));

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
