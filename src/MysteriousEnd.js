
// we modify the prototype of Array creation and define extra function
Array.prototype.end=(function(){
    return function() {
        return this[this.length - 1]
    };
})();


// this function iterates array keys and since its prototype has an extra value defined, it will iterate it as well
for (var i in [1, 2, 3, 4]) {console.log(i)}

// and our new function is working :)
console.log([1,2,3,4,5].end())

// although according to the internet, this is quite bad idea
