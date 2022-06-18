import { Router } from "express";
import passport from "passport";
import { Connection } from "../models/Connections";
import { Entity } from "../models/Entities";
import { Partner } from "../models/Partners";
import { Transaction } from "../models/Transactions";

const json2csv = require('json2csv').parse;

const dataRouter = Router();

Connection.syncIndexes();
Transaction.syncIndexes({ '$**' : 'text' });
Partner.syncIndexes();
Entity.syncIndexes();

/** Data table endpoints */
// https://stackoverflow.com/questions/53518160/ag-grid-server-side-pagination-filter-sort-data

dataRouter.get('/connections/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  const q = req.query.q;

  const query = Connection.find({});
  query.exec((err, items) => {
    const connectionsMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            connectionsMap[item._id] = item;
          }
        }
      } else {
        connectionsMap[item._id] = item;
      }
    });

    res.send({ count: Object.values(connectionsMap).length });
  });
});

dataRouter.get('/transactions/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  const q = req.query.q;

  if (!q) {
    const query = Transaction.count({});
    query.exec((err, count) => {
      res.send({ count });
    });
  } else {
    /* const query = Transaction.find({});
    query.exec((err, items) => {
      const transactionsMap = {};

      items.forEach((item) => {
        if (q) {
          const regx = new RegExp(q as string);
          for (const key in item) {
            if (regx.test(item[key])) {
              transactionsMap[item._id] = item;
            }
          }
        } else {
          transactionsMap[item._id] = item;
        }
      });

      res.send({ count: Object.values(transactionsMap).length });
    }); */
    const query = Transaction.find({ $text: { $search: q as string } }).count();
    query.exec((err, count) => {
      res.send({ count });
    });
  }
});

dataRouter.get('/entities/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  const q = req.query.q;

  const query = Entity.find({});
  query.exec((err, items) => {
    const entitiesMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            entitiesMap[item._id] = item;
          }
        }
      } else {
        entitiesMap[item._id] = item;
      }
    });

    res.send({ count: Object.values(entitiesMap).length });
  });
});

dataRouter.get('/partners/count', passport.authenticate('jwt', { session: false }), (req, res) => {
  const q = req.query.q;

  const query = Partner.find({});
  query.exec((err, items) => {
    const partnersMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            partnersMap[item._id] = item;
          }
        }
      } else {
        partnersMap[item._id] = item;
      }
    });

    res.send({ count: Object.values(partnersMap).length });
  });
});

dataRouter.get('/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const q = req.query.q;

  const query = Connection.find({}).skip(start).limit(limit);
  query.exec((err, items) => {
    const connectionsMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            connectionsMap[item._id] = item;
          }
        }
      } else {
        connectionsMap[item._id] = item;
      }
    });

    res.send(Object.values(connectionsMap));
  });
});

dataRouter.get('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const q = req.query.q;

  let query;

  if (q) {
    const regx = new RegExp(q as string);
    console.log(`${q}`)
    query = Transaction.find({ $text: { $search: `${q}` } }).skip(start).limit(limit);
  } else {
    query = Transaction.find({}).skip(start).limit(limit);
  }

  query.exec((err, items) => {
    const transactionsMap = {};

    items.forEach((item) => {
      transactionsMap[item._id] = item;
    });

    res.send(Object.values(transactionsMap));
  });
});

dataRouter.get('/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const q = req.query.q;

  const query = Entity.find({}).skip(start).limit(limit);
  query.exec((err, items) => {
    const entityMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            entityMap[item._id] = item;
          }
        }
      } else {
        entityMap[item._id] = item;
      }
    });

    res.send(Object.values(entityMap));
  });
});

dataRouter.get('/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  const start = parseInt(req.query.start as string);
  const limit = parseInt(req.query.limit as string);
  const q = req.query.q;

  const query = Partner.find({}).skip(start).limit(limit);
  query.exec((err, items) => {
    const partnersMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            partnersMap[item._id] = item;
          }
        }
      } else {
        partnersMap[item._id] = item;
      }
    });

    res.send(Object.values(partnersMap));
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

dataRouter.get('/connections/download', passport.authenticate('jwt', { session: false }), (req, res) => {

  const q = req.query.q;

  const query = Connection.find({});
  query.exec((err, items) => {
    const connectionsMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            connectionsMap[item._id] = item;
          }
        }
      } else {
        connectionsMap[item._id] = item;
      }
    });

    let arrayOfItems = Object.values(connectionsMap);
    arrayOfItems = arrayOfItems.map((el: any) => el.toJSON());

    const csvString = json2csv(arrayOfItems);
    res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  });
});

dataRouter.get('/transactions/download', passport.authenticate('jwt', { session: false }), (req, res) => {

  const q = req.query.q;

  const query = Transaction.find({}).select('-_id -__v');
  query.exec((err, items) => {
    const transactionsMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            transactionsMap[item._id] = item;
          }
        }
      } else {
        transactionsMap[item._id] = item;
      }
    });

    let arrayOfItems = Object.values(transactionsMap);
    arrayOfItems = arrayOfItems.map((el: any) => el.toJSON());

    const csvString = json2csv(arrayOfItems);
    res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  });
});

dataRouter.get('/entities/download', passport.authenticate('jwt', { session: false }), (req, res) => {

  const q = req.query.q;

  const query = Entity.find({}).select('-_id -__v');
  query.exec((err, items) => {
    const entitiesMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            entitiesMap[item._id] = item;
          }
        }
      } else {
        entitiesMap[item._id] = item;
      }
    });

    let arrayOfItems = Object.values(entitiesMap);
    arrayOfItems = arrayOfItems.map((el: any) => el.toJSON());

    const csvString = json2csv(arrayOfItems);
    res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  });
});

dataRouter.get('/partners/download', passport.authenticate('jwt', { session: false }), (req, res) => {

  const q = req.query.q;

  const query = Partner.find({}).select('-_id -__v');
  query.exec((err, items) => {
    const partnersMap = {};

    items.forEach((item) => {
      if (q) {
        const regx = new RegExp(q as string);
        for (const key in item) {
          if (regx.test(item[key])) {
            partnersMap[item._id] = item;
          }
        }
      } else {
        partnersMap[item._id] = item;
      }
    });

    let arrayOfItems = Object.values(partnersMap);
    arrayOfItems = arrayOfItems.map((el: any) => el.toJSON());

    const csvString = json2csv(arrayOfItems);
    res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
    res.set('Content-Type', 'text/csv');
    res.status(200).send(csvString);
  });
});



export default dataRouter;