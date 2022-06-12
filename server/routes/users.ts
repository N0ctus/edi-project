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
    if (validateUserInfo(req.body)) {
      const job = UserModel.register({ username: req.body.username, active: true, admin: !!req.body.isAdmin ? false : true } as any, req.body.password);
      job
        .then(() => res.status(200).send(req.body))
        .catch(() => res.status(500).send({ message: 'Error saving the user info.' }));
    } else {
      res.status(403).send('Invalid request');
    }
  } else {
    res.status(403).send('Action forbidden, you are not an admin!');
  }
});

usersRouter.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  if ((req?.user as any).admin) {
    const userToDelete = await UserModel.findById(req.params.id);
    if (userToDelete) {
      UserModel.findByIdAndDelete(req.params.id)
        .then(() => res.status(200).send({ message: 'The user has been successfully deleted.' }))
        .catch(() => res.status(500).send({ message: 'Error while deleting the user.' }));
    }
  } else {
    res.status(403).send('Action forbidden, you are not an admin!');
  }
});

function validateUserInfo(user: { username: string, password: string, isAdmin: boolean }) {
  return user.username?.length > 3 && user.password?.length > 7;
}

export default usersRouter;