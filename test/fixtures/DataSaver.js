function DataSaver(someData) {
    this.someData = someData;
}

DataSaver.prototype.getData = function() {
    return this.someData;
};

module.exports = DataSaver;
