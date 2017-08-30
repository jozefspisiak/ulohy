import React, { Component } from 'react';
import SmartMap2 from './SmartMap2';

//tk as before
class UnorderedSmartMap extends Component {

    constructor(props) {
        super(props);
        this.smartMap2 = new SmartMap2();
    };

    set(coordinates, value) {
        //tk v podstate manualne sortis 2 prvkove pole.
        let x = coordinates[0];
        let y = coordinates[1];
        if (x>y)
            coordinates = [y,x];
        //tk pekny trik
        return this.smartMap2.set(coordinates,value);
    }

    get(coordinates) {
        let x = coordinates[0];
        let y = coordinates[1];
        if (x>y)
            coordinates = [y,x];
        return this.smartMap2.get(coordinates);
    }

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Unordered Smart Map</h1>
                </div>
                <p className="App-intro">
                    Run tests
                <br />
                </p>
                <pre>
                    sm = new UnorderedSmartMap(); <br />
                    sm.set([1, 2], 'foo') <br />
                    sm.set([2, 3], 'bar')<br />
                    console.log(sm.get([1, 2])) // returns 'foo'<br />
                    console.log(sm.get([2, 1])) // returns 'foo'<br />
                    console.log(sm.get([1, 1])) // returns undefined
                </pre>
            </div>
        );
    }
}


export default UnorderedSmartMap;
