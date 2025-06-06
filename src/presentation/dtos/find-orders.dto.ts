import { IsUUID } from "class-validator";

export class FindOrdersDto {
    @IsUUID()
    customerId: string;
}