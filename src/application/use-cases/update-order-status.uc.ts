import { Inject } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderRepository } from "src/domain/interfaces/order.repository";
import { OrderStatus } from "src/domain/vo/order-status.vo";

export class UpdateOrderStatusUseCase {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
    ){}

    async execute(orderId: string, status: OrderStatus): Promise<void> {
        await this.orderRepository.updateStatus(orderId, status);
    }
}