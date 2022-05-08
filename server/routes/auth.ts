import { Router } from "express";
import { sign } from 'jsonwebtoken';
import passport from "passport";
import UserModel from './../user';

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
            // generate a signed son web token with the contents of user object and return it in the response
            const token = sign(user.toJSON(), 'your_jwt_secret');
            return res.json({ user, token });
        });
    })(req, res);
});

export default authRouter;
