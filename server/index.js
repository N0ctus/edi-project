const MongoClient = require('mongodb').MongoClient;
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const { Strategy } = require('passport-openidconnect');
require('dotenv').config({
  path: `${__dirname}\\..\\.env`
});

MongoClient.connect(`${process.env.DB_CONNECT}/edi_db`, (err, client) => {
  if (err) throw err

  const db = client.db('edi_db')

  db.collection('edi_db').find().toArray((err, result) => {
    if (err) throw err

    console.log(`aaa`, result)
  })
});

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(session({
  secret: 'MyVoiceIsMyPassportVerifyMe',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// set up passport
passport.use('oidc', new Strategy({
  issuer: process.env.ISSUER,
  authorizationURL: process.env.AUTHORIZATION_URL,
  tokenURL: process.env.TOKEN_URL,
  userInfoURL: process.env.USER_INFO_URL,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:8080/authorization-code/callback',
  scope: 'openid profile'
}, (issuer, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((obj, next) => {
  next(null, obj);
});

const port = process.env.PORT || 8080;

app.use('/login', passport.authenticate('oidc'));

app.use('/authorization-code/callback',
  passport.authenticate('oidc', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.use('/profile', ensureLoggedIn, (req, res) => {
  res.render('profile.ejs', { title: 'Profile', user: req.user });
});

app.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login')
}

app.get('/', function(req, res) {
  res.render('index.ejs', { title: 'Home' });
});

app.listen(port);
console.log(`Server started at ${process.env.LISTEN_URL}:${port}`);