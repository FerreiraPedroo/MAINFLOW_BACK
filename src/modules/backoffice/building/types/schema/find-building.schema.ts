import z from "zod";

// INPUT
// export const FindBuildingInputSchema = z.tuple([z.coerce.number()]);

// OUTPUT
const FindBuildingOutput = z.object({
  id: z.int(),
  type: z.string(),
  zone: z.string().nullable(),
  short_address: z.string().nullable(),
  full_address: z.string().nullable(),
  map_google: z.string().nullable(),
  coordinate: z.string().nullable(),
  photo: z.string().nullable(),
  status: z.string().nullable(),
});

export const FindBuildingOutputSchema = z.array(FindBuildingOutput);

// CONTROLLER

// SERVICE
