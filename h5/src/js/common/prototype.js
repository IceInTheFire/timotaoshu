Array.prototype.insert = function(start, value) {
    this.splice(start, 0, value);
    return this;
}

Array.prototype.remove = function(value) {
    var index = this.indexOf(value);
    if(index != -1) {
        this.splice(index,1);
    }
    return this;
}

Array.prototype.removeArr = function(arr) {
    var i = 0, length = arr.length;
    for(i; i<length; i++) {
        this.remove(arr[i]);
    }
    return this;
}