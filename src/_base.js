var chainer = function(funcs, result){
    var currentValue = funcs[0](result);
    funcs.shift();
    if(funcs.length > 0 && result !== '_stopChain') chainer(funcs, currentValue);
    return currentValue;
};

var addEvents = function(target, events, callback){
    if(events.constructor === String) {
        return target.addEventListener(events, function(e){
            callback(e);
        });   
    }
    return events.map(function(item){
        target.addEventListener(item, function(e){
            callback(e);
        });
    });
};