const { createCart, addItem, removeItem, applyDiscount, clearCart } = require('./cart.js');

describe('createCart', () => {
    test('should create an empty cart', () => {
        const cart = createCart();
        expect(cart).toEqual({ items: [], total: 0 });
    });

    test('should create a new independent cart each time', () => {
        const cart1 = createCart();
        const cart2 = createCart();
        expect(cart1).not.toBe(cart2);
        cart1.items.push({ id: 1 });
        expect(cart2.items.length).toBe(0);
    });
});

describe('addItem', () => {
    let cart;
    beforeEach(() => {
        cart = createCart();
    });

    test.each([
        [{ id: 1, name: 'Book', price: 10, quantity: 2 }, 1, 20],
        [{ id: 2, name: 'Pen', price: 2, quantity: 5 }, 1, 10],
    ])('adds item %o to cart', (item, expectedLength, expectedTotal) => {
        addItem(cart, item);
        expect(cart.items.length).toBe(expectedLength);
        expect(cart.total).toBe(expectedTotal);
    });

    test('adds quantity if item already exists', () => {
        addItem(cart, { id: 1, name: 'Book', price: 10, quantity: 2 });
        addItem(cart, { id: 1, name: 'Book', price: 10, quantity: 3 });
        expect(cart.items[0].quantity).toBe(5);
        expect(cart.total).toBe(50);
    });

    test('adds multiple different items', () => {
        addItem(cart, { id: 1, name: 'Book', price: 10, quantity: 1 });
        addItem(cart, { id: 2, name: 'Pen', price: 2, quantity: 5 });
        expect(cart.items.length).toBe(2);
        expect(cart.total).toBe(20);
    });

    test('limit case: add item with quantity 0', () => {
        addItem(cart, { id: 3, name: 'Pencil', price: 1, quantity: 0 });
        expect(cart.items.length).toBe(1);
        expect(cart.total).toBe(0);
    });

    test('error case: add item with negative price', () => {
        addItem(cart, { id: 4, name: 'Eraser', price: -5, quantity: 2 });
        expect(cart.total).toBe(-10);
    });

    test('add item with negative quantity', () => {
        addItem(cart, { id: 5, name: 'Marker', price: 3, quantity: -2 });
        expect(cart.items.length).toBe(1);
        expect(cart.total).toBe(-6);
    });

    test('add item with zero price', () => {
        addItem(cart, { id: 6, name: 'Gift', price: 0, quantity: 10 });
        expect(cart.items.length).toBe(1);
        expect(cart.total).toBe(0);
    });

    test('add two items with same id but different price', () => {
        addItem(cart, { id: 7, name: 'Notebook', price: 5, quantity: 1 });
        addItem(cart, { id: 7, name: 'Notebook', price: 10, quantity: 2 });
        expect(cart.items.length).toBe(1);
        expect(cart.items[0].quantity).toBe(3);
        // The total will be 5*1 + 10*2 = 25
        expect(cart.total).toBe(25);
    });

    test('add item with missing fields', () => {
        expect(() => addItem(cart, { id: 8 })).not.toThrow();
        expect(cart.items.length).toBe(1);
        // price and quantity are undefined, so total will be NaN
        expect(Number.isNaN(cart.total)).toBe(true);
    });
});

describe('removeItem', () => {
    let cart;
    beforeEach(() => {
        cart = createCart();
        addItem(cart, { id: 1, name: 'Book', price: 10, quantity: 2 });
        addItem(cart, { id: 2, name: 'Pen', price: 2, quantity: 5 });
    });

    test.each([
        [1, 1, 10], // Remove Book
        [2, 1, 20], // Remove Pen
    ])('removes item with id %i', (itemId, expectedLength, expectedTotal) => {
        removeItem(cart, itemId);
        expect(cart.items.length).toBe(1);
        expect(cart.total).toBe(itemId === 1 ? 10 : 20);
    });

    test('limit case: remove item not in cart', () => {
        removeItem(cart, 999);
        expect(cart.items.length).toBe(2);
        expect(cart.total).toBe(30);
    });

    test('limit case: remove all items', () => {
        removeItem(cart, 1);
        removeItem(cart, 2);
        expect(cart.items.length).toBe(0);
        expect(cart.total).toBe(0);
    });

    test('remove item from empty cart', () => {
        const emptyCart = createCart();
        removeItem(emptyCart, 1);
        expect(emptyCart.items.length).toBe(0);
        expect(emptyCart.total).toBe(0);
    });

    test('remove item with negative id', () => {
        removeItem(cart, -1);
        expect(cart.items.length).toBe(2);
        expect(cart.total).toBe(30);
    });

    test('remove item twice', () => {
        removeItem(cart, 1);
        removeItem(cart, 1);
        expect(cart.items.length).toBe(1);
        expect(cart.total).toBe(10);
    });
});

describe('applyDiscount', () => {
    let cart;
    beforeEach(() => {
        cart = createCart();
        addItem(cart, { id: 1, name: 'Book', price: 100, quantity: 1 });
    });

    test.each([
        ['WELCOME10', 90],
        ['SUMMER20', 80],
    ])('applies discount code %s', (code, expectedTotal) => {
        applyDiscount(cart, code);
        expect(cart.total).toBeCloseTo(expectedTotal);
    });

    test('limit case: apply discount to cart with total 0', () => {
        cart = createCart();
        applyDiscount(cart, 'WELCOME10');
        expect(cart.total).toBe(0);
    });

    test('error case: invalid discount code', () => {
        expect(() => applyDiscount(cart, 'INVALID')).toThrow('Invalid discount code');
    });

    test('apply discount twice', () => {
        applyDiscount(cart, 'WELCOME10');
        expect(cart.total).toBeCloseTo(90);
        applyDiscount(cart, 'SUMMER20');
        expect(cart.total).toBeCloseTo(72);
    });

    test('apply discount with lowercase code (should fail)', () => {
        expect(() => applyDiscount(cart, 'welcome10')).toThrow('Invalid discount code');
    });

    test('apply discount with empty string', () => {
        expect(() => applyDiscount(cart, '')).toThrow('Invalid discount code');
    });

    test('apply discount with null', () => {
        expect(() => applyDiscount(cart, null)).toThrow('Invalid discount code');
    });

    test('apply discount with undefined', () => {
        expect(() => applyDiscount(cart, undefined)).toThrow('Invalid discount code');
    });
});

describe('clearCart', () => {
    let cart;
    beforeEach(() => {
        cart = createCart();
        addItem(cart, { id: 1, name: 'Book', price: 10, quantity: 2 });
        addItem(cart, { id: 2, name: 'Pen', price: 2, quantity: 5 });
    });

    test('clears all items and total', () => {
        clearCart(cart);
        expect(cart.items.length).toBe(0);
        expect(cart.total).toBe(0);
    });

    test('clears an already empty cart', () => {
        const emptyCart = createCart();
        clearCart(emptyCart);
        expect(emptyCart.items.length).toBe(0);
        expect(emptyCart.total).toBe(0);
    });

    test('clears cart with one item', () => {
        addItem(cart, { id: 3, name: 'Pencil', price: 1, quantity: 1 });
        clearCart(cart);
        expect(cart.items.length).toBe(0);
        expect(cart.total).toBe(0);
    });
});