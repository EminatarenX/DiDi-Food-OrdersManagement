import { Controller, Param, Patch } from "@nestjs/common";
import { UpdateOrderStatusUseCase } from "src/application/use-cases/update-order-status.uc";
import { UpdateOrderStatusDto } from "../dtos/update-order-status.dto";
import { OrderStatus, OrderStatusEnum } from "src/domain/vo/order-status.vo";

@Controller('orders')
export class UpdateOrderStatusController {
    constructor(
        private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase
    ){}

    @Patch(':orderId/status/:status')
    async updateOrderStatus(@Param() params: UpdateOrderStatusDto) {
        const { orderId, status } = params;
        const orderStatus = new OrderStatus(status);
        await this.updateOrderStatusUseCase.execute(orderId, orderStatus); 
        return { message: "Order status updated successfully", code: 200, data: OrderStatusEnum[orderStatus.status] };
    }
}