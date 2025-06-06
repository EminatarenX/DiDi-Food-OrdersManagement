// En una nueva carpeta/archivo, por ej: presentation/dtos/price.dto.ts
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class PriceDto {
    @IsNumber()
    @IsPositive() // El precio no puede ser negativo
    amount: number;

    @IsString()
    @IsNotEmpty()
    currency: string;
}