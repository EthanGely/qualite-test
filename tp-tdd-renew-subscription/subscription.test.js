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

  //Should not allow renewal if there is an unpaid debt
  test("should not allow renewal if there is an unpaid debt", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: false,
      unpaidDebt: true,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });

  // should not allow renewal if the subscription is in trial period
  test("should not allow renewal if the subscription is in trial period", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: true,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });

  // should not allow renewal if the subscription is expired
  test("should not allow renewal if the subscription is expired", () => {
    const subscription = {
      status: 'expired',
      endDate: '2023-01-01',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });

  // should not allow renewal if end date is in the past
  test("should not allow renewal if end date is in the past", () => {
    const subscription = {
      status: 'active',
      endDate: '2023-01-01',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });
});