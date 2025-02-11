module.exports = function(name) {
    var obj = { 'id': Math.floor(Math.random() * Math.floor(100)), "content": "Hello, " + (name === undefined ? "World" : name) + "!" };
    return obj;
};
