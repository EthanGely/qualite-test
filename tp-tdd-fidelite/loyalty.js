/**
 * @typedef {Object} CartItem
 * @property {number} price - The price of the item (must be >= 0)
 * @property {string} type - The type of the item ('premium' or other)
 */

// Constants for loyalty calculation
const BONUS_THRESHOLD = 200; // Minimum total to get bonus points
const BONUS_POINTS = 10;     // Bonus points awarded if threshold is met
const POINTS_DIVISOR = 10;   // Points per this amount spent

/**
 * Calculates the total points and total price for a cart.
 * @param {CartItem[]} cart
 * @returns {{ points: number, total: number }}
 */
function getPointsAndTotal(cart) {
    if (!Array.isArray(cart)) {
        throw new TypeError('Cart must be an array');
    }
    return cart.reduce(
        (acc, item) => {
            if (
                !item ||
                typeof item.price !== 'number' ||
                item.price < 0
            ) {
                return acc;
            }
            const rate = (item.type ?? '') === 'premium' ? 2 : 1;
            acc.points += rate * Math.floor(item.price / POINTS_DIVISOR);
            acc.total += item.price;
            return acc;
        },
        { points: 0, total: 0 }
    );
}

/**
 * Calculates loyalty points for a cart.
 * @param {CartItem[]} cart
 * @returns {number}
 */
function calculateLoyaltyPoints(cart) {
    const { points, total } = getPointsAndTotal(cart);
    return total > BONUS_THRESHOLD ? points + BONUS_POINTS : points;
}

/**
 * Analyzes loyalty points and bonus application.
 * @param {CartItem[]} cart
 * @returns {{ totalPoints: number, bonusApplied: boolean }}
 */
function analyzeLoyalty(cart) {
    const { points, total } = getPointsAndTotal(cart);
    const bonusApplied = total > BONUS_THRESHOLD;
    return {
        totalPoints: bonusApplied ? points + BONUS_POINTS : points,
        bonusApplied
    };
}

module.exports = { calculateLoyaltyPoints, analyzeLoyalty };