
const PENDING = 0, FULLFILLED = 1, REJECTED = 2;

function Promise(resolver) {
    if (typeof resolver !== 'function')
        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
    if (!(this instanceof Promise)) 
        return new Promise(resolver);

    var promise = this;
    promise._value;
    promise._reason;
    promise._status = promise._status || PENDING;
    promise._callback;
    promise._errback;

    var resolve = function (val) {
        if (promise._status !== PENDING) {
            return;
        }
        setTimeout(function () {
            promise._status = FULLFILLED;
            var fn;
            if(fn = promise._callback){
                val = fn.call(promise, val) || val;
            }
            promise._value = val;
            promise._callback = promise._errback = undefined;
        });
    }

    var reject = function (reason) {
        if (promise._status !== PENDING) {
            return;
        }

        setTimeout(function () {
            promise._status = REJECTED;
            var fn;
            if(fn = promise._errback){
                reason = fn.call(promise, reason) || reason;
            }
            promise._reason = reason;
            promise._callback = promise._errback = undefined;
            return;
        });
    }
    resolver(resolve, reject);
}

//then function
Promise.prototype.then = function (onFullfilled, onRejected) {
    var promise = this;

    return new Promise(function (resolve, reject) {
        function callback(val) {
            var ret = typeof onFullfilled === 'function' && onFullfilled(val) || val;
            if (ret && ret["then"] && typeof ret.then === 'function') {
                ret.then(function (value) {
                    resolve(value);
                }, function (reason) {
                    reject(reason);
                });
            } else {
                resolve(ret);
            }
        }
        function errback(reason) {
            reject(reason);
        }

        if (promise._status === PENDING) {
            promise._callback = callback;
            promise._errback = errback;
        } else if (promise._status === FULLFILLED) {
            callback(promise._value);
        } else if (promise._status === REJECTED) {
            errback(promise._reason);
        }
    });

}

module.exports = exports = Promise;