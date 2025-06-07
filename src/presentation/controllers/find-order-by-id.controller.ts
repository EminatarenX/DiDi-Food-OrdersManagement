import { Controller, Get, Param } from "@nestjs/common";
import { FindOrderByIdDto } from "../dtos/find-order-by-id.dto";
import { FindOrderByIdUseCase } from "src/application/use-cases/find-order-by-id.uc";
import { BusinessRuleViolationException } from "src/application/exceptions/business-rule-violation.exception";

@Controller("orders")
export class FindOrderByIdController {
  constructor(private readonly findOrderByIdUseCase: FindOrderByIdUseCase) {}
  @Get(":orderId")
  async findOrderById(@Param() params: FindOrderByIdDto) {
    try {
      const order = await this.findOrderByIdUseCase.execute(params.orderId);
      return {
        message: "Order found successfully",
        code: 200,
        data: order,
      };
    } catch (error) {
      if (error instanceof BusinessRuleViolationException) {
        return {
          message: error.message,
          code: 400,
          data: null,
        };
      }
    }
  }
}
