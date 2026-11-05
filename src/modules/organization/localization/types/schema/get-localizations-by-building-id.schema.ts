import z from "zod";

// INPUT
export const GetLocalizationByBuildingIdInputSchema = z.tuple([
  z.coerce.number(),
]);

// OUTPUT
export const GetLocalizationByBuildingIdOutputSchema = z.array(
  z.object({
    id: z.number(),
    title: z.string(),
    status: z.string(),
    block: z.object({ title: z.string() }),
    floor: z.object({ title: z.string() }),
    space_type: z.object({ title: z.string() }),
    building: z.object({ short_address: z.string() }),
  }),
);

// CONTROLLER
// export type GetLocalizationByBuildingIdOutputDto = z.infer<
//   typeof GetLocalizationByBuildingIdOutput
// >;

// SERVICE
