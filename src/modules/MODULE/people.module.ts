import { Module } from "@nestjs/common";
import { Peoplecontroller } from "./people.controller";
import { PeopleService } from "./people.service";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { PeopleRepository } from "./repository/people.repository";

@Module({
  // imports: [LocalStorageContextModule],
  // controllers: [Peoplecontroller],
  // providers: [PeopleService, PeopleRepository],
})
export class PeopleModule {}
