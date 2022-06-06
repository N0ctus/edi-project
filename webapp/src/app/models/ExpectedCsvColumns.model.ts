// For each CSV file, we have an expected number of columns to avoid problems

export enum ExpectedCSVColumns {
    Connections = 34,
    Transactions = 14,
    Partners = 10,
    Entity = 18,
};

export function getKeyName(value: ExpectedCSVColumns) {
  return ExpectedCSVColumns[value];
}
