import z from "zod";
import { CreatePaymentSubmission } from "../schema/create-payment-submission.schema";

export type CreatePaymentSubmissionRequest = z.infer<
  typeof CreatePaymentSubmission
>;
