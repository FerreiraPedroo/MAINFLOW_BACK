import {
  ContractFinancialType,
  Prisma,
  RecurrenceFrequency,
} from "@prisma/client";

export type CreateContractData = {
  title: string;
  status: string;
  description?: string;
  financial_type: ContractFinancialType;
  billing: number;
  recurrence_frequency: RecurrenceFrequency;
  link_contract?: Prisma.InputJsonValue;
  start_date?: Date;
};
