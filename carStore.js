// carStore.js
const cars = [];

function addCar(brand, model, price, stock) {
    const car = { brand, model, price, stock };
    cars.push(car);
    return car;
}

function calculateTotalPrice(price, taxRate) {
    return price * (1 + taxRate);
}

function isCarInStock(model) {
    const car = cars.find(c => c.model === model);
    return car ? car.stock > 0 : false;
}

function sellCar(model) {
    const car = cars.find(c => c.model === model);
    if (car && car.stock > 0) {
        car.stock -= 1;
        return true;
    }
    return false;
}

module.exports = { addCar, calculateTotalPrice, isCarInStock, sellCar, cars };
