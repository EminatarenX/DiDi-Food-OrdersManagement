import { DeliveryAddress } from "../vo/delivery-address.vo";
import { OrderStatus, OrderStatusEnum } from "../vo/order-status.vo";
import { Price } from "../vo/price.vo";
import { Quantity } from "../vo/quantity.vo";
import { SpecialInstructions } from "../vo/special-instructions.vo";
import { OrderItem } from "./order-item.entity";

export class Order {
    constructor(
        public readonly id: string,
        public readonly restaurantId: string,
        public customerId: string,
        public deliveryAddress: DeliveryAddress,
        public items: OrderItem[],
        public status: OrderStatus,
        public createdAt: Date = new Date()
    ){}

    confirm(): void {
        this.status = new OrderStatus(OrderStatusEnum.CONFIRMED);
    }

   static fromPrisma(record: any): Order {
    
    const deliveryAddress = new DeliveryAddress(
      record.deliveryAddress.street,
      record.deliveryAddress.city,
      record.deliveryAddress.number,
      record.deliveryAddress.postalCode,
      { lat: record.deliveryAddress.latitude, lng: record.deliveryAddress.longitude } // Mapeo de coordenadas
    );

    const orderItems = record.items.map((item: any) =>
      new OrderItem(
        item.productId,
        new Quantity(item.quantity), 
        new Price(item.price, item.currency),
        new SpecialInstructions(item.specialInstructions || "") 
      )
    );

    const orderStatus = new OrderStatus(record.status as OrderStatusEnum); 

    return new Order(
      record.id,
      record.restaurantId,
      record.customerId,
      deliveryAddress,
      orderItems,
      orderStatus,
      record.createdAt
    );
  }

}