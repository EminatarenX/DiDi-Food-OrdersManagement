import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderRepository } from "src/domain/interfaces/order.repository";
import { BusinessRuleViolationException } from "../exceptions/business-rule-violation.exception";

@Injectable()
export class DeleteOrderUseCase {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
    ){}

    async execute(orderId: string): Promise<void> {
        const exist = await this.orderRepository.findById(orderId);
        if (!exist) {
            throw new BusinessRuleViolationException(`Order with ID ${orderId} does not exist.`);
        }
        await this.orderRepository.delete(orderId);
    }
}