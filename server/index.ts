import express from "express";
import bodyParser from 'body-parser';
import session from "express-session";
import passport from "passport";
import dotenv from 'dotenv';
import fileUpload from "express-fileupload";
import cors from 'cors';

import authRouter from "./routes/auth";
import usersRouter from "./routes/users";
import uploadRouter from "./routes/upload";
import dataRouter from "./routes/data";

dotenv.config({
  path: `${__dirname}/../.env`
});

const app = express();

app.use(express.json());

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
app.use('/data', dataRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started at ${process.env.LISTEN_URL}:${port}`);
});