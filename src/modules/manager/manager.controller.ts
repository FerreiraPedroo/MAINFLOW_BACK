import { Controller, Get } from "@nestjs/common";

@Controller("/manager")
export class ManagerController {
  constructor() {}

  @Get()
  getManager(): string[] {
    return [];
  }
}
