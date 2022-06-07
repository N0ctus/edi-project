import { Router } from "express";
import passport from "passport";
import UserModel from "./../models/user";

const usersRouter = Router();

usersRouter.get('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    UserModel.find({}, (err, users) => {
        const userMap = {};

        users.forEach((user) => {
          userMap[user._id] = user;
        });

        res.send(userMap);
      });
});

export default usersRouter;