import { Prisma } from "@prisma/client";

export type FindRoomRecord = Prisma.RoomGetPayload<{
  include: {
    floor: true;
    block: true;
  };
}>;
