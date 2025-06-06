
import { Type } from "class-transformer";
import {  IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from "class-validator";
import { PriceDto } from "./price.dto"; // 👈 1. Importar el nuevo DTO

export class OrderItemDto {
  @IsUUID() // ✨ Mejora: Validar que sea un UUID
  productId: string;

  @IsNumber()
  @IsPositive() // La cantidad no puede ser negativa
  quantity: number;

  @ValidateNested() // Le dice al validador que valide este objeto anidado
  @Type(() => PriceDto) // Le dice a class-transformer qué clase usar para el objeto
  price: PriceDto;

  @IsString()
  @IsOptional() // Es opcional
  specialInstructions?: string;
}