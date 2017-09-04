import SmartMap from './SmartMap';

it('returns undefined', () => {
    let sm = new SmartMap();
    sm.set([1, 2], 'foo')
    sm.set([2, 3], 'bar')
    sm.set([100000001, 11000001], 'Nanannananananannananannanana')
    expect(sm.get([2, 1])).toEqual(undefined);
    expect(sm.get([1, 3])).toEqual(undefined);
    expect(sm.get([1, 1])).toEqual(undefined);
    expect(sm.get([3, 2])).toEqual(undefined);
    expect(sm.get([3, 3])).toEqual(undefined);
    expect(sm.get([100000001, 11000000])).toEqual(undefined);
});

it('returns correct value', () => {
    let sm = new SmartMap();
    sm.set([1, 2], 'foo')
    sm.set([2, 3], 'bar')
    sm.set([100000001, 11000001], 'Nanannananananannananannanana')
    sm.set([100000001, 11000001], 'Banana')
    expect(sm.get([1, 2])).toEqual('foo');
    expect(sm.get([2, 3])).toEqual('bar');
    expect(sm.get([100000001, 11000001])).toEqual('Banana');
});
