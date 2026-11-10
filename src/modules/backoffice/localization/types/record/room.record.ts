import { Prisma } from "@prisma/client";

export type FindRoomRecord = Prisma.RoomGetPayload<{
  include: {
    floor: true;
    block: true;
  };
}>;

export type UpdateRoomRecord = Prisma.RoomGetPayload<{
  include: {
    floor: true;
    block: true;
  };
}>;
