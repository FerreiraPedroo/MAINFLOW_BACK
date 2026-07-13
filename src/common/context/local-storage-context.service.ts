import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { LocaStorageContextData } from "./interfaces/local-storage-context.data";

@Injectable()
export class LocalStorageContextService extends AsyncLocalStorage<LocaStorageContextData> {}
