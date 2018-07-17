const { expect } = require('chai');
const Soldier = require('../soldier');
const Constants = require('../constants');

describe('soldier', () => {

    let soldiers = [
        new Soldier(100, 50, 0),
        new Soldier(0, 0, 0),
        new Soldier(100, 2000, 50)
    ];

    describe('compute attack probability', () => {

        it('should return value >= 0', () => {
            soldiers.forEach((soldier) => {
                expect(soldier.computeAttackProb()).not.to.be.lessThan(0);
            });
        });

        it('should return value <= 1', () => {
            soldiers.forEach((soldier) => {
                expect(soldier.computeAttackProb()).not.to.be.greaterThan(1);
            });
        });
    });

    describe('compute damage', () => {

        it('should not exceed some value', () => {
            soldiers.forEach((soldier) => {
                expect(soldier.computeDamage()).not.to.be.greaterThan(Constants.SOLDIER_MIN_DAMAGE + 0.5);
            });
        });
    });
    
});