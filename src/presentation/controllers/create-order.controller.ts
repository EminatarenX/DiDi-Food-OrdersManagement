import { Body, Controller, Post } from "@nestjs/common";
import { CreateOrderUseCase } from "src/application/use-cases/create-order.uc";
import { CreateOrderDto } from "../dtos/create-order.dto";

@Controller('orders')
export class CreateOrderController {
  constructor(private readonly createOrderUseCase: CreateOrderUseCase) {} 
    
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return {
      message: "Order created successfully",
      code: 201,
      data: await this.createOrderUseCase.execute(createOrderDto)
    }
  }
}