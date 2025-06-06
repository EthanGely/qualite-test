function canRenewSubscription(subscription, currentDate) {
    if (
        !subscription ||
        typeof subscription !== 'object' ||
        !subscription.endDate ||
        typeof subscription.hasBeenRenewed !== 'boolean' ||
        typeof subscription.unpaidDebt !== 'boolean' ||
        typeof subscription.isTrial !== 'boolean' ||
        typeof subscription.status !== 'string'
    ) {
        return false;
    }

    if (subscription.hasBeenRenewed) return false;
    if (subscription.unpaidDebt) return false;
    if (subscription.isTrial) return false;
    if (subscription.status !== 'active') return false;
    if (isNaN(Date.parse(subscription.endDate))) return false;
    const now = currentDate ? new Date(currentDate) : new Date();
    if (isNaN(now)) return false;
    if (new Date(subscription.endDate) < now) return false;
    return true;
}

function getRenewalReason(subscription, currentDate) {
    if (subscription.hasBeenRenewed) return 'alreadyRenewed';
    if (subscription.unpaidDebt) return 'unpaidDebt';
    if (subscription.isTrial) return 'trial';
    if (subscription.status !== 'active') return 'expired';
    const now = currentDate ? new Date(currentDate) : new Date();
    if (new Date(subscription.endDate) < now) return 'expired';
    return 'OK';
}
module.exports = { canRenewSubscription, getRenewalReason };