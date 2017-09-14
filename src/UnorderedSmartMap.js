import SmartMap from './SmartMap'

export default class UnorderedSmartMap {

  constructor() {
    this.smartMap = new SmartMap()
  };

  set(coordinates, value) {
    const sortedCoordinates = this.sortCoordinates(coordinates)
    return this.smartMap.set(sortedCoordinates, value)
  }

  get(coordinates) {
    const sortedCoordinates = this.sortCoordinates(coordinates)
    return this.smartMap.get(sortedCoordinates)
  }

  sortCoordinates(coordinates) {
    const x = coordinates[0]
    const y = coordinates[1]
    if (x>y) {coordinates = [y, x]}
    return coordinates
  }
}
