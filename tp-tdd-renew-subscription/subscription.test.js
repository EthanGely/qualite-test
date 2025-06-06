const { canRenewSubscription } = require("./subscription.js");

describe("canRenewSubscription", () => {
  test("should not allow renewal if already renewed", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: true,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });
});