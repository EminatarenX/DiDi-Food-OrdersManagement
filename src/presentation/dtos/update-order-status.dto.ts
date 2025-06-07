import { IsEnum, IsUUID } from "class-validator";
import { OrderStatus, OrderStatusEnum } from "src/domain/vo/order-status.vo";

export class UpdateOrderStatusDto {
    @IsUUID()
    orderId: string;
    @IsEnum(OrderStatusEnum)
    status: OrderStatusEnum;
}