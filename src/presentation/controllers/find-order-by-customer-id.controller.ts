import { Controller, Get, Param } from "@nestjs/common";
import { FindOrdersByCustomerIdUseCase } from "src/application/use-cases/find-order-by-customer.uc";
import { FindOrdersDto } from "../dtos/find-orders.dto";


@Controller('orders')
export class FindOrderByCustomerIdController { 
    constructor(
        private readonly findOrderByCustomerIdUseCase: FindOrdersByCustomerIdUseCase 
    ) {}

    @Get("customer/:customerId")
    async findOrderByCustomerId(@Param() params: FindOrdersDto){
        return {
            message: "Orders found successfully",
            code: 200,
            data: await this.findOrderByCustomerIdUseCase.execute(params.customerId)
        }
    }
}