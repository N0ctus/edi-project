import { Router } from "express";
import passport from "passport";
import { Connection, ConnectionRawCsv, convertCsvToSchema, convertRowToModel } from "../models/connections.schema";
import { ExpectedCSVColumns } from "../models/ExpectedCsvColumns.model";
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
            return convertRowToModel(row);
          }
        });
        parsedRows.shift();
        const schemaData = convertCsvToSchema(parsedRows);
        const jobs = schemaData.map(item => {
          const job = new Connection(item);
          const target = Connection.findById(item._id);
          if (!target) {
            return job.save();
          } else {
            return new Promise(r => r(null));
          }
        });
        Promise.all(jobs).then(() => {
          res.send('Uploaded and imported all the data!');
        }).catch((e) => res.status(500).send(e));
        console.log(parsedRows[2]);
      } else {
        res.status(400).send(`Invalid format detected, parsed columns ${parsedCSV.length}.`);
        return;
      }
    }
/*
    csvFile.mv(uploadPath, function(err) {
      if (err) {
        return res.status(500).send(err);
      }

      res.send('File uploaded to ' + uploadPath);
    }); */
  });

export default uploadRouter;