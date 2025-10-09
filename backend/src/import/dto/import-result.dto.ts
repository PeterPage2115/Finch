export class FailedRow {
  rowNumber: number;
  rowData: Record<string, any>;
  errors: string[];
}

export class ImportResultDto {
  successCount: number;
  failedCount: number;
  totalRows: number;
  failedRows: FailedRow[];
  autoCreatedCategories: string[];
  message: string;
}
