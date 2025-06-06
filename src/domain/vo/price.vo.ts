export class Price {
    constructor(
        public readonly amount: number,
        public readonly currency: string = 'mxn'
    ){
        if(amount < 0) throw new Error("Price cannot be negative");
    }
}