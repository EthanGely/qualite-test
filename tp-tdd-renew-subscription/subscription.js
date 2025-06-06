function canRenewSubscription(subscription, currentDate) {

    if (subscription.hasBeenRenewed) return false;
    if (subscription.unpaidDebt) return false;
    if (subscription.isTrial) return false;
    return true;
}

module.exports = { canRenewSubscription };