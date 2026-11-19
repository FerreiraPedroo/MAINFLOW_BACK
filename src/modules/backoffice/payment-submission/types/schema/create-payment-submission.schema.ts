import z from "zod";

// INPUT
export const CreatePaymentSubmission = z.object({
  invoice_number: z.string(),
  invoice_type: z.string(),
  invoice_date: z.coerce.date(),
  due_date: z.coerce.date(),
  billing_period: z.coerce.date(),
  total_amount: z.coerce.number(),
  payment_send_date: z.coerce.date(),
  attached_document: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  business_partner_id: z.coerce.number(),
});

export const CreatePaymentSubmissionInputSchema = z.tuple([
  CreatePaymentSubmission,
]);

// OUTPUT
export const CreatePaymentSubmissionOutputSchema = z.object({
  id: z.number(),
  invoice_number: z.string(),
  invoice_type: z.string(),
  due_date: z.date(),
  billing_period: z.date(),
  total_amount: z.number(),
});

// CONTROLLER
export type CreatePaymentSubmissionInputDto = z.infer<
  typeof CreatePaymentSubmissionInputSchema
>;
export type CreatePaymentSubmissionOutputDto = z.infer<
  typeof CreatePaymentSubmissionOutputSchema
>;

// SERVICE
