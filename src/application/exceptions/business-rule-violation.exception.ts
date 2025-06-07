export class BusinessRuleViolationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BusinessRuleViolationException';
        Object.setPrototypeOf(this, BusinessRuleViolationException.prototype);
    }
}