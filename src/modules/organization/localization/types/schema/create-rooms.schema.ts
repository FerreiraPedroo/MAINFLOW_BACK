import z from "zod";

// INPUT
export const Room = z.object({
  title: z.string(),
  status: z.string(),
  block_id: z.string(),
  floor_id: z.string(),
});

export const CreateRoomInputSchema = z.tuple([Room]);

// OUTPUT
export const CreateRoomOutputSchema = z.array(
  z.object({
    id: z.coerce.number(),
    title: z.string(),
    status: z.string(),
    block: z.object({ title: z.string() }),
    floor: z.object({ title: z.string() }),
    space_type: z.object({ title: z.string() }),
    building: z.object({ short_address: z.string() }),
  }),
);

// CONTROLLER
export type CreateRoomInputDto = z.infer<typeof Room>;

// SERVICE
