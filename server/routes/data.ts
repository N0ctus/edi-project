import { Router } from "express";
import passport from "passport";
import { Connection } from "../models/Connections";
import { Entity } from "../models/Entities";
import { Partner } from "../models/Partners";
import { Transaction } from "../models/Transactions";

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

dataRouter.get('/connections/chart-data', passport.authenticate('jwt', { session: false }), (req, res) => {
  //query with mongoose
  // const query = Transaction.find({}).select('transactionType startTime -_id');
  const query = Connection.aggregate([
    {
      $group: {
        _id: {
          connectionType: "$connectionType",
        },
        count: { $sum: 1 }
      }
    }
  ], (err, result) => {
    if (err) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }
  });
});

dataRouter.get('/transactions/chart-data', passport.authenticate('jwt', { session: false }), (req, res) => {
  //query with mongoose
  // const query = Transaction.find({}).select('transactionType startTime -_id');
  const query = Transaction.aggregate([
    {
      "$addFields": {
        "date": {
          "$dateFromString": {
            "dateString": "$startTime"
          }
        },
      }
    },
    {
      $group: {
        _id: {
          dayOfYear: { "$dayOfYear": "$date" },
          transactionType: "$transactionType",
        },
        count: { $sum: 1 }
      }
    }
  ], (err, result) => {
    if (err) {
      res.status(500).send(result);
    } else {
      res.send(result);
    }
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