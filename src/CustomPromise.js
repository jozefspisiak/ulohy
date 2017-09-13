export default class CustomPromise {
}

CustomPromise.all = (promises) => {
  return new Promise((resolveFunction, rejectFunction) => {
    const results = [];
    if (promises.length === 0)
      resolveFunction(results)

    let pending = promises.length
    promises.forEach((promise,index) => {
      // this is needed in case promise array doesn't contain promises
      if (Promise.resolve(promise) == promise)
        promise.then((result) => {
          results[index] = result
          pending--
          if (pending === 0)
            resolveFunction(results)
          },(error) =>
          rejectFunction(error)
        )
      else {
        results[index] = promise
        pending--
        if (pending === 0)
          resolveFunction(results)
      }
    })
  })
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
