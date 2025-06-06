function canRenewSubscription(subscription, currentDate) {

    if (subscription.hasBeenRenewed) return false;
    return true;
}

module.exports = { canRenewSubscription };