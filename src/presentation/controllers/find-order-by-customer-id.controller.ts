import { Controller, Get, Param } from "@nestjs/common";
import { IsUUID } from "class-validator";
import { FindOrdersByCustomerIdUseCase } from "src/application/use-cases/find-order-by-customer.uc";
import { FindOrdersDto } from "../dtos/find-orders.dto";


@Controller('orders')
export class FindOrderByCustomerIdController { 
    constructor(
        private readonly findOrderByCustomerIdUseCase: FindOrdersByCustomerIdUseCase 
    ) {}

    @Get("customer/:customerId")
    findOrderByCustomerId(@Param() params: FindOrdersDto){
        return this.findOrderByCustomerIdUseCase.execute(params.customerId);
    }
}