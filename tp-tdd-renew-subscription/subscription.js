function isValidSubscription(subscription) {
    return (
        subscription &&
        typeof subscription === 'object' &&
        typeof subscription.endDate === 'string' &&
        typeof subscription.hasBeenRenewed === 'boolean' &&
        typeof subscription.unpaidDebt === 'boolean' &&
        typeof subscription.isTrial === 'boolean' &&
        typeof subscription.status === 'string' &&
        !isNaN(Date.parse(subscription.endDate))
    );
}

function getNow(currentDate) {
    const now = currentDate ? new Date(currentDate) : new Date();
    return isNaN(now) ? null : now;
}

function canRenewSubscription(subscription, currentDate) {
    if (!isValidSubscription(subscription)) return false;

    if (
        subscription.hasBeenRenewed ||
        subscription.unpaidDebt ||
        subscription.isTrial ||
        subscription.status !== 'active'
    ) {
        return false;
    }

    const now = getNow(currentDate);
    if (!now) return false;

    if (new Date(subscription.endDate) < now) return false;

    return true;
}

function getRenewalReason(subscription, currentDate) {
    if (!isValidSubscription(subscription)) return 'invalid';

    if (subscription.hasBeenRenewed) return 'alreadyRenewed';
    if (subscription.unpaidDebt) return 'unpaidDebt';
    if (subscription.isTrial) return 'trial';
    if (subscription.status !== 'active') return 'expired';

    const now = getNow(currentDate);
    if (!now || new Date(subscription.endDate) < now) return 'expired';

    return 'OK';
}

module.exports = { canRenewSubscription, getRenewalReason };