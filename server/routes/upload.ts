import { Router } from "express";
import passport from "passport";
import { Connection, ConnectionRawCsv, ConnectionsUtils } from "../models/Connections.schema";
import { Entity, EntityRawCsv, EntitysUtils } from "../models/Entities.schema";
import { ExpectedCSVColumns } from "../models/ExpectedCsvColumns.model";
import { Partner, PartnersRawCsv, PartnersUtils } from "../models/Partners.schema";
import { Transaction, TransactionsRawCsv, TransactionsUtils } from "../models/transactions.schema";
import { CSVToArray } from "../utils/csv-to-array";

const uploadRouter = Router();

uploadRouter.post('/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/${csvFile.name}`;

  if (csvFile?.data?.toString()) {
    const parsedCSV = CSVToArray(csvFile.data.toString());
    if (parsedCSV.length > 0 && parsedCSV[0].length === ExpectedCSVColumns.Connections) {
      // The CSV is valid
      const parsedRows: ConnectionRawCsv[] = parsedCSV.map((row, idx) => {
        if (idx > 0) {
          return ConnectionsUtils.convertRowToModel(row);
        }
      });
      parsedRows.shift();
      const schemaData = ConnectionsUtils.convertCsvToSchema(parsedRows);
      // Start mongodb write job
      const jobs = schemaData.map(item => {
        const job = new Connection(item);
        const target = Connection.findById(item._id);
        if (!target) {
          return job.save();
        } else {
          return new Promise(r => r(null));
        }
      });
      // Add copy file job
      jobs.push(csvFile.mv(uploadPath));
      // Once all data is inserted
      Promise.all(jobs).then(() => {
        res.send(JSON.stringify({ message: 'Uploaded and inserted all the data!'}));
        // Catch any err
      }).catch((e) => res.status(500).send(e));
    } else {
      res.status(400).send(`Invalid format detected, parsed columns ${parsedCSV.length}.`);
      return;
    }
  }
});

uploadRouter.post('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/${csvFile.name}`;

  if (csvFile?.data?.toString()) {
    const parsedCSV = CSVToArray(csvFile.data.toString());
    if (parsedCSV.length > 0 && parsedCSV[0].length === ExpectedCSVColumns.Transactions) {
      // The CSV is valid
      const parsedRows: TransactionsRawCsv[] = parsedCSV.map((row, idx) => {
        if (idx > 0) {
          return TransactionsUtils.convertRowToModel(row);
        }
      });
      parsedRows.shift();
      const schemaData = TransactionsUtils.convertCsvToSchema(parsedRows);
      // Start mongodb write job
      const jobs = schemaData.map(item => {
        const job = new Transaction(item);
        const target = Transaction.findById(item._id);
        if (!target) {
          return job.save();
        } else {
          return new Promise(r => r(null));
        }
      });
      // Add copy file job
      jobs.push(csvFile.mv(uploadPath));
      // Once all data is inserted
      Promise.all(jobs).then(() => {
        res.send(JSON.stringify({ message: 'Uploaded and inserted all the data!'}));
        // Catch any err
      }).catch((e) => res.status(500).send(e));
    } else {
      res.status(400).send(`Invalid format detected, parsed columns ${parsedCSV.length}.`);
      return;
    }
  }
});

uploadRouter.post('/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/${csvFile.name}`;

  if (csvFile?.data?.toString()) {
    const parsedCSV = CSVToArray(csvFile.data.toString());
    if (parsedCSV.length > 0 && parsedCSV[0].length === ExpectedCSVColumns.Partners) {
      // The CSV is valid
      const parsedRows: PartnersRawCsv[] = parsedCSV.map((row, idx) => {
        if (idx > 0) {
          return PartnersUtils.convertRowToModel(row);
        }
      });
      parsedRows.shift();
      const schemaData = PartnersUtils.convertCsvToSchema(parsedRows);
      // Start mongodb write job
      const jobs = schemaData.map(item => {
        const job = new Partner(item);
        const target = Partner.findById(item._id);
        if (!target) {
          return job.save();
        } else {
          return new Promise(r => r(null));
        }
      });
      // Add copy file job
      jobs.push(csvFile.mv(uploadPath));
      // Once all data is inserted
      Promise.all(jobs).then(() => {
        res.send(JSON.stringify({ message: 'Uploaded and inserted all the data!'}));
        // Catch any err
      }).catch((e) => res.status(500).send(e));
    } else {
      res.status(400).send(`Invalid format detected, parsed columns ${parsedCSV.length}.`);
      return;
    }
  }
});

uploadRouter.post('/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/${csvFile.name}`;

  if (csvFile?.data?.toString()) {
    const parsedCSV = CSVToArray(csvFile.data.toString());
    if (parsedCSV.length > 0 && parsedCSV[0].length === ExpectedCSVColumns.Entity) {
      // The CSV is valid
      const parsedRows: EntityRawCsv[] = parsedCSV.map((row, idx) => {
        if (idx > 0) {
          return EntitysUtils.convertRowToModel(row);
        }
      });
      parsedRows.shift();
      const schemaData = EntitysUtils.convertCsvToSchema(parsedRows);
      // Start mongodb write job
      const jobs = schemaData.map(item => {
        const job = new Entity(item);
        const target = Entity.findById(item._id);
        if (!target) {
          return job.save();
        } else {
          return new Promise(r => r(null));
        }
      });
      // Add copy file job
      jobs.push(csvFile.mv(uploadPath));
      // Once all data is inserted
      Promise.all(jobs).then(() => {
        res.send(JSON.stringify({ message: 'Uploaded and inserted all the data!'}));
        // Catch any err
      }).catch((e) => res.status(500).send(e));
    } else {
      res.status(400).send(`Invalid format detected, parsed columns ${parsedCSV.length}.`);
      return;
    }
  }
});

export default uploadRouter;