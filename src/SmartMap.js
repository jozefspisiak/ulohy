import React, { Component } from 'react';

//tk why react? V zadani nebolo nic o frontende, ulohou bolo spravit simple datovu classu. Toto plati aj na ine ulohy.
class SmartMap extends Component {
    constructor(props) {
        super(props);
        //tk skaredy mixing zodpovednosti - trieda sa stara o zobrazovanie aj logiku.
        this.storage = []; //tk polia s dierami maju cudnu semantiku a je lepsie namiesto nich pouzivat mapy.
    }

    set(coordinates, value) {

        if (this.storage[coordinates[0]] === undefined)
            this.storage[coordinates[0]] = [];

        this.storage[coordinates[0]][coordinates[1]] = value;
        return true; //tk remove this line
    }

    get(coordinates) {
        if (this.storage[coordinates[0]] !== undefined)
            return this.storage[coordinates[0]][coordinates[1]];
        
        return undefined;
    }

    run() {
        let sm = new SmartMap();
        sm.set([1, 2], 'foo')
        sm.set([2, 3], 'bar')
        //tk toto urcite nema byt metoda v ziadnej classe.
        console.log(sm.get([1, 2])) // returns 'foo'<br />
        console.log(sm.get([2, 1])) // returns undefined or throws 'key error'
    }
    
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>Smart Map</h1>
                </div>
                <p className="App-intro">
                    This code is executed. Check console log.
                    <br />
           //tk Pozor, this.run nema nabindovany this, funguje to len nahodou.
                    <button onClick={this.run}>
                        Run code
                    </button>
                </p>
                <pre>
                    sm = new SmartMap2(); <br />
                    sm.set([1, 2], 'foo') <br />
                    sm.set([2, 3], 'bar')<br />
                    console.log(sm.get([1, 2])) // returns 'foo'<br />
                    console.log(sm.get([2, 1])) // returns undefined or throws 'key error'
                </pre>
            </div>
        );
    }
}

export default SmartMap;
