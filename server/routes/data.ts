import { Router } from "express";
import passport from "passport";
import { Connection } from "../models/Connections.schema";
import { Entity } from "../models/Entities.schema";
import { Partner } from "../models/Partners.schema";
import { Transaction } from "../models/transactions.schema";

const dataRouter = Router();

dataRouter.get('/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
    Connection.find({}, (err, item) => {
        const connectionsMap = {};

        item.forEach((item) => {
          connectionsMap[item._id] = item;
        });

        res.send(connectionsMap);
      });
});

dataRouter.get('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
    Transaction.find({}, (err, item) => {
        const transactionsMap = {};

        item.forEach((item) => {
          transactionsMap[item._id] = item;
        });

        res.send(transactionsMap);
      });
});

dataRouter.get('/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
    Entity.find({}, (err, item) => {
        const entitiesMap = {};

        item.forEach((item) => {
          entitiesMap[item._id] = item;
        });

        res.send(entitiesMap);
      });
});

dataRouter.get('/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
    Partner.find({}, (err, item) => {
        const partnersMap = {};

        item.forEach((item) => {
          partnersMap[item._id] = item;
        });

        res.send(partnersMap);
      });
});

export default dataRouter;