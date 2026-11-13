import { Prisma } from "@prisma/client";

export type PaymentSubmissionRecord = Prisma.PaymentSubmissionGetPayload<{
  include: { party: true };
}>;
