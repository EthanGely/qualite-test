function canRenewSubscription(subscription, currentDate) {

    if (subscription.hasBeenRenewed) return false;
    if (subscription.unpaidDebt) return false;
    if (subscription.isTrial) return false;
    if (subscription.status !== 'active') return false;
    return true;
}

module.exports = { canRenewSubscription };