const { canRenewSubscription, getRenewalReason } = require("./subscription.js");

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

    // should allow renewal if all conditions are met
    test("should allow renewal if all conditions are met", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(true);
  }
  );

    // should allow renewal if current date is not provided
    test("should allow renewal if current date is not provided", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription, null)).toBe(true);
  }
  );

  //test with same date as end date
  test("should allow renewal if current date is the same as end date", () => {
    const subscription = {
      status: 'active',
      endDate: '2099-12-31',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription, '2099-12-31')).toBe(true);
  });
});

describe("canRenewSubscription with invalid inputs", () => {
  // should return false if subscription is null
  test("should return false if subscription is null", () => {
    expect(canRenewSubscription(null)).toBe(false);
  });

  // should return false if subscription is undefined
  test("should return false if subscription is undefined", () => {
    expect(canRenewSubscription(undefined)).toBe(false);
  });

  // should return false if endDate is not a valid date
  test("should return false if endDate is not a valid date", () => {
    const subscription = {
      status: 'active',
      endDate: 'invalid-date',
      hasBeenRenewed: false,
      unpaidDebt: false,
      isTrial: false,
    };
    expect(canRenewSubscription(subscription)).toBe(false);
  });
}
);

// check renewal reason
describe("getRenewalReason", () => {
  test("should return 'alreadyRenewed' if hasBeenRenewed is true", () => {
    const subscription = {
      hasBeenRenewed: true,
      endDate: '2099-12-31',
      unpaidDebt: false,
      isTrial: false,
      status: 'active',
    };
    expect(getRenewalReason(subscription)).toBe('alreadyRenewed');
  });

  test("should return 'unpaidDebt' if unpaidDebt is true", () => {
    const subscription = {
      hasBeenRenewed: false,
      endDate: '2099-12-31',
      unpaidDebt: true,
      isTrial: false,
      status: 'active',
    };
    expect(getRenewalReason(subscription)).toBe('unpaidDebt');
  });

  test("should return 'trial' if isTrial is true", () => {
    const subscription = {
      hasBeenRenewed: false,
      endDate: '2099-12-31',
      unpaidDebt: false,
      isTrial: true,
      status: 'active',
    };
    expect(getRenewalReason(subscription)).toBe('trial');
  });

  test("should return 'expired' if status is not active", () => {
    const subscription = {
      hasBeenRenewed: false,
      endDate: '2099-12-31',
      unpaidDebt: false,
      isTrial: false,
      status: 'expired',
    };
    expect(getRenewalReason(subscription)).toBe('expired');
  });

  test("should return 'OK' if all conditions are met", () => {
    const subscription = {
      hasBeenRenewed: false,
      endDate: '2099-12-31',
      unpaidDebt: false,
      isTrial: false,
      status: 'active',
    };
    expect(getRenewalReason(subscription)).toBe('OK');
  });
});

// massive calls
describe("massive calls", () => {
  test("should handle massive calls without performance issues", () => {
    const subscription = {
      hasBeenRenewed: false,
      endDate: '2099-12-31',
      unpaidDebt: false,
      isTrial: false,
      status: 'active',
    };
    
    for (let i = 0; i < 10000; i++) {
      expect(canRenewSubscription(subscription)).toBe(true);
      expect(getRenewalReason(subscription)).toBe('OK');
    }
  });
});
