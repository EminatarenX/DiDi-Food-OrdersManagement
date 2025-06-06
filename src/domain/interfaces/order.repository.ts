import { Order } from "../entities/order.entity"
import { OrderStatus } from "../vo/order-status.vo";

export interface OrderRepository {
    save(order: Order): Promise<Order>;
    findById(orderId: string): Promise<Order | null>;
    findByCustomerId(customerId: string): Promise<Order[]>;
    updateStatus(orderId: string, status: OrderStatus): Promise<void>;
    delete(orderId: string): Promise<void>;
}