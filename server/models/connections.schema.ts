import { model, Schema } from "mongoose";

// Our connection schema model as it will be saved in the database
export interface ConnectionSchema {
    _id: string, // CID
    clientName: string, // CNAME
    connectionType: string, // CDETAILSTYPE
    comment: string, // CCOMMENT
    creationDate: string, // CCREATED
    lastModificationDate: string, // CLASTMODIFIED
    createdUser: string, // CCREATEUSER
    lastUser: string, // CLASTUSER
}

// The raw column data we have from the csv
export interface ConnectionRawCsv {
    CID: string,
    CNAME: string,
    CDETAILSTYPE: string,
    CSSIDPARTNERCODEREF: string,
    CSSIDOWNCODEREF: string,
    CPARTNERPASSWORD: string,
    COWNPASSWORD: string,
    CSSIDUSERFIELD: string,
    CPARTNERTYPE: string,
    CENABLEMULTIPLESESSIONS: string,
    CPROTOCOLVERSION: string,
    CEXCHANGEBUFFERSIZE: string,
    CTRANSFERDIRECTION: string,
    CENABLECOMPRESSION: string,
    CENABLERESTART: string,
    CSPECIALLOGICNEEDED: string,
    CCREDITCOUNT: string,
    CTIMEOUTSESSION: string,
    CTIMEOUTCALL: string,
    CFILEENCODING: string,
    CCOMMENT: string,
    CCREATED: string,
    CLASTMODIFIED: string,
    CCREATEUSER: string,
    CLASTUSER: string,
    CENV: string,
    CREQUESTSECUREAUTH: string,
    CRESTRESOURCEID: string,
    CSEQPROCESSING: string,
    CSEQCOUNTERTYPE: string,
    CASYNCFILE: string,
    CASYNCFILETHRESHOLD: string,
    CISACTIVE: string,
    CRESTVERSION: string,
}

// Raw CSV to useful data converter
export function convertCsvToSchema(input: ConnectionRawCsv[]): ConnectionSchema[] {
    return input.map(item => ({
        _id: item.CID,
        clientName: item.CNAME,
        connectionType: item.CDETAILSTYPE,
        comment: item.CCOMMENT,
        creationDate: item.CCREATED,
        lastModificationDate: item.CLASTMODIFIED,
        createdUser: item.CCREATEUSER,
        lastUser: item.CLASTUSER,
    }));
}

export function convertRowToModel(row: Array<string>): ConnectionRawCsv {
    return {
        CID: row[0],
        CNAME: row[1],
        CDETAILSTYPE: row[2],
        CSSIDPARTNERCODEREF: row[3],
        CSSIDOWNCODEREF: row[4],
        CPARTNERPASSWORD: row[5],
        COWNPASSWORD: row[6],
        CSSIDUSERFIELD: row[7],
        CPARTNERTYPE: row[8],
        CENABLEMULTIPLESESSIONS: row[9],
        CPROTOCOLVERSION: row[10],
        CEXCHANGEBUFFERSIZE: row[11],
        CTRANSFERDIRECTION: row[12],
        CENABLECOMPRESSION: row[13],
        CENABLERESTART: row[14],
        CSPECIALLOGICNEEDED: row[15],
        CCREDITCOUNT: row[16],
        CTIMEOUTSESSION: row[17],
        CTIMEOUTCALL: row[18],
        CFILEENCODING: row[19],
        CCOMMENT: row[20],
        CCREATED: row[21],
        CLASTMODIFIED: row[22],
        CCREATEUSER: row[23],
        CLASTUSER: row[24],
        CENV: row[25],
        CREQUESTSECUREAUTH: row[26],
        CRESTRESOURCEID: row[27],
        CSEQPROCESSING: row[28],
        CSEQCOUNTERTYPE: row[29],
        CASYNCFILE: row[30],
        CASYNCFILETHRESHOLD: row[31],
        CISACTIVE: row[32],
        CRESTVERSION: row[33],
    };
}

// Mongodb schema definition
const connectionSchema = new Schema<ConnectionSchema>({
    _id: String, // CID
    clientName: String, // CNAME
    connectionType: String, // CDETAILSTYPE
    comment: String, // CCOMMENT
    creationDate: String, // CCREATED
    lastModificationDate: String, // CLASTMODIFIED
    createdUser: String, // CCREATEUSER
    lastUser: String, // CLASTUSER
});

// Export the data model
export const Connection = model<ConnectionSchema>('Connection', connectionSchema);