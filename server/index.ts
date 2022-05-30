import express from "express";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import cors from 'cors';
import authRouter from "./routes/auth";
import dotenv from 'dotenv';
import usersRouter from "./routes/users";
import fileUpload from "express-fileupload";
import uploadRouter from "./routes/upload";

dotenv.config({
  path: `${__dirname}/../.env`
});

const app = express();

app.use(fileUpload({
  limits: { fileSize: 500 * 1024 * 1024 },
}));

// Configure Sessions Middleware
app.use(session({
  secret: `${process.env["DB_CONNECT"]}`,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure More Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/csv', uploadRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at ${process.env.LISTEN_URL}:${port}`);
});