const { expect } = require('chai');
const Squad = require('../squad');
const Vehicle = require('../vehicle');
const Soldier = require('../soldier');
const Constants = require('../constants');

describe('squad', () => {

    let squad1 = new Squad('');
    squad1.addUnit(new Soldier(100, 100, 0));

    let squad2 = new Squad('');
    squad2.addUnit(new Vehicle(100, 1000));

    let squad3 = new Squad('');
    squad3.addUnit(new Soldier(100, 100, 0));
    squad3.addUnit(new Vehicle(100, 1000));

    let squad4 = new Squad('');
    squad4.addUnit(new Soldier(100, 100, 0));
    let vehicle4 = new Vehicle(100, 1000);
    vehicle4.addSoldier(new Soldier(100, 100, 0));
    vehicle4.addSoldier(new Soldier(100, 100, 0));
    squad4.addUnit(vehicle4);

    let squads = [squad1, squad2, squad3, squad4];

    describe('compute attack probability', () => {

        it('should return value >= 0', () => {
            squads.forEach((squad) => {
                expect(squad.computeAttackProb()).not.to.be.lessThan(0);
            });
        });

        it('should return value <= 1', () => {
            squads.forEach((squad) => {
                expect(squad.computeAttackProb()).not.to.be.greaterThan(1);
            });
        });
    });
    
});