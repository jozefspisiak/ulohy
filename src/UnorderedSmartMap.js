import SmartMap from './SmartMap';

export default class UnorderedSmartMap {

    constructor() {
        this.smartMap = new SmartMap();
    };

    set(coordinates, value) {
        let x = coordinates[0];
        let y = coordinates[1];
        if (x>y)
            coordinates = [y,x];
        return this.smartMap.set(coordinates,value);
    }

    get(coordinates) {
        let x = coordinates[0];
        let y = coordinates[1];
        if (x>y)
            coordinates = [y,x];
        return this.smartMap.get(coordinates);
    }
}
