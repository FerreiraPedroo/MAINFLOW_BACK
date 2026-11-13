import z from "zod";
import { SearchQuerySchema } from "@/common/schema/search-query.schema";

// INPUT
const PaymentSubmission = z.object({
  invoice_number: z.coerce.number().optional(),
  invoice_type: z.string().optional(),
  invoice_date: z.date().optional(),
  due_date: z.date().optional(),
  billing_period: z.date().optional(),
});
const FindPaymentSubmission = SearchQuerySchema(PaymentSubmission);

export const FindPaymentSubmissionInputSchema = z.tuple([
  FindPaymentSubmission,
]);

// OUTPUT
export const FindPaymentSubmissionOutputSchema = z.array(
  z.object({
    id: z.number(),
    invoice_number: z.string(),
    invoice_type: z.string(),
    due_date: z.date(),
    billing_period: z.date(),
    total_amount: z.number(),
    party: z.object({
      id: z.number(),
      legal_name: z.string(),
      trade_name: z.string(),
      party_type: z.string(),
      tax_id: z.string(),
      role: z.array(z.string()),
    }),
  }),
);

// CONTROLLER
export type FindPaymentSubmissionInputDto = z.infer<
  typeof FindPaymentSubmissionInputSchema
>;
export type FindPaymentSubmissionOutputDto = z.infer<
  typeof FindPaymentSubmissionOutputSchema
>;

// SERVICE
