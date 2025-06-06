export class SpecialInstructions {
    constructor(public readonly text: string) {
        if(text.length > 500) throw new Error("Instructions too long (500 characters max)");
    }
}