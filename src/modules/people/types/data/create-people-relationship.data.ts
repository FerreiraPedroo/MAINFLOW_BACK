export interface CreatePeopleRelationshipData {
  people_id?: number;
  kinship: string;
  related_person_id?: number;
  name?: string;
  start_date?: Date;
  end_date?: Date;
  comment?: string;
}
