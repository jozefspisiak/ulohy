import SmartMap from './SmartMap';

sm = new SmartMap();
sm.set([1, 2], 'foo')
sm.set([2, 3], 'bar')
sm.get([1, 2]) // returns 'foo'
sm.get([2, 1]) // returns undefined or throws 'key error'
