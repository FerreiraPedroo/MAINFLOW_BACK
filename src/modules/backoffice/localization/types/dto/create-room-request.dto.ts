import z from "zod";
import { Room } from "../schema/create-rooms.schema";

export type CreateRoomRequest = z.infer<typeof Room>;
