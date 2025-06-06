// Archivo: delivery-address.dto.ts (CORREGIDO)

import { IsLatitude, IsLongitude, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class DeliveryAddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsNumber()
  number: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;
}