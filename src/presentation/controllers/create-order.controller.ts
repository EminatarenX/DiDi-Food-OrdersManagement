import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderUseCase } from "src/application/use-cases/create-order.uc";
import { CreateOrderDto } from "../dtos/create-order.dto";

@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {} 
    
  @Post()
  createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.createOrderUseCase.execute(createOrderDto);
  }
}