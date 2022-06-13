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

dataRouter.get('/chart-data/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
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

dataRouter.get('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
  Transaction.find({}, (err, item) => {
    const transactionsMap = {};

    item.forEach((item) => {
      transactionsMap[item._id] = item;
    });

    res.send(transactionsMap);
  });
});

dataRouter.get('/transactions/top-entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  Transaction.count({}, (err, count) => {
    Transaction.aggregate([
      {
        $group: {
          _id: {
            entityName: "$entityName",
          },
          count: { $sum: 1 },
        },
      },
      {
        "$project": {
          totalPercent: { $multiply: ["$count", 100 / count] },
        }
      },
      { $sort: { "totalPercent": -1 } },
      { $limit: 3 },
    ], (err, result) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });
});

dataRouter.get('/chart-data/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
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

dataRouter.get('/chart-data/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  const query = Entity.aggregate([
    {
      $group: {
        _id: {
          entityClassReference: "$entityClassReference",
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

dataRouter.get('/chart-data/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
  const query = Partner.aggregate([
    {
      "$addFields": {
        "date": {
          "$dateFromString": {
            "dateString": "$created"
          }
        },
      }
    },
    {
      $group: {
        _id: {
          dayOfYear: { "$dayOfYear": "$date" },
          clientType: "$clientType",
        },
        count: { $sum: 1 }
      }
    }
  ], (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

export default dataRouter;