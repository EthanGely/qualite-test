function calculateLoyaltyPoints(cart) {
    return cart.reduce((points, item) => {
        const rate = item.type === 'premium' ? 2 : 1;
        return points + rate * Math.floor(item.price / 10);
    }, 0);
}

module.exports = { calculateLoyaltyPoints };