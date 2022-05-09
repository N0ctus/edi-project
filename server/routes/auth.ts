import { Router } from "express";
import { sign } from 'jsonwebtoken';
import passport from "passport";
import UserModel from './../user';
import dotenv from 'dotenv';

dotenv.config({
    path: `${__dirname}/../../.env`
});

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());


const authRouter = Router();

authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        console.log(err, user)
        if (err || !user) {
            return res.status(403).json({
                message: 'Forbidden',
                user: user
            });
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err);
            }
            const token = sign(user.toJSON(), `${process.env["SECRET"]}`, {
                expiresIn: 120,
            });
            return res.json({ user, token, expiresIn: 120 });
        });
    })(req, res);
});

export default authRouter;
