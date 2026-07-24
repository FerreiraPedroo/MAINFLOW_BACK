import { IsNumber, IsString } from "class-validator";

export class CreateProcurementRequest {
  @IsString()
  title!: string;
  @IsString()
  description!: string;
  @IsString()
  type!: string;
  @IsString()
  status!: string;
  @IsNumber()
  costCenterId!: number;
}
