import moment from "moment";
import { model, Schema } from "mongoose";

// Our transactions schema model as it will be saved in the database
export interface TransactionsSchema {
    _id: string, // BPIA_ID
    startTime: string, // BPIA_STARTTIME
    lastAction: string, // BPIA_LASTACTION
    documentName: string, // BPIA_DOKUMENT
    transactionType: string, // BPIA_TYP
    entityName: string, // BPIA_ENTITYNAME
    path: string, // BPIA_TPMPATH
    logPath: string, // BPIA_DRX_LOG_PATH
}

// The raw column data we have from the csv
export interface TransactionsRawCsv {
    BPIA_ID: string;
    BPIA_STATE: string;
    BPIA_STARTTIME: string;
    BPIA_LASTACTION: string;
    BPIA_DOKUMENT: string;
    BPIA_TYP: string;
    BPIA_TRACKID: string;
    BPIA_ENTITYNAME: string;
    BPIA_TPMPATH: string;
    BPIA_LOGICALSYSTEM: string;
    BPIA_DRX_LOCATION: string;
    BPIA_DRX_LOG_PATH: string;
    BPIA_ARCHIVED_STATE: string;
    BPIA_CUR_SEQ: string;
}

export class TransactionsUtils {
    // Raw CSV to useful data converter
    public static convertCsvToSchema(input: TransactionsRawCsv[]): TransactionsSchema[] {
        return input.map(item => ({
            _id: item.BPIA_ID,
            startTime: moment(item.BPIA_STARTTIME, "MM/DD/YYYYY hh:mm:ss A").toISOString(),
            lastAction: moment(item.BPIA_LASTACTION, "MM/DD/YYYYY hh:mm:ss A").toISOString(),
            documentName: item.BPIA_DOKUMENT,
            transactionType: item.BPIA_TYP,
            entityName: item.BPIA_ENTITYNAME,
            path: item.BPIA_TPMPATH,
            logPath: item.BPIA_DRX_LOG_PATH,
        }));
    }

    public static convertRowToModel(row: Array<string>): TransactionsRawCsv {
        return {
            BPIA_ID: row[0],
            BPIA_STATE: row[1],
            BPIA_STARTTIME: row[2],
            BPIA_LASTACTION: row[3],
            BPIA_DOKUMENT: row[4],
            BPIA_TYP: row[5],
            BPIA_TRACKID: row[6],
            BPIA_ENTITYNAME: row[7],
            BPIA_TPMPATH: row[8],
            BPIA_LOGICALSYSTEM: row[9],
            BPIA_DRX_LOCATION: row[10],
            BPIA_DRX_LOG_PATH: row[11],
            BPIA_ARCHIVED_STATE: row[12],
            BPIA_CUR_SEQ: row[13],
        };
    }
}

// Mongodb schema definition
const transactionsSchema = new Schema<TransactionsSchema>({
    _id: String, // BPIA_ID
    startTime: String, // BPIA_STARTTIME
    lastAction: String, // BPIA_LASTACTION
    documentName: String, // BPIA_DOKUMENT
    transactionType: String, // BPIA_TYP
    entityName: String, // BPIA_ENTITYNAME
    path: String, // BPIA_TPMPATH
    logPath: String, // BPIA_DRX_LOG_PATH
});

// Setup the index types
transactionsSchema.index({
    'startTime': 'text',
    'lastAction': 'text',
    'documentName': 'text',
    'transactionType': 'text',
    'entityName': 'text',
    'path': 'text',
    'logPath': 'text',
});
// Export the data model
export const Transaction = model<TransactionsSchema>('Transaction', transactionsSchema);