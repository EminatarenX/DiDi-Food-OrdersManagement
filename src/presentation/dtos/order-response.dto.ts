// presentation/dtos/order-response.dto.ts
export class OrderResponseDto {
  id: string;
  customerId: string;
  restaurantId: string;
  status: string;
  deliveryAddress: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
  };
  items: {
    productId: string;
    quantity: number;
    price: number;
    currency: string;
    specialInstructions: string | null;
  }[];
}
