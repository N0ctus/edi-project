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

usersRouter.post('/new', passport.authenticate('jwt', { session: false }), (req, res) => {
  if ((req?.user as any).admin) {
    // res.send(req.body);
    // UserModel.register({ username: 'lucid', active: false , admin: false} as any, 'geko')
  } else {
    res.status(403).send('Action forbidden, you are not an admin!');
  }
  res.json(req.body);
});

export default usersRouter;