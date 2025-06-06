const { calculateLoyaltyPoints, analyzeLoyalty } = require("./loyalty.js");

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

describe("Bonus points", () => {
    test("should add 10 bonus points if total is more than 200€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 100 },
                { type: "premium", price: 110 },
            ])
        ).toBe(
            // 100/10 = 10, 10*1 = 10 (standard)
            // 110/10 = 11, 11*2 = 22 (premium)
            // total = 32 + 10 bonus = 42
            42
        );
    });

    test("should not add bonus points if total is exactly 200€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 100 },
                { type: "premium", price: 100 },
            ])
        ).toBe(
            // 100/10 = 10, 10*1 = 10 (standard)
            // 100/10 = 10, 10*2 = 20 (premium)
            // total = 30, no bonus
            30
        );
    });

    test("should not add bonus points if total is less than 200€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 50 },
                { type: "premium", price: 100 },
            ])
        ).toBe(
            // 50/10 = 5, 5*1 = 5 (standard)
            // 100/10 = 10, 10*2 = 20 (premium)
            // total = 25, no bonus
            25
        );
    });
    test("should add only 10 bonus points even if total is more than 400€", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 200 },
                { type: "premium", price: 210 },
            ])
        ).toBe(
            // 200/10 = 20, 20*1 = 20 (standard)
            // 210/10 = 21, 21*2 = 42 (premium)
            // total = 62 + 10 bonus = 72
            72
        );
    });

    test("should not add bonus points for zero total", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 0 },
                { type: "premium", price: 0 },
            ])
        ).toBe(0);
    });

    test("should not add bonus points for negative total", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: -10 },
                { type: "premium", price: -20 },
            ])
        ).toBe(0);
    });

    test("should handle cart with only one expensive product (bonus applies)", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "premium", price: 250 }
            ])
        ).toBe(
            // 250/10 = 25, 25*2 = 50 + 10 bonus = 60
            60
        );
    });

    test("should handle cart with only one expensive product (no bonus)", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 199.99 }
            ])
        ).toBe(
            // 199.99/10 = 19, 19*1 = 19, no bonus
            19
        );
    });

    test("should handle cart with mixed products and floating point prices", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 19.99 }, // 1 point
                { type: "premium", price: 29.99 },  // 4 points
                { type: "standard", price: 39.99 }, // 3 points
                { type: "premium", price: 49.99 },  // 8 points
            ])
        ).toBe(
            // standard: 19.99/10 = 1, 1*1 = 1
            // premium: 29.99/10 = 2, 2*2 = 4
            // standard: 39.99/10 = 3, 3*1 = 3
            // premium: 49.99/10 = 4, 4*2 = 8
            // total = 1+4+3+8 = 16, no bonus
            16
        );
    });
});
describe("Invalid prices", () => {
    test("should ignore products with price 0", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 0 },
                { type: "premium", price: 0 },
                { type: "standard", price: 10 }
            ])
        ).toBe(1);
    });

    test("should ignore products with negative prices", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: -10 },
                { type: "premium", price: -20 },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should ignore products with null price", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: null },
                { type: "premium", price: null },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should ignore products with undefined price", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: undefined },
                { type: "premium", price: undefined },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should ignore products with price as a string", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: "10" },
                { type: "premium", price: "20" },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should ignore products with price as an array", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: [10] },
                { type: "premium", price: [20] },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should ignore products with price as an object", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: { amount: 10 } },
                { type: "premium", price: { amount: 20 } },
                { type: "standard", price: 20 }
            ])
        ).toBe(2);
    });

    test("should return 0 if all products have invalid prices", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: null },
                { type: "premium", price: undefined },
                { type: "standard", price: "10" },
                { type: "premium", price: [20] },
                { type: "standard", price: { amount: 10 } }
            ])
        ).toBe(0);
    });

    test("should handle mix of valid and invalid prices", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 10 },      // 1
                { type: "premium", price: "20" },     // invalid
                { type: "standard", price: undefined },// invalid
                { type: "premium", price: 20 },       // 4
                { type: "standard", price: null },    // invalid
                { type: "premium", price: [30] },     // invalid
                { type: "standard", price: 30 }       // 3
            ])
        ).toBe(8);
    });
});

