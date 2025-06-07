import { Controller, Delete, Param } from "@nestjs/common";
import { DeleteOrderUseCase } from "src/application/use-cases/delete-order.uc";
import { DeleteOrderDto } from "../dtos/delete-order.dto";
import { BusinessRuleViolationException } from "src/application/exceptions/business-rule-violation.exception";

@Controller("orders")
export class DeleteOrderController {
  constructor(private readonly deleteOrderUseCase: DeleteOrderUseCase) {}
  @Delete(":orderId")
  async deleteOrder(@Param() params: DeleteOrderDto) {
    try {
      await this.deleteOrderUseCase.execute(params.orderId);
      return {
        message: "Order deleted successfully",
        code: 200,
        data: params.orderId,
      };
    } catch (error) {
        if(error instanceof BusinessRuleViolationException) { 
            return {
                message: error.message,
                code: 400,
                data: null
            };
        }
    }
  }
}
