import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";

@Injectable()
export class RequestContextService extends AsyncLocalStorage<RequestContextService> {}
