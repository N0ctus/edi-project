/* export interface Entity {
  clientName: string;
  comment: string;
  connectionType: string;
  createdUser: string;
  creationDate: string;
  lastModificationDate: string;
  lastUser: string;
  _id: string;
} */

export interface EntityChartDataResponse {
  count: number;
  _id: {
    entityClassReference: string;
  };
}
