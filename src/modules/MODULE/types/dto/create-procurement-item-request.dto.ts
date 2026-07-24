import { IsNumber } from "class-validator";

export class CreateProcurementItemRequest {
  @IsNumber()
  procurementId!: number;
  @IsNumber()
  itemId!: number;
  @IsNumber()
  quantity!: number;
}
