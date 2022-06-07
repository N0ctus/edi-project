import { Router } from "express";
import passport from "passport";
import { Connection } from "./../models/Connections.schema";
import { Entity } from "./../models/Entities.schema";
import { Partner } from "./../models/Partners.schema";
import { Transaction } from "./../models/transactions.schema";

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
  ], function(err, result) {
      if (err) {
          console.log(err);
      } else {
        res.send(result);
      }
  });
/*
    query.exec((err, someValue) => {
        res.send(someValue);
    }); */
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