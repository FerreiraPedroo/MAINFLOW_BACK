import { Injectable } from "@nestjs/common";

import { LocalStorageContextData } from "@/common/context/interfaces/local-storage-context.data";
import { LocalStorageContextService } from "@/common/context/local-storage-context.service";

import { DatabaseService } from "@/common/infrastructure/database/prisma/database.service";

import { Room } from "@prisma/client";
import { CreateRoomData, FindRoomRecord } from "../types";

@Injectable()
export class RoomRepository {
  constructor(
    private db: DatabaseService,
    private requestContext: LocalStorageContextService,
  ) {}

  async findRooms(): Promise<FindRoomRecord[]> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.room.findMany({
      where: { business_unit_id: requestContext.business_unit_id },
      include: {
        floor: true,
        block: true,
      },
    });
  }
  async createRoom(roomData: CreateRoomData): Promise<Room> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.room.create({
      data: {
        title: roomData.title,
        status: roomData.status.toUpperCase(),
        business_unit_id: Number(requestContext.business_unit_id),
        created_by: Number(requestContext.user_id),
      },
    });
  }
  async updateRoom(roomId: number, roomStatus: string): Promise<Room> {
    const requestContext =
      this.requestContext.getStore() as LocalStorageContextData;

    return await this.db.client.room.update({
      where: {
        id: Number(roomId),
        business_unit_id: Number(requestContext.business_unit_id),
      },
      data: {
        status: roomStatus.toUpperCase(),
        updated_by: Number(requestContext.user_id),
      },
    });
  }
}
