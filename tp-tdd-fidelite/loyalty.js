function calculateLoyaltyPoints(cart) {
    return cart.reduce((points, item) => {
        return points + Math.floor(item.price / 10);
    }, 0);
}

module.exports = { calculateLoyaltyPoints };