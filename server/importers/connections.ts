import fs from 'fs';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { CSVToArray } from '../utils/csv-to-array';
import { ExpectedCSVColumns } from '../models/ExpectedCsvColumns.model';
import { Connection, ConnectionRawCsv, ConnectionsUtils } from '../models/Connections.schema';

dotenv.config({
  path: `${__dirname}/../../.env`
});

connect(`${process.env["DB_CONNECT"]}/${process.env["DB_NAME"]}`);

let insertJobs = [];
let readJobs: Array<Promise<string>> = [];

process.on('message', (filesList: string[]) => {
    console.log(`New message`, filesList);
    if (filesList.length > 0) {
        readJobs = filesList.map((file: string) => {
            const readJob = new Promise<string>((resolve, reject) => {
                fs.readFile(file, 'utf-8', (err, data) => {
                    if (err) {
                        reject(err);
                        process.exit(1);
                    }
                    resolve(data);
                });
            });
            return readJob;
        });
        Promise.all(readJobs).then(data => {
            insertJobs = data.map(item => importConnections(item));
            Promise.all(insertJobs).then(e => {
                console.log(`All data imported successfully `, data.length);
                insertJobs = [];
                readJobs = [];
            }).catch(e => process.exit(1));
        });
    } else {
        // Get the status of importing
        if (insertJobs.length === 0 && readJobs.length === 0) {
            process.send(true);
        } else {
            process.send(false);
        }
    }
});

function importConnections(csvFile: string): Promise<boolean> {
    const importJob = new Promise<boolean>((resolve, reject) => {
        if (csvFile?.toString()) {
            const parsedCSV = CSVToArray(csvFile.toString());
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
                const jobs = schemaData.map(async (item) => {
                    if (item?._id !== '') {
                        const job = new Connection(item);
                        const target = await Connection.findById(item._id);
                        if (!target && target?._id !== '') {
                            return job.save();
                        } else {
                            return new Promise(r => r(null));
                        }
                    } else {
                        return new Promise(r => r(null));
                    }
                });
                // Once all data is inserted
                Promise.all(jobs).then(() => {
                    return resolve(true);
                    // Catch any err
                }).catch((e) => {
                    console.error(e);
                });
            } else {
                reject(`Cannot read file data!`);
            }
        }
    });
    return importJob;
}