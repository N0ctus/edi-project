import moment from "moment";
import { model, Schema } from "mongoose";

// Our Entity schema model as it will be saved in the database
export interface EntitySchema {
    _id: string, // CID
    entityClassReference: string, // CENTITYCLASSREF
    clientName: string, // CNAME
    comment: string, // CCOMMENT
    created: string, // CCREATED
    lastModified: string, // CLASTMODIFIED
    createdUser: string, // CCREATEUSER
    lastUser: string, // CLASTUSER
    entityType: string, // CKEY
    entityValue: string, // CVALUE
    entityTypeName: string, // CTYPENAME
}

// The raw column data we have from the csv
// Commented members are duplicated in the csv
export interface EntityRawCsv {
    CID: string,
    CENTITYCLASSREF: string,
    CNAME: string,
    CACTIVE: string,
    CCOMMENT: string,
    CCREATED: string,
    CLASTMODIFIED: string,
    CCREATEUSER: string,
    CLASTUSER: string,
    CENV: string,
    // CID: string,
    CNODEREF: string,
    CTYPEREF: string,
    CKEY: string,
    CVALUE: string,
    CTYPENAME: string,
    // CENV: string,
    CEXACTMATCH: string,
}

export class EntitysUtils {
    // Raw CSV to useful data converter
    public static convertCsvToSchema(input: EntityRawCsv[]): EntitySchema[] {
        return input.map(item => ({
            _id: item.CID,
            entityClassReference: item.CENTITYCLASSREF,
            clientName: item.CNAME,
            comment: item.CCOMMENT,
            created: moment(item.CCREATED, "DD-MMM-YY hh.mm.ss.SSSSSS A").toISOString(),
            lastModified: moment(item.CLASTMODIFIED, "DD-MMM-YY hh.mm.ss.SSSSSS A").toISOString(),
            createdUser: item.CCREATEUSER,
            lastUser: item.CLASTUSER,
            entityType: item.CKEY,
            entityValue: item.CVALUE,
            entityTypeName: item.CTYPENAME,
        }));
    }

    public static convertRowToModel(row: Array<string>): EntityRawCsv {
        return {
            CID: row[0],
            CENTITYCLASSREF: row[1],
            CNAME: row[2],
            CACTIVE: row[3],
            CCOMMENT: row[4],
            CCREATED: row[5],
            CLASTMODIFIED: row[6],
            CCREATEUSER: row[7],
            CLASTUSER: row[8],
            CENV: row[9],
            // CID: row[10],
            CNODEREF: row[11],
            CTYPEREF: row[12],
            CKEY: row[13],
            CVALUE: row[14],
            CTYPENAME: row[15],
            // CENV: row[16],
            CEXACTMATCH: row[17],
        };
    }
}

// Mongodb schema definition
const EntitySchema = new Schema<EntitySchema>({
    _id: String, // CID
    entityClassReference: String, // CENTITYCLASSREF
    clientName: String, // CNAME
    comment: String, // CCOMMENT
    created: String, // CCREATED
    lastModified: String, // CLASTMODIFIED
    createdUser: String, // CCREATEUSER
    lastUser: String, // CLASTUSER
    entityType: String, // CKEY
    entityValue: String, // CVALUE
    entityTypeName: String, // CTYPENAME
});

// Export the data model
export const Entity = model<EntitySchema>('Entity', EntitySchema);