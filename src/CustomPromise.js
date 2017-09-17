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
      Promise.resolve(promise).then(
        (result) => {
          results[index] = result
          pending--
          if (pending === 0)
            resolveFunction(results)
        },
        (error) =>
          rejectFunction(error)
      )
    })
  })
}

CustomPromise.race = (promises) => {
  return new Promise((resolveFunction, rejectFunction) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolveFunction).catch(rejectFunction)
    });
  });
}
