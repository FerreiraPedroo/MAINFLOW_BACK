import { Module } from "@nestjs/common";
import { Peoplecontroller } from "./people.controller";
import { PeopleService } from "./services/people.service";
import { LocalStorageContextModule } from "@/common/context/local-storage-context.module";
import { PeopleRepository } from "./repository/people.repository";
import { PeopleRelationshipRepository } from "./repository";

@Module({
  imports: [LocalStorageContextModule],
  controllers: [Peoplecontroller],
  providers: [PeopleService, PeopleRepository, PeopleRelationshipRepository],
})
export class PeopleModule {}
