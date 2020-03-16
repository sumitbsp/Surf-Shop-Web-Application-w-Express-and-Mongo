require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const logger = require('morgan');
const User = require('./models/user');

const indexRouter = require('./routes/index');
const reviewsRouter = require('./routes/reviews');
const postsRouter = require('./routes/posts');

const app = express();

//connect to the database
mongoose.connect('mongodb://localhost:27017/surf-shop', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!");
});

// use ejs locals for templates
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// set public assets
app.use(express.static('public'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));



// configure passport and sessions
app.use(session({
  secret: 'hang ten dude',
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//set local variables middleware
app.use(function(req, res, next) {
  //set default page title
  res.locals.title = 'Surf-Shop'
  // set success flash message
  res.locals.success = req.session.success || '';
  delete req.session.success;
  //set error flash message
  res.locals.error = req.session.error || '';
  delete req.session.error;
  next();
})

// Mount routes
app.use('/', indexRouter);
app.use('/posts/:id/reviews', reviewsRouter);
app.use('/posts', postsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.status(err.status || 500);
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});



module.exports = app;
