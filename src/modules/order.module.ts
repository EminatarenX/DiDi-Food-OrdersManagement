import { Module } from "@nestjs/common";
import { CreateOrderUseCase } from "src/application/use-cases/create-order.uc";
import { FindOrdersByCustomerIdUseCase } from "src/application/use-cases/find-order-by-customer.uc";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { PrismaOrderRepository } from "src/infrastructure/repositories/prisma-order.repository";
import { CreateOrderController } from "src/presentation/controllers/create-order.controller";
import { FindOrderByCustomerIdController } from "src/presentation/controllers/find-order-by-customer-id.controller";


@Module({
    controllers: [CreateOrderController, FindOrderByCustomerIdController],
    providers: [
        CreateOrderUseCase,
        FindOrdersByCustomerIdUseCase,
        {
            provide: ORDER_REPOSITORY,
            useClass: PrismaOrderRepository
        },
    ]
})
export class OrderModule {}