Array.prototype.insert = function(start, value) {
    this.splice(start, 0, value);
    return this;
}

Array.prototype.remove = function(value) {
    let index = this.indexOf(value);
    if(index != -1) {
        this.splice(index,1);
    }
    return this;
}
Array.prototype.removeArr = function(arr) {
    let i = 0, length = arr.length;
    let thisLength = this.length;
    for(i; i<length; i++) {
        let that = this.remove(arr[i]);
        while(that.length != thisLength) {
            thisLength--;
            that = this.remove(arr[i]);
        }
    }
    return this;
}