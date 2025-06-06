export class DeliveryAddress {
    constructor(
        public readonly street: string,
        public readonly city: string,
        public readonly number: number,
        public readonly postalCode: string,
        public readonly gpsCoordinates: { lat: number, lng: number }
    ){
        if(!street || !city || !postalCode) throw new Error("Street, city, and postal code are required");
    }
}