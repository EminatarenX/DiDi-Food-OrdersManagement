// Archivo: prisma-order.repository.ts (CORREGIDO)

import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from "../../../generated/prisma/client"
import { Order } from 'src/domain/entities/order.entity';
import { OrderRepository } from 'src/domain/interfaces/order.repository';
import { OrderStatus } from 'src/domain/vo/order-status.vo';


@Injectable()
export class PrismaOrderRepository extends PrismaClient implements OrderRepository, OnModuleInit{
    async onModuleInit() {
        await this.$connect();
    }
  
  async save(order: Order): Promise<Order> {
    const data = this.toPrisma(order);

    const saved = await this.$transaction(async (prisma) => {

      await prisma.orderItem.deleteMany({
        where: { orderId: order.id },
      });

   
      const upsertedOrder = await prisma.order.upsert({
        where: { id: order.id },
        update: data,
        create: data, 
        include: { items: true },
      });

      return upsertedOrder;
    });

    return this.toDomain(saved);
  }

  async findById(orderId: string): Promise<Order | null> {
    const record = await this.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    console.log(JSON.stringify(record, null, 2)) 
    return record ? this.toDomain(record) : null;
  }

  async findByCustomerId(customerId: string): Promise<Order[]> {
    const records = await this.order.findMany({
      where: { customerId },
      include: { items: true },
    });
    console.log(JSON.stringify(records, null, 2))
    return records.map(this.toDomain);
  }

  async updateStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
    await this.order.update({
      where: { id: orderId },
      data: { status: orderStatus.status},
    });
  }

  async delete(orderId: string): Promise<void> {
    await this.order.delete({
      where: { id: orderId },
    });
  }
  
  // 👇 MAPPER CORREGIDO: Eliminamos 'deleteMany'
  private toPrisma(order: Order) {
    return {
      id: order.id,
      customerId: order.customerId,
      restaurantId: order.restaurantId,
      status: order.status.status,
      // Asumiendo que deliveryAddress es un tipo Compuesto en tu schema.prisma
      deliveryAddress: {
        street: order.deliveryAddress.street,
        number: order.deliveryAddress.number,
        city: order.deliveryAddress.city,
        postalCode: order.deliveryAddress.postalCode,
        latitude: order.deliveryAddress.gpsCoordinates.lat,
        longitude: order.deliveryAddress.gpsCoordinates.lng,
      },
      items: {
        // Ya no intentamos borrar aquí. Solo definimos los items a crear.
        create: order.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity.value,
          price: item.price.amount,
          currency: item.price.currency,
          specialInstructions: item.specialInstructions?.text ?? null,
        })),
      },
    };
  }

  private toDomain(record: any): Order {
    return Order.fromPrisma(record);
  }
}