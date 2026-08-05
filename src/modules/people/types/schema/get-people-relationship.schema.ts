import z from "zod";

// INPUT
export const GetPeopleRelationshipInputSchema = z.tuple([z.coerce.number()]);

// OUTPUT
const People = z.object({
  id: z.any(),
  name: z.any(),
  photo: z.any(),
});
const GetPeopleRelationshipOutput = z.object({
  id: z.any(),
  people_id: z.any(),
  people: People,
  kinship: z.any(),
  related_person_id: z.any(),
  related_person: People,
  name: z.any(),
  photo: z.any(),
  start_date: z.any(),
  end_date: z.any(),
  comment: z.any(),
});
export const GetPeopleRelationshipOutputSchema = z.array(
  GetPeopleRelationshipOutput,
);
// CONTROLLER

// SERVICE
