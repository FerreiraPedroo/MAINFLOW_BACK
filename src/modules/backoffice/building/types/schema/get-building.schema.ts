import z from "zod";

// INPUT
export const GetBuildingInputSchema = z.tuple([z.coerce.number()]);

// OUTPUT
const GetBuildingOutput = z.object({
  id: z.int(),
  type: z.string(),
  zone: z.string().nullable(),
  short_address: z.string().nullable(),
  full_address: z.string().nullable(),
  map_google: z.string().nullable(),
  coordinate: z.string().nullable(),
  photo: z.string().nullable(),
  status: z.string().nullable(),
  localizations: z.number(),
  building_lease_contracts: z.number(),
});

export const GetBuildingOutputSchema = GetBuildingOutput;

// CONTROLLER

// SERVICE
