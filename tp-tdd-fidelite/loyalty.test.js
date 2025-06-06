const {calculateLoyaltyPoints} = require('./loyalty.js');

describe('standardProduct', () => {
    test('should return 1 point for every 10€ spent', () => {
        expect(calculateLoyaltyPoints(10)).toBe(1);
        expect(calculateLoyaltyPoints(20)).toBe(2);
        expect(calculateLoyaltyPoints(30)).toBe(3);
    });

    test('should return 0 points for less than 10€', () => {
        expect(calculateLoyaltyPoints(9.99)).toBe(0);
        expect(calculateLoyaltyPoints(5)).toBe(0);
    });
}
);