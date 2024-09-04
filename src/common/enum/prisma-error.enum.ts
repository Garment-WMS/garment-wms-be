//https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
export enum PrismaErrorEnum {
  //P2025: An operation failed because it depends on one or more records that were required but not found.
  //Explanation: When you try to update or delete a record that does not exist.
  OperationDependencyNotFound = 'P2025',

  //P2002: A unique constraint was violated on a record.
  UniqueConstraintFailed = 'P2002',

  //P2003: A foreign key constraint was violated on a record.
  ForeignKeyConstraintFailed = 'P2003',

  //P2014: An operation failed because it depends on one or more records that were required but not found.
  RequiredRecordNotFound = 'P2014',

  //P1001: Database connection failed.
  DatabaseConnectionFailed = 'P1001',
}
