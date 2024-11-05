// carStore.test.js
const { addCar, calculateTotalPrice, isCarInStock, sellCar, cars } = require('./carStore');

beforeEach(() => {
    // Limpiar el arreglo de autos antes de cada prueba
    cars.length = 0;
});

test('should add a new car to the store', () => {
    const car = addCar('Toyota', 'Corolla', 20000, 5);
    expect(car).toEqual({ brand: 'Toyota', model: 'Corolla', price: 20000, stock: 5 });
    expect(cars.length).toBe(1);
});

test('should calculate the total price with tax', () => {
    const price = 20000;
    const taxRate = 0.1; // 10%
    const totalPrice = calculateTotalPrice(price, taxRate);
    expect(totalPrice).toBe(22000); // 20000 + 10% tax
});

test('should return true if the car model is in stock', () => {
    addCar('Toyota', 'Corolla', 20000, 5);
    const inStock = isCarInStock('Corolla');
    expect(inStock).toBe(true);
});

test('should sell a car and decrease stock by 1', () => {
    addCar('Toyota', 'Corolla', 20000, 5);
    const sold = sellCar('Corolla');
    const car = cars.find(c => c.model === 'Corolla');
    expect(sold).toBe(true);
    expect(car.stock).toBe(4);
});

test('should return false when trying to sell a car that is out of stock', () => {
    addCar('Toyota', 'Camry', 25000, 0);
    const sold = sellCar('Camry');
    expect(sold).toBe(false);
});
