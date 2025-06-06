import { Type } from "class-transformer";
import { IsUUID, ValidateNested } from "class-validator";
import { DeliveryAddressDto } from "./delivery-address.dto";
import { OrderItemDto } from "./order-item.dto";

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  restaurantId: string;

  @ValidateNested()
  @Type(() => DeliveryAddressDto)
  deliveryAddress: DeliveryAddressDto;

  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
