var Promise = require("./promise");

var promise = new Promise(function (resolve, reject) {
    setTimeout(function () {
        resolve('val')
    }, 1000);
}).then(function (data) {
    console.log(data);
});

var promise1 = new Promise(function (resolve, reject) {
    var fs = require("fs");

    fs.readFile(__dirname + "/promise.js", "utf8", function (err, data) {
        if (err) {
            reject(err);
        } else {
            resolve(data);
        }
    });
}).then(function (data) {
    console.log(data);
});

