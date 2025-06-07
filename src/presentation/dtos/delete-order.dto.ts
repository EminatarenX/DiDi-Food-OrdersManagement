import { IsUUID } from "class-validator";

export class DeleteOrderDto {

    @IsUUID()
    orderId: string;
}