const { calculateLoyaltyPoints } = require("./loyalty.js");

describe("Standard Product", () => {
  test("should return 1 point for every 10€ spent", () => {
    expect(calculateLoyaltyPoints([{type: "standard", price: 10 }])).toBe(1);
    expect(calculateLoyaltyPoints([{type: "standard", price: 20 }])).toBe(2);
    expect(calculateLoyaltyPoints([{type: "standard", price: 30 }])).toBe(3);
  });

  test("should return 0 points for less than 10€", () => {
    expect(calculateLoyaltyPoints([{type: "standard", price: 9.99 }])).toBe(0);
    expect(calculateLoyaltyPoints([{type: "standard", price: 5 }])).toBe(0);
  });
});

describe("Premium Product", () => {
  test("should return 2 point for every 10€ spent", () => {
    expect(calculateLoyaltyPoints([{type: "premium", price: 10 }])).toBe(2);
    expect(calculateLoyaltyPoints([{type: "premium", price: 20 }])).toBe(4);
    expect(calculateLoyaltyPoints([{type: "premium", price: 30 }])).toBe(6);
  });

  test("should return 0 points for less than 10€", () => {
    expect(calculateLoyaltyPoints([{type: "premium", price: 9.99 }])).toBe(0);
    expect(calculateLoyaltyPoints([{type: "premium", price: 5 }])).toBe(0);
  });
});
