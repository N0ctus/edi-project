export interface Connection {
  clientName: string;
  comment: string;
  connectionType: string;
  createdUser: string;
  creationDate: string;
  lastModificationDate: string;
  lastUser: string;
  _id: string;
}

export interface ConnectionChartDataResponse {
  count: number;
  _id: {
    connectionType: string;
  };
}
