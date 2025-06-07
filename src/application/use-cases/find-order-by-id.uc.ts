import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderRepository } from "src/domain/interfaces/order.repository";
import { BusinessRuleViolationException } from "../exceptions/business-rule-violation.exception";

@Injectable()
export class FindOrderByIdUseCase {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
    ){}
    async execute(orderId: string) {
        const order = await this.orderRepository.findById(orderId);
        if (!order) throw new BusinessRuleViolationException(`Order with ID ${orderId} not found.`);
        return order;
    }
}