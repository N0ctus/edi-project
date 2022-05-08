const express = require('express'); // server software
const bodyParser = require('body-parser'); // parser middleware
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const cors = require('cors');

const userData = require('./user.ts'); // User Model

const app = express();

// Configure Sessions Middleware
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

console.log(userData);

// Passport Local Strategy
passport.use(userData.createStrategy());

// To use with sessions
passport.serializeUser(userData.serializeUser());
passport.deserializeUser(userData.deserializeUser());

app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID}
   and your session expires in ${req.session.cookie.maxAge}
   milliseconds.<br><br>
   <a href="/logout">Log Out</a><br><br>
   <a href="/secret">Members Only</a>`);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.json('ok')
});

app.post('/login', passport.authenticate('local'),  function(req, res) {
  console.log(req.user)
  res.json(req.user)
});

app.get('/esseh', (req, res) => {
  console.log('esseh');
  res.json('esseh');
});

const port = 3000;
app.listen(port, () => console.log(`This app is listening on port ${port}`));