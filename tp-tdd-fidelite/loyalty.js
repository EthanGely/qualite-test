function calculateLoyaltyPoints(cart) {
    const points = cart.reduce((points, item) => {
        if (typeof item.price !== 'number' || item.price < 0) return points;
        const rate = item.type === 'premium' ? 2 : 1;
        return points + rate * Math.floor(item.price / 10);
    }, 0);
    const total = cart.reduce((sum, item) => (typeof item.price === 'number' && item.price > 0) ? sum + item.price : sum, 0);
    return (total > 200 && total > 0) ? points + 10 : points;
}

module.exports = { calculateLoyaltyPoints };