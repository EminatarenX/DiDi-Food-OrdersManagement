import { IsUUID } from "class-validator";

export class FindOrderByIdDto {
    @IsUUID()
    orderId: string;
}