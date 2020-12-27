require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); 
app.use(session({ 
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, 
  store: new MongoStore({ mongooseConnection: mongoose.createConnection(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true}) }),
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.searchCount = req.cookies?.searchCount; 
  if (req.cookies?.searchCount >= 5) {
    res.locals.restricted = true;
  } else {
    res.locals.restricted = false;
  }
  next();
});

app.use((req, res, next) => {
  res.locals.username = req.session?.username; 
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);


app.listen(process.env.PORT, () => {
  console.log(`Express servev started on port ${process.env.PORT}!`)
});
  
