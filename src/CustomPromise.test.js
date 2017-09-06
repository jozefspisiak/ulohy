import CustomPromise from './CustomPromise';

it('returns first promise (race) - already resolved', () => {
  let resolvedPromisesArray = [Promise.resolve(33), Promise.resolve(44)]

  let p = CustomPromise.race(resolvedPromisesArray)
  return expect(p).resolves.toEqual(33)

})

it('returns first non-promise object resolved (race)', () => {
  let foreverPendingPromise = Promise.race([]);
  let alreadyResolvedProm = Promise.resolve(666);

  let arr = [foreverPendingPromise, "non-Promise value", Promise.resolve(666)];
  let p = CustomPromise.race(arr);

  return expect(p).resolves.toEqual("non-Promise value")
})


it('returns first resolved promise (race) with setTimeout', () => {
  let p1 = new Promise(function(resolve, reject) {
    setTimeout(resolve, 500, 'one');
  });
  let p2 = new Promise(function(resolve, reject) {
      setTimeout(resolve, 100, 'two');
  });

  let p = CustomPromise.race([p1, p2])
  return expect(p).resolves.toEqual('two')
})

it('returns array of values for all promises (all)', () => {
  let p1 = Promise.resolve(3);
  let p2 = 1337;
  let p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, 'foo');
  });

  let p = CustomPromise.all([p1, p2, p3])

  return expect(p).resolves.toEqual([3, 1337, "foo"])
})

it('returns rejected promise (all)', () => {
  let p = CustomPromise.all([1,2,3, Promise.reject(555)]);

  return expect(p).rejects.toEqual(555)
})

it('returns all values of resolved promises in different times (all)', () => {
  var p1 = new Promise((resolve, reject) => {
    setTimeout(resolve, 1000, 'one');
  });
  var p2 = new Promise((resolve, reject) => {
    setTimeout(resolve, 2000, 'two');
  });
  var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 3000, 'three');
  });

  let p = CustomPromise.all([p1,p2,p3])

  return expect(p).resolves.toEqual(['one','two','three'])
})
