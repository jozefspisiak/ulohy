var arr = []

for (var i = 0; i < 10; i++) {
  arr.push((function (val) { return function(val2) { return val2 + val; }})(i));
}

console.log(arr.map((f) => f(0)))
