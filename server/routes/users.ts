import { Router } from "express";
import passport from "passport";

const usersRouter = Router();

usersRouter.get('/test', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send('users works :)')
});

export default usersRouter;