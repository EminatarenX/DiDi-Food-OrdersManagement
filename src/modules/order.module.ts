import { Module } from "@nestjs/common";
import { CreateOrderUseCase } from "src/application/use-cases/create-order.uc";
import { DeleteOrderUseCase } from "src/application/use-cases/delete-order.uc";
import { FindOrdersByCustomerIdUseCase } from "src/application/use-cases/find-order-by-customer.uc";
import { FindOrderByIdUseCase } from "src/application/use-cases/find-order-by-id.uc";
import { UpdateOrderStatusUseCase } from "src/application/use-cases/update-order-status.uc";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { PrismaOrderRepository } from "src/infrastructure/repositories/prisma-order.repository";
import { CreateOrderController } from "src/presentation/controllers/create-order.controller";
import { DeleteOrderController } from "src/presentation/controllers/delete-order.controller";
import { FindOrderByCustomerIdController } from "src/presentation/controllers/find-order-by-customer-id.controller";
import { FindOrderByIdController } from "src/presentation/controllers/find-order-by-id.controller";
import { UpdateOrderStatusController } from "src/presentation/controllers/update-order-status.controller";


@Module({
    controllers: [CreateOrderController, FindOrderByCustomerIdController, FindOrderByIdController, UpdateOrderStatusController, DeleteOrderController],
    providers: [
        CreateOrderUseCase,
        FindOrdersByCustomerIdUseCase,
        FindOrderByIdUseCase,
        UpdateOrderStatusUseCase,
        DeleteOrderUseCase,
        {
            provide: ORDER_REPOSITORY,
            useClass: PrismaOrderRepository
        },
    ]
})
export class OrderModule {}