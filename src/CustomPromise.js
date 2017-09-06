export default class CustomPromise {
}

CustomPromise.all = (promises) => {
  const results = [];

  const merged = promises.reduce(
    (accumulator, promise) =>
      accumulator.
      then(() => promise).
      then(result => results.push(result)),
    Promise.resolve(null));

  return merged.then(() => results);
}

CustomPromise.race = (promises) => {
  return new Promise((resolveFunction, rejectFunction) => {
    promises.forEach(promise => {
      if (Promise.resolve(promise) == promise)
        promise.then(resolveFunction).catch(rejectFunction)
      else {
        resolveFunction(promise)
      }
    });
  });
}
