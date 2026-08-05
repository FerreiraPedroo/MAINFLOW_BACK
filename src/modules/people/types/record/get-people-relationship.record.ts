import { Prisma } from "@prisma/client";

export type GetPeopleRelationshipRecord = Prisma.PeopleRelationshipGetPayload<{
  include: {
    people: true;
    related_person: true;
  };
}>;
