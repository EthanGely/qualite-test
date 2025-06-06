function getPointsAndTotal(cart) {
    return cart.reduce(
        (acc, item) => {
            if (typeof item.price !== 'number' || item.price < 0) return acc;
            const rate = item.type === 'premium' ? 2 : 1;
            acc.points += rate * Math.floor(item.price / 10);
            acc.total += item.price;
            return acc;
        },
        { points: 0, total: 0 }
    );
}

function calculateLoyaltyPoints(cart) {
    const { points, total } = getPointsAndTotal(cart);
    return (total > 200 && total > 0) ? points + 10 : points;
}

function analyzeLoyalty(cart) {
    const { points, total } = getPointsAndTotal(cart);
    const bonusApplied = total > 200 && total > 0;
    return {
        totalPoints: bonusApplied ? points + 10 : points,
        bonusApplied
    };
}

module.exports = { calculateLoyaltyPoints, analyzeLoyalty };