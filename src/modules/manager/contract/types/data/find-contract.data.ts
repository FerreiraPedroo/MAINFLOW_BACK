import { ContractFinancialType, RecurrenceFrequency } from "@prisma/client";

export type FindContractOutputData = {
  contracts: {
    title: string;
    status: string;
    financial_type: ContractFinancialType;
    recurrence_frequency: RecurrenceFrequency;
    start_date: Date | null;
  }[];
  cursor: number;
};
