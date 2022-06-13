import moment from "moment";
import { model, Schema } from "mongoose";

// Our Partners schema model as it will be saved in the database
export interface PartnersSchema {
    _id: string, // CID
    clientName: string, // CNAME
    clientType: string, // CADDRESSUSAGE
    created: string, // CCREATED
    lastModified: string, // CLASTMODIFIED
    createdUser: string, // CCREATEUSER
    lastUser: string, // CLASTUSER
}

// The raw column data we have from the csv
export interface PartnersRawCsv {
    CID: string,
    CNAME: string,
    CADDRESSUSAGE: string,
    SFID: string,
    CCREATED: string,
    CLASTMODIFIED: string,
    CCREATEUSER: string,
    CLASTUSER: string,
    CENV: string,
    CIDENTITY: string,
}

export class PartnersUtils {
    // Raw CSV to useful data converter
    public static convertCsvToSchema(input: PartnersRawCsv[]): PartnersSchema[] {
        return input.map(item => ({
            _id: item.CID,
            clientName: PartnersUtils.convertClientName(item.CNAME),
            clientType: item.CADDRESSUSAGE,
            created: moment(item.CCREATED, "DD-MMM-YY hh.mm.ss.SSSSSS A").toISOString(),
            lastModified: moment(item.CLASTMODIFIED, "DD-MMM-YY hh.mm.ss.SSSSSS A").toISOString(),
            createdUser: item.CCREATEUSER,
            lastUser: item.CLASTUSER,
        }));
    }

    public static convertRowToModel(row: Array<string>): PartnersRawCsv {
        return {
            CID: row[0],
            CNAME: row[1],
            CADDRESSUSAGE: row[2],
            SFID: row[3],
            CCREATED: row[4],
            CLASTMODIFIED: row[5],
            CCREATEUSER: row[6],
            CLASTUSER: row[7],
            CENV: row[8],
            CIDENTITY: row[9],
        };
    }

    public static convertClientName(name: string) {
        const filterExp = /^[^\s_]+/;
        if (name) {
            const splicedName = filterExp.exec(name);
            if (splicedName && splicedName?.[0] !== '') {
                return splicedName[0];
            }
        }
        return 'Unknown';
    }
}

// Mongodb schema definition
const PartnersSchema = new Schema<PartnersSchema>({
    _id: String, // CID
    clientName: String, // CNAME
    clientType: String, // CADDRESSUSAGE
    created: String, // CCREATED
    lastModified: String, // CLASTMODIFIED
    createdUser: String, // CCREATEUSER
    lastUser: String, // CLASTUSER
});

// Export the data model
export const Partner = model<PartnersSchema>('Partner', PartnersSchema);