describe("analyzeLoyalty", () => {
    test("should return totalPoints and bonusApplied=false for total <= 200€", () => {
        expect(
            analyzeLoyalty([
                { type: "standard", price: 100 }, // 10
                { type: "premium", price: 90 }    // 18
            ])
        ).toEqual({ totalPoints: 28, bonusApplied: false });
    });

    test("should return totalPoints and bonusApplied=true for total > 200€", () => {
        expect(
            analyzeLoyalty([
                { type: "standard", price: 150 }, // 15
                { type: "premium", price: 100 }   // 20
            ])
        ).toEqual({ totalPoints: 45, bonusApplied: true }); // 35+10
    });

    test("should return bonusApplied=false for total exactly 200€", () => {
        expect(
            analyzeLoyalty([
                { type: "standard", price: 100 }, // 10
                { type: "premium", price: 100 }   // 20
            ])
        ).toEqual({ totalPoints: 30, bonusApplied: false });
    });

    test("should return 0 and bonusApplied=false for empty cart", () => {
        expect(analyzeLoyalty([])).toEqual({ totalPoints: 0, bonusApplied: false });
    });

    test("should ignore invalid prices", () => {
        expect(
            analyzeLoyalty([
                { type: "standard", price: null },
                { type: "premium", price: undefined },
                { type: "standard", price: "10" },
                { type: "premium", price: [20] },
                { type: "standard", price: 20 } // 2
            ])
        ).toEqual({ totalPoints: 2, bonusApplied: false });
    });

    test("should handle floating point prices and bonus", () => {
        expect(
            analyzeLoyalty([
                { type: "standard", price: 199.99 }, // 19
                { type: "premium", price: 10.01 }    // 2
            ])
        ).toEqual({ totalPoints: 31, bonusApplied: true });
    });

    test("should apply bonus only once even if total is much higher", () => {
        expect(
            analyzeLoyalty([
                { type: "premium", price: 500 } // 100
            ])
        ).toEqual({ totalPoints: 110, bonusApplied: true });
    });
});

describe("Performance", () => {
    test("should calculate points efficiently for 1 000 000 products", () => {
        const products = [];
        let total = 0;
        const productsCount = 1000000;
        for (let i = 0; i < productsCount / 2; i++) {
            products.push({ type: "standard", price: 20 }); // 2 points each
            products.push({ type: "premium", price: 30 });  // 6 points each
            total += 8;
        }
        if (total > 200) {
            total += 10; // bonus
        }
        expect(calculateLoyaltyPoints(products)).toBe(total);
    });
});
describe("Invalid products", () => {
    test("should ignore empty product objects", () => {
        expect(
            calculateLoyaltyPoints([
                {},
                { type: "standard", price: 10 }
            ])
        ).toBe(1);
    });

    test("should ignore products with missing type", () => {
        expect(
            calculateLoyaltyPoints([
                { price: 20 },
                { type: "premium", price: 10 }
            ])
        ).toBe(2);
    });

    test("should treat products with invalid type as standard", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "gold", price: 100 },      // treated as standard: 10 points
                { type: "standard", price: 20 }    // 2 points
            ])
        ).toBe(12);
    });

    test("should treat products with type as null or undefined as standard", () => {
        expect(
            calculateLoyaltyPoints([
                { type: null, price: 20 },         // treated as standard: 2 points
                { type: undefined, price: 30 },    // treated as standard: 3 points
                { type: "premium", price: 10 }     // 2 points
            ])
        ).toBe(7);
    });

    test("should ignore products that are not objects", () => {
        expect(
            calculateLoyaltyPoints([
                null,
                undefined,
                42,
                "product",
                [],
                { type: "standard", price: 10 }
            ])
        ).toBe(1);
    });

    test("should return 0 if all products are invalid", () => {
        expect(
            calculateLoyaltyPoints([
                null,
                undefined,
                42,
                "product",
                [],
                {},
                { type: "gold", price: 5 } // price < 10, treated as standard, 0 points
            ])
        ).toBe(0);
    });

    test("should handle mix of valid and invalid products", () => {
        expect(
            calculateLoyaltyPoints([
                { type: "standard", price: 10 }, // 1
                {},
                { type: "gold", price: 100 },    // treated as standard: 10
                null,
                { type: "premium", price: 20 }   // 4
            ])
        ).toBe(15);
    });
});