import { Price } from "../vo/price.vo";
import { Quantity } from "../vo/quantity.vo";
import { SpecialInstructions } from "../vo/special-instructions.vo";

export class OrderItem {
    constructor(
        public readonly productId: string,
        public quantity: Quantity,
        public price: Price,
        public specialInstructions?: SpecialInstructions 
    ){}

    getTotal() : Price {
        return new Price(this.price.amount * this.quantity.value, this.price.currency)
    }

    updateQuantity(newQuantity: number) : void {
        this.quantity = new Quantity(newQuantity);
    }

    updateInstructions(newInstructions: string) : void {
        this.specialInstructions = new SpecialInstructions(newInstructions);
    }
}