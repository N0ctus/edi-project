import express from "express";
import passport from "passport";
import path from "path";
import session from "express-session";
import { Strategy } from "passport-openidconnect";
import "./mongodb";
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}\\..\\.env`
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
  callbackURL: process.env.CALLBACK_URL,
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
  req.session.destroy(() => {
    res.redirect('/');
  });
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