import React from 'react';
import ReactDOM from 'react-dom';
import UnorderedSmartMap from './UnorderedSmartMap';

import { shallow } from 'enzyme';

it('renders UnorderedSmartMap', () => {
    const wrapper = shallow(<UnorderedSmartMap />);
    const textHeader = <h1>Unordered Smart Map</h1>;
    expect(wrapper.contains(textHeader)).toEqual(true);
});

it('returns undefined', () => {
    let sm = new UnorderedSmartMap();
    sm.set([1, 2], 'foo')
    sm.set([2, 3], 'bar')
    sm.set([100000001, 11000001], 'Nanannananananannananannanana')
    expect(sm.get([1, 3])).toEqual(undefined);
    expect(sm.get([1, 1])).toEqual(undefined);
    expect(sm.get([3, 3])).toEqual(undefined);
    expect(sm.get([100000001, 11000000])).toEqual(undefined);
});

it('returns correct value', () => {
    let sm = new UnorderedSmartMap();
    sm.set([1, 2], 'foo')
    sm.set([2, 3], 'bar')
    sm.set([100000001, 11000001], 'Nanannananananannananannanana')
    sm.set([100000001, 11000001], 'Banana')
    expect(sm.get([1, 2])).toEqual('foo');
    expect(sm.get([2, 1])).toEqual('foo');
    expect(sm.get([2, 3])).toEqual('bar');
    expect(sm.get([3, 2])).toEqual('bar');
    expect(sm.get([100000001, 11000001])).toEqual('Banana');
});