import fs from 'fs';
import dotenv from 'dotenv';
import { connect } from 'mongoose';
import { CSVToArray } from './../utils/csv-to-array';
import { ExpectedCSVColumns } from './../models/ExpectedCsvColumns.model';
import { Transaction, TransactionsRawCsv, TransactionsUtils } from '../models/Transactions';

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
                fs.readFile(file, 'utf-8', async (err, data) => {
                    if (err) {
                        reject(err);
                        process.exit(1);
                    }
                    await importTransactions(data);
                    resolve(data);
                });
            });
            return readJob;
        });
        Promise.all(readJobs).then(data => {
            console.log(`All data imported successfully `, data.length);
            readJobs = [];
            // After an import batch, make sure to syn the indexes
            Transaction.syncIndexes({ '$**' : 'text' });
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

function importTransactions(csvFile: string): Promise<boolean> {
    const importJob = new Promise<boolean>((resolve, reject) => {
        if (csvFile?.toString()) {
            const parsedCSV = CSVToArray(csvFile.toString());
            if (parsedCSV.length > 0 && parsedCSV[0].length === ExpectedCSVColumns.Transactions) {
                // The CSV is valid
                const parsedRows: TransactionsRawCsv[] = parsedCSV.map((row, idx) => {
                    if (idx > 0) {
                        return TransactionsUtils.convertRowToModel(row);
                    }
                });
                parsedRows.shift();
                const schemaData = TransactionsUtils.convertCsvToSchema(parsedRows);
                // Start mongodb mass import job https://stackoverflow.com/a/24848148
                Transaction.insertMany(schemaData, { ordered: false }).then(() => {
                    return resolve(true);
                }).catch(e => console.error(e));
            } else {
                reject(`Cannot read file data!`);
            }
        }
    });
    return importJob;
}