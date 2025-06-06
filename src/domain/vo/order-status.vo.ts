export enum OrderStatusEnum {
  RECEIVED = 'Recibido',
  CONFIRMED = 'Confirmado',
  PREPARING = 'EnPreparación',
  READY = 'Listo',
  ON_THE_WAY = 'EnCamino',
  DELIVERED = 'Entregado',
  CANCELED = 'Cancelado',
}

export class OrderStatus {
    constructor(public readonly status: OrderStatusEnum) {
        if (!Object.values(OrderStatusEnum).includes(status)) {
        throw new Error(`Invalid order status: ${status}`);
        }
    }
}