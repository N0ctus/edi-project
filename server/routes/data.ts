import { Router } from "express";
import passport from "passport";
import { Connection } from "../models/Connections";
import { Entity } from "../models/Entities";
import { Partner } from "../models/Partners";
import { Transaction } from "../models/Transactions";

const dataRouter = Router();

/** Data table endpoints */
// https://stackoverflow.com/questions/53518160/ag-grid-server-side-pagination-filter-sort-data
dataRouter.get('/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const query = Connection.find({}).skip(start).limit(limit);
  query.exec((err, item) => {
    const connectionsMap = {};

    item.forEach((item) => {
      connectionsMap[item._id] = item;
    });

    res.send(Object.values(connectionsMap));
  });
});

dataRouter.get('/connections/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  const query = Connection.count({});
  query.exec((err, count) => {
    res.send({ count });
  });
});

dataRouter.get('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const query = Transaction.find({}).skip(start).limit(limit);
  query.exec((err, item) => {
    const transactionsMap = {};

    item.forEach((item) => {
      transactionsMap[item._id] = item;
    });

    res.send(Object.values(transactionsMap));
  });
});

dataRouter.get('/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const query = Entity.find({}).skip(start).limit(limit);
  query.exec((err, item) => {
    const entityMap = {};

    item.forEach((item) => {
      entityMap[item._id] = item;
    });

    res.send(Object.values(entityMap));
  });
});

dataRouter.get('/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const query = Partner.find({}).skip(start).limit(limit);
  query.exec((err, item) => {
    const entitiesMap = {};

    item.forEach((item) => {
      entitiesMap[item._id] = item;
    });

    res.send(Object.values(entitiesMap));
  });
});

/** Chart endpoints */

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

/** Stats/progress bars endpoints */

dataRouter.get('/partners/top-owners', passport.authenticate('jwt', { session: false }), (req, res) => {
  Partner.count({}, (err, count) => {
    Partner.aggregate([
      {
        '$match': {
          clientType: 'own'
        }
      },
      {
        $group: {
          _id: {
            clientName: "$clientName",
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

dataRouter.get('/partners/top-customers', passport.authenticate('jwt', { session: false }), (req, res) => {
  Partner.count({}, (err, count) => {
    Partner.aggregate([
      {
        '$match': {
          clientType: 'partner'
        }
      },
      {
        $group: {
          _id: {
            clientName: "$clientName",
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


export default dataRouter;