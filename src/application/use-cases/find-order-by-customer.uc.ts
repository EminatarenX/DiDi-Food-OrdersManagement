import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderRepository } from "src/domain/interfaces/order.repository";

@Injectable()
export class FindOrdersByCustomerIdUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
  ) {}

  execute(customerId: string) {
    return this.orderRepository.findByCustomerId(customerId);
  }
}
