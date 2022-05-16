import { Router } from "express";
import { sign } from 'jsonwebtoken';
import passport from "passport";
import UserModel from '../models/user';
import dotenv from 'dotenv';
import { ExtractJwt, Strategy } from 'passport-jwt';

const TOKEN_EXPIRATION = 60 * 60 * 8;

dotenv.config({
    path: `${__dirname}/../../.env`
});

passport.use(UserModel.createStrategy());

passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: `${process.env["SECRET"]}`
},
    async (jwtPayload, callback) => {
        return UserModel.findById(jwtPayload._id)
            .then(user => {
                return callback(null, user);
            })
            .catch(err => {
                return callback(err, jwtPayload);
            });
    }
));

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
                expiresIn: TOKEN_EXPIRATION,
            });
            return res.json({ user, token, expiresIn: TOKEN_EXPIRATION });
        });
    })(req, res);
});

export default authRouter;
