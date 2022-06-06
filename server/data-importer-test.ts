// https://gist.github.com/hellwolf/33988cda1c8aecb7ebdb

import { fork } from 'child_process';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({
  path: `${__dirname}/../.env`
});

var botsList = ["./server/uploads/connections-0.csv", "./server/uploads/connections-1.csv", "./server/uploads/connections-2.csv"];

const childProcess = fork(`./server/importers/connections`, [JSON.stringify(botsList)]).on('exit', (code) => {
    console.log(`child exited code: `, code);
});

childProcess.send(botsList);