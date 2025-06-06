import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY } from "src/domain/constants/repository-tokens";
import { OrderItem } from "src/domain/entities/order-item.entity";
import { Order } from "src/domain/entities/order.entity";
import { OrderRepository } from "src/domain/interfaces/order.repository";
import { DeliveryAddress } from "src/domain/vo/delivery-address.vo";
import { OrderStatus, OrderStatusEnum } from "src/domain/vo/order-status.vo";
import { Price } from "src/domain/vo/price.vo";
import { Quantity } from "src/domain/vo/quantity.vo";
import { SpecialInstructions } from "src/domain/vo/special-instructions.vo";
import { CreateOrderDto } from "src/presentation/dtos/create-order.dto";
import { v4 as uuid} from "uuid";
@Injectable()
export class CreateOrderUseCase {
    constructor(
        @Inject(ORDER_REPOSITORY) private readonly orderRepository: OrderRepository
    ){}

    async execute(input: CreateOrderDto): Promise<Order> {
        const order = new Order(
            uuid(),
            input.restaurantId,
            input.customerId,
            new DeliveryAddress(
                input.deliveryAddress.street,
                input.deliveryAddress.city,
                input.deliveryAddress.number,
                input.deliveryAddress.postalCode,
                { lat: input.deliveryAddress.latitude, lng: input.deliveryAddress.longitude }
            ),
            input.items.map(item => {
                return new OrderItem(
                    item.productId,
                    new Quantity(item.quantity) ,
                    new Price(
                        item.price.amount,
                        item.price.currency
                    ),
                    new SpecialInstructions(item.specialInstructions || "")
                )
            }),
            new OrderStatus(OrderStatusEnum.CONFIRMED)
        );

        return await this.orderRepository.save(order);
    }
}