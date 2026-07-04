import { Injectable } from "@nestjs/common";
import { AsyncLocalStorage } from "node:async_hooks";
import { RequestAlsContext } from "./interfaces/request-als.context.interface";

@Injectable()
export class AlsContextService extends AsyncLocalStorage<RequestAlsContext> {}
