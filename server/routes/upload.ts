import { Router } from "express";
import passport from "passport";
import { fork } from 'child_process';
import fs from 'fs';
const csvSplitStream = require('csv-split-stream');

// Init the child processes to avoid issues with express server
const connectionsImporterProcess = fork(`${__dirname}/../importers/connections.ts`);
const transactionsImporterProcess = fork(`${__dirname}/../importers/transactions.ts`);
const entitiesImporterProcess = fork(`${__dirname}/../importers/entities.ts`);
const partnersImporterProcess = fork(`${__dirname}/../importers/partners.ts`);

const uploadRouter = Router();

uploadRouter.get('/status', passport.authenticate('jwt', { session: false }), (req, res) => {
  connectionsImporterProcess.once('message', (msg) => res.send(msg));
  connectionsImporterProcess.send([]);
});

uploadRouter.post('/connections', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/`;
  const originalFilePath = `${uploadPath}/${csvFile.name}`;
  const filesQueue = [];

  csvFile.mv(originalFilePath).then(() => {
    csvSplitStream.split(
      fs.createReadStream(originalFilePath),
      {
        lineLimit: 100
      },
      (index) => {
        const chunkFilePath = `${uploadPath}/connections-${index}.csv`;
        filesQueue.push(chunkFilePath);
        return fs.createWriteStream(chunkFilePath);
      }
    )
    .then(r => {
      connectionsImporterProcess.send(filesQueue);
      res.send(JSON.stringify(filesQueue))
    })
    .catch(e => res.status(500).send(JSON.stringify(e)));
  });
});

uploadRouter.post('/transactions', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/`;
  const originalFilePath = `${uploadPath}/${csvFile.name}`;
  const filesQueue = [];

  csvFile.mv(originalFilePath).then(() => {
    csvSplitStream.split(
      fs.createReadStream(originalFilePath),
      {
        lineLimit: 250000
      },
      (index) => {
        const chunkFilePath = `${uploadPath}/transactions-${index}.csv`;
        filesQueue.push(chunkFilePath);
        return fs.createWriteStream(chunkFilePath);
      }
    )
    .then(r => {
      transactionsImporterProcess.send(filesQueue);
      res.send(JSON.stringify(filesQueue))
    })
    .catch(e => res.status(500).send(JSON.stringify(e)));
  });
});

uploadRouter.post('/partners', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/`;
  const originalFilePath = `${uploadPath}/${csvFile.name}`;
  const filesQueue = [];

  csvFile.mv(originalFilePath).then(() => {
    csvSplitStream.split(
      fs.createReadStream(originalFilePath),
      {
        lineLimit: 250000
      },
      (index) => {
        const chunkFilePath = `${uploadPath}/partners-${index}.csv`;
        filesQueue.push(chunkFilePath);
        return fs.createWriteStream(chunkFilePath);
      }
    )
    .then(r => {
      partnersImporterProcess.send(filesQueue);
      res.send(JSON.stringify(filesQueue))
    })
    .catch(e => res.status(500).send(JSON.stringify(e)));
  });
});

uploadRouter.post('/entities', passport.authenticate('jwt', { session: false }), (req, res) => {
  let csvFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400).send('No files were uploaded.');
    return;
  }
  csvFile = req.files.csv;

  uploadPath = `${__dirname}/../uploads/`;
  const originalFilePath = `${uploadPath}/${csvFile.name}`;
  const filesQueue = [];

  csvFile.mv(originalFilePath).then(() => {
    csvSplitStream.split(
      fs.createReadStream(originalFilePath),
      {
        lineLimit: 250000
      },
      (index) => {
        const chunkFilePath = `${uploadPath}/entites-${index}.csv`;
        filesQueue.push(chunkFilePath);
        return fs.createWriteStream(chunkFilePath);
      }
    )
    .then(r => {
      entitiesImporterProcess.send(filesQueue);
      res.send(JSON.stringify(filesQueue))
    })
    .catch(e => res.status(500).send(JSON.stringify(e)));
  });
});

export default uploadRouter;