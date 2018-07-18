const { expect } = require('chai');
const Vehicle = require('../vehicle');
const Soldier = require('../soldier');
const Constants = require('../constants');

describe('vehicle', () => {

    let vehicle0 = new Vehicle(0, 1000);
    let vehicle1 = new Vehicle(0, 1000);
    let vehicle2 = new Vehicle(100, 1000);
    let vehicle3 = new Vehicle(100, 2000);
    let vehicle4 = new Vehicle(100, 1000);
    vehicle4.addSoldier(new Soldier(100, 1000, 0));
    let vehicle5 = new Vehicle(100, 1000);
    vehicle5.addSoldier(new Soldier(100, 1000, 0));
    let vehicle6 = new Vehicle(100, 1000);
    vehicle6.addSoldier(new Soldier(100, 1000, 50));
    vehicle6.addSoldier(new Soldier(100, 1000, 50));
    vehicle6.addSoldier(new Soldier(100, 1000, 50));

    let vehicles = [
        vehicle0, vehicle1, vehicle2, vehicle3,
        vehicle4
    ]

    describe('compute attack probability', () => {

        it('should return value >= 0', () => {
            vehicles.forEach((vehicle) => {
                expect(vehicle.computeAttackProb()).not.to.be.lessThan(0);
            });
        });

        it('should return value <= 1', () => {
            vehicles.forEach((vehicle) => {
                expect(vehicle.computeAttackProb()).not.to.be.greaterThan(1);
            });
        });
    });

    describe('compute damage', () => {

        it('should not exceed some value', () => {
            vehicles.forEach((vehicle) => {
                expect(vehicle.computeDamage()).not.to.be.greaterThan(Constants.VEHICLE_MIN_DAMAGE + vehicle._soldiers.length * 50.0 / 100.0);
            });
        });
    });
    
});