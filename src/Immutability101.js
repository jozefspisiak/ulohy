function enhance(readOnly) {
  const lodash = require('lodash')
  const res = lodash.cloneDeep(readOnly)
  res['0']['0'] = 'hello world'
  return res
}


function enhancedEnhance(readOnly) {
  return {...readOnly,0:{...readOnly[0],0:'hello world'}}
}

const o = {}
for (var i = 0; i < 1000; i++) {
  o[i] = {}
  for (var j = 0; j < 1000; j++) {
    o[i][j] = `${i}+${j}`
  }
}

var updated
console.time('enhance')

for (var i = 0; i < 100; i++) {
  updated = enhance(o)
}

console.timeEnd('enhance')


console.time('enhancedEnhance')

for (var i = 0; i < 100; i++) {
  var updated = enhancedEnhance(o)
}

console.timeEnd('enhancedEnhance')
