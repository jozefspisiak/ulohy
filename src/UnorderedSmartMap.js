import SmartMap from './SmartMap';

export default class UnorderedSmartMap {

    constructor() {
        this.smartMap = new SmartMap();
    };

    set(coordinates, value) {
        let sortedCoordinates = this.sortCoordinates(coordinates);
        return this.smartMap.set(sortedCoordinates,value);
    }

    get(coordinates) {
        let sortedCoordinates = this.sortCoordinates(coordinates);
        return this.smartMap.get(sortedCoordinates);
    }

    sortCoordinates(coordinates) {
      let x = coordinates[0];
      let y = coordinates[1];
      if (x>y)
          coordinates = [y,x];
      return coordinates;
    }
}
