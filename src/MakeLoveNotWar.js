var arr = []

var increaseFunction = function increaseFunction(i) {
  arr.push(function (x) { return x + i; });
};

for (var i = 0; i < 10; i++) {
  increaseFunction(i);
}

console.log(arr.map((f) => f(0)))
