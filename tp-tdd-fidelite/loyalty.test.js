const { calculateLoyaltyPoints } = require("./loyalty.js");

describe("Standard Product", () => {
  test("should return 1 point for every 10€ spent", () => {
    expect(calculateLoyaltyPoints([{ type: "standard", price: 10 }])).toBe(1);
    expect(calculateLoyaltyPoints([{ type: "standard", price: 20 }])).toBe(2);
    expect(calculateLoyaltyPoints([{ type: "standard", price: 30 }])).toBe(3);
  });

  test("should return 0 points for less than 10€", () => {
    expect(calculateLoyaltyPoints([{ type: "standard", price: 9.99 }])).toBe(0);
    expect(calculateLoyaltyPoints([{ type: "standard", price: 5 }])).toBe(0);
  });
});

describe("Premium Product", () => {
  test("should return 2 point for every 10€ spent", () => {
    expect(calculateLoyaltyPoints([{ type: "premium", price: 10 }])).toBe(2);
    expect(calculateLoyaltyPoints([{ type: "premium", price: 20 }])).toBe(4);
    expect(calculateLoyaltyPoints([{ type: "premium", price: 30 }])).toBe(6);
  });

  test("should return 0 points for less than 10€", () => {
    expect(calculateLoyaltyPoints([{ type: "premium", price: 9.99 }])).toBe(0);
    expect(calculateLoyaltyPoints([{ type: "premium", price: 5 }])).toBe(0);
  });
});

describe("Multiple products", () => {
  test("should return 1 point for 10€ and 5€ standard products", () => {
    expect(
      calculateLoyaltyPoints([
        { type: "standard", price: 10 },
        { type: "standard", price: 5 },
      ])
    ).toBe(1);
  });

  test("should return 3 points for 20€ and 10€ standard products", () => {
    expect(
      calculateLoyaltyPoints([
        { type: "standard", price: 20 },
        { type: "standard", price: 10 },
      ])
    ).toBe(3);
  });

  test("should return 0 point for 5€ and 5€ standard products", () => {
    expect(
      calculateLoyaltyPoints([
        { type: "standard", price: 5 },
        { type: "standard", price: 5 },
      ])
    ).toBe(0);
  });

  test("should return 0 points for 2€ and 5€ standard products", () => {
    expect(
      calculateLoyaltyPoints([
        { type: "standard", price: 2 },
        { type: "standard", price: 5 },
      ])
    ).toBe(0);
  });
});

describe("Mixed type products", () => {
    test("should correctly sum points for standard and premium products", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 10 },   // 1 point
                { type: "premium", price: 10 },    // 2 points
            ])
        ).toBe(3);
    });

    test("should correctly handle products with prices below 10€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 5 },    // 0 point
                { type: "premium", price: 5 },     // 0 point
                { type: "standard", price: 10 },   // 1 point
                { type: "premium", price: 20 },    // 4 points
            ])
        ).toBe(5);
    });

    test("should return 0 points if all products are below 10€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 5 },
                { type: "premium", price: 9.99 },
                { type: "standard", price: 2 },
            ])
        ).toBe(0);
    });

    test("should handle empty cart", () => {
        expect(calculateLoyaltyPoints([])).toBe(0);
    });

    test("should handle multiple mixed products", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 25 },   // 2 points
                { type: "premium", price: 35 },    // 6 points
                { type: "standard", price: 9 },    // 0 point
                { type: "premium", price: 10 },    // 2 points
            ])
        ).toBe(10);
    });
});
