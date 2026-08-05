import z from "zod";

// INPUT
const CreatePeopleRelationshipFile = z.custom<Express.Multer.File>().optional();
const CreatePeopleRelationship = z.object({
  people_id: z.coerce.number(),
  kinship: z.string(),
  related_person_id: z.coerce.number().optional(),
  name: z.string().optional(),
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  comment: z.string().optional(),
});
export const CreatePeopleRelationshipSchema = z.tuple([
  CreatePeopleRelationshipFile,
  CreatePeopleRelationship,
]);

// OUTPUT

// CONTROLLER
export type CreatePeopleRelationshipFileDto = z.infer<
  typeof CreatePeopleRelationshipFile
>;
export type CreatePeopleRelationshipDto = z.infer<
  typeof CreatePeopleRelationship
>;

// SERVICE
export type CreatePeopleRelationShipFileInput = CreatePeopleRelationshipFileDto;
export type CreatePeopleRelationShipInput = CreatePeopleRelationshipDto;
